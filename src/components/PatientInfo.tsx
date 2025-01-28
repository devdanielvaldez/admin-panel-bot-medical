import moment from 'moment';
import React from 'react';

interface PatientInfoProps {
    patientData: {
        firstName: string;
        lastName: string;
        bornDate: string;
        phoneNumber: string;
        address: string;
        sex: string;
    };
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patientData }) => {

    const returnAge = (date: string) => {
        return moment().diff(moment(date, ["YYYY-MM-DD", "DD-MM-YYYY"]), 'years');

    };

    const formatDate = (date: string) => {
        return moment(date).format('DD-MM-YYYY');
    }
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Datos Generales del Paciente</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Nombres</label>
                    <p className="mt-1 p-2 block w-full">
                        {patientData.firstName}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Apellidos</label>
                    <p className="mt-1 p-2 block w-full">
                        {patientData.lastName}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                    <p className="mt-1 p-2 block w-full">
                        {formatDate(patientData.bornDate)} - Edad: {returnAge(patientData.bornDate)}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                    <p className="mt-1 p-2 block w-full">
                        {patientData.phoneNumber}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Dirección</label>
                    <p className="mt-1 p-2 block w-full">
                        {patientData.address}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Sexo</label>
                    <p className="mt-1 p-2 block w-full">
                        {patientData.sex === 'M' ? 'Masculino' : patientData.sex === 'F' ? 'Femenino' : 'Otro'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatientInfo;