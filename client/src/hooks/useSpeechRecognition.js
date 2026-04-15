import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const shouldBeListening = useRef(false); // Heartbeat ref to track intended state

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('browser-not-supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(event.error);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // If we intended to be listening, restart the engine immediately
      if (shouldBeListening.current) {
        try {
          recognition.start();
        } catch (err) {
          console.error("Heartbeat restart failed:", err);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onresult = (event) => {
      let finalTrans = '';
      let interimTrans = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTrans += event.results[i][0].transcript;
        } else {
          interimTrans += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTrans);
      setInterimTranscript(interimTrans);
    };

    recognitionRef.current = recognition;

    return () => {
      shouldBeListening.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      shouldBeListening.current = true;
      setTranscript('');
      setInterimTranscript('');
      
      // Small delay to ensure Electron permission handshake is stable
      setTimeout(() => {
        try {
          if (shouldBeListening.current) {
            recognitionRef.current.start();
          }
        } catch (err) {
          console.error("Start failed or already running:", err);
        }
      }, 300);
    }
  }, []);


  const stopListening = useCallback(() => {
    shouldBeListening.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
    if (recognitionRef.current) {
      // Browsers often buffer results, so we stop and restart if needed to clear internal state
      const wasListening = shouldBeListening.current;
      if (wasListening) stopListening();
      setTranscript('');
      setInterimTranscript('');
      if (wasListening) startListening();
    }
  }, [stopListening, startListening]);


  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    hasBrowserSupport: !!recognitionRef.current,
    error
  };
};

export default useSpeechRecognition;
