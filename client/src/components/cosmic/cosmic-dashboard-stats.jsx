import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { StarIcon, SparklesIcon, TrophyIcon, FireIcon } from "@heroicons/react/24/solid";

const CosmicDashboardStats = ({ user, history = [] }) => {
  const { gameData, loading: gameLoading } = useGame();
  
  // Create stats based on user role and profile info
  const getStats = () => {
    // Use real game data if available, or fallback to props
    const questionsCount = gameData?.questionsAsked || user?.questionsAsked || history.length || 0;
    const topicsCount = gameData?.topicsExplored || user?.topicsExplored || Math.min(history.length ? Math.ceil(history.length / 2) : 3, 12);
    const dailyStreak = gameData?.dailyStreak || user?.dailyStreak || 0;
    
    // Get favorite topic from user interests if available
    const favoriteTopic = user?.interests && user?.interests.length > 0 
      ? user.interests[0] 
      : "Planets";
      
    // Get user level from game data or user data or provide default
    const userLevel = gameData?.level || user?.level || "Explorer";
    
    // Get XP from game data
    const currentXP = gameData?.xp || 0;
    
    if (user?.role === "educator") {
      return [
        {
          title: "Student Engagement",
          value: `${Math.min(90 + questionsCount, 98)}%`,
          description: "Average engagement rate",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
              <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
            </svg>
          )
        },
        {
          title: "Questions Tracked",
          value: Math.max(questionsCount, 10),
          description: "Total student questions",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
            </svg>
          )
        },
        {
          title: "Top Topic",
          value: favoriteTopic,
          description: "Most popular category",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504a18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
            </svg>
          )
        },
        {
          title: "Learning Resources",
          value: (topicsCount + 6).toString(),
          description: "Available modules",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
          )
        }
      ];
    } else {
      // Student/default view with dynamic data based on game data
      return [
        {
          title: "Questions Asked",
          value: questionsCount,
          description: "Your space questions",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
          )
        },
        {
          title: "Daily Streak",
          value: dailyStreak,
          description: "Days in a row",
          icon: <FireIcon className="w-6 h-6" />
        },
        {
          title: "Topics Explored",
          value: topicsCount,
          description: "Different space subjects",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708a18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605z" />
            </svg>
          )
        },
        {
          title: "Cosmic Rank",
          value: userLevel,
          description: `${currentXP.toLocaleString()} XP earned`,
          icon: <StarIcon className="w-6 h-6" />
        }
      ];
    }
  };

  return (
    <div className="space-y-8">
      {/* Main stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats().map((stat, index) => (
          <Card key={index} className="bg-cosmic-card-bg border border-cosmic-border">
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-cosmic-primary/20 flex items-center justify-center text-cosmic-primary">
                  {stat.icon}
                </div>
                <div>
                  <Typography variant="h5" color="white">
                    {stat.value}
                  </Typography>
                  <Typography className="text-cosmic-text-secondary font-medium">
                    {stat.title}
                  </Typography>
                </div>
              </div>
              <Typography variant="small" className="text-cosmic-text-muted mt-4">
                {stat.description}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Achievements section */}
      {gameData && gameData.badges && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" color="white">
              Your Achievements
            </Typography>
            <div className="flex items-center gap-2">
              <Chip 
                value={`${gameData.badges.filter(badge => badge.earned).length} Earned`}
                color="amber"
                size="sm"
                className="rounded-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gameData.badges.map((badge, index) => (
              <Card 
                key={index} 
                className={`${badge.earned 
                  ? 'bg-cosmic-card-bg border border-cosmic-border' 
                  : 'bg-cosmic-card-bg/50 border border-cosmic-border/50'}`}
              >
                <CardBody className="p-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                        ${badge.earned 
                          ? 'bg-cosmic-primary/20 border border-cosmic-primary/30' 
                          : 'bg-cosmic-background/30 text-cosmic-text-muted/50'}`}
                    >
                      {badge.icon}
                      {badge.earned && (
                        <div className="absolute inset-0 cosmic-badge-glow rounded-lg opacity-50"></div>
                      )}
                    </div>
                    <div>
                      <Typography 
                        variant="h6" 
                        color={badge.earned ? "white" : "blue-gray"} 
                        className="flex items-center gap-1"
                      >
                        {badge.name}
                        {badge.earned && (
                          <TrophyIcon className="h-4 w-4 text-yellow-400" />
                        )}
                      </Typography>
                      <Typography 
                        variant="small" 
                        className={badge.earned ? "text-cosmic-text-secondary" : "text-cosmic-text-muted"}
                      >
                        {badge.description}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Link to="/study">
              <Button 
                className="flex items-center gap-2 bg-cosmic-primary"
              >
                <SparklesIcon className="h-5 w-5" />
                Continue Learning
              </Button>
            </Link>
          </div>
          
          {/* Custom styles for achievement badges */}
          <style jsx="true">{`
            .cosmic-badge-glow {
              background: radial-gradient(
                circle,
                rgba(99, 102, 241, 0.4) 0%,
                transparent 70%
              );
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default CosmicDashboardStats;