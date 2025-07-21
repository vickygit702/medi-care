import { Card } from "../../components/ui/Card";
import {
  User,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "../../lib/supabase";
import { useDispatch } from "react-redux";
import { updatePatientInfo } from "../../stores/infoSlice";

const Dashboard = () => {
  const { patientData } = useSelector((state: RootState) => state.info);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [currentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [calendarDays, setCalendarDays] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  // Generate calendar days when month/year changes
  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Previous month days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const prevDays = Array.from(
      { length: firstDayOfMonth },
      (_, i) => prevMonthDays - firstDayOfMonth + i + 1
    );

    // Current month days (all days)
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Calculate total days shown (prev + current)
    const daysShown = prevDays.length + currentDays.length;
    // Calculate cells needed to complete the last week (if any)
    const remainingCells = daysShown % 7 === 0 ? 0 : 7 - (daysShown % 7);

    // Don't add next month days - just add empty cells if needed
    const emptyCells = Array.from({ length: remainingCells }, () => 0);

    setCalendarDays([...prevDays, ...currentDays, ...emptyCells]);
  }, [currentMonth, currentYear]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload photo to Supabase Storage
  const handlePhotoUpload = async () => {
    if (!selectedFile || !user?.id) return;

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("medication-proofs")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("medication-proofs").getPublicUrl(fileName);

      // Update patient info with photo URL
      const { error } = await supabase
        .from("info")
        .update({
          proof_photos: [...(patientData?.proof_photos || []), publicUrl],
        })
        .eq("patient_id", user.id);

      if (error) throw error;

      // Update Redux store
      dispatch(
        updatePatientInfo({
          proof_photos: [...(patientData?.proof_photos || []), publicUrl],
        })
      );

      alert("Photo uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  // Mark medication as taken
  const handleMarkAsTaken = async () => {
    if (!user?.id || !patientData) return;

    setIsMarking(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const now = format(new Date(), "HH:mm");

      // Check if already marked today
      const alreadyTaken = patientData.medication_taken_details?.some(
        (detail) => detail.date === today
      );

      if (alreadyTaken) {
        alert("You have already marked your medication as taken today");
        return;
      }

      const { error } = await supabase
        .from("info")
        .update({
          medication_taken_details: [
            ...(patientData.medication_taken_details || []),
            { date: today, time: now },
          ],
          today_status: true,
          streak: (patientData.streak || 0) + 1,
        })
        .eq("patient_id", user.id);

      if (error) throw error;

      // Update Redux store
      dispatch(
        updatePatientInfo({
          medication_taken_details: [
            ...(patientData.medication_taken_details || []),
            { date: today, time: now },
          ],
          today_status: true,
          streak: (patientData.streak || 0) + 1,
        })
      );

      alert("Medication marked as taken!");
    } catch (error) {
      console.error("Error marking medication:", error);
      alert("Failed to mark medication");
    } finally {
      setIsMarking(false);
    }
  };

  // Get medication status for each day
  const getMedicationStatus = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || !patientData?.medication_taken_details) return null;

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const takenToday = patientData.medication_taken_details.some(
      (detail) => detail.date === dateStr
    );

    return takenToday ? "taken" : "missed";
  };

  // Check if today's medication was taken
  const isTodayMedicationTaken = patientData?.medication_taken_details?.some(
    (detail) => detail.date === format(currentDate, "yyyy-MM-dd")
  );

  // Calculate monthly rate
  const calculateMonthlyRate = () => {
    if (!patientData?.medication_taken_details) return 0;

    const currentMonthDetails = patientData.medication_taken_details.filter(
      (detail) =>
        detail.date.startsWith(
          `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-`
        )
    );

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Math.round((currentMonthDetails.length / daysInMonth) * 100);
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 space-y-6">
        {/* Gradient Header Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                Good {getTimeOfDayGreeting()}, {user?.username}!
              </h2>
            </div>
            <p className="text-blue-100">
              {isTodayMedicationTaken
                ? "Great job taking your medication today!"
                : "Ready to stay on track with your medication?"}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">
                {patientData?.streak || 0}
              </p>
              <p className="text-blue-100 text-sm">Day Streak</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">
                {isTodayMedicationTaken ? "✓" : "X"}
              </p>
              <p className="text-blue-100 text-sm">Today's Status</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">
                {calculateMonthlyRate()}%
              </p>
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

            {/* Medication Items */}
            {patientData?.medications_list?.length ? (
              patientData.medications_list.map((medication, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {medication.name}
                      </p>
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

            {/* Add Proof Photo Section */}
            {!isTodayMedicationTaken && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">
                  Add Proof Photo (Optional)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Take a photo of your medication or pill organizer as
                  confirmation
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {selectedFile ? selectedFile.name : "Choose Photo"}
                    </span>
                  </label>
                  {selectedFile && (
                    <button
                      onClick={handlePhotoUpload}
                      disabled={isUploading}
                      className={`flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isUploading ? "Uploading..." : "Upload Photo"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mark as Taken Button */}
            {!isTodayMedicationTaken && (
              <button
                onClick={handleMarkAsTaken}
                disabled={isMarking}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  isMarking ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Check className="w-5 h-5" />
                <span>{isMarking ? "Processing..." : "Mark as Taken"}</span>
              </button>
            )}
          </div>

          {/* Right Card - Medication Calendar */}
          <div className="h-full bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Medication Calendar
            </h3>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h4 className="font-medium text-gray-900">
                {new Date(currentYear, currentMonth).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h4>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => navigateMonth("next")}
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

            <div className="grid grid-cols-7 gap-1 mb-6">
              {calendarDays.map((day, index) => {
                const firstDayOfMonth = getFirstDayOfMonth(
                  currentYear,
                  currentMonth
                );
                const isPrevMonth = index < firstDayOfMonth;
                const isCurrentMonth = index >= firstDayOfMonth && day !== 0;

                const isToday =
                  isCurrentMonth &&
                  day === currentDate.getDate() &&
                  currentMonth === currentDate.getMonth() &&
                  currentYear === currentDate.getFullYear();

                const isPastDate =
                  isCurrentMonth &&
                  (currentYear < currentDate.getFullYear() ||
                    (currentYear === currentDate.getFullYear() &&
                      currentMonth < currentDate.getMonth()) ||
                    (currentYear === currentDate.getFullYear() &&
                      currentMonth === currentDate.getMonth() &&
                      day <= currentDate.getDate()));

                const isFutureDate = isCurrentMonth && !isPastDate && !isToday;

                // Only show status for past dates (not today or future)
                const status = isPastDate
                  ? getMedicationStatus(day, true)
                  : null;

                return (
                  <div key={index} className="relative h-10">
                    {day !== 0 ? (
                      <>
                        <div
                          className={`text-center text-sm py-2 rounded-lg h-full flex items-center justify-center ${
                            isPrevMonth
                              ? "text-gray-400"
                              : isToday
                              ? "bg-blue-600 text-white font-medium"
                              : isFutureDate
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-900"
                          }`}
                        >
                          {day}
                        </div>
                        {/* Only show status indicator for past dates */}
                        {status && isPastDate && (
                          <div
                            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                              status === "taken" ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                        )}
                      </>
                    ) : (
                      <div className="h-full"></div> // Empty cell for alignment
                    )}
                  </div>
                );
              })}
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
  );
};

// Helper function to get time-based greeting
function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

// Helper functions for calendar
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default Dashboard;
