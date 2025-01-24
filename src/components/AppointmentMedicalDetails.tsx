'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Importar iconos de react-icons
import Accordion from './Accordion';
import Notiflix from 'notiflix';

interface AppointmentMedicalDetailsProps {
    appointmentId: string;
}

const AppointmentMedicalDetails = forwardRef<{}, AppointmentMedicalDetailsProps>(({ appointmentId }, ref) => {

    const [physicalExamination, setPhysicalExamination] = useState({
        vitalSigns: {
            bloodPressure: '',
            heartRate: 0, // Cambiado a 0 para ser un número
            respiratoryRate: 0, // Cambiado a 0 para ser un número
            temperature: 0, // Cambiado a 0 para ser un número
            oxygenSaturation: 0, // Cambiado a 0 para ser un número
            weight: 0, // Cambiado a 0 para ser un número
            height: 0, // Cambiado a 0 para ser un número
            bmi: 0, // Cambiado a 0 para ser un número
        },
        generalObservation: '',
        detailedExamination: {
            cardiovascular: '',
            respiratory: '',
            nervous: '',
            digestive: '',
            musculoskeletal: '',
            otherSystems: '',
        },
    });

    const [currentIllnessHistory, setCurrentIllnessHistory] = useState({
        description: '',
        onset: '',
        duration: '',
        progression: '',
        triggers: '',
        previousTreatments: '',
    });

    const [labTestsAndDiagnostics, setLabTestsAndDiagnostics] = useState({
        tests: [''],
        results: [''],
    });

    const [diagnoses, setDiagnoses] = useState({
        presumptive: [''],
        definitive: [''],
    });

    const [treatmentPlan, setTreatmentPlan] = useState({
        medications: [{ name: '', dose: '', frequency: '' }],
        therapies: [''],
        recommendations: '',
        followUp: '', // Este se mantendrá como string para el input de fecha
    });

    const [progress, setProgress] = useState({
        currentStatus: '',
        milestones: [{ date: '', description: '' }],
        notes: '',
    });

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await axios
                .get(process.env.API_URL + 'appointments/details/a/' + appointmentId);
            setPhysicalExamination(response.data.data.physicalExamination);
            setCurrentIllnessHistory(response.data.data.currentIllnessHistory);
            setLabTestsAndDiagnostics(response.data.data.labTestsAndDiagnostics);
            setDiagnoses(response.data.data.diagnoses);
            setTreatmentPlan(response.data.data.treatmentPlan);
            setProgress(response.data.data.progress);

            console.log(response);
        };

        const timer = setTimeout(() => {
            console.log('entro --->', appointmentId);
            fetchDetails();
        }, 3000);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, [appointmentId]); // Agregar appointmentId como dependencia

    const handleSubmit = async () => {
        try {
            const response = await axios.post(process.env.API_URL + 'appointments/register/details', {
                appointmentId,
                physicalExamination,
                currentIllnessHistory,
                labTestsAndDiagnostics,
                diagnoses,
                treatmentPlan,
                progress,
            });
            Notiflix.Notify.success(response.data.message);
        } catch (error) {
            console.error('Error al registrar los detalles de la cita:', error);
            Notiflix.Notify.failure("Hubo un error al registrar los detalles de la cita.");
        }
    };

    const handleLabTestChange = (index: number, value: string) => {
        const newTests = [...labTestsAndDiagnostics.tests];
        newTests[index] = value;
        setLabTestsAndDiagnostics({ ...labTestsAndDiagnostics, tests: newTests });
    };

    const handleDiagnosisChange = (index: number, value: string, type: 'presumptive' | 'definitive') => {
        const newDiagnoses = { ...diagnoses };
        newDiagnoses[type][index] = value;
        setDiagnoses(newDiagnoses);
    };

    const handleMedicationChange = (index: number, field: 'name' | 'dose' | 'frequency', value: string) => {
        const newMedications = [...treatmentPlan.medications];
        newMedications[index] = { ...newMedications[index], [field]: value };
        setTreatmentPlan({ ...treatmentPlan, medications: newMedications });
    };

    const handleMilestoneChange = (index: number, field: 'date' | 'description', value: string) => {
        const newMilestones = [...progress.milestones];
        newMilestones[index] = { ...newMilestones[index], [field]: value };
        setProgress({ ...progress, milestones: newMilestones });
    };

    const addLabTest = () => {
        setLabTestsAndDiagnostics({ ...labTestsAndDiagnostics, tests: [...labTestsAndDiagnostics.tests, ''] });
    };

    const removeLabTest = (index: number) => {
        const newTests = labTestsAndDiagnostics.tests.filter((_, i) => i !== index);
        setLabTestsAndDiagnostics({ ...labTestsAndDiagnostics, tests: newTests });
    };

    const addDiagnosis = (type: 'presumptive' | 'definitive') => {
        setDiagnoses({ ...diagnoses, [type]: [...diagnoses[type], ''] });
    };

    const removeDiagnosis = (type: 'presumptive' | 'definitive', index: number) => {
        const newDiagnoses = { ...diagnoses };
        newDiagnoses[type] = newDiagnoses[type].filter((_, i) => i !== index);
        setDiagnoses(newDiagnoses);
    };

    const addMedication = () => {
        setTreatmentPlan({ ...treatmentPlan, medications: [...treatmentPlan.medications, { name: '', dose: '', frequency: '' }] });
    };

    const removeMedication = (index: number) => {
        const newMedications = treatmentPlan.medications.filter((_, i) => i !== index);
        setTreatmentPlan({ ...treatmentPlan, medications: newMedications });
    };

    const addMilestone = () => {
        setProgress({ ...progress, milestones: [...progress.milestones, { date: '', description: '' }] });
    };

    const removeMilestone = (index: number) => {
        const newMilestones = progress.milestones.filter((_, i) => i !== index);
        setProgress({ ...progress, milestones: newMilestones });
    };

    const labels = {
        bloodPressure: "Presión Arterial",
        heartRate: "Frecuencia Cardíaca",
        respiratoryRate: "Frecuencia Respiratoria",
        temperature: "Temperatura",
        oxygenSaturation: "Saturación de Oxígeno",
        weight: "Peso",
        height: "Talla",
        bmi: "Índice de Masa Corporal",
        generalObservation: "Observación General",
        cardiovascular: "Cardiovascular",
        respiratory: "Respiración",
        nervous: "Nervios",
        digestive: "Digestivo",
        musculoskeletal: "Musculoesquelético",
        otherSystems: "Otros Sistemas",
        description: "Descripción",
        onset: "Inicio",
        duration: "Duración",
        progression: "Evolución",
        triggers: "Factores Desencadenantes",
        previousTreatments: "Tratamientos Previos",
        tests: "Exámenes Realizados",
        results: "Resultados",
        presumptiveDiagnosis: "Diagnósticos Presuntivos",
        definitiveDiagnosis: "Diagnósticos Definitivos",
        medications: "Medicamentos",
        therapies: "Terapias",
        recommendations: "Recomendaciones",
        followUp: "Fecha de Próxima Cita",
        currentStatus: "Estado Actual",
        milestones: "Hitos",
        additionalNotes: "Notas Adicionales",
    };

    return (
        <div className="w-full mx-auto p-6">
            <form className="space-y-6">

                <Accordion title='Examen Fisico'>
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {Object.entries(physicalExamination.vitalSigns).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700">{labels[key as keyof typeof labels]}</label>
                                    <input
                                        type={typeof value === 'number' ? 'number' : 'text'}
                                        value={value}
                                        onChange={(e) => setPhysicalExamination({
                                            ...physicalExamination,
                                            vitalSigns: {
                                                ...physicalExamination.vitalSigns,
                                                [key]: typeof value === 'number' ? Number(e.target.value) : e.target.value,
                                            },
                                        })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.generalObservation}</label>
                            <textarea
                                value={physicalExamination.generalObservation}
                                onChange={(e) => setPhysicalExamination({ ...physicalExamination, generalObservation: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                            />
                        </div>

                        <h2 className="text-xl font-semibold mb-2">Examen Detallado</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {Object.entries(physicalExamination.detailedExamination).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700">{labels[key as keyof typeof labels]}</label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setPhysicalExamination({
                                            ...physicalExamination,
                                            detailedExamination: {
                                                ...physicalExamination.detailedExamination,
                                                [key]: e.target.value,
                                            },
                                        })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                </Accordion>

                <Accordion title="Historia de Enfermedad Actual">
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.description}</label>
                            <textarea
                                value={currentIllnessHistory.description}
                                onChange={(e) => setCurrentIllnessHistory({ ...currentIllnessHistory, description: e.target.value })}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {['onset', 'duration', 'progression', 'triggers', 'previousTreatments'].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700">{labels[field as keyof typeof labels]}</label>
                                    <input
                                        type="text"
                                        value={currentIllnessHistory[field as keyof typeof currentIllnessHistory]}
                                        onChange={(e) => setCurrentIllnessHistory({ ...currentIllnessHistory, [field]: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                </Accordion>

                <Accordion title="Examenes Diagnosticos">
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.tests}</label>
                            {labTestsAndDiagnostics.tests.map((test, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={test}
                                        onChange={(e) => handleLabTestChange(index, e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <button type="button" onClick={() => removeLabTest(index)} className="ml-2 text-red-600 hover:underline">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLabTest}
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FaPlus className="mr-1" />
                                {labels.tests}
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.results}</label>
                            {labTestsAndDiagnostics.results.map((result, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={result}
                                        onChange={(e) => handleLabTestChange(index, e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <button type="button" onClick={() => removeLabTest(index)} className="ml-2 text-red-600 hover:underline">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLabTest}
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FaPlus className="mr-1" />
                                {labels.results}
                            </button>
                        </div>

                        <h2 className="text-xl font-semibold mb-2">{labels.presumptiveDiagnosis}</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.presumptiveDiagnosis}</label>
                            {diagnoses.presumptive.map((diagnosis, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={diagnosis}
                                        onChange={(e) => handleDiagnosisChange(index, e.target.value, 'presumptive')}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <button type="button" onClick={() => removeDiagnosis('presumptive', index)} className="ml-2 text-red-600 hover:underline">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addDiagnosis('presumptive')}
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FaPlus className="mr-1" />
                                {labels.presumptiveDiagnosis}
                            </button>
                        </div>

                        <h2 className="text-xl font-semibold mb-2">{labels.definitiveDiagnosis}</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.definitiveDiagnosis}</label>
                            {diagnoses.definitive.map((diagnosis, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={diagnosis}
                                        onChange={(e) => handleDiagnosisChange(index, e.target.value, 'definitive')}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <button type="button" onClick={() => removeDiagnosis('definitive', index)} className="ml-2 text-red-600 hover:underline">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addDiagnosis('definitive')}
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FaPlus className="mr-1" />
                                {labels.definitiveDiagnosis}
                            </button>
                        </div>
                    </>
                </Accordion>

                <Accordion title="Plan de Tratamiento">
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.medications}</label>
                            {treatmentPlan.medications.map((medication, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={medication.name}
                                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                        className="border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dosis"
                                        value={medication.dose}
                                        onChange={(e) => handleMedicationChange(index, 'dose', e.target.value)}
                                        className="border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Frecuencia"
                                        value={medication.frequency}
                                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                        className="border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <button type="button" onClick={() => removeMedication(index)} className="text-red-600 hover:underline">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMedication}
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FaPlus className="mr-1" />
                                {labels.medications}
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.therapies}</label>
                            {treatmentPlan.therapies.map((therapy, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={therapy}
                                        onChange={(e) => {
                                            const newTherapies = [...treatmentPlan.therapies];
                                            newTherapies[index] = e.target.value;
                                            setTreatmentPlan({ ...treatmentPlan, therapies: newTherapies });
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <button type="button" onClick={() => {
                                        const newTherapies = treatmentPlan.therapies.filter((_, i) => i !== index);
                                        setTreatmentPlan({ ...treatmentPlan, therapies: newTherapies });
                                    }} className="ml-2 text-red-600 hover:underline">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setTreatmentPlan({ ...treatmentPlan, therapies: [...treatmentPlan.therapies, ''] })}
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FaPlus className="mr-1" />
                                {labels.therapies}
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.recommendations}</label>
                            <textarea
                                value={treatmentPlan.recommendations}
                                onChange={(e) => setTreatmentPlan({ ...treatmentPlan, recommendations: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.followUp}</label>
                            <input
                                type="date"
                                value={treatmentPlan.followUp}
                                onChange={(e) => setTreatmentPlan({ ...treatmentPlan, followUp: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                            />
                        </div>
                    </>
                </Accordion>

                <Accordion title="Progreso">
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.currentStatus}</label>
                            <input
                                type="text"
                                value={progress.currentStatus}
                                onChange={(e) => setProgress({ ...progress, currentStatus: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.milestones}</label>
                            {progress.milestones.map((milestone, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                                    <input
                                        type="date"
                                        value={milestone.date}
                                        onChange={(e) => handleMilestoneChange(index, 'date', e.target.value)}
                                        className="border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder={labels.additionalNotes}
                                        value={milestone.description}
                                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                        className="border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                                    />
                                    <button type="button" onClick={() => removeMilestone(index)} className="text-red-600 hover:underline">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMilestone}
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FaPlus className="mr-1" />
                                {labels.milestones}
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{labels.additionalNotes}</label>
                            <textarea
                                value={progress.notes}
                                onChange={(e) => setProgress({ ...progress, notes: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-500"
                            />
                        </div>
                    </>
                </Accordion>
            </form>
        </div>
    );
});

export default AppointmentMedicalDetails;