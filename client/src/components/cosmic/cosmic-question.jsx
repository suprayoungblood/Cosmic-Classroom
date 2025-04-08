import React, { useState } from "react";
import PropTypes from "prop-types";

export function CosmicQuestion({ onSubmit, isLoading = false }) {
  const [question, setQuestion] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  const handleClear = () => {
    setQuestion('');
  };

  // Curated space questions for discoverability
  const suggestedQuestions = [
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Interactive question interface */}
      <div className="cosmic-card border-cosmic-border/40 group">
        <div className="cosmic-nebula cosmic-nebula-blue w-[400px] h-[400px] left-[-150px] top-[-150px] opacity-[0.04]"></div>
        <div className="cosmic-nebula cosmic-nebula-teal w-[300px] h-[300px] right-[-100px] bottom-[-100px] opacity-[0.03]"></div>
        
        <div className="p-6 md:p-8 relative z-10">
          {/* Header with badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center space-x-2">
              <div className="cosmic-badge-primary">Interactive AI</div>
              <div className="cosmic-badge bg-cosmic-secondary/10 text-cosmic-secondary hidden sm:flex">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  98% Accuracy
                </span>
              </div>
            </div>
            
            <h2 className="text-xl font-display font-semibold text-cosmic-text-primary">
              Cosmic Explorer
            </h2>
          </div>
          
          {/* Main question input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
              <div className="relative">
                {/* Command icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-cosmic-text-muted">
                  <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </div>
                
                {/* Text input with modern styling */}
                <input
                  type="text"
                  id="cosmic-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Ask about the cosmos, stars, planets, or space exploration..."
                  className="cosmic-input pl-12 pr-12 py-3 h-14 bg-cosmic-surface border-cosmic-border/40 focus:border-cosmic-primary/50 rounded-xl placeholder:text-cosmic-text-muted/70 shadow-inner-cosmic"
                  aria-label="Enter your space question"
                />
                
                {/* Clear button with improved interaction */}
                {question && !isLoading && (
                  <button 
                    type="button"
                    onClick={handleClear}
                    className="absolute right-14 top-1/2 -translate-y-1/2 p-1.5 text-cosmic-text-muted/80 hover:text-cosmic-text-secondary transition-colors rounded-full hover:bg-cosmic-surface/80"
                    aria-label="Clear question"
                  >
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  </button>
                )}
                
                {/* Submit button integrated with input */}
                <button 
                  type="submit" 
                  disabled={isLoading || !question.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cosmic-primary disabled:bg-cosmic-primary/50 text-white transition-colors"
                  aria-label="Submit question"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Input instruction text */}
              <p className="text-xs text-cosmic-text-muted mt-2 ml-1">
                Type a question about any space topic and press Enter
              </p>
            </div>
            
            {/* Category pills */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-cosmic-text-secondary">
                  Popular topics to explore
                </h3>
                
                {/* Category navigation */}
                <div className="flex space-x-1">
                  <button 
                    type="button" 
                    className="p-1 rounded text-cosmic-text-muted hover:text-cosmic-text-secondary transition-colors"
                    aria-label="Previous categories"
                  >
                    <svg width="16" height="16" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className="p-1 rounded text-cosmic-text-muted hover:text-cosmic-text-secondary transition-colors"
                    aria-label="Next categories"
                  >
                    <svg width="16" height="16" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Category cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {["Astronomy", "Planets", "Space Tech"].map((category) => (
                  <div key={category} className="cosmic-card cosmic-card-hover border-cosmic-border/30 group p-3 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cosmic-text-secondary group-hover:text-cosmic-text-primary transition-colors">
                        {category}
                      </span>
                      <svg className="w-4 h-4 text-cosmic-primary opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 2C3.22386 2 3 2.22386 3 2.5C3 2.77614 3.22386 3 3.5 3H11.5C11.7761 3 12 2.77614 12 2.5C12 2.22386 11.7761 2 11.5 2H3.5ZM3 7.5C3 7.22386 3.22386 7 3.5 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8H3.5C3.22386 8 3 7.77614 3 7.5ZM3 12.5C3 12.2239 3.22386 12 3.5 12H11.5C11.7761 12 12 12.2239 12 12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Suggested questions with category pills */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-cosmic-text-secondary">
                Suggested questions
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuestion(q.text)}
                    className="inline-flex items-center text-sm bg-cosmic-surface hover:bg-cosmic-surface/80 text-cosmic-text-secondary hover:text-cosmic-text-primary px-3 py-1.5 rounded-lg transition-colors border border-cosmic-border/30 hover:border-cosmic-border/50 group"
                  >
                    <span className="mr-1.5">{q.icon}</span>
                    <span className="truncate max-w-[200px]">{q.text}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded bg-cosmic-primary/10 text-cosmic-primary hidden group-hover:inline-block">
                      {q.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

CosmicQuestion.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default CosmicQuestion;