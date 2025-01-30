'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BranchOfficeView = () => {
    const [branchList, setBranchList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/branch-office/list");
            const data = response.data;
            setBranchList(data.branchOffices);

            console.log(data);

        } catch (error) {
            console.error("Error fetching branch-office:", error);
        } finally {
            setLoading(false);
        }
    };

    const goToRegister = () => {
        router.push('/system-settings/branch-office/create');
    }

    const goToEdit = (id: string) => {
        router.push('/system-settings/branch-office/create?id=' + id);
    }

    useEffect(() => {
        fetchResults();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <DefaultLayout>
            <div>
                <div className="flex justify-end mb-6">
                    <button
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                        onClick={goToRegister}
                    >
                        + Registrar Consultorio
                    </button>
                </div>

                <div className="overflow-hidden rounded-lg shadow-md">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                                <th className="px-6 py-4 text-left text-lg font-semibold">Consultorio</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Telf.</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">WhatsApp</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {branchList.map((result: any, index: any) => (
                                <tr
                                    key={result._id}
                                    className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                                        }`}
                                >
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                                        {result.nameBranchOffice}
                                    </td>
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                                        {result.phone}
                                    </td>
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                                        {result.whatsApp}
                                    </td>
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                                        {result.email}
                                    </td>
                                    <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100 flex justify-center">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 ml-3"
                                            onClick={() => goToEdit(result._id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 ml-3"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {/* <div className="flex justify-between items-center mt-6">
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
                </div> */}
            </div>
        </DefaultLayout>

    );
};

export default withAuth(BranchOfficeView);