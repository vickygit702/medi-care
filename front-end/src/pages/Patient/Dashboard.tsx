import { Card } from "../../components/ui/Card";
import {
  User,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
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
                <h2 className="text-2xl font-bold">Good Afternoon!</h2>
              </div>
              <p className="text-blue-100">
                Ready to stay on track with your medication?
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4">
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
            </div>
          </Card>

          {/* Today's Medication Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-6">
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Medication
                </h3>
              </div>

              {/* Medication Item */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Daily Medication Set
                    </p>
                    <p className="text-sm text-gray-600">
                      Complete set of daily tablets
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">8:00 AM</span>
                </div>
              </div>

              {/* Add Proof Photo Section */}
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">
                  Add Proof Photo (Optional)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Take a photo of your medication or pill organizer as
                  confirmation
                </p>
                <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg mx-auto">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm font-medium">Take Photo</span>
                </button>
              </div>

              {/* Mark as Taken Button */}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Mark as Taken</span>
              </button>
            </div>

            {/* Right Card - Medication Calendar (40% width) */}
            <div className="h-full bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Medication Calendar
              </h3>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h4 className="font-medium text-gray-900">July 2025</h4>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 mb-6">
                {calendarDays.map((day, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`text-center text-sm py-2 ${
                        index < 2 || index > 32
                          ? "text-gray-400"
                          : day === 19
                          ? "bg-blue-600 text-white rounded-lg font-medium"
                          : "text-gray-900"
                      }`}
                    >
                      {day}
                    </div>
                    {getStatusColor(day, index) && (
                      <div
                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${getStatusColor(
                          day,
                          index
                        )}`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Medication taken</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Missed medication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
