"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {toast} from "react-hot-toast"
import {
  createConsultationApi,
  getMyConsultationsApi,
} from "../services/consultations.api";
import type {
  Consultation,
  ConsultationsContextType,
  CreateConsultationPayload,
  CreateConsultationResponse,
} from "@/types/consultation";

const ConsultationsContext = createContext<ConsultationsContextType | undefined>(
  undefined
);

export const ConsultationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyConsultations = async () => {
    try {
      setLoading(true);
      const data = await getMyConsultationsApi();

      if (data.success) {
        setConsultations(data.consultations || []);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

const createConsultation = async (
  payload: CreateConsultationPayload & { files?: File[] }
): Promise<CreateConsultationResponse> => {
  try {
    const data = await createConsultationApi(payload);

    if (data.success) {
      setConsultations((prev) => [data.consultation, ...prev]);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
      consultation: {} as any,
    };
  }
};

  useEffect(() => {
    fetchMyConsultations();
  }, []);

  return (
    <ConsultationsContext.Provider
      value={{
        consultations,
        loading,
        createConsultation,
        fetchMyConsultations,
      }}
    >
      {children}
    </ConsultationsContext.Provider>
  );
};

export const useConsultations = () => {
  const context = useContext(ConsultationsContext);

  if (!context) {
    throw new Error(
      "useConsultations must be used within a ConsultationsProvider"
    );
  }

  return context;
};