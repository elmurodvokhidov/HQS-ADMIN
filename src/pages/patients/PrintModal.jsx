import { useRef } from "react";
import { Cross } from "../../assets/icons/Cross"

const PrintModal = ({
    data,
    clearAndClose,
}) => {
    const receiptRef = useRef();

    const handlePrint = () => {
        const content = receiptRef.current.innerHTML;
        const printWindow = window.open('', '', 'width=900,height=650');
        printWindow.document.write(`
          <html>
            <head>
              <title>queue</title>
            </head>
            <body>
                ${content}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

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
                        <div ref={receiptRef} className="w-72 border border-gray-300 rounded-lg bg-white text-center p-4">
                            <center>
                                <h3 style={{ fontSize: '20px' }}>Sizning raqamingiz:</h3>
                                <h1 style={{ fontSize: '60px', fontWeight: '600' }}>{data?.queueNumber}</h1>
                                <h2 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Sizdan oldin navbatda: <span>{result}</span></h2>
                                <h6 style={{ fontSize: '15px' }}>Tanlangan xizmatlar:</h6>
                                <h2 style={{ fontSize: '25px', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>{data?.symptom?.name}</h2>
                                <h3 style={{ fontSize: '15px' }}>Kelgan vaqt: <span>{new Date(data?.createdAt).toLocaleString()}</span></h3>
                            </center>
                        </div>
                        <button onClick={handlePrint} className="w-32 h-10 rounded-3xl bg-cyan-600">Chop etish</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintModal