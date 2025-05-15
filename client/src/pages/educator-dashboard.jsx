import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody, Spinner, Alert, Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { useAuth } from "../contexts/AuthContext";
import PageTitle from "../widgets/layout/page-title";
import { ChartBarIcon, BookOpenIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export function EducatorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("topics");
  const { user } = useAuth();

  // Demo data for topic analytics
  const [topicAnalytics, setTopicAnalytics] = useState([
    { topic: "Solar System", count: 42, percentage: 28 },
    { topic: "Black Holes", count: 31, percentage: 21 },
    { topic: "Galaxies", count: 24, percentage: 16 },
    { topic: "Exoplanets", count: 18, percentage: 12 },
    { topic: "Space Missions", count: 15, percentage: 10 },
    { topic: "Asteroids & Comets", count: 10, percentage: 7 },
    { topic: "Stars", count: 9, percentage: 6 }
  ]);

  // Demo data for recent student questions
  const [recentQuestions, setRecentQuestions] = useState([
    { id: 1, studentName: "Emma Johnson", question: "How do black holes form?", topic: "Black Holes", date: new Date(Date.now() - 1800000).toISOString() },
    { id: 2, studentName: "Alex Wong", question: "Why is Mars red?", topic: "Solar System", date: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, studentName: "Sofia Garcia", question: "How many moons does Jupiter have?", topic: "Solar System", date: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, studentName: "Ryan Kim", question: "What is a supernova?", topic: "Stars", date: new Date(Date.now() - 14400000).toISOString() },
    { id: 5, studentName: "Jamal Washington", question: "How many galaxies are in the universe?", topic: "Galaxies", date: new Date(Date.now() - 28800000).toISOString() }
  ]);

  // Demo data for student activity
  const [studentActivity, setStudentActivity] = useState([
    { id: 1, name: "Emma Johnson", questionsAsked: 28, topTopics: ["Black Holes", "Galaxies"], lastActive: new Date(Date.now() - 1800000).toISOString() },
    { id: 2, name: "Alex Wong", questionsAsked: 24, topTopics: ["Solar System", "Space Missions"], lastActive: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, name: "Sofia Garcia", questionsAsked: 31, topTopics: ["Solar System", "Exoplanets"], lastActive: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, name: "Ryan Kim", questionsAsked: 15, topTopics: ["Stars", "Black Holes"], lastActive: new Date(Date.now() - 14400000).toISOString() },
    { id: 5, name: "Jamal Washington", questionsAsked: 22, topTopics: ["Galaxies", "Exoplanets"], lastActive: new Date(Date.now() - 28800000).toISOString() },
    { id: 6, name: "Olivia Chen", questionsAsked: 19, topTopics: ["Asteroids & Comets", "Solar System"], lastActive: new Date(Date.now() - 86400000).toISOString() },
    { id: 7, name: "Lucas Martinez", questionsAsked: 11, topTopics: ["Space Missions", "Stars"], lastActive: new Date(Date.now() - 172800000).toISOString() }
  ]);

  useEffect(() => {
    // Simulate API call to get analytics data
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, we would fetch data from API:
        // const response = await fetch('/api/analytics/topics');
        // const data = await response.json();
        // setTopicAnalytics(data.topics);
        // setRecentQuestions(data.recentQuestions);
        // setStudentActivity(data.studentActivity);
        
        // Using demo data from state instead
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date - new Date()) / (1000 * 60 * 60 * 24)),
      'day'
    ).replace('in ', '') + ' ago';
  };

  // Generate a color based on the percentage
  const getTopicColor = (percentage) => {
    if (percentage > 20) return "bg-cosmic-primary";
    if (percentage > 10) return "bg-purple-500";
    return "bg-cosmic-secondary";
  };

  return (
    <div className="min-h-screen bg-cosmic-background text-cosmic-text pb-20">
      <PageTitle heading="Educator Dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert color="red" className="mb-6">
            {error}
          </Alert>
        )}
        
        <div className="mb-8">
          <Typography variant="lead" className="text-cosmic-text-secondary">
            Track student engagement and popular space topics.
          </Typography>
        </div>
        
        <Tabs value={activeTab} className="mb-8">
          <TabsHeader className="bg-cosmic-card-bg/50 border-cosmic-border">
            <Tab 
              value="topics" 
              onClick={() => setActiveTab("topics")}
              className={`px-6 py-3 ${activeTab === "topics" ? "text-cosmic-primary" : ""}`}
            >
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                Topics
              </div>
            </Tab>
            <Tab 
              value="questions" 
              onClick={() => setActiveTab("questions")}
              className={`px-6 py-3 ${activeTab === "questions" ? "text-cosmic-primary" : ""}`}
            >
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5" />
                Questions
              </div>
            </Tab>
            <Tab 
              value="students" 
              onClick={() => setActiveTab("students")}
              className={`px-6 py-3 ${activeTab === "students" ? "text-cosmic-primary" : ""}`}
            >
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                Students
              </div>
            </Tab>
          </TabsHeader>
        </Tabs>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="h-12 w-12 text-cosmic-primary" />
          </div>
        ) : (
          <>
            {activeTab === "topics" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-cosmic-card-bg/80 border border-cosmic-border col-span-1 lg:col-span-2">
                  <CardBody>
                    <Typography variant="h5" className="mb-6">
                      Popular Topics
                    </Typography>
                    
                    <div className="space-y-5">
                      {topicAnalytics.map((topic) => (
                        <div key={topic.topic} className="space-y-1">
                          <div className="flex justify-between">
                            <Typography className="font-medium">{topic.topic}</Typography>
                            <Typography className="text-cosmic-text-secondary">{topic.count} questions ({topic.percentage}%)</Typography>
                          </div>
                          <div className="h-2 w-full bg-cosmic-background/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getTopicColor(topic.percentage)} rounded-full`}
                              style={{ width: `${topic.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
                
                <Card className="bg-cosmic-card-bg/80 border border-cosmic-border">
                  <CardBody>
                    <Typography variant="h5" className="mb-4">
                      Topic Distribution
                    </Typography>
                    
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="relative w-48 h-48">
                        {/* Simple visual representation of a pie chart */}
                        <div className="absolute inset-0 rounded-full border-8 border-cosmic-primary opacity-20"></div>
                        {topicAnalytics.map((topic, index) => {
                          const rotation = index * (360 / topicAnalytics.length);
                          const color = index % 2 === 0 ? "bg-cosmic-primary" : "bg-cosmic-secondary";
                          return (
                            <div 
                              key={topic.topic}
                              className={`absolute w-3 h-3 rounded-full ${color}`}
                              style={{ 
                                top: `${50 + 42 * Math.sin(rotation * Math.PI / 180)}%`,
                                left: `${50 + 42 * Math.cos(rotation * Math.PI / 180)}%`
                              }}
                            >
                              <div className="absolute w-20 text-xs text-cosmic-text-secondary whitespace-nowrap"
                                style={{ 
                                  top: '0',
                                  left: '100%',
                                  transform: 'translateX(8px)'
                                }}
                              >
                                {topic.topic}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
            
            {activeTab === "questions" && (
              <Card className="bg-cosmic-card-bg/80 border border-cosmic-border w-full">
                <CardBody>
                  <Typography variant="h5" className="mb-6">
                    Recent Student Questions
                  </Typography>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Student
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Question
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Topic
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Time
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentQuestions.map((question, index) => (
                          <tr key={question.id} className={index % 2 === 0 ? "bg-cosmic-background/10" : ""}>
                            <td className="p-4">
                              <Typography variant="small" className="font-medium text-white">
                                {question.studentName}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-white">
                                {question.question}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-cosmic-primary">
                                {question.topic}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-gray-300">
                                {formatDate(question.date)}
                              </Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            )}
            
            {activeTab === "students" && (
              <Card className="bg-cosmic-card-bg/80 border border-cosmic-border w-full">
                <CardBody>
                  <Typography variant="h5" className="mb-6">
                    Student Engagement
                  </Typography>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Student Name
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Questions Asked
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Top Topics
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Last Active
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentActivity.map((student, index) => (
                          <tr key={student.id} className={index % 2 === 0 ? "bg-cosmic-background/10" : ""}>
                            <td className="p-4">
                              <Typography variant="small" className="font-medium text-white">
                                {student.name}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-white">
                                {student.questionsAsked}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {student.topTopics.map((topic) => (
                                  <div key={topic} className="px-2 py-0.5 bg-cosmic-primary/20 text-cosmic-primary rounded text-xs font-medium">
                                    {topic}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-gray-300">
                                {formatDate(student.lastActive)}
                              </Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EducatorDashboard;