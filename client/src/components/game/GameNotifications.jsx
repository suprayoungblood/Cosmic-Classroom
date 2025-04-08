import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const GameNotifications = () => {
  const { xpAnimation, showLevelUp, gameData, newAchievements, dismissAchievements } = useGame();

  return (
    <>
      {/* XP Animation */}
      <AnimatePresence>
        {xpAnimation.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-10 z-50 pointer-events-none"
          >
            <motion.div 
              animate={{ 
                y: [0, -30, -20], 
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, times: [0, 0.7, 1] }}
              className="bg-amber-500/90 text-white text-xl font-bold py-3 px-4 rounded-xl backdrop-blur-sm border border-amber-400 shadow-lg"
            >
              +{xpAnimation.amount} XP
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Notification */}
      <AnimatePresence>
        {showLevelUp && gameData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
              <p className="text-xl mb-4">You've reached level {gameData.level}</p>
              <div className="text-sm opacity-80 mb-6">
                Keep exploring the cosmos to earn more XP and rewards.
              </div>
              <button
                onClick={() => setShowLevelUp(false)}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Achievements Notification */}
      <AnimatePresence>
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-cosmic-primary to-cosmic-secondary p-6 rounded-xl shadow-xl border border-cosmic-border/50 max-w-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">New Achievement!</h3>
                <button
                  onClick={dismissAchievements}
                  className="text-white/70 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {newAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center bg-white/10 p-3 rounded-lg"
                  >
                    <div className="text-3xl mr-3">{achievement.icon}</div>
                    <div>
                      <div className="font-medium text-white">{achievement.name}</div>
                      <div className="text-sm text-white/80">{achievement.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={dismissAchievements}
                  className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Awesome!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameNotifications;