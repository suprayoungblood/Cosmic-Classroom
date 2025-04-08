import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";

export function SimpleFooter({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2 bg-black text-white">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, crafted with{" "}
          <RocketLaunchIcon className="-mt-0.5 inline-block h-3.5 w-3.5" /> by{" "}
          <a
            href={brandLink}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-blue-500"
          >
            {brandName}
          </a>{" "}
          for cosmic explorers.
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

SimpleFooter.defaultProps = {
  brandName: "Cosmic Classroom",
  brandLink: "https://www.linkedin.com/in/pariss-youngblood-844428bb/",
  routes: [
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "License", path: "/license" },
  ],
};

SimpleFooter.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

SimpleFooter.displayName = "/src/widgets/layout/simple-footer.jsx";

export default SimpleFooter;