'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import Notiflix from "notiflix";
import { useEffect, useState } from "react";

// Componente de la tabla de seguros
const InsurancesTable = () => {
  const [insurancesList, setInsurances] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (insurance: any) => {
    setSelectedInsurance(insurance);
    setShowModal(true);
  };

  const editInsurance = (id: any) => {
    router.push('/insurances/create?id=' + id);
  };

  const closeModal = () => {
    setSelectedInsurance(null);
    setShowModal(false);
  };

  const fetchInsurances = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/insurances/list");
      const data = response.data;
      setInsurances(data.data);
    } catch (error) {
      console.error("Error fetching insurances:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInsurance = async (id: string) => {
    Notiflix.Loading.circle({
      svgSize: '30px'
    });

    try {
      const response = await axios.delete("https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/insurances/delete/" + id);
      Notiflix.Notify.success(response.data.msg);
      fetchInsurances();
    } catch (err) {
      console.error("Error delete insurances:", err);
    } finally {
      Notiflix.Loading.remove();
    }
  }

  const goToRegister = () => {
    router.push('/insurances/create');
  }

  const formatCurrency = (amount: number, locale: string = 'en-US', currency: string = 'USD'): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
      <div>
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Seguros</h1>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={goToRegister}
          >
            + Registrar Seguro
          </button>
        </header>

        <div className="overflow-hidden rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <th className="px-6 py-4 text-left text-lg font-semibold">Seguro</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Teléfono</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {insurancesList.map((insurance: any) => (
                <tr
                  key={insurance._id}
                  className="transition-colors duration-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    {insurance.insuranceName}
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    {insurance.contactPhone}
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4">
                    <button
                      className="text-blue-500"
                      onClick={() => openModal(insurance)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    <button
                      className="text-blue-300 ml-3"
                      onClick={() => editInsurance(insurance._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      className="text-red-500 ml-3"
                      onClick={() => deleteInsurance(insurance._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para mostrar servicios */}
      {showModal && selectedInsurance && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-md">
          <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-4xl w-full p-10">
            {/* Botón de Cerrar */}
            <button
              className="absolute top-6 right-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Encabezado */}
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center drop-shadow-md">
              Servicios de {selectedInsurance?.insuranceName}
            </h2>

            {/* Lista de Servicios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {selectedInsurance?.services.map((s: any) => (
                <div
                  key={s._id}
                  className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg transform hover:scale-105 transition-transform"
                >
                  <p className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{s.service.serviceName}</p>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p>
                      <strong>Costo Normal:</strong> {formatCurrency(s.service.servicePrice)}
                    </p>
                    <p>
                      <strong>Costo con Seguro:</strong> {formatCurrency(s.service.serviceWithInsurance)}
                    </p>
                    <p>
                      <strong>Cobertura Seguro:</strong> {formatCurrency(s.insurancePrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de Cerrar */}
            <div className="mt-10 flex justify-center">
              <button
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-xl hover:scale-105 transition-transform"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>


      )}
    </DefaultLayout>

  );
};

export default withAuth(InsurancesTable);