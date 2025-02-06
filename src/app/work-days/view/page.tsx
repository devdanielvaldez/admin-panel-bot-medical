'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipo para los días y horas de trabajo
interface WorkDay {
  _id: string;
  dayOfWeek: string;
  isActive: boolean;
  workHours: {
    startTime: string;
    endTime: string;
    _id: string;
  }[];
}

// Componente de la tabla de días y horas de trabajo disponibles
const WorkDayTable = () => {
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Llamada al servicio para obtener los días y horas de trabajo
  const fetchWorkDays = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api-jennifer-wkeor.ondigitalocean.app/api/available-work-days/list");
      const data = await response.json();

      if (data.ok) {
        setWorkDays(data.availableWorkDays); // Asignar los días y horas de trabajo a la variable de estado
      } else {
        console.error("Error al obtener los días y horas de trabajo");
      }
    } catch (error) {
      console.error("Error fetching work days:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llamamos al servicio cuando el componente se monta
  useEffect(() => {
    fetchWorkDays();
  }, []);

  const goToCreate = () => {
    router
      .push('/work-days/create');
  }

  const goToEdit = (id: string) => {
    router.push('/work-days/create?id=' + id);
  }

  const toggleWorkDayStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;

      const response = await fetch(`https://api-jennifer-wkeor.ondigitalocean.app/api/available-work-days/toggle/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await response.json();

      if (data.ok) {
        setWorkDays((prevWorkDays) =>
          prevWorkDays.map((workDay) =>
            workDay._id === id ? { ...workDay, isActive: newStatus } : workDay
          )
        );
      } else {
        console.error("Error al cambiar el estado del día laboral");
      }
    } catch (error) {
      console.error("Error al cambiar el estado del día laboral:", error);
    }
  };


  if (loading) {
    return <div>Loading...</div>; // Puedes personalizar esto con un spinner o algo más visual
  }

  return (
    <DefaultLayout>
      <div>
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Días Laborales</h2>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={goToCreate}
          >
            + Registrar Día Laboral
          </button>
        </header>

        <div className="overflow-hidden rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <th className="px-6 py-4 text-left text-lg font-semibold">Día de la Semana</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Horario de Trabajo</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {workDays.map((workDay, index) => (
                <tr
                  key={workDay._id}
                  className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                    }`}
                >
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">{workDay.dayOfWeek}</h5>
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4">
                    {workDay.workHours.map((workHour) => (
                      <p key={workHour._id} className="text-gray-700 dark:text-gray-300">
                        {workHour.startTime} - {workHour.endTime}
                      </p>
                    ))}
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4">{workDay.isActive ==  true ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <div className="flex">
                      <button className="text-blue" onClick={() => goToEdit(workDay._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="blue" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button onClick={() => toggleWorkDayStatus(workDay._id, workDay.isActive)}
                        className={`ml-2 ${workDay.isActive ? "text-green-500" : "text-gray-500"
                          }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={workDay.isActive ? "red" : "green"
                        } className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
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
    </DefaultLayout>
  );
};

export default withAuth(WorkDayTable);