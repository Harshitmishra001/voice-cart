let recognition: any = null;

export const isSupported = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const startListening = (
  langCode: string,
  onResult: (transcript: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError: (error: string) => void
) => {
  if (!isSupported()) {
    onError('Browser not supported for voice recognition.');
    return;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (recognition) {
    recognition.stop();
  }

  recognition = new SpeechRecognition();
  recognition.lang = langCode;
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    if (finalTranscript) {
      // Send the final recognized text
      onResult(finalTranscript, true);
    } else {
      // Send interim (live preview) text
      onResult(interimTranscript, false);
    }
  };

  recognition.onerror = (event: any) => {
    let errorMessage = 'An error occurred during speech recognition.';
    if (event.error === 'not-allowed') {
      errorMessage = 'Microphone permission denied. Please allow microphone access.';
    }
    onError(errorMessage);
  };

  recognition.onend = () => {
    onEnd();
    recognition = null;
  };

  try {
    recognition.start();
  } catch (err) {
    onError('Failed to start speech recognition.');
  }
};

export const stopListening = () => {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
};
