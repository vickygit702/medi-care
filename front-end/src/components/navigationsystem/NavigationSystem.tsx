import { useState } from "react";
import OverviewComponent from "./OverviewComponent";
import RecentActivityComponent from "./RecentActivityComponent";
import CalendarViewComponent from "./CalenderViewComponent";
import NotificationsComponent from "./NotificationsComponent";
import { type NavigationSystemProps } from "./types";

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

export default NavigationSystem;
