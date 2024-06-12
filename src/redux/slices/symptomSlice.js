import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    symptom: null,
    symptoms: [],
    isError: null
}

const SymptomSlice = createSlice({
    name: "symptom",
    initialState,
    reducers: {
        symptomStart: (state) => {
            state.isLoading = true;
        },
        symptomSuccess: (state, action) => {
            state.isLoading = false;
            if (action.payload.type === "one") {
                state.symptom = action.payload?.data;
            }
            else if (action.payload.type === "more") {
                state.symptoms = action.payload?.data;
            }
        },
        symptomFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    symptomStart,
    symptomSuccess,
    symptomFailure,
} = SymptomSlice.actions;
export default SymptomSlice.reducer;