import { ChevronLeft, ChevronRight } from "lucide-react";
import { type PatientData } from "./types";

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

  const today = new Date();
  const currentDate = today.getDate();
  const currentMonthIndex = today.getMonth();
  const currentYearValue = today.getFullYear();

  // Generate calendar days
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Previous month days (for alignment)
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const prevDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => prevMonthDays - firstDayOfMonth + i + 1
  );

  // Current month days (all days)
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Calculate empty cells needed to complete the week (if any)
  const totalDaysShown = prevDays.length + currentDays.length;
  const emptyCells = Array.from(
    { length: (7 - (totalDaysShown % 7)) % 7 },
    () => 0
  );

  const calendarDays = [...prevDays, ...currentDays, ...emptyCells];

  // Get medication status for a day
  const getStatus = (day: number) => {
    if (!currentPatient.medication_taken_details) return null;

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

  // Check if a day is in the past
  const isPastDate = (day: number) => {
    return (
      currentYear < currentYearValue ||
      (currentYear === currentYearValue && currentMonth < currentMonthIndex) ||
      (currentYear === currentYearValue &&
        currentMonth === currentMonthIndex &&
        day < currentDate)
    );
  };

  // Check if a day is today
  const isToday = (day: number) => {
    return (
      currentYear === currentYearValue &&
      currentMonth === currentMonthIndex &&
      day === currentDate
    );
  };

  // Check if a day is in the future
  const isFutureDate = (day: number) => {
    return (
      currentYear > currentYearValue ||
      (currentYear === currentYearValue && currentMonth > currentMonthIndex) ||
      (currentYear === currentYearValue &&
        currentMonth === currentMonthIndex &&
        day > currentDate)
    );
  };

  return (
    <div className="m-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => onMonthChange("prev")}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-medium  text-gray-900">
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
          const isPrevMonthDay = index < firstDayOfMonth;
          const isCurrentMonthDay = index >= firstDayOfMonth && day !== 0;

          return (
            <div key={index} className="relative h-10">
              {day !== 0 ? (
                <>
                  <div
                    className={`text-center text-sm py-2 rounded h-full flex items-center justify-center ${
                      isPrevMonthDay
                        ? "text-gray-400"
                        : isToday(day)
                        ? "bg-blue-600 text-white font-medium"
                        : isFutureDate(day)
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-900"
                    }`}
                  >
                    {day}
                  </div>
                  {/* Show status only for past dates in current month */}
                  {isCurrentMonthDay && isPastDate(day) && (
                    <div
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                        getStatus(day) === "taken"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  )}
                </>
              ) : (
                <div className="h-full"></div>
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
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-700">Today</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewComponent;
