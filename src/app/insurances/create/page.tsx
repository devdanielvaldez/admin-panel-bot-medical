'use client';

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [insuranceName, setInsuranceName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [userOfv, setUserOfv] = useState<string>("");
  const [passwordOfv, setPasswordOfv] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    { service: string; insurancePrice: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [insurancesCatalogs, setInsurancesCatalogs] = useState([]);

  // Obtener los servicios disponibles desde el backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/services/list");
        if (response.data.ok) {
          setServices(response.data.services);
        }
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    const fetchCatalogs = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/insurances/get/catalogs");
        if (response.data.ok) {
          setInsurancesCatalogs(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    }

    fetchServices();
    fetchCatalogs();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchInsurance = async () => {
        try {
          const response = await axios.get(`http://localhost:3030/api/insurances/${id}`);
          if (response.data.ok) {
            console.log(response.data)
            const insurance = response.data.data;
            setInsuranceName(insurance.insuranceName);
            setContactPhone(insurance.contactPhone);
            setUserOfv(insurance.userOfv);
            setPasswordOfv(insurance.passwordOfv);
            setSelectedServices(
              insurance.services.map((s: any) => ({
                service: s.service._id,
                insurancePrice: s.insurancePrice.toString()
              }))
            );
          }
        } catch (error) {
          console.error("Error al obtener los datos del seguro:", error);
        }
      };
      fetchInsurance();
    }
  }, [id]);

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
      if (id) {
        await axios.put(`http://localhost:3030/api/insurances/update/${id}`, {
          insuranceName,
          contactPhone,
          services: selectedServices,
          userOfv,
          passwordOfv
        });
        setMessage({ type: "success", text: "¡Seguro médico actualizado con éxito!" });
      } else {
        await axios.post("http://localhost:3030/api/insurances/create", {
          insuranceName,
          contactPhone,
          services: selectedServices,
          userOfv,
          passwordOfv
        }, {
          headers: {
            'branchid': localStorage.getItem('selectedBranch')
          }
        });
        setInsuranceName("");
        setContactPhone("");
        setUserOfv("");
        setPasswordOfv("");
        setSelectedServices([]);
        setMessage({ type: "success", text: "¡Seguro médico registrado con éxito!" });
      }
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
      <div>
        {/* Encabezado */}
        <div className="text-left mb-8">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            Registrar Seguro Médico
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ingresa los datos para registrar un seguro médico
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Seguro */}
          <div>
            <label
              htmlFor="insuranceName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre del Seguro
            </label>
            <select
              id="insuranceName"
              value={insuranceName}
              onChange={(e) => setInsuranceName(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="" selected disabled hidden>Seleccione el seguro que desea asociar</option>
              {insurancesCatalogs.map((i: any) => (
                <option value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          {/* Teléfono de Contacto */}
          <div>
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Teléfono de Contacto
            </label>
            <input
              type="text"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: 1234567890"
            />
          </div>

          <div>
            <label
              htmlFor="userOfv"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Usuario
            </label>
            <input
              type="text"
              id="userOfv"
              value={userOfv}
              onChange={(e) => setUserOfv(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="passwordOfv"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="text"
              id="passwordOfv"
              value={passwordOfv}
              onChange={(e) => setPasswordOfv(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Seleccionar Servicios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Seleccionar Servicios
            </label>
            <div className="space-y-4 mt-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <input
                    type="checkbox"
                    id={`service-${service._id}`}
                    checked={selectedServices.some((s) => s.service === service._id)}
                    onChange={(e) =>
                      e.target.checked
                        ? handleSelectService(e, service._id)
                        : setSelectedServices(
                          selectedServices.filter((item) => item.service !== service._id)
                        )
                    }
                    className="w-5 h-5 text-blue-500 focus:ring-blue-400"
                  />
                  <label
                    htmlFor={`service-${service._id}`}
                    className="flex-1 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {service.serviceName} - ${service.serviceWithInsurance}
                  </label>
                  <input
                    type="number"
                    placeholder="Cobertura seguro"
                    className="w-92 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={
                      selectedServices.find((item) => item.service === service._id)
                        ?.insurancePrice || ""
                    }
                    onChange={(e) => handlePriceChange(e, service._id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-transform transform ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300"
              }`}
          >
            {loading ? "Registrando..." : "Registrar Seguro"}
          </button>
        </form>

        {/* Mensaje de éxito o error */}
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

export default withAuth(InsuranceRegistration);
