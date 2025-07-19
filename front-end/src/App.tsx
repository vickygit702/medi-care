import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  Route,
} from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./stores/store";
import RoleSelection from "./components/auth/RoleSelection";
import NotFound from "./components/auth/NotFound";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import PatientLayout from "./pages/Patient/PatientLayout";
import CareTakerLayout from "./pages/Caretaker/CareTakerLayout";
import PatientDashboard from "./pages/Patient/Dashboard";
import CaretakerDashboard from "./pages/Caretaker/Dashboard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./stores/store";
import { authService } from "./services/auth";

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Check auth state on initial load
  useEffect(() => {
    authService.checkAuth(dispatch);
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public routes */}
        <Route path="/select-role" element={<RoleSelection />} />
        <Route
          path="/login"
          element={
            !user ? <LoginForm /> : <Navigate to={`/${user.role}`} replace />
          }
        />
        <Route
          path="/register"
          element={
            !user ? <RegisterForm /> : <Navigate to={`/${user.role}`} replace />
          }
        />

        {/* Protected routes */}
        <Route path="/patient/:id/dashboard" element={<PatientLayout />} />

        <Route
          path="/caretaker"
          element={
            user?.role === "caretaker" ? (
              <CareTakerLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<CaretakerDashboard />} />
          <Route path="dashboard" element={<CaretakerDashboard />} />
        </Route>

        {/* Redirects */}
        <Route
          path="/"
          element={
            <Navigate
              to={user ? `/${user.role}/dashboard` : "/select-role"}
              replace
            />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
