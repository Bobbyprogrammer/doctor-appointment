"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createConsultationApi,
  getMyConsultationsApi,
} from "../services/consultations.api";
import api from "@/lib/axios";
import type {
  Consultation,
  ConsultationsContextType,
  CreateConsultationPayload,
  CreateConsultationResponse,
} from "@/types/consultation";

type StartConsultationPaymentResponse = {
  success: boolean;
  url?: string;
  message: string;
};

interface ExtendedConsultationsContextType extends ConsultationsContextType {
  startConsultationPayment: (
    consultationId: string
  ) => Promise<StartConsultationPaymentResponse>;
  refreshConsultationAfterPayment: () => Promise<void>;
}

const ConsultationsContext = createContext<
  ExtendedConsultationsContextType | undefined
>(undefined);

export const ConsultationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyConsultations = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getMyConsultationsApi();

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

  const createConsultation = async (
    payload: CreateConsultationPayload
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

  const startConsultationPayment = async (
    consultationId: string
  ): Promise<StartConsultationPaymentResponse> => {
    try {
      const { data } = await api.post(
        `/consultations/${consultationId}/checkout-session`
      );

      if (data.success) {
        return {
          success: true,
          url: data.url,
          message: data.message || "Checkout session created successfully",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to create checkout session",
      };
    } catch (error: any) {
      console.error("Error starting consultation payment:", error);

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to start payment",
      };
    }
  };

  const refreshConsultationAfterPayment = async (): Promise<void> => {
    await fetchMyConsultations();
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
        startConsultationPayment,
        refreshConsultationAfterPayment,
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