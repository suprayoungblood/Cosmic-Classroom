import React from "react";
import PropTypes from "prop-types";

export function CosmicHeader({ title, subtitle, alignment = "center", decorator = true }) {
  const alignmentClasses = {
    center: "text-center mx-auto",
    left: "text-left",
    right: "text-right",
  };

  return (
    <div className={`mb-10 ${alignmentClasses[alignment]} relative`}>
      {/* Simple pre-title decorator if enabled */}
      {decorator && (
        <div className="inline-flex items-center justify-center mb-3">
          <div className="h-px w-6 bg-blue-400/50 rounded"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mx-2 text-blue-400/70">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
          <div className="h-px w-6 bg-blue-400/50 rounded"></div>
        </div>
      )}
      
      {/* Main title with muted styling */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-space-title">
        {title}
        
        {/* Optional simple underline */}
        {decorator && alignment === "center" && (
          <div className="h-px w-16 bg-blue-400/30 mx-auto mt-3"></div>
        )}
      </h2>
      
      {/* Subtitle with better readability */}
      {subtitle && (
        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

CosmicHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  alignment: PropTypes.oneOf(["center", "left", "right"]),
  decorator: PropTypes.bool,
};

export default CosmicHeader;