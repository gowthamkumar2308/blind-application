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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  AlertTriangle,
  Pause,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Plus,
  Trash2,
  Send,
  CheckCircle,
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export default function SOS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Emergency Contact 1",
      email: "emergency1@example.com",
      phone: "+1-123-456-7890",
    },
  ]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [customMessage, setCustomMessage] = useState(
    "EMERGENCY: I need immediate assistance. Please help me or contact emergency services.",
  );
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [lastAlertSent, setLastAlertSent] = useState<Date | null>(null);

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
        "SOS Emergency Alert system loaded. You can now add emergency contacts and send alerts with your location via email.",
      );
      setTimeout(() => {
        speakTelugu(
          "ఎస్ ఓ ఎస్ అత్యవసర హెచ్చరిక వ్యవస్థ లోడ్ చేయబడింది. మీరు ఇప్పుడు అత్యవసర పరిచయాలను జోడించవచ్చు మరియు ఇమెయిల్ ద్వారా మీ స్థానంతో హెచ్చరికలను పంపవచ్చు.",
        );
      }, 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    speak("Getting your current location...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
          };
          setLocation(locationData);
          setIsGettingLocation(false);
          speak(
            `Location obtained. Latitude: ${locationData.latitude.toFixed(6)}, Longitude: ${locationData.longitude.toFixed(6)}`,
          );
        },
        (error) => {
          setIsGettingLocation(false);
          speak(
            "Unable to get location. Please check your location permissions.",
          );
          console.error("Location error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    } else {
      setIsGettingLocation(false);
      speak("Geolocation is not supported by this browser.");
    }
  };

  const addContact = () => {
    if (newContact.name && newContact.email) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: "", email: "", phone: "" });
      speak(`Emergency contact ${contact.name} added successfully.`);
    } else {
      speak("Please enter both name and email address.");
    }
  };

  const removeContact = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    setContacts(contacts.filter((c) => c.id !== id));
    speak(`Contact ${contact?.name} removed.`);
  };

  const sendEmergencyAlert = async () => {
    if (contacts.length === 0) {
      speak("No emergency contacts added. Please add contacts first.");
      return;
    }

    setIsSendingAlert(true);
    speak("Sending emergency alert to all contacts...");

    try {
      // Get location if not already available
      if (!location) {
        await new Promise<void>((resolve, reject) => {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const locationData: LocationData = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  timestamp: Date.now(),
                };
                setLocation(locationData);
                resolve();
              },
              () => reject(),
              { enableHighAccuracy: true, timeout: 5000 },
            );
          } else {
            reject();
          }
        });
      }

      // Simulate sending emails (in a real app, you'd call your backend API)
      const emailData = {
        contacts: contacts,
        message: customMessage,
        location: location,
        timestamp: new Date().toISOString(),
        emergencyType: "General Emergency",
      };

      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setLastAlertSent(new Date());
      setIsSendingAlert(false);

      speak(
        `Emergency alert sent successfully to ${contacts.length} contacts via email. Location and emergency message have been shared.`,
      );

      setTimeout(() => {
        speakTelugu(
          "అత్యవసర హెచ్చరిక విజయవంతంగా పంపబడింది. స్థానం మరియు అత్యవసర సందేశం భాగస్వామ్యం చేయబడ్డాయి.",
        );
      }, 3000);

      console.log("Emergency alert data:", emailData);
    } catch (error) {
      setIsSendingAlert(false);
      speak(
        "Failed to send emergency alert. Please try again or contact emergency services directly.",
      );
    }
  };

  const quickMessages = [
    "EMERGENCY: I need immediate assistance. Please help me or contact emergency services.",
    "MEDICAL EMERGENCY: I need medical assistance at my current location.",
    "SAFETY CONCERN: I feel unsafe and need someone to check on me.",
    "ACCIDENT: I've been in an accident and need help.",
    "అత్యవసరం: నాకు తక్షణ సహాయం అవసరం. దయచేసి నాకు సహాయం చేయండి లేదా అత్యవసర సేవలను సంప్రదించండి.",
  ];

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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Emergency Alert Button */}
          <Card className="border-emergency/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-emergency flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 mr-2" />
                Emergency Alert
              </CardTitle>
              <CardDescription>
                Send immediate alert to all emergency contacts with your
                location
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button
                onClick={sendEmergencyAlert}
                disabled={isSendingAlert || contacts.length === 0}
                className="bg-emergency hover:bg-emergency/90 text-emergency-foreground text-xl px-12 py-6"
                size="lg"
              >
                {isSendingAlert ? (
                  <>
                    <div className="animate-spin h-6 w-6 mr-3">
                      <div className="h-6 w-6 border-3 border-current border-t-transparent rounded-full" />
                    </div>
                    Sending Alert...
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6 mr-3" />
                    SEND EMERGENCY ALERT
                  </>
                )}
              </Button>

              {lastAlertSent && (
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    Last alert sent: {lastAlertSent.toLocaleString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  {location ? (
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Location Available
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Lat: {location.latitude.toFixed(6)}, Lng:{" "}
                        {location.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accuracy: ±{Math.round(location.accuracy)}m
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-orange-600">
                      Location not available
                    </p>
                  )}
                </div>
                <Button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  variant="outline"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      </div>
                      Getting...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Location
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Emergency Contacts ({contacts.length})
                </CardTitle>
                <CardDescription>
                  People who will receive your emergency alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                      {contact.phone && (
                        <p className="text-xs text-muted-foreground">
                          {contact.phone}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => removeContact(contact.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {contacts.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No emergency contacts added yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    placeholder="+1-123-456-7890"
                  />
                </div>
                <Button onClick={addContact} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Custom Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Emergency Message
              </CardTitle>
              <CardDescription>
                Customize the message sent to your emergency contacts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your emergency message..."
                className="min-h-[100px]"
              />

              <div>
                <Label className="text-sm font-medium">Quick Messages:</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {quickMessages.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto p-2 text-xs"
                      onClick={() => {
                        setCustomMessage(message);
                        speak(
                          `Message selected: ${message.substring(0, 50)}...`,
                        );
                      }}
                    >
                      {message.length > 80
                        ? `${message.substring(0, 80)}...`
                        : message}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-200">
                Important Emergency Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700 dark:text-orange-300">
              <ul className="space-y-2 text-sm">
                <li>
                  • In life-threatening emergencies, call your local emergency
                  number (911, 112, etc.) immediately
                </li>
                <li>
                  • This system sends emails and may take time to reach
                  recipients
                </li>
                <li>
                  • Ensure your emergency contacts check email regularly and
                  know to respond quickly
                </li>
                <li>
                  • Test this system regularly with your emergency contacts
                </li>
                <li>
                  • Keep your phone charged and location services enabled for
                  accurate positioning
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
