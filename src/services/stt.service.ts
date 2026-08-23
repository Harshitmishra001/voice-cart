/**
 * Web Speech API wrapper for STT capabilities.
 * NOTE: For robust multilingual support, a fallback to 
 * OpenAI Whisper or Google Cloud Speech-to-Text is recommended.
 */
export const startListening = (
  languageCode: string,
  onResult: (text: string) => void,
  onEnd: () => void
) => {
  // Stub: Initialize SpeechRecognition, set lang, start listening
};

export const stopListening = () => {
  // Stub: Stop current SpeechRecognition instance
};
