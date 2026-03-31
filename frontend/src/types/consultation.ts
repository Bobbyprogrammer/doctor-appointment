export type PatientType = "self" | "child" | "other";

export type ConsultationStatus =
  | "pending_payment"
  | "waiting_for_review"
  | "under_review"
  | "doctor_message_sent"
  | "completed"
  | "rejected"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface ConsultationFile {
  name: string;
  url: string;
  public_id: string;
  type: string;
}

export interface ConsultationQuestionnaireAnswers {
  [key: string]: string | number | boolean | null;
}

export interface ConsultationQuestionnaireAnswerInput {
  questionId: string;
  answer: any;
}
export interface ConsultationUser {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  profilePic?: {
    url: string;
    public_id?: string;
  };
}

export interface ConsultationService {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  price?: number;
  discountedPrice?: number | null;
  durationMinutes?: number;
  doctorType?: string;
  category?: string;
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

  patientId: string | ConsultationUser;
  doctorId: string | ConsultationUser | null;
  serviceId: string | ConsultationService;

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

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConsultationPayload {
  serviceId: string;
  scheduledAt?: string | null;
  notes?: string;
  patientType?: PatientType;
  patientDob?: string | null;
   questionnaireAnswers?: ConsultationQuestionnaireAnswerInput[];
  redFlags?: Record<string, boolean>;
  files?: File[];
}

export interface ConsultationQuestionnaireAnswer {
  questionId: string;
  questionKey: string;
  questionText: string;
  questionType: string;
  answer: string | number | boolean | string[] | null;
}

export interface CreateConsultationResponse {
  success: boolean;
  message: string;
  consultation: Consultation;
}

export interface GetMyConsultationsResponse {
  success: boolean;
  count?: number;
  consultations: Consultation[];
  message?: string;
}

export interface ConsultationsContextType {
  consultations: Consultation[];
  loading: boolean;
  createConsultation: (
    payload: CreateConsultationPayload
  ) => Promise<CreateConsultationResponse>;
  fetchMyConsultations: () => Promise<void>;
}