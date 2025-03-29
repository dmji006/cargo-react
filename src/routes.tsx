import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "./store";

// Lazy load pages
const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const CarListing = lazy(() => import("./pages/cars/CarListing"));
const CarDetails = lazy(() => import("./pages/cars/CarDetails"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const MyCars = lazy(() => import("./components/MyCars"));
const RentedCars = lazy(() => import("./pages/cars/RentedCars"));

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
    <Spinner size="xl" />
  </Box>
);

const AppRoutes = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            !isAuthenticated ? <Landing /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <Register /> : <Navigate to="/home" replace />
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <CarListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars/:id"
          element={
            <ProtectedRoute>
              <CarDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-cars"
          element={
            <ProtectedRoute>
              <MyCars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rented-car"
          element={
            <ProtectedRoute>
              <RentedCars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
