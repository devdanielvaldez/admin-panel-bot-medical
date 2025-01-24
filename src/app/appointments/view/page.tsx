'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import { Menu, MenuButton, MenuItem } from "@mui/base";
import { Dropdown, IconButton } from "@mui/joy";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipo para las citas
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


// Componente de la tabla de citas
const AppointmentTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const appointmentsPerPage = 5; // Número de citas por página

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const Modal = ({ appointment }: { appointment: Appointment | null }) => {
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    if (!appointment) return null;

    const handleImageClick = () => {
      setIsImageExpanded(!isImageExpanded); // Cambiar el estado de la imagen
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden">
          {/* Imagen de cabecera */}
          <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('/path/to/your-image.jpg')` }}>
            <div className="bg-black bg-opacity-40 h-full flex items-center justify-center text-white text-2xl font-bold">
              <h2>Detalles de la Cita</h2>
            </div>
          </div>

          {/* Contenido del modal */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <p><strong className="text-gray-700">Paciente:</strong> {appointment.firstName} {appointment.lastName}</p>
              <p><strong className="text-gray-700">Teléfono:</strong> {appointment.phoneNumber}</p>
              <p><strong className="text-gray-700">WhatsApp:</strong> {appointment.whatsAppNumber}</p>
              <p><strong className="text-gray-700">Motivo:</strong> {appointment.patientMotive}</p>

              {/* Imagen del seguro */}
              {appointment.insuranceImage && (
                <div className="cursor-pointer">
                  <img
                    src={appointment.insuranceImage}
                    alt={appointment.insuranceMake}
                    className={`transition-all duration-300 ${isImageExpanded ? 'w-full h-auto' : 'w-[80px] h-[auto] object-cover'}`}
                    onClick={handleImageClick}
                  />
                </div>
              )}

              <p><strong className="text-gray-700">Aseguradora:</strong> {appointment.insuranceMake || '-'}</p>
              <p><strong className="text-gray-700">Identificación:</strong> {appointment.identification || '-'}</p>
              <p><strong className="text-gray-700">Dirección:</strong> {appointment.address}</p>
              <p><strong className="text-gray-700">Fecha de Cita:</strong> {convertDate(appointment.dateAppointment)} {appointment.dateTimeAppointment}</p>
              <p><strong className="text-gray-700">Estado:</strong> {appointment.statusAppointment === "PE" ? 'Pendiente' : appointment.statusAppointment === "CO" ? "Completada" : "Cancelada"}</p>
            </div>

            {/* Botón de cerrar */}
            <button
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-transform transform hover:scale-105"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const changeStatusToCA = async (appointmentId: string) => {
    try {
      const response = await axios.put(`http://localhost:3030/api/appointments/change-status/ca/${appointmentId}`);
      if (response.data.ok) {
        alert("Estado cambiado a 'CA' (Cancelada)");
        fetchAppointments();
        return response.data.appointment; // Retorna la cita actualizada si es necesario
      }
    } catch (error) {
      console.error("Error al cambiar el estado a 'CA':", error);
      alert("Hubo un error al cambiar el estado a 'CA'");
    }
  };

  // Función para cambiar el estado a "CO" (Completada)
  const changeStatusToCO = async (appointmentId: string) => {
    try {
      const response = await axios.put(`http://localhost:3030/api/appointments/change-status/co/${appointmentId}`);
      if (response.data.ok) {
        alert("Estado cambiado a 'CO' (Completada)");
        fetchAppointments();
        return response.data.appointment; // Retorna la cita actualizada si es necesario
      }
    } catch (error) {
      console.error("Error al cambiar el estado a 'CO':", error);
      alert("Hubo un error al cambiar el estado a 'CO'");
    }
  };

  // Llamada al servicio para obtener las citas
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3030/api/appointments/all");
      const data = await response.json();

      if (data.ok) {
        setAppointments(data.data); // Asignar las citas a la variable de estado
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

  // Paginación
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

  // Llamamos al servicio cuando el componente se monta
  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes personalizar esto con un spinner o algo más visual
  }

  const convertDate = (date: string): any => {
    return moment(date).add(1, 'd').format('DD-MM-YYYY')
  }

  return (
    <DefaultLayout>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3" onClick={goToRegister}>
        + Registrar Cita
      </button>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono"
          className="border border-gray-300 rounded px-4 py-2 w-[300px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Paciente</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Fecha de Cita</th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Estado</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white"></th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{appointment.firstName} {appointment.lastName}</h5>
                    <p className="text-sm">{appointment.phoneNumber}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {convertDate(appointment.dateAppointment)} {appointment.dateTimeAppointment}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${appointment.statusAppointment === "PE"
                        ? "bg-warning text-warning"
                        : appointment.statusAppointment === "CO" ? "bg-success text-success" : appointment.statusAppointment === "CA" ? "bg-danger text-danger" : "bg-primary text-primary"
                        }`}
                    >
                      {appointment.statusAppointment === "PE" ? "Pendiente" : appointment.statusAppointment === "CA" ? "Cancelada" : appointment.statusAppointment === "CO" ? "Completada" : appointment.statusAppointment === "COF" ? "Confirmada" : "En Consulta"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary" onClick={() => handleViewAppointment(appointment)}>
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      {/* Verifica si el estado de la cita no es 'CA' ni 'CO' */}
                      {appointment.statusAppointment !== 'CA' && appointment.statusAppointment !== 'CO' && appointment.statusAppointment !== 'COF' && appointment.statusAppointment !== 'IN' && (
                        <>

                          {/* Botón para cambiar el estado a "CA" */}
                          <button className="hover:text-primary" onClick={() => changeStatusToCA(appointment._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      <button onClick={() => goToHistoryClinical(appointment.patientId)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {showModal && <Modal appointment={selectedAppointment} />}
    </DefaultLayout>
  );
};

export default withAuth(AppointmentTable);
