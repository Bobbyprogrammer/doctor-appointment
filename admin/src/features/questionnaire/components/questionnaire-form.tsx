"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import QuestionBuilderCard from "./question-builder-card";
import { useQuestionnaires } from "../context/QuestionnaireContext";
import { useServices } from "@/features/services/context/ServicesContext";
import type { CreateQuestionnairePayload, QuestionnaireQuestion } from "@/types/questionnaire";

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

export default function QuestionnaireForm() {
  const { createQuestionnaire } = useQuestionnaires();
  const { services } = useServices();

  const [serviceId, setServiceId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([
    { ...defaultQuestion(), order: 0 },
  ]);

  const availableServices = useMemo(() => services || [], [services]);

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
    if (!serviceId) {
      toast.error("Please select a service");
      return;
    }

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

      const payload: CreateQuestionnairePayload = {
        serviceId,
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q, index) => ({
          ...q,
          order: index,
        })),
        isActive,
      };

      const success = await createQuestionnaire(payload);

      if (success) {
        toast.success("Questionnaire created successfully");
        setServiceId("");
        setTitle("");
        setDescription("");
        setIsActive(true);
        setQuestions([{ ...defaultQuestion(), order: 0 }]);
      } else {
        toast.error("Failed to create questionnaire");
      }
    } catch (error) {
      toast.error("Failed to create questionnaire");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border-white/10 bg-[#24303d] p-6 text-white shadow-xl">
        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
          >
            <option value="" className="text-black">
              Select Service
            </option>
            {availableServices.map((service) => (
              <option
                key={service._id || service.id}
                value={service._id || service.id}
                className="text-black"
              >
                {service.name}
              </option>
            ))}
          </select>

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
          {submitting ? "Saving..." : "Save Questionnaire"}
        </Button>
      </div>
    </div>
  );
}