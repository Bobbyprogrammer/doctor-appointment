export interface ProfilePic {
  url: string;
  public_id: string;
}

export interface Patient {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  role?: "patient";
  profilePic?: ProfilePic;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  profilePic?: File | null;
}

export interface UpdatePatientPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  profilePic?: File | null;
}

export interface GetPatientsResponse {
  success: boolean;
  patients: Patient[];
  message?: string;
}

export interface CreatePatientResponse {
  success: boolean;
  message: string;
  user: Patient;
}

export interface UpdatePatientResponse {
  success: boolean;
  message: string;
  user: Patient;
}

export interface DeletePatientResponse {
  success: boolean;
  message: string;
}

export interface PatientsContextType {
  patients: Patient[];
  loading: boolean;
  fetchPatients: () => Promise<void>;
  addPatient: (payload: CreatePatientPayload) => Promise<boolean>;
  editPatient: (patientId: string, payload: UpdatePatientPayload) => Promise<boolean>;
  deletePatient: (patientId: string) => Promise<boolean>;
}