import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./stores/store";
import RoleSelection from "./components/auth/RoleSelection";
import NotFound from "./components/auth/NotFound";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import CommonLayout from "./pages/Layout";

import PatientDashboard from "./pages/Patient/Dashboard";
import CaretakerDashboard from "./pages/Caretaker/Dashboard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./stores/store";
import { authService } from "./services/auth";

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    authService.checkAuth(dispatch);
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/select-role",
      element: <RoleSelection />,
    },
    {
      path: "/",
      element: <RoleSelection />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/register",
      element: <RegisterForm />,
    },

    {
      path: "/patient/dashboard",
      element:
        user?.role === "patient" ? <CommonLayout /> : <Navigate to="/login" />,
      children: [
        {
          index: true,
          element: <PatientDashboard />,
        },
      ],
    },
    {
      path: "/caretaker/dashboard",
      element:
        user?.role === "caretaker" ? (
          <CommonLayout />
        ) : (
          <Navigate to="/login" />
        ),
      children: [
        {
          index: true,
          element: <CaretakerDashboard />,
        },
        {
          path: "dashboard",
          element: <CaretakerDashboard />,
        },
      ],
    },

    // Fallback
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
