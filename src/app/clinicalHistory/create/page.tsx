'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import axios from "axios";
import PatientInfo from "@/components/PatientInfo";
import ClinicalHistoryModal from "@/components/MedicalHistoryReportModal/ReportMedicalHistoryModal";
import withAuth from "@/hooks/useAuth";

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
            <label className="block text-sm font-medium text-gray-600">{label}</label>
            <div className="flex flex-wrap mt-1">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-indigo-500 text-white rounded-full px-2 py-1 mr-2 mb-2 flex items-center">
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleDelete(tag)}
                            className="ml-2 text-white"
                        >
                            x
                        </button>
                    </span>
                ))}
            </div>
            <textarea
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Escribe y presiona Enter para agregar..."
            />
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
    });
    const [report, setReport] = useState<any>(null);
    const [isModalOpen, setisModalOpen] = useState<boolean>(false);

    const handleCloseModal = () => {
        setisModalOpen(false);
    }

    const getAnalyzes = async (embedding: any) => {
        delete embedding.embedding;
        delete embedding.patientId.embedding;
        const response = await axios
            .post('http://localhost:3030/api/' + 'clinical/history/analyze', {
                embedding: embedding
            });
        setReport(response.data.analysis);
    }

    useEffect(() => {
        setPatientId(searchParams.get('id') || "");
        const fetchHistoryClinical = async () => {
            try {
                const response = await axios.get('http://localhost:3030/api/' + 'clinical/history/' + searchParams.get('id'));
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
                .get('http://localhost:3030/api/' + 'patient/find/' + searchParams.get('id'));
            const data = response.data.data;
            setPatientData({
                firstName: data.firstName,
                lastName: data.lastName,
                bornDate: data.bornDate,
                phoneNumber: data.phoneNumber,
                address: data.address,
                sex: data.sex,
            })
            console.log(response.data);
        }

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

            // Iterar a través de la sección y crearla si no existe
            for (let i = 0; i < section.length; i++) {
                if (!currentSection[section[i]]) {
                    currentSection[section[i]] = {}; // Inicializa la sección si no existe
                }
                currentSection = currentSection[section[i]];
            }

            // Asegúrate de que el campo exista antes de asignar el valor
            if (!currentSection[field]) {
                currentSection[field] = ""; // Inicializa el campo si no existe
            }

            currentSection[field] = value; // Asigna el valor

            return updatedFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3030/api/' + 'clinical/history/create', {
                patientId,
                ...formData,
            });
            alert("Historia clínica guardada exitosamente.");
        } catch (err) {
            console.error(err);
            alert("Error al guardar la historia clínica.");
        }
    };

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
            <div className="items-center justify-center p-6">
                <button
                    onClick={() => setisModalOpen(true)}
                    className={`px-4 py-2 rounded mb-4 
        ${report === null ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    disabled={report === null}
                >
                    Mostrar Reporte
                </button>
                <PatientInfo patientData={patientData} />

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

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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