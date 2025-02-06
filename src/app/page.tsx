import { Metadata } from "next";
import SignIn from "./auth/signin/page";

export const metadata: Metadata = {
  title:
    "Iniciar",
  description: "MedicalSuite es un sistema de gestión de pacientes y agenda medica",
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
