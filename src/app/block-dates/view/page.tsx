'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import withAuth from '@/hooks/useAuth';

const BlockedDatesPage = () => {
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Función para obtener las fechas bloqueadas
  const fetchBlockedDates = async () => {
    try {
      const response = await axios.get('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'block-dates/list');
      setBlockedDates(response.data.blockedDates);
    } catch (err) {
      setError('Error al cargar las fechas bloqueadas.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una fecha bloqueada
  const deleteBlockedDate = async (id: string) => {
    try {
      const confirmed = confirm('¿Estás seguro de que deseas eliminar esta fecha bloqueada?');
      if (!confirmed) return;

      await axios.delete(`https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/block-dates/delete/${id}`);
      setBlockedDates((prevDates) => prevDates.filter((date) => date._id !== id));
    } catch (err) {
      setError('Error al eliminar la fecha bloqueada.');
    }
  };

  const goToCreate = () => {
    router.push('/block-dates/create');
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const formatDate = (date: any): any => {
    return moment(date).add(1, 'd').format('DD-MM-YYYY')
  }

  return (
    <DefaultLayout>
      <div>
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Fechas y Horarios Bloqueados
          </h1>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={goToCreate}
          >
            + Registrar Bloqueo de Cita
          </button>
        </header>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-hidden rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <th className="px-6 py-4 text-left text-lg font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Hora</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Bloqueo Todo el Día</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {blockedDates.map((block, index) => (
                <tr
                  key={block._id}
                  className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                    }`}
                >
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    {formatDate(block.dateBlock)}
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    {block.startTime} - {block.endTime}
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 text-gray-800 dark:text-gray-100">
                    {block.blockAllDay ? 'Sí' : 'No'}
                  </td>
                  <td className="border-b border-gray-300 dark:border-gray-700 px-6 py-4">
                    <button
                      className="text-red-600"
                      onClick={() => deleteBlockedDate(block._id)}
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

export default withAuth(BlockedDatesPage);