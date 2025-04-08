import React from "react";
import PropTypes from "prop-types";

const Card = ({ children, className, ...props }) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return <div className={`p-6 ${className || ""}`} {...props}>{children}</div>;
};

const CardTitle = ({ children, className, ...props }) => {
  return <h3 className={`text-xl font-semibold text-gray-900 ${className || ""}`} {...props}>{children}</h3>;
};

const CardDescription = ({ children, className, ...props }) => {
  return <p className={`mt-2 text-sm text-gray-600 ${className || ""}`} {...props}>{children}</p>;
};

const CardContent = ({ children, className, ...props }) => {
  return <div className={`p-6 pt-0 ${className || ""}`} {...props}>{children}</div>;
};

const CardFooter = ({ children, className, ...props }) => {
  return <div className={`flex items-center p-6 pt-0 ${className || ""}`} {...props}>{children}</div>;
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;