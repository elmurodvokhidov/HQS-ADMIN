import { FaPlus } from "react-icons/fa"

export const GlobalButton = ({ setModal }) => {
    return (
        <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
        >
            Yangi qo'shish <FaPlus />
        </button>
    )
}
