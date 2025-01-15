'use client';

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";

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
      <div className="max-w-xl mx-auto my-10 p-5">
        <h2 className="text-2xl font-semibold mb-5">Bloquear Fecha y Horario</h2>

        {message && (
          <div
            className={`mb-4 text-center ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="dateBlock" className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              id="dateBlock"
              value={dateBlock}
              onChange={(e) => setDateBlock(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {!blockAllDay && (
            <>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Hora de Inicio (HH:mm)
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  Hora de Fin (HH:mm)
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="blockAllDay"
              checked={blockAllDay}
              onChange={() => setBlockAllDay(!blockAllDay)}
              className="mr-2"
            />
            <label htmlFor="blockAllDay" className="text-sm text-gray-700">Bloquear todo el día</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Bloquear Fecha"}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default BlockDatePage;