import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Progress, Tooltip, Typography } from '@material-tailwind/react';
import { FireIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const UserProgressBar = () => {
  const { gameData, loading } = useGame();
  
  if (loading || !gameData) {
    return null;
  }
  
  return (
    <div className="bg-cosmic-card-bg/80 border border-cosmic-border rounded-lg p-2 min-w-[200px] backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="flex items-center text-cosmic-text-primary">
          <span className="text-xs font-semibold flex items-center">
            <span className="mr-1">LVL {gameData.level}</span>
          </span>
        </div>
        <Link to="/dashboard" className="flex items-center text-xs text-cosmic-primary hover:text-cosmic-primary/80 transition-colors">
          <SparklesIcon className="h-3 w-3 mr-1" />
          <span>{gameData.xp.toLocaleString()} XP</span>
        </Link>
      </div>
      
      <Tooltip
        content={
          <div className="p-2">
            <Typography variant="small" className="font-normal opacity-80">
              {gameData.xpToNextLevel.toLocaleString()} XP to {gameData.nextLevel}
            </Typography>
          </div>
        }
      >
        <div>
          <Progress
            value={gameData.levelProgress}
            size="sm"
            color="indigo"
            className="bg-cosmic-background/50"
          />
        </div>
      </Tooltip>
      
      <div className="flex justify-between items-center mt-1 px-1">
        <Link to="/dashboard" className="text-xs text-cosmic-text-secondary hover:text-cosmic-text-primary transition-colors">
          <span className="flex items-center">
            <FireIcon className="h-3 w-3 text-amber-500 mr-1" /> 
            <span>{gameData.dailyStreak} day streak</span>
          </span>
        </Link>
        <div className="text-xs text-cosmic-text-secondary">
          {gameData.levelProgress}%
        </div>
      </div>
    </div>
  );
};

export default UserProgressBar;