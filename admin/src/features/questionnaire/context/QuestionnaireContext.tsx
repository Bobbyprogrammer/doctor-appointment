"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  getAllQuestionnairesApi,
  getQuestionnaireByIdApi,
  createQuestionnaireApi,
  updateQuestionnaireApi,
  deleteQuestionnaireApi,
} from "../services/questionnaire.api";
import type {
  Questionnaire,
  CreateQuestionnairePayload,
} from "@/types/questionnaire";

interface QuestionnaireContextType {
  questionnaires: Questionnaire[];
  loading: boolean;
  fetchQuestionnaires: () => Promise<void>;
  getQuestionnaireById: (id: string) => Promise<Questionnaire | null>;
  createQuestionnaire: (payload: CreateQuestionnairePayload) => Promise<boolean>;
  updateQuestionnaire: (
    id: string,
    payload: Partial<CreateQuestionnairePayload>
  ) => Promise<boolean>;
  deleteQuestionnaire: (id: string) => Promise<boolean>;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(
  undefined
);

export const QuestionnaireProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const data = await getAllQuestionnairesApi();

      if (data.success) {
        setQuestionnaires(data.questionnaires || []);
      } else {
        setQuestionnaires([]);
      }
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionnaireById = async (id: string) => {
    try {
      const data = await getQuestionnaireByIdApi(id);
      if (data.success) return data.questionnaire;
      return null;
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      return null;
    }
  };

  const createQuestionnaire = async (payload: CreateQuestionnairePayload) => {
    try {
      const data = await createQuestionnaireApi(payload);
      if (data.success) {
        await fetchQuestionnaires();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      return false;
    }
  };

  const updateQuestionnaire = async (
    id: string,
    payload: Partial<CreateQuestionnairePayload>
  ) => {
    try {
      const data = await updateQuestionnaireApi(id, payload);
      if (data.success) {
        await fetchQuestionnaires();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating questionnaire:", error);
      return false;
    }
  };

  const deleteQuestionnaire = async (id: string) => {
    try {
      const data = await deleteQuestionnaireApi(id);
      if (data.success) {
        setQuestionnaires((prev) => prev.filter((item) => item._id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
      return false;
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        questionnaires,
        loading,
        fetchQuestionnaires,
        getQuestionnaireById,
        createQuestionnaire,
        updateQuestionnaire,
        deleteQuestionnaire,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaires = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error("useQuestionnaires must be used within QuestionnaireProvider");
  }
  return context;
};