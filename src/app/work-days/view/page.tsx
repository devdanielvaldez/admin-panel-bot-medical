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
      const response = await fetch("http://localhost:3030/api/available-work-days/list");
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
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3" onClick={goToCreate}>
        + Registrar Día Laboral
      </button>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Día de la Semana</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Horario de Trabajo</th>
              </tr>
            </thead>
            <tbody>
              {workDays.map((workDay) => (
                <tr key={workDay._id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{workDay.dayOfWeek}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    {workDay.workHours.map((workHour) => (
                      <p key={workHour._id} className="text-black dark:text-white">
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