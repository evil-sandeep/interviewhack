import { createContext, useContext, useState, useEffect } from 'react';
import { getChatHistory, clearChatHistory } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  // Customization Polish Contexts
  const [theme, setTheme] = useState('dark');
  const [ttsSpeed, setTtsSpeed] = useState(1.0);

  // Apply Tailwind 'dark' html class root rule explicitly for smooth toggle rendering
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const cycleSpeed = () => {
    setTtsSpeed(prev => {
      if (prev === 1.0) return 1.2;
      if (prev === 1.2) return 0.8;
      return 1.0;
    });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getChatHistory();
        if (data && data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Context Data Fetch Error:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    loadHistory();
  }, []);

  const clearChat = async () => {
    try {
      await clearChatHistory(); 
      setMessages([]); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{
      messages, setMessages,
      isRecording, setIsRecording,
      isTyping, setIsTyping,
      isVoiceEnabled, setIsVoiceEnabled,
      isLoadingHistory, clearChat,
      theme, toggleTheme,
      ttsSpeed, cycleSpeed
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
