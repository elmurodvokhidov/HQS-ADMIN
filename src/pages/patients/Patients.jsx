import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import service from "../../config/service";
import { symptomFailure, symptomStart, symptomSuccess } from "../../redux/slices/symptomSlice";
import { patientFailure, patientStart, patientSuccess } from "../../redux/slices/patientSlice";
import { Toast } from "../../config/sweetToast";
import * as XLSX from 'xlsx';
import { FaPlus, FaSearch } from "react-icons/fa";
import { MdOutlinePrint } from "react-icons/md";
import PatientModal from "./PatientModal";
import DeleteModal from "../../components/DeleteModal";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import Pagination from "../../components/Pagination";
import { Pencil } from "../../assets/icons/Pencil";
import { Basket } from "../../assets/icons/Basket";
import PrintModal from "./PrintModal";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { TbReportAnalytics } from "react-icons/tb";
import { GlobalButton } from "../../components/GlobalButton";

const Patients = () => {
    const { patients, isLoading } = useSelector(state => state.patient);
    const { symptoms } = useSelector(state => state.symptom);
    const dispatch = useDispatch();
    const [copied, setCopied] = useState("");
    const [modal, setModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [isPrint, setIsPrint] = useState(null);
    const [isArchive, setIsArchive] = useState(false);
    const [newPatient, setNewPatient] = useState({
        fullname: "",
        phoneNumber: "",
        symptom: "",
        doctor: "",
        dateOfBirth: "",
        gender: "",
        passport: "",
        email: "",
    });
    const [checkedPatientsList, setCheckedPatientsList] = useState([]);
    const [limit, setLimit] = useState(30);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

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
            dateOfBirth: "",
            gender: "",
            passport: "",
            email: "",
        });
        setModal(false);
        setIsUpdate(false);
        setIsPrint(null);
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
        const header = ['Ism (FIO)', 'Jinsi', 'Tug\'ilgan sanasi', 'Passport', 'Email manzili', 'Telefon', 'Navbat raqami', 'Kasallik turi', 'Shifokor', 'To\'ladi'];

        const wb = XLSX.utils.book_new();
        const data = searchedPatients.map(patient => [
            patient.fullname || '',
            patient.gender || '',
            patient.dateOfBirth || '',
            patient.passport || '',
            patient.email || '',
            (patient.phoneNumber || '').toString(),
            (patient.queueNumber || '').toString(),
            patient?.symptom?.name || '',
            patient?.doctor?.fullname || '',
            (patient.amount || '').toString(),
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

    const filteredPatients = patients?.filter(patient => patient?.seen === isArchive);
    const searchedPatients = filteredPatients?.filter(patient => patient?.fullname?.toLowerCase().includes(search.trim().toLowerCase()) || patient?.symptom?.name?.toLowerCase().includes(search.trim().toLowerCase()));
    const indexOfLastPatient = page * limit;
    const indexOfFirstPatient = indexOfLastPatient - limit;
    const pagePatients = searchedPatients?.slice(indexOfFirstPatient, indexOfLastPatient);

    const createAndUpdateFunction = async () => {
        if (newPatient.fullname !== "" && newPatient.phoneNumber !== "" && newPatient.symptom !== "" && newPatient.doctor !== "") {
            try {
                dispatch(patientStart());
                if (!newPatient._id) {
                    const foundSymptom = symptoms.find(symptom => symptom._id === newPatient.symptom);
                    const number = foundSymptom?.patients?.length;
                    const queueNumber = `${foundSymptom?.name?.split("")[0].toUpperCase()}${number}`;
                    const { data } = await service.createPatient({ ...newPatient, queueNumber });
                    Toast.fire({ icon: "success", title: "Yangi bemor qo'shildi" });
                    clearAndClose();
                    getAllPatientFunction();
                    setIsPrint(data.data);
                }
                else {
                    const { _id, __v, createdAt, updatedAt, patients, ...others } = newPatient;
                    await service.updatePatient(newPatient._id, others);
                    Toast.fire({ icon: "success", title: "Bemor ma'lumotlari o'zgardi" });
                    clearAndClose();
                    getAllPatientFunction();
                }
            } catch (error) {
                dispatch(patientFailure());
                Toast.fire({ icon: "error", title: error?.response?.data?.message || error.message });
            }
        }
        else {
            Toast.fire({ icon: "warning", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
        }
    };

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col justify-start text-sm pc:text-base">
                    <h1 className="text-xl pc:text-2xl">{isArchive ? "Arxivdagi bemorlar ro'yhati" : "Bemorlar ro'yhati"}</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{searchedPatients?.length}</span></p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-80 h-10 flex items-center rounded-xl px-4 pc:py-2 bg-gray-100">
                        <input
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Qidiruv"
                            className="w-full h-full ml-1 pc:text-lg text-base border-none focus:outline-none bg-transparent"
                        />
                        <FaSearch className="cursor-pointer text-base pc:text-lg text-gray-500 hover:text-blue-700" />
                    </div>
                    <GlobalButton setModal={setModal} />
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <input
                                    disabled={searchedPatients?.length === 0}
                                    checked={searchedPatients?.length > 0 && searchedPatients?.every(patient => checkedPatientsList.includes(patient._id))}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            // Agar input belgilansa, barcha idlarni ro'yxatga saqlash
                                            setCheckedPatientsList(searchedPatients?.map(patient => patient._id));
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
                                <div className="flex items-center gap-2">
                                    <button onClick={openManyDeleteModal} className="size-6 pc:size-8 flex items-center justify-center text-sm pc:text-base border rounded-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                                        <Basket />
                                    </button>
                                    <button onClick={() => setIsArchive(!isArchive)} className="size-6 pc:size-8 flex items-center justify-center text-base border rounded-full text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300">
                                        {isArchive ? <BiArchiveOut /> : <BiArchiveIn />}
                                    </button>
                                    <Link to={"/admin/patients-reports"} className="size-6 pc:size-8 flex items-center justify-center text-base border rounded-full text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                        <TbReportAnalytics />
                                    </Link>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {isLoading ? <tr><td className="py-12 text-center text-lg odd:bg-white even:bg-gray-50" colSpan={10}>Yuklanmoqda...</td></tr> : <> */}
                        {pagePatients?.length > 0 ?
                            pagePatients.map(patient => (
                                <tr key={patient._id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td scope="row" className="px-6 py-4">
                                        <input
                                            checked={checkedPatientsList.includes(patient._id)}
                                            onChange={() => settingDeletionPatients(patient._id)}
                                            type="checkbox"
                                            className="align-middle"
                                        />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                                        {patient?.fullname}
                                    </th>
                                    <td onClick={() => handleCopy(patient?.phoneNumber)} className="text-blue-600 px-6 py-4 flex items-center gap-1 cursor-pointer">
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
                                    <td colSpan={2} className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openUpdateModal(patient)}
                                                className="font-medium text-blue-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                <Pencil />
                                            </button>
                                            <button
                                                onClick={() => setIsDelete(patient._id)}
                                                className="font-medium text-red-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                <Basket />
                                            </button>
                                            <button
                                                onClick={() => setIsPrint(patient)}
                                                className="text-lg pc:text-xl text-green-500"
                                            >
                                                <MdOutlinePrint />
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
                    data={searchedPatients}
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
                createAndUpdateFunction={createAndUpdateFunction}
                patients={patients}
            />

            <DeleteModal
                isDelete={isDelete}
                setIsDelete={setIsDelete}
                handleDelete={checkedPatientsList.length > 0 ? deleteManyPatientsFunction : handleDelete}
            />

            <PrintModal
                data={isPrint}
                clearAndClose={clearAndClose}
            />
        </div >
    )
}

export default Patients