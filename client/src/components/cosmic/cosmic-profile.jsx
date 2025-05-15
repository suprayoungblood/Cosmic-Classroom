import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Button,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Progress,
} from "@material-tailwind/react";
import { 
  PencilIcon, 
  ShieldCheckIcon,
  CalendarIcon,
  EnvelopeIcon,
  UserCircleIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { updateProfile } from "../../api/auth.js";
import { useGame } from "../../contexts/GameContext.jsx";

const CosmicProfile = ({ user, onProfileUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: user?.bio || "Space enthusiast exploring the cosmos through Cosmic Classroom.",
    interests: user?.interests || ["Planets", "Black Holes", "Astronomy"],
    role: user?.role || "student"
  });
  
  const [activeTab, setActiveTab] = useState("profile");
  const { gameData, loading: gameLoading } = useGame();

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate member duration
  const getMemberDuration = (dateString) => {
    if (!dateString) return "New member";
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add/remove interests
  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call API to update profile
      const updatedUser = await updateProfile(formData);
      
      // Update parent component
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (could add error state and display message)
    }
  };
  
  // Get rank color based on user level with safe fallback
  const getRankColor = (level) => {
    if (!level) return "indigo"; // Default color for undefined/null level
    
    // Map of level names to colors
    const levels = {
      "Novice": "blue",
      "Explorer": "indigo",
      "Voyager": "purple",
      "Astronomer": "pink",
      "Scientist": "red",
      "Astrophysicist": "amber",
      "Cosmic Master": "cyan"
    };
    
    // Return the mapped color or default to blue if level isn't recognized
    return levels[level] || "blue";
  };
  
  // Get available space badges
  const getBadges = () => {
    // In a real app, these would come from the user's achievements
    return [
      { name: "First Question", icon: "🚀", description: "Asked your first space question", earned: true },
      { name: "Deep Space Explorer", icon: "🌌", description: "Explored black hole questions", earned: user?.interests?.includes("Black Holes") },
      { name: "Planetary Pioneer", icon: "🪐", description: "Expert in planetary knowledge", earned: user?.interests?.includes("Planets") },
      { name: "Star Gazer", icon: "⭐", description: "Unlocked stellar information", earned: user?.interests?.includes("Stars") },
      { name: "Cosmic Scholar", icon: "📚", description: "Completed 5 learning modules", earned: false },
      { name: "Question Master", icon: "❓", description: "Asked 50+ questions", earned: false },
    ];
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Card - Redesigned */}
      <Card className="w-full overflow-hidden bg-cosmic-card-bg border border-cosmic-border shadow-cosmic">
        {/* Banner with text overlay */}
        <div className="relative">
          {/* Gradient banner background */}
          <div className="h-64 bg-gradient-to-r from-cosmic-primary/80 to-cosmic-secondary/80 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="cosmic-stars"></div>
            </div>
            
            {/* Edit button */}
            {!editMode && (
              <div className="absolute top-4 right-4 z-20">
                <IconButton 
                  variant="text" 
                  color="white" 
                  onClick={() => setEditMode(true)}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <PencilIcon className="h-5 w-5" />
                </IconButton>
              </div>
            )}
            
            {/* User info overlay - positioned on top of banner */}
            <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 pt-4">
              <div className="flex justify-between items-end">
                <div className="text-white">
                  <Typography variant="h2" className="font-bold text-white text-shadow">
                    {`${user?.firstName || ''} ${user?.lastName || 'User'}`}
                  </Typography>
                  <Typography variant="lead" className="text-white/90 mt-1">
                    @{user?.username || 'username'}
                  </Typography>
                  
                  {/* Badges */}
                  <div className="flex items-center gap-2 mt-3">
                    <Chip
                      value={user?.level || "Explorer"}
                      size="sm"
                      variant="gradient"
                      color={getRankColor(user?.level)}
                      className="shadow-sm"
                    />
                    {user?.role && (
                      <Chip
                        value={user?.role === "student" ? "Student" : "Educator"}
                        size="sm"
                        variant="filled"
                        className="bg-white/20 backdrop-blur-sm text-white shadow-sm"
                        icon={<ShieldCheckIcon className="h-3 w-3" />}
                      />
                    )}
                  </div>
                </div>
                
                {/* Avatar positioned at bottom right of banner */}
                <div className="hidden md:block">
                  <Avatar
                    size="xxl"
                    alt={user?.username || "User"}
                    src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || "cosmic"}`}
                    className="border-4 border-white/20 shadow-lg bg-cosmic-card-bg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile avatar - shown only on small screens */}
          <div className="md:hidden absolute -bottom-12 left-6">
            <Avatar
              size="xxl"
              alt={user?.username || "User"}
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || "cosmic"}`}
              className="border-4 border-cosmic-background/80 shadow-lg bg-cosmic-card-bg"
            />
          </div>
        </div>

        <CardBody className="px-6 pb-6 pt-6 md:pt-4">
          <div className="flex-1 min-w-0 mt-10 md:mt-0">
            {!editMode ? (
              <>
                {/* User metadata section */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mt-2 md:mt-0">
                  <div className="md:hidden">
                    {/* Empty space for mobile avatar positioning */}
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 md:items-center text-cosmic-text-muted">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <Typography variant="small">
                        Member for {getMemberDuration(user?.createdAt)}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <EnvelopeIcon className="h-4 w-4" />
                      <Typography variant="small">
                        {user?.email || "email@example.com"}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Separate container for bio and interests - contained within profile card */}
                <div className="mt-4 space-y-4 max-w-full clear-both">
                  <div>
                    <Typography variant="paragraph" className="text-cosmic-text-secondary">
                      {user?.bio || formData.bio}
                    </Typography>
                  </div>

                  {/* Interests - adjusted spacing and containing */}
                  <div className="w-full block">
                    <Typography variant="small" className="text-cosmic-text-muted mb-2 block">
                      Cosmic Interests
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {(user?.interests || formData.interests).map((interest, index) => (
                        <Chip
                          key={index}
                          value={interest}
                          size="sm"
                          className="bg-cosmic-primary/10 text-cosmic-primary border border-cosmic-primary/20"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm text-cosmic-text-muted mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-cosmic-border bg-cosmic-background/50 text-cosmic-text-primary focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm text-cosmic-text-muted mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-cosmic-border bg-cosmic-background/50 text-cosmic-text-primary focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm text-cosmic-text-muted mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-cosmic-border bg-cosmic-background/50 text-cosmic-text-primary focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm text-cosmic-text-muted mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-cosmic-border bg-cosmic-background/50 text-cosmic-text-primary focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm text-cosmic-text-muted mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-cosmic-border bg-cosmic-background/50 text-cosmic-text-primary focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-cosmic-text-muted mb-1">
                      Cosmic Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Planets", "Stars", "Black Holes", "Galaxies", "Space Travel", "Astronomy", "Astrophysics", "Cosmology"].map((interest) => (
                        <Chip
                          key={interest}
                          value={interest}
                          size="sm"
                          onClick={() => toggleInterest(interest)}
                          className={formData.interests.includes(interest) 
                            ? "bg-cosmic-primary text-white" 
                            : "bg-cosmic-card-bg text-cosmic-text-secondary"}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 gap-3">
                    <Button 
                      variant="text" 
                      color="red" 
                      onClick={() => setEditMode(false)} 
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-cosmic-primary">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
          
          {/* Profile tabs */}
          {!editMode && (
            <>
              <div className="mt-8">
                <Tabs value={activeTab} className="mb-4">
                  <TabsHeader className="bg-cosmic-card-bg/50 border-cosmic-border">
                    <Tab 
                      value="profile" 
                      onClick={() => setActiveTab("profile")}
                      className={activeTab === "profile" ? "text-cosmic-primary" : ""}
                    >
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="w-4 h-4" />
                        Profile
                      </div>
                    </Tab>
                    <Tab 
                      value="badges" 
                      onClick={() => setActiveTab("badges")}
                      className={activeTab === "badges" ? "text-cosmic-primary" : ""}
                    >
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-4 h-4" />
                        Achievements
                      </div>
                    </Tab>
                  </TabsHeader>
                </Tabs>
                
                {activeTab === "profile" && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <Card className="bg-cosmic-background/30 border border-cosmic-border">
                        <CardBody>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-cosmic-primary/20 flex items-center justify-center text-cosmic-primary">
                              <RocketLaunchIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <Typography variant="h6" color="white">
                                {(gameData?.questionsAsked || 0).toLocaleString()}
                              </Typography>
                              <Typography className="text-cosmic-text-secondary text-sm">
                                Questions Asked
                              </Typography>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      
                      <Card className="bg-cosmic-background/30 border border-cosmic-border">
                        <CardBody>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-cosmic-secondary/20 flex items-center justify-center text-cosmic-secondary">
                              <GlobeAltIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <Typography variant="h6" color="white">
                                {gameData?.topicsExplored || 0}
                              </Typography>
                              <Typography className="text-cosmic-text-secondary text-sm">
                                Topics Explored
                              </Typography>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      
                      <Card className="bg-cosmic-background/30 border border-cosmic-border">
                        <CardBody>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                              <FireIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <Typography variant="h6" color="white">
                                {`${gameData?.dailyStreak || 0} Days`}
                              </Typography>
                              <Typography className="text-cosmic-text-secondary text-sm">
                                Daily Streak
                              </Typography>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                    
                    {/* Progress */}
                    <div className="mt-6">
                      <Typography variant="h6" color="white" className="mb-2">
                        Level Progress
                      </Typography>
                      <div className="w-full bg-cosmic-background/50 rounded-full h-3 overflow-hidden border border-cosmic-border">
                        <div className="bg-gradient-to-r from-cosmic-primary to-cosmic-secondary h-full" 
                             style={{ width: `${typeof gameData?.levelProgress === 'number' ? gameData.levelProgress : 0}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <Typography variant="small" className="text-cosmic-text-muted">
                          {`${typeof gameData?.levelProgress === 'number' ? gameData.levelProgress : 0}% to ${gameData?.nextLevel || "Next Level"}`}
                        </Typography>
                        <Typography variant="small" className="text-cosmic-text-muted">
                          {`${(gameData?.xp || 0).toLocaleString()} / ${(typeof gameData?.xp === 'number' && typeof gameData?.xpToNextLevel === 'number') ? 
                            (gameData.xp + gameData.xpToNextLevel).toLocaleString() : 
                            (gameData?.xp || 0).toLocaleString()} XP`}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "badges" && (
                  <div>
                    <Typography variant="h6" color="white" className="mb-4">
                      Cosmic Achievements
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {gameLoading ? (
                        // Loading skeleton
                        Array(6).fill(0).map((_, index) => (
                          <Card key={index} className="bg-cosmic-background/20 border border-cosmic-border animate-pulse">
                            <CardBody>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-cosmic-background/30"></div>
                                <div className="flex-1">
                                  <div className="h-5 bg-cosmic-background/40 rounded mb-2 w-3/4"></div>
                                  <div className="h-4 bg-cosmic-background/40 rounded w-full"></div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        // Real data - with safe handling of missing badges
                        (gameData?.badges || []).map((badge, index) => (
                          <Card key={index} className={`${badge?.earned ? "bg-cosmic-background/30" : "bg-cosmic-background/10 opacity-60"} border border-cosmic-border`}>
                            <CardBody>
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${badge?.earned ? "bg-cosmic-primary/20" : "bg-cosmic-background/30"} flex items-center justify-center text-2xl`}>
                                  {badge?.icon || "🏆"}
                                </div>
                                <div>
                                  <Typography variant="h6" color={badge?.earned ? "white" : "blue-gray"}>
                                    {badge?.name || "Badge"}
                                  </Typography>
                                  <Typography className={`${badge?.earned ? "text-cosmic-text-secondary" : "text-cosmic-text-muted"} text-sm`}>
                                    {badge?.description || "Cosmic achievement"}
                                  </Typography>
                                </div>
                              </div>
                              {badge && !badge.earned && (
                                <div className="mt-2 border-t border-cosmic-border pt-2">
                                  <Typography variant="small" className="text-cosmic-text-muted italic">
                                    Not yet earned
                                  </Typography>
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CosmicProfile;