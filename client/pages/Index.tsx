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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  Calculator,
  AlertTriangle,
  Cloud,
  Newspaper,
  Mic,
  MicOff,
  Play,
  Pause,
  Languages,
  MapPin,
  Clock,
} from "lucide-react";

export default function Index() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Speech synthesis functions
  const speak = (text: string, feature?: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentFeature(feature || null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentFeature(null);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentFeature(null);
  };

  // Welcome message on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "Welcome to Blind Assist. Your comprehensive accessibility companion app. Navigate using tab or click on any feature to get started.",
        "welcome",
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      id: "translator",
      title: "Language Translator",
      description: "Convert text to speech in multiple languages",
      icon: Languages,
      color: "voice",
      path: "/translator",
      action: () =>
        speak(
          "Language translator activated. Enter text to translate and hear it spoken aloud.",
          "translator",
        ),
    },
    {
      id: "calculator",
      title: "Talking Calculator",
      description: "Perform calculations with voice feedback",
      icon: Calculator,
      color: "primary",
      path: "/calculator",
      action: () =>
        speak(
          "Talking calculator activated. Perform calculations and hear the results spoken aloud.",
          "calculator",
        ),
    },
    {
      id: "sos",
      title: "SOS Emergency Alert",
      description: "Send emergency messages with your location",
      icon: AlertTriangle,
      color: "emergency",
      path: "/sos",
      action: () =>
        speak(
          "SOS emergency alert system activated. This will send your location to emergency contacts.",
          "sos",
        ),
    },
    {
      id: "weather",
      title: "Weather Reader",
      description: "Get current weather conditions spoken aloud",
      icon: Cloud,
      color: "assist",
      path: "/weather",
      action: () =>
        speak(
          "Weather reader activated. Getting current weather conditions for your location.",
          "weather",
        ),
    },
    {
      id: "news",
      title: "News Reader",
      description: "Listen to top news headlines",
      icon: Newspaper,
      color: "accent",
      path: "/news",
      action: () =>
        speak(
          "News reader activated. Loading top news headlines to read aloud.",
          "news",
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary text-primary-foreground">
                <Volume2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Blind Assist
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your Accessibility Companion
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
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Your Accessibility Hub
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Five powerful tools designed specifically for blind and visually
            impaired users. Each feature includes voice feedback and is fully
            accessible via keyboard navigation.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Volume2 className="h-3 w-3 mr-1" />
              Voice Enabled
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <span className="sr-only">Keyboard</span>
              ⌨️ Keyboard Accessible
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <span className="sr-only">Screen reader</span>
              📱 Screen Reader Ready
            </Badge>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            const isActive = currentFeature === feature.id;

            return (
              <Card
                key={feature.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isActive ? "ring-2 ring-primary shadow-lg scale-105" : ""
                }`}
                onClick={feature.action}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    feature.action();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Activate ${feature.title}: ${feature.description}`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto p-4 rounded-full bg-${feature.color} text-${feature.color}-foreground mb-4 group-hover:scale-110 transition-transform ${
                      isActive ? "animate-pulse" : ""
                    }`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center space-y-2">
                  <Link to={feature.path}>
                    <Button
                      className={`w-full bg-${feature.color} hover:bg-${feature.color}/90 text-${feature.color}-foreground`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Open Feature
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      feature.action();
                    }}
                  >
                    {isActive ? (
                      <>
                        <div className="animate-spin h-3 w-3 mr-2">
                          <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                        </div>
                        Speaking...
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3 w-3 mr-2" />
                        Preview
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Quick Actions */}
        <section className="bg-card border rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <Mic className="h-6 w-6 mr-2" />
            Quick Voice Commands
          </h3>
          <p className="text-muted-foreground mb-4">
            Say "Hey Assist" followed by one of these commands:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Open calculator",
              "Check weather",
              "Read news",
              "Translate text",
              "Emergency help",
              "What time is it",
            ].map((command, index) => (
              <Badge
                key={index}
                variant="outline"
                className="justify-start p-2 text-sm"
              >
                "{command}"
              </Badge>
            ))}
          </div>
        </section>

        {/* Status Section */}
        <section className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            System Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Speech Synthesis: Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Voice Recognition: Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Location Services: Available</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-background/95">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Blind Assist - Empowering independence through accessible technology
          </p>
        </div>
      </footer>
    </div>
  );
}
