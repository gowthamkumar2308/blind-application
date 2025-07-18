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
  Cloud,
  Pause,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";

export default function Weather() {
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
        "Weather Reader loaded. This feature will provide spoken weather updates for your current location and any location you specify.",
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-assist/10">
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
              <div className="p-2 rounded-full bg-assist text-assist-foreground">
                <Cloud className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Weather Reader
                </h1>
                <p className="text-sm text-muted-foreground">
                  Spoken weather conditions and forecasts
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
          <Card className="mb-8 border-assist/20">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-assist text-assist-foreground mb-4">
                <Cloud className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl">Weather Reader</CardTitle>
              <CardDescription>
                This feature is coming soon! It will provide detailed spoken
                weather reports for your location and any city worldwide.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <Thermometer className="h-8 w-8 mb-2 text-assist" />
                  <h3 className="font-semibold">Temperature</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Current and feels-like temperature
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <Droplets className="h-8 w-8 mb-2 text-assist" />
                  <h3 className="font-semibold">Conditions</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Rain, humidity, and visibility
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <Wind className="h-8 w-8 mb-2 text-assist" />
                  <h3 className="font-semibold">Wind & Forecast</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Wind speed and 5-day outlook
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  This comprehensive feature will include:
                </p>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-assist mr-3" />
                    Current weather conditions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-assist mr-3" />
                    Hourly and daily forecasts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-assist mr-3" />
                    Severe weather alerts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-assist mr-3" />
                    Location-based updates
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-assist mr-3" />
                    Customizable announcements
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={() =>
                    speak(
                      "This weather reading feature is currently in development. It will integrate with weather APIs to provide comprehensive spoken weather reports. Please continue to prompt us to help build this weather accessibility feature.",
                    )
                  }
                  className="bg-assist hover:bg-assist/90 text-assist-foreground"
                >
                  <Cloud className="h-4 w-4 mr-2" />
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
                This feature will integrate with weather APIs (such as
                OpenWeatherMap) to provide real-time weather data. It will
                include geolocation services for automatic location detection
                and allow manual location input for checking weather in other
                cities. Please provide feedback on specific weather information
                you'd like to hear spoken aloud.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
