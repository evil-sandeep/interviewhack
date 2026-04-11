import React, { useState, useEffect, useCallback } from 'react';
import HeaderComp from './components/Header';
import RibbonComp from './components/InstructionRibbon';
import MessagesComp from './components/MessageList';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import { sendChatMessage } from './services/api';
import { useAppContext } from './context/AppContext';

function App() {
  const { messages, setMessages, setIsTyping, isTyping } = useAppContext();
  const { transcript, isListening, stopListening, startListening } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState('');
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');

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
    }
  }, [setMessages, setIsTyping, isListening, stopListening, startListening]);

  // Effect to watch transcript for question patterns
  useEffect(() => {
    if (!isListening || !transcript || isTyping) return;
    
    const text = transcript.trim();
    if (text.toLowerCase() === lastProcessedTranscript.toLowerCase()) return;

    // Detection logic: Look for question words and substantial length
    const questionWords = ['what', 'who', 'where', 'when', 'why', 'how', 'can', 'could', 'should', 'would', 'is', 'are', 'do', 'does', 'tell me', 'explain', 'can you'];
    const lowerText = text.toLowerCase();
    const isQuestion = lowerText.endsWith('?') || questionWords.some(word => lowerText.startsWith(word));

    // Wait for a clear pause after a substantial question is detected
    if (isQuestion && text.length > 12) {
       const timeoutId = setTimeout(() => {
          handleSendMessage(text);
          setLastProcessedTranscript(text);
       }, 1800); // 1.8s pause for better natural speech flow
       return () => clearTimeout(timeoutId);
    }
  }, [transcript, isListening, handleSendMessage, lastProcessedTranscript, isTyping]);


  const onManualSend = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div 
      className="flex flex-col h-screen text-white bg-[#0f1012]/85 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden select-none shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
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
        
        {/* Real-time transcript preview */}
        {isListening && transcript && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full max-w-[80%] animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 pointer-events-none">
             <p className="text-[11px] font-medium text-zinc-300 italic truncate italic">
               "{transcript}"
             </p>
          </div>
        )}
      </main>

      {/* Functional Footer */}
      <footer 
        className="p-4 bg-[#1e1f22]/80 border-t border-white/5 backdrop-blur-md"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <form onSubmit={onManualSend} className="relative group">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type payload override..." 
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
      </footer>
    </div>
  );
}


export default App;


