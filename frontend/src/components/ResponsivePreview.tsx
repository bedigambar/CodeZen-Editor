import React from 'react';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop' | 'fullwidth';

interface ResponsivePreviewProps {
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  output: string;
}

const deviceSizes = {
  mobile: { width: 375, height: 667, icon: 'fa-mobile-screen' },
  tablet: { width: 768, height: 1024, icon: 'fa-tablet-screen-button' },
  desktop: { width: 1440, height: 900, icon: 'fa-desktop' },
  fullwidth: { width: '100%', height: 500, icon: 'fa-expand' },
};

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  deviceMode,
  onDeviceModeChange,
  output,
}) => {
  const currentDevice = deviceSizes[deviceMode];

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-2 text-white font-semibold">
          <i className="fa-solid fa-eye"></i>
          <span>Live Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          {(Object.keys(deviceSizes) as DeviceMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onDeviceModeChange(mode)}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                deviceMode === mode
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={mode.charAt(0).toUpperCase() + mode.slice(1)}
            >
              <i className={`fa-solid ${deviceSizes[mode].icon}`}></i>
              <span className="ml-2 hidden md:inline capitalize">{mode}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 flex justify-center items-start min-h-[500px]">
        <div
          className={`${
            deviceMode === 'fullwidth' ? 'w-full' : ''
          } transition-all duration-300 ${
            deviceMode !== 'fullwidth' ? 'shadow-2xl border-8 border-gray-900 rounded-lg' : ''
          }`}
          style={{
            width: deviceMode !== 'fullwidth' ? `${currentDevice.width}px` : '100%',
            maxWidth: '100%',
          }}
        >
          {deviceMode !== 'fullwidth' && (
            <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 text-xs text-gray-400">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="ml-2">
                {currentDevice.width} x {currentDevice.height}
              </span>
            </div>
          )}
          <iframe
            srcDoc={output}
            title="output"
            sandbox="allow-scripts"
            className="w-full bg-white"
            style={{
              height: deviceMode !== 'fullwidth' ? `${currentDevice.height}px` : '500px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsivePreview;
