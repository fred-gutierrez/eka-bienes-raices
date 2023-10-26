import DarkModeProvider from "../context/DarkModeProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "../fontawesome/css/all.min.css";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bienes Raices Eka",
  description:
    "Encuentre la propiedad de sus sueños en Costa Rica con Eka, la agencia de bienes raíces líder en la región. Ofrecemos una amplia selección de locales, apartamentos y casas en San José, Heredia y Cartago, y nuestro equipo de corredores de bienes raíces está aquí para ayudarlo en cada paso del camino. Contacte con nosotros hoy mismo para obtener más información.",
  themeColor: [
    { media: `(prefers-color-scheme: light`, color: "#FAFAFA" },
    { media: `(prefers-color-scheme: dark)`, color: "#262626" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <DarkModeProvider>
        <body className={inter.className}>
          <div className="dark:bg-neutral-800 bg-neutral-50">
            <Navbar />
            {children}
            <Footer />
          </div>
        </body>
      </DarkModeProvider>
    </html>
  );
}
