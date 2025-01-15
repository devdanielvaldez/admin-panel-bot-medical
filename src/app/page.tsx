import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignIn from "./auth/signin/page";

export const metadata: Metadata = {
  title:
    "SGP - Sistema de Gestión de Pacientes",
  description: "SGP es un sistema de gestión de pacientes y agenda medica",
};

export default function Home() {
  return (
    <>
      <>
        <SignIn />
      </>
    </>
  );
}
