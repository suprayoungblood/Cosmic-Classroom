import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Progress,
  Chip,
  IconButton,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { StarIcon, FireIcon, SparklesIcon, TrophyIcon, GiftIcon } from "@heroicons/react/24/solid";
import confetti from 'canvas-confetti';
import { useGame } from "@/contexts/GameContext";

const CosmicGamification = ({ user }) => {
  const [activeTab, setActiveTab] = useState("quests");
  const [showReward, setShowReward] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [xpAnimation, setXpAnimation] = useState(false);
  const [completedChallenge, setCompletedChallenge] = useState(null);
  
  const { gameData, loading: gameLoading, awardXP } = useGame();
  
  // Level information
  const levelInfo = {
    "Novice": { color: "blue", stars: 1, requiredXP: 1000 },
    "Explorer": { color: "indigo", stars: 2, requiredXP: 2400 },
    "Voyager": { color: "purple", stars: 3, requiredXP: 4000 },
    "Astronomer": { color: "pink", stars: 4, requiredXP: 6000 },
    "Scientist": { color: "red", stars: 5, requiredXP: 8500 },
    "Astrophysicist": { color: "amber", stars: 6, requiredXP: 12000 },
    "Cosmic Master": { color: "cyan", stars: 7, requiredXP: null }
  };
  
  // Access game data
  const currentXP = gameData?.xp || 0;
  const currentLevel = gameData?.level || "Novice";
  const nextLevel = gameData?.nextLevel;
  const dailyStreak = gameData?.dailyStreak || 0;
  const questionsAsked = gameData?.questionsAsked || 0;
  const topicsExplored = gameData?.topicsExplored || 0;

  // XP Calculation from user activities (for display purposes)
  const calculateXP = () => {
    return currentXP;
  };
  
  // Achievements data
  const badges = [
    { 
      id: 1,
      name: "First Contact", 
      description: "Asked your first space question", 
      icon: "🚀", 
      earned: questionsAsked >= 1,
      xp: 100
    },
    { 
      id: 2,
      name: "Deep Space Explorer", 
      description: "Explored black hole questions", 
      icon: "🌌", 
      earned: user?.interests?.includes("Black Holes") || Math.random() > 0.5,
      xp: 250
    },
    { 
      id: 3,
      name: "Planetary Pioneer", 
      description: "Expert in planetary knowledge", 
      icon: "🪐", 
      earned: user?.interests?.includes("Planets") || Math.random() > 0.3,
      xp: 250
    },
    { 
      id: 4,
      name: "Star Gazer", 
      description: "Unlocked stellar information", 
      icon: "⭐", 
      earned: user?.interests?.includes("Stars") || Math.random() > 0.4,
      xp: 200
    },
    { 
      id: 5,
      name: "Cosmic Scholar", 
      description: "Completed 5 learning modules", 
      icon: "📚", 
      earned: topicsExplored >= 5,
      xp: 300
    },
    { 
      id: 6,
      name: "Question Master", 
      description: "Asked 50+ questions", 
      icon: "❓", 
      earned: questionsAsked >= 50,
      xp: 500
    },
    { 
      id: 7,
      name: "Astro Physicist", 
      description: "Understood complex space physics", 
      icon: "⚛️", 
      earned: false,
      xp: 750
    },
    { 
      id: 8,
      name: "Streak Champion", 
      description: "Maintained a 7-day learning streak", 
      icon: "🔥", 
      earned: dailyStreak >= 7,
      xp: 350
    },
    { 
      id: 9,
      name: "Galaxy Brain", 
      description: "Mastered cosmic knowledge", 
      icon: "🧠", 
      earned: false,
      xp: 1000
    },
  ];
  
  // Active quests/challenges
  const challenges = [
    {
      id: 101,
      title: "Solar System Expert",
      description: "Answer questions about all 8 planets in our solar system",
      icon: "🪐",
      reward: 500,
      progress: 62,
      total: 8,
      deadline: "2 days left"
    },
    {
      id: 102,
      title: "Black Hole Voyager",
      description: "Learn about black holes and their properties",
      icon: "🕳️",
      reward: 350,
      progress: 3,
      total: 5,
      deadline: "4 days left"
    },
    {
      id: 103,
      title: "Daily Explorer",
      description: "Complete your daily challenges for 7 days straight",
      icon: "🔥",
      reward: 300,
      progress: dailyStreak,
      total: 7,
      deadline: "Ongoing"
    },
    {
      id: 104,
      title: "Space Community Leader",
      description: "Share your knowledge by answering other students' questions",
      icon: "👩‍🚀",
      reward: 400,
      progress: 1,
      total: 5,
      deadline: "6 days left"
    }
  ];
  
  // Daily challenges
  const dailyChallenges = [
    {
      id: 201,
      title: "Ask 3 Questions",
      description: "Ask three questions about space",
      icon: "❓",
      reward: 90,
      progress: questionsAsked % 3,
      total: 3,
      completed: false
    },
    {
      id: 202,
      title: "Learn a New Topic",
      description: "Explore a space topic you haven't studied before",
      icon: "🔭",
      reward: 120,
      progress: 0,
      total: 1,
      completed: false
    },
    {
      id: 203,
      title: "Quiz Champion",
      description: "Complete today's space quiz with at least 80% correct",
      icon: "📝",
      reward: 150,
      progress: 0,
      total: 1,
      completed: false
    }
  ];
  
  // Rewards shop items
  const rewardItems = [
    {
      id: 301,
      name: "Dark Galaxy Theme",
      description: "Unlock a beautiful dark theme with twinkling stars",
      icon: "🌃",
      cost: 500,
      type: "theme"
    },
    {
      id: 302,
      name: "Animated Rocket Avatar",
      description: "A special animated avatar for your profile",
      icon: "🚀",
      cost: 750,
      type: "avatar"
    },
    {
      id: 303,
      name: "Expert Q&A Session",
      description: "30-minute session with a space expert",
      icon: "👨‍🚀",
      cost: 1200,
      type: "experience"
    },
    {
      id: 304,
      name: "Cosmic Badge Collection",
      description: "Unlock 3 exclusive badges for your profile",
      icon: "🏅",
      cost: 850,
      type: "badge"
    },
    {
      id: 305,
      name: "Space Wallpaper Pack",
      description: "High-resolution space wallpapers for your devices",
      icon: "🖼️",
      cost: 300,
      type: "digital"
    }
  ];
  
  // Handle challenge completion
  const completeChallenge = (challenge) => {
    setSelectedChallenge(null);
    setCompletedChallenge(challenge);
    
    // Award XP through GameContext
    awardXP(challenge.reward);
    
    // Trigger XP animation
    setXpAnimation(true);
    
    // Launch confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Hide animation after delay
    setTimeout(() => {
      setXpAnimation(false);
      setCompletedChallenge(null);
    }, 3000);
  };
  
  // Handle reward purchase
  const purchaseReward = (reward) => {
    // In a real implementation, this would call the API to purchase the reward
    // And subtract the cost from the user's XP
    setShowReward(true);
    
    // Launch confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#C0C0C0', '#9370DB']
    });
    
    // Hide animation after delay
    setTimeout(() => {
      setShowReward(false);
    }, 4000);
  };
  
  // Level progress calculation - use game data
  const levelProgress = () => {
    if (gameData) {
      return gameData.levelProgress;
    }
    
    // Fallback calculation if game data isn't available
    const currentLevelInfo = levelInfo[currentLevel];
    if (!currentLevelInfo || !currentLevelInfo.requiredXP) return 100;
    
    return (currentXP / currentLevelInfo.requiredXP) * 100;
  };

  // Render star rating
  const renderStars = (level) => {
    const levelData = levelInfo[level];
    if (!levelData) return null;
    
    return Array(levelData.stars).fill(0).map((_, i) => (
      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
    ));
  };
  
  // Display challenge details
  const ChallengeDetails = ({ challenge }) => {
    if (!challenge) return null;
    
    return (
      <Card className="w-full mt-4 bg-cosmic-card-bg/90 border border-cosmic-border">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cosmic-primary/20 p-3 text-2xl">
                {challenge.icon}
              </div>
              <Typography variant="h4" color="white">
                {challenge.title}
              </Typography>
            </div>
            <Chip
              value={`+${challenge.reward} XP`}
              size="lg"
              variant="gradient"
              color="amber"
              className="rounded-full"
            />
          </div>
          <Typography className="text-cosmic-text-secondary">
            {challenge.description}
          </Typography>
          
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <Typography variant="small" color="white">
                Progress: {challenge.progress} / {challenge.total}
              </Typography>
              <Typography variant="small" className="text-cosmic-text-muted">
                {challenge.deadline}
              </Typography>
            </div>
            <Progress 
              value={(challenge.progress / challenge.total) * 100} 
              size="lg" 
              className="bg-cosmic-background/50"
              color={challenge.progress === challenge.total ? "green" : "blue"}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              color="green" 
              size="sm" 
              disabled={challenge.progress < challenge.total}
              onClick={() => completeChallenge(challenge)}
              className="flex items-center gap-2"
            >
              <SparklesIcon className="h-4 w-4" />
              {challenge.progress === challenge.total ? "Claim Reward" : "In Progress"}
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="cosmic-gamification pb-12">
      {/* XP Animation */}
      {xpAnimation && completedChallenge && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="relative">
            <div className="animate-bounce-short bg-amber-500/90 text-white text-2xl font-bold py-4 px-6 rounded-xl backdrop-blur-sm border border-amber-400">
              +{completedChallenge.reward} XP
            </div>
            <div className="absolute inset-0 animate-ping-slow bg-amber-500/30 rounded-xl"></div>
          </div>
        </div>
      )}
      
      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-scale-in bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-2xl shadow-cosmic text-center max-w-md">
            <div className="text-4xl mb-2">🎁</div>
            <Typography variant="h3" color="white">Reward Unlocked!</Typography>
            <Typography className="mt-2">
              You've purchased a special reward. It's been added to your inventory.
            </Typography>
          </div>
        </div>
      )}

      {/* Level Progress */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-cosmic-background/40 border border-cosmic-border rounded-xl p-6 shadow-cosmic mb-8 backdrop-blur-sm">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cosmic-primary to-cosmic-secondary flex items-center justify-center text-5xl shadow-glow mb-2">
            {user?.level === "Cosmic Master" ? "🌌" : "🚀"}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(currentLevel)}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
            <div>
              <Typography variant="h4" color="white">
                Level: {currentLevel}
              </Typography>
              <Typography className="text-cosmic-text-secondary text-sm">
                {nextLevel ? `${Math.floor(levelProgress())}% to ${nextLevel}` : "Max Level Reached!"}
              </Typography>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-cosmic-surface/50 border border-cosmic-border rounded-lg">
              <div className="flex items-center gap-1">
                <SparklesIcon className="h-5 w-5 text-amber-400" />
                <Typography variant="h6" color="white">
                  {calculateXP().toLocaleString()} XP
                </Typography>
              </div>
            </div>
          </div>
          
          <div className="relative pt-1 w-full">
            <div className="w-full h-4 bg-cosmic-background/60 rounded-full overflow-hidden border border-cosmic-border">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cosmic-primary to-cosmic-secondary animate-pulse-subtle"
                style={{ width: `${levelProgress()}%` }}
              >
              </div>
            </div>
            <div className="absolute top-1 left-0 w-full h-4 rounded-full overflow-hidden">
              <div className="cosmic-shimmer w-full h-full"></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Chip 
              value={`${dailyStreak} Day Streak 🔥`} 
              className="bg-amber-800/40 text-amber-300 border border-amber-800/70"
            />
            <Chip 
              value={`${badges.filter(b => b.earned).length} Badges 🏆`} 
              className="bg-purple-800/40 text-purple-300 border border-purple-800/70"
            />
            <Chip 
              value={`${questionsAsked} Questions Asked ❓`} 
              className="bg-blue-800/40 text-blue-300 border border-blue-800/70"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab}>
        <TabsHeader className="bg-cosmic-card-bg/70 border border-cosmic-border backdrop-blur-sm">
          <Tab 
            value="quests" 
            onClick={() => setActiveTab("quests")}
            className={activeTab === "quests" ? "text-cosmic-primary" : ""}
          >
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              Quests
            </div>
          </Tab>
          <Tab 
            value="achievements" 
            onClick={() => setActiveTab("achievements")}
            className={activeTab === "achievements" ? "text-cosmic-primary" : ""}
          >
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5" />
              Achievements
            </div>
          </Tab>
          <Tab 
            value="rewards" 
            onClick={() => setActiveTab("rewards")}
            className={activeTab === "rewards" ? "text-cosmic-primary" : ""}
          >
            <div className="flex items-center gap-2">
              <GiftIcon className="h-5 w-5" />
              Rewards
            </div>
          </Tab>
        </TabsHeader>
      </Tabs>
      
      <div className="mt-6">
        {activeTab === "quests" && (
          <div className="grid grid-cols-1 gap-6">
            {/* Daily Challenges */}
            <Card className="bg-cosmic-card-bg/80 border border-cosmic-border overflow-hidden">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 p-6 bg-gradient-to-r from-amber-800/20 to-amber-600/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/20 p-2">
                      <FireIcon className="h-6 w-6 text-amber-500" />
                    </div>
                    <Typography variant="h5" color="white">
                      Daily Challenges
                    </Typography>
                  </div>
                  <Chip
                    value={`Streak: ${dailyStreak} days`}
                    size="sm"
                    variant="ghost"
                    color="amber"
                    className="rounded-full"
                  />
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-cosmic-border">
                  {dailyChallenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 hover:bg-cosmic-card-bg transition-colors">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center text-2xl mr-4">
                          {challenge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <Typography variant="h6" color="white">
                              {challenge.title}
                            </Typography>
                            <Chip
                              value={`+${challenge.reward} XP`}
                              size="sm"
                              variant="ghost"
                              color="amber"
                              className="rounded-full"
                            />
                          </div>
                          <Typography variant="small" className="text-cosmic-text-secondary">
                            {challenge.description}
                          </Typography>
                          <div className="mt-2">
                            <Progress 
                              value={(challenge.progress / challenge.total) * 100} 
                              size="sm" 
                              className="bg-cosmic-background/50"
                              color={challenge.completed ? "green" : "amber"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            
            {/* Weekly Quests */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  {challenges.map((challenge) => (
                    <Card 
                      key={challenge.id} 
                      className={`bg-cosmic-card-bg/80 border ${selectedChallenge?.id === challenge.id ? 'border-cosmic-primary/70 shadow-glow-subtle' : 'border-cosmic-border'} 
                        hover:border-cosmic-primary/50 transition-all cursor-pointer animate-fade-in`}
                      onClick={() => setSelectedChallenge(challenge)}
                    >
                      <CardBody className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl bg-cosmic-surface/50">
                            {challenge.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <Typography variant="h6" color="white">
                                {challenge.title}
                              </Typography>
                              <Chip
                                value={`+${challenge.reward}`}
                                size="sm"
                                variant="ghost"
                                color="amber"
                                className="rounded-full"
                              />
                            </div>
                            <Progress 
                              value={(challenge.progress / challenge.total) * 100} 
                              size="sm" 
                              className="mt-2 bg-cosmic-background/50"
                              color={(challenge.progress / challenge.total) >= 1 ? "green" : "blue"}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-3">
                {selectedChallenge ? (
                  <ChallengeDetails challenge={selectedChallenge} />
                ) : (
                  <Card className="h-full bg-cosmic-card-bg/80 border border-cosmic-border">
                    <CardBody className="flex flex-col items-center justify-center p-8">
                      <div className="h-24 w-24 rounded-full bg-cosmic-background/60 flex items-center justify-center mb-4">
                        <SparklesIcon className="h-12 w-12 text-cosmic-text-muted" />
                      </div>
                      <Typography variant="h5" color="white" className="mb-2">
                        Select a Quest
                      </Typography>
                      <Typography className="text-cosmic-text-secondary text-center">
                        Choose a quest from the left to view details and track your progress
                      </Typography>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`animate-fade-in ${badge.earned 
                  ? 'bg-cosmic-card-bg/90 border border-cosmic-border' 
                  : 'bg-cosmic-card-bg/30 border border-cosmic-border/30'}`}
              >
                <CardBody className="p-5">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`h-16 w-16 rounded-xl flex items-center justify-center text-3xl
                        ${badge.earned 
                          ? 'bg-gradient-to-br from-cosmic-primary/30 to-cosmic-accent/30 border border-cosmic-primary/30' 
                          : 'bg-cosmic-background/30 text-cosmic-text-muted/50 border border-cosmic-border/30'}`}
                    >
                      {badge.icon}
                      {badge.earned && (
                        <div className="absolute inset-0 cosmic-badge-glow rounded-xl opacity-50"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography 
                            variant="h6" 
                            color={badge.earned ? "white" : "blue-gray"} 
                            className="flex items-center gap-1"
                          >
                            {badge.name}
                            {badge.earned && (
                              <TrophyIcon className="h-4 w-4 text-yellow-400 inline-block ml-1" />
                            )}
                          </Typography>
                          <Typography 
                            variant="small" 
                            className={badge.earned ? "text-cosmic-text-secondary" : "text-cosmic-text-muted"}
                          >
                            {badge.description}
                          </Typography>
                        </div>
                        <Chip
                          value={`${badge.xp} XP`}
                          size="sm"
                          variant="outlined"
                          color={badge.earned ? "amber" : "blue-gray"}
                          className="rounded-full"
                        />
                      </div>
                      
                      {!badge.earned && (
                        <div className="mt-3 border-t border-cosmic-border/20 pt-2">
                          <Typography variant="small" className="text-cosmic-text-muted/70 italic">
                            Not yet earned
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        
        {activeTab === "rewards" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h5" color="white">
                Cosmic Rewards Shop
              </Typography>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cosmic-surface/50 border border-cosmic-border rounded-lg">
                <SparklesIcon className="h-5 w-5 text-yellow-400" />
                <Typography variant="h6" color="white">
                  {calculateXP().toLocaleString()} XP Available
                </Typography>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewardItems.map((reward) => (
                <Card 
                  key={reward.id} 
                  className="bg-cosmic-card-bg/80 border border-cosmic-border hover:border-cosmic-primary/50 transition-all cursor-pointer animate-fade-in overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-cosmic-primary/80 to-cosmic-secondary/80"></div>
                  <CardBody className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl flex items-center justify-center text-3xl bg-cosmic-surface/50 border border-cosmic-border">
                        {reward.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Typography variant="h6" color="white">
                              {reward.name}
                            </Typography>
                            <Typography variant="small" className="text-cosmic-text-secondary">
                              {reward.description}
                            </Typography>
                          </div>
                          <Chip
                            value={`${reward.cost} XP`}
                            size="sm"
                            color="amber"
                            className="rounded-full"
                          />
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <Button 
                            size="sm" 
                            color={calculateXP() >= reward.cost ? "green" : "blue-gray"}
                            disabled={calculateXP() < reward.cost}
                            onClick={() => purchaseReward(reward)}
                            className="flex items-center gap-2"
                          >
                            {calculateXP() >= reward.cost ? "Purchase" : "Not Enough XP"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Custom styling for animations */}
      <style jsx="true">{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out infinite;
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }
        
        .shadow-glow-subtle {
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
        }
        
        .shadow-cosmic {
          box-shadow: 0 4px 20px -2px rgba(13, 16, 45, 0.7);
        }
        
        .cosmic-shimmer {
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.1), 
            transparent
          );
          animation: shimmer 2s infinite;
          transform: translateX(-100%);
        }
        
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        
        .cosmic-badge-glow {
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.4) 0%,
            transparent 70%
          );
        }
      `}</style>
    </div>
  );
};

export default CosmicGamification;