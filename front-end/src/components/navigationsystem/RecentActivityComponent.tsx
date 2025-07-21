import { useState } from "react";
import { type PatientData } from "./types";

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

export default RecentActivityComponent;
