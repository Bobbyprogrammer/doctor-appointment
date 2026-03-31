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
  Doctor,
  DoctorsContextType,
  CreateDoctorPayload,
  UpdateDoctorPayload,
  GetDoctorsResponse,
  CreateDoctorResponse,
  UpdateDoctorResponse,
  DeleteDoctorResponse,
} from "@/types/doctor"
import toast from "react-hot-toast";

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

interface DoctorsProviderProps {
  children: ReactNode;
}

export const DoctorsProvider = ({ children }: DoctorsProviderProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDoctors = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.get<GetDoctorsResponse>("/doctors");

      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const addDoctor = async (payload: CreateDoctorPayload): Promise<boolean> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", payload.firstName);
      formData.append("lastName", payload.lastName);
      formData.append("email", payload.email);
      formData.append("password", payload.password);

      if (payload.phone) formData.append("phone", payload.phone);
      if (payload.profilePic) formData.append("profilePic", payload.profilePic);
      if (payload.specialization) formData.append("specialization", payload.specialization);
      if (payload.licenseNumber) formData.append("licenseNumber", payload.licenseNumber);
      if (payload.experienceYears !== undefined) {
        formData.append("experienceYears", String(payload.experienceYears));
      }
      if (payload.consultationFee !== undefined) {
        formData.append("consultationFee", String(payload.consultationFee));
      }
      if (payload.gender) formData.append("gender", payload.gender);
      if (payload.dateOfBirth) formData.append("dateOfBirth", payload.dateOfBirth);
      if (payload.address) formData.append("address", payload.address);
      if (payload.bio) formData.append("bio", payload.bio);
      if (payload.status) formData.append("status", payload.status);

      if (payload.availableDays?.length) {
        formData.append("availableDays", JSON.stringify(payload.availableDays));
      }

      if (payload.qualification?.length) {
        formData.append("qualification", JSON.stringify(payload.qualification));
      }

      if (payload.workStartTime) {
        formData.append("workStartTime", payload.workStartTime);
      }

      if (payload.workEndTime) {
        formData.append("workEndTime", payload.workEndTime);
      }

      if (payload.documents?.length) {
        payload.documents.forEach((file) => {
          formData.append("documents", file);
        });
      }
      const { data } = await api.post<CreateDoctorResponse>("/doctors/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setDoctors((prev) => [data.doctor, ...prev]);
        toast.success("doctor added")
        return true;
      }

      return false;
    } catch (error:any) {
      console.error("Error creating doctor:", error);
        toast.error(error.response.data.message)
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editDoctor = async (
    doctorId: string,
    payload: UpdateDoctorPayload
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
      if (payload.specialization) formData.append("specialization", payload.specialization);
      if (payload.licenseNumber) formData.append("licenseNumber", payload.licenseNumber);
      if (payload.experienceYears !== undefined) {
        formData.append("experienceYears", String(payload.experienceYears));
      }
      if (payload.consultationFee !== undefined) {
        formData.append("consultationFee", String(payload.consultationFee));
      }
      if (payload.gender) formData.append("gender", payload.gender);
      if (payload.dateOfBirth) formData.append("dateOfBirth", payload.dateOfBirth);
      if (payload.address) formData.append("address", payload.address);
      if (payload.bio) formData.append("bio", payload.bio);
      if (payload.status) formData.append("status", payload.status);

      if (payload.availableDays?.length) {
        formData.append("availableDays", JSON.stringify(payload.availableDays));
      }

      if (payload.qualification?.length) {
        formData.append("qualification", JSON.stringify(payload.qualification));
      }

      if (payload.workStartTime) {
        formData.append("workStartTime", payload.workStartTime);
      }

      if (payload.workEndTime) {
        formData.append("workEndTime", payload.workEndTime);
      }

      if (payload.isActive !== undefined) {
        formData.append("isActive", String(payload.isActive));
      }

      if (payload.documents?.length) {
        payload.documents.forEach((file) => {
          formData.append("documents", file);
        });
      }
      const { data } = await api.put<UpdateDoctorResponse>(
        `/doctors/update/${doctorId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setDoctors((prev) =>
          prev.map((doctor) =>
            (doctor._id || doctor.id) === doctorId ? data.doctor : doctor
          )
        );
        toast.success("doctor updated")
        return true;
      }

      return false;
    } catch (error:any) {
      console.error("Error updating doctor:", error);
      toast.error(error.response.data.message)
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (doctorId: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { data } = await api.delete<DeleteDoctorResponse>(
        `/doctors/delete/${doctorId}`
      );

      if (data.success) {
        setDoctors((prev) =>
          prev.filter((doctor) => (doctor._id || doctor.id) !== doctorId)
        );
         toast.success("doctor deleted")
        return true;
      }

      return false;
    } catch (error:any) {
      console.error("Error deleting doctor:", error);
       toast.error(error.response.data.message)
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        loading,
        fetchDoctors,
        addDoctor,
        editDoctor,
        deleteDoctor,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};

export const useDoctors = (): DoctorsContextType => {
  const context = useContext(DoctorsContext);

  if (!context) {
    throw new Error("useDoctors must be used within a DoctorsProvider");
  }

  return context;
};