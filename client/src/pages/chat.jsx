import React, { useEffect } from "react";
import { PageTitle } from "@/widgets/layout";
import CosmicChat from "@/components/cosmic/cosmic-chat";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import "./chat.css"; // Import custom CSS for the chat page

export function ChatPage() {
  const { user } = useAuthContext();

  // Ensure proper scrolling and interactivity
  useEffect(() => {
    // Reset any scroll issues and ensure the page is interactive
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Add a class to ensure pointer-events work properly
    document.body.classList.add('chat-page-active');
    
    return () => {
      // Clean up
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.classList.remove('chat-page-active');
    };
  }, []);

  return (
    <div className="cosmic-container pt-24 pb-6 min-h-screen flex flex-col relative z-0">
      <PageTitle 
        section="AI Assistant" 
        heading="Cosmic Chat"
        className="mb-6"
      >
        Chat with our AI assistant about anything space-related
      </PageTitle>
      
      <div className="h-[calc(100vh-220px)] flex-1 cosmic-chat-container">
        <CosmicChat user={user} />
      </div>
    </div>
  );
}

export default ChatPage;