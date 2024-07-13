import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from 'xlsx';
import { symptomFailure, symptomStart, symptomSuccess } from "../../redux/slices/symptomSlice";
import service from "../../config/service";
import { Toast } from "../../config/sweetToast";
import { MdFileDownload } from "react-icons/md";
import SymptomModal from "./SymptomModal";
import DeleteModal from "../../components/DeleteModal";
import { Pencil } from "../../assets/icons/Pencil";
import { Basket } from "../../assets/icons/Basket";
import { GlobalButton } from "../../components/GlobalButton";

const Symptoms = () => {
    const { symptoms, isLoading } = useSelector(state => state.symptom);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [newSymptom, setNewSymptom] = useState({
        name: "",
        price: "",
    });

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
        getAllSymptomFunction();
    }, []);

    const clearAndClose = () => {
        setNewSymptom({
            name: "",
            price: "",
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
            const { data } = await service.deleteSymptom(isDelete);
            getAllSymptomFunction();
            setIsDelete(null);
            Toast.fire({ icon: "success", title: data?.message });
        } catch (error) {
            console.log(error);
        }
    };

    const exportToExcel = () => {
        const fileName = 'symptoms.xlsx';
        const header = ['Nomi', 'Narxi', 'Shifokorlar soni', 'Bemorlar soni'];

        const wb = XLSX.utils.book_new();
        const data = symptoms.map(symptom => [
            symptom.name || '',
            (symptom?.price || '0').toString(),
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
                <div className="flex flex-col justify-start text-sm pc:text-base">
                    <h1 className="text-xl pc:text-2xl">Bo'limlar ro'yhati</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{symptoms?.length}</span></p>
                </div>
                <GlobalButton setModal={setModal} />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nomi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Narxi
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
                                        {symptom?.price?.toLocaleString()}
                                    </td>
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
                                                <Pencil />
                                            </button>
                                            <button
                                                onClick={() => setIsDelete(symptom._id)}
                                                className="font-medium text-red-600 hover:underline disabled:no-underline disabled:text-gray-300">
                                                <Basket />
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