import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  ArrowLeft,
  Languages,
  Play,
  Pause,
  RotateCcw,
  Copy,
} from "lucide-react";

const languages = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "te-IN", name: "Telugu (తెలుగు)", flag: "🇮🇳" },
  { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
  { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
  { code: "fr-FR", name: "French", flag: "🇫🇷" },
  { code: "de-DE", name: "German", flag: "🇩🇪" },
  { code: "it-IT", name: "Italian", flag: "🇮🇹" },
  { code: "pt-PT", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru-RU", name: "Russian", flag: "🇷🇺" },
  { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean", flag: "🇰🇷" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "ar-SA", name: "Arabic", flag: "🇸🇦" },
];

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [teluguVoiceAvailable, setTeluguVoiceAvailable] = useState(false);

  const speak = (text: string, languageCode?: string) => {
    // Enhanced safety checks
    if (!text || !text.trim()) {
      console.log("Empty text provided to speech synthesis");
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not available in this browser");
      return;
    }

    // Check if speech synthesis is ready
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      console.log("Speech synthesis busy, canceling previous...");
      speechSynthesis.cancel();
    }

    try {
      // Wait for voices to be loaded
      const waitForVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.log("No voices available yet, retrying...");
          setTimeout(waitForVoices, 100);
          return;
        }

        performSpeech(text, languageCode, voices);
      };

      waitForVoices();
    } catch (error) {
      console.error("Error in speech synthesis setup:", error);
      setIsSpeaking(false);
    }
  };

  const performSpeech = (
    text: string,
    languageCode: string | undefined,
    voices: SpeechSynthesisVoice[],
  ) => {
    try {
      const targetLang = languageCode || selectedLanguage;
      const utterance = new SpeechSynthesisUtterance(text);

      // Find the best voice for the target language
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;

      if (targetLang === "te-IN" || targetLang.startsWith("te")) {
        // Look for Telugu voices
        selectedVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("te") ||
            voice.lang.includes("telugu") ||
            voice.name.toLowerCase().includes("telugu"),
        );

        if (!selectedVoice) {
          // Fallback to Hindi if Telugu not available
          selectedVoice = voices.find((voice) => voice.lang.startsWith("hi"));

          if (!selectedVoice) {
            // Final fallback to English with a note
            selectedVoice = voices.find((voice) => voice.lang.startsWith("en"));
            console.log("Telugu voice not available, using fallback");
          }
        }
      } else {
        // For other languages, find matching voice
        selectedVoice = voices.find((voice) =>
          voice.lang.startsWith(targetLang.split("-")[0]),
        );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(
          `Using voice: ${selectedVoice.name} for language: ${targetLang}`,
        );
      }

      utterance.lang = targetLang;
      utterance.rate = targetLang === "te-IN" ? 0.7 : 0.8; // Slower for Telugu
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (error) => {
        // Safe error logging without circular references or object conversion issues
        const safeErrorInfo = {
          type: String(error?.type || "unknown"),
          error: String(error?.error || "unknown"),
          name: String(error?.name || "unknown"),
          message: String(error?.message || "unknown"),
          constructor: error?.constructor?.name || "unknown",
        };

        console.error("Speech synthesis error:", safeErrorInfo);

        // Log the raw error separately (this might work better in some browsers)
        try {
          console.error("Raw error:", error);
        } catch (logError) {
          console.error("Could not log raw error object");
        }

        setIsSpeaking(false);

        // Handle different error scenarios more safely
        const errorType = String(
          error?.error || error?.type || error?.name || "unknown",
        );
        console.log("Determined error type:", errorType);

        // Don't create recursive calls - check if we're already trying English
        if (targetLang !== "en-US" && !text.includes("voice not available")) {
          setTimeout(() => {
            try {
              const fallbackUtterance = new SpeechSynthesisUtterance(
                targetLang === "te-IN"
                  ? `Telugu voice not available. The text was: ${text}`
                  : `Voice not available for this language. The text was: ${text}`,
              );
              fallbackUtterance.lang = "en-US";
              fallbackUtterance.rate = 0.8;
              fallbackUtterance.pitch = 1;
              fallbackUtterance.volume = 1;

              // Find a reliable English voice
              const voices = speechSynthesis.getVoices();
              const englishVoice = voices.find(
                (voice) =>
                  voice.lang === "en-US" || voice.lang.startsWith("en"),
              );
              if (englishVoice) {
                fallbackUtterance.voice = englishVoice;
              }

              fallbackUtterance.onend = () => setIsSpeaking(false);
              fallbackUtterance.onerror = (fallbackError) => {
                console.error("Fallback speech also failed:", fallbackError);
                setIsSpeaking(false);
              };

              speechSynthesis.speak(fallbackUtterance);
            } catch (fallbackError) {
              console.error("Error creating fallback speech:", fallbackError);
              setIsSpeaking(false);
            }
          }, 500);
        }
      };

      // Additional check before speaking
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        console.log("Still speaking/pending, waiting...");
        setTimeout(() => performSpeech(text, languageCode, voices), 500);
        return;
      }

      console.log("Attempting to speak:", {
        text: text.substring(0, 50),
        targetLang,
        voiceSelected: !!selectedVoice,
      });
      speechSynthesis.speak(utterance);
    } catch (speakError) {
      console.error("Error during speech synthesis:", {
        error: speakError,
        message: speakError?.message || "Unknown error",
        name: speakError?.name || "Unknown",
        stack: speakError?.stack || "No stack",
      });
      setIsSpeaking(false);

      // Final fallback - try simple English fallback
      try {
        const simpleUtterance = new SpeechSynthesisUtterance(
          `Speech failed for: ${text.substring(0, 30)}`,
        );
        simpleUtterance.lang = "en-US";
        simpleUtterance.onend = () => setIsSpeaking(false);
        simpleUtterance.onerror = () => {
          console.log("Even fallback speech failed, giving up");
          setIsSpeaking(false);
        };
        speechSynthesis.speak(simpleUtterance);
      } catch (fallbackError) {
        console.error("Fallback speech also failed:", fallbackError);
        setIsSpeaking(false);
      }
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Load available voices and check for Telugu support
  useEffect(() => {
    const loadVoices = () => {
      try {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);

        // Check if Telugu voice is available
        const hasTeluguVoice = voices.some(
          (voice) =>
            voice.lang.startsWith("te") ||
            voice.lang.includes("telugu") ||
            voice.name.toLowerCase().includes("telugu"),
        );
        setTeluguVoiceAvailable(hasTeluguVoice);

        console.log("Speech synthesis status:", {
          voicesLoaded: voices.length > 0,
          totalVoices: voices.length,
          teluguAvailable: hasTeluguVoice,
          synthesisPending: speechSynthesis.pending,
          synthesisSpeaking: speechSynthesis.speaking,
          available: "speechSynthesis" in window,
        });

        if (voices.length === 0) {
          console.warn("No voices loaded yet, will retry...");
          setTimeout(loadVoices, 1000);
        }
      } catch (error) {
        console.error("Error loading voices:", {
          error,
          message: error?.message || "Unknown error",
          name: error?.name || "Unknown",
        });
      }
    };

    // Load voices immediately and also on voiceschanged event
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "Language Translator loaded. Enter text to translate and hear it spoken in the selected language.",
        "en-US",
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Mock translation function (in a real app, you'd use a translation service)
  const translateText = async () => {
    if (!inputText.trim()) {
      speak("Please enter some text to translate.", "en-US");
      return;
    }

    setIsTranslating(true);
    speak("Translating text...", "en-US");

    // Simulate API call delay
    setTimeout(() => {
      // Enhanced mock translation with basic word/phrase mapping
      const getTranslation = (text: string, language: string): string => {
        const lowerText = text.toLowerCase().trim();

        // Telugu translations for common phrases
        if (language === "te-IN") {
          const teluguTranslations: { [key: string]: string } = {
            hello: "నమస్కారం",
            hi: "హాయ్",
            "good morning": "శుభోదయం",
            "good evening": "శుభ సాయంత్రం",
            "good night": "శ���భ రాత్రి",
            "how are you": "ఎలా ఉన్నారు",
            "thank you": "ధన్యవాదాలు",
            please: "దయచేసి",
            sorry: "క్షమించండి",
            yes: "అవును",
            no: "లేదు",
            water: "నీరు",
            food: "ఆహారం",
            help: "సహాయం",
            "i need help": "నాకు సహాయం కావాలి",
            "where is": "ఎక్కడ ఉంది",
            bathroom: "బాత్రూమ్",
            hospital: "ఆసుపత్రి",
            school: "పాఠశాల",
            home: "ఇల్లు",
            family: "కుటుంబం",
            friend: "స్నేహితుడు",
            love: "ప్రేమ",
            happy: "సంతోషం",
            sad: "దుఃఖం",
            beautiful: "అందమైన",
            good: "మంచి",
            bad: "చెడు",
            big: "పెద్ద",
            small: "చి���్న",
          };

          // Check for exact matches first
          if (teluguTranslations[lowerText]) {
            return teluguTranslations[lowerText];
          }

          // Check for partial matches or phrases
          for (const [english, telugu] of Object.entries(teluguTranslations)) {
            if (lowerText.includes(english)) {
              return text.replace(new RegExp(english, "gi"), telugu);
            }
          }

          // If no match found, return with indication it's Telugu text
          return `[తెలుగు] ${text}`;
        }

        // Other language fallbacks
        const basicTranslations: { [key: string]: { [key: string]: string } } =
          {
            "hi-IN": {
              hello: "नमस्ते",
              "thank you": "धन्यवाद",
              "good morning": "सुप्रभात",
            },
            "es-ES": {
              hello: "Hola",
              "thank you": "Gracias",
              "good morning": "Buenos días",
            },
            "fr-FR": {
              hello: "Bonjour",
              "thank you": "Merci",
              "good morning": "Bonjour",
            },
          };

        const langTranslations = basicTranslations[language];
        if (langTranslations && langTranslations[lowerText]) {
          return langTranslations[lowerText];
        }

        return `[${language}] ${text}`;
      };

      const translated = getTranslation(inputText, selectedLanguage);
      setTranslatedText(translated);
      setIsTranslating(false);

      setTimeout(() => {
        speak(`Translation complete: ${translated}`, selectedLanguage);
      }, 500);
    }, 2000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      speak("Text copied to clipboard.", "en-US");
    } catch (err) {
      speak("Failed to copy text.", "en-US");
    }
  };

  const clearAll = () => {
    setInputText("");
    setTranslatedText("");
    stopSpeaking();
    speak("Text cleared.", "en-US");
  };

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-voice/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Go back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="p-2 rounded-full bg-voice text-voice-foreground">
                <Languages className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Language Translator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Text to speech in multiple languages
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="hidden sm:flex items-center space-x-1"
              >
                <div
                  className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                <span className="text-xs">
                  {isSpeaking ? "Speaking" : "Ready"}
                </span>
              </Badge>

              {isSpeaking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopSpeaking}
                  className="flex items-center space-x-1"
                >
                  <Pause className="h-4 w-4" />
                  <span className="hidden sm:inline">Stop</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Language Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Languages className="h-5 w-5" />
                <span>Target Language</span>
              </CardTitle>
              <CardDescription>
                Select the language you want to translate to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedLanguage}
                onValueChange={(value) => {
                  setSelectedLanguage(value);
                  const lang = languages.find((l) => l.code === value);
                  speak(`Language changed to ${lang?.name}`, "en-US");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center space-x-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedLang && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedLang.flag} {selectedLang.name}
                  </p>
                  {selectedLanguage === "te-IN" && (
                    <div className="mt-2">
                      {teluguVoiceAvailable ? (
                        <Badge
                          variant="default"
                          className="text-xs bg-green-100 text-green-800"
                        >
                          ✓ Telugu voice available
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-orange-100 text-orange-800"
                        >
                          ⚠ Telugu voice not detected - using fallback
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Text</CardTitle>
                <CardDescription>
                  Enter the text you want to translate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base"
                  onFocus={() => speak("Input text area focused.", "en-US")}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => speak(inputText, "en-US")}
                    disabled={!inputText.trim() || isSpeaking}
                    variant="outline"
                    size="sm"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen (Original)
                  </Button>

                  <Button
                    onClick={() => copyToClipboard(inputText)}
                    disabled={!inputText.trim()}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Translation</CardTitle>
                <CardDescription>
                  Translated text in {selectedLang?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[200px] p-3 bg-muted rounded-lg border">
                  {isTranslating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-5 w-5">
                          <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                        </div>
                        <span>Translating...</span>
                      </div>
                    </div>
                  ) : translatedText ? (
                    <p className="text-base leading-relaxed">
                      {translatedText}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Translation will appear here...
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      if (
                        selectedLanguage === "te-IN" &&
                        !teluguVoiceAvailable
                      ) {
                        speak(
                          `Reading Telugu text in available voice: ${translatedText}`,
                          "en-US",
                        );
                        setTimeout(() => {
                          speak(translatedText, selectedLanguage);
                        }, 2000);
                      } else {
                        speak(translatedText, selectedLanguage);
                      }
                    }}
                    disabled={!translatedText || isSpeaking}
                    variant="outline"
                    size="sm"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen (Translated)
                  </Button>

                  <Button
                    onClick={() => copyToClipboard(translatedText)}
                    disabled={!translatedText}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={translateText}
              disabled={!inputText.trim() || isTranslating}
              className="bg-voice hover:bg-voice/90 text-voice-foreground px-8 py-3 text-lg"
              size="lg"
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin h-5 w-5 mr-2">
                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                  </div>
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="h-5 w-5 mr-2" />
                  Translate & Speak
                </>
              )}
            </Button>

            <Button
              onClick={clearAll}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Clear All
            </Button>
          </div>

          {/* Quick Examples */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Examples</CardTitle>
              <CardDescription>
                Try these common phrases (click to use)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Hello, how are you?",
                  "నమస్క��రం, ఎలా ఉన్నారు?",
                  "Where is the bathroom?",
                  "I need help, please.",
                  "Thank you very much.",
                  "Good morning.",
                  "Excuse me.",
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => {
                      setInputText(example);
                      const isTeluguText = /[\u0C00-\u0C7F]/.test(example);
                      if (isTeluguText) {
                        speak(`Telugu example selected`, "en-US");
                        setTimeout(() => {
                          speak(example, "te-IN");
                        }, 1500);
                      } else {
                        speak(`Example selected: ${example}`, "en-US");
                      }
                    }}
                  >
                    "{example}"
                  </Button>
                ))}
              </div>

              {/* Telugu Voice Test */}
              <div className="mt-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <h4 className="font-medium mb-2">Telugu Voice Test</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Test if your device supports Telugu speech synthesis
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      speak("Testing Telugu voice synthesis", "en-US");
                      setTimeout(() => {
                        speak("నమస్కారం! ఇది తెలుగు వాయి���్ టెస్ట్.", "te-IN");
                      }, 2000);
                    }}
                    disabled={isSpeaking}
                    size="sm"
                    variant="outline"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Test Telugu Voice
                  </Button>

                  <Button
                    onClick={() => {
                      const voices = speechSynthesis.getVoices();
                      const teluguVoices = voices.filter(
                        (voice) =>
                          voice.lang.startsWith("te") ||
                          voice.lang.includes("telugu") ||
                          voice.name.toLowerCase().includes("telugu"),
                      );

                      if (teluguVoices.length > 0) {
                        speak(
                          `Found ${teluguVoices.length} Telugu voices: ${teluguVoices.map((v) => v.name).join(", ")}`,
                          "en-US",
                        );
                      } else {
                        speak(
                          "No Telugu voices found on this device. The system will use a fallback voice for Telugu text.",
                          "en-US",
                        );
                      }
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    Check Telugu Voices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
