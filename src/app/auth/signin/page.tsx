'use client';

import React, { useState } from "react";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import axios from "axios";
import Notiflix from "notiflix";

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
      Notiflix.Loading.circle({
        svgSize: '30px'
      });

      await axios
        .post('https://api-jennifer-wkeor.ondigitalocean.app/apimedical3/api/' + 'auth/login', {
          username: email,
          pwd: password
        })
        .then((res) => {
          Notiflix.Loading.remove();
          console.log(res.data.token);
          localStorage.setItem('accessToken', res.data.token);
          router.push("/appointments/view");
          
        })
        .catch((err) => {
          Notiflix.Loading.remove();
          Notiflix.Notify.failure('Usuario y/o Contraseña incorrectos');
          console.log(err);
        })
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="w-full max-w-md sm:w-11/12 md:w-96 rounded-lg border border-stroke bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
          Iniciar Sesión
        </h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="Introduce tu correo"
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
        {/* <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default SignIn;