'use client';

import React, { useState, FormEvent } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";

interface Message {
    type: "success" | "error";
    text: string;
}

const ServiceRegistration: React.FC = () => {
    const [serviceName, setServiceName] = useState<string>("");
    const [servicePrice, setServicePrice] = useState<string>("");
    const [servicePriceInsurance, setServicePriceInsurance] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await axios.post("https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/services/create", {
                serviceName,
                servicePrice: parseFloat(servicePrice), // Asegurarse de enviar el precio como número
                serviceWithInsurance: parseFloat(servicePriceInsurance), // Asegurarse de enviar el precio como número
            });

            setMessage({
                type: "success",
                text: "¡Servicio registrado con éxito!",
            });

            // Limpiar los campos del formulario
            setServiceName("");
            setServicePrice("");
            setServicePriceInsurance("");
        } catch (error: any) {
            setMessage({
                type: "error",
                text: error.response?.data?.msg || "Ocurrió un error al registrar el servicio.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <div>
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                        Registrar Servicio
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                        Ingrese los datos necesarios para registrar un nuevo servicio.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre del Servicio */}
                    <div>
                        <label
                            htmlFor="serviceName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Nombre del Servicio
                        </label>
                        <input
                            type="text"
                            id="serviceName"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Ej: Consulta General"
                            required
                        />
                    </div>

                    {/* Costo del Servicio */}
                    <div>
                        <label
                            htmlFor="servicePrice"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Costo del Servicio
                        </label>
                        <input
                            type="number"
                            id="servicePrice"
                            value={servicePrice}
                            onChange={(e) => setServicePrice(e.target.value)}
                            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Ej: 250.00"
                            required
                        />
                    </div>

                    {/* Costo del Servicio con Seguro */}
                    <div>
                        <label
                            htmlFor="servicePriceInsurance"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Costo del Servicio con Seguro
                        </label>
                        <input
                            type="number"
                            id="servicePriceInsurance"
                            value={servicePriceInsurance}
                            onChange={(e) => setServicePriceInsurance(e.target.value)}
                            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Ej: 200.00"
                        />
                    </div>

                    {/* Botón de Registro */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-all transform ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            }`}
                    >
                        {loading ? "Registrando..." : "Registrar Servicio"}
                    </button>
                </form>

                {/* Mensaje de Éxito/Error */}
                {message && (
                    <div
                        className={`mt-6 p-4 rounded-lg text-center transition-all ${message.type === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message.text}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default withAuth(ServiceRegistration);