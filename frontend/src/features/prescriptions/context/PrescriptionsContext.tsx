"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import type {
  Prescription,
  GetMyPrescriptionsResponse,
  PrescriptionsContextType,
} from "@/types/prescription";

const PrescriptionsContext = createContext<PrescriptionsContextType | undefined>(
  undefined
);

export const PrescriptionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyPrescriptions = async () => {
    try {
      setLoading(true);

      const { data } = await api.get<GetMyPrescriptionsResponse>(
        "/prescriptions/my"
      );

      if (data.success) {
        setPrescriptions(data.prescriptions || []);
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.log("Error fetching prescriptions:", error);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrescriptionsContext.Provider
      value={{
        prescriptions,
        loading,
        fetchMyPrescriptions,
      }}
    >
      {children}
    </PrescriptionsContext.Provider>
  );
};

export const usePrescriptions = () => {
  const context = useContext(PrescriptionsContext);

  if (!context) {
    throw new Error(
      "usePrescriptions must be used within PrescriptionsProvider"
    );
  }

  return context;
};