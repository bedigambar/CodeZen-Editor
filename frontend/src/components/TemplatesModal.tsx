import React from 'react';
import { Template, templates } from '../data/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            <h2 className="text-2xl font-bold text-white">Code Templates</h2>
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
            Choose a template to get started quickly. Your current code will be replaced.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 hover:border-purple-500 transition-all duration-300 cursor-pointer group hover:scale-105"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">
                    {template.name}
                  </h3>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {template.description}
                </p>
                <div className="flex gap-2 text-xs text-gray-500">
                  {template.html && <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded">HTML</span>}
                  {template.css && <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">CSS</span>}
                  {template.js && <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">JS</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
