import { useSelector } from "react-redux";
import type { RootState } from "../stores/store";

import PatientDashboard from "../pages/Patient/Dashboard";
import CaretakerDashboard from "../pages/Caretaker/Dashboard";
import Header from "../components/Header";

export default function Layout() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Body */}
      <main
        className="mx-auto mt-8 mb-8 bg-transparent"
        style={{ maxWidth: "75vw" }}
      >
        {/* Conditional Dashboard */}
        {user?.role === "patient" ? (
          <PatientDashboard />
        ) : (
          <CaretakerDashboard />
        )}
      </main>
    </div>
  );
}
