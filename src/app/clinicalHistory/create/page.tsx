'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation';
import axios from "axios";
import PatientInfo from "@/components/PatientInfo";
import ClinicalHistoryModal from "@/components/MedicalHistoryReportModal/ReportMedicalHistoryModal";
import withAuth from "@/hooks/useAuth";
import Notiflix from "notiflix";
import moment from "moment";
import { useRouter } from "next/router";

interface ClinicalHistoryFormProps {
    initialData?: ClinicalHistoryData;
    isEditing?: boolean;
}

interface ClinicalHistoryData {
    medicalHistory: {
        personal: {
            diseases: string[];
            surgeries: string[];
            allergies: string[];
            medications: string[];
            hospitalizations: string[];
            vaccines: string[];
        };
        family: {
            hereditaryDiseases: string[];
            familyHistory: string[];
        };
    };
    lifestyle: {
        diet: string;
        physicalActivity: string;
        substanceUse: string;
        sleep: string;
        stressLevel: string;
        socialRelationships: string;
    };
    physicalExam: {
        vitalSigns: string;
        general: string;
        systems: string;
    };
    currentIllness: {
        description: string;
        onset: string;
        duration: string;
        progression: string;
        triggers: string[];
        priorTreatments: string;
    };
    labTests: string[];
    diagnoses: string[];
    treatmentPlan: {
        medications: string;
        therapies: string;
        recommendations: string;
        followUp: string;
    };
}

const TagInput: React.FC<{
    tags: string[];
    setTags: (tags: string[]) => void;
    label: string;
}> = ({ tags = [], setTags, label }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue("");
        }
    };

    const handleDelete = (tagToDelete: string) => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    };

    return (
        <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>

            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-4 py-2 shadow-md transition-transform transform hover:scale-105"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleDelete(tag)}
                            className="ml-2 text-white font-bold hover:text-gray-200"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>

            <textarea
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-4 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 transition-colors"
                placeholder="Escribe y presiona Enter para agregar..."
            />
        </div>
    );
};

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

const ClinicalHistoryForm: React.FC<ClinicalHistoryFormProps> = ({
    initialData,
    isEditing = false,
}) => {
    const [activeTab, setActiveTab] = useState("personal");
    const [formData, setFormData] = useState<any>(
        initialData || {
            medicalHistory: {
                personal: {
                    diseases: [],
                    surgeries: [],
                    allergies: [],
                    medications: [],
                    hospitalizations: [],
                    vaccines: [],
                },
                family: {
                    hereditaryDiseases: [],
                    familyHistory: [],
                },
            },
            lifestyle: {
                diet: "",
                physicalActivity: "",
                substanceUse: "",
                sleep: "",
                stressLevel: "",
                socialRelationships: "",
            },
            physicalExam: {
                vitalSigns: "",
                general: "",
                systems: "",
            },
            currentIllness: {
                description: "",
                onset: "",
                duration: "",
                progression: "",
                triggers: "",
                priorTreatments: "",
            },
            labTests: [],
            diagnoses: [],
            treatmentPlan: {
                medications: [],
                therapies: [],
                recommendations: "",
                followUp: "",
            },
        }
    );
    const searchParams = useSearchParams();
    const [patientId, setPatientId] = useState<string>("");
    const [patientData, setPatientData] = useState({
        firstName: '',
        lastName: '',
        bornDate: '',
        phoneNumber: '',
        address: '',
        sex: '',
        id: ''
    });
    const [report, setReport] = useState<any>(null);
    const [isModalOpen, setisModalOpen] = useState<boolean>(false);

    const [patientHistoryDetails, setPatientHistoryDetails] = useState<any>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenModalResult, setIsOpenModalResult] = useState<boolean>(false);
    const [patientInfo, setPatientInfo] = useState<any>();


    const handleCloseModal = () => {
        setisModalOpen(false);
    }

    const getAnalyzes = async (embedding: any) => {
        delete embedding.embedding;
        delete embedding.patientId.embedding;
        const response = await axios
            .post('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'clinical/history/analyze', {
                embedding: embedding
            });
        setReport(response.data.analysis);
    }

    const getAppointmentsAndHistory = (data: any) => {
        setIsOpenModal(true);
    }

    useEffect(() => {
        setPatientId(searchParams.get('id') || "");
        const fetchHistoryClinical = async () => {
            try {
                const response = await axios.get('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'clinical/history/' + searchParams.get('id'));
                if (response.data.clinicalHistory.embedding) {
                    getAnalyzes(response.data.clinicalHistory);
                }
                const clinicalHistory = response.data.clinicalHistory || {
                    medicalHistory: {
                        personal: {
                            diseases: [],
                            surgeries: [],
                            allergies: [],
                            medications: [],
                            hospitalizations: [],
                            vaccines: [],
                        },
                        family: {
                            hereditaryDiseases: [],
                            familyHistory: [],
                        },
                    },
                    lifestyle: {
                        diet: "",
                        physicalActivity: "",
                        substanceUse: "",
                        sleep: "",
                        stressLevel: "",
                        socialRelationships: "",
                    },
                    physicalExam: {
                        vitalSigns: {},
                        general: "",
                        systems: {},
                    },
                    currentIllness: {
                        description: "",
                        onset: "",
                        duration: "",
                        progression: "",
                        triggers: "",
                        priorTreatments: "",
                    },
                    labTests: [],
                    diagnoses: [],
                    treatmentPlan: {
                        medications: [],
                        therapies: [],
                        recommendations: "",
                        followUp: "",
                    },
                };
                setFormData(clinicalHistory);
            } catch (error) {
                console.error("Error fetching clinical history:", error);
            }
        };

        const fetchPatient = async () => {
            const response = await axios
                .get('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'patient/find/' + searchParams.get('id'));
            const data = response.data.data;
            setPatientData({
                firstName: data.firstName,
                lastName: data.lastName,
                bornDate: data.bornDate,
                phoneNumber: data.phoneNumber,
                address: data.address,
                sex: data.sex,
                id: data._id
            })
            console.log('entro en 1',response.data);
            fetchPatientDetails(data._id);
        }

        const fetchPatientDetails = async (patientId: string) => {
            const response = await axios
                .get('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'appointments/details/' + patientId);
            setPatientHistoryDetails(response.data.data);
            console.log('patient --->', response.data.data)
        }
        const fetchDetails = async (id: string) => {
            console.log('entro', id);
            const response = await axios
                .get('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'appointments/' + id);
            // fetchPatientDetails(response.data.data.patientId._id);
            // setPatientInfo(response.data.data);
            console.log('resp --->', response.data.data);
        };

        // fetchDetails();
        fetchHistoryClinical();
        fetchPatient();
    }, []);

    const handleInputChange = (
        e: any,
        section: string[],
        field: string
    ) => {
        const { value } = e.target;
        setFormData((prev: ClinicalHistoryData) => {
            const updatedFormData = { ...prev };
            let currentSection: any = updatedFormData;

            for (let i = 0; i < section.length; i++) {
                if (!currentSection[section[i]]) {
                    currentSection[section[i]] = {};
                }
                currentSection = currentSection[section[i]];
            }

            if (!currentSection[field]) {
                currentSection[field] = "";
            }

            currentSection[field] = value;

            return updatedFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        Notiflix.Loading.circle({
            svgSize: '30px'
        });
        e.preventDefault();
        try {
            await axios.post('https://api-jennifer-wkeor.ondigitalocean.app/apimedical2/api/' + 'clinical/history/create', {
                patientId,
                ...formData,
            });
            Notiflix.Notify.success("Datos guardados correctamente");
        } catch (err) {
            console.error(err);
            Notiflix.Notify.failure("Error al guardar la historia clínica.");
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const returnAge = (date: string) => {
        console.log(date);
        return moment().diff(moment(date, ["YYYY-MM-DD", "DD-MM-YYYY"]), 'years');

    };

    const formatDate = (date: string) => {
        return moment(date).format('DD-MM-YYYY');
    }

    const tabs = [
        { key: "personal", label: "Antecedentes Personales" },
        { key: "family", label: "Antecedentes Familiares" },
        { key: "lifestyle", label: "Estilo de Vida" },
        { key: "physicalExam", label: "Examen Físico" },
        { key: "currentIllness", label: "Enfermedad Actual" },
        { key: "treatmentPlan", label: "Plan de Tratamiento" },
    ];

    return (
        <DefaultLayout>
            <ModalAppointments isOpen={isOpenModal} appointmentData={patientHistoryDetails?.appointment} onClose={() => setIsOpenModal(false)} />
            <TestResultsModal isOpen={isOpenModalResult} testResults={patientHistoryDetails?.results} onClose={() => setIsOpenModalResult(false)} />
            <div className="items-center justify-center p-6">
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setisModalOpen(true)}
                        className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${report === null
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        disabled={report === null}
                    >
                        Mostrar Reporte
                    </button>
                </div>

                <PatientInfo patientData={patientData} />

                <div className="mt-3 mb-3">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-600">{returnAge(patientData?.bornDate)} años • Fecha de nacimiento • {formatDate(patientData?.bornDate)}</p>
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

                <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        {isEditing ? "Editar Historia Clínica" : "Registrar Historia Clínica"}
                    </h1>

                    <div className="border-b border-gray-200 mb-6">
                        <nav className="flex space-x-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab.key
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-500 hover:text-indigo-600"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {activeTab === "personal" && (
                            <div className="grid grid-cols-2 gap-6">
                                <TagInput
                                    tags={formData.medicalHistory?.personal?.diseases || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "personal"], "diseases")}
                                    label="Enfermedades Previas"
                                />
                                <TagInput
                                    tags={formData.medicalHistory?.personal?.surgeries || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "personal"], "surgeries")}
                                    label="Cirugías"
                                />
                                <TagInput
                                    tags={formData.medicalHistory?.personal?.allergies || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "personal"], "allergies")}
                                    label="Alergias"
                                />
                                <TagInput
                                    tags={formData.medicalHistory?.personal?.medications || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "personal"], "medications")}
                                    label="Medicamentos"
                                />
                                <TagInput
                                    tags={formData.medicalHistory?.personal?.hospitalizations || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "personal"], "hospitalizations")}
                                    label="Hospitalizaciones"
                                />
                                <TagInput
                                    tags={formData.medicalHistory?.personal?.vaccines || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "personal"], "vaccines")}
                                    label="Vacunas"
                                />
                            </div>
                        )}

                        {activeTab === "family" && (
                            <div className="grid grid-cols-2 gap-6">
                                <TagInput
                                    tags={formData.medicalHistory?.family?.hereditaryDiseases || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "family"], "hereditaryDiseases")}
                                    label="Enfermedades Hereditarias"
                                />
                                <TagInput
                                    tags={formData.medicalHistory?.family?.familyHistory || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["medicalHistory", "family"], "familyHistory")}
                                    label="Historia Familiar"
                                />
                            </div>
                        )}

                        {activeTab === "lifestyle" && (
                            <div className="grid grid-cols-2 gap-6">
                                <TagInput
                                    tags={formData.lifestyle?.diet ? formData.lifestyle.diet.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["lifestyle"], "diet")}
                                    label="Nutrición"
                                />
                                <TagInput
                                    tags={formData.lifestyle?.physicalActivity ? formData.lifestyle.physicalActivity.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["lifestyle"], "physicalActivity")}
                                    label="Actividad Física"
                                />
                                <TagInput
                                    tags={formData.lifestyle?.substanceUse ? formData.lifestyle.substanceUse.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["lifestyle"], "substanceUse")}
                                    label="Consumo de Sustancias"
                                />
                                <TagInput
                                    tags={formData.lifestyle?.sleep ? formData.lifestyle.sleep.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["lifestyle"], "sleep")}
                                    label="Sueño"
                                />
                                <TagInput
                                    tags={formData.lifestyle?.stressLevel ? formData.lifestyle.stressLevel.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["lifestyle"], "stressLevel")}
                                    label="Nivel de Estrés"
                                />
                                <TagInput
                                    tags={formData.lifestyle?.socialRelationships ? formData.lifestyle.socialRelationships.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["lifestyle"], "socialRelationships")}
                                    label="Relaciones Sociales"
                                />
                            </div>
                        )}

                        {activeTab === "physicalExam" && (
                            <div className="grid grid-cols-2 gap-6">
                                <TagInput
                                    tags={formData.physicalExam?.vitalSigns ? formData.physicalExam.vitalSigns.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["physicalExam"], "vitalSigns")}
                                    label="Signos Vitales"
                                />
                                <textarea
                                    rows={2}
                                    value={formData.physicalExam?.general || ""}
                                    onChange={(e) => handleInputChange(e, ["physicalExam"], "general")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Examen General"
                                />
                                <TagInput
                                    tags={formData.physicalExam?.systems ? formData.physicalExam?.systems.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["physicalExam"], "systems")}
                                    label="Sistemas"
                                />
                            </div>
                        )}

                        {activeTab === "currentIllness" && (
                            <div className="grid grid-cols-2 gap-6">
                                <textarea
                                    rows={2}
                                    value={formData.currentIllness?.description || ""}
                                    onChange={(e) => handleInputChange(e, ["currentIllness"], "description")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Descripción"
                                />
                                <textarea
                                    rows={2}
                                    value={formData.currentIllness?.onset || ""}
                                    onChange={(e) => handleInputChange(e, ["currentIllness"], "onset")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Inicio"
                                />
                                <textarea
                                    rows={2}
                                    value={formData.currentIllness?.duration || ""}
                                    onChange={(e) => handleInputChange(e, ["currentIllness"], "duration")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Duración"
                                />
                                <textarea
                                    rows={2}
                                    value={formData.currentIllness?.progression || ""}
                                    onChange={(e) => handleInputChange(e, ["currentIllness"], "progression")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Progresión"
                                />
                                <TagInput
                                    tags={formData.currentIllness?.triggers ? formData.currentIllness.triggers.split(",") : []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags.join(",") } }, ["currentIllness"], "triggers")}
                                    label="Desencadenantes"
                                />
                                <textarea
                                    rows={2}
                                    value={formData.currentIllness?.priorTreatments || ""}
                                    onChange={(e) => handleInputChange(e, ["currentIllness"], "priorTreatments")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Tratamientos Previos"
                                />
                            </div>
                        )}

                        {activeTab === "treatmentPlan" && (
                            <div className="grid grid-cols-2 gap-6">
                                <TagInput
                                    tags={formData.treatmentPlan?.medications || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["treatmentPlan"], "medications")}
                                    label="Medicamentos"
                                />
                                <TagInput
                                    tags={formData.treatmentPlan?.therapies || []}
                                    setTags={(tags) => handleInputChange({ target: { value: tags } }, ["treatmentPlan"], "therapies")}
                                    label="Terapias"
                                />
                                <textarea
                                    rows={2}
                                    value={formData.treatmentPlan?.recommendations || ""}
                                    onChange={(e) => handleInputChange(e, ["treatmentPlan"], "recommendations")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Recomendaciones"
                                />
                                <textarea
                                    rows={2}
                                    value={formData.treatmentPlan?.followUp || ""}
                                    onChange={(e) => handleInputChange(e, ["treatmentPlan"], "followUp")}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Seguimiento"
                                />
                            </div>
                        )}

                        <div className="mt-10 text-center">
                            <button
                                type="submit"
                                className="w-full max-w-xs mx-auto px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-lg font-semibold hover:bg-indigo-600 transition-transform transform hover:scale-105 focus:ring-2 focus:ring-indigo-400"
                            >
                                Guardar Historia Clínica
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ClinicalHistoryModal isOpen={isModalOpen} onClose={handleCloseModal} report={report} />
        </DefaultLayout>
    );
};

export default withAuth(ClinicalHistoryForm);