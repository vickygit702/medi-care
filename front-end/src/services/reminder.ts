// src/services/reminder.ts
import { supabase } from "../lib/supabase";

export const reminderService = {
  async sendEmailReminder(
    patientId: string,
    caretakerId: string,
    message: string
  ) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert([
          {
            patient_id: patientId,
            caretaker_id: caretakerId,
            type: "email",
            message,
            scheduled_time: new Date().toISOString(),
            status: "pending",
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error sending reminder:", error);
      throw error;
    }
  },

  async getPendingReminders() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_time", new Date().toISOString());

    if (error) throw error;
    return data;
  },

  async markAsSent(reminderId: number) {
    const { error } = await supabase
      .from("notifications")
      .update({ status: "sent", updated_at: new Date().toISOString() })
      .eq("id", reminderId);

    if (error) throw error;
  },
};
