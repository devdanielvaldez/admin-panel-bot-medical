import React from 'react';

interface ClinicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: string; // El reporte de la historia clínica
}

const ClinicalHistoryModal: React.FC<ClinicalHistoryModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen) return null;

  // Función para eliminar saltos de línea, etiquetas <br> y espacios
  const cleanReport = (text: string) => {
    return text
      .replace(/<br\s*\/?>/gi, ' ') // Eliminar <br> y <br />
      .replace(/\n/g, ' ') // Reemplazar saltos de línea \n por espacio
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
      .trim(); // Eliminar espacios al inicio y al final
  };

  const cleanedReport = cleanReport(report);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Cambiar max-w-lg a max-w-2xl para un modal más ancho */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Reporte de Historia Clínica</h2>
        <div className="mb-4">
          {/* Usar dangerouslySetInnerHTML para renderizar rich text */}
          <div className="whitespace-pre-wrap text-gray-800" dangerouslySetInnerHTML={{ __html: cleanedReport }} />
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ClinicalHistoryModal;