import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/basic";
import { useAuth } from "@/contexts/AuthContext";
import UserProgressBar from "@/components/game/UserProgressBar";

export function Navbar({ brandName, routes, action }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  
  // Get only the routes that should be shown in the navbar based on user role
  const navRoutes = routes.filter(route => {
    // Filter out Sign In and Sign Up pages from main navigation
    if (['Sign In', 'Sign Up'].includes(route.name)) return false;
    
    // If route requires auth and user is not authenticated, don't show
    if (route.requiresAuth && !isAuthenticated) return false;
    
    // For admin and educator, show only role-specific pages
    if (user?.role === 'admin') {
      // Admins only see Admin Dashboard and Educator Dashboard
      return ['Admin Dashboard', 'Educator Dashboard'].includes(route.name);
    }
    
    if (user?.role === 'educator') {
      // Educators only see Educator Dashboard
      return ['Educator Dashboard'].includes(route.name);
    }
    
    // For students, filter out admin and educator pages
    if (user?.role === 'student' && route.allowedRoles) {
      // Only show if student is in allowed roles
      return route.allowedRoles.includes('student');
    }
    
    // For non-authenticated users, show only public routes
    if (!isAuthenticated) {
      return !route.requiresAuth;
    }
    
    return true;
  });

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Main navbar */}
      <nav style={{position: 'fixed', zIndex: 9999}} className="bg-[#0D1117] bg-opacity-95 border-b border-gray-800 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
                  <RocketLaunchIcon className="h-5 w-5" />
                </div>
                <span className="ml-2 text-white font-medium text-lg">
                  {brandName}
                </span>
              </Link>

              {/* Desktop navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-4">
                {navRoutes.map(({ name, path, icon, href, target }) => {
                  const isActive = path && location.pathname === path;
                  return href ? (
                    <a
                      key={name}
                      href={href}
                      target={target}
                      className={`${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                    >
                      {icon && 
                        React.createElement(icon, {
                          className: "w-5 h-5 mr-1.5",
                        })}
                      {name}
                    </a>
                  ) : (
                    <Link
                      key={name}
                      to={path}
                      target={target}
                      className={`${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                    >
                      {icon && 
                        React.createElement(icon, {
                          className: "w-5 h-5 mr-1.5",
                        })}
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side items */}
            <div className="hidden md:flex md:items-center md:space-x-3" style={{ zIndex: 9999 }}>
              {isAuthenticated ? (
                <>
                  {/* Only show progress bar for students */}
                  {user?.role === "student" && (
                    <div style={{ position: 'relative', zIndex: 9999 }}>
                      <UserProgressBar />
                    </div>
                  )}
                  
                  {/* For educators and admins, show their role */}
                  {(user?.role === "educator" || user?.role === "admin") && (
                    <div className="px-3 py-1 rounded-md text-sm font-medium flex items-center">
                      <span className={`px-2 py-1 rounded text-xs text-white inline-block ${
                        user.role === 'admin' ? 'bg-red-500' : 'bg-cosmic-primary'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-white"
                    style={{ position: 'relative', zIndex: 9999 }}
                    onClick={() => {
                      logout();
                      navigate('/home');
                    }}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/sign-in">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-300 hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-expanded="false"
              >
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden border-t border-gray-700`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navRoutes.map(({ name, path, icon, href, target }) => {
              const isActive = path && location.pathname === path;
              return href ? (
                <a
                  key={name}
                  href={href}
                  target={target}
                  className={`${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                >
                  {icon && 
                    React.createElement(icon, {
                      className: "w-5 h-5 mr-2",
                    })}
                  {name}
                </a>
              ) : (
                <Link
                  key={name}
                  to={path}
                  target={target}
                  className={`${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                >
                  {icon && 
                    React.createElement(icon, {
                      className: "w-5 h-5 mr-2",
                    })}
                  {name}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu actions */}
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2 space-y-1">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/home');
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 flex items-center"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* No spacer here - we'll use mt in page components instead */}
    </>
  );
}

Navbar.defaultProps = {
  brandName: "Cosmic Classroom",
  action: null
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;