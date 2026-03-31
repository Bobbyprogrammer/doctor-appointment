export type UserRole = "patient" | "doctor" | "admin" | "super_admin";

export type DoctorGender = "male" | "female" | "other";

export type DoctorStatus = "pending" | "approved" | "rejected" | "suspended";

export type AvailableDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ProfilePic {
  url: string;
  public_id: string;
}

export interface DoctorQualification {
  degree: string;
  institute: string;
  year: number | null;
}

export interface DoctorDocument {
  name: string;
  url: string;
  public_id: string;
  type: string;
}

export interface DoctorProfile {
  _id?: string;
  userId?: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  gender: DoctorGender;
  dateOfBirth: string | null;
  phone: string;
  address: string;
  bio: string;
  qualification: DoctorQualification[];
  documents: DoctorDocument[];
  status: DoctorStatus;
  availableDays: AvailableDay[];
  workStartTime?: string | null;
  workEndTime?: string | null;
  createdBy: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdBy?: string | null;
  profilePic?: ProfilePic;
  doctorProfile: DoctorProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  profilePic?: File | null;

  specialization: string;
  licenseNumber: string;
  experienceYears?: number;
  consultationFee?: number;
  gender?: DoctorGender;
  dateOfBirth?: string | null;
  address?: string;
  bio?: string;
  qualification?: DoctorQualification[];
  documents?: File[] | null;
  status?: DoctorStatus;
  availableDays?: AvailableDay[];
  workStartTime?: string | null;
  workEndTime?: string | null;
}

export interface UpdateDoctorPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  profilePic?: File | null;
  isActive?: boolean;

  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
  consultationFee?: number;
  gender?: DoctorGender;
  dateOfBirth?: string | null;
  address?: string;
  bio?: string;
  qualification?: DoctorQualification[];
  documents?: File[] | null;
  status?: DoctorStatus;
  availableDays?: AvailableDay[];
  workStartTime?: string | null;
  workEndTime?: string | null;
}

export interface GetDoctorsResponse {
  success: boolean;
  doctors: Doctor[];
  message?: string;
}

export interface GetDoctorByIdResponse {
  success: boolean;
  doctor: Doctor;
  message?: string;
}

export interface CreateDoctorResponse {
  success: boolean;
  message: string;
  doctor: Doctor;
}

export interface UpdateDoctorResponse {
  success: boolean;
  message: string;
  doctor: Doctor;
}

export interface DeleteDoctorResponse {
  success: boolean;
  message: string;
}

export interface DoctorsContextType {
  doctors: Doctor[];
  loading: boolean;
  fetchDoctors: () => Promise<void>;
  addDoctor: (payload: CreateDoctorPayload) => Promise<boolean>;
  editDoctor: (doctorId: string, payload: UpdateDoctorPayload) => Promise<boolean>;
  deleteDoctor: (doctorId: string) => Promise<boolean>;
}