'use client';

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import withAuth from "@/hooks/useAuth";

const BlockDatePage = () => {
  const [dateBlock, setDateBlock] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [blockAllDay, setBlockAllDay] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación en el front-end
    if (!blockAllDay && startTime >= endTime) {
      setMessage({
        type: "error",
        text: "La hora de inicio debe ser menor que la hora de fin.",
      });
      setLoading(false);
      return;
    }

    const requestBody = {
      dateBlock,
      startTime: blockAllDay ? null : startTime,
      endTime: blockAllDay ? null : endTime,
      blockAllDay,
      embedding: [0.0, 0.0], // Placeholder para el embedding, debe ser reemplazado en el backend
    };

    try {
      const response = await fetch("https://api-jennifer-wkeor.ondigitalocean.app/api/block-dates/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: "success", text: "Fecha bloqueada registrada con éxito." });
        setDateBlock("");
        setStartTime("");
        setEndTime("");
        setBlockAllDay(false);
        router
          .push('/block-dates/view')
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.msg || "Error al registrar la fecha bloqueada.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error interno del servidor. Por favor, intenta más tarde." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div>
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Bloquear Fecha y Horario
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Selecciona una fecha y el horario que deseas bloquear.
          </p>
        </div>

        {/* Mensajes */}
        {message && (
          <div
            className={`mb-6 text-center p-3 rounded-lg ${message.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Fecha */}
          <div>
            <label
              htmlFor="dateBlock"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Fecha
            </label>
            <input
              type="date"
              id="dateBlock"
              value={dateBlock}
              onChange={(e) => setDateBlock(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Campos Horarios */}
          {!blockAllDay && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Hora de Inicio (HH:mm)
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Hora de Fin (HH:mm)
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Checkbox Bloquear Todo el Día */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="blockAllDay"
              checked={blockAllDay}
              onChange={() => setBlockAllDay(!blockAllDay)}
              className="mr-2 w-5 h-5 text-indigo-500 border-gray-300 focus:ring-indigo-500 rounded"
            />
            <label
              htmlFor="blockAllDay"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bloquear todo el día
            </label>
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
              }`}
          >
            {loading ? "Cargando..." : "Bloquear Fecha"}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(BlockDatePage);