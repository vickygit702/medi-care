import { useState } from "react";
import {
  Calendar,
  Settings,
  Mail,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabase";
import { updatePatientInfo } from "../stores/infoSlice";

interface PatientData {
  patient_id: string;
  medications_list: Array<{
    name: string;
    dosage: string;
    time: "Morning" | "Afternoon" | "Night";
  }>;
  patient_name: string;
  medication_taken_details: Array<{ date: string; time: string }>;
  streak: number;
  today_status: boolean;
  monthly_rate: number;
  proof_photos?: string[]; // Add this line to fix the error
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
// const OverviewComponent = ({
//   currentPatient,
// }: {
//   currentPatient?: PatientData;
// }) => {
//   if (!currentPatient) return null;

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       {/* Medication List Section */}
//       <div className="p-6 bg-white border border-gray-200 rounded-lg">
//         <div className="flex items-center space-x-2 mb-6">
//           <Calendar className="w-5 h-5 text-blue-600" />
//           <h3 className="text-lg font-semibold text-gray-900">
//             Medication List
//           </h3>
//         </div>

//         {currentPatient.medications_list?.length ? (
//           <div className="space-y-4">
//             {currentPatient.medications_list.map((medication, index) => (
//               <div
//                 key={index}
//                 className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-medium text-gray-900">
//                       {medication.name}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Dosage: {medication.dosage}
//                     </p>
//                     {/* {medication.frequency && (
//                       <p className="text-sm text-gray-600 mt-1">
//                         Frequency: {medication.frequency}
//                       </p>
//                     )} */}
//                   </div>
//                   <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                     {/* {medication?.time || "Daily"} */}
//                     Daily
//                   </div>
//                 </div>
//                 {/* {medication.notes && (
//                   <div className="mt-2 p-2 bg-gray-50 rounded">
//                     <p className="text-xs text-gray-600">{medication.notes}</p>
//                   </div>
//                 )} */}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="p-4 text-center text-gray-500">
//             No medications prescribed
//           </div>
//         )}
//       </div>

//       {/* Actions Section (unchanged) */}
//       <div className="p-6 bg-white border border-gray-200 rounded-lg">
//         <div className="space-y-3">
//           {/* Send Reminder */}
//           <button
//             onClick={() =>
//               alert("Reminder email sending functionality not implemented yet")
//             }
//             className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
//               <div className="flex items-center space-x-3">
//                 <Mail className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium text-gray-700">
//                   Send Reminder Email
//                 </span>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() =>
//               alert("Configure notifications functionality not implemented yet")
//             }
//             className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
//               <div className="flex items-center space-x-3">
//                 <Settings className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium text-gray-700">
//                   Configure Notifications
//                 </span>
//               </div>
//             </div>
//           </button>

//           {/* View Full profile */}
//           <button
//             onClick={() =>
//               alert("Profile view functionality not implemented yet")
//             }
//             className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
//               <div className="flex items-center space-x-3">
//                 <User className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium text-gray-700">View Profile</span>
//               </div>
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

type Medication = {
  name: string;
  dosage: string;
  time: "Morning" | "Afternoon" | "Night";
};

const OverviewComponent = ({
  currentPatient,
}: {
  currentPatient?: PatientData;
}) => {
  if (!currentPatient) return null;

  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [medications, setMedications] = useState<Medication[]>(
    currentPatient?.medications_list || []
  );
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    time: "Morning",
  });

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      // Reset to original when canceling edit
      setMedications(currentPatient.medications_list || []);
    }
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setMedications(updatedMedications);
  };

  const handleDeleteMedication = async (index: number) => {
    try {
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);

      // Update local state immediately
      setMedications(updatedMedications);

      // Update database
      const { error } = await supabase
        .from("info")
        .update({ medications_list: updatedMedications })
        .eq("patient_id", currentPatient.patient_id);

      if (error) throw error;

      // Update Redux store
      dispatch(updatePatientInfo({ medications_list: updatedMedications }));
    } catch (error) {
      console.error("Error deleting medication:", error);
      // Revert local state if update fails
      setMedications(currentPatient.medications_list || []);
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.dosage) return;

    try {
      const updatedMedications = [...medications, { ...newMedication }];

      // Update local state immediately
      setMedications(updatedMedications);
      setNewMedication({
        name: "",
        dosage: "",
        time: "Morning",
      });

      // Update database
      const { error } = await supabase
        .from("info")
        .update({ medications_list: updatedMedications })
        .eq("patient_id", currentPatient.patient_id);

      if (error) throw error;

      // Update Redux store
      dispatch(updatePatientInfo({ medications_list: updatedMedications }));
    } catch (error) {
      console.error("Error adding medication:", error);
      // Revert local state if update fails
      setMedications(currentPatient.medications_list || []);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Update database
      const { error } = await supabase
        .from("info")
        .update({ medications_list: medications })
        .eq("patient_id", currentPatient.patient_id);

      if (error) throw error;

      // Update Redux store
      dispatch(updatePatientInfo({ medications_list: medications }));

      setEditing(false);
    } catch (error) {
      console.error("Error saving medications:", error);
      // Revert local state if update fails
      setMedications(currentPatient.medications_list || []);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Medication List Section */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Medication List
            </h3>
          </div>
          {!editing ? (
            <button
              onClick={handleEditToggle}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded bg-blue-50"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleEditToggle}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded bg-green-50"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {medications.length ? (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Medication name"
                        />
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Dosage"
                        />
                        <select
                          value={medication.time}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "time",
                              e.target.value as
                                | "Morning"
                                | "Afternoon"
                                | "Night"
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Night">Night</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-900">
                          {medication.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Dosage: {medication.dosage}
                        </p>
                        <p className="text-sm text-gray-600">
                          Time: {medication.time}
                        </p>
                      </>
                    )}
                  </div>
                  {editing && (
                    <button
                      onClick={() => handleDeleteMedication(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {editing && (
              <div className="p-4 border border-gray-200 rounded-lg border-dashed">
                <h4 className="font-medium mb-2">Add New Medication</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Medication name"
                  />
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        dosage: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Dosage"
                  />
                  <select
                    value={newMedication.time}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        time: e.target.value as
                          | "Morning"
                          | "Afternoon"
                          | "Night",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                  <button
                    onClick={handleAddMedication}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={!newMedication.name || !newMedication.dosage}
                  >
                    Add Medication
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {editing ? (
              <div className="p-4 border border-gray-200 rounded-lg border-dashed">
                <h4 className="font-medium mb-2">Add New Medication</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Medication name"
                  />
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        dosage: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Dosage"
                  />
                  <select
                    value={newMedication.time}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        time: e.target.value as
                          | "Morning"
                          | "Afternoon"
                          | "Night",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                  <button
                    onClick={handleAddMedication}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={!newMedication.name || !newMedication.dosage}
                  >
                    Add Medication
                  </button>
                </div>
              </div>
            ) : (
              "No medications prescribed"
            )}
          </div>
        )}
      </div>

      {/* Actions Section (unchanged) */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="space-y-3">
          {/* Send Reminder */}
          <button
            onClick={() =>
              alert("Reminder email sending functionality not implemented yet")
            }
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
            onClick={() =>
              alert("Configure notifications functionality not implemented yet")
            }
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

          {/* View Full profile */}
          <button
            onClick={() =>
              alert("Profile view functionality not implemented yet")
            }
            className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">View Profile</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// const RecentActivityComponent = ({
//   currentPatient,
// }: {
//   currentPatient?: PatientData;
// }) => {
//   if (!currentPatient) return null;

//   return (
//     <div>
//       <div className="space-y-4">
//         {currentPatient.medication_taken_details?.length ? (
//           currentPatient.medication_taken_details
//             .slice(-5) // Show last 5 entries
//             .reverse() // Newest first
//             .map((detail, index) => (
//               <div key={index} className="p-3 border-b border-gray-200">
//                 <p className="font-medium">
//                   Medication taken on {detail.date} at {detail.time}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   {currentPatient.medications_list?.length || 0} medications
//                 </p>
//               </div>
//             ))
//         ) : (
//           <p className="text-gray-500">No recent activity recorded</p>
//         )}
//       </div>
//     </div>
//   );
// };

const RecentActivityComponent = ({
  currentPatient,
}: {
  currentPatient?: PatientData;
}) => {
  if (!currentPatient) return null;

  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

  return (
    <div>
      {/* Photo Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Proof Photo</h3>
              <button
                onClick={() => setViewingPhoto(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <img
              src={viewingPhoto}
              alt="Medication proof"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {currentPatient.medication_taken_details?.length ? (
          currentPatient.medication_taken_details
            .slice(-5) // Show last 5 entries
            .reverse() // Newest first
            .map((detail, index) => {
              // Check if there's a proof photo for this date
              const proofPhoto = currentPatient.proof_photos?.find((photo) => {
                // Assuming photo URLs contain the date or we have a mapping
                // This is a simple example - adjust based on your actual photo storage structure
                return (
                  photo.includes(detail.date.replace(/-/g, "")) ||
                  photo.includes(detail.date)
                );
              });

              return (
                <div key={index} className="p-3 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Medication taken on {detail.date} at {detail.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentPatient.medications_list?.length || 0}{" "}
                        medications
                      </p>
                    </div>
                    {proofPhoto && (
                      <button
                        onClick={() => setViewingPhoto(proofPhoto)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Proof
                      </button>
                    )}
                  </div>
                </div>
              );
            })
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

const NotificationsComponent = ({
  currentPatient,
}: {
  currentPatient?: PatientData;
}) => {
  return (
    <div>
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
