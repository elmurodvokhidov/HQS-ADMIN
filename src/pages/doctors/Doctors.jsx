import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doctorFailure, doctorStart, doctorSuccess } from "../../redux/slices/doctorSlice";
import service from "../../config/service";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import { FaPlus } from "react-icons/fa";
import { symptomFailure, symptomStart, symptomSuccess } from "../../redux/slices/symptomSlice";
import DoctorModal from "./DoctorModal";
import DeleteModal from "../../components/DeleteModal";
import { Toast } from "../../config/sweetToast";
import * as XLSX from 'xlsx';
import { MdFileDownload, MdOutlinePrint } from "react-icons/md";
import { Basket } from "../../assets/icons/Basket";
import { Pencil } from "../../assets/icons/Pencil";

const Doctors = () => {
    const { doctors, isLoading } = useSelector(state => state.doctor);
    const { symptoms } = useSelector(state => state.symptom);
    const dispatch = useDispatch();
    const [copied, setCopied] = useState("");
    const [modal, setModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        fullname: "",
        phoneNumber: "",
        specialty: "",
        password: "",
    });

    const getAllDoctorsFunction = async () => {
        try {
            dispatch(doctorStart());
            const { data } = await service.getAllDoctor();
            dispatch(doctorSuccess({ data: data.data, type: "more" }));
        } catch (error) {
            dispatch(doctorFailure(error.message));
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
        getAllDoctorsFunction();
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
        setNewDoctor({
            fullname: "",
            phoneNumber: "",
            specialty: "",
            password: "",
        });
        setModal(false);
        setIsUpdate(false);
    };

    const openUpdateModal = (doctor) => {
        setNewDoctor({ ...doctor, specialty: doctor?.specialty?._id });
        setIsUpdate(true);
        setModal(true);
    };

    const handleDelete = async () => {
        try {
            const { data } = await service.deleteDoctor(isDelete);
            getAllDoctorsFunction();
            setIsDelete(null);
            Toast.fire({ icon: "success", title: data?.message });
        } catch (error) {
            console.log(error);
        }
    };

    const exportToExcel = () => {
        const fileName = 'doctors.xlsx';
        const header = ['Ism (FIO)', 'Telefon', 'Mutaxasisligi', 'Bemorlar soni'];

        const wb = XLSX.utils.book_new();
        const data = doctors.map(doctor => [
            doctor.fullname || '',
            (doctor.phoneNumber || '').toString(),
            doctor?.specialty?.name || '',
            (doctor?.patients?.length || '0').toString(),
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Doctors');
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl">Shifokorlar ro'yhati</h1>
                <button onClick={() => setModal(true)} className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                    Yangi qo'shish <FaPlus />
                </button>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Shifokor ismi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Telefon raqami
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Mutaxasisligi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Bemorlar soni
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amallar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {isLoading ? <tr><td className="py-12 text-center text-lg odd:bg-white even:bg-gray-50" colSpan={10}>Yuklanmoqda...</td></tr> : <> */}
                        {doctors?.length > 0 ?
                            doctors.map(doctor => (
                                <tr key={doctor._id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {doctor?.fullname}
                                    </th>
                                    <td onClick={() => handleCopy(doctor?.phoneNumber)} className="px-6 py-4 text-blue-600 flex items-center gap-1 cursor-pointer">
                                        {doctor?.phoneNumber}
                                        <img
                                            src={copied === doctor?.phoneNumber ? tick : copy}
                                            alt="copy svg"
                                            className="cursor-pointer" />
                                    </td>
                                    <td className="px-6 py-4">
                                        {doctor?.specialty?.name}
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {doctor?.patients?.length}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openUpdateModal(doctor)}
                                                className="font-medium text-blue-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                <Pencil />
                                            </button>
                                            <button
                                                onClick={() => setIsDelete(doctor._id)}
                                                className="font-medium text-red-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                <Basket />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            <tr><td className="py-12 text-center text-lg odd:bg-white even:bg-gray-50" colSpan={10}>Shifokor mavjud emas</td></tr>}
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

            <DoctorModal
                symptoms={symptoms}
                isLoading={isLoading}
                isUpdate={isUpdate}
                modal={modal}
                newDoctor={newDoctor}
                setNewDoctor={setNewDoctor}
                clearAndClose={clearAndClose}
                getAllDoctorsFunction={getAllDoctorsFunction}
            />

            <DeleteModal
                isDelete={isDelete}
                setIsDelete={setIsDelete}
                handleDelete={handleDelete}
            />
        </div>
    )
}

export default Doctors