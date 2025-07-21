import { useState } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../../lib/supabase";
import { updatePatientInfo } from "../../stores/infoSlice";
import { Calendar, Settings, Mail, User } from "lucide-react";
import type { PatientData, Medication } from "./types";

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

export default OverviewComponent;
