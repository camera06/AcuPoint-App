export interface User {
  id: string;
  name: string;
  avatar: string; // Kept for type compatibility, but will be ignored in UI for initials
  plan: 'Free' | 'Pro' | 'Clinic';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isThinking?: boolean;
  thinkingContent?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  date: string; // ISO date string
  preview: string;
  messages: Message[];
}

export interface Artifact {
  id: string;
  title: string;
  type: 'protocol' | 'diagram' | 'code' | 'text';
  content: string;
}

export interface AppState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  artifactsOpen: boolean;
  currentChatId: string | null;
}