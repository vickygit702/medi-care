// import { useState } from "react";
// import { Bell, Calendar, CalendarDays, Settings, Mail } from "lucide-react";

// const NavigationSystem = () => {
//   const [activeTab, setActiveTab] = useState("overview");

//   const renderComponent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <OverviewComponent />;
//       case "recent":
//         return <RecentActivityComponent />;
//       case "calendar":
//         return <CalendarViewComponent />;
//       case "notifications":
//         return <NotificationsComponent />;
//       default:
//         return <OverviewComponent />;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Navigation Tabs */}
//       <div className="grid grid-cols-4 gap-2">
//         <button
//           onClick={() => setActiveTab("overview")}
//           className={`py-2 rounded-lg font-medium transition-colors ${
//             activeTab === "overview"
//               ? "bg-blue-100 text-blue-600"
//               : "bg-transparent text-black hover:bg-gray-100"
//           }`}
//         >
//           Overview
//         </button>
//         <button
//           onClick={() => setActiveTab("recent")}
//           className={`py-2 rounded-lg font-medium transition-colors ${
//             activeTab === "recent"
//               ? "bg-blue-100 text-blue-600"
//               : "bg-transparent text-black hover:bg-gray-100"
//           }`}
//         >
//           Recent Activity
//         </button>
//         <button
//           onClick={() => setActiveTab("calendar")}
//           className={`py-2 rounded-lg font-medium transition-colors ${
//             activeTab === "calendar"
//               ? "bg-blue-100 text-blue-600"
//               : "bg-transparent text-black hover:bg-gray-100"
//           }`}
//         >
//           Calendar View
//         </button>
//         <button
//           onClick={() => setActiveTab("notifications")}
//           className={`py-2 rounded-lg font-medium transition-colors ${
//             activeTab === "notifications"
//               ? "bg-blue-100 text-blue-600"
//               : "bg-transparent text-black hover:bg-gray-100"
//           }`}
//         >
//           Notifications
//         </button>
//       </div>

//       {/* Active Component Display */}
//       <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//         {renderComponent()}
//       </div>
//     </div>
//   );
// };

// // Example components (replace with your actual components)
// const OverviewComponent = () => (
//   <div className="grid grid-cols-2 gap-4">
//     <div className="p-6 bg-white border border-gray-200 rounded-lg">
//       <div className="flex items-center space-x-2 mb-6">
//         <Calendar className="w-5 h-5 text-blue-600" />
//         <h3 className="text-lg font-semibold text-gray-900">
//           Today's Medication
//         </h3>
//       </div>
//       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//             1
//           </div>
//           <div>
//             <p className="font-medium text-gray-900">Daily Medication Set</p>
//             <p className="text-sm text-gray-600">
//               Complete set of daily tablets
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2 text-gray-600">
//           <Calendar className="w-4 h-4" />
//           <span className="text-sm">8:00 AM</span>
//         </div>
//       </div>
//     </div>
//     <div className="p-6 bg-white border border-gray-200 rounded-lg">
//       {/* Action Buttons - 3 Rows */}
//       <div className="space-y-3">
//         {/* Row 1: Send Reminder email*/}
//         <button
//           className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
//           onClick={() => alert("send reminder email")}
//         >
//           <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
//             <div className="flex items-center space-x-3">
//               <Mail className="w-5 h-5 text-gray-600" />
//               <span className="font-medium text-gray-700">
//                 Send Reminder Email
//               </span>
//             </div>
//           </div>
//         </button>

//         {/* Row 2: Notifications */}
//         <button
//           className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
//           onClick={() => alert("Notification")}
//         >
//           <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
//             <div className="flex items-center space-x-3">
//               <Settings className="w-5 h-5 text-gray-600" />
//               <span className="font-medium text-gray-700">
//                 Configure Notifications
//               </span>
//             </div>
//           </div>
//         </button>

//         {/* Row 3: Calendar */}
//         <button
//           className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
//           onClick={() => alert("View calendar")}
//         >
//           <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
//             <div className="flex items-center space-x-3">
//               <CalendarDays className="w-5 h-5 text-gray-600" />
//               <span className="font-medium text-gray-700">
//                 View Full Calendar
//               </span>
//             </div>
//           </div>
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const RecentActivityComponent = () => (
//   <div>
//     <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//     <p>Show recent medication history and actions here.</p>
//   </div>
// );

// const CalendarViewComponent = () => (
//   <div>
//     <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
//     <p>Display your medication calendar here.</p>
//   </div>
// );

// const NotificationsComponent = () => (
//   <div>
//     <h2 className="text-xl font-semibold mb-4">Notifications</h2>
//     <p>Show medication reminders and alerts here.</p>
//   </div>
// );

// export default NavigationSystem;

import { useState } from "react";
import {
  Bell,
  Calendar,
  CalendarDays,
  Settings,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { reminderService } from "../services/reminder";

interface PatientData {
  patient_id: string;
  medications_list: Array<{ name: string; dosage: string }>;
  medication_taken_details: Array<{ date: string; time: string }>;
  streak: number;
  today_status: boolean;
  monthly_rate: number;
}

interface NavigationSystemProps {
  currentPatient: PatientData | undefined;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (direction: "prev" | "next") => void;
}

const NavigationSystem = ({
  currentPatient,
  currentMonth,
  currentYear,
  onMonthChange,
}: NavigationSystemProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderComponent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewComponent currentPatient={currentPatient} />;
      case "recent":
        return <RecentActivityComponent currentPatient={currentPatient} />;
      case "calendar":
        return (
          <CalendarViewComponent
            currentPatient={currentPatient}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={onMonthChange}
          />
        );
      case "notifications":
        return <NotificationsComponent currentPatient={currentPatient} />;
      default:
        return <OverviewComponent currentPatient={currentPatient} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-2 rounded-lg font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-blue-100 text-blue-600"
              : "bg-transparent text-black hover:bg-gray-100"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`py-2 rounded-lg font-medium transition-colors ${
            activeTab === "recent"
              ? "bg-blue-100 text-blue-600"
              : "bg-transparent text-black hover:bg-gray-100"
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`py-2 rounded-lg font-medium transition-colors ${
            activeTab === "calendar"
              ? "bg-blue-100 text-blue-600"
              : "bg-transparent text-black hover:bg-gray-100"
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`py-2 rounded-lg font-medium transition-colors ${
            activeTab === "notifications"
              ? "bg-blue-100 text-blue-600"
              : "bg-transparent text-black hover:bg-gray-100"
          }`}
        >
          Notifications
        </button>
      </div>

      {/* Active Component Display */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        {currentPatient ? (
          renderComponent()
        ) : (
          <div className="text-center py-8 text-gray-500">
            No patient selected or no data available
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components with real data integration
const OverviewComponent = ({
  currentPatient,
}: {
  currentPatient?: PatientData;
}) => {
  if (!currentPatient) return null;

  // In your NavigationSystem component
  const handleSendReminder = async () => {
    if (!currentPatient) return;

    try {
      await reminderService.sendEmailReminder(
        currentPatient.patient_id,
        "system", // Replace with actual user id if available
        `Reminder to take your medication: ${currentPatient.medications_list
          .map((m) => `${m.name} (${m.dosage})`)
          .join(", ")}`
      );
      alert("Reminder sent successfully!");
    } catch (error) {
      console.error("Failed to send reminder:", error);
      alert("Failed to send reminder");
    }
  };

  const handleConfigureNotifications = () => {
    // This would open a modal or navigate to a settings page
    alert("Redirecting to notification settings");
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Medication
          </h3>
        </div>

        {currentPatient.medications_list?.length ? (
          currentPatient.medications_list.map((medication, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{medication.name}</p>
                  <p className="text-sm text-gray-600">
                    Dosage: {medication.dosage}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">8:00 AM</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No medications scheduled for today
          </div>
        )}
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="space-y-3">
          {/* Send Reminder */}
          <button
            onClick={handleSendReminder}
            className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Send Reminder Email
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={handleConfigureNotifications}
            className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Configure Notifications
                </span>
              </div>
            </div>
          </button>

          {/* View Full Calendar */}
          <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <CalendarDays className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  View Full Calendar
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const RecentActivityComponent = ({
  currentPatient,
}: {
  currentPatient?: PatientData;
}) => {
  if (!currentPatient) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {currentPatient.medication_taken_details?.length ? (
          currentPatient.medication_taken_details
            .slice(-5) // Show last 5 entries
            .reverse() // Newest first
            .map((detail, index) => (
              <div key={index} className="p-3 border-b border-gray-200">
                <p className="font-medium">
                  Medication taken on {detail.date} at {detail.time}
                </p>
                <p className="text-sm text-gray-600">
                  {currentPatient.medications_list?.length || 0} medications
                </p>
              </div>
            ))
        ) : (
          <p className="text-gray-500">No recent activity recorded</p>
        )}
      </div>
    </div>
  );
};

const CalendarViewComponent = ({
  currentPatient,
  currentMonth,
  currentYear,
  onMonthChange,
}: {
  currentPatient?: PatientData;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (direction: "prev" | "next") => void;
}) => {
  if (!currentPatient) return null;

  // Generate calendar days
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const prevDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => prevMonthDays - firstDayOfMonth + i + 1
  );

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const nextDays = Array.from(
    { length: totalCells - (firstDayOfMonth + daysInMonth) },
    (_, i) => i + 1
  );

  const calendarDays = [...prevDays, ...currentDays, ...nextDays];

  // Get medication status for a day
  const getStatus = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || !currentPatient.medication_taken_details)
      return null;

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return currentPatient.medication_taken_details.some(
      (detail) => detail.date === dateStr
    )
      ? "taken"
      : "missed";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Medication Calendar</h2>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => onMonthChange("prev")}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-medium text-gray-900">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => onMonthChange("next")}
        >
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

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonth =
            index >= firstDayOfMonth && index < firstDayOfMonth + daysInMonth;
          const status = getStatus(day, isCurrentMonth);

          return (
            <div key={index} className="relative">
              <div
                className={`text-center text-sm py-2 rounded ${
                  !isCurrentMonth ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {day}
              </div>
              {status && (
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                    status === "taken" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-700">Medication taken</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-700">Missed medication</span>
        </div>
      </div>
    </div>
  );
};

const NotificationsComponent = ({
  currentPatient,
}: {
  currentPatient?: PatientData;
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-4">
        {currentPatient ? (
          <>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">
                Medication Reminders
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                Set up reminders for{" "}
                {currentPatient.medications_list?.length || 0} medications
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800">
                Missed Medication Alerts
              </h3>
              <p className="text-sm text-yellow-600 mt-1">
                Receive alerts when medication is missed
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No patient selected</p>
        )}
      </div>
    </div>
  );
};

export default NavigationSystem;
