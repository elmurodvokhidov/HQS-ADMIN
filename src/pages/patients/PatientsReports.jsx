import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { symptomFailure, symptomStart, symptomSuccess } from "../../redux/slices/symptomSlice";
import service from "../../config/service";
import * as XLSX from 'xlsx';
import { MdFileDownload } from "react-icons/md";

const PatientsReports = () => {
    const { symptoms, isLoading } = useSelector(state => state.symptom);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        from: "",
        to: "",
    });

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const getAllSymptomFunction = async () => {
        try {
            dispatch(symptomStart());
            const { data } = await service.getAllSymptom();
            dispatch(symptomSuccess({ data: data.data, type: "more" }));
        } catch (error) {
            dispatch(symptomFailure(error.message));
            console.log(error.message);
        }
    };

    useEffect(() => {
        getAllSymptomFunction();
    }, []);

    const filteredSymptoms = symptoms?.map(symptom => {
        const filterFromDate = filters.from ? new Date(filters.from) : null;
        const filterToDate = filters.to ? new Date(filters.to) : null;

        const filteredPatients = symptom.patients?.filter(patient => {
            const patientDate = new Date(patient?.createdAt);

            if (filterFromDate && filterToDate) {
                return patientDate >= filterFromDate && patientDate <= filterToDate;
            } else if (filterFromDate) {
                return patientDate >= filterFromDate;
            } else if (filterToDate) {
                return patientDate <= filterToDate;
            }

            return true;
        });

        return {
            ...symptom,
            patients: filteredPatients,
        };
    });

    const groupBySymptom = () => {
        const groups = {};
        filteredSymptoms.forEach(symptom => {
            const key = symptom?.name;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key] = symptom?.patients;
        });
        return groups;
    };
    const groupedPatients = groupBySymptom();

    const exportToExcel = () => {
        const fileName = 'patients-reports.xlsx';
        const header = ['Kasallik turi', 'Shifokor ismi', 'Navbat raqami', 'To\'lov so\'mmasi (so\'mda)', 'Bemor ismi', 'Tug\'ilgan sanasi', 'Jinsi', 'Telefon raqami', 'Passport seriya raqami', 'Email manzili'];

        const wb = XLSX.utils.book_new();
        const data = [header];

        Object.keys(groupedPatients).forEach(symptom => {
            groupedPatients[symptom].forEach(patient => {
                data.push([
                    patient.symptom.name || '',
                    patient.doctor.fullname || '',
                    (patient.queueNumber || '').toString(),
                    (patient.symptom.price || '').toString(),
                    patient.fullname || '',
                    patient.dateOfBirth || '',
                    patient.gender || '',
                    (patient.phoneNumber || '').toString(),
                    patient.passport || '',
                    patient.email || '',
                ]);
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Patients Reports');
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl">Barcha bemorlar hisoboti</h1>
                <div className="flex gap-4">
                    {/* Start Date */}
                    <div className="relative text-gray-500">
                        <label
                            htmlFor="from"
                            className="absolute text-xs pc:text-base bg-[#f8f8f8] -top-1.5 pc:-top-3 left-3">
                            <span>Boshlanish</span>
                        </label>
                        <input
                            value={filters.from}
                            onChange={handleFilterChange}
                            type="date"
                            name="from"
                            id="from"
                            className="w-full p-1.5 text-sm pc:text-base rounded border outline-blue-700 bg-[#f8f8f8]" />
                    </div>

                    {/* End Date */}
                    <div className="relative text-gray-500">
                        <label
                            htmlFor="to"
                            className="absolute text-xs pc:text-base bg-[#f8f8f8] -top-1.5 pc:-top-3 left-3">
                            <span>Tugash</span>
                        </label>
                        <input
                            value={filters.to}
                            onChange={handleFilterChange}
                            type="date"
                            name="to"
                            id="to"
                            className="w-full p-1.5 text-sm pc:text-base rounded border outline-blue-700 bg-[#f8f8f8]" />
                    </div>

                    <button
                        onClick={() => setFilters({ from: "", to: "" })}
                        className="border rounded p-2 text-sm pc:text-base text-gray-700 bg-[#f8f8f8] hover:bg-gray-100 hover:text-gray-500 transition-all"
                    >
                        Filterni tiklash
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm pc:text-lg bg-white border-2 border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-2">Kasallik turi</th>
                            <th className="px-4 py-2 border-2">Shifokor ismi</th>
                            <th className="px-4 py-2 border-2">Navbat raqami</th>
                            <th className="px-4 py-2 border-2">To'lov so'mmasi (so'mda)</th>
                            <th className="px-4 py-2 border-2">Bemor ismi</th>
                            <th className="px-4 py-2 border-2">Tug'ilgan sanasi</th>
                            <th className="px-4 py-2 border-2">Jinsi</th>
                            <th className="px-4 py-2 border-2">Telefon raqami</th>
                            <th className="px-4 py-2 border-2">Passport seriya raqami</th>
                            <th className="px-4 py-2 border-2">Email manzili</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedPatients).map(symptom => {
                            return groupedPatients[symptom].map(patient => (
                                <tr key={patient?._id}>
                                    <td className="px-4 py-2 border-2">{patient?.symptom?.name}</td>
                                    <td className="px-4 py-2 border-2">{patient?.doctor?.fullname}</td>
                                    <td className="px-4 py-2 border-2">{patient?.queueNumber}</td>
                                    <td className="px-4 py-2 border-2">{patient?.symptom?.price?.toLocaleString()}</td>
                                    <td className="px-4 py-2 border-2">{patient?.fullname}</td>
                                    <td className="px-4 py-2 border-2">{patient?.dateOfBirth?.slice(0, 10)}</td>
                                    <td className="px-4 py-2 border-2">{patient?.gender}</td>
                                    <td className="px-4 py-2 border-2">{patient?.phoneNumber}</td>
                                    <td className="px-4 py-2 border-2">{patient?.passport}</td>
                                    <td className="px-4 py-2 border-2">{patient?.email}</td>
                                </tr>
                            ))
                        })}
                    </tbody>
                </table>
            </div>

            {
                !isLoading &&
                <button
                    onClick={() => exportToExcel()}
                    id="downloadExelBtn"
                    className="size-8 pc:size-10 relative float-end flex items-center justify-center ml-8 mt-8 text-gray-400 border border-gray-300 outline-cyan-600 text-xl pc:text-2xl rounded-full hover:text-cyan-600 hover:bg-blue-100 transition-all">
                    <MdFileDownload />
                </button>
            }

            {/* {symptoms.length > 0 && <PolarAreaChart symptoms={filteredSymptoms} />} */}
        </div>
    )
}

export default PatientsReports