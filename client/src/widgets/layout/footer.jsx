import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const year = new Date().getFullYear();

export function Footer({ title, description, socials, menus, copyright }) {
  return (
    <footer className="relative z-10 bg-cosmic-background border-t border-cosmic-border/30">
      {/* Decorative elements */}
      <div className="cosmic-stars opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cosmic-primary/20 to-transparent"></div>
      
      {/* Main footer content */}
      <div className="cosmic-container pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand and description */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Link to="/" className="inline-block">
                <h3 className="text-2xl font-display font-bold text-gradient">
                  {title}
                </h3>
              </Link>
            </div>
            
            <p className="text-cosmic-text-secondary mb-6 max-w-md">
              {description}
            </p>
            
            {/* Social links */}
            <div className="flex gap-4">
              {socials.map(({ name, path }) => (
                <a
                  key={name}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 bg-cosmic-surface border border-cosmic-border/50 rounded-lg flex items-center justify-center text-cosmic-text-secondary hover:text-cosmic-primary hover:border-cosmic-primary/30 transition-colors"
                  aria-label={name}
                >
                  <i className={`fa-brands fa-${name}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Links and newsletter */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Navigation menus */}
              {menus.map(({ name, items }) => (
                <div key={name} className="space-y-4">
                  <h4 className="text-sm font-medium text-cosmic-text-primary uppercase tracking-wider">
                    {name}
                  </h4>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          className="text-cosmic-text-secondary hover:text-cosmic-primary transition-colors text-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Newsletter signup */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-cosmic-text-primary uppercase tracking-wider">
                  Stay Updated
                </h4>
                <p className="text-sm text-cosmic-text-secondary">
                  Get the latest cosmic news and updates
                </p>
                <form className="mt-2 space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="cosmic-input pl-4 pr-12 py-2.5"
                      required
                    />
                    <button 
                      type="submit"
                      className="absolute right-1 top-1 p-1.5 bg-cosmic-primary text-white rounded-md hover:bg-cosmic-primary/90 transition-colors"
                      aria-label="Subscribe"
                    >
                      <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-cosmic-text-muted">
                    By subscribing, you agree to our <Link to="/privacy" className="text-cosmic-primary hover:underline">Privacy Policy</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="mt-12 pt-6 border-t border-cosmic-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-cosmic-text-muted">
            {copyright}
          </p>
          
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-cosmic-text-muted hover:text-cosmic-text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-cosmic-text-muted hover:text-cosmic-text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-cosmic-text-muted hover:text-cosmic-text-secondary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  title: "Cosmic Classroom",
  description:
    "Embark on an interstellar journey of knowledge with our space education platform. Explore the universe from the comfort of your screen.",
  socials: [
    {
      name: "linkedin",
      path: "https://www.linkedin.com/in/pariss-youngblood-844428bb/",
    },
    {
      name: "github",
      path: "https://github.com/suprayoungblood/Cosmic-Classroom",
    },
    {
      name: "twitter",
      path: "https://twitter.com",
    },
  ],
  menus: [
    {
      name: "Explore",
      items: [
        { name: "Solar System", path: "/solar-system" },
        { name: "Galaxies", path: "/galaxies" },
        { name: "Black Holes", path: "/black-holes" },
        { name: "Space Missions", path: "/space-missions" },
      ],
    },
    {
      name: "Resources",
      items: [
        { name: "About Us", path: "/about" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
        { name: "FAQ", path: "/faq" },
      ],
    },
  ],
  copyright: (
    <>
      Copyright © {year} Cosmic Classroom. All rights reserved.
    </>
  ),
};

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  socials: PropTypes.arrayOf(PropTypes.object),
  menus: PropTypes.arrayOf(PropTypes.object),
  copyright: PropTypes.node,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;