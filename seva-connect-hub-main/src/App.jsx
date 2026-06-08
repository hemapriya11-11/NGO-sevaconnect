import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import NGOListing from "./pages/NGOListing.jsx";
import NGOProfile from "./pages/NGOProfile.jsx";
import NGORegistration from "./pages/NGORegistration.jsx";
import NGODashboard from "./pages/NGODashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NGORouteProtector from "./components/NGORouteProtector.jsx";
import NGOStatus from "./pages/NGOStatus.jsx";

const App = () => (
  <>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ngos" element={<ProtectedRoute><NGOListing /></ProtectedRoute>} />
            <Route path="/ngo/:id" element={<ProtectedRoute><NGOProfile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* User Routes */}
            <Route path="/dashboard/user" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboard /></ProtectedRoute>} />

            {/* NGO Routes with Dynamic Flow */}
            <Route path="/ngo/register" element={<NGORouteProtector><NGORegistration /></NGORouteProtector>} />
            <Route path="/ngo/status" element={<NGORouteProtector><NGOStatus /></NGORouteProtector>} />
            <Route path="/ngo/dashboard" element={<NGORouteProtector><NGODashboard /></NGORouteProtector>} />
            
            {/* Compatibility Redirects (Optional but good) */}
            <Route path="/dashboard/ngo" element={<Navigate to="/ngo/dashboard" replace />} />
            <Route path="/register-ngo" element={<Navigate to="/ngo/register" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </BrowserRouter>
  </>
);

export default App;
