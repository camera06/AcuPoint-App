import React from 'react';
import { X, Copy, Maximize2 } from 'lucide-react';
import { Artifact } from '../types';

interface ArtifactsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  artifact: Artifact | null;
}

const ArtifactsPanel: React.FC<ArtifactsPanelProps> = ({ isOpen, onClose, artifact }) => {
  return (
    <div className={`
      fixed inset-y-0 right-0 z-30 w-full md:w-[450px] lg:w-[500px]
      bg-bg-surface border-l border-border-subtle shadow-2xl
      transform transition-all duration-300 ease-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border-subtle bg-bg-surface/95 backdrop-blur">
        <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Reference Material
        </span>
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-primary transition-colors">
            <Copy size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-6">
        {artifact ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                <Maximize2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-text-primary leading-tight">
                {artifact.title}
              </h2>
            </div>
            
            <div className="prose prose-invert max-w-none text-text-primary">
              <div className="p-4 bg-bg-primary rounded-xl border border-border-subtle font-mono text-sm whitespace-pre-wrap">
                {artifact.content}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text-secondary">
            <p>Select a protocol to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactsPanel;