// src/components/NotificationPreferences.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";

export const NotificationPreferences = ({
  patientId,
}: {
  patientId: string;
}) => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true,
    reminderTime: "08:00",
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("patient_notification_prefs")
        .upsert({
          patient_id: patientId,
          preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Preferences</h3>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.email}
            onChange={(e) =>
              setPreferences({ ...preferences, email: e.target.checked })
            }
            className="rounded text-blue-600"
          />
          <span>Email Notifications</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.sms}
            onChange={(e) =>
              setPreferences({ ...preferences, sms: e.target.checked })
            }
            className="rounded text-blue-600"
          />
          <span>SMS Notifications</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.push}
            onChange={(e) =>
              setPreferences({ ...preferences, push: e.target.checked })
            }
            className="rounded text-blue-600"
          />
          <span>Push Notifications</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Daily Reminder Time
        </label>
        <input
          type="time"
          value={preferences.reminderTime}
          onChange={(e) =>
            setPreferences({ ...preferences, reminderTime: e.target.value })
          }
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Preferences
      </button>
    </div>
  );
};
