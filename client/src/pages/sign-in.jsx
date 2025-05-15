import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

export function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First check if we can reach the server
      try {
        const statusResponse = await fetch('/api/status');
        if (!statusResponse.ok) {
          throw new Error("API server is not responding properly");
        }
      } catch (connectionError) {
        console.error("Connection test failed:", connectionError);
        throw new Error("Cannot connect to server. Please check your internet connection and try again.");
      }

      console.log("About to login with:", formData.email);
      
      // Call the API login
      const userData = await apiLogin(formData);
      
      // Update auth context
      login(userData, userData.token);
      
      // Navigate to the page user was trying to access, or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      
      // Check if the error is from our API
      if (err.errors && Array.isArray(err.errors)) {
        // Format validation errors
        const errorMessage = err.errors.map(e => `${e.field}: ${e.message}`).join(', ');
        setError(errorMessage);
      } else if (err.message && (err.message.includes("Failed to fetch") || 
                  err.message.includes("Cannot connect to server"))) {
        // Network error
        setError("Cannot connect to server. Please check your internet connection and try again.");
      } else if (err.message && err.message.includes("Invalid credentials")) {
        // Authentication error
        setError("Invalid email or password. Please try again.");
      } else {
        // General error
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center bg-cosmic-background text-cosmic-text py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Space background with parallax effect */}
      <div className="cosmic-stars opacity-30 fixed inset-0 pointer-events-none"></div>
      <div className="cosmic-nebula cosmic-nebula-blue w-[800px] h-[800px] fixed right-[-200px] top-[-100px] pointer-events-none opacity-20"></div>
      <div className="cosmic-nebula cosmic-nebula-purple w-[600px] h-[600px] fixed left-[-100px] bottom-[-50px] pointer-events-none opacity-15"></div>
      
      <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-8">
        {/* Left side - branding and info */}
        <div className="lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-primary via-purple-500 to-cosmic-secondary flex items-center justify-center shadow-lg shadow-cosmic-primary/20">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cosmic-primary via-purple-400 to-cosmic-secondary">
              Cosmic Classroom
            </h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-primary to-cosmic-secondary">Universe</span> From Your Screen
          </h2>
          
          <p className="text-lg text-cosmic-text-secondary mb-8 max-w-lg mx-auto lg:mx-0">
            Join our community of space enthusiasts and continue your journey through the cosmos with personalized learning experiences.
          </p>
          
          {/* Testimonial or feature highlights */}
          <div className="bg-cosmic-surface/40 backdrop-blur-sm border border-cosmic-border/30 rounded-xl p-4 max-w-md mx-auto lg:mx-0 shadow-cosmic">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-cosmic-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-cosmic-text-primary">
                  "The AI-powered answers helped my students understand complex space concepts in a way that was age-appropriate and engaging."
                </p>
                <p className="text-cosmic-text-muted mt-2 text-sm">
                  — Maria K., Science Teacher
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - form */}
        <div className="lg:w-1/2">
          <div className="bg-cosmic-surface/40 backdrop-blur-md border border-cosmic-border/40 rounded-xl p-8 shadow-cosmic relative overflow-hidden">
            {/* Subtle decorative element */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-cosmic-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cosmic-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cosmic-primary to-cosmic-secondary">
                  Sign In
                </h2>
                <p className="text-cosmic-text-secondary mt-1">
                  Enter your credentials to continue
                </p>
              </div>

              {error && (
                <Alert color="red" className="mb-6" variant="gradient" icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }>
                  <div className="font-medium">Sign In Error</div>
                  <div className="mt-1 text-sm">{error}</div>
                </Alert>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="cosmic-form-field">
                  <Typography variant="small" className="font-medium mb-1.5 text-cosmic-text">
                    Email
                  </Typography>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    size="lg"
                    placeholder="your.email@example.com"
                    className="cosmic-input focus:ring-cosmic-primary/30"
                    required
                    labelProps={{
                      className: "!text-cosmic-primary"
                    }}
                    color="blue"
                  />
                </div>

                <div className="cosmic-form-field">
                  <div className="flex justify-between items-center mb-1.5">
                    <Typography variant="small" className="font-medium text-cosmic-text">
                      Password
                    </Typography>
                    <Link to="#" className="text-xs text-cosmic-primary hover:text-cosmic-primary/80 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    size="lg"
                    placeholder="••••••••"
                    className="cosmic-input focus:ring-cosmic-primary/30"
                    required
                    labelProps={{
                      className: "!text-cosmic-primary"
                    }}
                    color="blue"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-cosmic-primary to-cosmic-secondary hover:from-cosmic-primary/90 hover:to-cosmic-secondary/90 text-white py-3 rounded-lg shadow-lg shadow-cosmic-primary/20 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cosmic-border/50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-cosmic-surface/40 text-cosmic-text-muted text-sm">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Demo Button */}
              <Button 
                type="button"
                className="w-full bg-cosmic-surface hover:bg-cosmic-surface/80 text-cosmic-text-primary py-2.5 rounded-lg border border-cosmic-border/50 transition-all"
                onClick={() => {
                  // Flag that we're in demo mode to avoid server calls
                  localStorage.setItem('demo_mode', 'true');
                  
                  // Create a safer mock user for demo without hitting the server
                  const mockUser = {
                    id: 1,
                    username: "space_explorer",
                    email: "demo@cosmiclassroom.com",
                    firstName: "Demo",
                    lastName: "User",
                    role: "student"
                  };
                  
                  // Set a demo token in a way that works without hitting the API
                  localStorage.setItem('demo_user', JSON.stringify(mockUser));
                  
                  // Simulate login without token validation (bypass the API)
                  login(mockUser, "DEMO_MODE_NO_API");
                  
                  // Tell the game context to use demo data
                  localStorage.setItem('use_demo_game_data', 'true');
                  
                  // Navigate to dashboard
                  navigate('/dashboard');
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-cosmic-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.7 7.3A.7.7 0 016.3 6h7.4a.7.7 0 110 1.4H6.3a.7.7 0 01-.6-.7zm0 3.8a.7.7 0 01.6-.7h7.4a.7.7 0 110 1.4H6.3a.7.7 0 01-.6-.7zm0 3.8a.7.7 0 01.6-.7h7.4a.7.7 0 110 1.4H6.3a.7.7 0 01-.6-.7z" />
                  </svg>
                  Demo Login
                </span>
              </Button>

              <div className="text-center mt-6">
                <Typography variant="small" className="text-cosmic-text-secondary">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-cosmic-primary hover:text-cosmic-primary/80 font-medium transition-colors">
                    Create an account
                  </Link>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignIn;