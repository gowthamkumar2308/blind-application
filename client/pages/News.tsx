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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Newspaper,
  Pause,
  Globe,
  Clock,
  Headphones,
  Play,
  Volume2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publishedAt: string;
  source: string;
  readTime: number;
}

const mockNewsData: NewsArticle[] = [
  {
    id: "1",
    title: "Technology Breakthrough in Accessibility Software",
    summary:
      "New AI-powered tools are making digital content more accessible to visually impaired users worldwide.",
    content:
      "Researchers have developed groundbreaking artificial intelligence software that can automatically generate audio descriptions for images and videos in real-time. This technology promises to make social media, websites, and digital content significantly more accessible to blind and visually impaired users. The software uses advanced machine learning algorithms to analyze visual content and create detailed, contextual descriptions that are then converted to speech. Early testing shows remarkable accuracy in describing complex scenes, text within images, and even emotional context. Major tech companies are already showing interest in integrating this technology into their platforms.",
    category: "Technology",
    publishedAt: "2024-01-15T10:30:00Z",
    source: "TechNews Daily",
    readTime: 3,
  },
  {
    id: "2",
    title: "Global Climate Summit Reaches Historic Agreement",
    summary:
      "World leaders commit to unprecedented climate action with new binding agreements on renewable energy.",
    content:
      "At the Global Climate Summit in Geneva, representatives from 195 countries reached a historic agreement on climate change mitigation. The accord includes binding commitments to reduce carbon emissions by 50% by 2030 and achieve net-zero emissions by 2050. Key provisions include massive investments in renewable energy infrastructure, protection of biodiversity hotspots, and financial support for developing nations to transition to clean energy. Environmental scientists are calling this the most significant climate agreement since the Paris Accord. The implementation will begin immediately with quarterly progress reviews.",
    category: "Environment",
    publishedAt: "2024-01-15T08:15:00Z",
    source: "Global News Network",
    readTime: 4,
  },
  {
    id: "3",
    title:
      "హైదరాబాద్‌లో కొత్త మెట్రో లైన్ ప్రారంభం (New Metro Line Opens in Hyderabad)",
    summary:
      "హైదరాబాద్ మెట్ర��� రైల్ యొక్క కొత్త లైన్ నేడు ప్రజల సేవకు అందుబాటులోకి వచ్చింది.",
    content:
      "హైదరాబాద్ మెట్రో రైల్ యొక్క కొత్త లైన్-3 నేడు అధికారికంగా ప్రారంభమైంది. ఈ లైన్ హైటెక్ సిటీ నుండి షంషాబాద్ విమానాశ్రయం వరకు విస్తరించి ఉంది. మొత్తం 32 కిలోమీటర్ల పొడవున్న ఈ లైన్‌లో 24 స్టేషన్లు ఉన్నాయి. రోజుకు 3 లక్షల మంది ప్రయాణికులు ఈ సేవను ఉపయోగించగలరని అంచనా వేయబడింది. ఈ కొత్త లైన్ వల్ల నగర రవాణా వ్యవస్థ మరింత మెరుగుపడుతుందని అధికారులు తెలిపారు.",
    category: "స్థానిక వార్తలు",
    publishedAt: "2024-01-15T06:45:00Z",
    source: "తెలుగు న్యూస్ 24",
    readTime: 2,
  },
  {
    id: "4",
    title: "Medical Breakthrough in Gene Therapy",
    summary:
      "Scientists develop new gene therapy treatment that shows promising results for inherited blindness.",
    content:
      "A team of international researchers has achieved a significant breakthrough in gene therapy for treating inherited blindness. The experimental treatment, called LCA-GT01, has shown remarkable success in restoring partial vision to patients with Leber congenital amaurosis, a rare genetic disorder that causes severe vision loss from birth. In clinical trials, 8 out of 10 patients experienced measurable improvement in their vision within six months of treatment. The therapy works by introducing healthy copies of genes directly into retinal cells using a modified virus. This development offers hope for thousands of people worldwide affected by genetic forms of blindness.",
    category: "Health",
    publishedAt: "2024-01-14T14:20:00Z",
    source: "Medical Journal Weekly",
    readTime: 3,
  },
  {
    id: "5",
    title: "Space Mission Successfully Lands on Mars",
    summary:
      "The latest Mars rover mission has successfully landed and begun its exploration of the Red Planet.",
    content:
      "NASA's newest Mars rover, Explorer-7, has successfully touched down on the Martian surface after a nine-month journey from Earth. The rover is equipped with advanced instruments for detecting signs of past microbial life and analyzing the planet's geological composition. Initial data transmission confirms all systems are operational, and the rover has already begun sending high-resolution images of its landing site in Crater Valley. Scientists are particularly excited about the rover's ability to drill deep core samples and its sophisticated laboratory equipment for chemical analysis. The mission is expected to last at least two Earth years.",
    category: "Science",
    publishedAt: "2024-01-14T11:30:00Z",
    source: "Space Today",
    readTime: 3,
  },
  {
    id: "6",
    title: "Economic Growth Reaches Five-Year High",
    summary:
      "National economic indicators show strongest growth in five years, driven by technology and renewable energy sectors.",
    content:
      "The national economy has achieved its highest growth rate in five years, with GDP expanding by 4.2% in the last quarter. Economists attribute this growth to robust performance in the technology sector, increased investment in renewable energy projects, and strong consumer spending. Employment rates have also improved significantly, with unemployment dropping to 3.8%, the lowest level since 2019. The technology sector alone added over 200,000 new jobs, while green energy initiatives contributed to a 15% increase in manufacturing employment. Financial markets have responded positively, with major indices reaching new record highs.",
    category: "Business",
    publishedAt: "2024-01-14T09:15:00Z",
    source: "Economic Times",
    readTime: 3,
  },
];

export default function News() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [currentlyReading, setCurrentlyReading] = useState<string | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const speak = (text: string, lang: string = "en-US") => {
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

        performSpeech(text, lang, voices);
      };

      waitForVoices();
    } catch (error) {
      console.error("Error in speech synthesis setup:", error);
      setIsSpeaking(false);
    }
  };

  const performSpeech = (
    text: string,
    targetLang: string,
    voices: SpeechSynthesisVoice[],
  ) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);

      // Find the best voice for the target language
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
            // Final fallback to English
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
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlyReading(null);
      };
      utterance.onerror = (error) => {
        // Safe error logging
        const safeErrorInfo = {
          type: String(error?.type || "unknown"),
          error: String(error?.error || "unknown"),
          message: String(error?.message || "unknown"),
        };

        console.error("News speech synthesis error:", safeErrorInfo);
        setIsSpeaking(false);
        setCurrentlyReading(null);

        // Try fallback with English if Telugu fails
        if (targetLang === "te-IN" && !text.includes("voice not available")) {
          setTimeout(() => {
            const fallbackText = `Telugu voice not available. The article was: ${text.substring(0, 100)}...`;
            performSpeech(fallbackText, "en-US", voices);
          }, 500);
        }
      };

      // Additional check before speaking
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        console.log("Still speaking/pending, waiting...");
        setTimeout(() => performSpeech(text, targetLang, voices), 500);
        return;
      }

      console.log("News: Attempting to speak:", {
        text: text.substring(0, 50),
        targetLang,
        voiceSelected: !!selectedVoice,
      });
      speechSynthesis.speak(utterance);
    } catch (speakError) {
      console.error("Error during news speech synthesis:", {
        message: String(speakError?.message || "Unknown error"),
        name: String(speakError?.name || "Unknown"),
      });
      setIsSpeaking(false);
      setCurrentlyReading(null);
    }
  };

  const speakTelugu = (text: string) => {
    speak(text, "te-IN");
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentlyReading(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "News Reader loaded. Browse and listen to the latest news headlines from multiple categories. Full articles can be read aloud with voice controls.",
      );
      setTimeout(() => {
        speakTelugu(
          "న్యూస్ రీడర్ లోడ్ చేయబడింది. అనేక వర్గాల నుండి తాజా వార్తా శీర్షికలను బ్రౌజ్ చేయండి మరియు వినండి.",
        );
      }, 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    "all",
    "Technology",
    "Health",
    "Science",
    "Business",
    "Environment",
    "స్థానిక వార్తలు",
  ];

  const filteredNews =
    selectedCategory === "all"
      ? mockNewsData
      : mockNewsData.filter((article) => article.category === selectedCategory);

  const readHeadlines = () => {
    const headlines = filteredNews
      .slice(0, 5)
      .map((article, index) => `Headline ${index + 1}: ${article.title}`)
      .join(". ");

    speak(`Here are the top headlines: ${headlines}`);
  };

  const readArticleSummary = (article: NewsArticle) => {
    setCurrentlyReading(article.id);

    // Detect Telugu content more comprehensively
    const isTeluguContent =
      article.category === "స్థానిక వార్తలు" ||
      /[\u0C00-\u0C7F]/.test(article.title) ||
      /[\u0C00-\u0C7F]/.test(article.summary) ||
      article.source.includes("తెలుగు");

    const language = isTeluguContent ? "te-IN" : "en-US";

    console.log("Reading article summary:", {
      title: article.title.substring(0, 30),
      isTeluguContent,
      language,
      category: article.category,
    });

    speak(
      `${article.title}. Published by ${article.source}. ${article.summary}`,
      language,
    );
  };

  const readFullArticle = (article: NewsArticle) => {
    setCurrentlyReading(article.id);
    setSelectedArticle(article);

    // Detect Telugu content more comprehensively
    const isTeluguContent =
      article.category === "స్థానిక వార్తలు" ||
      /[\u0C00-\u0C7F]/.test(article.title) ||
      /[\u0C00-\u0C7F]/.test(article.content) ||
      article.source.includes("తెలుగు");

    const language = isTeluguContent ? "te-IN" : "en-US";

    console.log("Reading full article:", {
      title: article.title.substring(0, 30),
      isTeluguContent,
      language,
      category: article.category,
    });

    speak(
      `Reading full article: ${article.title}. ${article.content}`,
      language,
    );
  };

  const refreshNews = () => {
    setIsLoadingNews(true);
    speak("Refreshing news feed...");

    setTimeout(() => {
      setIsLoadingNews(false);
      speak("News feed updated with latest articles.");
    }, 2000);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

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
                  {isSpeaking ? "Reading" : "Ready"}
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                News Controls
              </CardTitle>
              <CardDescription>
                Browse news by category and listen to articles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={readHeadlines}
                  disabled={isSpeaking}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Read Top Headlines
                </Button>

                <Button
                  onClick={refreshNews}
                  disabled={isLoadingNews}
                  variant="outline"
                >
                  {isLoadingNews ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      </div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh News
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* News Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews.map((article) => (
              <Card
                key={article.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  currentlyReading === article.id
                    ? "ring-2 ring-accent shadow-lg"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {article.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>{article.readTime} min read</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => readArticleSummary(article)}
                      disabled={isSpeaking}
                    >
                      <Volume2 className="h-3 w-3 mr-1" />
                      Summary
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => readFullArticle(article)}
                      disabled={isSpeaking}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Read Full
                    </Button>

                    {currentlyReading === article.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={stopSpeaking}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Currently Reading */}
          {selectedArticle && currentlyReading === selectedArticle.id && (
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
                  Currently Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedArticle.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Source: {selectedArticle.source} • Category:{" "}
                    {selectedArticle.category}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                    <span className="text-sm">Reading article aloud...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>News Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-accent">
                    {mockNewsData.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Articles
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">
                    {categories.length - 1}
                  </p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">
                    {filteredNews.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Current Filter
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">
                    {Math.round(
                      mockNewsData.reduce(
                        (acc, article) => acc + article.readTime,
                        0,
                      ) / mockNewsData.length,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Read Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use News Reader</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Available Features:</h4>
                  <ul className="space-y-1">
                    <li>• Browse news by category</li>
                    <li>• Listen to article summaries</li>
                    <li>• Read full articles aloud</li>
                    <li>• Telugu language support</li>
                    <li>• Multiple news sources</li>
                    <li>• Real-time reading controls</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Voice Controls:</h4>
                  <ul className="space-y-1">
                    <li>• "Summary" - Listen to article overview</li>
                    <li>• "Read Full" - Complete article reading</li>
                    <li>• "Stop" - Pause current reading</li>
                    <li>• "Read Headlines" - Top stories</li>
                    <li>• Category filtering available</li>
                    <li>• Automatic language detection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
