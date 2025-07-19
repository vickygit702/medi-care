// import { useSelector, useDispatch } from "react-redux";
// import type { RootState, AppDispatch } from "../stores/store";
// import { authService } from "../services/auth";
// import PatientDashboard from "../pages/Patient/Dashboard";
// import CaretakerDashboard from "../pages/Caretaker/Dashboard";

// export default function Layout() {
//   const { user } = useSelector((state: RootState) => state.auth);
//   const dispatch = useDispatch<AppDispatch>();

//   const handleLogout = async () => {
//     await authService.logout(dispatch);
//     // Optionally redirect to login page
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Bar */}
//       <header
//         className="flex items-center justify-between w-full px-8 py-4 bg-blue-600 text-white shadow"
//         style={{ width: "100vw" }}
//       >
//         <div className="text-xl font-bold">Medicare</div>
//         <button
//           onClick={handleLogout}
//           className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-100 font-medium"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Body */}
//       <main
//         className="mx-auto mt-8 p-2 bg-white rounded shadow"
//         style={{ maxWidth: "80vw" }}
//       >
//         {/* Conditional Dashboard */}
//         {user?.role === "patient" ? (
//           <PatientDashboard />
//         ) : (
//           <CaretakerDashboard />
//         )}
//       </main>
//     </div>
//   );
// }

// import { useSelector, useDispatch } from "react-redux";
// import type { RootState, AppDispatch } from "../stores/store";
// import { authService } from "../services/auth";
// import PatientDashboard from "../pages/Patient/Dashboard";
// import CaretakerDashboard from "../pages/Caretaker/Dashboard";

// export default function Layout() {
//   const { user } = useSelector((state: RootState) => state.auth);
//   const dispatch = useDispatch<AppDispatch>();

//   const handleLogout = async () => {
//     await authService.logout(dispatch);
//     // Optionally redirect to login page
//   };

//   return (
//     <div>
//       {/* Conditional Dashboard */}
//       {user?.role === "patient" ? <PatientDashboard /> : <CaretakerDashboard />}
//     </div>
//   );
// }

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../stores/store";
import { authService } from "../services/auth";
import PatientDashboard from "../pages/Patient/Dashboard";
import CaretakerDashboard from "../pages/Caretaker/Dashboard";
import Header from "../components/Header";

export default function Layout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    await authService.logout(dispatch);
    // Optionally redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      {/* <header
        className="flex items-center justify-between w-full px-8 py-4 bg-blue-600 text-white shadow"
        style={{ width: "100vw" }}
      >
        <div className="text-xl font-bold">Medicare</div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-100 font-medium"
        >
          Logout
        </button>
      </header> */}
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
