import React from "react";
import PropTypes from "prop-types";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className || ""}`}
      ref={ref}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  className: "",
};

export default Checkbox;