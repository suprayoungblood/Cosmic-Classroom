import { Home, SignIn, SignUp } from "@/pages";
import Dashboard from "@/pages/dashboard";
import ChatPage from "@/pages/chat";
import StudyPage from "@/pages/study";
import { 
  ChatBubbleLeftRightIcon, 
  HomeIcon, 
  RectangleGroupIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";

export const routes = [
  {
    name: "Home",
    path: "/home",
    element: <Home />,
    icon: HomeIcon,
    requiresAuth: false
  },
  {
    name: "Chat",
    path: "/chat",
    element: <ChatPage />,
    icon: ChatBubbleLeftRightIcon,
    requiresAuth: false
  },
  {
    name: "Study",
    path: "/study",
    element: <StudyPage />,
    icon: AcademicCapIcon,
    requiresAuth: false
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    element: <Dashboard />,
    icon: RectangleGroupIcon,
    requiresAuth: true  // Only for authenticated users
  },
  {
    name: "Sign In",
    path: "/sign-in",
    element: <SignIn />,
    requiresAuth: false
  },
  {
    name: "Sign Up",
    path: "/sign-up",
    element: <SignUp />,
    requiresAuth: false
  },
];

export default routes;