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
  Patient,
  PatientsContextType,
  CreatePatientPayload,
  UpdatePatientPayload,
  GetPatientsResponse,
  CreatePatientResponse,
  UpdatePatientResponse,
  DeletePatientResponse,
} from "@/types/patient";
import toast from "react-hot-toast";

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

interface PatientsProviderProps {
  children: ReactNode;
}

export const PatientsProvider = ({ children }: PatientsProviderProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPatients = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.get<GetPatientsResponse>("/patients/all");

      if (data.success) {
        setPatients(data.patients || []);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };


  const addPatient = async (payload: CreatePatientPayload): Promise<boolean> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", payload.firstName);
      formData.append("lastName", payload.lastName);
      formData.append("email", payload.email);
      formData.append("password", payload.password);

      if (payload.phone) {
        formData.append("phone", payload.phone);
      }

      if (payload.profilePic) {
        formData.append("profilePic", payload.profilePic);
      }

      const { data } = await api.post<CreatePatientResponse>("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setPatients((prev) => [data.user, ...prev]);
        toast.success("patient added")
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error creating patient:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editPatient = async (
    patientId: string,
    payload: UpdatePatientPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const formData = new FormData();

      if (payload.firstName) formData.append("firstName", payload.firstName);
      if (payload.lastName) formData.append("lastName", payload.lastName);
      if (payload.email) formData.append("email", payload.email);
      if (payload.password) formData.append("password", payload.password);
      if (payload.phone) formData.append("phone", payload.phone);
      if (payload.profilePic) formData.append("profilePic", payload.profilePic);

      const { data } = await api.put<UpdatePatientResponse>(
        `/patients/update/${patientId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setPatients((prev) =>
          prev.map((patient) =>
            (patient._id || patient.id) === patientId ? data.user : patient
          )
        );
         toast.success("patient updated")
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating patient:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (patientId: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { data } = await api.delete<DeletePatientResponse>(`/patients/delete/${patientId}`);

      if (data.success) {
        setPatients((prev) =>
          prev.filter((patient) => (patient._id || patient.id) !== patientId)
        );
         toast.success("patient deleted")
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting patient:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        loading,
        fetchPatients,
        addPatient,
        editPatient,
        deletePatient,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = (): PatientsContextType => {
  const context = useContext(PatientsContext);

  if (!context) {
    throw new Error("usePatients must be used within a PatientsProvider");
  }

  return context;
};