export type QuestionType =
  | "short_text"
  | "long_text"
  | "single_select"
  | "multi_select"
  | "yes_no"
  | "number"
  | "date";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuestionShowIf {
  questionKey: string;
  operator: "equals" | "not_equals" | "includes";
  value: string | number | boolean | null;
}

export interface QuestionnaireQuestion {
  _id?: string;
  questionText: string;
  questionKey: string;
  type: QuestionType;
  placeholder?: string;
  helpText?: string;
  options: QuestionOption[];
  isRequired: boolean;
  order: number;
  showIf?: QuestionShowIf;
}

export interface QuestionnaireService {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
}

export interface Questionnaire {
  _id?: string;
  serviceId: string | QuestionnaireService;
  title: string;
  description: string;
  questions: QuestionnaireQuestion[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionnairePayload {
  serviceId: string;
  title: string;
  description?: string;
  questions: QuestionnaireQuestion[];
  isActive?: boolean;
}