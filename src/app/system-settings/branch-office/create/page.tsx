'use client';

import { useState, ChangeEvent, FormEvent, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useMask } from '@react-input/mask';
import axios from "axios";
import Notiflix from "notiflix";
import { useSearchParams } from "next/navigation";

interface ButtonProps {
    type: "button" | "submit" | "reset";
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ type, children, className }) => (
    <button
        type={type}
        className={`px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition ${className}`}
    >
        {children}
    </button>
);

interface InputProps {
    name: string;
    placeholder: string;
    type?: string;
    onChange: (e: any) => void;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({ name, placeholder, type = "text", onChange, required }) => (
    <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className="w-full p-3 border rounded-md"
    />
);

const InputPhone: React.FC<InputProps> = ({ name, placeholder, type = "text", onChange, required }) => {
    const inputRef = useMask({
        mask: '+1 (___) ___-____',
        replacement: { _: /\d/ },
    });
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            className="w-full p-3 border rounded-md"
            ref={inputRef}
        />
    );
};

const TextArea: React.FC<InputProps> = ({ name, placeholder, onChange, required }) => (
    <textarea
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className="w-full p-3 border rounded-md"
    />
);

interface FormData {
    nameBranchOffice: string;
    address: string;
    phone: string;
    phoneExtension?: string;
    whatsApp?: string;
    email: string;
}

export default function CreateBranchOffice() {
    const [formData, setFormData] = useState<FormData>({
        nameBranchOffice: "",
        address: "",
        phone: "",
        phoneExtension: "",
        whatsApp: "",
        email: "",
    });
    const [captureId, setCaptureId] = useState("");
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchData = async () => {
            if(id) {
                axios
                .get('https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/branch-office/by-id/' + id)
                .then((res) => {
                    const data = res.data.branchOfficeFound
                    setCaptureId(data._id);
                    setFormData(data);
                })
            }
        }

        fetchData();
    }, []); 

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const { nameBranchOffice, address, phone, email } = formData;

        if (!nameBranchOffice || !address || !phone || !email) {
            alert("Los campos nombre, dirección, teléfono y correo electrónico son obligatorios.");
            return;
        }

        const body = { 
            nameBranchOffice,
            address,
            phone,
            phoneExtension: formData.phoneExtension,
            whatsApp: formData.whatsApp,
            email,
            ...(captureId && { _id: captureId }) 
        };

        console.log("Enviando datos:", body);
        Notiflix.Loading.circle({
            svgSize: '30px'
        })
        axios
        .post('https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/branch-office/create-or-update', body, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken') 
            }
        })
        .then((res) => {
            Notiflix.Notify.success(res.data.message);
            setCaptureId(res.data.branchOffice._id);
            console.log(res.data.message);
        })
        .catch((err) => {
            console.log(err.response.data.msg);
            Notiflix.Notify.failure(err.response.data.msg);
        })
        .finally(() => {
            Notiflix.Loading.remove();
        })
    };

    return (
        <DefaultLayout>
            <Suspense fallback={<div>Cargando...</div>}>
            <div className="relative flex flex-col">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-800">Registrar Consultorio</h2>
                    <h4 className="text-xs font-normal mb-4">Complete los campos requeridos correctamente</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Centro Médico <span className="text-danger">*</span></label>
                                <Input name="nameBranchOffice" placeholder="Escribe el nombre del centro médico donde está el consultorio." onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección <span className="text-danger">*</span></label>
                                <TextArea name="address" placeholder="Escribe la dirección del centro médico y la ubicación de su consultorio en el mismo" onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono <span className="text-danger">*</span></label>
                                    <InputPhone name="phone" placeholder="Ejemplo: (809) 000 - 0000" onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Extensión</label>
                                    <Input name="phoneExtension" placeholder="Ejemplo: 1010" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                    <InputPhone name="whatsApp" placeholder="Ejemplo: (809) 000 - 0000" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-danger">*</span></label>
                                    <Input name="email" placeholder="Ejemplo: email@dominio.com" onChange={handleChange} required />
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button type="button" className="bg-gray-200 text-gray-700">Cancelar</Button>
                            <Button type="submit" className="bg-blue-600">Continuar</Button>
                        </div>
                    </form>
                </motion.div>
            </div>
            </Suspense>
        </DefaultLayout>
    );
}