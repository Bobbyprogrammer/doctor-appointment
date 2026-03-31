import api from "@/lib/axios";
import type { CreateQuestionnairePayload, Questionnaire } from "@/types/questionnaire";

export interface GetQuestionnairesResponse {
  success: boolean;
  count?: number;
  questionnaires: Questionnaire[];
  message?: string;
}

export interface GetQuestionnaireResponse {
  success: boolean;
  questionnaire: Questionnaire;
  message?: string;
}

export const getAllQuestionnairesApi = async () => {
  const { data } = await api.get<GetQuestionnairesResponse>("/questionnaires");
  return data;
};

export const getQuestionnaireByIdApi = async (id: string) => {
  const { data } = await api.get<GetQuestionnaireResponse>(`/questionnaires/${id}`);
  return data;
};

export const createQuestionnaireApi = async (payload: CreateQuestionnairePayload) => {
  const { data } = await api.post("/questionnaires", payload);
  return data;
};

export const updateQuestionnaireApi = async (
  id: string,
  payload: Partial<CreateQuestionnairePayload>
) => {
  const { data } = await api.put(`/questionnaires/${id}`, payload);
  return data;
};

export const deleteQuestionnaireApi = async (id: string) => {
  const { data } = await api.delete(`/questionnaires/${id}`);
  return data;
};