import { Home, SignIn, SignUp } from "@/pages";
import Dashboard from "@/pages/dashboard";
import ChatPage from "@/pages/chat";
import StudyPage from "@/pages/study";
import QuestionHistoryPage from "@/pages/question-history";
import EducatorDashboardPage from "@/pages/educator-dashboard";
import AdminDashboardPage from "@/pages/admin-dashboard";
import { 
  ChatBubbleLeftRightIcon, 
  HomeIcon, 
  RectangleGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon
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
    name: "Question History",
    path: "/questions/history",
    element: <QuestionHistoryPage />,
    icon: ClockIcon,
    requiresAuth: true,
    allowedRoles: ["student", "educator", "admin"]
  },
  {
    name: "Educator Dashboard",
    path: "/educator/dashboard",
    element: <EducatorDashboardPage />,
    icon: ChartBarIcon,
    requiresAuth: true,
    allowedRoles: ["educator", "admin"]
  },
  {
    name: "Admin Dashboard",
    path: "/admin/dashboard",
    element: <AdminDashboardPage />,
    icon: UserGroupIcon,
    requiresAuth: true,
    allowedRoles: ["admin"]
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