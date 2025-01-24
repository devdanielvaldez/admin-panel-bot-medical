'use client';

import AppointmentMedicalDetails from '@/components/AppointmentMedicalDetails';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import withAuth from '@/hooks/useAuth';
import axios from 'axios';
import moment from 'moment';
import { useRouter, useSearchParams } from 'next/navigation';
import Notiflix from 'notiflix';
import React, { useEffect, useRef, useState } from 'react';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsAppNumber: string;
  address: string;
  bornDate: string;
  sex: string;
}

interface Service {
  _id: string;
  serviceName: string;
  servicePrice: number;
  serviceWithInsurance: number;
}

interface Appointment {
  _id: string;
  patientId: Patient;
  patientMotive: string;
  patientIsInsurante: boolean;
  dateAppointment: string;
  dateTimeAppointment: string;
  statusAppointment: string;
  services: Service[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: Appointment[];
}

const ModalAppointments: React.FC<ModalProps> = ({ isOpen, onClose, appointmentData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full h-96 overflow-y-auto transition-transform transform scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Resumen de Citas</h2>
        {appointmentData.map((appointment) => (
          <div key={appointment._id} className="mb-6 border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">Paciente:</h3>
            <p className="text-gray-700">{`${appointment.patientId.firstName} ${appointment.patientId.lastName}`}</p>
            <p className="text-gray-600">Teléfono: {appointment.patientId.phoneNumber}</p>
            <p className="text-gray-600">Motivo: {appointment.patientMotive}</p>
            <p className="text-gray-600">Fecha de Cita: {new Date(appointment.dateAppointment).toLocaleDateString()}</p>
            <p className="text-gray-600">Hora de Cita: {appointment.dateTimeAppointment}</p>
            <p className="text-gray-600">Estado: {appointment.statusAppointment}</p>

            <h3 className="font-semibold text-lg text-gray-800 mt-4">Servicios:</h3>
            <ul className="list-disc list-inside">
              {appointment.services.map((service) => (
                <li key={service._id} className="text-gray-600">
                  {service.serviceName}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

interface TestResult {
  _id: string;
  patient: string;
  testName: string;
  testDate: string;
  result: string;
  description: string;
  pdfPassword: string;
}

interface TestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testResults: TestResult[];
}

const TestResultsModal: React.FC<TestResultsModalProps> = ({ isOpen, onClose, testResults }) => {
  if (!isOpen) return null;

  const formatDate = (date: string) => {
    return moment(date).format('DD-MM-YYYY');
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full h-96 overflow-y-auto transition-transform transform scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Resultados de Pruebas</h2>
        {testResults.map((result) => (
          <div key={result._id} className="mb-6 border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">Prueba: {result.testName}</h3>
            <p className="text-gray-600">Fecha de Prueba: {formatDate(result.testDate)}</p>
            <p className="text-gray-600">Descripción: {result.description || 'Sin descripción'}</p>
            <p className="text-gray-600">Resultado:
              <a href={result.result} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Ver Resultado
              </a>
            </p>
          </div>
        ))}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const AppointmentDetails = () => {
  const searchParams = useSearchParams();
  const [patientData, setPatientData] = useState<any>();
  const [patientHistoryDetails, setPatientHistoryDetails] = useState<any>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalResult, setIsOpenModalResult] = useState<boolean>(false);
  const router = useRouter();
  const appointmentDetailsRef = useRef<any>(null);
  useEffect(() => {
    console.log(searchParams.get('id'));
    const fetchPatientDetails = async (patientId: string) => {
      const response = await axios
        .get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'appointments/details/' + patientId);
      setPatientHistoryDetails(response.data.data);
      console.log('patient --->', response.data.data)
    }
    const fetchDetails = async () => {
      const response = await axios
        .get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'appointments/' + searchParams.get('id'));
      fetchPatientDetails(response.data.data.patientId._id);
      setPatientData(response.data.data);
      console.log(response.data.data);
    };

    fetchDetails();
  }, []);

  const getAppointmentsAndHistory = (data: any) => {
    setIsOpenModal(true);
  }

  const returnAge = (date: string) => {
    return moment().diff(moment(date, "YYYY-MM-DD"), 'years');
  };

  const formatDate = (date: string) => {
    return moment(date).format('DD-MM-YYYY');
  }

  const goToClinicalHistory = () => {
    router.push('/clinicalHistory/create?id=' + patientData?.patientId?._id)
  }

  const startAppointment = async () => {
    const response = await axios
      .get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/' + patientData._id)
      .then(async (d: any) => {
        // return console.log(d);
        await axios
          .get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/in_progress/' + d.data.data[0]._id)
          .then(() => {
            Notiflix.Notify.success('Consulta Iniciada');
            setPatientData((prevPatientData: any) => ({
              ...prevPatientData,
              statusAppointment: 'IN'
            }))
          })
      })
  }

  const finishAppointment = async () => {
    const response = await axios
      .get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/' + patientData._id)
      .then(async (d: any) => {
        // return console.log(d);
        await axios
          .get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'turns/complete/' + d.data.data[0]._id)
          .then(async () => {
            Notiflix.Notify.success('Consulta completada');
            setPatientData((prevPatientData: any) => ({
              ...prevPatientData,
              statusAppointment: 'CO'
            }));
            await axios
            .get('https://api-jennifer-wkeor.ondigitalocean.app/api/' + 'accounting/' + patientData._id)
            .then((res) => {
              console.log(res);
            })
          })
      })
  }

  const saveAppointment = () => {
    if (appointmentDetailsRef.current) {
      appointmentDetailsRef.current.handleSubmit(); // Llama al método handleSubmit del componente
    }
  }

  return (
    <DefaultLayout>
      <ModalAppointments isOpen={isOpenModal} appointmentData={patientHistoryDetails?.appointment} onClose={() => setIsOpenModal(false)} />
      <TestResultsModal isOpen={isOpenModalResult} testResults={patientHistoryDetails?.results} onClose={() => setIsOpenModalResult(false)} />
      <div className="p-6 min-h-screen">
        <div className="bg-white rounded-sm">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Realización de la cita</h2>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-200 text-gray-700 rounded hover:bg-gray-300" onClick={goToClinicalHistory}>
                Historia Clinica
              </button>
              <button
                className={`px-4 py-2 rounded text-white hover:opacity-80 ${patientData?.statusAppointment === 'IN'
                  ? 'bg-green-500 hover:bg-green-600' // Color para "Concluir Cita"
                  : 'bg-yellow-500 hover:bg-yellow-600' // Color para "Iniciar Consulta"
                  }`}
                onClick={() => patientData?.statusAppointment !== 'IN' ? startAppointment() : finishAppointment()}
                hidden={patientData?.statusAppointment == 'CO'}
              >
                {patientData?.statusAppointment !== 'IN' ? 'Iniciar Consulta' : 'Concluir Cita'}
              </button>
              <button
                className='px-4 py-2 bg-blue-200 text-gray-700 rounded hover:bg-gray-300'
                onClick={saveAppointment}
                hidden={patientData?.statusAppointment == 'CO' || patientData?.statusAppointment == 'PE'}
              >
                Guardar Datos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Paciente Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Paciente</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="font-semibold">{patientData?.patientId?.firstName} {patientData?.patientId?.lastName}</p>
                <p className="text-sm text-gray-600">{returnAge(patientData?.patientId?.bornDate)} años • Fecha de nacimiento • {formatDate(patientData?.patientId?.bornDate)}</p>
              </div>
              <div className="mt-4 space-y-2">
                <button className="w-full text-left px-4 py-2 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200" onClick={() => getAppointmentsAndHistory(patientHistoryDetails?.appointment)}>
                  Historial del paciente y citas • {patientHistoryDetails?.appointment?.length}
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200" onClick={() => setIsOpenModalResult(true)}>
                  Documentos y archivos • {patientHistoryDetails?.results?.length}
                </button>
              </div>
            </div>

            {/* Detalles de la cita Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Detalles de la cita</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
                <div className='flex'>
                  {patientData?.services.map((service: any, index: any) => (
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-600 text-sm rounded mr-2" key={index}>{service.serviceName}</span>
                  ))}
                </div>

                <p className="text-sm text-gray-600">{patientData?.patientMotive}</p>
              </div>
            </div>
          </div>
        </div>

        <br />

        <AppointmentMedicalDetails appointmentId={patientData?._id} ref={appointmentDetailsRef} />
      </div>
    </DefaultLayout>
  );
};

export default withAuth(AppointmentDetails);
