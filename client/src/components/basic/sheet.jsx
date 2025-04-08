import React, { useState } from "react";
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Context to share state between components
const SheetContext = React.createContext(null);

const Sheet = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      <div className="inline-block">{children}</div>
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ children, ...props }) => {
  const context = React.useContext(SheetContext);
  
  if (!context) {
    console.error('SheetTrigger must be used within a Sheet component');
    return null;
  }
  
  const handleClick = (e) => {
    if (children.props.onClick) {
      children.props.onClick(e);
    }
    context.setOpen(true);
  };
  
  return React.cloneElement(children, { 
    ...props, 
    onClick: handleClick
  });
};

const SheetContent = ({ 
  children, 
  side = "right", 
  className = "", 
  ...props 
}) => {
  const context = React.useContext(SheetContext);
  
  if (!context) {
    console.error('SheetContent must be used within a Sheet component');
    return null;
  }
  
  if (!context.open) {
    return null;
  }
  
  const handleClose = () => {
    context.setOpen(false);
  };
  
  const handleOverlayClick = (e) => {
    // Close when clicking the overlay
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  
  const sideStyles = {
    right: "right-0 h-full",
    left: "left-0 h-full", 
    top: "top-0 w-full",
    bottom: "bottom-0 w-full"
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex"
      onClick={handleOverlayClick}
    >
      <div 
        className={`bg-white dark:bg-gray-800 shadow-lg fixed ${sideStyles[side]} max-w-md p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div className="relative">
          <SheetClose onClick={handleClose} />
          {children}
        </div>
      </div>
    </div>
  );
};

const SheetHeader = ({ children, className, ...props }) => {
  return (
    <div className={`mb-5 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const SheetTitle = ({ children, className, ...props }) => {
  return <h3 className={`text-lg font-semibold ${className || ""}`} {...props}>{children}</h3>;
};

const SheetClose = ({ className, children, onClick, ...props }) => {
  const context = React.useContext(SheetContext);
  
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (context) context.setOpen(false);
  };
  
  return (
    <button
      className={`absolute right-0 top-0 p-2 opacity-70 hover:opacity-100 ${className || ""}`}
      onClick={handleClick}
      {...props}
    >
      {children || <XMarkIcon className="h-5 w-5" />}
      <span className="sr-only">Close</span>
    </button>
  );
};

Sheet.displayName = "Sheet";
SheetTrigger.displayName = "SheetTrigger";
SheetContent.displayName = "SheetContent";
SheetHeader.displayName = "SheetHeader";
SheetTitle.displayName = "SheetTitle";
SheetClose.displayName = "SheetClose";

Sheet.Trigger = SheetTrigger;
Sheet.Content = SheetContent;
Sheet.Header = SheetHeader;
Sheet.Title = SheetTitle;
Sheet.Close = SheetClose;

Sheet.propTypes = {
  children: PropTypes.node.isRequired,
};

SheetTrigger.propTypes = {
  children: PropTypes.node.isRequired,
};

SheetContent.propTypes = {
  children: PropTypes.node.isRequired,
  side: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  className: PropTypes.string,
};

SheetHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SheetTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SheetClose.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

// Re-export the subcomponents
export { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose };
export default Sheet;