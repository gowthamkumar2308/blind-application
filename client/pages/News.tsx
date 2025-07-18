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
  Newspaper,
  Pause,
  Globe,
  Clock,
  Headphones,
} from "lucide-react";

export default function News() {
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
        "News Reader loaded. This feature will read you the latest news headlines and full articles from trusted sources, organized by category.",
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
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
              <div className="p-2 rounded-full bg-accent text-accent-foreground">
                <Newspaper className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  News Reader
                </h1>
                <p className="text-sm text-muted-foreground">
                  Audio news headlines and articles
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
          <Card className="mb-8 border-accent/20">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-accent text-accent-foreground mb-4">
                <Newspaper className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl">News Reader</CardTitle>
              <CardDescription>
                This feature is coming soon! It will read you the latest news
                headlines and full articles from trusted sources around the
                world.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <Headphones className="h-8 w-8 mb-2 text-accent-foreground" />
                  <h3 className="font-semibold">Audio Headlines</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Top stories read aloud with summaries
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <Globe className="h-8 w-8 mb-2 text-accent-foreground" />
                  <h3 className="font-semibold">Multiple Sources</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    News from trusted publications worldwide
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                  <Clock className="h-8 w-8 mb-2 text-accent-foreground" />
                  <h3 className="font-semibold">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Latest breaking news and updates
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  This comprehensive news feature will include:
                </p>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent-foreground mr-3" />
                    Top headlines by category
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent-foreground mr-3" />
                    Full article reading
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent-foreground mr-3" />
                    Customizable news sources
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent-foreground mr-3" />
                    Breaking news alerts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent-foreground mr-3" />
                    Local and international news
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={() =>
                    speak(
                      "This news reading feature is currently in development. It will integrate with news APIs to provide comprehensive spoken news updates from multiple trusted sources. Please continue to prompt us to help build this news accessibility feature.",
                    )
                  }
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Newspaper className="h-4 w-4 mr-2" />
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
                This feature will integrate with news APIs (such as NewsAPI,
                Guardian API, or RSS feeds) to fetch the latest headlines and
                articles. It will include categorization by topics like
                Politics, Technology, Sports, Entertainment, and more. Users
                will be able to customize their news preferences and reading
                speed. Please share your preferred news sources and categories
                to help us build this feature.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
