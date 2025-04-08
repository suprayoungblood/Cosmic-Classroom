import React, { useEffect } from "react";
import { PageTitle } from "@/widgets/layout";
import CosmicGamification from "@/components/cosmic/cosmic-gamification";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";

export function GamificationPage() {
  const { user } = useAuth();
  const { refreshGameData } = useGame();
  
  // Fetch latest game data when page loads and add background elements
  useEffect(() => {
    // Refresh game data
    refreshGameData();
    
    // Add particles script if needed
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [refreshGameData]);

  return (
    <div className="cosmic-gamification-page min-h-screen pt-24 pb-12">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-background to-cosmic-background/95"></div>
        
        {/* Stars */}
        <div className="stars-container">
          {Array(50).fill().map((_, i) => (
            <div 
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Nebula */}
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        
        {/* Floating particles */}
        <div className="particles-container">
          {Array(20).fill().map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 40 + 20}s`,
                opacity: Math.random() * 0.5 + 0.1
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle title="Cosmic Achievements" className="mb-6">
          <div className="text-cosmic-text-secondary flex items-center">
            Level up your cosmic journey with missions, badges, and rewards
          </div>
        </PageTitle>
        
        <CosmicGamification user={user} />
      </div>
      
      {/* Custom styles for the animated background */}
      <style jsx="true">{`
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        
        .nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.05;
        }
        
        .nebula-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%);
          top: 5%;
          left: -100px;
          animation: float 120s ease-in-out infinite alternate;
        }
        
        .nebula-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.1) 50%, transparent 70%);
          bottom: 10%;
          right: -100px;
          animation: float 90s ease-in-out infinite alternate-reverse;
        }
        
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .particle {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: float-particle linear infinite;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(50px, 30px) rotate(180deg); }
          100% { transform: translate(-20px, -40px) rotate(360deg); }
        }
        
        @keyframes float-particle {
          0% { transform: translate(0, 0); }
          100% { transform: translate(calc(-100vw - 100%), calc(-100vh - 100%)); }
        }
      `}</style>
    </div>
  );
}

export default GamificationPage;