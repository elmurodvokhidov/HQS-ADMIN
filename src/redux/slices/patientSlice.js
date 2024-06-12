import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    patient: null,
    patients: [],
    isError: null
}

const PatientSlice = createSlice({
    name: "patient",
    initialState,
    reducers: {
        patientStart: (state) => {
            state.isLoading = true;
        },
        patientSuccess: (state, action) => {
            state.isLoading = false;
            if (action.payload.type === "one") {
                state.patient = action.payload?.data;
            }
            else if (action.payload.type === "more") {
                state.patients = action.payload?.data;
            }
        },
        patientFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    patientStart,
    patientSuccess,
    patientFailure,
} = PatientSlice.actions;
export default PatientSlice.reducer;