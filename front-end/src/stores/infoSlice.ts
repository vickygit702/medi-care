// src/stores/infoSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { AppThunk } from "../stores/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";

interface Medication {
  name: string;
  dosage: string;
  time: "Morning" | "Afternoon" | "Night";
}

interface TakenDetail {
  date: string;
  time: string;
}

export interface PatientInfo {
  id: number;
  patient_id: string;
  caretaker_id: string | null;
  patient_name: string;
  medications_list: Medication[];
  medication_taken_details: TakenDetail[];
  streak: number;
  today_status: boolean;
  monthly_rate: number;
  proof_photos?: string[];
}

interface InfoState {
  patientData: PatientInfo | null; // For patients viewing their own data
  caretakerData: PatientInfo[] | null; // For caretakers viewing their patients' data
  loading: boolean;
  error: string | null;
}

const initialState: InfoState = {
  patientData: null,
  caretakerData: null,
  loading: false,
  error: null,
};
const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    fetchInfoStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientInfoSuccess(state, action: PayloadAction<PatientInfo>) {
      state.patientData = action.payload;
      state.caretakerData = null;
      state.loading = false;
    },
    fetchCaretakerInfoSuccess(state, action: PayloadAction<PatientInfo[]>) {
      state.caretakerData = action.payload;
      state.patientData = null;
      state.loading = false;
    },
    fetchInfoFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updatePatientInfo(state, action: PayloadAction<Partial<PatientInfo>>) {
      if (state.patientData) {
        state.patientData = { ...state.patientData, ...action.payload };
      }
    },
    clearInfo(state) {
      state.patientData = null;
      state.caretakerData = null;
      state.error = null;
    },
  },
});

export const {
  fetchInfoStart,
  fetchPatientInfoSuccess,
  fetchCaretakerInfoSuccess,
  fetchInfoFailure,
  updatePatientInfo,
  clearInfo,
} = infoSlice.actions;

export default infoSlice.reducer;

// Thunk to fetch info data
export const fetchUserInfo =
  (userId: string, role: "patient" | "caretaker"): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchInfoStart());

      if (role === "patient") {
        // Patient fetching their own info
        const { data, error } = await supabase
          .from("info")
          .select("*")
          .eq("patient_id", userId)
          .single();

        if (error) throw error;

        if (data) {
          dispatch(fetchPatientInfoSuccess(data));
        } else {
          // Create initial info record if doesn't exist
          const { data: newData, error: createError } = await supabase
            .from("info")
            .insert([{ patient_id: userId }])
            .select()
            .single();

          if (createError) throw createError;
          dispatch(fetchPatientInfoSuccess(newData));
        }
      } else {
        // Caretaker fetching all their patients' info
        const { data, error } = await supabase
          .from("info")
          .select("*")
          .eq("caretaker_id", userId);

        if (error) throw error;

        dispatch(fetchCaretakerInfoSuccess(data || []));
      }
    } catch (err) {
      dispatch(
        fetchInfoFailure(
          err instanceof Error ? err.message : "Failed to fetch info data"
        )
      );
    }
  };
