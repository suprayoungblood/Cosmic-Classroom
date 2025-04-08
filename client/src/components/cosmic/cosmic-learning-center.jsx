import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";

// Educational content organized by age groups
const LEARNING_RESOURCES = {
  kids: [
    {
      title: "Our Solar System Adventure",
      description: "Join Astro the space dog on a fun tour of our solar system!",
      image: "/img/Space.avif",
      level: "Beginner",
      type: "Interactive Story",
      link: "#",
    },
    {
      title: "Stars and Constellations",
      description: "Learn about stars and how to find constellations in the night sky.",
      image: "/img/background-1.jpg",
      level: "Beginner",
      type: "Activity",
      link: "#",
    },
    {
      title: "Space Vehicles",
      description: "Rockets, rovers, and space stations - how humans explore space!",
      image: "/img/background-2.jpg",
      level: "Beginner",
      type: "Interactive",
      link: "#",
    },
  ],
  teens: [
    {
      title: "Exoplanets: Worlds Beyond",
      description: "Discover planets orbiting distant stars and what they might be like.",
      image: "/img/background-3.png",
      level: "Intermediate",
      type: "Interactive Module",
      link: "#",
    },
    {
      title: "Black Holes Explained",
      description: "Dive into the science of one of space's most mysterious phenomena.",
      image: "/img/background-1.jpg",
      level: "Intermediate",
      type: "Video Series",
      link: "#",
    },
    {
      title: "The Life Cycle of Stars",
      description: "From stellar nurseries to supernovas - how stars live and die.",
      image: "/img/background-2.jpg",
      level: "Intermediate",
      type: "Interactive",
      link: "#",
    },
  ],
  advanced: [
    {
      title: "Quantum Physics in Space",
      description: "How quantum mechanics helps us understand the cosmos.",
      image: "/img/Space.avif",
      level: "Advanced",
      type: "Course",
      link: "#",
    },
    {
      title: "Space-Time and Relativity",
      description: "Einstein's theories and their implications for space exploration.",
      image: "/img/background-1.jpg",
      level: "Advanced",
      type: "Lecture Series",
      link: "#",
    },
    {
      title: "Astronomy Data Analysis",
      description: "Learn to analyze real telescope data from NASA missions.",
      image: "/img/background-3.png",
      level: "Advanced",
      type: "Workshop",
      link: "#",
    },
  ],
  educators: [
    {
      title: "Space Science Lesson Plans",
      description: "Ready-to-use lesson plans aligned with education standards.",
      image: "/img/teamwork.png",
      level: "All Levels",
      type: "Teaching Resource",
      link: "#",
    },
    {
      title: "Virtual Space Field Trips",
      description: "Take your classroom to space with virtual reality experiences.",
      image: "/img/background-2.jpg",
      level: "All Levels",
      type: "Activity",
      link: "#",
    },
    {
      title: "Astronomy Project Ideas",
      description: "Creative projects to engage students in space science.",
      image: "/img/background-1.jpg",
      level: "All Levels",
      type: "Guide",
      link: "#",
    },
  ],
};

const CosmicLearningCenter = ({ user }) => {
  // Determine default tab based on user role/age
  const getDefaultTab = () => {
    if (user?.role === "educator") return "educators";
    if (user?.age && user.age < 13) return "kids";
    if (user?.age && user.age >= 13 && user.age <= 18) return "teens";
    return "teens"; // Default
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Typography variant="h4" color="white" className="mb-2">
            Space Learning Center
          </Typography>
          <Typography className="text-cosmic-text-secondary">
            Explore our educational resources about space and astronomy
          </Typography>
        </div>
      </div>

      <Tabs value={activeTab} className="mb-8">
        <TabsHeader className="bg-cosmic-card-bg/50 border-cosmic-border">
          <Tab
            value="kids"
            onClick={() => setActiveTab("kids")}
            className={activeTab === "kids" ? "text-cosmic-primary" : ""}
          >
            Kids (5-12)
          </Tab>
          <Tab
            value="teens"
            onClick={() => setActiveTab("teens")}
            className={activeTab === "teens" ? "text-cosmic-primary" : ""}
          >
            Teens (13-18)
          </Tab>
          <Tab
            value="advanced"
            onClick={() => setActiveTab("advanced")}
            className={activeTab === "advanced" ? "text-cosmic-primary" : ""}
          >
            Advanced
          </Tab>
          <Tab
            value="educators"
            onClick={() => setActiveTab("educators")}
            className={activeTab === "educators" ? "text-cosmic-primary" : ""}
          >
            For Educators
          </Tab>
        </TabsHeader>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARNING_RESOURCES[activeTab].map((resource, index) => (
          <Card key={index} className="bg-cosmic-card-bg border border-cosmic-border overflow-hidden h-full flex flex-col">
            <div className="h-48 overflow-hidden">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <CardBody className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${resource.level === "Beginner" ? "bg-green-500/20 text-green-500" : 
                    resource.level === "Intermediate" ? "bg-yellow-500/20 text-yellow-500" : 
                    "bg-red-500/20 text-red-500"}
                `}>
                  {resource.level}
                </span>
                <span className="px-2 py-1 rounded-full bg-cosmic-primary/20 text-cosmic-primary text-xs font-medium">
                  {resource.type}
                </span>
              </div>
              <Typography variant="h5" color="white" className="mb-2">
                {resource.title}
              </Typography>
              <Typography className="text-cosmic-text-secondary mb-4">
                {resource.description}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="text" color="white" className="flex items-center gap-2">
                Explore Resource
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CosmicLearningCenter;