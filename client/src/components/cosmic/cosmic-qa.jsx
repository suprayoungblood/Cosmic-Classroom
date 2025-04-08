import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Typography,
  Textarea,
  Button,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { askQuestion, askAuthenticatedQuestion } from "../../api/questions";

// Suggested questions by category for quick selection
const SUGGESTED_QUESTIONS = {
  planets: [
    "Why is Mars red?",
    "How many moons does Jupiter have?",
    "What makes Saturn's rings so special?",
    "Is Pluto still a planet?",
  ],
  stars: [
    "How do stars form?",
    "What happens when a star dies?",
    "How hot is the Sun?",
    "What is a black hole?",
  ],
  space_travel: [
    "How do astronauts live in space?",
    "How long does it take to get to Mars?",
    "Why do we use rockets to go to space?",
    "What was the Apollo mission?",
  ],
  aliens: [
    "Could aliens exist?",
    "How do scientists search for alien life?",
    "What are exoplanets?",
    "What would aliens probably look like?",
  ],
};

const CosmicQA = ({ user, onNewQuestion }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("planets");
  const [isSimplified, setIsSimplified] = useState(user?.age < 10); // Auto-simplify for younger kids
  
  const answerRef = useRef(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      // Choose API method based on authentication status
      const response = user
        ? await askAuthenticatedQuestion(question)
        : await askQuestion(question);

      setAnswer(response.answer);
      
      // Notify parent component about the new Q&A
      if (user && onNewQuestion) {
        onNewQuestion(question, response.answer);
      }
    } catch (err) {
      setError("Sorry, we couldn't process your question. Please try again.");
      console.error("Error asking question:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (q) => {
    setQuestion(q);
    // Auto-submit if question is selected from suggestions
    setTimeout(() => {
      document.getElementById("question-form").dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }, 100);
  };

  // Scroll to answer when it's available
  useEffect(() => {
    if (answer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answer]);

  // Request simplified answer
  const handleSimplifyAnswer = async () => {
    if (!question) return;
    
    setLoading(true);
    try {
      const simplifiedQuestion = `Please explain in simple terms for a ${user?.age || 8} year old: ${question}`;
      const response = user
        ? await askAuthenticatedQuestion(simplifiedQuestion)
        : await askQuestion(simplifiedQuestion);
      
      setAnswer(response.answer);
    } catch (err) {
      setError("Sorry, we couldn't simplify the answer.");
    } finally {
      setLoading(false);
    }
  };

  // Request more detailed answer
  const handleMoreDetailedAnswer = async () => {
    if (!question) return;
    
    setLoading(true);
    try {
      const detailedQuestion = `Please provide a more detailed, science-based explanation for: ${question}`;
      const response = user
        ? await askAuthenticatedQuestion(detailedQuestion)
        : await askQuestion(detailedQuestion);
      
      setAnswer(response.answer);
    } catch (err) {
      setError("Sorry, we couldn't provide a more detailed answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Question input section */}
      <Card className="bg-cosmic-card-bg border border-cosmic-border shadow-cosmic overflow-hidden">
        <CardBody>
          <Typography variant="h4" color="white" className="mb-4">
            Ask Anything About Space
          </Typography>
          
          <form id="question-form" onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              size="lg"
              label="Your space question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-16 cosmic-input"
              placeholder="Example: How big is the universe? Why is Mars red?"
            />
            
            <div className="flex justify-end">
              <Button
                className="btn-primary"
                type="submit"
                disabled={loading || !question.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" /> Processing...
                  </span>
                ) : (
                  "Ask Question"
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Suggested questions section */}
      <div className="bg-cosmic-card-bg/60 rounded-xl p-6 border border-cosmic-border">
        <Typography variant="h5" color="white" className="mb-4">
          Suggested Questions
        </Typography>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(SUGGESTED_QUESTIONS).map((category) => (
            <Chip
              key={category}
              value={category.replace("_", " ")}
              className={`capitalize cursor-pointer ${
                selectedCategory === category
                  ? "bg-cosmic-primary text-white"
                  : "bg-cosmic-background/50 text-cosmic-text-secondary"
              }`}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          {SUGGESTED_QUESTIONS[selectedCategory].map((q, i) => (
            <Button
              key={i}
              variant="outlined"
              className="justify-start normal-case cosmic-suggested-question"
              onClick={() => handleSuggestedQuestion(q)}
            >
              {q}
            </Button>
          ))}
        </div>
      </div>

      {/* Answer section */}
      {(answer || loading || error) && (
        <Card ref={answerRef} className="bg-cosmic-card-bg/90 border border-cosmic-border shadow-cosmic mt-8 overflow-hidden">
          <CardBody>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-cosmic-primary flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
                </svg>
              </div>
              <Typography variant="h5" color="white">
                Cosmic Answer
              </Typography>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="cosmic-loading">
                  <div className="cosmic-planet"></div>
                  <div className="cosmic-orbit">
                    <div className="cosmic-satellite"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
                {error}
              </div>
            )}

            {answer && !loading && (
              <>
                <div className="cosmic-answer">
                  {answer.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2"
                    onClick={handleSimplifyAnswer}
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1.5-5h3v-2h-3V9.5h-2v2.5h-3v2h3v2.5h2V14z" />
                    </svg>
                    Explain Simpler
                  </Button>
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2"
                    onClick={handleMoreDetailedAnswer}
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z" />
                    </svg>
                    More Details
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CosmicQA;