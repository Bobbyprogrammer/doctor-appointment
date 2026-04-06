"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import type {
  Consultation,
  ConsultationsContextType,
  GetConsultationsResponse,
} from "@/types/consultation";

export interface AssignableDoctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
}

interface ExtendedConsultationsContextType extends ConsultationsContextType {
  doctors: AssignableDoctor[];
  doctorsLoading: boolean;
  fetchAssignableDoctors: () => Promise<void>;
  assignDoctorToConsultation: (
    consultationId: string,
    doctorId: string,
    note?: string
  ) => Promise<{ success: boolean; message: string }>;
}

const ConsultationsContext = createContext<
  ExtendedConsultationsContextType | undefined
>(undefined);

interface ConsultationsProviderProps {
  children: ReactNode;
}

export const ConsultationsProvider = ({
  children,
}: ConsultationsProviderProps) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [doctors, setDoctors] = useState<AssignableDoctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState<boolean>(false);

  const fetchAdminConsultations = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.get<GetConsultationsResponse>(
        "/consultations/admin"
      );

      if (data.success) {
        setConsultations(data.consultations || []);
      } else {
        setConsultations([]);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignableDoctors = async (): Promise<void> => {
    try {
      setDoctorsLoading(true);

      // use your real backend endpoint here
      const { data } = await api.get("/doctors/admin/list");

      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const assignDoctorToConsultation = async (
    consultationId: string,
    doctorId: string,
    note = ""
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.patch(
        `/consultations/admin/${consultationId}/assign-doctor`,
        {
          doctorId,
          note,
        }
      );

      if (data.success) {
        await fetchAdminConsultations();
        return {
          success: true,
          message: data.message || "Doctor assigned successfully",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to assign doctor",
      };
    } catch (error: any) {
      console.error("Error assigning doctor:", error);

      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to assign doctor",
      };
    }
  };

  useEffect(() => {
    fetchAdminConsultations();
    fetchAssignableDoctors();
  }, []);

  return (
    <ConsultationsContext.Provider
      value={{
        consultations,
        loading,
        fetchAdminConsultations,
        doctors,
        doctorsLoading,
        fetchAssignableDoctors,
        assignDoctorToConsultation,
      }}
    >
      {children}
    </ConsultationsContext.Provider>
  );
};

export const useConsultations = (): ExtendedConsultationsContextType => {
  const context = useContext(ConsultationsContext);

  if (!context) {
    throw new Error(
      "useConsultations must be used within a ConsultationsProvider"
    );
  }

  return context;
};