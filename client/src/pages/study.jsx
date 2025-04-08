import React, { useState, useEffect } from "react";
import { PageTitle } from "@/widgets/layout";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Progress,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  BeakerIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

export function StudyPage() {
  const { user } = useAuth();
  const { gameData, refreshGameData, awardXP } = useGame();
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});

  // Fetch game data on page load
  useEffect(() => {
    refreshGameData();
  }, [refreshGameData]);

  // Topics to study based on space categories
  const studyTopics = [
    {
      id: 1,
      title: "Solar System",
      icon: <RocketLaunchIcon className="h-6 w-6" />,
      description: "Explore our local neighborhood in space",
      difficulty: "Beginner",
      lessons: [
        { id: "s1-l1", title: "The Sun: Our Star", duration: "15 min", xp: 50 },
        { id: "s1-l2", title: "Inner Planets", duration: "20 min", xp: 60 },
        { id: "s1-l3", title: "Outer Planets", duration: "20 min", xp: 60 },
        { id: "s1-l4", title: "Dwarf Planets", duration: "15 min", xp: 50 },
        { id: "s1-l5", title: "Asteroids & Comets", duration: "15 min", xp: 50 }
      ],
      color: "blue"
    },
    {
      id: 2,
      title: "Stellar Evolution",
      icon: <StarIcon className="h-6 w-6" />,
      description: "The life cycle of stars across the universe",
      difficulty: "Intermediate",
      lessons: [
        { id: "s2-l1", title: "Star Formation", duration: "20 min", xp: 70 },
        { id: "s2-l2", title: "Main Sequence Stars", duration: "25 min", xp: 80 },
        { id: "s2-l3", title: "Red Giants & White Dwarfs", duration: "20 min", xp: 70 },
        { id: "s2-l4", title: "Supernovae", duration: "25 min", xp: 80 },
        { id: "s2-l5", title: "Neutron Stars & Pulsars", duration: "30 min", xp: 90 }
      ],
      color: "purple"
    },
    {
      id: 3,
      title: "Cosmic Phenomena",
      icon: <BeakerIcon className="h-6 w-6" />,
      description: "Explore the most extreme events in space",
      difficulty: "Advanced",
      lessons: [
        { id: "s3-l1", title: "Black Holes", duration: "30 min", xp: 100 },
        { id: "s3-l2", title: "Gamma Ray Bursts", duration: "25 min", xp: 90 },
        { id: "s3-l3", title: "Dark Matter", duration: "30 min", xp: 100 },
        { id: "s3-l4", title: "Dark Energy", duration: "30 min", xp: 100 },
        { id: "s3-l5", title: "Gravitational Waves", duration: "25 min", xp: 90 }
      ],
      color: "indigo"
    },
    {
      id: 4,
      title: "Space Exploration",
      icon: <RocketLaunchIcon className="h-6 w-6" />,
      description: "Humanity's journey to the stars",
      difficulty: "Beginner",
      lessons: [
        { id: "s4-l1", title: "Early Space Race", duration: "20 min", xp: 60 },
        { id: "s4-l2", title: "Moon Missions", duration: "25 min", xp: 70 },
        { id: "s4-l3", title: "Robotic Explorers", duration: "20 min", xp: 60 },
        { id: "s4-l4", title: "International Space Station", duration: "20 min", xp: 60 },
        { id: "s4-l5", title: "Future of Space Travel", duration: "25 min", xp: 70 }
      ],
      color: "amber"
    },
    {
      id: 5,
      title: "Galaxies & Cosmology",
      icon: <BookOpenIcon className="h-6 w-6" />,
      description: "The structure and fate of our universe",
      difficulty: "Advanced",
      lessons: [
        { id: "s5-l1", title: "Galaxy Types", duration: "20 min", xp: 80 },
        { id: "s5-l2", title: "The Milky Way", duration: "25 min", xp: 85 },
        { id: "s5-l3", title: "Galaxy Evolution", duration: "30 min", xp: 90 },
        { id: "s5-l4", title: "The Big Bang", duration: "30 min", xp: 100 },
        { id: "s5-l5", title: "Fate of the Universe", duration: "30 min", xp: 100 }
      ],
      color: "cyan"
    },
    {
      id: 6,
      title: "Exoplanets",
      icon: <LightBulbIcon className="h-6 w-6" />,
      description: "Planets beyond our solar system",
      difficulty: "Intermediate",
      lessons: [
        { id: "s6-l1", title: "Detection Methods", duration: "20 min", xp: 70 },
        { id: "s6-l2", title: "Habitable Zones", duration: "25 min", xp: 80 },
        { id: "s6-l3", title: "Notable Discoveries", duration: "20 min", xp: 70 },
        { id: "s6-l4", title: "Exoplanet Atmospheres", duration: "25 min", xp: 80 },
        { id: "s6-l5", title: "Search for Life", duration: "30 min", xp: 90 }
      ],
      color: "green"
    }
  ];

  // Study flashcards for quick learning
  const flashcards = [
    {
      id: 1,
      question: "What is the closest star to Earth?",
      answer: "The Sun is the closest star to Earth, at about 150 million kilometers away.",
      category: "Stars",
      difficulty: "Easy",
      xp: 10
    },
    {
      id: 2,
      question: "What is a black hole?",
      answer: "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it.",
      category: "Cosmic Phenomena",
      difficulty: "Medium",
      xp: 15
    },
    {
      id: 3,
      question: "How many planets are in our solar system?",
      answer: "There are eight recognized planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
      category: "Solar System",
      difficulty: "Easy",
      xp: 10
    },
    {
      id: 4,
      question: "What is a light-year?",
      answer: "A light-year is the distance light travels in one year, approximately 9.46 trillion kilometers.",
      category: "Astronomy Basics",
      difficulty: "Medium",
      xp: 15
    },
    {
      id: 5,
      question: "What causes the auroras (Northern/Southern Lights)?",
      answer: "Auroras are caused by charged particles from the sun interacting with gases in Earth's atmosphere near the magnetic poles.",
      category: "Earth & Space",
      difficulty: "Medium",
      xp: 15
    },
    {
      id: 6,
      question: "What is dark matter?",
      answer: "Dark matter is a hypothetical form of matter thought to account for approximately 85% of the matter in the universe. It doesn't interact with the electromagnetic force and thus cannot be directly detected.",
      category: "Cosmic Phenomena",
      difficulty: "Hard",
      xp: 20
    }
  ];

  // Daily study goals and challenges
  const studyGoals = [
    {
      id: 1,
      title: "Daily Study Session",
      description: "Complete at least one lesson today",
      progress: Object.keys(completedLessons).filter(key => 
        completedLessons[key].date === new Date().toDateString()
      ).length,
      target: 1,
      reward: 50,
      icon: <BookOpenIcon className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Review Flashcards",
      description: "Study at least 5 flashcards",
      progress: 0, // This would track flashcard reviews
      target: 5,
      reward: 30,
      icon: <AcademicCapIcon className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Topic Mastery",
      description: "Complete all lessons in one topic",
      progress: 0, // This would track completed topics
      target: 1,
      reward: 100,
      icon: <StarIcon className="h-5 w-5" />
    }
  ];

  // Get difficulty chip color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Beginner": return "green";
      case "Intermediate": return "amber";
      case "Advanced": return "red";
      default: return "blue";
    }
  };

  // Handle completing a lesson
  const completeLesson = (lessonId, xp) => {
    // Mark lesson as completed
    setCompletedLessons({
      ...completedLessons,
      [lessonId]: {
        completed: true,
        date: new Date().toDateString()
      }
    });
    
    // Award XP through game context
    awardXP(xp);
    
    // Check if this completes any goals
    // For a real app, this would update goals and potentially show notifications
  };

  // Calculate course completion percentage
  const getCourseCompletion = (course) => {
    if (!course?.lessons) return 0;
    
    const totalLessons = course.lessons.length;
    const completedCount = course.lessons.filter(lesson => 
      completedLessons[lesson.id]?.completed
    ).length;
    
    return Math.round((completedCount / totalLessons) * 100);
  };

  return (
    <div className="cosmic-container relative min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cosmic-stars opacity-10"></div>
        <div className="cosmic-nebula cosmic-nebula-blue w-[800px] h-[800px] absolute right-[-400px] top-[10%] opacity-[0.05] blur-xl"></div>
        <div className="cosmic-nebula cosmic-nebula-purple w-[600px] h-[600px] absolute left-[-200px] bottom-[20%] opacity-[0.04] blur-xl"></div>
      </div>
      
      <div className="pt-28 pb-12 relative z-10">
        <PageTitle title="Space Academy" className="mb-8">
          <div className="text-cosmic-text-secondary">
            Structured learning paths to master cosmic knowledge
          </div>
        </PageTitle>
        
        {/* User progress banner */}
        {gameData && (
          <Card className="bg-cosmic-card-bg/80 border border-cosmic-border mb-8 backdrop-blur-sm">
            <CardBody className="p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cosmic-primary to-cosmic-secondary flex items-center justify-center text-white">
                    <AcademicCapIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <Typography variant="h5" color="white" className="flex items-center gap-2">
                      Level {gameData.level}
                      <Chip size="sm" value={`${gameData.xp.toLocaleString()} XP`} className="bg-cosmic-primary/20 text-cosmic-primary" />
                    </Typography>
                    <div className="flex items-center gap-2 text-cosmic-text-secondary text-sm">
                      <FireIcon className="h-4 w-4 text-amber-500" />
                      <span>{gameData.dailyStreak} day streak</span>
                      <span className="mx-1">•</span>
                      <span>{gameData.topicsExplored} topics explored</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 mt-4 md:mt-0">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-cosmic-text-secondary">
                      {gameData.levelProgress}% to {gameData.nextLevel}
                    </span>
                    <span className="text-cosmic-text-secondary">
                      {gameData.xpToNextLevel.toLocaleString()} XP needed
                    </span>
                  </div>
                  <Progress
                    value={gameData.levelProgress}
                    size="sm"
                    color="indigo"
                    className="bg-cosmic-background/50"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        
        {/* Tab navigation */}
        <Tabs value={activeTab} className="mb-8">
          <TabsHeader className="bg-cosmic-card-bg/50 border-cosmic-border">
            <Tab 
              value="courses" 
              onClick={() => setActiveTab("courses")}
              className={activeTab === "courses" ? "text-cosmic-primary" : ""}
            >
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5" />
                Study Courses
              </div>
            </Tab>
            <Tab 
              value="flashcards" 
              onClick={() => setActiveTab("flashcards")}
              className={activeTab === "flashcards" ? "text-cosmic-primary" : ""}
            >
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5" />
                Flashcards
              </div>
            </Tab>
            <Tab 
              value="goals" 
              onClick={() => setActiveTab("goals")}
              className={activeTab === "goals" ? "text-cosmic-primary" : ""}
            >
              <div className="flex items-center gap-2">
                <StarIcon className="h-5 w-5" />
                Study Goals
              </div>
            </Tab>
          </TabsHeader>
        </Tabs>
        
        {/* Main content area */}
        <div className="mt-8">
          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div>
              {selectedCourse ? (
                // Course Detail View
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Button 
                      variant="text" 
                      color="blue-gray" 
                      className="flex items-center gap-2"
                      onClick={() => setSelectedCourse(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Courses
                    </Button>
                    <Chip 
                      color={getDifficultyColor(selectedCourse.difficulty)}
                      value={selectedCourse.difficulty}
                      size="sm"
                    />
                  </div>
                  
                  <Card className="bg-cosmic-card-bg/80 border border-cosmic-border mb-6">
                    <CardBody className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-${selectedCourse.color}-500/20 flex items-center justify-center text-${selectedCourse.color}-500`}>
                          {selectedCourse.icon}
                        </div>
                        <div className="flex-1">
                          <Typography variant="h4" color="white" className="mb-1">
                            {selectedCourse.title}
                          </Typography>
                          <Typography className="text-cosmic-text-secondary mb-4">
                            {selectedCourse.description}
                          </Typography>
                          
                          <div className="flex justify-between items-center mb-2">
                            <Typography variant="h6" color="white">
                              Course Progress
                            </Typography>
                            <Typography className="text-cosmic-text-secondary">
                              {getCourseCompletion(selectedCourse)}% Complete
                            </Typography>
                          </div>
                          
                          <Progress
                            value={getCourseCompletion(selectedCourse)}
                            size="lg"
                            color={selectedCourse.color}
                            className="bg-cosmic-background/50"
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  
                  <Typography variant="h5" color="white" className="mb-4">
                    Lessons
                  </Typography>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {selectedCourse.lessons.map((lesson, index) => {
                      const isCompleted = completedLessons[lesson.id]?.completed;
                      
                      return (
                        <Card 
                          key={lesson.id}
                          className={`bg-cosmic-card-bg/60 border ${isCompleted ? 'border-green-500/30' : 'border-cosmic-border'}`}
                        >
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cosmic-background/80 text-cosmic-text-secondary">
                                  {isCompleted ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <span>{index + 1}</span>
                                  )}
                                </div>
                                <div>
                                  <Typography color="white" className="font-medium">
                                    {lesson.title}
                                  </Typography>
                                  <div className="flex items-center gap-3 text-cosmic-text-muted text-xs">
                                    <div className="flex items-center gap-1">
                                      <ClockIcon className="h-3 w-3" />
                                      <span>{lesson.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <SparklesIcon className="h-3 w-3 text-amber-400" />
                                      <span>{lesson.xp} XP</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                color={isCompleted ? "green" : "blue"}
                                variant={isCompleted ? "outlined" : "filled"}
                                disabled={isCompleted}
                                onClick={() => completeLesson(lesson.id, lesson.xp)}
                              >
                                {isCompleted ? "Completed" : "Start Lesson"}
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Course List View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyTopics.map(topic => {
                    const completion = getCourseCompletion(topic);
                    
                    return (
                      <Card 
                        key={topic.id} 
                        className="bg-cosmic-card-bg/60 border border-cosmic-border hover:border-cosmic-primary/50 transition-all cursor-pointer"
                        onClick={() => setSelectedCourse(topic)}
                      >
                        <CardBody className="p-4">
                          <div className="flex items-start gap-4 mb-3">
                            <div className={`w-10 h-10 rounded-lg bg-${topic.color}-500/20 flex items-center justify-center text-${topic.color}-500`}>
                              {topic.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <Typography variant="h5" color="white">
                                  {topic.title}
                                </Typography>
                                <Chip 
                                  color={getDifficultyColor(topic.difficulty)}
                                  value={topic.difficulty}
                                  size="sm"
                                />
                              </div>
                              <Typography className="text-cosmic-text-secondary mt-1">
                                {topic.description}
                              </Typography>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-cosmic-text-secondary">
                                Progress
                              </span>
                              <span className="text-cosmic-text-secondary">
                                {completion}%
                              </span>
                            </div>
                            <Progress 
                              value={completion} 
                              color={topic.color}
                              className="bg-cosmic-background/50"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <div className="text-cosmic-text-muted text-sm">
                              {topic.lessons.length} lessons
                            </div>
                            <Button
                              size="sm"
                              variant="text"
                              color="blue"
                              className="flex items-center gap-1"
                            >
                              <span>Start Learning</span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          {/* Flashcards Tab */}
          {activeTab === "flashcards" && (
            <div>
              <Typography variant="h5" color="white" className="mb-6">
                Quick Knowledge Boost
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flashcards.map(card => (
                  <Card key={card.id} className="bg-cosmic-card-bg/70 border border-cosmic-border">
                    <CardBody className="p-0">
                      <div className="p-5 border-b border-cosmic-border bg-cosmic-background/30">
                        <Typography color="white" className="font-medium text-lg">
                          {card.question}
                        </Typography>
                        <div className="flex items-center gap-2 mt-2">
                          <Chip
                            size="sm"
                            variant="outlined"
                            value={card.category}
                            className="text-xs"
                          />
                          <Chip
                            size="sm"
                            color={card.difficulty === "Easy" ? "green" : card.difficulty === "Medium" ? "amber" : "red"}
                            value={card.difficulty}
                            className="text-xs"
                          />
                          <div className="flex items-center gap-1 text-cosmic-text-muted text-xs ml-auto">
                            <SparklesIcon className="h-3 w-3 text-amber-400" />
                            <span>{card.xp} XP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 bg-cosmic-card-bg/30">
                        <Typography className="text-cosmic-text-secondary">
                          {card.answer}
                        </Typography>
                        
                        <div className="flex justify-end mt-4">
                          <Button
                            size="sm"
                            color="blue"
                            variant="text"
                            className="flex items-center gap-1"
                            onClick={() => awardXP(card.xp)}
                          >
                            Mark as Learned
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Study Goals Tab */}
          {activeTab === "goals" && (
            <div>
              <Typography variant="h5" color="white" className="mb-6">
                Today's Study Goals
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {studyGoals.map(goal => (
                  <Card key={goal.id} className="bg-cosmic-card-bg/70 border border-cosmic-border">
                    <CardBody className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cosmic-primary/20 flex items-center justify-center text-cosmic-primary">
                          {goal.icon}
                        </div>
                        <div className="flex-1">
                          <Typography color="white" className="font-medium">
                            {goal.title}
                          </Typography>
                          <Typography className="text-cosmic-text-secondary text-sm mt-1">
                            {goal.description}
                          </Typography>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-cosmic-text-secondary">
                                Progress: {goal.progress}/{goal.target}
                              </span>
                              <div className="flex items-center gap-1">
                                <SparklesIcon className="h-3 w-3 text-amber-400" />
                                <span className="text-cosmic-text-secondary">{goal.reward} XP</span>
                              </div>
                            </div>
                            <Progress 
                              value={(goal.progress / goal.target) * 100} 
                              color={goal.progress >= goal.target ? "green" : "blue"}
                              className="bg-cosmic-background/50"
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
              
              <Typography variant="h5" color="white" className="mb-4">
                Learning Streak
              </Typography>
              
              <Card className="bg-cosmic-card-bg/70 border border-cosmic-border overflow-hidden">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Typography color="white" className="font-medium text-lg flex items-center gap-2">
                        <FireIcon className="h-5 w-5 text-amber-500" />
                        {gameData?.dailyStreak || 0}-Day Streak
                      </Typography>
                      <Typography className="text-cosmic-text-secondary">
                        Keep learning daily to build your streak
                      </Typography>
                    </div>
                    <Chip
                      value={`+${25 * (gameData?.dailyStreak || 1)} XP daily`}
                      size="sm"
                      color="amber"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 space-x-1">
                    {Array(7).fill(0).map((_, i) => {
                      const isActive = i < (gameData?.dailyStreak % 7 || 0);
                      return (
                        <div key={i} className="flex-1">
                          <div 
                            className={`h-3 rounded-full ${isActive ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-cosmic-background/50'}`}
                          ></div>
                          <div className="text-center mt-2 text-xs text-cosmic-text-muted">
                            Day {i+1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-cosmic-surface/30 rounded-lg border border-cosmic-border/50">
                    <Typography className="text-cosmic-text-secondary">
                      <span className="font-semibold text-white">Pro tip:</span> Study at least one lesson every day to maintain your streak. Higher streaks earn more XP bonuses!
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyPage;