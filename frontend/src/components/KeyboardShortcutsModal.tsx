import React from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F11', description: 'Toggle Fullscreen Mode' },
    { key: 'Esc', description: 'Exit Fullscreen Mode' },
    { key: '? or Ctrl + /', description: 'Show Keyboard Shortcuts' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⌨️</span>
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <p className="text-gray-300 mb-6 text-center">
            Use these keyboard shortcuts to boost your productivity
          </p>

          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-all duration-300"
              >
                <span className="text-gray-300 text-base">{shortcut.description}</span>
                <kbd className="px-3 py-2 bg-gray-700 text-white rounded-lg font-mono text-sm border border-gray-600 shadow-md">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-300 text-sm flex items-center gap-2">
              <i className="fa-solid fa-info-circle"></i>
              <span>Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">?</kbd> anytime to view this panel</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
