import { useDispatch } from "react-redux";
import { symptomStart } from "../../redux/slices/symptomSlice";
import service from "../../config/service";
import { Toast } from "../../config/sweetToast";
import { Cross } from "../../assets/icons/Cross";

const SymptomModal = ({
    isLoading,
    isUpdate,
    modal,
    newSymptom,
    setNewSymptom,
    clearAndClose,
    getAllSymptomFunction,
}) => {
    const dispatch = useDispatch();

    const getSymptomCred = (e) => {
        setNewSymptom({
            ...newSymptom,
            [e.target.name]: e.target.value
        });
    };

    const createAndUpdateFunction = async () => {
        if (newSymptom.name !== "") {
            try {
                dispatch(symptomStart());
                if (!newSymptom._id) {
                    await service.createSymptom(newSymptom);
                    Toast.fire({ icon: "success", title: "Yangi bo'lim qo'shildi" });
                }
                else {
                    const { _id, __v, createdAt, updatedAt, patients, doctors, ...others } = newSymptom;
                    await service.updateSymptom(newSymptom._id, others);
                    Toast.fire({ icon: "success", title: "Bo'lim ma'lumotlari o'zgardi" });
                }
                clearAndClose();
                getAllSymptomFunction();
            } catch (error) {
                dispatch(doctorFailure());
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
                            Yangi bo'lim
                        </h3>
                        <button onClick={clearAndClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <Cross />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    <span>Nomi</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    onChange={getSymptomCred}
                                    value={newSymptom.name}
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <div>
                                <label
                                    htmlFor="price"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    <span>Narxi</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    onChange={getSymptomCred}
                                    value={newSymptom.price}
                                    type="number"
                                    id="price"
                                    name="price"
                                    required
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <button onClick={createAndUpdateFunction} type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isLoading ? "Loading..." : isUpdate ? "Saqlash" : "Qo'shish"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SymptomModal