import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import service from "../../config/service";
import { doctorSuccess } from "../../redux/slices/doctorSlice";
import { patientSuccess } from "../../redux/slices/patientSlice";
import SplineChart from "../../components/SplineChart";
import { BsPerson } from "react-icons/bs";
import { symptomSuccess } from "../../redux/slices/symptomSlice";
import { SlLayers } from "react-icons/sl";

const AdminDashboard = () => {
    const { doctors } = useSelector(state => state.doctor);
    const { patients } = useSelector(state => state.patient);
    const { symptoms } = useSelector(state => state.symptom);
    const dispatch = useDispatch();

    useEffect(() => {
        const getAllDoctorsFunction = async () => {
            const { data } = await service.getAllDoctor();
            dispatch(doctorSuccess({ data: data.data, type: "more" }));
        };
        const getAllPatientsFunction = async () => {
            const { data } = await service.getAllPatient();
            dispatch(patientSuccess({ data: data.data, type: "more" }));
        };
        const getAllSymptomsFunction = async () => {
            const { data } = await service.getAllSymptom();
            dispatch(symptomSuccess({ data: data.data, type: "more" }));
        };

        getAllDoctorsFunction();
        getAllPatientsFunction();
        getAllSymptomsFunction();
    }, []);

    return (
        <div className="container">
            <section className="w-full grid lg:grid-cols-6 sm:grid-cols-3 small:grid-cols-2 items-center justify-start gap-6">
                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <BsPerson className="sm:text-4xl small:text-2xl text-blue-700" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Shifokorlar</h1>
                    <h1 className="text-2xl text-blue-700 mt-3">{doctors ? doctors.length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <BsPerson className="sm:text-4xl small:text-2xl text-blue-700" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Faol Bemorlar</h1>
                    <h1 className="text-2xl text-blue-700 mt-3">{patients ? patients.filter(patient => !patient?.seen).length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <BsPerson className="sm:text-4xl small:text-2xl text-blue-700" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Arxiv Bemorlar</h1>
                    <h1 className="text-2xl text-blue-700 mt-3">{patients ? patients.filter(patient => patient?.seen).length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <SlLayers className="sm:text-4xl small:text-2xl text-blue-700" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Bo'limlar</h1>
                    <h1 className="text-2xl text-blue-700 mt-3">{symptoms ? symptoms.length : 0}</h1>
                </div>
            </section>

            <section className="my-8 shadow-smooth">
                {patients.length > 0 && <SplineChart data={patients} />}
            </section>
        </div>
    )
}

export default AdminDashboard