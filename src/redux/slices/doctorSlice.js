import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    doctor: null,
    doctors: [],
    isError: null
}

const DoctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        doctorStart: (state) => {
            state.isLoading = true;
        },
        doctorSuccess: (state, action) => {
            state.isLoading = false;
            if (action.payload.type === "one") {
                state.doctor = action.payload?.data;
            }
            else if (action.payload.type === "more") {
                state.doctors = action.payload?.data;
            }
        },
        doctorFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    doctorStart,
    doctorSuccess,
    doctorFailure,
} = DoctorSlice.actions;
export default DoctorSlice.reducer;