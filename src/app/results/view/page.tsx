'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Componente de la tabla de seguros
const ResultsTable = () => {
    const [resultsList, setResults] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [filteredResults, setFilteredResults] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        firstName: '',
        lastName: '',
        testDate: ''
    });
    const itemsPerPage = 5;

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3030/api/results/all");
            const data = response.data.data;
            setResults(data);
            setFilteredResults(data);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterResults = () => {
        let filtered = resultsList.filter((result: any) => {
            const matchFirstName = result.patient.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
            const matchLastName = result.patient.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
            const matchTestDate = !filters.testDate || formatDate(result.testDate) === formatDate(filters.testDate);
            return matchFirstName && matchLastName && matchTestDate;
        });
        setFilteredResults(filtered);
        setCurrentPage(1);
    };

    const goToRegister = () => {
        router.push('/results/create');
    }

    const formatDate = (date: string) => {
        return moment(date).format('DD-MM-YYYY');
    }

    const openFile = (url: string) => {
        window.open(url);
    }

    const handleFilterChange = (e: any) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);

    useEffect(() => {
        filterResults();
    }, [filters, resultsList]);

    useEffect(() => {
        fetchResults();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <DefaultLayout>
            <div className="space-y-4">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={goToRegister}
                >
                    + Registrar Resultado
                </button>

                {/* Filters */}
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Filtrar por nombre"
                        value={filters.firstName}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Filtrar por apellido"
                        value={filters.lastName}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="date"
                        name="testDate"
                        value={filters.testDate}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Paciente</th>
                                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Fecha de Resultado</th>
                                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Tipo de Resultado</th>
                                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentResults.map((result: any) => (
                                    <tr key={result._id}>
                                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {result.patient.firstName} {result.patient.lastName}
                                            </h5>
                                        </td>
                                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {formatDate(result.testDate)}
                                            </h5>
                                        </td>
                                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {result.testName}
                                            </h5>
                                        </td>
                                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                            <button onClick={() => openFile(result.result)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4 pb-4">
                        <div className="text-sm text-gray-500">
                            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredResults.length)} de {filteredResults.length} resultados
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="px-3 py-1">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ResultsTable;