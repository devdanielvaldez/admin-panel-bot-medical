import React from "react";

interface DetailedService {
  serviceName: string;
  servicePrice: number;
  insurancePrice: number;
  userPay: number;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: {
    isWithInsurance: boolean;
    total: number;
    insuranceTotal: number;
    userPayTotal: number;
    detailedServices: DetailedService[];
  };
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, onSave, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">Factura</h2>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">Detalles de Servicios:</h3>
          <ul className="space-y-2 mt-2">
            {data?.detailedServices?.map((service, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{service.serviceName}</p>
                  <p className="text-sm text-gray-500">
                    Precio: ${service.servicePrice}
                  </p>
                  {data.isWithInsurance && (
                    <>
                      <p className="text-sm text-gray-500">
                        Cobertura del Seguro: ${service.insurancePrice}
                      </p>
                      <p className="text-sm text-gray-500">
                        Diferencia a pagar: ${service.userPay}
                      </p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t pt-4">
          <p className="text-lg font-semibold">
            Total: ${data.total}
          </p>
          {data.isWithInsurance && (
            <>
              <p className="text-sm text-gray-500">
                Cobertura del Seguro: ${data.insuranceTotal}
              </p>
              <p className="text-sm text-gray-500">
                Diferencia a pagar: ${data.userPayTotal}
              </p>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Agendar Cita
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
