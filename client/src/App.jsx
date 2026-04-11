import React, { useState, useEffect, useCallback } from 'react';
import HeaderComp from './components/Header';
import RibbonComp from './components/InstructionRibbon';
import MessagesComp from './components/MessageList';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import { sendChatMessage } from './services/api';
import { useAppContext } from './context/AppContext';

function App() {
  const { messages, setMessages, setIsTyping, isTyping } = useAppContext();
  const { transcript, isListening, stopListening, startListening, error: speechError } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState('');
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');


  // LIVE SYNC: Map transcript to input value while recording
  useEffect(() => {
    if (isListening && transcript) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);

  // Function to handle sending messages
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Optional: Stop listening while processing to avoid hearing AI response
    const wasListening = isListening;
    if (wasListening) stopListening();

    // Add user message locally
    const userMsg = { sender: 'user', text: text.trim(), createdAt: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const data = await sendChatMessage(text);
      if (data && data.reply) {
        const aiMsg = { sender: 'ai', text: data.reply, createdAt: new Date() };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      // Let the user know the server is likely down
      alert(`Connection Error: ${err.message}. Please ensure the server is running.`);
    } finally {
      setIsTyping(false);
      // Optional: Resume listening after response if it was active
      if (wasListening) startListening();
      setInputValue(''); // Always clear input after send
      setLastProcessedTranscript(''); // Reset processed track
    }
  }, [setMessages, setIsTyping, isListening, stopListening, startListening]);

  // AUTO-SEND EFFECT: Watch the input value during listening
  useEffect(() => {
    if (!isListening || !inputValue || isTyping) return;
    
    const text = inputValue.trim();
    if (text === lastProcessedTranscript) return;

    // Detection logic: Look for question words and substantial length
    const questionWords = ['what', 'who', 'where', 'when', 'why', 'how', 'can', 'could', 'should', 'would', 'is', 'are', 'do', 'does', 'tell me', 'explain', 'can you'];
    const lowerText = text.toLowerCase();
    const isQuestion = lowerText.endsWith('?') || questionWords.some(word => lowerText.startsWith(word));

    // Wait for a clear pause after a substantial question is in the input
    if (isQuestion && text.length > 10) {
       const timeoutId = setTimeout(() => {
          handleSendMessage(text);
          setLastProcessedTranscript(text);
       }, 1700); // Natural silence pause
       return () => clearTimeout(timeoutId);
    }
  }, [inputValue, isListening, handleSendMessage, lastProcessedTranscript, isTyping]);



  const onManualSend = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue('');
  };

  const handleMicToggle = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <div 
      className={`flex flex-col h-screen text-white bg-[#0f1012]/85 backdrop-blur-2xl border-2 rounded-2xl overflow-hidden select-none shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-500 ${isListening ? 'border-red-500/50 ring-4 ring-red-500/10' : 'border-white/10'}`}
      style={{ WebkitAppRegion: 'drag' }}
    >
      
      {/* Primary Navigation Header */}
      <HeaderComp />

      {/* Instructional Ribbon */}
      <RibbonComp />

      {/* Main Message Feed */}
      <main 
        className="flex-1 flex flex-col bg-gradient-to-b from-transparent to-black/20 overflow-hidden relative"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <MessagesComp />

        {/* Speech Error Notice */}
        {speechError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg backdrop-blur-md animate-bounce">
             <p className="text-[10px] font-bold text-amber-200 uppercase tracking-tighter">
                Mic Issue: {speechError === 'not-allowed' ? 'Permission Denied' : speechError}
             </p>
          </div>
        )}
        
        {/* Real-time transcript preview */}

        {isListening && transcript && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl max-w-[85%] animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 shadow-[0_0_20px_rgba(239,68,68,0.1)] pointer-events-none">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-[12px] font-semibold text-red-200 italic truncate italic">
                  "{transcript}"
                </p>
             </div>
          </div>
        )}
      </main>

      {/* Functional Footer */}
      <footer 
        className="p-4 bg-[#1e1f22]/80 border-t border-white/5 backdrop-blur-md"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <div className="flex items-center gap-3">
          {/* Main Action Mic Button */}
          <button 
            onClick={handleMicToggle}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <form onSubmit={onManualSend} className="relative flex-1 group">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question or type override..." 
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-4 pr-12 py-3 text-[13px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 transition-all duration-300 shadow-inner group-hover:bg-black/50"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 p-1.5 text-zinc-500 hover:text-blue-400 transition-all active:scale-90 bg-white/5 rounded-lg hover:bg-white/10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}



export default App;


