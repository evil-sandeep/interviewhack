import { createContext, useContext, useState, useEffect } from 'react';
import { getChatHistory, clearChatHistory } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    // Mount the database on app load
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
      await clearChatHistory(); // Clear from DB completely
      setMessages([]); // Wipe UI state matching DB
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{
      messages,
      setMessages,
      isRecording,
      setIsRecording,
      isTyping,
      setIsTyping,
      isVoiceEnabled,
      setIsVoiceEnabled,
      isLoadingHistory,
      clearChat
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
