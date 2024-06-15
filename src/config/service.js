import api from "./api";
import { getCookie } from "./cookiesService";

// interceptor
api.interceptors.request.use((req) => {
    if (getCookie("x-token")) {
        req.headers.Authorization = getCookie("x-token")
    };
    return req;
});

const service = {
    // admin
    async adminLogin(admin) {
        const res = api.post('/admin/login', admin);
        return res;
    },
    async getAdmin() {
        const res = api.get('/admin/info');
        return res;
    },

    // doctor
    async getDoctor(id) {
        const res = api.get(`/admin/doctors/${id}`);
        return res;
    },
    async getAllDoctor() {
        const res = api.get('/admin/doctors');
        return res;
    },
    async createDoctor(doctor) {
        const res = api.post('/admin/create-doctor', doctor);
        return res;
    },
    async updateDoctor(id, doctor) {
        const res = api.put(`/admin/doctors/${id}`, doctor);
        return res;
    },
    async deleteDoctor(id) {
        const res = api.delete(`/admin/doctors/${id}`);
        return res;
    },

    // patient
    async createPatient(patient) {
        const res = api.post('/admin/create-patient', patient);
        return res;
    },
    async getPatient(id) {
        const res = api.get(`/admin/patients/${id}`);
        return res;
    },
    async getAllPatient() {
        const res = api.get('/admin/patients');
        return res;
    },
    async markSeen(id) {
        const res = api.put(`/admin/patients/${id}/seen`);
        return res;
    },
    async updatePatient(id, patient) {
        const res = api.put(`/admin/patients/${id}`, patient);
        return res;
    },
    async deletePatient(id) {
        const res = api.delete(`/admin/patients/${id}`);
        return res;
    },
    async deleteManyPatients(list) {
        const res = api.delete('/admin/delete-many-patients', { data: { patientIds: list } });
        return res;
    },

    // symptom
    async getAllSymptom() {
        const res = api.get('/admin/symptoms');
        return res;
    },
    async getSymptom(id) {
        const res = api.get(`/admin/symptoms/${id}`);
        return res;
    },
    async createSymptom(symptom) {
        const res = api.post('/admin/create-symptom', symptom);
        return res;
    },
    async updateSymptom(id, symptom) {
        const res = api.put(`/admin/symptoms/${id}`, symptom);
        return res;
    },
    async deleteSymptom(id) {
        const res = api.delete(`/admin/symptoms/${id}`);
        return res;
    },
};

export default service;