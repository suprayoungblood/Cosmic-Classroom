import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GameNotifications from "./components/game/GameNotifications";

function AppContent() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  // Filter routes based on authentication state
  const navbarRoutes = routes.filter(route => {
    // Hide Dashboard for non-authenticated users
    if (!isAuthenticated && route.path === '/dashboard') {
      return false;
    }
    // Hide Sign In and Sign Up for authenticated users
    if (isAuthenticated && (route.path === '/sign-in' || route.path === '/sign-up')) {
      return false;
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
      
      {/* Global game notifications */}
      {isAuthenticated && <GameNotifications />}
      
      <Routes>
        {routes.map(({ path, element, requiresAuth }, key) => {
          // For protected routes
          if (requiresAuth) {
            return (
              <Route
                key={key}
                path={path}
                element={<ProtectedRoute>{element}</ProtectedRoute>}
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
