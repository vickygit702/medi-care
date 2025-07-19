import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";

export default function CaretakerDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Caretaker Dashboard</h1>
      <p className="mt-2">Welcome, {user?.email}</p>
      <div className="mt-6">{/* Patient management will go here */}</div>
    </div>
  );
}
