import { useState } from "react";
import { Bell, Calendar, CalendarDays, Settings, Mail } from "lucide-react";

const NavigationSystem = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderComponent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewComponent />;
      case "recent":
        return <RecentActivityComponent />;
      case "calendar":
        return <CalendarViewComponent />;
      case "notifications":
        return <NotificationsComponent />;
      default:
        return <OverviewComponent />;
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
        {renderComponent()}
      </div>
    </div>
  );
};

// Example components (replace with your actual components)
const OverviewComponent = () => (
  <div className="grid grid-cols-2 gap-4">
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Today's Medication
        </h3>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            1
          </div>
          <div>
            <p className="font-medium text-gray-900">Daily Medication Set</p>
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
    </div>
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      {/* Action Buttons - 3 Rows */}
      <div className="space-y-3">
        {/* Row 1: Send Reminder email*/}
        <button
          className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => alert("send reminder email")}
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

        {/* Row 2: Notifications */}
        <button
          className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => alert("Notification")}
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

        {/* Row 3: Calendar */}
        <button
          className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => alert("View calendar")}
        >
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

const RecentActivityComponent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
    <p>Show recent medication history and actions here.</p>
  </div>
);

const CalendarViewComponent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
    <p>Display your medication calendar here.</p>
  </div>
);

const NotificationsComponent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Notifications</h2>
    <p>Show medication reminders and alerts here.</p>
  </div>
);

export default NavigationSystem;
