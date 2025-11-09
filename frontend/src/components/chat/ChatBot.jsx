import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { sendChatMessage } from '../../services/chatService';
import { toast } from 'react-toastify';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            text: inputValue,
            isBot: false,
            timestamp: new Date()
        };

        const currentInput = inputValue;
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call backend API with Together AI
            const response = await sendChatMessage(currentInput, messages);

            if (response.success) {
                setMessages(prev => [...prev, {
                    text: response.message,
                    isBot: true,
                    timestamp: new Date(response.timestamp || new Date())
                }]);
            } else {
                throw new Error(response.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);

            // Check if it's a rate limit error
            const isRateLimitError = error.response?.status === 500 &&
                error.response?.data?.error?.includes('rate limit');

            // Fallback to local response if API fails
            const fallbackResponse = generateFallbackResponse(currentInput);
            setMessages(prev => [...prev, {
                text: fallbackResponse,
                isBot: true,
                timestamp: new Date()
            }]);

            // Show appropriate error message
            if (isRateLimitError) {
                toast.warning('AI đang bận. Tạm thời sử dụng chế độ offline.', {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            } else if (error.response?.status !== 500) {
                toast.error('Không thể kết nối với AI. Đang sử dụng chế độ offline.', {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            }
        } finally {
            setIsTyping(false);
        }
    };

    const generateFallbackResponse = (userInput) => {
        const input = userInput.toLowerCase();

        // Fallback responses when API is not available
        if (input.includes('sản phẩm') || input.includes('product')) {
            return 'Chúng tôi có nhiều sản phẩm chất lượng cao. Bạn có thể xem danh sách sản phẩm tại trang "Sản phẩm" hoặc cho tôi biết bạn đang tìm kiếm loại sản phẩm nào cụ thể?';
        } else if (input.includes('giá') || input.includes('price')) {
            return 'Giá cả của chúng tôi rất cạnh tranh. Vui lòng truy cập trang sản phẩm để xem giá chi tiết hoặc liên hệ với chúng tôi để được tư vấn.';
        } else if (input.includes('đặt hàng') || input.includes('order')) {
            return 'Để đặt hàng, bạn có thể thêm sản phẩm vào giỏ hàng và tiến hành thanh toán. Nếu cần hỗ trợ, hãy liên hệ với chúng tôi qua trang "Liên hệ".';
        } else if (input.includes('liên hệ') || input.includes('contact')) {
            return 'Bạn có thể liên hệ với chúng tôi qua trang "Liên hệ" hoặc gọi hotline: 1900-xxxx. Chúng tôi sẵn sàng hỗ trợ bạn!';
        } else if (input.includes('giờ') || input.includes('time')) {
            return 'Chúng tôi làm việc từ thứ 2 đến thứ 6, từ 8:00 sáng đến 17:00 chiều. Thứ 7 từ 8:00 đến 12:00.';
        } else if (input.includes('xin chào') || input.includes('hello') || input.includes('hi')) {
            return 'Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tôi giúp gì?';
        } else if (input.includes('cảm ơn') || input.includes('thank')) {
            return 'Rất vui được giúp đỡ bạn! Nếu có thêm câu hỏi, đừng ngần ngại hỏi nhé.';
        } else {
            return 'Cảm ơn bạn đã liên hệ! Tôi sẽ cố gắng hỗ trợ tốt nhất. Bạn có thể hỏi tôi về sản phẩm, giá cả, đặt hàng, hoặc thông tin liên hệ.';
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                className={`chat-button ${isOpen ? 'chat-button-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat với AI"
            >
                {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-header-content">
                            <FaRobot size={24} />
                            <div>
                                <h3>AI Assistant</h3>
                                <span className="status">
                                    <span className="status-dot"></span>
                                    Trực tuyến
                                </span>
                            </div>
                        </div>
                        <button
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Đóng chat"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}
                            >
                                {message.isBot && (
                                    <div className="message-avatar">
                                        <FaRobot size={20} />
                                    </div>
                                )}
                                <div className="message-content">
                                    <p>{message.text}</p>
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot-message">
                                <div className="message-avatar">
                                    <FaRobot size={20} />
                                </div>
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Nhập tin nhắn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="send-button"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            aria-label="Gửi tin nhắn"
                        >
                            <FaPaperPlane size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
