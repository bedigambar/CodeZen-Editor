import React from 'react';

interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

interface ConsoleOutputProps {
  logs: ConsoleLog[];
  isVisible: boolean;
  onToggle: () => void;
  onClear: () => void;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ logs, isVisible, onToggle, onClear }) => {
  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'error':
        return { icon: 'fa-circle-xmark', color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'warn':
        return { icon: 'fa-triangle-exclamation', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'info':
        return { icon: 'fa-circle-info', color: 'text-blue-400', bg: 'bg-blue-500/10' };
      default:
        return { icon: 'fa-circle-check', color: 'text-green-400', bg: 'bg-green-500/10' };
    }
  };

  return (
    <div className="w-full">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="text-white hover:text-primary-400 transition-colors"
            title={isVisible ? 'Hide Console' : 'Show Console'}
          >
            <i className={`fa-solid ${isVisible ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
          </button>
          <div className="flex items-center gap-2 text-white font-semibold">
            <i className="fa-solid fa-terminal"></i>
            <span>Console</span>
            {logs.length > 0 && (
              <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                {logs.length}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-white rounded transition-colors flex items-center gap-1"
          title="Clear Console"
        >
          <i className="fa-solid fa-trash-can"></i> Clear
        </button>
      </div>

      {/* Console Content */}
      {isVisible && (
        <div className="bg-gray-900 p-4 max-h-48 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              <i className="fa-solid fa-inbox text-2xl mb-2"></i>
              <p>Console is empty. Run your JavaScript code to see output.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => {
                const { icon, color, bg } = getIconAndColor(log.type);
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2 p-2 rounded ${bg} border-l-2 ${color.replace('text-', 'border-')}`}
                  >
                    <i className={`fa-solid ${icon} ${color} mt-1`}></i>
                    <div className="flex-1">
                      <p className="text-gray-200 break-all">{log.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsoleOutput;
