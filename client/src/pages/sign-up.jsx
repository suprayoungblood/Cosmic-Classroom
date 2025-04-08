import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Alert,
  Select,
  Option,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

export function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student", // Default role
    age: "", // For age-based content
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
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
        console.log("Server status check passed");
      } catch (connectionError) {
        console.error("Connection test failed:", connectionError);
        throw new Error("Cannot connect to server. Please check your internet connection and try again.");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password length
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Convert age to number if present
      const userData = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        interests: ["space"], // Default interest
      };

      console.log("About to register with data:", userData);

      // Register the user
      const response = await apiRegister(userData);
      console.log("Registration successful:", response);
      
      // Update auth context
      login(response, response.token);
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      
      // Check if the error is from our API
      if (err.errors && Array.isArray(err.errors)) {
        // Format validation errors
        const errorMessage = err.errors.map(e => `${e.field || e.param}: ${e.message || e.msg}`).join(', ');
        setError(errorMessage);
      } else if (err.message && (err.message.includes("Failed to fetch") || 
                err.message.includes("Cannot connect to server"))) {
        // Network error
        setError("Cannot connect to server. Please check your internet connection and try again.");
      } else {
        // General error
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center bg-cosmic-background text-cosmic-text py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Space background */}
      <div className="cosmic-stars opacity-30 fixed inset-0 pointer-events-none"></div>
      <div className="cosmic-nebula cosmic-nebula-teal w-[800px] h-[800px] fixed right-[-200px] top-[-100px] pointer-events-none opacity-20"></div>
      <div className="cosmic-nebula cosmic-nebula-amber w-[600px] h-[600px] fixed left-[-100px] bottom-[-50px] pointer-events-none opacity-15"></div>
      
      <div className="relative z-10 max-w-screen-xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-primary via-purple-500 to-cosmic-secondary flex items-center justify-center shadow-lg shadow-cosmic-primary/20">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cosmic-primary via-purple-400 to-cosmic-secondary">
              Cosmic Classroom
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-primary to-cosmic-secondary">
              Join Our Space Community
            </span>
          </h2>
          <p className="text-lg text-cosmic-text-secondary max-w-2xl mx-auto">
            Create your account to start your journey through the cosmos with personalized learning experiences
          </p>
        </div>

        {error && (
          <Alert color="red" className="mb-6 max-w-2xl mx-auto" variant="gradient" icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }>
            <div className="font-medium">Registration Error</div>
            <div className="mt-1 text-sm">{error}</div>
          </Alert>
        )}

        <div className="bg-cosmic-surface/40 backdrop-blur-md border border-cosmic-border/40 rounded-xl p-8 shadow-cosmic max-w-2xl mx-auto relative overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-cosmic-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cosmic-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="cosmic-form-field">
                  <Typography variant="small" className="font-medium mb-1.5 text-cosmic-text">
                    First Name
                  </Typography>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    size="lg"
                    placeholder="First name"
                    className="cosmic-input focus:ring-cosmic-primary/30"
                    required
                    labelProps={{
                      className: "!text-cosmic-primary"
                    }}
                    color="blue"
                  />
                </div>
                <div className="cosmic-form-field">
                  <Typography variant="small" className="font-medium mb-1.5 text-cosmic-text">
                    Last Name
                  </Typography>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    size="lg"
                    placeholder="Last name"
                    className="cosmic-input focus:ring-cosmic-primary/30"
                    required
                    labelProps={{
                      className: "!text-cosmic-primary"
                    }}
                    color="blue"
                  />
                </div>
              </div>

              <div className="cosmic-form-field">
                <Typography variant="small" className="font-medium mb-1.5 text-cosmic-text">
                  Username
                </Typography>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  size="lg"
                  placeholder="Choose a username"
                  className="cosmic-input focus:ring-cosmic-primary/30"
                  required
                  labelProps={{
                    className: "!text-cosmic-primary"
                  }}
                  color="blue"
                />
              </div>

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
                <Typography variant="small" className="font-medium mb-1.5 text-cosmic-text">
                  Password
                </Typography>
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
                <Typography variant="small" className="text-cosmic-text-muted mt-1.5 text-xs">
                  Password must be at least 6 characters
                </Typography>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="cosmic-form-field">
                  <Typography variant="small" className="font-medium mb-1.5 text-cosmic-text">
                    Role
                  </Typography>
                  <Select 
                    value={formData.role} 
                    onChange={handleRoleChange}
                    className="focus:ring-cosmic-primary/30"
                    label="Select your role"
                    color="blue"
                    labelProps={{
                      className: "!text-cosmic-primary"
                    }}
                  >
                    <Option value="student">Student</Option>
                    <Option value="educator">Educator</Option>
                    <Option value="parent">Parent</Option>
                    <Option value="enthusiast">Space Enthusiast</Option>
                  </Select>
                </div>
                <div className="cosmic-form-field">
                  <Typography variant="small" className="font-medium mb-1.5 text-cosmic-text">
                    Age (for students)
                  </Typography>
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    size="lg"
                    placeholder="Age (optional)"
                    className="cosmic-input focus:ring-cosmic-primary/30"
                    min="4"
                    max="18"
                    labelProps={{
                      className: "!text-cosmic-primary"
                    }}
                    color="blue"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-cosmic-primary to-cosmic-secondary hover:from-cosmic-primary/90 hover:to-cosmic-secondary/90 text-white py-3 rounded-lg shadow-lg shadow-cosmic-primary/20 transition-all duration-300 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center mt-4">
                <Typography variant="small" className="text-cosmic-text-secondary">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="text-cosmic-primary hover:text-cosmic-primary/80 font-medium transition-colors">
                    Sign in now
                  </Link>
                </Typography>
              </div>
            </form>

            {/* Features highlight */}
            <div className="mt-8 pt-6 border-t border-cosmic-border/30">
              <div className="text-center mb-4">
                <Typography variant="small" className="text-cosmic-text-primary font-medium">
                  Benefits of joining Cosmic Classroom
                </Typography>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-cosmic-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="small" className="text-cosmic-text-secondary text-sm">
                      AI-powered space education
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-cosmic-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="small" className="text-cosmic-text-secondary text-sm">
                      Age-appropriate content
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-cosmic-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="small" className="text-cosmic-text-secondary text-sm">
                      Save your learning history
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;