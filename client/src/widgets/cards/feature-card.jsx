import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/basic";

const colorVariants = {
  "blue": {
    bg: "bg-gradient-to-r from-blue-600 to-blue-500",
    shadow: "shadow-blue-500/20",
    border: "border-blue-600/20",
    glow: "bg-blue-500/10"
  },
  "purple": {
    bg: "bg-gradient-to-r from-purple-600 to-purple-500",
    shadow: "shadow-purple-500/20",
    border: "border-purple-600/20",
    glow: "bg-purple-500/10"
  },
  "pink": {
    bg: "bg-gradient-to-r from-pink-600 to-pink-500",
    shadow: "shadow-pink-500/20",
    border: "border-pink-600/20",
    glow: "bg-pink-500/10"
  },
  "indigo": {
    bg: "bg-gradient-to-r from-indigo-600 to-indigo-500",
    shadow: "shadow-indigo-500/20",
    border: "border-indigo-600/20",
    glow: "bg-indigo-500/10"
  },
  "cyan": {
    bg: "bg-gradient-to-r from-cyan-600 to-cyan-500",
    shadow: "shadow-cyan-500/20",
    border: "border-cyan-600/20",
    glow: "bg-cyan-500/10"
  },
};

export function FeatureCard({ color, icon, title, description }) {
  const colorStyle = colorVariants[color] || colorVariants.blue;
  
  return (
    <Card className="border border-slate-700/30 bg-space-card shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
      <CardContent className="p-6 relative">
        <div className="flex flex-col items-center text-center">
          {/* Simplified icon container */}
          <div className={`h-12 w-12 rounded-full ${colorStyle.bg} flex items-center justify-center mb-4`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          
          {/* Title with better readability */}
          <h3 className="text-lg font-medium mb-2 text-space-title">
            {title}
          </h3>
          
          {/* Description with better contrast */}
          <p className="text-slate-400 text-sm">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

FeatureCard.defaultProps = {
  color: "blue",
};

FeatureCard.propTypes = {
  color: PropTypes.oneOf([
    "blue",
    "purple",
    "pink", 
    "indigo",
    "cyan"
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
};

FeatureCard.displayName = "/src/widgets/cards/feature-card.jsx";

export default FeatureCard;
