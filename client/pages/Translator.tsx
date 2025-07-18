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

  // Ultra-simple speech synthesis that just works
  const speak = (text: string, lang: string = "en-US") => {
    if (!text || !text.trim()) {
      console.log("No text to speak");
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not supported");
      return;
    }

    try {
      // Stop any current speech
      speechSynthesis.cancel();

      // Wait a moment then start new speech
      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = lang === "te-IN" ? 0.7 : 0.8;
          utterance.pitch = 1;
          utterance.volume = 1;

          utterance.onstart = () => {
            console.log("Speech started");
            setIsSpeaking(true);
          };

          utterance.onend = () => {
            console.log("Speech ended");
            setIsSpeaking(false);
          };

          utterance.onerror = () => {
            console.log("Speech error - trying English fallback");
            setIsSpeaking(false);

            // If not already English, try English fallback
            if (lang !== "en-US") {
              setTimeout(() => {
                speak(
                  `Language not supported. Original text: ${text.substring(0, 50)}...`,
                  "en-US",
                );
              }, 500);
            }
          };

          console.log("Starting speech:", { lang, textLength: text.length });
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.log("Speech creation failed");
          setIsSpeaking(false);
        }
      }, 100);
    } catch (error) {
      console.log("Speech setup failed");
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    try {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } catch (error) {
      console.log("Error stopping speech");
      setIsSpeaking(false);
    }
  };

  // Welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "Language Translator loaded. Enter text to translate and hear it spoken in the selected language.",
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced mock translation with basic word/phrase mapping
  const translateText = async () => {
    if (!inputText.trim()) {
      speak("Please enter some text to translate.");
      return;
    }

    setIsTranslating(true);
    speak("Translating text...");

    setTimeout(() => {
      const getTranslation = (text: string, language: string): string => {
        const lowerText = text.toLowerCase().trim();

        // Telugu translations for common phrases
        if (language === "te-IN") {
          const teluguTranslations: { [key: string]: string } = {
            hello: "నమస్కారం",
            hi: "హాయ్",
            "good morning": "శుభోదయం",
            "good evening": "శుభ సాయంత్రం",
            "good night": "శుభ రాత్రి",
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
            small: "చిన్న",
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
      speak("Text copied to clipboard.");
    } catch (err) {
      speak("Failed to copy text.");
    }
  };

  const clearAll = () => {
    setInputText("");
    setTranslatedText("");
    stopSpeaking();
    speak("Text cleared.");
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
                  speak(`Language changed to ${lang?.name}`);
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
                  onFocus={() => speak("Input text area focused.")}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => speak(inputText)}
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
                    onClick={() => speak(translatedText, selectedLanguage)}
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
                  "నమస్కారం, ఎలా ఉన్నారు?",
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
                        speak("Telugu example selected");
                        setTimeout(() => {
                          speak(example, "te-IN");
                        }, 1500);
                      } else {
                        speak(`Example selected: ${example}`);
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
                      speak("Testing Telugu voice synthesis");
                      setTimeout(() => {
                        speak("నమస్కారం! ఇది తెలుగు వాయిస్ టెస్ట్.", "te-IN");
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
                        );
                      } else {
                        speak(
                          "No Telugu voices found on this device. The system will use a fallback voice for Telugu text.",
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
