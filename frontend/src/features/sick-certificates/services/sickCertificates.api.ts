import api from "@/lib/axios";
import type {
  CreateSickCertificatePayload,
  CreateSickCertificateResponse,
  GetSickCertificatesResponse,
} from "@/types/sick-certificate";

export const createSickCertificateRequestApi = async (
  payload: CreateSickCertificatePayload
) => {
  const formData = new FormData();

  formData.append("certificatePurpose", payload.certificatePurpose);
  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("dateOfBirth", payload.dateOfBirth);
  formData.append("gender", payload.gender);

  formData.append("addressLine1", payload.addressLine1);
  formData.append("addressLine2", payload.addressLine2 || "");
  formData.append("city", payload.city);
  formData.append("stateRegion", payload.stateRegion || "");
  formData.append("postalCode", payload.postalCode || "");
  formData.append("country", payload.country);

  formData.append("employerOrOrganization", payload.employerOrOrganization);
  formData.append("consultationReason", payload.consultationReason);
  formData.append("hasMedicalEmergency", String(payload.hasMedicalEmergency));
  formData.append("canTravelToClinic", String(payload.canTravelToClinic));
  formData.append("isPregnant", String(payload.isPregnant));
  formData.append("awareOfRedFlags", String(payload.awareOfRedFlags));

  formData.append("symptoms", JSON.stringify(payload.symptoms));
  formData.append("illnessDescription", payload.illnessDescription);

  formData.append("startDate", payload.startDate);
  formData.append("endDate", payload.endDate);

  formData.append("variationType", payload.variationType);
  formData.append("amount", String(payload.amount));

  if (payload.proofFiles?.length) {
    payload.proofFiles.forEach((file) => {
      formData.append("proofFiles", file);
    });
  }

  const { data } = await api.post<CreateSickCertificateResponse>(
    "/sick-certificates",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getMySickCertificateRequestsApi = async () => {
  const { data } = await api.get<GetSickCertificatesResponse>(
    "/sick-certificates/my"
  );
  return data;
};