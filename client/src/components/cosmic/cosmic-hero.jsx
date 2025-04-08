import React from "react";
import PropTypes from "prop-types";

export function CosmicHero({ 
  title, 
  subtitle, 
  image, 
  primaryAction, 
  secondaryAction
}) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with modern treatment */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt="Space background" 
          className="w-full h-full object-cover"
        />
        {/* Modern overlay with depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-background via-cosmic-background/95 to-cosmic-background/80" />
      </div>
      
      {/* Decorative elements */}
      <div className="cosmic-stars opacity-20"></div>
      <div className="cosmic-nebula cosmic-nebula-blue w-[500px] h-[500px] right-[-100px] top-[10%]"></div>
      <div className="cosmic-nebula cosmic-nebula-teal w-[400px] h-[400px] left-[-100px] bottom-[10%]"></div>
      
      {/* Content container */}
      <div className="cosmic-container">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Left side content */}
          <div className="md:col-span-6 lg:col-span-5 space-y-8 animate-fade-in z-10">
            {/* Eyebrow text */}
            <div className="inline-flex items-center mb-3">
              <div className="cosmic-badge-primary">
                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                </svg>
                <span>Journey Through Space</span>
              </div>
            </div>
            
            {/* Main title with gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              <span className="text-gradient">{title}</span>
            </h1>
            
            {/* Subtitle with improved readability */}
            <p className="text-lg md:text-xl text-cosmic-text-secondary max-w-xl">
              {subtitle}
            </p>
            
            {/* Call to action buttons with modern styling */}
            <div className="flex flex-wrap gap-4 pt-4">
              {primaryAction && (
                <button 
                  onClick={primaryAction.onClick}
                  className="btn-primary group"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 6L23 6M23 6L18.5 1.5M23 6L18.5 10.5M9 18L1 18M1 18L5.5 13.5M1 18L5.5 22.5M1 12L18 12M10 1L10 23" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
                    </svg>
                    {primaryAction.label}
                  </span>
                  <div className="absolute inset-0 rounded-lg -z-10 opacity-0 group-hover:opacity-100 bg-cosmic-primary/10 blur-xl transition-opacity"></div>
                </button>
              )}
              
              {secondaryAction && (
                <button 
                  onClick={secondaryAction.onClick}
                  className="btn-outline group"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cosmic-primary" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" />
                    </svg>
                    {secondaryAction.label}
                  </span>
                </button>
              )}
            </div>
            
          </div>
          
          {/* Right side visual element */}
          <div className="hidden md:block md:col-span-6 lg:col-span-7 relative">
            <div className="relative w-full aspect-square max-w-xl mx-auto">
              {/* Decorative circular element */}
              <div className="absolute inset-0 bg-cosmic-gradient opacity-20 rounded-full animate-pulse-slow"></div>
              
              {/* Interactive planet/orbit system */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-4/5 h-4/5">
                  {/* Orbit paths */}
                  <div className="absolute inset-0 border-2 border-cosmic-border/20 rounded-full"></div>
                  <div className="absolute inset-8 border border-cosmic-border/30 rounded-full"></div>
                  <div className="absolute inset-16 border border-cosmic-border/40 rounded-full"></div>
                  
                  {/* Center planet/sun */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-cosmic-gradient rounded-full shadow-lg animate-pulse-slow"></div>
                  </div>
                  
                  {/* Orbiting planets */}
                  <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-cosmic-primary rounded-full shadow-lg"></div>
                  </div>
                  
                  <div className="absolute inset-8 animate-[spin_30s_linear_infinite]">
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cosmic-secondary rounded-full shadow-lg"></div>
                  </div>
                  
                  <div className="absolute inset-16 animate-[spin_40s_linear_infinite_reverse]">
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-cosmic-accent rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-cosmic-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

CosmicHero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  primaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }),
  secondaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }),
  overlay: PropTypes.bool
};

export default CosmicHero;