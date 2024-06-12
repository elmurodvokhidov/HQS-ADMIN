import api from "./api";
import { getCookie } from "./cookiesService";

// interceptor
api.interceptors.request.use((req) => {
    if (getCookie("x-token")) {
        req.headers.Authorization = getCookie("x-token")
    };
    return req;
});

const AuthService = {
    // admin
    async adminLogin(admin) {
        const res = api.post('/admin/login', admin);
        return res;
    },
    async getAdmin(id) {
        const res = api.get(`/admin/info/${id}`);
        return res;
    },

    // doctor
    async getDoctor(id) {
        const res = api.get(`/doctors/${id}`);
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
    async registerPatient(patient) {
        const res = api.post('/patients/register', patient);
        return res;
    },
    async getPatient(id) {
        const res = api.get(`/patients/${id}`);
        return res;
    },
    async getAllPatient() {
        const res = api.get('/patients');
        return res;
    },
    async markSeen(id) {
        const res = api.put(`/patients/${id}/seen`);
        return res;
    },
    async updatePatient(id, patient) {
        const res = api.put(`/patients/${id}`, patient);
        return res;
    },
    async deletePatient(id) {
        const res = api.delete(`/patients/${id}`);
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

export default AuthService;