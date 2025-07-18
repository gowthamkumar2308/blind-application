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
  Volume2,
  ArrowLeft,
  Calculator as CalculatorIcon,
  Pause,
  RotateCcw,
  Backspace,
} from "lucide-react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

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

  // Welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        "Talking calculator loaded. Use the buttons or keyboard to perform calculations. All results will be spoken aloud.",
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key >= "0" && key <= "9") {
        inputDigit(parseInt(key));
      } else if (key === ".") {
        inputDecimal();
      } else if (key === "=" || key === "Enter") {
        performCalculation();
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        performOperation(key);
      } else if (key === "Escape" || key === "c" || key === "C") {
        clear();
      } else if (key === "Backspace") {
        backspace();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const inputDigit = (digit: number) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
    speak(String(digit));
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
    speak("decimal point");
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    speak("Calculator cleared");
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
    speak("backspace");
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);
    const operationNames: { [key: string]: string } = {
      "+": "plus",
      "-": "minus",
      "*": "times",
      "/": "divided by",
    };

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    speak(operationNames[nextOperation] || nextOperation);
  };

  const calculate = (
    firstOperand: number,
    secondOperand: number,
    operation: string,
  ): number => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "*":
        return firstOperand * secondOperand;
      case "/":
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);

      // Add to history
      setHistory((prev) => [calculation, ...prev.slice(0, 9)]);

      // Speak the result
      speak(`The result is ${newValue}`);
    }
  };

  const speakCurrentDisplay = () => {
    speak(`Current display shows ${display}`);
  };

  const buttons = [
    {
      label: "C",
      onClick: clear,
      className:
        "bg-destructive hover:bg-destructive/90 text-destructive-foreground col-span-2",
    },
    { label: "⌫", onClick: backspace, className: "bg-muted hover:bg-muted/80" },
    {
      label: "÷",
      onClick: () => performOperation("/"),
      className: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },

    {
      label: "7",
      onClick: () => inputDigit(7),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "8",
      onClick: () => inputDigit(8),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "9",
      onClick: () => inputDigit(9),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "×",
      onClick: () => performOperation("*"),
      className: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },

    {
      label: "4",
      onClick: () => inputDigit(4),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "5",
      onClick: () => inputDigit(5),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "6",
      onClick: () => inputDigit(6),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "−",
      onClick: () => performOperation("-"),
      className: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },

    {
      label: "1",
      onClick: () => inputDigit(1),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "2",
      onClick: () => inputDigit(2),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "3",
      onClick: () => inputDigit(3),
      className: "bg-card hover:bg-muted",
    },
    {
      label: "+",
      onClick: () => performOperation("+"),
      className: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },

    {
      label: "0",
      onClick: () => inputDigit(0),
      className: "bg-card hover:bg-muted col-span-2",
    },
    { label: ".", onClick: inputDecimal, className: "bg-card hover:bg-muted" },
    {
      label: "=",
      onClick: performCalculation,
      className: "bg-voice hover:bg-voice/90 text-voice-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/10">
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
              <div className="p-2 rounded-full bg-primary text-primary-foreground">
                <CalculatorIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Talking Calculator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Calculations with voice feedback
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
        <div className="max-w-md mx-auto">
          {/* Display */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="bg-muted rounded-lg p-6 mb-4">
                <div
                  className="text-right text-4xl font-mono font-bold min-h-[3rem] flex items-center justify-end break-all"
                  role="region"
                  aria-live="polite"
                  aria-label="Calculator display"
                >
                  {display}
                </div>
              </div>

              <Button
                onClick={speakCurrentDisplay}
                variant="outline"
                className="w-full"
                disabled={isSpeaking}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Speak Current Value
              </Button>
            </CardContent>
          </Card>

          {/* Calculator Buttons */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={`h-16 text-xl font-semibold transition-all hover:scale-105 ${button.className}`}
                    aria-label={
                      button.label === "⌫"
                        ? "Backspace"
                        : button.label === "÷"
                          ? "Divide"
                          : button.label === "×"
                            ? "Multiply"
                            : button.label === "−"
                              ? "Subtract"
                              : button.label === "+"
                                ? "Add"
                                : button.label === "="
                                  ? "Equals"
                                  : button.label === "."
                                    ? "Decimal point"
                                    : button.label === "C"
                                      ? "Clear"
                                      : button.label
                    }
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
              <CardDescription>
                You can also use your keyboard for calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Numbers: 0-9</div>
                <div>Decimal: .</div>
                <div>Add: +</div>
                <div>Subtract: -</div>
                <div>Multiply: *</div>
                <div>Divide: /</div>
                <div>Equals: Enter or =</div>
                <div>Clear: Escape or C</div>
                <div>Backspace: ⌫</div>
                <div>Speak: Click display</div>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Calculations</CardTitle>
                <CardDescription>Your last few calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.map((calculation, index) => (
                    <div
                      key={index}
                      className="p-2 bg-muted rounded text-sm font-mono cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => speak(calculation)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          speak(calculation);
                        }
                      }}
                      aria-label={`Calculation: ${calculation}. Click to hear it spoken.`}
                    >
                      {calculation}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
