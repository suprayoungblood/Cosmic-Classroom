import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function PageTitle({ section, heading, children, className, title }) {
  // Support both heading and title props for backwards compatibility
  const displayHeading = heading || title;
  // Use default values for required props to prevent validation errors
  const displaySection = section || "Cosmic Classroom";
  
  return (
    <div className={`mx-auto w-full px-4 text-center lg:w-6/12 ${className || ""}`}>
      <Typography variant="lead" className="font-semibold">
        {displaySection}
      </Typography>
      <Typography variant="h2" color="blue-gray" className="my-3">
        {displayHeading}
      </Typography>
      <Typography variant="lead" className="text-blue-gray-500">
        {typeof children === 'string' ? children : children || <span>&nbsp;</span>}
      </Typography>
    </div>
  );
}

PageTitle.propTypes = {
  section: PropTypes.string,
  heading: PropTypes.string,
  title: PropTypes.string, // Added title as alternative to heading
  children: PropTypes.node,
  className: PropTypes.string,
};

// Provide default props to avoid warnings
PageTitle.defaultProps = {
  section: "Cosmic Classroom",
  heading: "Space Education Platform",
  children: null,
  className: "",
};

PageTitle.displayName = "/src/widgets/layout/page-title.jsx";

export default PageTitle;
