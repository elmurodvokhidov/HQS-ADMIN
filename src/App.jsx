import { Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getCookie } from "./config/cookiesService"
import AuthService from "./config/authService"
import { authSuccess } from "./redux/slices/authSlice"
import { getIdFromToken } from "./config/decodeJWT"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import Doctors from "./pages/doctors/Doctors"
import Patients from "./pages/patients/Patients"
import AdminProfile from "./pages/admin/AdminProfile"
import Symptoms from "./pages/symptoms/Symptoms"

const App = () => {
  const dispatch = useDispatch();
  const [modals, setModals] = useState({ sideModal: false });

  const handleModal = (modalName, value) => {
    setModals(prevState => ({ ...prevState, [modalName]: value }));
  };

  const closeAllModals = () => {
    setModals({ sideModal: false });
  };

  useEffect(() => {
    const token = getCookie("x-token");
    if (token) {
      async function getUser() {
        try {
          const { userId } = getIdFromToken(token);
          const { data } = await AuthService.getAdmin(userId);
          dispatch(authSuccess(data));
        } catch (error) {
          console.log(error);
        }
      };
      getUser();
    };
  }, []);

  return (
    <div className="app" onClick={closeAllModals}>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout modals={modals} handleModal={handleModal} closeAllModals={closeAllModals} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="patients" element={<Patients />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="symptoms" element={<Symptoms />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App