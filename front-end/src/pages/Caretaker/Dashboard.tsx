import { useSelector } from "react-redux";
import { Card } from "../../components/ui/Card";
import {
  User,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { RootState } from "../../stores/store";
import NavigationSystem from "../../components/NavigationSystem";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const calendarDays = [
    // Previous month days
    29, 30,
    // Current month days (July 2025)
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    // Next month days
    1, 2,
  ];

  const medicationStatus: { [key: string]: string } = {
    1: "missed",
    2: "missed",
    4: "taken",
    5: "taken",
    6: "missed",
    7: "missed",
    8: "missed",
    9: "missed",
    10: "missed",
    11: "missed",
    12: "missed",
    13: "taken",
    14: "missed",
    15: "missed",
    16: "missed",
    17: "missed",
    18: "missed",
    19: "today",
  };

  const getStatusColor = (day: number, index: number) => {
    if (index < 2 || index > 32) return ""; // Previous/next month days
    const status = medicationStatus[String(day)];
    if (status === "taken") return "bg-green-500";
    if (status === "missed") return "bg-red-500";
    if (status === "today") return "bg-blue-500";
    return "";
  };

  return (
    <>
      <div className="flex flex-col gap-6 h-full ">
        {/* First div - takes full available width */}
        <div className="flex-1 space-y-6">
          {/* Gradient Header Card */}
          <Card className="p-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white border-0">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-6 h-6" />
                <h2 className="text-2xl font-bold">{user?.role}'s Dashboard</h2>
              </div>
              <p className="text-blue-100">
                Monitoring Eleanor Thompson's medication adherence
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold mb-1">0</p>
                <p className="text-blue-100 text-sm">Day Streak</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold mb-1">X</p>
                <p className="text-blue-100 text-sm">Todays Status</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold mb-1">0%</p>
                <p className="text-blue-100 text-sm">Monthly Rate</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold mb-1">0%</p>
                <p className="text-blue-100 text-sm">Monthly Rate</p>
              </div>
            </div>
          </Card>

          {/* Today's Medication Section */}
          <NavigationSystem />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
