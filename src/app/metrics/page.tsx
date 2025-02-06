'use client';

import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Notiflix from "notiflix";
import { useRouter } from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMetrics = () => {
        fetch("https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/metrics/")
        .then((res) => res.json())
        .then((data) => {
          setMetrics(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching metrics:", error);
          setLoading(false);
        });
    }

    const interval = setInterval(() => {
      fetchAppointments();
      fetchMetrics();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    const response = await axios.get("https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/turns/all");
    setAppointments(response.data.data);
  };

  if (loading) return <div className="text-center text-xl font-semibold">Cargando métricas...</div>;
  if (!metrics) return <div className="text-center text-red-500">Error cargando datos</div>;

  const barData = {
    labels: metrics.appointmentsPerService.map((s: any) => s.name),
    datasets: [
      {
        label: "Citas por Servicio",
        data: metrics.appointmentsPerService.map((s: any) => s.count),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const lineData = {
    labels: Object.keys(metrics.servicesPerMonth),
    datasets: [
      {
        label: "Servicios por Mes",
        data: Object.values(metrics.servicesPerMonth),
        borderColor: "#10b981",
        backgroundColor: "#10b98180",
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ["Con Seguro", "Sin Seguro"],
    datasets: [
      {
        data: [metrics.insuranceStats.withInsurance, metrics.insuranceStats.withoutInsurance],
        backgroundColor: ["#6366f1", "#f87171"],
      },
    ],
  };

  const handleConfirm = async (id: string) => {
    const response = await axios.get('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'turns/confirm/' + id);
    Notiflix.Notify.success('Turno Confirmado');
    fetchAppointments();
    console.log(response)
};

const startAppointments = (id: string) => {
    router.push('/appointments/details?id=' + id);
}

  const inProgressAppointment = appointments.find(app => app.isInProgress);
  const otherAppointmentsArray: any = appointments.filter(app => !app.isInProgress).slice(0, 4);
  console.log(otherAppointmentsArray);

  return (
    <DefaultLayout>
      <div className="p-8 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-5">
          {inProgressAppointment && (
                        <div
                        key={inProgressAppointment?._id}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 flex flex-col justify-between"
                    >
                        {/* Información del Paciente */}
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                                {inProgressAppointment?.appointmentId?.patientId?.firstName}{' '}
                                {inProgressAppointment?.appointmentId?.patientId?.lastName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                {inProgressAppointment?.appointmentId?.patientMotive}
                            </p>
                            <p
                                className={`mt-4 inline-block text-sm font-semibold px-3 py-1 rounded-full ${inProgressAppointment?.appointmentId?.statusAppointment === 'PE'
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : inProgressAppointment?.appointmentId?.statusAppointment === 'En Progreso'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'
                                    }`}
                            >
                                {inProgressAppointment?.appointmentId?.statusAppointment === 'PE'
                                    ? 'Pendiente'
                                    : inProgressAppointment?.appointmentId?.statusAppointment === 'IN'
                                        ? 'En Progreso'
                                        : inProgressAppointment?.appointmentId?.statusAppointment === 'COF'
                                            ? 'Confirmada'
                                            : 'Completada'}
                            </p>
                        </div>

                        {/* Acciones */}
                        <div className="mt-6 space-y-3">
                            {!inProgressAppointment?.confirmed && (
                                <button
                                    onClick={() => handleConfirm(inProgressAppointment?._id)}
                                    className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
                                >
                                    Confirmar
                                </button>
                            )}
                            <button
                                onClick={() => startAppointments(inProgressAppointment?.appointmentId?._id)}
                                className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all"
                            >
                                Acceder a la Cita
                            </button>
                        </div>
                    </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-5">
          {otherAppointmentsArray.map((otherAppointments: any) => (
                        <div
                        key={otherAppointments?._id}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 flex flex-col justify-between"
                    >
                        {/* Información del Paciente */}
                        <div>
                            <h2 className="text-sm font-extrabold text-gray-800 dark:text-white">
                                {otherAppointments?.appointmentId?.patientId?.firstName}{' '}
                                {otherAppointments?.appointmentId?.patientId?.lastName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-xs">
                                {otherAppointments?.appointmentId?.patientMotive}
                            </p>
                            <p
                                className={`mt-4 inline-block text-sm font-semibold px-3 py-1 rounded-full ${otherAppointments?.appointmentId?.statusAppointment === 'PE'
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : otherAppointments?.appointmentId?.statusAppointment === 'En Progreso'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'
                                    }`}
                            >
                                {otherAppointments?.appointmentId?.statusAppointment === 'PE'
                                    ? 'Pendiente'
                                    : otherAppointments?.appointmentId?.statusAppointment === 'IN'
                                        ? 'En Progreso'
                                        : otherAppointments?.appointmentId?.statusAppointment === 'COF'
                                            ? 'Confirmada'
                                            : 'Completada'}
                            </p>
                        </div>

                        {/* Acciones */}
                        <div className="mt-6 space-y-3">
                            {!otherAppointments?.confirmed && (
                                <button
                                    onClick={() => handleConfirm(otherAppointments?._id)}
                                    className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
                                >
                                    Confirmar
                                </button>
                            )}
                            <button
                                onClick={() => startAppointments(otherAppointments?.appointmentId?._id)}
                                className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all"
                            >
                                Acceder a la Cita
                            </button>
                        </div>
                    </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">📅 Mes con más citas</h2>
            <p className="text-2xl font-bold">{metrics.maxAppointmentsMonth?.[0]}</p>
            <p className="text-gray-500">{metrics.maxAppointmentsMonth?.[1]} citas</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">🔝 Servicio más usado</h2>
            <p className="text-2xl font-bold">{metrics.mostUsedServices?.[0]?.name}</p>
            <p className="text-gray-500">{metrics.mostUsedServices?.[0]?.count} citas</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">📈 Servicios por Mes</h2>
            <Line data={lineData} />
          </div>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">📌 Pacientes con Seguro</h2>
            <Pie data={pieData} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-5">
          <div className="p-4 bg-white rounded-lg shadow-lg w-full mx-auto">
            <h2 className="text-lg font-semibold mb-2">📊 Citas por Servicio</h2>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
