'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Appointment {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsAppNumber: string;
  patientMotive: string;
  insuranceMake: string;
  identification: string;
  insuranceImage: string;
  address: string;
  dateAppointment: string;
  dateTimeAppointment: string;
  statusAppointment: string;
  patientId: string;
}

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const appointmentsPerPage = 5; // Número de citas por página

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const Modal = ({ appointment }: { appointment: any }) => {
    const [showImageViewer, setShowImageViewer] = useState(false);

    if (!appointment) return null;

    return (
      <>
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999] backdrop-blur-sm"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[95%] max-w-4xl overflow-hidden transform transition-transform scale-100">
            <div
              className="h-40 bg-cover bg-center relative"
              style={{
                backgroundImage: `url('https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg?semt=ais_hybrid')`,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold">Detalles de la Cita</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Paciente:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {appointment.firstName} {appointment.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Teléfono:</p>
                  <p className="text-gray-700 dark:text-gray-300">{appointment.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">WhatsApp:</p>
                  <p className="text-gray-700 dark:text-gray-300">{appointment.whatsAppNumber}</p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Motivo:</p>
                  <p className="text-gray-700 dark:text-gray-300">{appointment.patientMotive}</p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Aseguradora:</p>
                  <p className="text-gray-700 dark:text-gray-300">{appointment?.insuranceMake?.insuranceName || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Identificación:</p>
                  <p className="text-gray-700 dark:text-gray-300">{appointment?.identification || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Dirección:</p>
                  <p className="text-gray-700 dark:text-gray-300">{appointment?.address}</p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Fecha de Cita:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {convertDate(appointment.dateAppointment)} {appointment.dateTimeAppointment}
                  </p>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Estado:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {appointment.statusAppointment === 'PE'
                      ? 'Pendiente'
                      : appointment.statusAppointment === 'CO'
                        ? 'Completada'
                        : appointment.statusAppointment === 'COF' ? 'Confirmada' : appointment.statusAppointment === 'IN' ? 'En Consulta' : 'Cancelada'}
                  </p>
                </div>
              </div>

              {appointment.insuranceImage && (
                <div className="mb-6">
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-2">Imagen del Seguro:</h3>
                  <div className="flex justify-center">
                    <img
                      src={appointment?.insuranceImage}
                      alt={appointment?.insuranceMake?.insuranceName}
                      className="rounded-lg shadow-lg max-h-64 object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setShowImageViewer(true)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-full shadow-lg font-semibold transform transition-transform hover:scale-105"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {showImageViewer && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-[10000]"
            onClick={() => setShowImageViewer(false)}
          >
            <img
              src={appointment?.insuranceImage}
              alt="Seguro"
              className="rounded-lg max-h-[90%] max-w-[90%] object-contain"
            />
          </div>
        )}
      </>
    );
  };

  const changeStatusToCA = async (appointmentId: string) => {
    try {
      const response = await axios.put(`https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/appointments/change-status/ca/${appointmentId}`);
      if (response.data.ok) {
        alert("Estado cambiado a 'CA' (Cancelada)");
        fetchAppointments();
        return response.data.appointment;
      }
    } catch (error) {
      console.error("Error al cambiar el estado a 'CA':", error);
      alert("Hubo un error al cambiar el estado a 'CA'");
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/appointments/all");
      const data = await response.json();

      if (data.ok) {
        setAppointments(data.data);
      } else {
        console.error("Error al obtener las citas");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router
      .push('/appointments/create');
  }

  const goToHistoryClinical = (id: string) => {
    router
      .push('/clinicalHistory/create?id=' + id);
  }

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || appointment.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const convertDate = (date: string): any => {
    return moment(date).add(1, 'd').format('DD-MM-YYYY')
  }

  return (
    <DefaultLayout>
      <div className="">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Citas</h1>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
              onClick={goToRegister}
            >
              + Registrar Cita
            </button>
          </header>

          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono"
              className="w-full max-w-md rounded-full border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-300 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-900">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <th className="px-6 py-4 text-left text-lg font-semibold">Paciente</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold">Fecha de Cita</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold">Estado</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment, index) => (
                  <tr
                    key={appointment._id}
                    className={`hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                      }`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-gray-800 dark:text-gray-100 font-medium">
                        {appointment.firstName} {appointment.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                      {convertDate(appointment.dateAppointment)} {appointment.dateTimeAppointment}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.statusAppointment === 'PE'
                          ? 'bg-yellow-100 text-yellow-600'
                          : appointment.statusAppointment === 'CO'
                            ? 'bg-green-100 text-green-600'
                            : appointment.statusAppointment === 'CA'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                      >
                        {appointment.statusAppointment === 'PE'
                          ? 'Pendiente'
                          : appointment.statusAppointment === 'CO'
                            ? 'Completada'
                            : appointment.statusAppointment === 'COF' ? 'Confirmada' : appointment.statusAppointment === 'IN' ? 'En Consulta' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <button
                        className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      {appointment.statusAppointment !== 'CA' &&
                        appointment.statusAppointment !== 'CO' && (
                          <button
                            className="text-red-600 hover:text-red-800 transition-all"
                            onClick={() => changeStatusToCA(appointment._id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </button>
                        )}
                      <button
                        className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-all"
                        onClick={() => goToHistoryClinical(appointment.patientId)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center space-x-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-lg transition-all ${currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>

        {showModal && <Modal appointment={selectedAppointment} />}
      </div>
    </DefaultLayout>
  );
};

AppointmentTable.displayName = 'AppointmentTable';

export default withAuth(AppointmentTable);
