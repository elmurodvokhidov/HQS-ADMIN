import { useDispatch, useSelector } from "react-redux";
import { symptomFailure, symptomStart, symptomSuccess } from "../redux/slices/symptomSlice";
import service from "../config/service";
import React, { useEffect, useState } from "react";

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

    let totalPatients = 0;
    let totalPayment = 0;

    filteredSymptoms?.forEach(symptom => {
        totalPatients += symptom?.patients?.length;
        totalPayment += symptom?.patients?.reduce((sum, patient) => sum + patient?.amount, 0);
    });

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
                            <th rowSpan={3} className="px-4 py-2 border-2">Umumiy kelgan bemorlar soni</th>
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
                                    <th key={`count-${index}`} className="px-4 py-2 border-2">soni</th>
                                    <th key={`payment-${index}`} className="px-4 py-2 border-2">so'mmasi</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-2">{totalPatients}</td>
                            <td className="px-4 py-2 border-2">{totalPayment}</td>
                            {filteredSymptoms?.map((detail, index) => (
                                <React.Fragment key={`values-${index}`}>
                                    <td key={`count-value-${index}`} className="px-4 py-2 border-2">
                                        {detail?.patients?.length}
                                    </td>
                                    <td key={`payment-value-${index}`} className="px-4 py-2 border-2">
                                        {detail?.patients?.reduce((total, patient) => total + patient?.amount, 0)}
                                    </td>
                                </React.Fragment>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Reports