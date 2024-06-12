import { useDispatch } from "react-redux";
import AuthService from "../../config/authService";
import { Toast } from "../../config/sweetToast";
import { patientFailure, patientStart } from "../../redux/slices/patientSlice";

const PatientModal = ({
    symptoms,
    isLoading,
    isUpdate,
    modal,
    newPatient,
    setNewPatient,
    clearAndClose,
    getAllPatientFunction,
}) => {
    const dispatch = useDispatch();

    const getPatientCred = (e) => {
        setNewPatient({
            ...newPatient,
            [e.target.name]: e.target.value
        });
    };

    const createAndUpdateFunction = async () => {
        if (newPatient.fullname !== "" && newPatient.phoneNumber !== "" && newPatient.symptom !== "" && newPatient.password !== "") {
            try {
                dispatch(patientStart());
                if (!newPatient._id) {
                    await AuthService.registerPatient(newPatient);
                    Toast.fire({ icon: "success", title: "Yangi bemor qo'shildi" });
                }
                else {
                    const { _id, __v, createdAt, updatedAt, patients, ...others } = newPatient;
                    await AuthService.updatePatient(newPatient._id, others);
                    Toast.fire({ icon: "success", title: "Bemor ma'lumotlari o'zgardi" });
                }
                clearAndClose();
                getAllPatientFunction();
            } catch (error) {
                dispatch(patientFailure());
            }
        }
        else {
            Toast.fire({ icon: "warning", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
        }
    };

    return (
        <div onClick={clearAndClose} className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full backdrop-blur-sm" style={{ display: modal ? "flex" : "none" }}>
            <div onClick={(e) => e.stopPropagation()} className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Bemor ma'lumotlari
                        </h3>
                        <button onClick={clearAndClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4">
                            <div>
                                <label
                                    htmlFor="fullname"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    <span>Ismi (FIO)</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    onChange={getPatientCred}
                                    value={newPatient.fullname}
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    required
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 pc:text-lg">
                                    <span>Telefon raqami</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <div className="flex">
                                    <label htmlFor="phoneNumber" className="text-sm border border-r-0 rounded-l-lg border-gray-300 p-2.5">+998</label>
                                    <input
                                        onChange={getPatientCred}
                                        value={newPatient.phoneNumber}
                                        type="number"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        className="w-full block border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm rounded-l-none p-2.5 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="symptom"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    <span>Kasallik turi</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <select onChange={getPatientCred} value={newPatient.symptom} name="symptom" id="symptom" required className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option value="" className="italic">None</option>
                                    {
                                        symptoms?.map(sym => (
                                            <option value={sym._id} key={sym._id}>{sym?.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="doctor"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    <span>Shifokorni tanglang</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <select onChange={getPatientCred} value={newPatient.doctor} name="doctor" id="doctor" required className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option value="" className="italic">None</option>
                                    {
                                        symptoms.find(sym => sym._id === newPatient.symptom)?.doctors?.map(doc => (
                                            <option value={doc?._id} key={doc?._id}>{doc?.fullname}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button onClick={createAndUpdateFunction} type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isLoading ? "Loading..." : isUpdate ? "Saqlash" : "Qo'shish"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientModal