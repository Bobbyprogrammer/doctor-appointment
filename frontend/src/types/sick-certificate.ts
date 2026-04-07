export type SickCertificateStatus =
  | "pending_payment"
  | "waiting_for_review"
  | "under_review"
  | "approved"
  | "certificate_generated"
  | "rejected"
  | "cancelled";

export type SickCertificatePaymentStatus = "unpaid" | "paid" | "refunded";

export type SickCertificatePurpose =
  | "studies"
  | "work"
  | "travel"
  | "work_from_home";

export type SickCertificateVariation = "express" | "standard";

export interface SickCertificateFile {
  name: string;
  url: string;
  public_id: string;
  type: string;
}

export interface SickCertificateUser {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SickCertificate {
  _id?: string;
  id?: string;

  patientId: SickCertificateUser | string;
  doctorId: SickCertificateUser | string | null;

  reference: string;

  certificatePurpose: SickCertificatePurpose;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";

  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateRegion?: string;
  postalCode?: string;
  country: string;

  employerOrOrganization: string;
  consultationReason: string;
  hasMedicalEmergency: boolean;
  canTravelToClinic: boolean;
  isPregnant: boolean;
  awareOfRedFlags: boolean;
  symptoms: string[];
  illnessDescription: string;

  startDate: string;
  endDate: string;

  proofFiles: SickCertificateFile[];

  variationType: SickCertificateVariation;
  amount: number;
reason: string;
  paymentStatus: SickCertificatePaymentStatus;
  status: SickCertificateStatus;

  doctorReviewNotes?: string;

  certificateIssueDate?: string | null;
  certificatePdfUrl?: string;
  certificatePdfPublicId?: string;

  sentToPatientEmail?: boolean;
  sentToPatientEmailAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSickCertificatePayload {
  certificatePurpose: SickCertificatePurpose;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";

  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateRegion?: string;
  postalCode?: string;
  country: string;

  employerOrOrganization: string;
  consultationReason: string;
  hasMedicalEmergency: boolean;
  canTravelToClinic: boolean;
  isPregnant: boolean;
  awareOfRedFlags: boolean;
  symptoms: string[];
  illnessDescription: string;

  startDate: string;
  endDate: string;

  variationType: SickCertificateVariation;
  amount: number;

  proofFiles?: File[];
}

export interface CreateSickCertificateResponse {
  success: boolean;
  message: string;
  request: SickCertificate;
}

export interface GetSickCertificatesResponse {
  success: boolean;
  count?: number;
  requests: SickCertificate[];
  message?: string;
}

export interface SickCertificatesContextType {
  requests: SickCertificate[];
  loading: boolean;
  createSickCertificateRequest: (
    payload: CreateSickCertificatePayload
  ) => Promise<CreateSickCertificateResponse>;
  fetchMyRequests: () => Promise<void>;
  startSickCertificatePayment: (
    requestId: string
  ) => Promise<{ success: boolean; url?: string; message: string }>;
}



export type SickCertificateRequest = SickCertificate;