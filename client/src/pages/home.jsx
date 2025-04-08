import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard } from "@/widgets/cards";
import { featuresData, contactData } from "@/data";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription, 
  CardFooter,
  Button,
  Input,
  Textarea,
  Checkbox
} from "@/components/basic";

// Import cosmic components
import { 
  CosmicHeader, 
  CosmicHero, 
  CosmicCard,
  CosmicQuestion
} from "@/components/cosmic";

export function Home() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionSubmit = async (questionText) => {
    setQuestion(questionText);
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/ask', { question: questionText });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Sorry, there was an error processing your question. Please try again.');
    }
    setIsLoading(false);
  };

  // Ensure scrolling works properly when component mounts
  React.useEffect(() => {
    // Force enable scrolling
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    
    return () => {
      // Cleanup to avoid side effects
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <CosmicHero
        title="Explore the Universe from Your Screen"
        subtitle="Embark on an interstellar journey of knowledge. Discover celestial wonders and expand your understanding of the cosmos."
        image="/img/Space.avif"
        primaryAction={{
          label: "Start Chatting",
          onClick: () => navigate("/chat")
        }}
        secondaryAction={{
          label: "How It Works",
          onClick: () => console.log("How it works clicked")
        }}
      />

      {/* Interactive Q&A Section */}
      <section className="cosmic-section bg-cosmic-dark relative">
        {/* Decorative elements */}
        <div className="cosmic-stars opacity-25"></div>
        <div className="cosmic-nebula cosmic-nebula-blue w-[600px] h-[600px] left-[-200px] top-[10%] opacity-[0.03]"></div>
        <div className="cosmic-nebula cosmic-nebula-amber w-[400px] h-[400px] right-[-100px] bottom-[20%] opacity-[0.02]"></div>
        
        <div className="cosmic-container">
          <div className="text-center mb-12">
            <div className="mb-3">
              <div className="cosmic-badge-primary inline-flex mx-auto">AI-Powered Learning</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-gradient">Explore the Cosmos</span>
            </h2>
            <p className="text-cosmic-text-secondary max-w-2xl mx-auto">
              Unlock the mysteries of the universe with our advanced AI. Ask any question about astronomy, 
              space exploration, or cosmic phenomena.
            </p>
          </div>
          
          <div className="mb-12">
            <CosmicQuestion
              onSubmit={handleQuestionSubmit}
              isLoading={isLoading}
            />
          </div>
          
          {answer && (
            <div className="w-full max-w-3xl mx-auto mt-10 animate-fade-in">
              <div className="cosmic-card cosmic-card-hover relative overflow-hidden">
                {/* Decorative elements */}
                <div className="cosmic-nebula cosmic-nebula-blue w-[300px] h-[300px] right-[-150px] top-[-50px] opacity-[0.03]"></div>
                <div className="cosmic-stars opacity-10"></div>
                
                <div className="p-6 md:p-8 relative z-10">
                  {/* Modern header with status */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      {/* AI avatar */}
                      <div className="relative">
                        <div className="h-10 w-10 rounded-xl bg-cosmic-gradient flex items-center justify-center shadow-md overflow-hidden">
                          <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-cosmic-secondary border-2 border-cosmic-surface flex items-center justify-center">
                          <div className="ping"></div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-cosmic-text-primary font-medium">Cosmic AI</h3>
                        <div className="flex items-center">
                          <span className="text-xs text-cosmic-text-muted">Generated just now</span>
                          <span className="inline-block mx-1.5 h-1 w-1 rounded-full bg-cosmic-text-muted"></span>
                          <div className="inline-flex items-center">
                            <span className="flex h-2 w-2 relative mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cosmic-secondary/50"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-cosmic-secondary"></span>
                            </span>
                            <span className="text-xs text-cosmic-secondary">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions menu */}
                    <div className="relative group">
                      <button className="p-1.5 rounded-lg text-cosmic-text-muted hover:text-cosmic-text-secondary hover:bg-cosmic-surface/80 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor"></path>
                        </svg>
                      </button>
                      
                      <div className="absolute right-0 mt-1 w-48 bg-cosmic-surface border border-cosmic-border shadow-cosmic-lg rounded-lg p-1 hidden group-hover:block z-30">
                        <button 
                          className="w-full text-left px-3 py-1.5 rounded-md hover:bg-cosmic-primary/10 text-cosmic-text-secondary text-sm flex items-center"
                          onClick={() => window.navigator.clipboard.writeText(answer)}
                        >
                          <svg width="14" height="14" viewBox="0 0 15 15" className="mr-2 text-cosmic-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                          Copy response
                        </button>
                        <button 
                          className="w-full text-left px-3 py-1.5 rounded-md hover:bg-cosmic-primary/10 text-cosmic-text-secondary text-sm flex items-center"
                          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(answer.slice(0, 200) + '...')}&hashtags=CosmicClassroom,Space`, '_blank')}
                        >
                          <svg className="mr-2 h-3.5 w-3.5 text-cosmic-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                          Share on Twitter
                        </button>
                        <button 
                          className="w-full text-left px-3 py-1.5 rounded-md hover:bg-cosmic-primary/10 text-cosmic-text-secondary text-sm flex items-center"
                          onClick={() => { setQuestion(''); setAnswer(''); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 15 15" className="mr-2 text-cosmic-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                          </svg>
                          New question
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modern message content */}
                  <div className="mb-6">
                    <div className="bg-cosmic-primary/5 p-4 md:p-6 rounded-2xl border border-cosmic-primary/10">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-cosmic-text-secondary">{answer}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive follow-up section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-cosmic-text-secondary border-b border-cosmic-border/30 pb-2">
                      Follow-up questions
                    </h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {["Tell me more about this topic", "How does this relate to Earth?", "Are there any recent discoveries?"].map((followUp, i) => (
                        <button
                          key={i}
                          onClick={() => setQuestion(followUp)}
                          className="text-sm rounded-full bg-cosmic-primary/10 text-cosmic-primary border border-cosmic-primary/20 px-3 py-1 hover:bg-cosmic-primary/20 transition-colors"
                        >
                          {followUp}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button 
                        onClick={() => { setQuestion(''); setAnswer(''); }}
                        className="btn-primary text-sm py-1.5"
                      >
                        <svg width="14" height="14" viewBox="0 0 15 15" className="mr-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                        </svg>
                        New question
                      </button>
                      
                      <button 
                        onClick={() => window.navigator.clipboard.writeText(answer)}
                        className="btn-outline text-sm py-1.5"
                      >
                        <svg width="14" height="14" viewBox="0 0 15 15" className="mr-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="cosmic-section bg-cosmic-background relative">
        {/* Decorative elements */}
        <div className="cosmic-stars opacity-15"></div>
        <div className="cosmic-nebula cosmic-nebula-teal w-[500px] h-[500px] right-[-150px] top-[20%] opacity-[0.03]"></div>
        <div className="cosmic-nebula cosmic-nebula-blue w-[400px] h-[400px] left-[-100px] bottom-[10%] opacity-[0.02]"></div>
        
        <div className="cosmic-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
            <div>
              <div className="cosmic-badge-secondary inline-flex mb-3">Featured Topics</div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                <span className="text-gradient">Galaxy of Knowledge</span>
              </h2>
            </div>
            <p className="text-cosmic-text-secondary md:max-w-md">
              Curated topics designed to expand your understanding of our universe, from planetary science to astrophysics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }, index) => (
              <div 
                key={title}
                className="cosmic-card cosmic-card-hover group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 md:p-8">
                  <div className="mb-5">
                    <div className={`h-12 w-12 rounded-xl bg-cosmic-${color}/10 flex items-center justify-center border border-cosmic-${color}/20`}>
                      {React.createElement(icon, {
                        className: `w-6 h-6 text-cosmic-${color}`,
                      })}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold mb-3 text-cosmic-text-primary">
                    {title}
                  </h3>
                  
                  <p className="text-cosmic-text-secondary mb-5">
                    {description}
                  </p>
                  
                  <div className="pt-2 mt-auto">
                    <button className="text-cosmic-primary hover:text-cosmic-primary/80 font-medium text-sm inline-flex items-center transition-colors">
                      Explore topic
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 12.5L11 8L6.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to action card */}
          <div className="mt-16">
            <div className="cosmic-card p-8 md:p-10 bg-cosmic-gradient relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/img/Space.avif')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                    Ready to start your cosmic journey?
                  </h3>
                  <p className="text-white/80 max-w-lg">
                    Join thousands of space enthusiasts exploring the wonders of our universe through interactive learning.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    className="btn-primary bg-white text-cosmic-primary hover:bg-white/90 px-6 py-3"
                    onClick={() => navigate("/chat")}
                  >
                    Try Cosmic Chat
                  </button>
                  <button className="btn-outline border-white/30 text-white hover:bg-white/10 px-6 py-3">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
{/* Educational Resources Section */}
      <section className="cosmic-section bg-cosmic-surface/50 relative">
        {/* Decorative elements */}
        <div className="cosmic-stars opacity-10"></div>
        <div className="cosmic-nebula cosmic-nebula-amber w-[400px] h-[400px] right-[-100px] top-[20%] opacity-[0.02]"></div>
        
        <div className="cosmic-container">
          <div className="text-center mb-12">
            <div className="mb-3">
              <div className="cosmic-badge-secondary inline-flex mx-auto">Learning Resources</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-gradient">Educational Materials</span>
            </h2>
            <p className="text-cosmic-text-secondary max-w-2xl mx-auto">
              Enhance your understanding of space with our expertly curated educational resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactData.map(({ title, icon, description }, index) => (
              <div 
                key={title} 
                className="cosmic-card cosmic-card-hover group p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 flex-shrink-0">
                    <div className="h-14 w-14 rounded-2xl bg-cosmic-gradient flex items-center justify-center shadow-md overflow-hidden">
                      {React.createElement(icon, {
                        className: "w-6 h-6 text-white group-hover:scale-110 transition-transform",
                      })}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold mb-3 text-cosmic-text-primary">
                    {title}
                  </h3>
                  
                  <p className="text-cosmic-text-secondary mb-5">
                    {description}
                  </p>
                  
                  <div className="mt-auto pt-2">
                    <button className="text-cosmic-primary hover:text-cosmic-primary/80 font-medium text-sm inline-flex items-center transition-colors">
                      Learn more
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 12.5L11 8L6.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="cosmic-section">
        <div className="cosmic-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side: Contact info and mission */}
            <div className="space-y-8">
              <div>
                <div className="cosmic-badge-primary inline-flex mb-3">Contact Us</div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  <span className="text-gradient">Join Our Mission</span>
                </h2>
                <p className="text-cosmic-text-secondary max-w-md">
                  Have questions or suggestions? We're always looking to improve your cosmic educational experience.
                </p>
              </div>
              
              {/* Contact cards */}
              <div className="grid gap-4">
                <div className="cosmic-card p-6 flex items-center gap-4 group hover:border-cosmic-primary/30 transition-colors">
                  <div className="h-10 w-10 bg-cosmic-primary/10 text-cosmic-primary rounded-lg flex items-center justify-center group-hover:bg-cosmic-primary/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V1.5C8 1.77614 7.77614 2 7.5 2C7.22386 2 7 1.77614 7 1.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L3.61092 2.90381C3.80618 3.09907 3.80618 3.41566 3.61092 3.61092C3.41566 3.80618 3.09907 3.80618 2.90381 3.61092L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L12.0962 3.61092C11.9009 3.80618 11.5843 3.80618 11.3891 3.61092C11.1938 3.41566 11.1938 3.09907 11.3891 2.90381L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967ZM0.5 7.5C0.5 7.22386 0.723858 7 1 7H2C2.27614 7 2.5 7.22386 2.5 7.5C2.5 7.77614 2.27614 8 2 8H1C0.723858 8 0.5 7.77614 0.5 7.5ZM12.5 7.5C12.5 7.22386 12.7239 7 13 7H14C14.2761 7 14.5 7.22386 14.5 7.5C14.5 7.77614 14.2761 8 14 8H13C12.7239 8 12.5 7.77614 12.5 7.5ZM2.90381 11.3891C3.09907 11.5843 3.09907 11.9009 2.90381 12.0962L2.1967 12.8033C2.00144 12.9986 1.68485 12.9986 1.48959 12.8033C1.29433 12.608 1.29433 12.2915 1.48959 12.0962L2.1967 11.3891C2.39196 11.1938 2.70854 11.1938 2.90381 11.3891ZM11.3891 11.3891C11.5843 11.1938 11.9009 11.1938 12.0962 11.3891L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L11.3891 12.0962C11.1938 11.9009 11.1938 11.5843 11.3891 11.3891ZM7.5 13C7.77614 13 8 13.2239 8 13.5V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V13.5C7 13.2239 7.22386 13 7.5 13ZM7.5 11C9.433 11 11 9.433 11 7.5C11 5.567 9.433 4 7.5 4C5.567 4 4 5.567 4 7.5C4 9.433 5.567 11 7.5 11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-cosmic-text-primary mb-1">Our Mission</h3>
                    <p className="text-sm text-cosmic-text-secondary">Making space education accessible to everyone through interactive learning.</p>
                  </div>
                </div>
                
                <div className="cosmic-card p-6 flex items-center gap-4 group hover:border-cosmic-primary/30 transition-colors">
                  <div className="h-10 w-10 bg-cosmic-primary/10 text-cosmic-primary rounded-lg flex items-center justify-center group-hover:bg-cosmic-primary/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 2C1 1.44772 1.44772 1 2 1H13C13.5523 1 14 1.44772 14 2V13C14 13.5523 13.5523 14 13 14H2C1.44772 14 1 13.5523 1 13V2ZM2 2H13V13H2V2ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H10.5C10.7761 5 11 4.77614 11 4.5C11 4.22386 10.7761 4 10.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-cosmic-text-primary mb-1">Resources</h3>
                    <p className="text-sm text-cosmic-text-secondary">Explore our extensive collection of educational resources about space.</p>
                  </div>
                </div>
                
                <div className="cosmic-card p-6 flex items-center gap-4 group hover:border-cosmic-primary/30 transition-colors">
                  <div className="h-10 w-10 bg-cosmic-primary/10 text-cosmic-primary rounded-lg flex items-center justify-center group-hover:bg-cosmic-primary/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 2.5C2 2.22386 2.22386 2 2.5 2H5.5C5.77614 2 6 2.22386 6 2.5C6 2.77614 5.77614 3 5.5 3H2.5C2.22386 3 2 2.77614 2 2.5ZM2 5.5C2 5.22386 2.22386 5 2.5 5H7.5C7.77614 5 8 5.22386 8 5.5C8 5.77614 7.77614 6 7.5 6H2.5C2.22386 6 2 5.77614 2 5.5ZM2 8.5C2 8.22386 2.22386 8 2.5 8H11.5C11.7761 8 12 8.22386 12 8.5C12 8.77614 11.7761 9 11.5 9H2.5C2.22386 9 2 8.77614 2 8.5ZM8 2.5C8 2.22386 8.22386 2 8.5 2H12.5C12.7761 2 13 2.22386 13 2.5C13 2.77614 12.7761 3 12.5 3H8.5C8.22386 3 8 2.77614 8 2.5ZM10 5.5C10 5.22386 10.2239 5 10.5 5H12.5C12.7761 5 13 5.22386 13 5.5C13 5.77614 12.7761 6 12.5 6H10.5C10.2239 6 10 5.77614 10 5.5ZM2 11.5C2 11.2239 2.22386 11 2.5 11H5.5C5.77614 11 6 11.2239 6 11.5C6 11.7761 5.77614 12 5.5 12H2.5C2.22386 12 2 11.7761 2 11.5ZM8 11.5C8 11.2239 8.22386 11 8.5 11H12.5C12.7761 11 13 11.2239 13 11.5C13 11.7761 12.7761 12 12.5 12H8.5C8.22386 12 8 11.7761 8 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-cosmic-text-primary mb-1">Get in Touch</h3>
                    <p className="text-sm text-cosmic-text-secondary">Email us at <a href="mailto:contact@cosmicclassroom.com" className="text-cosmic-primary hover:text-cosmic-primary/80 transition-colors">contact@cosmicclassroom.com</a></p>
                  </div>
                </div>
              </div>
              
              {/* Social links */}
              <div>
                <p className="text-cosmic-text-secondary text-sm mb-3">Follow us on social media</p>
                <div className="flex gap-4">
                  {["twitter", "instagram", "youtube", "github"].map((platform) => (
                    <a 
                      key={platform}
                      href="#"
                      className="h-10 w-10 bg-cosmic-surface border border-cosmic-border/50 rounded-lg flex items-center justify-center text-cosmic-text-secondary hover:text-cosmic-primary hover:border-cosmic-primary/30 transition-colors"
                      aria-label={`Follow us on ${platform}`}
                    >
                      <i className={`fab fa-${platform}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side: Contact form */}
            <div>
              <div className="cosmic-card p-6 md:p-8 relative">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-cosmic-text-secondary mb-1.5">Full Name</label>
                    <input 
                      type="text"
                      id="name" 
                      placeholder="Your name" 
                      className="cosmic-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-cosmic-text-secondary mb-1.5">Email Address</label>
                    <input 
                      type="email"
                      id="email" 
                      placeholder="your@email.com" 
                      className="cosmic-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-cosmic-text-secondary mb-1.5">Subject</label>
                    <select 
                      id="subject"
                      className="cosmic-input appearance-none"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="question">General Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="suggestion">Feature Suggestion</option>
                      <option value="partnership">Partnership Inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-cosmic-text-secondary mb-1.5">Message</label>
                    <textarea 
                      id="message" 
                      placeholder="Your message here..." 
                      className="cosmic-input min-h-[120px] resize-y"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="terms"
                        type="checkbox"
                        className="w-4 h-4 text-cosmic-primary bg-cosmic-surface border-cosmic-border rounded focus:ring-cosmic-primary focus:ring-1"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-cosmic-text-secondary">
                        I agree to the <a href="#" className="text-cosmic-primary hover:text-cosmic-primary/80 transition-colors">Privacy Policy</a> and <a href="#" className="text-cosmic-primary hover:text-cosmic-primary/80 transition-colors">Terms of Service</a>
                      </label>
                    </div>
                  </div>
                  
                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default Home;