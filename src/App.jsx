import { Route, Routes, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getCookie } from "./config/cookiesService"
import service from "./config/service"
import { authSuccess } from "./redux/slices/authSlice"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import Doctors from "./pages/doctors/Doctors"
import Patients from "./pages/patients/Patients"
import AdminProfile from "./pages/admin/AdminProfile"
import Symptoms from "./pages/symptoms/Symptoms"
import Reports from "./components/Reports"
import PatientsReports from "./pages/patients/PatientsReports"

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modals, setModals] = useState({ sideModal: false });

  const handleModal = (modalName, value) => {
    setModals(prevState => ({ ...prevState, [modalName]: value }));
  };

  const closeAllModals = () => {
    setModals({ sideModal: false });
  };

  useEffect(() => {
    if (getCookie("x-token")) {
      async function getUser() {
        try {
          const { data } = await service.getAdmin();
          dispatch(authSuccess(data));
        } catch (error) {
          console.log(error);
          navigate('/');
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
          <Route path="reports" element={<Reports />} />
          <Route path="patients-reports" element={<PatientsReports />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App