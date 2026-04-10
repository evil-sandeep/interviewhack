import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const ChatInput = () => {
  const { isRecording, setIsRecording } = useAppContext();
  const [text, setText] = useState("");

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="w-full mt-auto pt-6 pb-2">
      <div className="relative flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Mic Button */}
        <button 
          onClick={toggleRecording}
          className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' 
              : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
          }`}
        >
          {isRecording && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping"></span>
          )}
          <svg className="w-6 h-6 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Text Input */}
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isRecording ? "Listening..." : "Type your message here..."}
          className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 px-4 py-2"
        />

        {/* Send Button */}
        <button 
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors"
        >
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
