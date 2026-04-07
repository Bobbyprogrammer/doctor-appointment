import type { Metadata } from "next";
import { Roboto} from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/features/auth/context/AuthContext";

import {ServicesProvider } from "@/features/services/context/ServicesContext"
import {ConsultationsProvider} from "@/features/consultations/context/ConsultationsContext"
import {SickCertificatesProvider} from "@/features/sick-certificates/context/SickCertificatesContext";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300","400","500","700"],
});


export const metadata: Metadata = {
  title: "QuickDoctor.ie",
  description: "QuickDoctor.ie",
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
        <AuthProvider>
          <ServicesProvider>

       
          <ConsultationsProvider>
<SickCertificatesProvider>

          {children}
</SickCertificatesProvider>
          </ConsultationsProvider>
       
          </ServicesProvider>
          <Toaster  position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
