import React, { useState, useEffect } from 'react';
import MicButton from './MicButton';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import useTextToSpeech from '../../hooks/useTextToSpeech';
import { useAppContext } from '../../context/AppContext';
import { sendChatMessage } from '../../services/api';

const ChatInput = () => {
  const [text, setText] = useState("");
  const [baseText, setBaseText] = useState("");

  // Extracted TTS playback multiplier directly out of global prop footprint map
  const { messages, setMessages, setIsTyping, isTyping, isVoiceEnabled, ttsSpeed } = useAppContext();
  
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasBrowserSupport,
    error
  } = useSpeechRecognition();

  // Polished requirement: Force the disabling of new inputs while AI literally verbalizes payload
  const inputDisabled = isTyping || isSpeaking || !hasBrowserSupport;

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking(); 
      setBaseText(text); 
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
      
      // Inject user's specific rate preference safely into options argument mapped onto engine logic
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

  const parseErrorMessage = () => {
    if (error === 'browser-not-supported') return 'Speech API not supported';
    if (error === 'not-allowed') return 'Microphone Permission Denied';
    if (error === 'no-speech') return 'No speech detected';
    return error;
  };

  return (
    <div className="w-full mt-auto pt-6 pb-2 relative transition-all">
      
      {/* Speaking Indicator */}
      {isSpeaking && !isTyping && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 text-xs text-violet-600 bg-violet-100 dark:text-violet-300 dark:bg-violet-900/40 px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-500/30 transition-colors shadow-sm">
          <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          Synthesizing Audio...
        </div>
      )}

      <div className="relative flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-colors">
        
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
              ? "Speech API not supported..." 
              : isSpeaking 
                ? "Waiting for AI..."
                : isListening 
                  ? "Listening... (auto-stops on silence)" 
                  : "Send a message..."
          }
          className={`flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm sm:text-base transition-colors ${
            isListening ? 'text-violet-600 dark:text-violet-300' : 'text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500'
          }`}
        />

        <button 
          onClick={handleSend}
          disabled={!text.trim() || inputDisabled}
          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            text.trim() && !inputDisabled 
              ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-100' 
              : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 scale-95 cursor-not-allowed'
          }`}
        >
          <svg className={`w-4 h-4 sm:w-5 sm:h-5 ml-1 transition-transform ${isTyping ? 'translate-x-1 opacity-50' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
