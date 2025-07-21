export interface PatientData {
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
  proof_photos?: string[];
}

export interface NavigationSystemProps {
  currentPatient: PatientData | undefined;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (direction: "prev" | "next") => void;
}

export type Medication = {
  name: string;
  dosage: string;
  time: "Morning" | "Afternoon" | "Night";
};
