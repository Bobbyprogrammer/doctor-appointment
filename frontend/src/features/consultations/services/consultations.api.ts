import api from "@/lib/axios";
import type {
  CreateConsultationPayload,
  CreateConsultationResponse,
  GetMyConsultationsResponse,
} from "@/types/consultation";



export const createConsultationApi = async (
  payload: CreateConsultationPayload & { files?: File[] }
) => {
  const formData = new FormData();

  formData.append("serviceId", payload.serviceId);

  if (payload.patientType) {
    formData.append("patientType", payload.patientType);
  }

  if (payload.patientDob) {
    formData.append("patientDob", payload.patientDob);
  }

  if (payload.scheduledAt) {
    formData.append("scheduledAt", payload.scheduledAt);
  }

  if (payload.notes) {
    formData.append("notes", payload.notes);
  }

  // IMPORTANT: stringify objects
  if (payload.questionnaireAnswers) {
    formData.append(
      "questionnaireAnswers",
      JSON.stringify(payload.questionnaireAnswers)
    );
  }

  if (payload.redFlags) {
    formData.append("redFlags", JSON.stringify(payload.redFlags));
  }

  // FILES
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const { data } = await api.post<CreateConsultationResponse>(
    "/consultations",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getMyConsultationsApi = async () => {
  const { data } = await api.get<GetMyConsultationsResponse>(
    "/consultations/my"
  );
  return data;
};