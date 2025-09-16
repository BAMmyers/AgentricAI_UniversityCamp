import React from 'react';
import { ProposedChanges } from '../types/index';
import { XMarkIcon } from './icons';

interface DiffViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  changes: ProposedChanges | null;
}

const DiffViewModal: React.FC<DiffViewModalProps> = ({ isOpen, onClose, onApprove, changes }) => {
  if (!isOpen || !changes) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-brand-border">
          <div>
            <h2 className="text-xl font-bold text-white">Review Code Changes</h2>
            <p className="text-sm text-brand-text-secondary">{changes.summary}</p>
          </div>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
        </header>
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {changes.changes.map((change, index) => (
            <div key={index} className="border border-brand-border rounded-lg overflow-hidden">
              <div className="bg-brand-light-gray p-2 font-mono text-sm text-brand-cyan">{change.filePath}</div>
              <div className="p-4 bg-brand-dark">
                <pre className="text-xs text-brand-text whitespace-pre-wrap font-mono">{change.modifiedContent}</pre>
              </div>
            </div>
          ))}
        </main>
        <footer className="p-4 border-t border-brand-border flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-brand-light-gray rounded-md text-sm font-semibold hover:bg-brand-border">Cancel</button>
            <button onClick={onApprove} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold">Approve & Apply Changes</button>
        </footer>
      </div>
    </div>
  );
};

export default DiffViewModal;
