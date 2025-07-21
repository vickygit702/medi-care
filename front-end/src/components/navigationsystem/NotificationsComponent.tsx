import { type PatientData } from "./types";

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

export default NotificationsComponent;
