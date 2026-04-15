import React from 'react';

const LiveTranscript = ({ isListening, transcript, interimTranscript }) => {
  if (!isListening && !transcript && !interimTranscript) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 pointer-events-none">
      <div className="bg-[#0b0c0f]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Indicator Header */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
          <div className="relative flex items-center justify-center w-3 h-3">
            {isListening && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isListening ? 'bg-red-500' : 'bg-red-900'}`}></span>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-red-100/90 shadow-sm">
            {isListening ? 'Listening...' : 'Stopped'}
          </span>
        </div>

        {/* Text Container */}
        <div className="flex flex-col gap-1.5 min-h-[2.5rem]">
          {transcript && (
            <p className="text-[15px] leading-relaxed text-zinc-200 font-medium whitespace-pre-wrap break-words">
              {transcript}
            </p>
          )}
          
          {interimTranscript && (
            <p className="text-[15px] leading-relaxed text-yellow-400 font-medium whitespace-pre-wrap break-words italic animate-pulse shadow-yellow-400/20">
              {interimTranscript}
            </p>
          )}

          {!transcript && !interimTranscript && isListening && (
            <p className="text-[15px] leading-relaxed text-zinc-600 italic">
              Awaiting speech...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTranscript;
