'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PatientsAllPage = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('https://dra-daines-uduu3.ondigitalocean.app/api/patient/find/all', {
                    headers: {
                        'branchid': localStorage.getItem('selectedBranch')
                    }
                });
                setPatients(response.data.data);
                setFilteredPatients(response.data.data);
            } catch (err) {
                console.error("Error fetching patients:", err);
            }
        };

        fetchPatients();
    }, []);

    const returnAge = (date: string) => {
        return moment().diff(moment(date, ["YYYY-MM-DD", "DD-MM-YYYY"]), 'years');

    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredPatients(
            patients.filter((patient) =>
                `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(value)
            )
        );
        setCurrentPage(1);
    };

    const goToHistoryClinical = (id: string) => {
        router
            .push('/clinicalHistory/create?id=' + id);
    }

    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    return (
        <DefaultLayout>
            <div>
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Buscar paciente por nombre..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full max-w-lg px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <thead className="bg-indigo-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Edad</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Teléfono</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">WhatsApp</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPatients.map((patient) => (
                                <tr
                                    key={patient._id}
                                    className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                >
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                                        {patient.firstName} {patient.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                                        {returnAge(patient.bornDate)} años
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                                        {patient.phoneNumber}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                                        {patient.whatsAppNumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="text-blue-700 rounded-md hover:text-indigo-600" onClick={() => goToHistoryClinical(patient._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>

                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-500">
                        Mostrando {indexOfFirstPatient + 1} a{" "}
                        {Math.min(indexOfLastPatient, filteredPatients.length)} de{" "}
                        {filteredPatients.length} pacientes
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="px-3 py-1">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default withAuth(PatientsAllPage);