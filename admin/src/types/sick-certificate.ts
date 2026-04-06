export type SickCertificateStatus =
  | "pending_payment"
  | "waiting_for_review"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface SickCertificateUser {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SickCertificateDoctor {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SickCertificateRequest {
  _id?: string;
  id?: string;
  reference: string;

  patientId: SickCertificateUser | string;
  doctorId?: SickCertificateDoctor | string | null;

  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string | null;

  reason?: string;
  symptoms?: string;
  startDate?: string | null;
  endDate?: string | null;

  workType?: string;
  employerName?: string;
  additionalNotes?: string;

  variationType?: "express" | "standard";
  amount: number;

  status: SickCertificateStatus;
  paymentStatus: PaymentStatus;

  proofFiles?: {
    name: string;
    url: string;
    public_id: string;
    type: string;
  }[];

  pdfUrl?: string;
  pdfPublicId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface GetAdminSickCertificatesResponse {
  success: boolean;
  count?: number;
  requests: SickCertificateRequest[];
  message?: string;
}

export interface AssignableDoctor {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
}

export interface GetAssignableDoctorsResponse {
  success: boolean;
  doctors: AssignableDoctor[];
  message?: string;
}

export interface AssignDoctorResponse {
  success: boolean;
  message: string;
  request?: SickCertificateRequest;
}