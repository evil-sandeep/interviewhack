import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('browser-not-supported');
      return;
    }

    const recognition = new SpeechRecognition();
    
    // continuous = true keeps the mic active indefinitely
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error); // 'not-allowed', 'no-speech', etc.
      setIsListening(false);
    };

    recognition.onend = () => {
      // Fires when stopped manually or silence timeout is reached
      setIsListening(false);
      
      // Auto-restart if it wasn't a manual stop to ensure "Always Listening"
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Auto-restart failed", err);
        }
      }
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      let isFinalResult = false;
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinalResult = true;
        }
      }
      
      setTranscript(currentTranscript);

      // Simple Question Detection: Check if final segment looks like a question
      if (isFinalResult) {
        const lowerText = currentTranscript.toLowerCase().trim();
        const questionWords = ['what', 'who', 'where', 'when', 'why', 'how', 'can', 'could', 'should', 'would', 'is', 'are', 'do', 'does', 'tell me', 'explain'];
        const isQuestion = lowerText.endsWith('?') || questionWords.some(word => lowerText.startsWith(word));
        
        if (isQuestion && lowerText.length > 10) {
          // You could trigger a callback here if passed to the hook
          console.log("Detected Question:", currentTranscript);
        }
      }
    };


    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript(''); // Clear old transcript from the hook state
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Already started", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasBrowserSupport: !!recognitionRef.current,
    error
  };
};

export default useSpeechRecognition;
