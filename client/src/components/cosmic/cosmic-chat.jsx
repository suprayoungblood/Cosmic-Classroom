import React, { useState, useRef, useEffect } from "react";
import { askQuestion, askAuthenticatedQuestion } from "../../api/questions";
import { useGame } from "@/contexts/GameContext";
import GameNotifications from "@/components/game/GameNotifications";

const CosmicChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { awardXP, refreshGameData } = useGame();

  const SUGGESTED_QUESTIONS = [
    { 
      text: "What is dark matter?", 
      icon: "🌌",
      category: "Astrophysics"
    },
    { 
      text: "How do black holes form?", 
      icon: "🕳️",
      category: "Astronomy"
    },
    { 
      text: "Why is Mars red?", 
      icon: "🔴",
      category: "Planets"
    },
    { 
      text: "What causes the Aurora Borealis?", 
      icon: "🌈",
      category: "Earth & Space"
    },
    { 
      text: "How does the James Webb telescope work?", 
      icon: "🔭",
      category: "Space Tech"
    },
    { 
      text: "What is a supernova?", 
      icon: "💥",
      category: "Stars"
    }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount, but don't force focus
  useEffect(() => {
    // Only focus if user hasn't already focused on something else
    if (inputRef.current && document.activeElement === document.body) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userQuestion = inputValue;
    setInputValue("");
    
    // Add user message
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userQuestion,
      timestamp: new Date()
    }]);
    
    // Set loading state
    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'loading' }]);

    try {
      // Choose API method based on authentication status
      let response;
      
      response = user
        ? await askAuthenticatedQuestion(userQuestion)
        : await askQuestion(userQuestion);
      
      // If response is empty (should never happen with our error handling)
      if (!response) {
        console.warn("Empty response from API, using fallback");
        response = {
          answer: "I'm sorry, I couldn't connect to our knowledge database. Here's some general information: The universe is approximately 13.8 billion years old. Our solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Space exploration continues to reveal fascinating discoveries about our cosmic neighborhood.",
          gameData: null
        };
      }

      // Process game rewards if authenticated
      if (user && response.gameData) {
        try {
          // Update local game data
          refreshGameData();
          
          // Award XP in UI (this is already recorded on the server)
          const xpGained = 30; // Question XP
          awardXP(xpGained);
        } catch (gameErr) {
          console.warn("Could not update game data:", gameErr);
          // Continue with chat response even if game mechanics fail
        }
      }

      // Extract topic from question (basic implementation)
      const extractTopic = (question) => {
        const topics = [
          "planets", "stars", "galaxies", "black holes", "space travel", 
          "universe", "moon", "sun", "astronomy", "mars", "jupiter", 
          "saturn", "dark matter", "dark energy", "supernovas"
        ];
        
        const questionLower = question.toLowerCase();
        
        for (const topic of topics) {
          if (questionLower.includes(topic)) {
            return topic.charAt(0).toUpperCase() + topic.slice(1);
          }
        }
        
        return null;
      };

      // Remove loading message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.type !== 'loading');
        return [...filtered, { 
          type: 'ai', 
          content: response.answer,
          timestamp: new Date(),
          topic: extractTopic(userQuestion),
          followUps: generateFollowUpQuestions(userQuestion, response.answer)
        }];
      });
    } catch (err) {
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.type !== 'loading');
        return [...filtered, { 
          type: 'error', 
          content: "Sorry, I couldn't process your question. The server might be experiencing issues. Please try again later.",
          timestamp: new Date()
        }];
      });
      console.error("Error asking question:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFollowUpQuestions = (question, answer) => {
    // Generate contextual follow-up questions based on the original question and answer
    
    const commonFollowUps = [
      "Tell me more about this topic",
      "How does this relate to Earth?",
      "Are there any recent discoveries?"
    ];
    
    // Add more specific follow-ups based on content keywords
    let specificFollowUps = [];
    
    // Planets
    if (answer.toLowerCase().includes("planet") || question.toLowerCase().includes("planet")) {
      specificFollowUps.push("How many planets are in our solar system?");
    }
    
    // Stars
    if (answer.toLowerCase().includes("star") || question.toLowerCase().includes("star")) {
      specificFollowUps.push("What happens when a star dies?");
    }
    
    // Black holes
    if (answer.toLowerCase().includes("black hole") || question.toLowerCase().includes("black hole")) {
      specificFollowUps.push("Can anything escape a black hole?");
    }
    
    // Combine and limit to 3 follow-ups
    const allFollowUps = [...specificFollowUps, ...commonFollowUps];
    return allFollowUps.slice(0, 3);
  };

  const handleSuggestedQuestionClick = (question) => {
    setInputValue(question);
    // Auto-submit
    setTimeout(() => {
      const form = document.getElementById("chat-form");
      if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }, 100);
  };

  const handleFollowUpClick = (question) => {
    handleSuggestedQuestionClick(question);
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      ref={chatContainerRef}
      className="h-full flex flex-col bg-cosmic-background/30 rounded-xl overflow-hidden border border-cosmic-border shadow-cosmic relative z-0" 
      tabIndex="-1"
    >
      <GameNotifications />
      {/* Chat header */}
      <div className="bg-cosmic-surface/80 backdrop-blur-sm border-b border-cosmic-border p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-cosmic-gradient flex items-center justify-center shadow-md overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-6 w-6">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                <path d="M12 12v2.26" />
                <path d="m16 16-2-2" />
                <path d="M21 3v4.5" />
                <path d="M21 7.5h-4.5" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-cosmic-surface flex items-center justify-center">
              <div className="ping"></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-cosmic-text-primary font-medium">Cosmic AI Assistant</h3>
            <div className="flex items-center">
              <span className="text-xs text-cosmic-text-muted">Powered by OpenAI</span>
              <span className="inline-block mx-1.5 h-1 w-1 rounded-full bg-cosmic-text-muted"></span>
              <div className="inline-flex items-center">
                <span className="flex h-2 w-2 relative mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/50"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs text-blue-500">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Message container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">
        {/* Decorative elements */}
        <div className="cosmic-stars opacity-20 absolute inset-0 pointer-events-none"></div>
        <div className="cosmic-nebula cosmic-nebula-blue w-[500px] h-[500px] absolute left-[-200px] top-[10%] opacity-[0.03] pointer-events-none"></div>
        <div className="cosmic-nebula cosmic-nebula-amber w-[400px] h-[400px] absolute right-[-100px] bottom-[20%] opacity-[0.02] pointer-events-none"></div>
        
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
            <div className="h-16 w-16 rounded-full bg-cosmic-gradient flex items-center justify-center shadow-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-8 w-8">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                <path d="M12 12v2.26" />
                <path d="m16 16-2-2" />
                <path d="M21 3v4.5" />
                <path d="M21 7.5h-4.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-cosmic-text-primary">
              Welcome to Cosmic Chat
            </h2>
            <p className="text-cosmic-text-secondary max-w-md">
              I'm your AI space assistant. Ask me anything about astronomy, planets, space exploration, or any cosmic phenomena.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-4">
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestionClick(q.text)}
                  className="flex items-center text-left space-x-2 bg-cosmic-surface hover:bg-cosmic-surface/80 text-cosmic-text-secondary hover:text-cosmic-text-primary px-3 py-2 rounded-lg transition-colors border border-cosmic-border/30 hover:border-cosmic-border/50"
                >
                  <span className="text-xl">{q.icon}</span>
                  <span className="text-sm">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="space-y-6 py-4">
            {messages.map((message, index) => (
              <div key={index} className={`animate-fade-in message-${message.type}`}>
                {message.type === 'user' && (
                  <div className="flex justify-end mb-4">
                    <div className="flex flex-col items-end space-y-1 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-cosmic-text-muted">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        <span className="text-sm font-medium text-cosmic-text-primary">
                          {user ? user.name || 'You' : 'You'}
                        </span>
                      </div>
                      <div className="bg-cosmic-primary/10 text-cosmic-text-primary px-4 py-3 rounded-t-xl rounded-l-xl border border-cosmic-primary/20">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.type === 'ai' && (
                  <div className="flex mb-1 space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-lg bg-cosmic-gradient flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-5 w-5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          <path d="M12 12v2.26" />
                          <path d="m16 16-2-2" />
                          <path d="M21 3v4.5" />
                          <path d="M21 7.5h-4.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 max-w-[90%]">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-cosmic-text-primary">Cosmic AI</span>
                        <span className="text-xs text-cosmic-text-muted">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <div className="bg-cosmic-surface/80 text-cosmic-text-secondary px-4 py-3 rounded-r-xl rounded-b-xl border border-cosmic-border/30">
                        <div className="prose prose-sm prose-invert max-w-none">
                          {message.content.split('\n').map((paragraph, idx) => (
                            <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      {/* Follow-up questions */}
                      {message.followUps && message.followUps.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.followUps.map((question, i) => (
                            <button
                              key={i}
                              onClick={() => handleFollowUpClick(question)}
                              className="text-sm rounded-full bg-cosmic-primary/10 text-cosmic-primary border border-cosmic-primary/20 px-3 py-1 hover:bg-cosmic-primary/20 transition-colors"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="mt-2 flex space-x-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(message.content)}
                          className="text-xs text-cosmic-text-muted hover:text-cosmic-text-secondary flex items-center space-x-1 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          <span>Copy</span>
                        </button>
                        <button 
                          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message.content.slice(0, 200) + '...')}&hashtags=CosmicClassroom,Space`, '_blank')}
                          className="text-xs text-cosmic-text-muted hover:text-cosmic-text-secondary flex items-center space-x-1 transition-colors"
                        >
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.type === 'loading' && (
                  <div className="flex mb-1 space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-lg bg-cosmic-gradient flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-5 w-5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          <path d="M12 12v2.26" />
                          <path d="m16 16-2-2" />
                          <path d="M21 3v4.5" />
                          <path d="M21 7.5h-4.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 max-w-[90%]">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-cosmic-text-primary">Cosmic AI</span>
                        <span className="text-xs text-cosmic-text-muted">Typing...</span>
                      </div>
                      <div className="bg-cosmic-surface/80 text-cosmic-text-secondary px-4 py-3 rounded-r-xl rounded-b-xl border border-cosmic-border/30">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-cosmic-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="h-2 w-2 bg-cosmic-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          <div className="h-2 w-2 bg-cosmic-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.type === 'error' && (
                  <div className="flex mb-1 space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 max-w-[90%]">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-cosmic-text-primary">Error</span>
                        <span className="text-xs text-cosmic-text-muted">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-r-xl rounded-b-xl border border-red-500/20">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-cosmic-border/40 bg-cosmic-surface/80 backdrop-blur-sm p-4">
        <form id="chat-form" onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about space..."
            className="cosmic-input w-full pr-12 py-3 bg-cosmic-background border-cosmic-border/40 focus:border-cosmic-primary/50 rounded-xl placeholder:text-cosmic-text-muted/70"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cosmic-primary disabled:bg-cosmic-primary/50 text-white transition-colors"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>
        </form>
        
        {/* Suggestion chips under input */}
        {!isLoading && messages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="text-xs text-cosmic-text-muted mr-1 self-center">Try asking about:</div>
            {["Solar system", "Black holes", "Space travel", "Exoplanets"].map((topic, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedQuestionClick(`Tell me about ${topic.toLowerCase()}`)}
                className="text-xs bg-cosmic-surface hover:bg-cosmic-surface/80 text-cosmic-text-secondary hover:text-cosmic-text-primary px-2.5 py-1 rounded-lg transition-colors border border-cosmic-border/30 hover:border-cosmic-border/50"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CosmicChat;