<?php
// app/controllers/ChatBotController.php

class ChatBotController
{
    /**
     * Send message to Together AI and get response
     */
    public function sendMessage()
    {
        // Set response headers
        header('Content-Type: application/json; charset=utf-8');

        try {
            // Get request body
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Log incoming request for debugging
            error_log('ChatBot Request received: ' . json_encode([
                'message' => isset($input['message']) ? substr($input['message'], 0, 50) : 'N/A',
                'history_count' => isset($input['history']) ? count($input['history']) : 0
            ]));
            
            if (!isset($input['message']) || empty(trim($input['message']))) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Message is required'
                ]);
                return;
            }

            $userMessage = trim($input['message']);
            $conversationHistory = $input['history'] ?? [];

            // Get Together AI API key from environment or config
            $apiKey = $_ENV['TOGETHER_AI_API_KEY'] ?? '';
            
            error_log('Together AI API Key present: ' . (!empty($apiKey) ? 'YES' : 'NO'));
            
            if (empty($apiKey)) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Together AI API key not configured'
                ]);
                return;
            }

            // Prepare messages for Together AI
            $messages = [
                [
                    'role' => 'system',
                    'content' => 'You are a helpful customer service assistant for an e-commerce website. Answer questions about products, orders, pricing, shipping, and general inquiries. Be polite, concise, and helpful. Respond in Vietnamese if the user writes in Vietnamese, otherwise respond in English.'
                ]
            ];

            // Add conversation history
            foreach ($conversationHistory as $msg) {
                $messages[] = [
                    'role' => $msg['isBot'] ? 'assistant' : 'user',
                    'content' => $msg['text']
                ];
            }

            // Add current message
            $messages[] = [
                'role' => 'user',
                'content' => $userMessage
            ];

            // Call Together AI API
            error_log('Calling Together AI with ' . count($messages) . ' messages');
            $response = $this->callTogetherAI($apiKey, $messages);
            error_log('Together AI Response: ' . json_encode([
                'success' => $response['success'],
                'has_message' => isset($response['message']),
                'has_error' => isset($response['error'])
            ]));

            if ($response['success']) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => $response['message'],
                    'timestamp' => date('c')
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => $response['error']
                ]);
            }

        } catch (Exception $e) {
            error_log('ChatBot Controller Exception: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Server error: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Call Together AI API
     */
    private function callTogetherAI($apiKey, $messages)
    {
        $url = 'https://api.together.xyz/v1/chat/completions';
        
        // Get model from environment or use default
        $model = $_ENV['TOGETHER_MODEL'] ?? 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free';
        
        error_log('Together AI Request: Model=' . $model . ', Messages=' . count($messages));
        
        $data = [
            'model' => $model,
            'messages' => $messages,
            'max_tokens' => 512,
            'temperature' => 0.7,
            'top_p' => 0.7,
            'top_k' => 50,
            'repetition_penalty' => 1,
            'stop' => ['<|eot_id|>', '<|eom_id|>']
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60); // Set timeout to 60 seconds for Together AI
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15); // Connection timeout
        // Note: In production, you should have proper SSL certificates configured
        // For development/testing, you may need to disable SSL verification
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        
        // Enable verbose output for debugging
        curl_setopt($ch, CURLOPT_VERBOSE, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        error_log('Together AI Response: HTTP ' . $httpCode . ($error ? ' Error: ' . $error : ''));

        if ($error) {
            error_log('Together AI CURL Error: ' . $error);
            return [
                'success' => false,
                'error' => 'Connection error: ' . $error
            ];
        }

        if ($httpCode !== 200) {
            $responseData = json_decode($response, true);
            $errorMsg = 'Unknown error';
            
            if (isset($responseData['error']['message'])) {
                $errorMsg = $responseData['error']['message'];
            } elseif (isset($responseData['error'])) {
                $errorMsg = is_array($responseData['error']) ? json_encode($responseData['error']) : $responseData['error'];
            }
            
            error_log('Together AI API Error (HTTP ' . $httpCode . '): ' . $errorMsg);
            error_log('Response: ' . $response);
            
            // Check if it's a rate limit error (429)
            if ($httpCode === 429) {
                return [
                    'success' => false,
                    'error' => 'AI is temporarily busy. Please try again in a moment.',
                    'rate_limit' => true
                ];
            }
            
            return [
                'success' => false,
                'error' => 'API error (HTTP ' . $httpCode . '): ' . $errorMsg
            ];
        }

        $responseData = json_decode($response, true);
        
        if (isset($responseData['choices'][0]['message']['content'])) {
            return [
                'success' => true,
                'message' => trim($responseData['choices'][0]['message']['content'])
            ];
        }

        return [
            'success' => false,
            'error' => 'Invalid response from AI'
        ];
    }

    /**
     * Get available AI models
     */
    public function getModels()
    {
        header('Content-Type: application/json; charset=utf-8');
        
        echo json_encode([
            'success' => true,
            'current_model' => $_ENV['TOGETHER_MODEL'] ?? 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
            'models' => [
                [
                    'id' => 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
                    'name' => 'Llama 3.3 70B Instruct Turbo (Free)',
                    'description' => 'Latest free model - powerful and fast'
                ],
                [
                    'id' => 'meta-llama/Llama-3-8b-chat-hf',
                    'name' => 'Llama 3 8B Chat',
                    'description' => 'Fast and efficient for general conversations'
                ],
                [
                    'id' => 'meta-llama/Llama-3-70b-chat-hf',
                    'name' => 'Llama 3 70B Chat',
                    'description' => 'More powerful, better reasoning'
                ],
                [
                    'id' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
                    'name' => 'Mixtral 8x7B',
                    'description' => 'Good balance of speed and quality'
                ]
            ]
        ]);
    }
}
