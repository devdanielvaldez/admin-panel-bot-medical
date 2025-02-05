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
      const response = await axios.get("http://localhost:3030/api/services/list", {
        headers: {
          'branchid': localStorage.getItem('selectedBranch')
        }
      });
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

  const changeStatus = async (id: string, isActive: any) => {
    try {
      // Realizar la solicitud para alternar el estado del servicio
      const response = await axios.patch(`http://localhost:3030/api/services/toggle/${id}`, { isActive }, {
        headers: {
          'branchid': localStorage.getItem('selectedBranch'),
        },
      });
  
      if (response.status === 200) {
        // Si la respuesta es exitosa, actualizamos el estado local
        setServices((prevServices: any[]) => {
          return prevServices.map((service) => {
            if (service._id === id) {
              return { ...service, isActive: !service.isActive };
            }
            return service;
          });
        });
      } else {
        console.error('Error al cambiar el estado del servicio:', response.data);
      }
    } catch (error) {
      console.error('Error interno al cambiar el estado:', error);
    }
  };
  

  if (loading) {
    return <div>Cargando...</div>; // Puedes personalizar esto con un spinner o algo más visual
  }

  const convertDate = (date: string): any => {
    return moment(date).add(1, 'd').format('DD-MM-YYYY')
  }

  return (
    <DefaultLayout>
      <div>
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Servicios</h1>
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
                    onClick={() => changeStatus(s._id, s.isActive)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={s.isActive == true ? 'red' : 'green'} className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
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
