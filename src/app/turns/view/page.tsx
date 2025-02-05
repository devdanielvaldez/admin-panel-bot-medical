'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import Notiflix from "notiflix";
import { useState, useEffect } from "react";

interface Appointment {
    _id: string;
    arrivalTime: string;
    patientName: string;
    appointmentId: any;
    confirmed: boolean;
    isInProgress: boolean;
}

const TurnsList: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            fetchAppointments();
        }, 3000); // Se ejecuta cada 3 segundos
    
        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    const fetchAppointments = async () => {
        const response = await axios.get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/all');
        console.log(response.data.data);
        setAppointments(response.data.data);
    };

    const handleConfirm = async (id: string) => {
        const response = await axios.get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/confirm/' + id);
        Notiflix.Notify.success('Turno Confirmado');
        fetchAppointments();
        console.log(response)
    };

    const startAppointments = (id: string) => {
        router.push('/appointments/details?id=' + id);
    }

    const handleInProgress = async (id: string) => {
        const response = await axios.get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/in_progress/' + id);
        Notiflix.Notify.success('Turno En Progreso');
        fetchAppointments();
        console.log(response)
    };

    const handleComplete = async (id: string) => {
        const response = await axios.get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/complete/' + id);
        Notiflix.Notify.success('Turno Completado');
        fetchAppointments();
        console.log(response)
    };

    const handleViewDetails = (id: string) => {
        alert(`Mostrando detalles del turno con ID: ${id}`);
    };

    return (
        <DefaultLayout>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment?._id}
                            className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-6 flex flex-col justify-between transform transition-all hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Información del Paciente */}
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                                    {appointment?.appointmentId?.patientId?.firstName}{' '}
                                    {appointment?.appointmentId?.patientId?.lastName}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    {appointment?.appointmentId?.patientMotive}
                                </p>
                                <p
                                    className={`mt-4 inline-block text-sm font-semibold px-3 py-1 rounded-full ${appointment?.appointmentId?.statusAppointment === 'PE'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : appointment?.appointmentId?.statusAppointment === 'En Progreso'
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-green-100 text-green-600'
                                        }`}
                                >
                                    {appointment?.appointmentId?.statusAppointment === 'PE'
                                        ? 'Pendiente'
                                        : appointment?.appointmentId?.statusAppointment === 'IN'
                                            ? 'En Progreso'
                                            : appointment?.appointmentId?.statusAppointment === 'COF'
                                                ? 'Confirmada'
                                                : 'Completada'}
                                </p>
                            </div>

                            {/* Acciones */}
                            <div className="mt-6 space-y-3">
                                {!appointment?.confirmed && (
                                    <button
                                        onClick={() => handleConfirm(appointment?._id)}
                                        className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
                                    >
                                        Confirmar
                                    </button>
                                )}
                                {/* <button
                                    onClick={() => handleViewDetails(appointment._id)}
                                    className="w-full py-2 px-4 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-medium rounded-lg shadow-md hover:from-gray-400 hover:to-gray-500 transition-all"
                                >
                                    Ver Detalles
                                </button> */}
                                <button
                                    onClick={() => startAppointments(appointment?.appointmentId?._id)}
                                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all"
                                >
                                    Acceder a la Cita
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>

    );
};

export default withAuth(TurnsList);
