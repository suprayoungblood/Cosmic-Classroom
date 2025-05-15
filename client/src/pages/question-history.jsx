import React, { useEffect, useState } from "react";
import { Typography, Alert, Card, CardBody, Spinner } from "@material-tailwind/react";
import { getQuestionHistory } from "../api/questions";
import { useAuth } from "../contexts/AuthContext";
import PageTitle from "../widgets/layout/page-title";

export function QuestionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestionHistorySafely();
  }, []);

  // Safely fetch question history
  const fetchQuestionHistorySafely = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Demo mode handling
      if (localStorage.getItem('demo_mode') === 'true') {
        // Create demo history data
        const demoHistory = [
          {
            id: 1,
            question: "How far is Mars from Earth?",
            answer: "The distance between Earth and Mars varies due to their elliptical orbits. At their closest approach (perihelic opposition), Mars is about 54.6 million kilometers from Earth. At their farthest (aphelion), they can be about 401 million kilometers apart. The average distance between Earth and Mars is about 225 million kilometers.",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            userId: user?.id || 1
          },
          {
            id: 2,
            question: "What is a black hole?",
            answer: "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. They are formed from the remnants of massive stars that have collapsed under their own gravity after exhausting their nuclear fuel.",
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            userId: user?.id || 1
          },
          {
            id: 3,
            question: "How old is the universe?",
            answer: "According to the most recent measurements and the standard cosmological model (Lambda-CDM), the universe is approximately 13.8 billion years old. This age estimate comes from various observations, including measurements of the cosmic microwave background radiation by missions like the Planck satellite, and studies of the oldest stars and galaxies.",
            createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            userId: user?.id || 1
          },
          {
            id: 4,
            question: "What are exoplanets?",
            answer: "Exoplanets are planets that orbit stars outside our solar system. Since the first confirmed discovery in 1992, astronomers have identified thousands of exoplanets using various detection methods, including transit photometry (observing the slight dimming of a star as a planet passes in front) and radial velocity measurements (detecting the 'wobble' of a star due to a planet's gravitational influence). The study of exoplanets is crucial for understanding planet formation and potentially finding habitable worlds.",
            createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
            userId: user?.id || 1
          },
          {
            id: 5,
            question: "What is dark matter?",
            answer: "Dark matter is a hypothetical form of matter that is thought to account for approximately 85% of the matter in the universe. It does not interact with the electromagnetic force, making it difficult to detect directly as it doesn't emit, absorb, or reflect light. Its existence is inferred from gravitational effects on visible matter and the cosmic microwave background. Despite numerous experiments, the exact nature of dark matter remains one of the biggest mysteries in astrophysics.",
            createdAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
            userId: user?.id || 1
          }
        ];
        
        setHistory(demoHistory);
        setLoading(false);
        return;
      }
      
      // Add a delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch question history with robust error handling
      const historyData = await getQuestionHistory();
      
      if (Array.isArray(historyData)) {
        setHistory(historyData);
      } else {
        setHistory([]);
        setError("Received invalid data format from server");
      }
    } catch (error) {
      console.error("Error fetching question history:", error);
      setError("Failed to load your question history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Format the date in a user-friendly way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-cosmic-background text-cosmic-text pb-20">
      <PageTitle heading="Your Question History" />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert color="red" className="mb-6">
            {error}
          </Alert>
        )}
        
        <div className="mb-8">
          <Typography variant="lead" className="text-cosmic-text-secondary">
            Review all your previous space questions and answers.
          </Typography>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="h-12 w-12 text-cosmic-primary" />
          </div>
        ) : history.length === 0 ? (
          <Card className="bg-cosmic-card-bg/60 border border-cosmic-border">
            <CardBody className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-cosmic-background flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-cosmic-text-muted">
                  <path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z" />
                </svg>
              </div>
              <Typography variant="h5" color="white" className="mb-2">
                No questions yet
              </Typography>
              <Typography className="text-cosmic-text-secondary">
                Your space exploration journey will be recorded here once you start asking questions.
              </Typography>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <Card key={item.id} className="bg-cosmic-card-bg/80 border border-cosmic-border">
                <CardBody className="p-6">
                  <div className="mb-4">
                    <Typography variant="h5" className="font-medium text-cosmic-text-primary mb-1">
                      {item.question}
                    </Typography>
                    <Typography variant="small" className="text-cosmic-text-muted">
                      {formatDate(item.createdAt)}
                    </Typography>
                  </div>
                  
                  <div className="p-4 bg-cosmic-background/50 rounded-lg border border-cosmic-border/50">
                    <Typography className="text-cosmic-text">
                      {item.answer.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionHistory;