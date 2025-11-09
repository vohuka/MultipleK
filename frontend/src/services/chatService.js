// services/chatService.js
import api from "./api";

/**
 * Send message to chatbot API
 * @param {string} message - User message
 * @param {Array} history - Conversation history
 * @returns {Promise} Response from API
 */
export const sendChatMessage = async (message, history = []) => {
    try {
        const response = await api.post("/chatbot/message", {
            message,
            history: history.slice(-10), // Send only last 10 messages for context
        });
        return response.data;
    } catch (error) {
        console.error("Chat service error:", error);
        // Log more details about the error
        if (error.response) {
            console.error("Response error:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error setting up request:", error.message);
        }
        throw error;
    }
};

/**
 * Get available AI models
 * @returns {Promise} List of available models
 */
export const getAvailableModels = async () => {
    try {
        const response = await api.get("/chatbot/models");
        return response.data;
    } catch (error) {
        console.error("Error fetching models:", error);
        throw error;
    }
};

export default {
    sendChatMessage,
    getAvailableModels,
};
