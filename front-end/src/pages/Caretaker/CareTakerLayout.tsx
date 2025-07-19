import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";

export default function CareTakerLayout() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">CareTaker Dashboard</h1>
      <p className="mt-2">Welcome, {user?.email}</p>
      <div className="mt-6">{/* Medication list will go here */}</div>
    </div>
  );
}
