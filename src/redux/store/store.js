import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import symptomSlice from "../slices/symptomSlice";
import patientSlice from "../slices/patientSlice";
import doctorSlice from "../slices/doctorSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        symptom: symptomSlice,
        patient: patientSlice,
        doctor: doctorSlice,
    }
});