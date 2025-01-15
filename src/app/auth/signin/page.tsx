'use client';

import React, { useState } from "react";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Configuración de Firebase (reemplaza con tu propia configuración)
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/appointments/view");
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Iniciar Sesión
        </h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-600 dark:bg-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="Introduce tu correo"
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md p-3 text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;