import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-[60] animate-slide-up">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md
        ${type === 'success' 
          ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
          : 'bg-bg-surface/90 border-border-subtle text-text-primary'}
      `}>
        {type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;