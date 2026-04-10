export interface PrescriptionMedicine {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface PrescriptionFile {
  name: string;
  url: string;
  public_id: string;
  type: string;
}

export interface PrescriptionUser {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PrescriptionConsultation {
  _id?: string;
  id?: string;
  reference?: string;
  status?: string;
}

export interface Prescription {
  _id?: string;
  id?: string;
  consultationId?: string | PrescriptionConsultation | null;
  patientId?: string | PrescriptionUser | null;
  doctorId?: string | PrescriptionUser | null;
  reference?: string;
  diagnosis?: string;
  notes?: string;
  medicines: PrescriptionMedicine[];
  files?: PrescriptionFile[];
  issuedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetMyPrescriptionsResponse {
  success: boolean;
  prescriptions: Prescription[];
  message?: string;
}

export interface PrescriptionsContextType {
  prescriptions: Prescription[];
  loading: boolean;
  fetchMyPrescriptions: () => Promise<void>;
}