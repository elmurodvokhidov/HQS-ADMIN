import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import { symptomFailure, symptomStart, symptomSuccess } from "../../redux/slices/symptomSlice";
import { patientFailure, patientStart, patientSuccess } from "../../redux/slices/patientSlice";
import { Toast } from "../../config/sweetToast";
import * as XLSX from 'xlsx';
import { FaPlus } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import PatientModal from "./PatientModal";
import DeleteModal from "../../components/DeleteModal";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";

const Patients = () => {
    const { patients, isLoading } = useSelector(state => state.patient);
    const { symptoms } = useSelector(state => state.symptom);
    const dispatch = useDispatch();
    const [copied, setCopied] = useState("");
    const [modal, setModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [newPatient, setNewPatient] = useState({
        fullname: "",
        phoneNumber: "",
        symptom: "",
        doctor: "",
    });

    const getAllPatientFunction = async () => {
        try {
            dispatch(patientStart());
            const { data } = await AuthService.getAllPatient();
            dispatch(patientSuccess({ data: data.data, type: "more" }));
        } catch (error) {
            dispatch(patientFailure(error.message));
            console.log(error.message);
        }
    };

    const getAllSymptomFunction = async () => {
        try {
            dispatch(symptomStart());
            const { data } = await AuthService.getAllSymptom();
            dispatch(symptomSuccess({ data: data.data, type: "more" }));
        } catch (error) {
            dispatch(symptomFailure(error.message));
            console.log(error.message);
        }
    };

    useEffect(() => {
        getAllPatientFunction();
        getAllSymptomFunction();
    }, []);

    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

    const clearAndClose = () => {
        setNewPatient({
            fullname: "",
            phoneNumber: "",
            symptom: "",
            doctor: "",
        });
        setModal(false);
        setIsUpdate(false);
    };

    const openUpdateModal = (patient) => {
        setNewPatient({ ...patient, symptom: patient?.symptom?._id, doctor: patient?.doctor?._id });
        setIsUpdate(true);
        setModal(true);
    };

    const handleDelete = async () => {
        try {
            const { data } = await AuthService.deletePatient(isDelete);
            getAllPatientFunction();
            setIsDelete(null);
            Toast.fire({ icon: "success", title: data?.message });
        } catch (error) {
            console.log(error);
        }
    };

    const exportToExcel = () => {
        const fileName = 'patients.xlsx';
        const header = ['Ism (FIO)', 'Telefon', 'Kasallik turi', 'Shifokor'];

        const wb = XLSX.utils.book_new();
        const data = patients.map(patient => [
            patient.fullname || '',
            (patient.phoneNumber || '').toString(),
            patient?.symptom?.name || '',
            patient?.doctor?.fullname || '',
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Patients');
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl">Bemorlar ro'yhati</h1>
                <button onClick={() => setModal(true)} className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                    Yangi qo'shish <FaPlus />
                </button>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Bemor ismi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Telefon raqami
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kasallik turi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Shifokor
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amallar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {isLoading ? <tr><td className="py-12 text-center text-lg odd:bg-white even:bg-gray-50" colSpan={10}>Yuklanmoqda...</td></tr> : <> */}
                        {patients?.length > 0 ?
                            patients.map(patient => (
                                <tr key={patient._id} className={`${patient?.seen && 'text-gray-300'} odd:bg-white even:bg-gray-50 border-b`}>
                                    <th scope="row" className={`${patient?.seen ? 'text-gray-300' : 'text-gray-900'} px-6 py-4 font-medium whitespace-nowrap`}>
                                        {patient?.fullname}
                                    </th>
                                    <td onClick={() => handleCopy(patient?.phoneNumber)} className={`${patient?.seen ? 'text-gray-300' : 'text-blue-600'} px-6 py-4 flex items-center gap-1 cursor-pointer`}>
                                        {patient?.phoneNumber}
                                        <img
                                            src={copied === patient?.phoneNumber ? tick : copy}
                                            alt="copy svg"
                                            className="cursor-pointer" />
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient?.symptom?.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient?.doctor?.fullname}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openUpdateModal(patient)}
                                                className="font-medium text-blue-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => setIsDelete(patient._id)}
                                                className="font-medium text-red-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                O'chirish
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            <tr><td className="py-12 text-center text-lg odd:bg-white even:bg-gray-50" colSpan={10}>Bemor mavjud emas</td></tr>}
                        {/* </>} */}
                    </tbody>
                </table>
            </div>

            {
                !isLoading &&
                <button
                    onClick={exportToExcel}
                    id="downloadExelBtn"
                    className="size-8 pc:size-10 relative float-end flex items-center justify-center ml-8 mt-8 text-gray-400 border border-gray-300 outline-cyan-600 text-xl pc:text-2xl rounded-full hover:text-cyan-600 hover:bg-blue-100 transition-all">
                    <MdFileDownload />
                </button>
            }

            <PatientModal
                symptoms={symptoms}
                isLoading={isLoading}
                isUpdate={isUpdate}
                modal={modal}
                newPatient={newPatient}
                setNewPatient={setNewPatient}
                clearAndClose={clearAndClose}
                getAllPatientFunction={getAllPatientFunction}
            />

            <DeleteModal
                isDelete={isDelete}
                setIsDelete={setIsDelete}
                handleDelete={handleDelete}
            />
        </div >
    )
}

export default Patients