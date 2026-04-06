import type { Metadata } from "next";
import { Roboto} from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import {PatientsProvider} from "@/features/patients/context/PatientsContext"
import {DoctorsProvider} from "@/features/doctors/context/DoctorsContext"
import {ServicesProvider} from "@/features/services/context/ServicesContext"
import {ConsultationsProvider} from "@/features/consultations/context/ConsultationsContext"
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300","400","500","700"],
});

export const metadata: Metadata = {
  title: "Quick Doctor",
  description: "QuickDoctor.io CRM for managing patients, doctors, services, and consultations.",
  icons: {
    icon: "/fav-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     
      <body
        className={`${roboto.className} antialiased`}
      >
         <Toaster/>
        <AuthProvider>
<PatientsProvider>
<DoctorsProvider>
<ServicesProvider>
<ConsultationsProvider>

        {children}
</ConsultationsProvider>
</ServicesProvider>
</DoctorsProvider>
</PatientsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
