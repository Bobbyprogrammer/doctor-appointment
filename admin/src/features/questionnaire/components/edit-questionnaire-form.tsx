"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useQuestionnaires } from "../context/QuestionnaireContext";
import QuestionBuilderCard from "./question-builder-card";
import type { QuestionnaireQuestion } from "@/types/questionnaire";

const defaultQuestion = (): QuestionnaireQuestion => ({
  questionText: "",
  questionKey: "",
  type: "short_text",
  placeholder: "",
  helpText: "",
  options: [],
  isRequired: true,
  order: 0,
});

interface EditQuestionnaireFormProps {
  questionnaireId: string;
}

export default function EditQuestionnaireForm({
  questionnaireId,
}: EditQuestionnaireFormProps) {
  const { getQuestionnaireById, updateQuestionnaire } = useQuestionnaires();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [serviceName, setServiceName] = useState("");
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      setLoading(true);
      const questionnaire = await getQuestionnaireById(questionnaireId);

      if (!questionnaire) {
        toast.error("Questionnaire not found");
        setLoading(false);
        return;
      }

      const service =
        typeof questionnaire.serviceId === "object"
          ? questionnaire.serviceId
          : null;

      setServiceName(service?.name || "N/A");
      setTitle(questionnaire.title || "");
      setDescription(questionnaire.description || "");
      setIsActive(questionnaire.isActive);
      setQuestions(
        questionnaire.questions?.length
          ? questionnaire.questions
          : [{ ...defaultQuestion(), order: 0 }]
      );
      setLoading(false);
    };

    loadQuestionnaire();
  }, [questionnaireId]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { ...defaultQuestion(), order: prev.length }]);
  };

  const updateQuestion = (index: number, updatedQuestion: QuestionnaireQuestion) => {
    const next = [...questions];
    next[index] = updatedQuestion;
    setQuestions(next);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index).map((q, i) => ({
      ...q,
      order: i,
    }));
    setQuestions(updated.length ? updated : [{ ...defaultQuestion(), order: 0 }]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter questionnaire title");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    const invalidQuestion = questions.find(
      (q) => !q.questionText.trim() || !q.questionKey.trim() || !q.type
    );

    if (invalidQuestion) {
      toast.error("Each question must have text, key, and type");
      return;
    }

    try {
      setSubmitting(true);

      const success = await updateQuestionnaire(questionnaireId, {
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q, index) => ({
          ...q,
          order: index,
        })),
        isActive,
      });

      if (success) {
        toast.success("Questionnaire updated successfully");
      } else {
        toast.error("Failed to update questionnaire");
      }
    } catch (error) {
      toast.error("Failed to update questionnaire");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-40 animate-pulse rounded-3xl bg-[#24303d]" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={serviceName}
            disabled
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-slate-400 outline-none"
          />

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Questionnaire title"
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
          />

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active questionnaire</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionBuilderCard
            key={index}
            index={index}
            question={question}
            onChange={updateQuestion}
            onRemove={removeQuestion}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Button type="button" variant="outline" onClick={addQuestion}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>

        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Updating..." : "Update Questionnaire"}
        </Button>
      </div>
    </div>
  );
}