import React from "react";
import PropTypes from "prop-types";

const Button = React.forwardRef(
  ({ children, variant, size, className, asChild, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100 shadow-sm",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm",
      ghost: "bg-transparent hover:bg-gray-100",
      link: "text-blue-600 underline-offset-4 hover:underline",
      cosmic: "bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none",
      nebula: "bg-purple-600 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none",
    };
    
    const sizeStyles = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      xl: "h-12 rounded-md px-10 text-base",
      icon: "h-9 w-9",
    };
    
    const computedClassName = `${baseStyles} ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.default} ${className || ""}`;
    
    const Comp = asChild ? props.as || "span" : "button";
    
    return (
      <Comp
        className={computedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "destructive", "outline", "secondary", "ghost", "link", "cosmic", "nebula"]),
  size: PropTypes.oneOf(["default", "sm", "lg", "xl", "icon"]),
  className: PropTypes.string,
  asChild: PropTypes.bool,
  as: PropTypes.elementType,
};

Button.defaultProps = {
  variant: "default",
  size: "default",
  className: "",
  asChild: false,
};

export default Button;