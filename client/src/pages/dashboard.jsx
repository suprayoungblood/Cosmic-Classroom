import React, { useEffect, useState } from "react";
import { Typography, Tabs, TabsHeader, Tab, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { getQuestionHistory } from "../api/questions";
import CosmicQA from "../components/cosmic/cosmic-qa";
import CosmicHistory from "../components/cosmic/cosmic-history";
import CosmicLearningCenter from "../components/cosmic/cosmic-learning-center";
import CosmicDashboardStats from "../components/cosmic/cosmic-dashboard-stats";
import CosmicProfile from "../components/cosmic/cosmic-profile";

export function Dashboard() {
  const [user, setUser] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user from localStorage, with fallback
    const currentUser = getCurrentUser();

    // If we have a user in localStorage, set it and fetch history
    if (currentUser) {
      setUser(currentUser);
      fetchQuestionHistorySafely();
    } else {
      // No user in localStorage, don't fetch history
      setLoading(false);
    }
  }, []);
  
  // Safely fetch question history
  const fetchQuestionHistorySafely = async () => {
    try {
      setLoading(true);
      // Add a longer delay to prevent API hammering
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Fetch question history with robust error handling
      const history = await getQuestionHistory();
      
      // Set history (will be empty array if API failed)
      setQuestionHistory(history || []);
    } catch (error) {
      console.error("Error fetching question history:", error);
      setQuestionHistory([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuestion = (question, answer) => {
    // Add new question to history (optimistically)
    setQuestionHistory([
      {
        id: Date.now(), // Temporary ID
        question,
        answer,
        createdAt: new Date().toISOString(),
      },
      ...questionHistory,
    ]);
    
    // Update user's question count
    if (user) {
      setUser({
        ...user,
        questionsAsked: (user.questionsAsked || 0) + 1
      });
    }
  };
  
  // Handle profile updates
  const handleProfileUpdate = (updatedUser) => {
    // Merge the updated user data with current user data
    setUser({
      ...user,
      ...updatedUser
    });
  };

  // If user is an educator or admin, immediately redirect to appropriate dashboard
  useEffect(() => {
    if (user?.role === "educator") {
      navigate('/educator/dashboard');
    } else if (user?.role === "admin") {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // Only students see the regular dashboard, educators and admins are redirected
  return (
    <div className="min-h-screen bg-cosmic-background text-cosmic-text pb-20">
      {/* Hero section with personalized greeting - added more top padding */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cosmic-primary/10 to-transparent mt-12">
        <div className="cosmic-stars opacity-20"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Typography variant="h2" className="font-bold text-gradient">
              {user ? `Welcome back, ${user.firstName || user.username}!` : "Welcome to Cosmic Classroom!"}
            </Typography>
            <Typography variant="paragraph" className="mt-2 text-lg text-cosmic-text-secondary max-w-2xl mx-auto">
              {user?.role === "student" ? (
                "Let's continue our space adventure! What do you want to learn today?"
              ) : user?.role === "educator" ? (
                "Redirecting to educator dashboard..."
              ) : user?.role === "admin" ? (
                "Redirecting to admin dashboard..."
              ) : (
                "Explore the wonders of space with our AI-powered space education platform."
              )}
            </Typography>
            
            {/* Role-specific buttons as fallback if automatic redirect fails */}
            {user?.role === "educator" && (
              <div className="mt-4">
                <Link to="/educator/dashboard">
                  <Button className="bg-cosmic-primary">Go to Educator Dashboard</Button>
                </Link>
              </div>
            )}
            {user?.role === "admin" && (
              <div className="mt-4 flex justify-center gap-4">
                <Link to="/educator/dashboard">
                  <Button className="bg-cosmic-primary">Educator Dashboard</Button>
                </Link>
                <Link to="/admin/dashboard">
                  <Button className="bg-red-500">Admin Dashboard</Button>
                </Link>
              </div>
            )}
          </div>

          {user?.role === "student" && <CosmicDashboardStats user={user} history={questionHistory} />}
        </div>
      </div>

      {/* Main content area - only shown for students */}
      {user?.role === "student" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <Tabs value={activeTab} className="mb-8">
            <TabsHeader className="bg-cosmic-card-bg/50 border-cosmic-border">
              <Tab 
                value="profile" 
                onClick={() => setActiveTab("profile")}
                className={activeTab === "profile" ? "text-cosmic-primary" : ""}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  My Profile
                </div>
              </Tab>
              <Tab 
                value="explore" 
                onClick={() => setActiveTab("explore")}
                className={activeTab === "explore" ? "text-cosmic-primary" : ""}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
                  </svg>
                  Explore Space
                </div>
              </Tab>
              <Tab 
                value="history" 
                onClick={() => setActiveTab("history")}
                className={activeTab === "history" ? "text-cosmic-primary" : ""}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" />
                  </svg>
                  Your History
                </div>
              </Tab>
              <Tab 
                value="learn" 
                onClick={() => setActiveTab("learn")}
                className={activeTab === "learn" ? "text-cosmic-primary" : ""}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
                  </svg>
                  Learning Center
                </div>
              </Tab>
            </TabsHeader>
          </Tabs>

          <div className="mt-8">
            {activeTab === "profile" && (
              <div className="w-full">
                {user ? (
                  <CosmicProfile user={user} onProfileUpdate={handleProfileUpdate} />
                ) : (
                  <div className="text-center p-10 bg-cosmic-background/30 border border-cosmic-border rounded-xl">
                    <p className="text-lg text-cosmic-text-secondary">Loading user profile...</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "explore" && (
              <CosmicQA user={user} onNewQuestion={handleNewQuestion} />
            )}
            {activeTab === "history" && (
              <CosmicHistory history={questionHistory} loading={loading} />
            )}
            {activeTab === "learn" && (
              <CosmicLearningCenter user={user} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;