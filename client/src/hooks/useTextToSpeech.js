import { useState, useEffect, useCallback } from 'react';

const useTextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if the Web Speech API is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      loadVoices();
      
      // Safari/Chrome requires event listener since voices load async
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return;
    
    stop(); // Automatically cancel any ongoing speech to prevent overlaps
    
    // For very long text chunks, some browsers have bugs. 
    // Usually handled securely by instantiating new utterance.
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Intelligent voice selection algorithm:
    // Favors female, US, or Google standard voices for an AI feel
    const preferredVoice = voices.find(v => 
      v.name.includes("Female") || 
      v.name.includes("Google") || 
      v.name.includes("Samantha") ||
      v.name.includes("Microsoft Zira")
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = options.rate || 1.0;  // Normal speed
    utterance.pitch = options.pitch || 1.1; // Slightly higher pitch for clarity
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech Synthesis Error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices, stop]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported, isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices
  };
};

export default useTextToSpeech;
