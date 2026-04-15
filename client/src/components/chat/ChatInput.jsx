import { useState, useEffect, useRef } from 'react';
import MicButton from './MicButton';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import useTextToSpeech from '../../hooks/useTextToSpeech';
import { useAppContext } from '../../context/AppContext';
import { sendChatMessage } from '../../services/api';

const ChatInput = () => {
  const [text, setText] = useState("");
  const [baseText, setBaseText] = useState("");
  const [isHandsFree, setIsHandsFree] = useState(false);
  const silenceTimerRef = useRef(null);

  const { messages, setMessages, setIsTyping, isTyping, isVoiceEnabled, ttsSpeed } = useAppContext();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasBrowserSupport,
    error
  } = useSpeechRecognition();

  const inputDisabled = isTyping || isSpeaking || !hasBrowserSupport;

  const toggleRecording = () => {
    if (isListening) {
      setIsHandsFree(false);
      stopListening();
    } else {
      stopSpeaking(); 
      setBaseText(text); 
      setIsHandsFree(true);
      startListening();
    }
  };

  useEffect(() => {
    if (isListening) {
      setText(baseText + (baseText && transcript ? " " : "") + transcript);
    }
  }, [transcript, isListening, baseText]);

  useEffect(() => {
    if (!isListening) {
      setBaseText(text); 
    }
  }, [isListening, text]);

  // AUTOPILOT: Auto-submit on silence detection
  useEffect(() => {
    if (isListening && transcript.trim() !== "") {
      // Clear existing timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      // Start new timer for 1.8 seconds (balance between speed and patience)
      silenceTimerRef.current = setTimeout(() => {
        console.log("[Autopilot] Silence detected, auto-submitting...");
        handleSend();
      }, 1800);
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [transcript, isListening]);

  // AUTOPILOT: Auto-restart listening after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && !isTyping && isHandsFree && !isListening) {
      console.log("[Autopilot] AI finished speaking, restarting listening...");
      // Small delay to ensure any echo has cleared
      const restartTimeout = setTimeout(() => {
        if (isHandsFree && !isListening) {
          startListening();
        }
      }, 500);
      return () => clearTimeout(restartTimeout);
    }
  }, [isSpeaking, isTyping, isListening, isHandsFree]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!isListening) {
      setBaseText(e.target.value);
    }
  };

  const handleSend = async () => {
    const userMessage = text.trim();
    if (!userMessage || isTyping) return;

    if (isListening) stopListening();
    resetTranscript();
    stopSpeaking();

    setText("");
    setBaseText("");
    
    const submitTime = new Date().toISOString();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage, timestamp: submitTime }]);
    setIsTyping(true);

    try {
      const data = await sendChatMessage(userMessage);

      const replyTime = new Date().toISOString();
      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply, timestamp: replyTime }]);
      
      if (isVoiceEnabled) {
        speak(data.reply, { rate: ttsSpeed });
      }

    } catch (err) {
      console.error(err);
      const errMessage = 'Warning: Network connection error.';
      setMessages((prev) => [...prev, { sender: 'ai', text: `⚠️ ${errMessage}` }]);
      if (isVoiceEnabled) {
        speak(errMessage, { rate: ttsSpeed });
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full relative transition-all">
      
      {/* Speaking Indicator inline instead of overlapping outside the box violently */}
      {isHandsFree && (
        <div className="w-full flex justify-center mb-3">
           <div className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded border transition-all ${
             isTyping || isSpeaking 
               ? 'text-zinc-500 bg-zinc-900/40 border-zinc-800' 
               : 'text-red-400 bg-red-900/10 border-red-500/20 animate-pulse'
           }`}>
             <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-zinc-600'}`}></div>
             {isTyping ? "AI THINKING..." : isSpeaking ? "AI RESPONDING..." : "HANDS-FREE ACTIVE / LISTENING"}
           </div>
        </div>
      )}

      {isSpeaking && !isHandsFree && !isTyping && (
        <div className="w-full flex justify-center mb-3">
           <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded border border-emerald-500/20 transition-colors">
             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
             AUDIO SYNTHESIS ACTIVE
           </div>
        </div>
      )}

      {/* Flat Input Ribbon matching Interview Copilot window seamlessly */}
      <div className="relative flex items-center gap-2 sm:gap-3 bg-[#191a1d] border border-[#35373c] rounded-lg px-2 py-2 transition-colors">
        
        <MicButton 
          isListening={isListening} 
          onClick={toggleRecording} 
          disabled={inputDisabled} 
        />

        <input 
          type="text"
          value={text}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          readOnly={inputDisabled || isListening} 
          placeholder={
            !hasBrowserSupport 
              ? "Speech API unsupported..." 
              : isSpeaking 
                ? "Locked (Synthesizing answer)..."
                : isListening 
                  ? "Transcribing voice input..." 
                  : "Type payload override..."
          }
          className={`flex-1 bg-transparent border-none outline-none px-2 py-2 text-sm transition-colors ${
            isListening ? 'text-emerald-400 font-mono tracking-wide' : 'text-zinc-200 placeholder-zinc-500'
          }`}
        />

        <button 
          onClick={handleSend}
          disabled={!text.trim() || inputDisabled}
          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded text-zinc-300 flex items-center justify-center transition-all duration-300 ${
            text.trim() && !inputDisabled 
              ? 'bg-[#2e3035] hover:bg-[#3d3f44] shadow-sm scale-100' 
              : 'bg-[#1e1f22] text-zinc-600 scale-95 cursor-not-allowed border border-[#2e3035]'
          }`}
        >
          <svg className={`w-4 h-4 ml-1 transition-transform ${isTyping ? 'translate-x-1 opacity-50' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
