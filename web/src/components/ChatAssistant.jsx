import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot } from 'lucide-react';
import axios from 'axios';

export const ChatAssistant = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'system', content: "Hello! I'm your Agri 4.0 Assistant. How can I help you with your farming today? 🌱" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const [language, setLanguage] = useState('English');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Prepare history for context (exclude system welcome message from API call if desired, or keep it)
            // The backend handles system prompt, so we just send user/assistant history.
            const history = messages.filter(m => m.role !== 'system').map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await axios.post('/api/chat', {
                message: userMsg.content,
                history: history,
                language: language
            });

            const botMsg = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'system', content: "⚠️ Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-end md:justify-end bg-black/50 md:bg-transparent pointer-events-auto backdrop-blur-sm md:backdrop-blur-none transition-all duration-300">
            <div className="bg-white w-full h-[85dvh] md:w-80 md:h-[500px] md:max-h-[80vh] rounded-t-2xl md:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-up border border-green-100 mb-20 md:mb-2 md:mr-2">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white flex justify-between items-center shadow-lg shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Agri Assistant</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-green-100 font-medium">Online • Powered by AI</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-black/10 rounded-lg p-1 backdrop-blur-sm">
                            <button
                                onClick={() => {
                                    setLanguage('English');
                                    setMessages(prev => [...prev, { role: 'system', content: "Language switched to English 🇺🇸" }]);
                                }}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${language === 'English' ? 'bg-white text-green-700 shadow-sm' : 'text-white/70 hover:text-white'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => {
                                    setLanguage('Hindi');
                                    setMessages(prev => [...prev, { role: 'system', content: "भाषा हिंदी में बदल दी गई है 🇮🇳 (Language changed to Hindi)" }]);
                                }}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${language === 'Hindi' ? 'bg-white text-green-700 shadow-sm' : 'text-white/70 hover:text-white'}`}
                            >
                                HI
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="hover:bg-white/20 p-2 rounded-full transition-all active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative scroll-smooth">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-0 animate-fade-in">
                            <Bot className="w-12 h-12 mb-2" />
                            <p>Ask anything about farming!</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`flex items-end max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' :
                                    'bg-gradient-to-br from-green-500 to-green-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm ml-10">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 shrink-0 pb-safe">
                    <div className="flex gap-2 items-end bg-gray-50 border border-gray-200 rounded-[24px] p-1.5 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all shadow-sm">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-transparent px-4 py-2.5 outline-none text-gray-700 placeholder:text-gray-400 min-w-0"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-green-600 text-white p-2.5 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-90 flex-shrink-0"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                    <div className="text-[10px] text-center text-gray-400 mt-2">
                        AI can make mistakes. Verify important info.
                    </div>
                </form>
            </div>
        </div>
    );
};
