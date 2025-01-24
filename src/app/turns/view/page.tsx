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
        fetchAppointments();
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
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment._id}
                            className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-bold">{appointment.appointmentId.patientId.firstName} {appointment.appointmentId.patientId.lastName}</h2>
                                <p className="text-gray-600">{appointment.appointmentId.patientMotive}</p>
                                <p
                                    className={`mt-2 text-sm font-medium ${appointment.appointmentId.statusAppointment === "PE"
                                            ? "text-yellow-500"
                                            : appointment.appointmentId.statusAppointment === "En Progreso"
                                                ? "text-blue-500"
                                                : "text-green-500"
                                        }`}
                                >
                                    Estado: {appointment.appointmentId.statusAppointment == 'PE' ? 'Pendiente' : appointment.appointmentId.statusAppointment == 'IN' ? 'En Progreso' : appointment.appointmentId.statusAppointment == 'COF' ? 'Confirmada' : 'Completada'}
                                </p>
                            </div>
                            <div className="mt-4 space-y-2">
                                {!appointment.confirmed && (
                                    <button
                                        onClick={() => handleConfirm(appointment._id)}
                                        className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
                                    >
                                        Confirmar
                                    </button>
                                )}
                                <button
                                    onClick={() => handleViewDetails(appointment._id)}
                                    className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Ver Detalles
                                </button>
                                <button
                                    onClick={() => startAppointments(appointment.appointmentId._id)}
                                    className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
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
