'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useDropzone } from 'react-dropzone';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Select from 'react-select';
import Notiflix from 'notiflix';
import { useRouter } from 'next/navigation';
import withAuth from '@/hooks/useAuth';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCNCf1h7O3L2gN8zNY7NCn-4EL8d_RRqK0",
    authDomain: "stock-logic-d50bd.firebaseapp.com",
    databaseURL: "https://stock-logic-d50bd-default-rtdb.firebaseio.com",
    projectId: "stock-logic-d50bd",
    storageBucket: "stock-logic-d50bd.firebasestorage.app",
    messagingSenderId: "707692778699",
    appId: "1:707692778699:web:e55bd8d34febde56e0374e",
    measurementId: "G-YVW6TM9242"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const RegisterResults: React.FC = () => {
    const [patients, setPatients] = useState<{ _id: string; fullName: string }[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string>('');
    const [resultName, setResultName] = useState<string>('');
    const [resultDate, setResultDate] = useState<string>('');
    const [resultDescription, setResultDescription] = useState<string>('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>('');
    const [pdfPassword, setPdfPassword] = useState<string>('');
    const [description, setDescription] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    // Dropzone
    const onDrop = (acceptedFiles: File[]) => {
        setPdfFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    // Buscar pacientes desde el backend
    const fetchPatients = async () => {
        try {
            const response = await axios.get(`https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/patient/find/all`);
            if (response.data.ok) {
                const formattedPatients = response.data.data.map((patient: any) => ({
                    label: `${patient.firstName} ${patient.lastName}`,
                    value: patient._id,
                }));
                setPatients(formattedPatients);
            }
        } catch (error) {
            console.error('Error al buscar pacientes:', error);
        }
    };

    // Generar contraseña alfanumérica de 4 dígitos
    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 4; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    // Manejar la carga del archivo PDF
    const handleFileUpload = async () => {
        if (!pdfFile) return;

        setLoading(true);
        const fileRef = ref(storage, `results/${pdfFile.name}`);

        try {
            const snapshot = await uploadBytes(fileRef, pdfFile);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            setPdfPreviewUrl(downloadUrl);
            setPdfPassword(generatePassword());
        } catch (error) {
            console.error('Error al subir el archivo PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/' + 'results/create', {
                patientId: selectedPatient,
                testName: resultName,
                testDate: resultDate,
                description: resultDescription,
                result: pdfPreviewUrl,
                pdfPassword,
            });
            
            Notiflix.Notify.success('Resultado registrado correctamente');
            router.push('/results/view');
            setSelectedPatient('');
            setResultName('');
            setResultDate('');
            setResultDescription('');
            setPdfFile(null);
            setPdfPreviewUrl('');
            setPdfPassword('');
        } catch (error) {
            console.error('Error al registrar el resultado:', error);
            alert('Hubo un error al registrar el resultado.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <DefaultLayout>
            <div className="max-w-full mx-4 sm:mx-auto sm:max-w-4xl">
                <h1 className="text-3xl font-semibold text-left mb-4">Registrar Resultados</h1>

                <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                    <div>
                        <label htmlFor="patientSearch" className="block text-sm font-medium text-gray-700">
                            Buscar Paciente
                        </label>
                        <Select
                            options={patients}
                            placeholder="Escriba el nombre del paciente a buscar..."
                            onChange={(e: any) => setSelectedPatient(e.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="resultName" className="block text-sm font-medium text-gray-700">
                            Nombre del Resultado
                        </label>
                        <input
                            type="text"
                            id="resultName"
                            value={resultName}
                            onChange={(e) => setResultName(e.target.value)}
                            className="w-full p-3 border rounded-md"
                            placeholder="Nombre del resultado"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="resultDate" className="block text-sm font-medium text-gray-700">
                            Fecha del Resultado
                        </label>
                        <input
                            type="date"
                            id="resultDate"
                            value={resultDate}
                            onChange={(e) => setResultDate(e.target.value)}
                            className="w-full p-3 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Cargar PDF
                        </label>
                        <div
                            {...getRootProps()}
                            className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer ${
                                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-blue-500">Suelta tu archivo aquí...</p>
                            ) : (
                                <p className="text-gray-500">Arrastra y suelta un archivo PDF o haz clic para seleccionar</p>
                            )}
                        </div>
                        {pdfFile && <p className="mt-2 text-sm text-gray-700">Archivo seleccionado: {pdfFile.name}</p>}
                        <button
                            type="button"
                            onClick={handleFileUpload}
                            className="mt-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                            disabled={!pdfFile || loading}
                        >
                            {loading ? 'Subiendo...' : 'Subir PDF'}
                        </button>
                    </div>

                    <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <textarea name="description" id="description" value={description} onInput={(e: any) => setDescription(e.target.value)} className="w-full p-3 border rounded-md"></textarea>
                    </div>

                    {pdfPreviewUrl && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-700">PDF Subido Correctamente:</p>
                            <a
                                href={pdfPreviewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Ver PDF
                            </a>
                            <p className="text-sm text-gray-700">Contraseña: {pdfPassword}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300'
                        }`}
                    >
                        {loading ? 'Registrando...' : 'Registrar Resultado'}
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default withAuth(RegisterResults);