
import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, Mic, ThumbsUp, ThumbsDown, Copy, RotateCcw, Sparkles, BrainCircuit, PanelLeftOpen, Sun, Moon, ArrowUp } from 'lucide-react';
import { Message } from '../types';
import { Logo } from './Logo';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  toggleTheme: () => void;
  onToggleArtifacts: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping,
  toggleTheme,
  onToggleArtifacts,
  toggleSidebar,
  isSidebarOpen,
  theme
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleCopy = (content: string) => {
    const text = content.replace(/<[^>]*>?/gm, '');
    navigator.clipboard.writeText(text);
  };

  const SafeHTML = ({ html }: { html: string }) => (
    <div className="prose-medical" dangerouslySetInnerHTML={{ __html: html }} />
  );

  return (
    <div className="flex flex-col h-full w-full bg-bg-primary relative transition-colors duration-300">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border-subtle bg-bg-primary/80 backdrop-blur sticky top-0 z-20 transition-colors">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button 
              onClick={toggleSidebar} 
              className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-secondary transition-all"
              title="Open Sidebar"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <div className="hidden md:block">
            <h1 className="text-xs font-bold text-text-primary uppercase tracking-widest">Consultation</h1>
            <p className="text-[9px] text-text-secondary flex items-center gap-1 font-bold transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              SECURE SESSION
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto px-4 md:px-12 lg:px-24 ${messages.length === 0 ? 'py-0' : 'py-4'} space-y-4 custom-scrollbar`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center max-w-2xl mx-auto animate-fade-in pt-0 -mt-4">
            <div className="mb-2 opacity-90 hover:opacity-100 transition-opacity">
               <Logo className="w-24 h-24 sm:w-32 sm:h-32" />
            </div>
            <h2 className="text-xl font-display text-text-primary mb-2">Hello! How can I help?</h2>
            <p className="text-text-secondary mb-4 text-sm text-center max-w-md mx-auto transition-colors">
              I can help you explore Sujok therapy protocols and finding body correspondence points.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full px-4">
              {[
                { label: 'Relieve a Frontal Headache', icon: '🧠' },
                { label: 'Lower Back Pain Protocol', icon: '🦴' },
                { label: 'Reducing Anxiety & Stress', icon: '🍃' },
                { label: 'Digestive System Balance', icon: '🌀' }
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => onSendMessage(item.label)}
                  className="flex items-center gap-3 p-4 text-left rounded-xl border border-border-subtle bg-bg-surface hover:border-accent-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 animate-message-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-bg-secondary flex items-center justify-center mt-0.5 shadow-sm border border-border-subtle overflow-hidden">
                    <Logo className="w-12 h-12" />
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'assistant' && msg.isThinking && msg.thinkingContent && (
                    <details className="mb-2 w-full group overflow-hidden rounded-lg border border-border-subtle bg-bg-secondary/30 transition-colors">
                      <summary className="flex items-center gap-2 px-2 py-1.5 text-[9px] font-bold text-text-secondary uppercase tracking-widest cursor-pointer hover:text-accent-primary list-none transition-colors">
                        <BrainCircuit size={10} strokeWidth={1} className="text-accent-primary" />
                        Analysis
                      </summary>
                      <div className="px-3 pb-2 text-[11px] text-text-secondary italic leading-relaxed transition-colors">
                        {msg.thinkingContent}
                      </div>
                    </details>
                  )}

                  <div 
                    className={`
                      px-4 py-3 rounded-xl shadow-sm text-sm leading-relaxed transition-all
                      ${msg.role === 'user' 
                        ? 'bg-accent-primary text-white rounded-tr-none' 
                        : 'glass border border-border-subtle text-text-primary rounded-tl-none'}
                    `}
                  >
                    {msg.role === 'user' ? msg.content : <SafeHTML html={msg.content} />}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1.5 ml-0.5">
                      <button onClick={() => handleCopy(msg.content)} className="p-1 text-text-secondary hover:text-accent-primary rounded-md transition-colors" title="Copy">
                        <Copy size={12} />
                      </button>
                      <button className="p-1 text-text-secondary hover:text-accent-primary rounded-md transition-colors" title="Regenerate">
                        <RotateCcw size={12} />
                      </button>
                      <div className="h-2.5 w-[1px] bg-border-subtle mx-1"></div>
                      <button className="p-1 text-text-secondary hover:text-accent-secondary transition-colors"><ThumbsUp size={12} /></button>
                      <button className="p-1 text-text-secondary hover:text-red-500 transition-colors"><ThumbsDown size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-bg-secondary flex items-center justify-center shadow-sm border border-border-subtle overflow-hidden">
                  <Logo className="w-12 h-12" />
                </div>
                <div className="glass px-3 py-2.5 rounded-xl rounded-tl-none border border-border-subtle transition-colors flex items-center justify-center">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-accent-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent transition-all duration-300">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative group glass-strong rounded-2xl border border-border-subtle focus-within:ring-2 focus-within:ring-accent-primary/5 focus-within:border-accent-primary/30 transition-all shadow-lg">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Sujok treatment..."
              className="w-full bg-transparent border-none text-text-primary placeholder:text-text-secondary/40 px-4 py-3.5 pr-14 resize-none max-h-[160px] outline-none focus:outline-none focus:ring-0 text-sm transition-colors"
              rows={1}
            />
            
            <div className="flex items-center justify-between px-2 pb-2">
               <div className="flex items-center gap-0.5">
                  <button className="p-2 text-text-secondary hover:text-accent-primary rounded-lg hover:bg-bg-secondary transition-colors"><Paperclip size={16} /></button>
                  <button className="p-2 text-text-secondary hover:text-accent-primary rounded-lg hover:bg-bg-secondary transition-colors"><Mic size={16} /></button>
               </div>

               <div className="flex items-center gap-2">
                 <button 
                   onClick={handleSend}
                   disabled={!input.trim()}
                   className={`
                     w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 
                     ${input.trim() 
                       ? 'bg-accent-primary text-white shadow-md hover:brightness-110 active:scale-95' 
                       : 'bg-bg-secondary text-text-secondary/20 cursor-not-allowed'}
                   `}
                 >
                   <ArrowUp size={11} strokeWidth={2.5} />
                 </button>
               </div>
            </div>
          </div>
          <div className="text-center mt-3">
             <span className="text-[9px] text-text-secondary/40 font-bold uppercase tracking-wider">
               NOT MEDICAL ADVICE - CONSULT A PROFESSIONAL
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
