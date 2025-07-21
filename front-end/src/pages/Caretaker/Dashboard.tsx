import { useSelector } from "react-redux";
import { Card } from "../../components/ui/Card";
import { User } from "lucide-react";
import type { RootState } from "../../stores/store";
import NavigationSystem from "../../components/navigationsystem/NavigationSystem";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { caretakerData } = useSelector((state: RootState) => state.info);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [currentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Set first patient as selected by default
  useEffect(() => {
    if (caretakerData?.length && !selectedPatient) {
      setSelectedPatient(caretakerData[0].patient_id);
    }
  }, [caretakerData, selectedPatient]);

  // Get currently selected patient data
  const currentPatient = caretakerData?.find(
    (patient) => patient.patient_id === selectedPatient
  );

  // Calculate overall stats for all patients
  const calculateOverallStats = () => {
    if (!caretakerData)
      return { streak: 0, monthlyRate: 0, todayStatus: false };

    const streaks = caretakerData.map((p) => p.streak);
    const todayStatuses = caretakerData.map((p) => p.today_status);

    // Calculate average streak
    const avgStreak = Math.round(
      streaks.reduce((sum, val) => sum + val, 0) / streaks.length
    );

    // Calculate monthly rate
    const monthlyRates = caretakerData.map((patient) => {
      const currentMonthDetails =
        patient.medication_taken_details?.filter((detail) =>
          detail.date.startsWith(
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-`
          )
        ) || [];
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      return Math.round((currentMonthDetails.length / daysInMonth) * 100);
    });

    const avgMonthlyRate = Math.round(
      monthlyRates.reduce((sum, val) => sum + val, 0) / monthlyRates.length
    );

    // Calculate today's status (percentage of patients who took meds today)
    const todayTaken = todayStatuses.filter((status) => status).length;
    const todayPercentage = Math.round(
      (todayTaken / todayStatuses.length) * 100
    );

    return {
      streak: avgStreak,
      monthlyRate: avgMonthlyRate,
      todayPercentage,
    };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 space-y-6">
        {/* Gradient Header Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                {user?.username}'s Dashboard
              </h2>
            </div>
            <p className="text-blue-100">
              {caretakerData?.length
                ? `Monitoring ${caretakerData[0].patient_name}'s medication adherence`
                : "No patients assigned"}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">{overallStats.streak}</p>
              <p className="text-blue-100 text-sm">Avg. Day Streak</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">
                {overallStats.todayPercentage}%
              </p>
              <p className="text-blue-100 text-sm">Today's Compliance</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">
                {overallStats.monthlyRate}%
              </p>
              <p className="text-blue-100 text-sm">Avg. Monthly Rate</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">
                {caretakerData?.length || 0}
              </p>
              <p className="text-blue-100 text-sm">Patients</p>
            </div>
          </div>
        </Card>

        {/* Patient selector dropdown */}
        {(caretakerData?.length ?? 0) > 1 && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label
              htmlFor="patient-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Patient
            </label>
            <select
              id="patient-select"
              value={selectedPatient || ""}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {(caretakerData ?? []).map((patient) => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  Patient {patient.patient_id.substring(0, 8)}...
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation System with patient data */}
        <NavigationSystem
          currentPatient={currentPatient}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onMonthChange={(direction) => {
            if (direction === "prev") {
              setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
              if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
            } else {
              setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
              if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
