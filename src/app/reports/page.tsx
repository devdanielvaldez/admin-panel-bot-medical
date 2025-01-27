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
            <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reportes de Cuentas</h1>

      {/* Reporte General */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Reporte General</h2>
        {allReports ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Fecha</th>
                <th className="border border-gray-300 p-2">Total Ganado</th>
                <th className="border border-gray-300 p-2">Servicios Utilizados</th>
                <th className="border border-gray-300 p-2">Con Seguro</th>
                <th className="border border-gray-300 p-2">Cobertura del Seguro</th>
              </tr>
            </thead>
            <tbody>
              {allReports.data.map((report: any) => (
                <tr key={report.appointmentId._id}>
                  <td className="border border-gray-300 p-2">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 p-2">{report.totalEarned}</td>
                  <td className="border border-gray-300 p-2">
                    {report.servicesUsed.map((service: any) => (
                      <div key={service._id}>{service.service.serviceName}</div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">{report.insuranceCoverage ? "Sí" : "No"}</td>
                  <td className="border border-gray-300 p-2">
                    {report.insuranceCoverage ? report.insuranceCoverage.insuranceName : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      {/* Reporte por Aseguradora */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Reporte por Aseguradora</h2>
        {insuranceReports ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Aseguradora</th>
                <th className="border border-gray-300 p-2">Fecha</th>
                <th className="border border-gray-300 p-2">Monto Pagado por el Seguro</th>
                <th className="border border-gray-300 p-2">Servicios Utilizados</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(insuranceReports.data).map(([insuranceCoverage, reports]: any) => (
                <tr key={insuranceCoverage}>
                  <td className="border border-gray-300 p-2">{insuranceCoverage}</td>
                  <td className="border border-gray-300 p-2">
                    {reports.map((report: any) => (
                      <div key={report._id}>
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {reports.reduce((total: number, report: any) => total + report.amountPaidByInsurance, 0)}
                  </td>
                  <td className="border border-gray-300 p-2">
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
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      {/* Reporte de Cuentas con Seguro */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cuentas con Seguro</h2>
        {withInsuranceReports ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Fecha</th>
                {/* <th className="border border-gray-300 p-2">Total Ganado</th> */}
                <th className="border border-gray-300 p-2">Servicios Utilizados</th>
                <th className="border border-gray-300 p-2">Monto Pagado por el Seguro</th>
              </tr>
            </thead>
            <tbody>
              {withInsuranceReports.data.map((report: any) => (
                <tr key={report.appointmentId._id}>
                  <td className="border border-gray-300 p-2">{new Date(report.date).toLocaleDateString()}</td>
                  {/* <td className="border border-gray-300 p-2">{report.totalEarned}</td> */}
                  <td className="border border-gray-300 p-2">
                    {report.servicesUsed.map((service: any) => (
                      <div key={service._id}>{service.service.serviceName}</div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">{report.amountPaidByInsurance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      {/* Reporte de Cuentas sin Seguro */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cuentas sin Seguro</h2>
        {withoutInsuranceReports ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Fecha</th>
                <th className="border border-gray-300 p-2">Total Ganado</th>
                <th className="border border-gray-300 p-2">Servicios Utilizados</th>
              </tr>
            </thead>
            <tbody>
              {withoutInsuranceReports.data.map((report: any) => (
                <tr key={report.appointmentId._id}>
                  <td className="border border-gray-300 p-2">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 p-2">{report.totalEarned}</td>
                  <td className="border border-gray-300 p-2">
                    {report.servicesUsed.map((service: any) => (
                      <div key={service._id}>{service.service.serviceName}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
    </DefaultLayout>
  );
};

export default withAuth(ReportsPage);