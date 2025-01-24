'use client';

import { useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import withAuth from "@/hooks/useAuth";

const WorkDayForm = () => {
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [workHours, setWorkHours] = useState<{ startTime: string; endTime: string }[]>([
    { startTime: "", endTime: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

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
      const response = await axios.post(
        "https://api-jennifer-wkeor.ondigitalocean.app/api/available-work-days/create",
        { dayOfWeek, workHours }
      );

      if (response.data.ok) {
        setSuccessMessage(response.data.message);
        setDayOfWeek("");
        setWorkHours([{ startTime: "", endTime: "" }]);
        router
        .push('/work-days/view')
      }
    } catch (error) {
      setError("Hubo un error al registrar el día laboral.");
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Registrar Días Laborales</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
              Día de la Semana
            </label>
            <select
              id="dayOfWeek"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccionar...</option>
              <option value="Domingo">Domingo</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
            </select>
          </div>

          <div>
            {workHours.map((workHour, index) => (
              <div key={index} className="mb-6">
                <div className="mb-4">
                  <label
                    htmlFor={`startTime-${index}`}
                    className="block text-sm font-medium text-gray-700"
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
                          idx === index ? { ...wh, startTime: e.target.value } : wh
                        )
                      )
                    }
                    className="p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`endTime-${index}`}
                    className="block text-sm font-medium text-gray-700"
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
                          idx === index ? { ...wh, endTime: e.target.value } : wh
                        )
                      )
                    }
                    className="p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                {workHours.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWorkHour(index)}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>


          <div className="mb-4">
            <button
              type="button"
              onClick={handleAddWorkHour}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              + Agregar Horario
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md"
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
