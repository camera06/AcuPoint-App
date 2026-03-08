
import React, { useState } from 'react';
import { Plus, MessageSquare, LogOut, ChevronLeft, Trash2, HelpCircle, Settings, PanelLeftClose, Check, X } from 'lucide-react';
import { ChatSession, User } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewChat: () => void;
  onSignOut: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  user: User;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onDeleteSession,
  onNewChat,
  onSignOut,
  onOpenSettings,
  onOpenSupport,
  user,
  isMobile
}) => {
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  if (!isOpen && isMobile) return null;

  // Grouping logic
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

  const groups = sessions.reduce((acc: any, session) => {
    const date = new Date(session.date).toLocaleDateString();
    let group = 'Older';
    if (date === today) group = 'Today';
    else if (date === yesterday) group = 'Yesterday';
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(session);
    return acc;
  }, {});

  const groupOrder = ['Today', 'Yesterday', 'Older'];

  // Helper for initials - Bob Big -> BB
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 flex flex-col w-[240px] 
      bg-bg-secondary border-r border-border-subtle
      transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 md:static md:h-full
      ${!isOpen && !isMobile ? 'hidden' : 'flex'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 h-14">
        <div className="flex items-center gap-2">
          <Logo className="w-14 h-14" />
          <span className="text-heading text-base leading-tight tracking-tight text-text-primary">AcuPoint</span>
        </div>
        <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-primary transition-colors">
          {isMobile ? <ChevronLeft size={18} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Primary Actions */}
      <div className="px-3 py-1">
        <button 
          onClick={onNewChat}
          className="w-full h-9 flex items-center justify-center gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary hover:brightness-105 text-white font-medium rounded-lg shadow-md shadow-accent-primary/10 transition-all active:scale-[0.98]"
        >
          <Plus size={16} />
          <span className="text-xs">New Session</span>
        </button>
      </div>

      {/* Main Nav */}
      <div className="px-2 py-3 space-y-0.5 border-b border-border-subtle">
        <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-text-primary bg-bg-surface shadow-sm border border-border-subtle rounded-lg transition-all">
          <MessageSquare size={14} className="text-accent-primary" />
          <span>My Conversations</span>
        </button>
      </div>

      {/* History Grouped by Date */}
      <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
        {groupOrder.map(group => groups[group] && (
          <div key={group} className="mb-4">
            <div className="text-[9px] font-bold text-text-secondary/70 mb-1.5 px-3 uppercase tracking-[0.1em]">{group}</div>
            <div className="space-y-0.5">
              {groups[group].map((session: ChatSession) => (
                <div key={session.id} className="relative group">
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-xs transition-all pr-8
                      ${currentSessionId === session.id 
                        ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle' 
                        : 'text-text-secondary hover:bg-bg-surface/50 hover:text-text-primary'}
                    `}
                  >
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-[9px] opacity-60 mt-0.5 font-medium truncate">
                      {session.preview || 'New consultation'}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-500 transition-all rounded-md hover:bg-red-500/10"
                    title="Archive"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Profile */}
      <div className="mt-auto p-3 border-t border-border-subtle bg-bg-secondary/50">
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-bg-surface transition-all cursor-pointer group border border-transparent hover:border-border-subtle"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-accent-primary/10 grid place-items-center text-[10px] font-bold text-accent-primary border border-accent-primary/30 transition-colors flex-shrink-0">
              <span className="leading-none">{getInitials(user.name)}</span>
            </div>
            {/* Status dot with background-matching border to look seamless */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-bg-secondary rounded-full shadow-sm"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-text-primary truncate">{user.name}</div>
            <div className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">{user.plan}</div>
          </div>
          <Settings size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex items-center justify-between mt-2 px-1 relative">
          {!isConfirmingLogout ? (
            <>
              <button 
                onClick={onOpenSupport}
                className="flex items-center gap-1.5 text-[10px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <HelpCircle size={12} />
                Support
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingLogout(true);
                }}
                className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all" 
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full animate-fade-in bg-red-500/5 p-1 rounded-lg border border-red-500/10">
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-1">Log out?</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSignOut();
                  }}
                  className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm"
                  title="Confirm Sign Out"
                >
                  <Check size={12} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsConfirmingLogout(false);
                  }}
                  className="p-1.5 text-text-secondary hover:bg-bg-primary rounded-md transition-colors"
                  title="Cancel"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
