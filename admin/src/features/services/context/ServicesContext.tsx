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
  ServicesContextType,
  CreateServicePayload,
  UpdateServicePayload,
  GetServicesResponse,
  CreateServiceResponse,
  UpdateServiceResponse,
  DeleteServiceResponse,
} from "@/types/service";
import toast from "react-hot-toast";

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

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
        setServices(data.services || []);
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

  const addService = async (payload: CreateServicePayload): Promise<boolean> => {
    try {
      setLoading(true);

      const { data } = await api.post<CreateServiceResponse>("/services/create", payload);

      if (data.success) {
        setServices((prev) => [data.service, ...prev]);
        toast.success("service added")
        return true;
      }

      return false;
    } catch (error:any) {
      console.error("Error creating service:", error);
      toast.error(error.response.data.message)
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editService = async (
    serviceId: string,
    payload: UpdateServicePayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const { data } = await api.put<UpdateServiceResponse>(
        `/services/update/${serviceId}`,
        payload
      );

      if (data.success) {
        setServices((prev) =>
          prev.map((service) =>
            (service._id || service.id) === serviceId ? data.service : service
          )
        );
        toast.success("service updated")
        return true;
      }

      return false;
    } catch (error:any) {
      console.error("Error updating service:", error);
       toast.success(error.response.data.message)
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { data } = await api.delete<DeleteServiceResponse>(`/services/delete/${serviceId}`);

      if (data.success) {
        setServices((prev) =>
          prev.filter((service) => (service._id || service.id) !== serviceId)
        );
         toast.success("service deleted")
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting service:", error);
      return false;
    } finally {
      setLoading(false);
    }
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
        addService,
        editService,
        deleteService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = (): ServicesContextType => {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error("useServices must be used within a ServicesProvider");
  }

  return context;
};