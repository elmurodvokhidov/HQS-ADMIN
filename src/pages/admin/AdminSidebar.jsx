import { LuLayoutDashboard } from "react-icons/lu";
import { BsPerson } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { SlLayers } from "react-icons/sl";
import { LiaChartPieSolid } from "react-icons/lia";


function AdminSidebar({ modals, handleModal, closeAllModals }) {
    return (
        <div className={`sidebar md:static absolute z-10 ${modals.sideModal ? "left-0" : "-left-full"} h-screen pt-16 overflow-y-auto shadow-smooth transition-all bg-white`}>
            <div onClick={() => handleModal("settingsModal", false)}>
                <NavLink
                    to="/admin/dashboard"
                    onClick={closeAllModals}
                    className="cell relative text-gray-500 border-b-2 py-4 md:px-5 pc:px-6 small:px-4 flex flex-col items-center">
                    <LuLayoutDashboard className="pc:text-4xl 2xl:text-3xl text-2xl" />
                    <h1 className="pc:text-lg text-base">Dashboard</h1>
                </NavLink>

                <NavLink
                    to="doctors"
                    onClick={closeAllModals}
                    className="cell relative text-gray-500 border-b-2 py-4 md:px-5 pc:px-6 small:px-4 flex flex-col items-center">
                    <BsPerson className="pc:text-4xl 2xl:text-3xl text-2xl" />
                    <h1 className="pc:text-lg text-base">Shifokorlar</h1>
                </NavLink>

                <NavLink
                    to="patients"
                    onClick={closeAllModals}
                    className="cell relative text-gray-500 border-b-2 py-4 md:px-5 pc:px-6 small:px-4 flex flex-col items-center">
                    <BsPerson className="pc:text-4xl 2xl:text-3xl text-2xl" />
                    <h1 className="pc:text-lg text-base">Bemorlar</h1>
                </NavLink>

                <NavLink
                    to="symptoms"
                    onClick={closeAllModals}
                    className="cell relative text-gray-500 border-b-2 py-4 md:px-5 pc:px-6 small:px-4 flex flex-col items-center">
                    <SlLayers className="pc:text-4xl 2xl:text-3xl text-2xl" />
                    <h1 className="pc:text-lg text-base">Bo'limlar</h1>
                </NavLink>

                <NavLink
                    to="reports"
                    onClick={closeAllModals}
                    className="cell relative text-gray-500 border-b-2 py-4 md:px-6 small:px-4 flex flex-col items-center">
                    <LiaChartPieSolid className="pc:text-4xl 2xl:text-3xl text-2xl" />
                    <h1 className="pc:text-lg text-base">Hisobotlar</h1>
                </NavLink>
            </div>
        </div>
    )
}

export default AdminSidebar