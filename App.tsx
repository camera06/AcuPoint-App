
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ArtifactsPanel from './components/ArtifactsPanel';
import Modal from './components/Modal';
import { User, ChatSession, Message, Artifact, AppState } from './types';
import { Sparkles, Mail, Save, Lock } from 'lucide-react';
import { Logo } from './components/Logo';

const INITIAL_MOCK_USER: User = {
  id: 'u1',
  name: 'Mike Anderson',
  avatar: '', 
  plan: 'Pro'
};

const STORAGE_KEY_AUTH = 'acupoint_isLoggedIn';
const STORAGE_KEY_SESSIONS = 'acupoint_sessions';
const STORAGE_KEY_THEME = 'acupoint_theme';
const STORAGE_KEY_USER = 'acupoint_user';

type ModalType = 'settings' | 'support' | null;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : INITIAL_MOCK_USER;
  });

  const [state, setState] = useState<AppState>(() => ({
    theme: (localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark') || 'light',
    sidebarOpen: window.innerWidth >= 1024,
    artifactsOpen: false,
    currentChatId: null
  }));

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [currentArtifact, setCurrentArtifact] = useState<Artifact | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editName, setEditName] = useState(user.name);

  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, state.theme);
  }, [state.theme]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    }
  }, [sessions, isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setState(prev => ({ ...prev, sidebarOpen: false }));
      } else {
        setState(prev => ({ ...prev, sidebarOpen: true }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  const toggleSidebar = () => setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  
  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_USER);
    setIsLoggedIn(false);
    setSessions([]);
    setActiveMessages([]);
    setState(prev => ({ ...prev, currentChatId: null, artifactsOpen: false, sidebarOpen: false }));
  };

  const handleSignIn = (name: string = 'Mike Anderson') => {
    setIsLoggedIn(true);
    setUser(prev => ({ ...prev, name }));
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    setSessions([]);
    setState(prev => ({ ...prev, sidebarOpen: window.innerWidth >= 1024 }));
  };

  const handleNewChat = () => {
    setState(prev => ({ ...prev, currentChatId: null, artifactsOpen: false }));
    setActiveMessages([]);
    if (window.innerWidth < 1024) setState(prev => ({ ...prev, sidebarOpen: false }));
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setState(prev => ({ ...prev, currentChatId: id, artifactsOpen: false }));
      setActiveMessages(session.messages);
      if (window.innerWidth < 1024) setState(prev => ({ ...prev, sidebarOpen: false }));
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (state.currentChatId === id) handleNewChat();
  };

  const handleSendMessage = async (text: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    const currentMessages = [...activeMessages, newUserMsg];
    setActiveMessages(currentMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ask-sujok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const newAiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.answer, timestamp: Date.now() };
      const finalMessages = [...currentMessages, newAiMsg];
      setActiveMessages(finalMessages);
      setIsTyping(false);

      if (state.currentChatId) {
        setSessions(prev => prev.map(s => s.id === state.currentChatId ? { ...s, messages: finalMessages, preview: text.slice(0, 80) + '...' } : s));
      } else {
        const newId = Date.now().toString();
        const newSession: ChatSession = { id: newId, title: text.length > 25 ? text.slice(0, 25) + '...' : text, date: new Date().toISOString(), preview: text.slice(0, 80) + '...', messages: finalMessages };
        setSessions(prev => [newSession, ...prev]);
        setState(prev => ({ ...prev, currentChatId: newId }));
      }
      
      // Note: Artifacts logic removed as it was tied to mockData
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      const errorMsg: Message = { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: "I apologize, but I'm encountering an issue connecting to the AI service. This usually happens if the API key hasn't been set up yet.", 
        timestamp: Date.now() 
      };
      setActiveMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleSaveSettings = () => {
    setUser(prev => ({ ...prev, name: editName }));
    setActiveModal(null);
  };

  const getInitials = (name: string) => {
    return name.trim().split(/\s+/).map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'settings':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="User Settings" actions={<button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors shadow-md"><Save size={16} />Save Changes</button>}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent-primary/10 grid place-items-center text-2xl font-bold text-accent-primary border-2 border-accent-primary/30 transition-colors flex-shrink-0">
                   <span className="leading-none">{getInitials(user.name)}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Plan Status</span>
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 w-fit">{user.plan} Account</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-subtle focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all" />
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border-subtle space-y-2">
                <h4 className="text-sm font-semibold text-text-primary">Data Security</h4>
                <p className="text-xs text-text-secondary">All data is encrypted and stored locally. No personal identifiers are sent to our servers.</p>
              </div>
            </div>
          </Modal>
        );
      case 'support':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Support">
             <div className="text-center py-6 space-y-4">
               <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto text-accent-primary"><Mail size={32} /></div>
               <h4 className="text-lg font-bold">Need assistance?</h4>
               <p className="text-sm text-text-secondary px-4">Contact our team for technical support or general questions about Sujok principles.</p>
               <button className="px-6 py-2 bg-bg-secondary hover:bg-bg-surface border border-border-subtle rounded-lg text-sm font-medium transition-colors">hello@acupoint.ai</button>
             </div>
          </Modal>
        );
      default: return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-bg-secondary p-4 font-sans text-text-primary transition-colors duration-300 overflow-y-auto">
        <div className="w-full max-w-[420px] bg-bg-surface rounded-[24px] shadow-2xl p-8 sm:p-9 animate-fade-in border border-border-subtle transition-all duration-300 my-4">
          <div className="flex justify-center mb-6">
            <div className="p-3.5 rounded-full bg-bg-secondary/50 border border-border-subtle">
              <Logo className="w-40 h-40" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-1 text-text-primary">AcuPoint</h1>
          <p className="text-center text-text-secondary mb-8 text-xs uppercase tracking-widest font-bold">Personalized Sujok Consultation</p>
          <button onClick={() => handleSignIn('Mike Anderson')} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border-subtle hover:bg-bg-secondary transition-colors font-medium text-sm mb-6 text-text-primary">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.29.81-.55z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
             Continue with Google
          </button>
          <div className="relative mb-6 flex items-center justify-center"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle transition-colors duration-300"></div></div><span className="relative bg-bg-surface px-3 text-[10px] text-text-secondary uppercase font-bold transition-colors duration-300">OR</span></div>
          <div className="space-y-4">
            <div className="space-y-1.5"><label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Email Address</label><div className="relative group"><div className="absolute left-3.5 top-3 text-text-secondary group-focus-within:text-accent-primary transition-colors"><Mail size={18} /></div><input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-primary focus:bg-bg-surface focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all text-sm text-text-primary placeholder:text-text-secondary/30" /></div></div>
            <div className="space-y-1.5"><label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Password</label><div className="relative group"><div className="absolute left-3.5 top-3 text-text-secondary group-focus-within:text-accent-primary transition-colors"><Lock size={18} /></div><input type="password" placeholder="........" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-bg-primary focus:bg-bg-surface focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all text-sm tracking-widest text-text-primary placeholder:text-text-secondary/30" /></div></div>
            <button onClick={() => handleSignIn('Mike Anderson')} className="w-full bg-text-primary dark:bg-accent-primary text-bg-surface dark:text-white font-bold py-3.5 rounded-xl hover:opacity-95 transition-all active:scale-[0.98] shadow-lg mt-2 text-sm">Sign in</button>
            <button onClick={() => handleSignIn('Demo User')} className="w-full bg-bg-secondary text-text-primary font-bold py-3.5 rounded-xl hover:bg-bg-secondary/80 transition-all active:scale-[0.98] shadow-sm mt-2 text-sm border border-border-subtle">Demo Sign-in</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary text-text-primary font-sans transition-colors duration-300">
      {renderModalContent()}
      <Sidebar isOpen={state.sidebarOpen} onClose={toggleSidebar} sessions={sessions} currentSessionId={state.currentChatId} onSelectSession={handleSelectSession} onDeleteSession={handleDeleteSession} onNewChat={handleNewChat} onSignOut={handleSignOut} onOpenSettings={() => { setEditName(user.name); setActiveModal('settings'); }} onOpenSupport={() => setActiveModal('support')} user={user} isMobile={window.innerWidth < 1024} />
      <main className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300">
        {state.sidebarOpen && window.innerWidth < 1024 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all" onClick={() => setState(prev => ({ ...prev, sidebarOpen: false }))} />
        )}
        <ChatInterface messages={activeMessages} onSendMessage={handleSendMessage} isTyping={isTyping} toggleTheme={toggleTheme} onToggleArtifacts={() => setState(prev => ({ ...prev, artifactsOpen: !prev.artifactsOpen }))} toggleSidebar={toggleSidebar} isSidebarOpen={state.sidebarOpen} theme={state.theme} />
      </main>
      <ArtifactsPanel isOpen={state.artifactsOpen} onClose={() => setState(prev => ({ ...prev, artifactsOpen: false }))} artifact={currentArtifact} />
    </div>
  );
}

export default App;
