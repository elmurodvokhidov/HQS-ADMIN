import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../../config/cookiesService";
import Navbar from "../../components/Navbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ modals, handleModal, closeAllModals }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token")) navigate("/");
    }, [navigate]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar
                modals={modals}
                handleModal={handleModal}
            />
            <div className="w-full flex">
                <AdminSidebar
                    modals={modals}
                    handleModal={handleModal}
                    closeAllModals={closeAllModals}
                />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout