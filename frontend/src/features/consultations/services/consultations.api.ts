import api from "@/lib/axios";
import type {
  CreateConsultationPayload,
  CreateConsultationResponse,
  GetMyConsultationsResponse,
} from "@/types/consultation";

export const createConsultationApi = async (
  payload: CreateConsultationPayload
): Promise<CreateConsultationResponse> => {
  const formData = new FormData();

  formData.append("serviceId", payload.serviceId);

  if (payload.patientType) {
    formData.append("patientType", payload.patientType);
  }

  if (payload.patientDob) {
    formData.append("patientDob", payload.patientDob);
  }

  if (payload.patientAddress) {
  formData.append(
    "patientAddress",
    JSON.stringify(payload.patientAddress)
  );
}

  if (payload.scheduledAt) {
    formData.append("scheduledAt", payload.scheduledAt);
  }

  if (payload.notes) {
    formData.append("notes", payload.notes);
  }

  if (payload.questionnaireAnswers) {
    formData.append(
      "questionnaireAnswers",
      JSON.stringify(payload.questionnaireAnswers)
    );
  }

  if (payload.redFlags) {
    formData.append("redFlags", JSON.stringify(payload.redFlags));
  }

  // pharmacy fields
  formData.append(
    "pharmacySelectionType",
    payload.pharmacySelectionType || "none"
  );

  if (payload.selectedPharmacyId) {
    formData.append("selectedPharmacyId", payload.selectedPharmacyId);
  }

  if (payload.selectedPharmacyOther) {
    formData.append(
      "selectedPharmacyOther",
      JSON.stringify(payload.selectedPharmacyOther)
    );
  }

  // files
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  // debug
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
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

export const getMyConsultationsApi = async (): Promise<GetMyConsultationsResponse> => {
  const { data } = await api.get<GetMyConsultationsResponse>(
    "/consultations/my"
  );
  return data;
};