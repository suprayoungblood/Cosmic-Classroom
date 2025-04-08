import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/basic";
import { Button } from "@/components/basic";

export function CosmicCard({ 
  title, 
  description, 
  image, 
  altText, 
  variant = "default", 
  action,
  className = "" 
}) {
  // Variant styles
  const variants = {
    default: "border-none shadow-md",
    nebula: "border-purple-500/20 bg-gradient-to-b from-slate-900 to-purple-950 text-white",
    galaxy: "border-blue-400/20 bg-gradient-to-br from-blue-950 to-slate-900 text-white",
    planet: "border-cyan-500/20 bg-slate-950 text-white",
    transparent: "border-white/10 bg-white/5 backdrop-blur-md text-white",
  };

  return (
    <Card className={`overflow-hidden ${variants[variant]} ${className}`}>
      {image && (
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={image} 
            alt={altText || title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          {variant === 'transparent' && (
            <div className="absolute inset-0 bg-black/30"></div>
          )}
        </div>
      )}
      
      <CardHeader className={variant.includes('nebula') || variant.includes('galaxy') || variant.includes('planet') || variant === 'transparent' ? 'border-b border-white/10' : ''}>
        <CardTitle className={variant.includes('nebula') || variant.includes('galaxy') || variant.includes('planet') || variant === 'transparent' ? 'text-white' : 'text-slate-900'}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={variant.includes('nebula') || variant.includes('galaxy') || variant.includes('planet') || variant === 'transparent' ? 'text-white/70' : 'text-slate-500'}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      {action && (
        <CardFooter className={variant.includes('nebula') || variant.includes('galaxy') || variant.includes('planet') ? 'border-t border-white/10' : ''}>
          <Button 
            variant={variant === 'nebula' ? 'nebula' : variant === 'galaxy' ? 'cosmic' : 'default'}
            onClick={action.onClick}
            className="w-full"
          >
            {action.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

CosmicCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  altText: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'nebula', 'galaxy', 'planet', 'transparent']),
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }),
  className: PropTypes.string
};

export default CosmicCard;