'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter, useSearchParams } from "next/navigation";
import withAuth from "@/hooks/useAuth";

const WorkDayForm = () => {
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [workHours, setWorkHours] = useState<{ startTime: string; endTime: string }[]>([
    { startTime: "", endTime: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchWorkDayById = async () => {
      if (id) {
        try {
          const response = await axios.get(`https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/available-work-days/${id}`);
          if (response.data.ok && response.data.availableWorkDay) {
            const { dayOfWeek, workHours } = response.data.availableWorkDay;
            setDayOfWeek(dayOfWeek);
            setWorkHours(workHours);
          } else {
            setError("No se encontraron datos para el ID proporcionado.");
          }
        } catch (err) {
          console.error("Error al cargar los datos del día laboral:", err);
          setError("Hubo un error al cargar los datos del día laboral.");
        }
      }
    };

    fetchWorkDayById();
  }, [id]);

  const handleAddWorkHour = () => {
    setWorkHours([...workHours, { startTime: "", endTime: "" }]);
  };

  const handleRemoveWorkHour = (index: number) => {
    const newWorkHours = [...workHours];
    newWorkHours.splice(index, 1);
    setWorkHours(newWorkHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!dayOfWeek || !workHours.length) {
      setError("Por favor, ingrese el día y los horarios de trabajo.");
      return;
    }

    try {
      let response;
      const branchid = localStorage.getItem('selectedBranch');

      if (id) {
        // Si hay un ID, estamos en modo edición
        response = await axios.put(
          `https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/available-work-days/edit/${id}`,
          { dayOfWeek, workHours },
          { headers: { branchid } }
        );
      } else {
        // Si no hay ID, es un nuevo registro
        response = await axios.post(
          "https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/available-work-days/create",
          { dayOfWeek, workHours },
          { headers: { branchid } }
        );
      }

      if (response.data.ok) {
        setSuccessMessage(response.data.message);
        setDayOfWeek("");
        setWorkHours([{ startTime: "", endTime: "" }]);
        router.push('/work-days/view');
      }
    } catch (error) {
      setError("Hubo un error al registrar o editar el día laboral.");
    }
};


  return (
    <DefaultLayout>
      <div>
        {/* Encabezado */}
        <div className="text-left mb-8">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            {id ? 'Editar' : 'Registrar'} Días Laborales
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Configura los días y horarios de trabajo para tu equipo.
          </p>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 shadow-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-6 shadow-md">
            {successMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Día de la Semana */}
          <div>
            <label
              htmlFor="dayOfWeek"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Día de la Semana
            </label>
            <select
              id="dayOfWeek"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="" selected disabled hidden>Seleccionar...</option>
              <option value="Domingo">Domingo</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
            </select>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            {workHours.map((workHour, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-700"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor={`startTime-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Hora de Inicio
                    </label>
                    <input
                      type="time"
                      id={`startTime-${index}`}
                      value={workHour.startTime}
                      onChange={(e) =>
                        setWorkHours(
                          workHours.map((wh, idx) =>
                            idx === index
                              ? { ...wh, startTime: e.target.value }
                              : wh
                          )
                        )
                      }
                      className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`endTime-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Hora de Fin
                    </label>
                    <input
                      type="time"
                      id={`endTime-${index}`}
                      value={workHour.endTime}
                      onChange={(e) =>
                        setWorkHours(
                          workHours.map((wh, idx) =>
                            idx === index
                              ? { ...wh, endTime: e.target.value }
                              : wh
                          )
                        )
                      }
                      className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                {workHours.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWorkHour(index)}
                    className="mt-4 w-full text-red-500 font-medium hover:text-red-600 transition"
                  >
                    Eliminar Horario
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Botón Agregar Horario */}
          <button
            type="button"
            onClick={handleAddWorkHour}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Agregar Horario
          </button>

          {/* Botón Guardar */}
          <div className="text-right">
            <button
              type="submit"
              className="inline-block bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(WorkDayForm);
