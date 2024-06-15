import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import service from "../../config/service";
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
import Pagination from "../../components/Pagination";

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
    const [checkedPatientsList, setCheckedPatientsList] = useState([]);
    const [limit, setLimit] = useState(30);
    const [page, setPage] = useState(1);

    const getAllPatientFunction = async () => {
        try {
            dispatch(patientStart());
            const { data } = await service.getAllPatient();
            dispatch(patientSuccess({ data: data.data, type: "more" }));
        } catch (error) {
            dispatch(patientFailure(error.message));
            console.log(error.message);
        }
    };

    const getAllSymptomFunction = async () => {
        try {
            dispatch(symptomStart());
            const { data } = await service.getAllSymptom();
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
            const { data } = await service.deletePatient(isDelete);
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

    const settingDeletionPatients = (id) => {
        // Agar berilgan id allaqachon ro'yhatda bo'lsa, u holda uni ro'yhatda o'chirish
        if (checkedPatientsList.includes(id)) {
            setCheckedPatientsList(prevList => prevList.filter(patientId => patientId !== id));
        } else {
            // Agar berilgan id ro'yhatda bo'lmasa, u holda uni ro'yhatga qo'shish
            setCheckedPatientsList(prevList => [...prevList, id]);
        }
    };

    const openManyDeleteModal = () => {
        if (patients?.length > 0) {
            if (checkedPatientsList.length > 0) { setIsDelete(true); }
            else { Toast.fire({ icon: "warning", title: "O'chirish uchun bemor tanlanmadi!" }); }
        }
        else { Toast.fire({ icon: "warning", title: "Bemor mavjud emas!" }); }
    };

    const deleteManyPatientsFunction = async () => {
        try {
            dispatch(patientStart());
            const { data } = await service.deleteManyPatients(checkedPatientsList);
            getAllPatientFunction();
            setIsDelete(null);
            Toast.fire({ icon: "success", title: data?.message });
        } catch (error) {
            dispatch(patientFailure(error.response?.data.message));
            ToastLeft.fire({ icon: "error", title: error.response?.data?.message || error.message });
        }
    };

    const indexOfLastPatient = page * limit;
    const indexOfFirstPatient = indexOfLastPatient - limit;
    const pagePatients = patients?.slice(indexOfFirstPatient, indexOfLastPatient);

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
                                <input
                                    disabled={patients?.length === 0}
                                    checked={patients?.length > 0 && patients?.every(patient => checkedPatientsList.includes(patient._id))}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            // Agar input belgilansa, barcha idlarni ro'yxatga saqlash
                                            setCheckedPatientsList(patients?.map(patient => patient._id));
                                        } else {
                                            // Agar input belgilanmagan bo'lsa, ro'yxatni tozalash
                                            setCheckedPatientsList([]);
                                        }
                                    }}
                                    type="checkbox"
                                    className="align-middle"
                                />
                            </th>
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
                                Navbat raqami
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amallar
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <button onClick={openManyDeleteModal} className="size-6 pc:size-8 flex items-center justify-center text-sm pc:text-base border rounded-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                    </svg>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {isLoading ? <tr><td className="py-12 text-center text-lg odd:bg-white even:bg-gray-50" colSpan={10}>Yuklanmoqda...</td></tr> : <> */}
                        {pagePatients?.length > 0 ?
                            pagePatients.map(patient => (
                                <tr key={patient._id} className={`${patient?.seen && 'text-gray-300'} odd:bg-white even:bg-gray-50 border-b`}>
                                    <td scope="row" className="px-6 py-4">
                                        <input
                                            checked={checkedPatientsList.includes(patient._id)}
                                            onChange={() => settingDeletionPatients(patient._id)}
                                            type="checkbox"
                                            className="align-middle"
                                        />
                                    </td>
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
                                    <td className="px-6 py-4 font-semibold">
                                        {patient?.queueNumber}
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
                <Pagination
                    data={patients}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    exportToExcel={exportToExcel}
                />
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
                handleDelete={checkedPatientsList.length > 0 ? deleteManyPatientsFunction : handleDelete}
            />
        </div >
    )
}

export default Patients