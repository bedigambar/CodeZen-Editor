import React from 'react';
import { ConfirmModalProps } from '../types';

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  icon,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100 animate-fade-in">
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-300 text-base leading-relaxed mb-6">{message}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
