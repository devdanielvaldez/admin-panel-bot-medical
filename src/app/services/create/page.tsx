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
            const response = await axios.post("http://localhost:3030/api/services/create", {
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
            <div className="max-w-full mx-4 sm:mx-auto sm:max-w-4xl">
                <h1 className="text-3xl font-semibold text-left mb-2">Registrar Servicio</h1>
                <h4 className="text-lg font-normal text-left mb-8">Ingrese los datos solicitados para registrar un servicio</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="serviceName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nombre del Servicio
                            </label>
                            <input
                                type="text"
                                id="serviceName"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                placeholder="Consulta General"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="servicePrice"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Costo del Servicio
                            </label>
                            <input
                                type="number"
                                id="servicePrice"
                                value={servicePrice}
                                onChange={(e) => setServicePrice(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                placeholder="Ej: 250.00"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="servicePriceInsurance"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Costo del Servicio con Seguro
                            </label>
                            <input
                                type="number"
                                id="servicePriceInsurance"
                                value={servicePriceInsurance}
                                onChange={(e) => setServicePriceInsurance(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                placeholder="Ej: 250.00"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300"
                                }`}
                        >
                            {loading ? "Registrando..." : "Registrar Servicio"}
                        </button>
                    </form>

                    {message && (
                        <div
                            className={`mt-4 p-3 rounded-md text-center ${message.type === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
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