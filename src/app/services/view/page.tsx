'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
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
      const response = await axios.get("http://localhost:3030/api/services/list");
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
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3" onClick={goToRegister}>
        + Registrar Servicio
      </button>

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Servicio</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Costo Normal</th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Costo con Seguro</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white"></th>
              </tr>
            </thead>
            <tbody>
  {servicesList.map((s: any) => (
    <tr key={s._id}>
      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
        <h5 className="font-medium text-black dark:text-white">{s.serviceName}</h5>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
        <h5 className="font-medium text-black dark:text-white">{formatCurrency(s.servicePrice)}</h5>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
        <h5 className="font-medium text-black dark:text-white">{formatCurrency(s.serviceWithInsurance)}</h5>
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

export default ServicesTable;
