import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
// import Loader from "@/components/common/Loader";
import { Metadata } from "next";
// import NotificationComponent from "./notifications";

export const metadata: Metadata = {
  title: "MediSuite - Gianna Castillo",
  description: "Sistema de Gestión de Pacientes - v0.1",
  generator: "Next.js",
  manifest: "/manifest.json",
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [loading, setLoading] = useState<boolean>(true);

  // // const pathname = usePathname();

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  return (
    <html lang="en">
      <head>
      {/* <link rel="manifest" href="manifest.json" /> */}
      </head>
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {children}
          {/* <NotificationComponent></NotificationComponent> */}
        </div>
      </body>
    </html>
  );
}
