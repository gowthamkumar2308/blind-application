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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AlertTriangle,
  Pause,
  MapPin,
  Phone,
  MessageSquare,
} from "lucide-react";

export default function SOS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "SOS Emergency Alert system loaded. This feature allows you to quickly send emergency messages with your location to trusted contacts.",
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-emergency/10">
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
              <div className="p-2 rounded-full bg-emergency text-emergency-foreground">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  SOS Emergency Alert
                </h1>
                <p className="text-sm text-muted-foreground">
                  Emergency messaging with location
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
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8 border-emergency/20">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-emergency text-emergency-foreground mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl">Emergency Alert System</CardTitle>
              <CardDescription>
                This feature is coming soon! It will allow you to quickly send
                emergency messages with your location to trusted contacts.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <MapPin className="h-8 w-8 mb-2 text-emergency" />
                  <h3 className="font-semibold">Location Sharing</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Automatically include your GPS coordinates
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <MessageSquare className="h-8 w-8 mb-2 text-emergency" />
                  <h3 className="font-semibold">Quick Messages</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Pre-written emergency messages
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <Phone className="h-8 w-8 mb-2 text-emergency" />
                  <h3 className="font-semibold">Emergency Contacts</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Send to multiple contacts instantly
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  This powerful feature will include:
                </p>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emergency mr-3" />
                    One-tap emergency alerts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emergency mr-3" />
                    Automatic location detection
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emergency mr-3" />
                    Multiple contact notification
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emergency mr-3" />
                    Voice-guided setup
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={() =>
                    speak(
                      "This feature is currently in development. Please continue to prompt us to help build out this emergency alert system with location sharing capabilities.",
                    )
                  }
                  className="bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Learn More (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This feature requires careful implementation of geolocation
                services, emergency contact management, and messaging
                capabilities. Please continue to provide feedback and
                requirements to help us build this critical accessibility
                feature.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
