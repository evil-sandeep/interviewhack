import React from 'react';

const MicButton = ({ isListening, onClick, disabled }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        isListening 
          ? 'bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' 
          : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      {isListening && (
        <span className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping"></span>
      )}
      <svg className="w-6 h-6 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
};

export default MicButton;
