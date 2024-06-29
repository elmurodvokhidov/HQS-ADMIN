import { useDispatch, useSelector } from "react-redux";
import { symptomFailure, symptomStart, symptomSuccess } from "../redux/slices/symptomSlice";
import service from "../config/service";
import React, { useEffect, useState } from "react";
// import PolarAreaChart from "./PolarAreaChart";
import { MdFileDownload } from "react-icons/md";
import * as XLSX from 'xlsx';

const Reports = () => {
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

    let totalPatients = [];
    let totalPayment = 0;

    filteredSymptoms?.forEach(symptom => {
        totalPatients.push(symptom?.patients);
        totalPayment += symptom?.patients?.reduce((sum, patient) => sum + patient?.amount, 0);
    });

    const exportToExcel = (filteredSymptoms, totalPatients, totalPayment, groupedPatients) => {
        const fileName = 'reports.xlsx';

        // Prepare data based on the table structure
        const header1 = ["Umumiy kelgan bemorlar soni", "", "To'lov so'mmasi (so'mda)", "Shundan"];
        const header2 = ["", "", "", ...filteredSymptoms.map(symptom => symptom.name)];
        const header3 = ["", "", "", ...filteredSymptoms.map(() => ["soni", "so'mmasi"]).flat()];

        // Add the totals row
        const totalsRow = [
            "Jami",
            totalPatients,
            totalPayment,
            ...filteredSymptoms.map(symptom => [
                symptom.patients.length || 0,
                symptom.patients.reduce((total, patient) => total + (patient.amount || 0), 0)
            ]).flat()
        ];

        // Add the grouped patients rows
        const groupedRows = Object.keys(groupedPatients).map(date => [
            date,
            groupedPatients[date].length,
            groupedPatients[date].reduce((sum, patient) => sum + (patient.amount || 0), 0),
            ...filteredSymptoms.map(symptom => [
                groupedPatients[date].filter(item => item.symptom._id === symptom._id).length,
                groupedPatients[date].filter(item => item.symptom._id === symptom._id)
                    .reduce((sum, patient) => sum + (patient.amount || 0), 0)
            ]).flat()
        ]);

        const data = [
            header1,
            header2,
            header3,
            totalsRow,
            ...groupedRows
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Merge cells for the headers
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 2, c: 1 } }, // Merge "Umumiy kelgan bemorlar soni"
            { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, // Merge "To'lov so'mmasi (so'mda)"
            { s: { r: 0, c: 3 }, e: { r: 0, c: 3 + (filteredSymptoms.length * 2) - 1 } }, // Merge "Shundan"
            ...filteredSymptoms.map((_, index) => (
                { s: { r: 1, c: 3 + (index * 2) }, e: { r: 1, c: 4 + (index * 2) } } // Merge each symptom name
            ))
        ];

        // Adjust column widths
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex] || "").length), 10) // Minimum width set to 10
        }));
        ws['!cols'] = columnWidths;

        // Apply bold borders
        const applyBoldBorder = (cell) => {
            if (!ws[cell]) ws[cell] = {};
            if (!ws[cell].s) ws[cell].s = {};
            ws[cell].s.border = {
                top: { style: "medium" },
                bottom: { style: "medium" },
                left: { style: "medium" },
                right: { style: "medium" }
            };
        };

        // Apply borders to all cells
        for (let R = 0; R < data.length; R++) {
            for (let C = 0; C < data[R].length; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                applyBoldBorder(cellAddress);
            }
        }

        XLSX.utils.book_append_sheet(wb, ws, 'Reports');
        XLSX.writeFile(wb, fileName);
    };

    const groupByDate = (patients) => {
        const groups = {};
        patients.forEach(patient => {
            const date = new Date(patient.createdAt);
            const key = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(patient);
        });
        return groups;
    };
    const groupedPatients = groupByDate(totalPatients.flat());

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl">Hisobotlar</h1>
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
                <table className="min-w-full bg-white border-2 border-gray-300">
                    <thead>
                        <tr>
                            <th rowSpan={3} colSpan={2} className="px-4 py-2 border-2">Umumiy kelgan bemorlar soni</th>
                            <th rowSpan={3} className="px-4 py-2 border-2">To'lov so'mmasi (so'mda)</th>
                            <th colSpan={filteredSymptoms?.length * 2} className="px-4 py-2 border-2">Shundan</th>
                        </tr>
                        <tr>
                            {filteredSymptoms?.map((detail, index) => (
                                <th key={index} className="px-4 py-2 border-2" colSpan="2">{detail?.name}</th>
                            ))}
                        </tr>
                        <tr>
                            {filteredSymptoms?.map((detail, index) => (
                                <React.Fragment key={`fragment-${index}`}>
                                    <th className="px-4 py-2 border-2">soni</th>
                                    <th className="px-4 py-2 border-2">so'mmasi</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-2">Jami</td>
                            <td className="px-4 py-2 border-2">{totalPatients.flat().length}</td>
                            <td className="px-4 py-2 border-2">{totalPayment?.toLocaleString()}</td>
                            {filteredSymptoms?.map((detail, index) => (
                                <React.Fragment key={`values-${index}`}>
                                    <td className="px-4 py-2 border-2">
                                        {detail?.patients?.length}
                                    </td>
                                    <td className="px-4 py-2 border-2">
                                        {detail?.patients?.reduce((total, patient) => total + patient?.amount, 0)?.toLocaleString()}
                                    </td>
                                </React.Fragment>
                            ))}
                        </tr>
                        {Object.keys(groupedPatients).map(date => (
                            <tr key={date}>
                                <td className="px-4 py-2 border-2">{date}</td>
                                <td className="px-4 py-2 border-2">{groupedPatients[date].length}</td>
                                <td className="px-4 py-2 border-2">{groupedPatients[date].reduce((sum, patient) => sum + patient?.amount, 0)?.toLocaleString()}</td>
                                {filteredSymptoms.map(symptom => (
                                    <React.Fragment key={symptom._id}>
                                        <td className="px-4 py-2 border-2">
                                            {groupedPatients[date].filter(item => item.symptom?._id === symptom._id).length}
                                        </td>
                                        <td className="px-4 py-2 border-2">
                                            {groupedPatients[date].filter(item => item.symptom?._id === symptom._id)?.reduce((sum, patient) => sum + patient?.amount, 0)?.toLocaleString()}
                                        </td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {
                !isLoading &&
                <button
                    onClick={() => exportToExcel(filteredSymptoms, totalPatients.flat().length, totalPayment, groupedPatients)}
                    id="downloadExelBtn"
                    className="size-8 pc:size-10 relative float-end flex items-center justify-center ml-8 mt-8 text-gray-400 border border-gray-300 outline-cyan-600 text-xl pc:text-2xl rounded-full hover:text-cyan-600 hover:bg-blue-100 transition-all">
                    <MdFileDownload />
                </button>
            }

            {/* {symptoms.length > 0 && <PolarAreaChart symptoms={filteredSymptoms} />} */}
        </div>
    )
}

export default Reports