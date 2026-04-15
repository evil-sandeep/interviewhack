import React, { useState, useCallback } from 'react';
import HeaderComp from './components/Header';
import RibbonComp from './components/InstructionRibbon';
import MessagesComp from './components/MessageList';
import { sendChatMessage } from './services/api';
import { useAppContext } from './context/AppContext';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import LiveTranscript from './components/LiveTranscript';

function App() {
  const { messages, setMessages, setIsTyping, isTyping } = useAppContext();
  const [inputValue, setInputValue] = useState('');

  const { isListening, startListening, stopListening, transcript, interimTranscript, resetTranscript } = useSpeechRecognition();

  // Sync Live Transcript with Input Value
  React.useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Function to handle manual text sending
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

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
      alert(`Connection Error: ${err.message}. Please ensure the server is running.`);
    } finally {
      setIsTyping(false);
      setInputValue('');
      resetTranscript();
    }
  }, [setMessages, setIsTyping]);

  const onManualSend = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (inputValue.trim()) {
        handleSendMessage(inputValue);
      }
    } else {
      setInputValue('');
      resetTranscript();
      startListening();
    }
  };

  return (
    <div 
      className={`flex flex-col h-screen text-white bg-[#0f1012]/85 backdrop-blur-2xl border-2 rounded-2xl overflow-hidden select-none shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-500 ${isListening ? 'border-red-500/50 ring-4 ring-red-500/10' : 'border-white/10'}`}
      style={{ WebkitAppRegion: 'drag' }}
    >
      
      {/* Primary Navigation Header */}
      <HeaderComp isRecording={isListening} onToggle={handleMicToggle} />

      {/* Instructional Ribbon */}
      <RibbonComp isTyping={isTyping} />

      {/* Main Message Feed */}
      <main 
        className="flex-1 flex flex-col bg-gradient-to-b from-transparent to-black/20 overflow-hidden relative"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <MessagesComp />

        {/* Live Speech-to-Text Overlay */}
        <LiveTranscript 
          isListening={isListening} 
          transcript={transcript} 
          interimTranscript={interimTranscript} 
        />
      </main>

      {/* Functional Footer */}
      <footer 
        className="p-4 bg-[#1e1f22]/80 border-t border-white/5 backdrop-blur-md"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <div className="flex items-center gap-3">
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
