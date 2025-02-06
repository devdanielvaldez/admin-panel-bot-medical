'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import withAuth from "@/hooks/useAuth";

interface ServiceUsed {
  service: {
    serviceName: string;
  };
  servicePrice: number;
  insurancePrice: number;
  userPay: number;
}

interface InsuranceCoverage {
  insuranceName: string;
  amountPaidByInsurance: number;
}

interface AccountingReport {
  ok: boolean;
  data: any; // Puedes definir un tipo más específico según tu estructura de datos
}

const ReportsPage = () => {
  const [allReports, setAllReports] = useState<AccountingReport | null>(null);
  const [insuranceReports, setInsuranceReports] = useState<AccountingReport | null>(null);
  const [serviceReports, setServiceReports] = useState<AccountingReport | null>(null);
  const [withInsuranceReports, setWithInsuranceReports] = useState<AccountingReport | null>(null);
  const [withoutInsuranceReports, setWithoutInsuranceReports] = useState<AccountingReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const allResponse = await axios.get("http://localhost:3030/api/accounting/reports/all");
        const insuranceResponse = await axios.get("http://localhost:3030/api/accounting/reports/by-insurance");
        const serviceResponse = await axios.get("http://localhost:3030/api/accounting/reports/by-service");
        const withInsuranceResponse = await axios.get("http://localhost:3030/api/accounting/reports/with-insurance");
        const withoutInsuranceResponse = await axios.get("http://localhost:3030/api/accounting/reports/without-insurance");

        setAllReports(allResponse.data);
        setInsuranceReports(insuranceResponse.data);
        setServiceReports(serviceResponse.data);
        setWithInsuranceReports(withInsuranceResponse.data);
        setWithoutInsuranceReports(withoutInsuranceResponse.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <DefaultLayout>
      <div>
        {/* Reporte General */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 mb-10 ">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Reporte General
          </h2>
          {allReports ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <tr>
                    <th className="p-4 font-medium">Fecha</th>
                    <th className="p-4 font-medium">Total Ganado</th>
                    <th className="p-4 font-medium">Servicios Utilizados</th>
                    <th className="p-4 font-medium">Con Seguro</th>
                    <th className="p-4 font-medium">Cobertura del Seguro</th>
                  </tr>
                </thead>
                <tbody>
                  {allReports.data.map((report: any) => (
                    <tr
                      key={report.appointmentId._id}
                      className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-700 dark:even:bg-gray-800"
                    >
                      <td className="p-4">{new Date(report.date).toLocaleDateString()}</td>
                      <td className="p-4">{report.totalEarned}</td>
                      <td className="p-4">
                        {report.servicesUsed.map((service: any) => (
                          <div key={service._id}>{service.service.serviceName}</div>
                        ))}
                      </td>
                      <td className="p-4">{report.insuranceCoverage ? 'Sí' : 'No'}</td>
                      <td className="p-4">
                        {report.insuranceCoverage
                          ? report.insuranceCoverage.insuranceName
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Cargando...</p>
          )}
        </section>

        {/* Reporte por Aseguradora */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 mb-10 ">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Reporte por Aseguradora
          </h2>
          {insuranceReports ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
                    <th className="p-4 font-medium">Aseguradora</th>
                    <th className="p-4 font-medium">Fecha</th>
                    <th className="p-4 font-medium">Monto Pagado por el Seguro</th>
                    <th className="p-4 font-medium">Servicios Utilizados</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(insuranceReports.data).map(([insuranceCoverage, reports]: any) => (
                    <tr
                      key={insuranceCoverage}
                      className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-700 dark:even:bg-gray-800"
                    >
                      <td className="p-4">{insuranceCoverage}</td>
                      <td className="p-4">
                        {reports.map((report: any) => (
                          <div key={report._id}>
                            {new Date(report.date).toLocaleDateString()}
                          </div>
                        ))}
                      </td>
                      <td className="p-4">
                        {reports.reduce(
                          (total: number, report: any) => total + report.amountPaidByInsurance,
                          0
                        )}
                      </td>
                      <td className="p-4">
                        {reports.map((report: any) => (
                          <div key={report._id}>
                            {report.servicesUsed.map((service: any) => (
                              <div key={service._id}>{service.service.serviceName}</div>
                            ))}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Cargando...</p>
          )}
        </section>

        {withInsuranceReports && (
          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 mb-10 ">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Cuentas con Seguro
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <tr>
                    <th className="p-4 font-medium">Fecha</th>
                    <th className="p-4 font-medium">Servicios Utilizados</th>
                    <th className="p-4 font-medium">Monto Pagado por el Seguro</th>
                  </tr>
                </thead>
                <tbody>
                  {withInsuranceReports.data.map((report: any) => (
                    <tr
                      key={report.appointmentId._id}
                      className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-700 dark:even:bg-gray-800"
                    >
                      <td className="p-4">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {report.servicesUsed.map((service: any) => (
                          <div key={service._id}>{service.service.serviceName}</div>
                        ))}
                      </td>
                      <td className="p-4">{report.amountPaidByInsurance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {withoutInsuranceReports && (
          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 mb-10 ">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Cuentas sin Seguro
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  <tr>
                    <th className="p-4 font-medium">Fecha</th>
                    <th className="p-4 font-medium">Total Ganado</th>
                    <th className="p-4 font-medium">Servicios Utilizados</th>
                  </tr>
                </thead>
                <tbody>
                  {withoutInsuranceReports.data.map((report: any) => (
                    <tr
                      key={report.appointmentId._id}
                      className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-700 dark:even:bg-gray-800"
                    >
                      <td className="p-4">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">{report.totalEarned}</td>
                      <td className="p-4">
                        {report.servicesUsed.map((service: any) => (
                          <div key={service._id}>{service.service.serviceName}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </DefaultLayout>

  );
};

export default withAuth(ReportsPage);