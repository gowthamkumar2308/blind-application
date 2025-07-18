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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Cloud,
  Pause,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Eye,
  Gauge,
  RefreshCw,
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

export default function Weather() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const speak = (text: string, lang: string = "en-US") => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const speakTelugu = (text: string) => {
    speak(text, "te-IN");
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "Weather Reader loaded. You can check current weather conditions and forecasts for any location. Location detection and sample weather data are available.",
      );
      setTimeout(() => {
        speakTelugu(
          "వాతావరణ రీడర్ లోడ్ చేయబడింది. మీరు ఏదైనా ప్రదేశానికి ప్రస్తుత వాతావరణ పరిస్థితులు మరియు అంచనాలను తనిఖీ చేయవచ్చు.",
        );
      }, 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Mock weather data generator
  const generateMockWeatherData = (locationName: string): WeatherData => {
    const conditions = [
      "Sunny",
      "Partly Cloudy",
      "Cloudy",
      "Light Rain",
      "Scattered Showers",
      "Clear",
    ];
    const randomCondition =
      conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = Math.floor(Math.random() * 30) + 10; // 10-40°C

    return {
      location: locationName,
      temperature: baseTemp,
      feelsLike: baseTemp + Math.floor(Math.random() * 6) - 3,
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      visibility: Math.floor(Math.random() * 5) + 8, // 8-12 km
      pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
      uvIndex: Math.floor(Math.random() * 11), // 0-10
      forecast: [
        {
          day: "Today",
          high: baseTemp + 2,
          low: baseTemp - 5,
          condition: randomCondition,
        },
        {
          day: "Tomorrow",
          high: baseTemp + Math.floor(Math.random() * 6) - 3,
          low: baseTemp - Math.floor(Math.random() * 8) - 2,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
        },
        {
          day: "Wednesday",
          high: baseTemp + Math.floor(Math.random() * 6) - 3,
          low: baseTemp - Math.floor(Math.random() * 8) - 2,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
        },
        {
          day: "Thursday",
          high: baseTemp + Math.floor(Math.random() * 6) - 3,
          low: baseTemp - Math.floor(Math.random() * 8) - 2,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
        },
        {
          day: "Friday",
          high: baseTemp + Math.floor(Math.random() * 6) - 3,
          low: baseTemp - Math.floor(Math.random() * 8) - 2,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
        },
      ],
    };
  };

  const getCurrentLocationWeather = () => {
    setIsLoading(true);
    speak("Getting weather for your current location...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use the coordinates to fetch weather data
          const mockLocationName = "Your Current Location";
          setCurrentLocation(mockLocationName);
          const mockData = generateMockWeatherData(mockLocationName);
          setWeatherData(mockData);
          setIsLoading(false);
          speakWeatherReport(mockData);
        },
        (error) => {
          setIsLoading(false);
          speak(
            "Unable to get your location. Please enter a location manually.",
          );
        },
        { timeout: 10000 },
      );
    } else {
      setIsLoading(false);
      speak("Geolocation is not supported by this browser.");
    }
  };

  const getWeatherForLocation = () => {
    if (!location.trim()) {
      speak("Please enter a location first.");
      return;
    }

    setIsLoading(true);
    speak(`Getting weather information for ${location}...`);

    // Simulate API call delay
    setTimeout(() => {
      const mockData = generateMockWeatherData(location);
      setWeatherData(mockData);
      setIsLoading(false);
      speakWeatherReport(mockData);
    }, 2000);
  };

  const speakWeatherReport = (data: WeatherData) => {
    const report = `Weather report for ${data.location}. Current temperature is ${data.temperature} degrees Celsius, feels like ${data.feelsLike} degrees. Condition: ${data.condition}. Humidity is ${data.humidity} percent. Wind speed is ${data.windSpeed} kilometers per hour. Visibility is ${data.visibility} kilometers. Today's forecast: High of ${data.forecast[0].high} degrees, low of ${data.forecast[0].low} degrees, with ${data.forecast[0].condition} conditions.`;

    speak(report);

    setTimeout(() => {
      speakTelugu(
        `${data.location} కోసం వాతావరణ నివేదిక. ప్రస్తుత ఉష్ణోగ్రత ${data.temperature} డిగ్రీలు సెల్సియస్. పరిస్థితి: ${data.condition}. తేమ ${data.humidity} శాతం.`,
      );
    }, 8000);
  };

  const loadSampleLocations = () => {
    const sampleLocations = [
      "Hyderabad",
      "New York",
      "London",
      "Tokyo",
      "Mumbai",
      "Sydney",
    ];
    const randomLocation =
      sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    setLocation(randomLocation);
    speak(`Sample location selected: ${randomLocation}`);
  };

  const getWeatherIcon = (condition: string) => {
    if (
      condition.toLowerCase().includes("sunny") ||
      condition.toLowerCase().includes("clear")
    ) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    } else if (condition.toLowerCase().includes("rain")) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Location Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Get Weather Information
              </CardTitle>
              <CardDescription>
                Enter a location or use your current position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city name (e.g., Hyderabad, New York)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        getWeatherForLocation();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={getWeatherForLocation}
                  disabled={isLoading || !location.trim()}
                  className="bg-assist hover:bg-assist/90 text-assist-foreground"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      </div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Cloud className="h-4 w-4 mr-2" />
                      Get Weather
                    </>
                  )}
                </Button>

                <Button
                  onClick={getCurrentLocationWeather}
                  disabled={isLoading}
                  variant="outline"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Current Location
                </Button>

                <Button onClick={loadSampleLocations} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sample Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weather Display */}
          {weatherData && (
            <>
              {/* Current Weather */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getWeatherIcon(weatherData.condition)}
                    <span className="ml-2">Current Weather</span>
                  </CardTitle>
                  <CardDescription>{weatherData.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {weatherData.temperature}°C
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Feels like {weatherData.feelsLike}°C
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Cloud className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{weatherData.condition}</p>
                        <p className="text-sm text-muted-foreground">
                          Condition
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{weatherData.humidity}%</p>
                        <p className="text-sm text-muted-foreground">
                          Humidity
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Wind className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">
                          {weatherData.windSpeed} km/h
                        </p>
                        <p className="text-sm text-muted-foreground">Wind</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Visibility: {weatherData.visibility} km
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Pressure: {weatherData.pressure} hPa
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        UV Index: {weatherData.uvIndex}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={() => speakWeatherReport(weatherData)}
                      variant="outline"
                      disabled={isSpeaking}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Read Weather Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>5-Day Forecast</CardTitle>
                  <CardDescription>Extended weather outlook</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => {
                          speak(
                            `${day.day}: ${day.condition}, high ${day.high} degrees, low ${day.low} degrees`,
                          );
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            speak(
                              `${day.day}: ${day.condition}, high ${day.high} degrees, low ${day.low} degrees`,
                            );
                          }
                        }}
                      >
                        <div className="text-center">
                          <p className="font-medium">{day.day}</p>
                          <div className="my-2">
                            {getWeatherIcon(day.condition)}
                          </div>
                          <p className="text-sm">{day.condition}</p>
                          <div className="mt-2">
                            <p className="font-bold">{day.high}°</p>
                            <p className="text-sm text-muted-foreground">
                              {day.low}°
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        const forecastText = weatherData.forecast
                          .map(
                            (day) =>
                              `${day.day}: ${day.condition}, high ${day.high} degrees, low ${day.low} degrees`,
                          )
                          .join(". ");
                        speak(`5-day forecast: ${forecastText}`);
                      }}
                      variant="outline"
                      disabled={isSpeaking}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Read Full Forecast
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Sample Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access Locations</CardTitle>
              <CardDescription>
                Click any location to get weather instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  "Hyderabad",
                  "Mumbai",
                  "Delhi",
                  "Bangalore",
                  "Chennai",
                  "Kolkata",
                  "New York",
                  "London",
                  "Tokyo",
                  "Sydney",
                  "Paris",
                  "Dubai",
                ].map((city) => (
                  <Button
                    key={city}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLocation(city);
                      speak(`Selected ${city}`);
                    }}
                    className="text-left justify-start"
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Weather Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Available Information:</h4>
                  <ul className="space-y-1">
                    <li>• Current temperature and conditions</li>
                    <li>• "Feels like" temperature</li>
                    <li>• Humidity and wind speed</li>
                    <li>• Visibility and pressure</li>
                    <li>• UV index information</li>
                    <li>• 5-day weather forecast</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">How to Use:</h4>
                  <ul className="space-y-1">
                    <li>• Enter any city name for weather</li>
                    <li>• Use "Current Location" for local weather</li>
                    <li>• Click forecast days to hear details</li>
                    <li>• All information is read aloud</li>
                    <li>• Sample locations provided for testing</li>
                    <li>• Supports Telugu voice output</li>
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
