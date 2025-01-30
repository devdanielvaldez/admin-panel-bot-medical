'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


// Componente de la tabla de citas
const ServicesTable = () => {
  const [servicesList, setServices] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


  // Llamada al servicio para obtener las citas
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/services/list");
      const data = await response;
      console.log(data.data.services);
      setServices(data.data.services);
      setTimeout(() => {
        console.log('se cargo a servicios --->', servicesList);
      }, 6000);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router
      .push('/services/create');
  }

  const formatCurrency = (amount: number, locale: string = 'en-US', currency: string = 'USD'): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  };

  // Llamamos al servicio cuando el componente se monta
  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes personalizar esto con un spinner o algo más visual
  }

  const convertDate = (date: string): any => {
    return moment(date).add(1, 'd').format('DD-MM-YYYY')
  }

  return (
    <DefaultLayout>
      <div>
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Servicios</h1>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={goToRegister}
          >
            + Registrar Servicio
          </button>
        </header>

        <div className="overflow-hidden rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <th className="px-6 py-4 text-left text-lg font-semibold">Servicio</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Costo Normal</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Costo con Seguro</th>
                <th className="px-6 py-4 text-left text-lg font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {servicesList.map((s: any, index: any) => (
                <tr
                  key={s._id}
                  className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                    }`}
                >
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    <h5 className="font-medium">{s.serviceName}</h5>
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    <h5 className="font-medium">{formatCurrency(s.servicePrice)}</h5>
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    <h5 className="font-medium">{formatCurrency(s.serviceWithInsurance)}</h5>
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    <button
                      className="text-red-500 hover:text-red-700 font-medium"
                    // onClick={() => handleDeleteService(s._id)}
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
    </DefaultLayout>
  );
};

export default withAuth(ServicesTable);
