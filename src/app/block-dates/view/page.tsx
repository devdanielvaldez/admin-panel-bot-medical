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
      const response = await axios.get('http://localhost:3030/api/' + 'block-dates/list');
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

      await axios.delete(`http://localhost:3030/api/block-dates/delete/${id}`);
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Fechas y Horarios Bloqueados</h1>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
          onClick={goToCreate}
        >
          + Registrar Bloqueo de Cita
        </button>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Fecha</th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">Hora</th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">Bloqueo Todo el Día</th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {blockedDates.map((block, index) => (
              <tr
                key={block._id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  {formatDate(block.dateBlock)}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {block.startTime} - {block.endTime}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {block.blockAllDay ? 'Sí' : 'No'}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => deleteBlockedDate(block._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(BlockedDatesPage);