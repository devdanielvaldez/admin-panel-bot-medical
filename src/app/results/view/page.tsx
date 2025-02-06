'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
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
            const response = await axios.get("https://dra-daines-uduu3.ondigitalocean.app/api/results/all");
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
            <div>
                <div className="flex justify-end mb-6">
                    <button
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                        onClick={goToRegister}
                    >
                        + Registrar Resultado
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Filtrar por nombre"
                        value={filters.firstName}
                        onChange={handleFilterChange}
                        className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Filtrar por apellido"
                        value={filters.lastName}
                        onChange={handleFilterChange}
                        className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        name="testDate"
                        value={filters.testDate}
                        onChange={handleFilterChange}
                        className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="overflow-hidden rounded-lg shadow-md">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                                <th className="px-6 py-4 text-left text-lg font-semibold">Paciente</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Fecha de Resultado</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Tipo de Resultado</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentResults.map((result: any, index: any) => (
                                <tr
                                    key={result._id}
                                    className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                                        }`}
                                >
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                                        {result.patient.firstName} {result.patient.lastName}
                                    </td>
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                                        {formatDate(result.testDate)}
                                    </td>
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                                        {result.testName}
                                    </td>
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100 flex justify-center">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => openFile(result.result)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-500">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, filteredResults.length)} de{' '}
                        {filteredResults.length} resultados
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-gray-800 dark:text-gray-300">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>

    );
};

export default withAuth(ResultsTable);