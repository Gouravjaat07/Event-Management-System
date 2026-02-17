import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { ROLES } from "./utils/roles";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/common/Home";
import EventDetails from "./pages/common/EventDetails";

import StudentDashboard from "./pages/student/StudentDashboard";
import HostDashboard from "./pages/host/HostDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HostEventForm from "./pages/host/HostEventForm";
import HostEventDetails from "./pages/host/HostEventDetails";
import EventRegistrations from "./pages/host/EventRegistrations";
import Profile from "./pages/common/Profile";

/**
 * ✅ ENHANCED AUTH-GUARD STRATEGY (Consistent with YOUR AuthContext)
 *
 * Your AuthContext handles:
 * - user state (null when logged out, user object when logged in)
 * - token state (stored separately in state AND localStorage)
 * - loading state (prevents flickering on initial load)
 * - logout() function (clears EVERYTHING with localStorage.clear())
 *
 * Layer 1 — Home page (UX):
 *   EventCard receives an `onViewDetails` prop. When a guest clicks "View
 *   Details", Home intercepts and shows an AuthGateModal instead of navigating.
 *   The modal offers Sign In (redirecting back to the event after login) or
 *   Create Account, with a friendly preview of the event they wanted to see.
 *
 * Layer 2 — Route (security):
 *   /events/:id is wrapped in <ProtectedRoute> below. Even if someone types
 *   the URL directly or arrives via an external link, they are redirected to
 *   /login with `state.from` set so they land on the event after signing in.
 *
 * Layer 3 — Logged-in redirects:
 *   Login and Register pages check if user exists and redirect to home page,
 *   preventing unnecessary re-authentication.
 *
 * All layers work together: excellent UX for casual browsing, hard security
 * for direct access, and smooth flow for authenticated users.
 */

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" />

        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<Home />} />
          
          {/* ✅ Auth pages (Login/Register redirect if already logged in - handled in component) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected Routes (require authentication) ── */}
          
          {/* Event Details — protected (all authenticated roles) */}
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.HOST, ROLES.ADMIN]}>
                <EventDetails />
              </ProtectedRoute>
            }
          />

          {/* Profile — common to all authenticated roles */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.HOST, ROLES.ADMIN]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ── Student-specific Routes ── */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Host-specific Routes ── */}
          <Route
            path="/host"
            element={
              <ProtectedRoute allowedRoles={[ROLES.HOST]}>
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.HOST]}>
                <HostEventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.HOST]}>
                <HostEventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/event/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.HOST]}>
                <HostEventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/event/:eventId/registrations"
            element={
              <ProtectedRoute allowedRoles={[ROLES.HOST]}>
                <EventRegistrations />
              </ProtectedRoute>
            }
          />

          {/* ── Admin-specific Routes ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;