'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Componente de la tabla de seguros
const InsurancesTable = () => {
  const [insurancesList, setInsurances] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Llamada al servicio para obtener los seguros
  const fetchInsurances = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3030/api/insurances/list");
      const data = response.data;
      setInsurances(data.data);
    } catch (error) {
      console.error("Error fetching insurances:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/insurances/create');
  }

  const formatCurrency = (amount: number, locale: string = 'en-US', currency: string = 'USD'): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  };

  // Llamamos al servicio cuando el componente se monta
  useEffect(() => {
    fetchInsurances();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes personalizar esto con un spinner o algo más visual
  }

  return (
    <DefaultLayout>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3" onClick={goToRegister}>
        + Registrar Seguro
      </button>

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Seguro</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Teléfono</th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Servicio</th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Costo del Servicio</th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Costo con Seguro</th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Cobertura Seguro</th>
              </tr>
            </thead>
            <tbody>
              {insurancesList.map((insurance: any) => (
                <tr key={insurance._id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{insurance.insuranceName}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{insurance.contactPhone}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    {insurance.services.map((s: any) => (
                      <div key={s._id}>
                        <h5 className="font-medium text-black dark:text-white">{s.service.serviceName}</h5>
                      </div>
                    ))}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    {insurance.services.map((s: any) => (
                      <div key={s._id}>
                        <h5 className="font-medium text-black dark:text-white">{formatCurrency(s.service.servicePrice)}</h5>
                      </div>
                    ))}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    {insurance.services.map((s: any) => (
                      <div key={s._id}>
                        <h5 className="font-medium text-black dark:text-white">{formatCurrency(s.service.serviceWithInsurance)}</h5>
                      </div>
                    ))}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    {insurance.services.map((s: any) => (
                      <div key={s._id}>
                        <h5 className="font-medium text-black dark:text-white">{formatCurrency(s.insurancePrice)}</h5>
                      </div>
                    ))}
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

export default withAuth(InsurancesTable);