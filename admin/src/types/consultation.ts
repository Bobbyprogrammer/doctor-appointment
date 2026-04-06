export type ConsultationStatus =
  | "pending_payment"
  | "waiting_for_review"
  | "under_review"
  | "doctor_message_sent"
  | "completed"
  | "rejected"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type PatientType = "self" | "child" | "other";

export interface ConsultationFile {
  name: string;
  url: string;
  public_id: string;
  type: string;
}

export interface ConsultationService {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface ConsultationUser {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ConsultationPharmacySnapshot {
  registrationNumber?: string;
  name?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  street3?: string;
  town?: string;
  county?: string;
  eircode?: string;
}

export interface ConsultationPharmacy {
  _id?: string;
  id?: string;
  registrationNumber?: string;
  name: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  street3?: string;
  town?: string;
  county?: string;
  eircode?: string;
}

export interface ConsultationQuestionnaireAnswer {
  questionId: string;
  questionKey: string;
  questionText: string;
  questionType: string;
  answer: string | number | boolean | string[] | null;
}

export interface Consultation {
  _id?: string;
  id?: string;
  patientId: ConsultationUser | string;
  doctorId: ConsultationUser | string | null;
  serviceId: ConsultationService | string;
  patientType: PatientType;
  patientDob: string | null;
  scheduledAt: string | null;
  status: ConsultationStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  notes: string;
  questionnaireAnswers: ConsultationQuestionnaireAnswer[];
  files: ConsultationFile[];
  reference: string;
  hasEmergencyFlag: boolean;

  pharmacySelectionType?: "listed" | "other" | "none";
  selectedPharmacyId?: string | ConsultationPharmacy | null;
  selectedPharmacySnapshot?: ConsultationPharmacySnapshot;

  createdAt?: string;
  updatedAt?: string;
}

export interface GetConsultationsResponse {
  success: boolean;
  count?: number;
  consultations: Consultation[];
  message?: string;
}

export interface ConsultationsContextType {
  consultations: Consultation[];
  loading: boolean;
  fetchAdminConsultations: () => Promise<void>;
}

export interface AssignableDoctor {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
  availableDays?: string[];
  workStartTime?: string | null;
  workEndTime?: string | null;
  activeConsultations?: number;
  isGp?: boolean;
  isRelated?: boolean;
}

export interface AssignDoctorResponse {
  success: boolean;
  message: string;
  consultation?: Consultation;
}

export interface GetAssignableDoctorsResponse {
  success: boolean;
  consultationId?: string;
  serviceDoctorType?: string;
  doctors: AssignableDoctor[];
  message?: string;
}

export interface ExtendedConsultationsContextType
  extends ConsultationsContextType {
  doctors: AssignableDoctor[];
  doctorsLoading: boolean;
  fetchAssignableDoctors: () => Promise<void>;
  assignDoctorToConsultation: (
    consultationId: string,
    doctorId: string,
    note?: string
  ) => Promise<{ success: boolean; message: string }>;
}