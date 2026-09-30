import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, RotateCcw, ArrowRight } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { AIChatMessage } from './AIChatMessage';
import { useProducts } from '../../context/ProductContext';

export const AIAssistant = ({ isOpen, setIsOpen }) => {
  const { products } = useProducts();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Namaste! 🙏 I’m Vasudha AI, your personal ethnic stylist. Tell me what occasion you're shopping for, your preferred budget, or your size, and I will curate the perfect luxury styles for you.",
      timestamp: '12:00 PM',
      products: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "Find a wedding outfit under ₹3000",
    "Show me sarees under ₹2000",
    "What is available in size M?",
    "What should I wear for a festive event?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.ask(text, messages, products);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        products: response.products || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I encountered a slight network pause. Please feel free to ask again or browse our collections.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          products: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: "Namaste! 🙏 Tell me what you're looking for and I'll find your perfect royal ensemble.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: []
      }
    ]);
  };

  return (
    <>
      {/* Floating Widget Trigger (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#0C3B10] text-[#DBAB7D] border-2 border-[#DBAB7D] shadow-luxury-lg hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all duration-300 transform hover:scale-105"
          aria-label="Open Vasudha AI Assistant"
        >
          {/* Subtle gold glow pulse */}
          <span className="absolute -inset-1 bg-[#DBAB7D] opacity-30 blur-md rounded-none group-hover:opacity-60 transition-opacity animate-pulse" />

          <div className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#DBAB7D] group-hover:text-[#0C3B10] transition-colors animate-pulse-subtle" />
            <span className="font-serif font-bold text-sm tracking-wider uppercase">
              ✨ Vasudha AI
            </span>
          </div>

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DBAB7D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </button>
      </div>

      {/* AI Assistant Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[130] animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FFFFFF] shadow-2xl z-10 flex flex-col justify-between border-l border-[#DBAB7D]/40 animate-slide-left">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#0C3B10] text-[#FFFFFF] border-b border-[#DBAB7D]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Vasudha AI" 
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[#DBAB7D] bg-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#FFFFFF] tracking-wider">
                      Vasudha AI
                    </h3>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] text-[#DBAB7D] tracking-wide font-light">
                    Your personal ethnic style assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="text-white/70 hover:text-[#DBAB7D] p-1.5 transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white p-1.5 transition-colors"
                  aria-label="Close Assistant"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#FAF7F2]/50">
              {messages.map((msg) => (
                <AIChatMessage
                  key={msg.id}
                  message={msg}
                  onCloseDrawer={() => setIsOpen(false)}
                />
              ))}

              {isLoading && (
                <div className="flex gap-3 items-center text-xs text-[#0C3B10] bg-[#FAF7F2] p-3 border border-[#DBAB7D]/30 w-max mb-4 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#DBAB7D] animate-spin" />
                  <span>Curating heirloom styles for you...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="p-3 bg-white border-t border-[#0C3B10]/10 overflow-x-auto">
              <div className="text-[10px] text-[#666666] uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                <span>Try asking:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 bg-[#FAF7F2] border border-[#0C3B10]/15 hover:border-[#DBAB7D] hover:bg-[#0C3B10] hover:text-[#FFFFFF] text-[#0C3B10] transition-colors rounded-none text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-[#0C3B10]/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask for wedding outfits, sarees, sizes, or budget..."
                  className="flex-1 bg-[#FAF7F2] border border-[#0C3B10]/20 text-[#1A1A1A] placeholder:text-[#666666]/60 text-xs sm:text-sm px-4 py-3 focus:outline-none focus:border-[#0C3B10] font-normal"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 bg-[#0C3B10] text-[#DBAB7D] hover:bg-[#DBAB7D] hover:text-[#0C3B10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-[10px] text-center text-gray-400 mt-2">
                Powered by Vasudha AI Engine • Connected to live boutique inventory
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
