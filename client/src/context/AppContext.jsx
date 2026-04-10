import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true); // Voice is enabled globally by default

  return (
    <AppContext.Provider value={{
      messages,
      setMessages,
      isRecording,
      setIsRecording,
      isTyping,
      setIsTyping,
      isVoiceEnabled,
      setIsVoiceEnabled
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
