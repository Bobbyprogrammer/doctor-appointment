"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import {
  createSickCertificateRequestApi,
  getMySickCertificateRequestsApi,
} from "../services/sickCertificates.api";
import type {
  SickCertificate,
  SickCertificatesContextType,
  CreateSickCertificatePayload,
  CreateSickCertificateResponse,
} from "@/types/sick-certificate";

const SickCertificatesContext = createContext<
  SickCertificatesContextType | undefined
>(undefined);

export const SickCertificatesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [requests, setRequests] = useState<SickCertificate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getMySickCertificateRequestsApi();

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching sick certificates:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const createSickCertificateRequest = async (
    payload: CreateSickCertificatePayload
  ): Promise<CreateSickCertificateResponse> => {
    try {
      const data = await createSickCertificateRequestApi(payload);

      if (data.success) {
        setRequests((prev) => [data.request, ...prev]);
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        request: {} as any,
      };
    }
  };

  const startSickCertificatePayment = async (
    requestId: string
  ): Promise<{ success: boolean; url?: string; message: string }> => {
    try {
      const { data } = await api.post(
        `/sick-certificates/${requestId}/checkout-session`
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
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to start payment",
      };
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <SickCertificatesContext.Provider
      value={{
        requests,
        loading,
        createSickCertificateRequest,
        fetchMyRequests,
        startSickCertificatePayment,
      }}
    >
      {children}
    </SickCertificatesContext.Provider>
  );
};

export const useSickCertificates = () => {
  const context = useContext(SickCertificatesContext);

  if (!context) {
    throw new Error(
      "useSickCertificates must be used within SickCertificatesProvider"
    );
  }

  return context;
};