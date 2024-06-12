import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from 'xlsx';
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import { symptomFailure, symptomStart, symptomSuccess } from "../../redux/slices/symptomSlice";
import AuthService from "../../config/authService";
import { Toast } from "../../config/sweetToast";
import { MdFileDownload } from "react-icons/md";
import SymptomModal from "./SymptomModal";
import DeleteModal from "../../components/DeleteModal";
import { FaPlus } from "react-icons/fa";

const Symptoms = () => {
    const { symptoms, isLoading } = useSelector(state => state.symptom);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [newSymptom, setNewSymptom] = useState({
        name: "",
    });

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
        getAllSymptomFunction();
    }, []);

    const clearAndClose = () => {
        setNewSymptom({
            name: "",
        });
        setModal(false);
        setIsUpdate(false);
    };

    const openUpdateModal = (symptom) => {
        setNewSymptom(symptom);
        setIsUpdate(true);
        setModal(true);
    };

    const handleDelete = async () => {
        try {
            const { data } = await AuthService.deleteSymptom(isDelete);
            getAllSymptomFunction();
            setIsDelete(null);
            Toast.fire({ icon: "success", title: data?.message });
        } catch (error) {
            console.log(error);
        }
    };

    const exportToExcel = () => {
        const fileName = 'symptoms.xlsx';
        const header = ['Nomi', 'Shifokorlar soni', 'Bemorlar soni'];

        const wb = XLSX.utils.book_new();
        const data = symptoms.map(symptom => [
            symptom.name || '',
            (symptom?.doctors?.length || '0').toString(),
            (symptom?.patients?.length || '0').toString(),
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Symptoms');
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl">Bo'limlar ro'yhati</h1>
                <button onClick={() => setModal(true)} className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                    Yangi qo'shish <FaPlus />
                </button>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nomi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Shifokorlar soni
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
                        {symptoms?.length > 0 ?
                            symptoms.map(symptom => (
                                <tr key={symptom._id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {symptom?.name}
                                    </th>
                                    <td className="px-6 py-4 font-bold">
                                        {symptom?.doctors?.length}
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {symptom?.patients?.length}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openUpdateModal(symptom)}
                                                className="font-medium text-blue-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => setIsDelete(symptom._id)}
                                                className="font-medium text-red-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                O'chirish
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            <tr><td className="py-12 text-center text-lg odd:bg-white even:bg-gray-50" colSpan={10}>Bo'lim mavjud emas</td></tr>}
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

            <SymptomModal
                symptoms={symptoms}
                isLoading={isLoading}
                isUpdate={isUpdate}
                modal={modal}
                newSymptom={newSymptom}
                setNewSymptom={setNewSymptom}
                clearAndClose={clearAndClose}
                getAllSymptomFunction={getAllSymptomFunction}
            />

            <DeleteModal
                isDelete={isDelete}
                setIsDelete={setIsDelete}
                handleDelete={handleDelete}
            />
        </div>
    )
}

export default Symptoms