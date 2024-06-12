import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoMenuOutline, IoPersonCircleOutline } from "react-icons/io5";
import LoaderDots from "./LoaderDots";
import { useState } from "react";
import { authLogout, authStart } from "../redux/slices/authSlice";
import logo from "../assets/images/logo.png";

function Navbar({ modals, handleModal }) {
    const { auth } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);

    const logoutHandler = () => {
        dispatch(authStart());
        dispatch(authLogout());
        navigate("/");
    };

    return (
        <div className="w-full fixed z-20 top-0 flex items-center justify-between py-2 px-10 shadow-dim bg-white">
            <Link to="dashboard" className="md:inline-block hidden small:size-10 md:size-12 pc:size-14 overflow-hidden rounded-full">
                <img className="size-full object-cover" crossOrigin="anonymous" src={logo} alt="company logo" />
            </Link>
            <IoMenuOutline
                onClick={(e) => {
                    e.stopPropagation();
                    handleModal("sideModal", !modals.sideModal);
                }}
                className="md:hidden text-3xl text-gray-500" />

            <div className="right flex relative items-center gap-4 text-gray-500">
                <button
                    onClick={() => setModal(!modal)}
                    className="flex items-center gap-2">
                    <span className="md:inline-block hidden text-base pc:text-lg text-black">{auth ? auth.fullname : <LoaderDots />}</span>
                    <figure className="size-8 pc:size-11 2xl:size-9 rounded-full overflow-hidden flex items-center justify-center">
                        <IoPersonCircleOutline className="w-full h-full text-gray-500" />
                    </figure>
                </button>
                {
                    modal &&
                    <div
                        onClick={() => setModal(false)}
                        className="fixed top-0 left-0 bottom-0 right-0">
                        <div className="w-40 flex flex-col items-start justify-start absolute z-10 sm:top-16 small:top-12 pc:top-20 right-10 text-black text-xs pc:text-sm rounded border border-gray-300 bg-white">
                            <Link
                                to="profile"
                                className="w-full p-4 border-b border-gray-300 hover:bg-gray-100">Hisob qaydnomasi</Link>
                            <button
                                onClick={logoutHandler}
                                className="w-full p-4 text-left hover:bg-gray-100">Chiqish</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar