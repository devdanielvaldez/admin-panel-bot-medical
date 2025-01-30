'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipo para los días y horas de trabajo
interface WorkDay {
  _id: string;
  dayOfWeek: string;
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
      const response = await fetch("https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/available-work-days/list");
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