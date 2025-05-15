import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GameNotifications from "./components/game/GameNotifications";

function AppContent() {
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();

  console.log("Current user in AppContent:", user); // Debug logging
  
  // Filter routes based on authentication state and user role
  const navbarRoutes = routes.filter(route => {
    // Hide Dashboard for non-authenticated users
    if (!isAuthenticated && route.path === '/dashboard') {
      return false;
    }
    // Hide Sign In and Sign Up for authenticated users
    if (isAuthenticated && (route.path === '/sign-in' || route.path === '/sign-up')) {
      return false;
    }
    
    // Role-based filtering
    if (route.allowedRoles && user) {
      console.log(`Checking route ${route.name} with allowed roles:`, route.allowedRoles); 
      console.log(`User role:`, user.role);
      // Only show routes that match the user's role
      return route.allowedRoles.includes(user.role);
    }
    
    // Only show routes with icons in the navbar
    return route.icon !== undefined;
  });

  return (
    <>
      {!(pathname === '/sign-in' || pathname === '/sign-up') && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar routes={navbarRoutes} />
        </div>
      )}
      
      {/* Global game notifications - only for students */}
      {isAuthenticated && user?.role === "student" && <GameNotifications />}
      
      <Routes>
        {routes.map(({ path, element, requiresAuth, allowedRoles }, key) => {
          // For protected routes
          if (requiresAuth) {
            return (
              <Route
                key={key}
                path={path}
                element={<ProtectedRoute requiredRole={allowedRoles ? allowedRoles[0] : undefined}>{element}</ProtectedRoute>}
              />
            );
          }
          // For public routes
          return element && <Route key={key} exact path={path} element={element} />;
        })}
        {/* Redirect profile path to dashboard */}
        <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
