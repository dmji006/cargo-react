import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Box, Spinner } from "@chakra-ui/react";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const CarListing = lazy(() => import("./pages/cars/CarListing"));
const CarDetails = lazy(() => import("./pages/cars/CarDetails"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
    <Spinner size="xl" />
  </Box>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarListing />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
