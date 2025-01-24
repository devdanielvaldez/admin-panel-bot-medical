'use client';

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";

interface Message {
  type: "success" | "error";
  text: string;
}

interface Service {
  _id: string;
  serviceName: string;
  servicePrice: number;
  serviceWithInsurance: number;
}

const InsuranceRegistration: React.FC = () => {
  const [insuranceName, setInsuranceName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    { service: string; insurancePrice: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);

  // Obtener los servicios disponibles desde el backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("https://api-jennifer-wkeor.ondigitalocean.app/api/services/list");
        if (response.data.ok) {
          setServices(response.data.services);
        }
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchServices();
  }, []);

  // Maneja la selección de servicios
  const handleSelectService = (
    e: any,
    serviceId: string
  ) => {
    const selectedService = services.find((s) => s._id === serviceId);
    if (selectedService) {
      const newSelectedServices = selectedServices.filter(
        (item) => item.service !== serviceId
      );
      newSelectedServices.push({
        service: serviceId,
        insurancePrice: "",
      });
      setSelectedServices(newSelectedServices);
    }
  };

  // Maneja la actualización del precio del seguro para un servicio
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    serviceId: string
  ) => {
    const updatedServices = selectedServices.map((item) =>
      item.service === serviceId
        ? { ...item, insurancePrice: e.target.value }
        : item
    );
    setSelectedServices(updatedServices);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post("https://api-jennifer-wkeor.ondigitalocean.app/api/insurances/create", {
        insuranceName,
        contactPhone,
        services: selectedServices,
      });

      setMessage({
        type: "success",
        text: "¡Seguro médico registrado con éxito!",
      });

      setInsuranceName("");
      setContactPhone("");
      setSelectedServices([]);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.msg || "Ocurrió un error al registrar el seguro médico.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-full mx-4 sm:mx-auto sm:max-w-4xl">
        <h1 className="text-3xl font-semibold text-left mb-2">Registrar Seguro Médico</h1>
        <h4 className="text-lg font-normal text-left mb-8">Ingrese los datos solicitados para registrar un seguro médico</h4>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="insuranceName" className="block text-sm font-medium text-gray-700">
              Nombre del Seguro
            </label>
            <input
              type="text"
              id="insuranceName"
              value={insuranceName}
              onChange={(e) => setInsuranceName(e.target.value)}
              className="w-full p-3 border rounded-md"
              placeholder="Seguro Vida"
              required
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
              Teléfono de Contacto
            </label>
            <input
              type="text"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full p-3 border rounded-md"
              placeholder="Ej: 1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Seleccionar Servicios</label>
            {services.map((service) => (
              <div key={service._id} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id={`service-${service._id}`}
                  onChange={(e) =>
                    e.target.checked
                      ? handleSelectService(e, service._id)
                      : setSelectedServices(
                          selectedServices.filter((item) => item.service !== service._id)
                        )
                  }
                />
                <label htmlFor={`service-${service._id}`} className="text-sm text-gray-700">
                  {service.serviceName} - ${service.serviceWithInsurance}
                </label>
                <input
                  type="number"
                  placeholder="Cobertura seguro"
                  className="w-45 p-2 border rounded-md"
                  value={
                    selectedServices.find((item) => item.service === service._id)
                      ?.insurancePrice || ""
                  }
                  onChange={(e) =>
                    handlePriceChange(e, service._id)
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || selectedServices.length === 0}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300"
            }`}
          >
            {loading ? "Registrando..." : "Registrar Seguro"}
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

export default withAuth(InsuranceRegistration);
