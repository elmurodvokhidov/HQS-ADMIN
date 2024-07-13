import { useRef } from "react";
import { Cross } from "../../assets/icons/Cross"
import ReactToPrint from "react-to-print";
import logo from "../../assets/images/logo.png"

const PrintModal = ({
    data,
    clearAndClose,
}) => {
    const receiptRef = useRef();

    function findIndex(arr, el) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]._id === el._id) {
                return i;
            }
        }
        return -1;
    }

    const queuePatients = data?.symptom?.patients?.filter(patient => !patient?.seen);
    const index = queuePatients && findIndex(queuePatients, data);
    const result = queuePatients?.slice(0, index)?.length;

    return (
        <div onClick={clearAndClose} className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full backdrop-blur-sm" style={{ display: data ? "flex" : "none" }}>
            <div onClick={(e) => e.stopPropagation()} className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Navbat ma'lumotlari
                        </h3>
                        <button onClick={clearAndClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <Cross />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-80 border border-gray-300 rounded-lg bg-white">
                            <center ref={receiptRef} className="text-center p-4">
                                <figure>
                                    <img
                                        className="size-40 mx-auto"
                                        src={logo}
                                        alt="logo"
                                    />
                                </figure>
                                <div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Ism (F.I.O)</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.fullname}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Telefon</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">998{data?.phoneNumber}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Tug'ilgan sana</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.dateOfBirth}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Jinsi</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.gender}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Sana</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{new Date(data?.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Bo'lim</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.symptom?.name}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Shifokor</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.doctor?.fullname}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Navbat raqami</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.queueNumber}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Sizdan avval navbatda</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{result}</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">Xizmat narxi</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.symptom?.price?.toLocaleString()} so'm</span>
                                    </div>
                                    <div className="w-full flex justify-between gap-2">
                                        <span className="text-gray-600">To'ladi</span>
                                        <div className="flex-grow border-b border-b-gray-600 border-dotted"></div>
                                        <span className="text-gray-900">{data?.amount?.toLocaleString()} so'm</span>
                                    </div>
                                </div>
                            </center>
                        </div>
                        <ReactToPrint
                            trigger={() => <button className="w-32 h-10 rounded-3xl bg-cyan-600">Chop etish</button>}
                            content={() => receiptRef.current}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintModal