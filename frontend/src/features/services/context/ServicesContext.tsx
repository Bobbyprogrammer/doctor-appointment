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
  Service,
  GetServicesResponse,
  ServiceContextType,
} from "@/types/service";

const ServicesContext = createContext<ServiceContextType | undefined>(undefined);

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider = ({ children }: ServicesProviderProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchServices = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.get<GetServicesResponse>("/services/all");


      if (data.success) {
        const activeServices = (data.services || []).filter(
          (service) => service.isActive
        );
        setServices(activeServices);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const getServiceBySlug = (slug: string) => {
    return services.find((service) => service.slug === slug);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        loading,
        fetchServices,
        getServiceBySlug,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = (): ServiceContextType => {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error("useServices must be used within a ServicesProvider");
  }

  return context;
};