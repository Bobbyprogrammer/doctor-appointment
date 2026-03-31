"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Question {
  _id: string;
  questionText: string;
  questionKey: string;
  type: string;
  options?: { label: string; value: string }[];
  placeholder?: string;
  isRequired: boolean;
}

interface Props {
  serviceId: string;
  answers: any[];
  setAnswers: (val: any[]) => void;
}

export default function DynamicQuestionnaire({
  serviceId,
  answers,
  setAnswers,
}: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get(
          `/questionnaires/service/${serviceId}`
        );
        if (data.success) {
          setQuestions(data.questionnaire.questions || []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [serviceId]);

  const handleAnswer = (question: Question, value: any) => {
    const existing = answers.find(
      (a) => a.questionId === question._id
    );

    if (existing) {
      setAnswers(
        answers.map((a) =>
          a.questionId === question._id
            ? { ...a, answer: value }
            : a
        )
      );
    } else {
      setAnswers([
        ...answers,
        {
          questionId: question._id,
          answer: value,
        },
      ]);
    }
  };

  const getValue = (id: string) => {
    return answers.find((a) => a.questionId === id)?.answer;
  };

  if (loading) {
    return <p className="text-gray-400">Loading questionnaire...</p>;
  }

  return (
     <div className="space-y-8">
  {questions.map((q, index) => {
    const value = getValue(q._id);

    return (
      <div
        key={q._id}
        className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md md:p-7"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6347]">
              Question {index + 1}
            </p>

            <label className="text-base font-semibold text-black md:text-lg">
              {q.questionText}
              {q.isRequired && <span className="ml-1 text-red-500">*</span>}
            </label>

            {q.helpText ? (
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {q.helpText}
              </p>
            ) : null}
          </div>
        </div>

        {/* SHORT TEXT */}
        {q.type === "short_text" && (
          <input
            value={value || ""}
            onChange={(e) => handleAnswer(q, e.target.value)}
            placeholder={q.placeholder || "Write your answer"}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-black outline-none transition placeholder:text-gray-400 focus:border-[#ff6347] focus:bg-white focus:ring-4 focus:ring-[#ff6347]/10"
          />
        )}

        {/* LONG TEXT */}
        {q.type === "long_text" && (
          <textarea
            value={value || ""}
            onChange={(e) => handleAnswer(q, e.target.value)}
            placeholder={q.placeholder || "Write your answer"}
            className="min-h-[160px] w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-4 text-black outline-none transition placeholder:text-gray-400 focus:border-[#ff6347] focus:bg-white focus:ring-4 focus:ring-[#ff6347]/10"
          />
        )}

        {/* NUMBER */}
        {q.type === "number" && (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => handleAnswer(q, e.target.value)}
            placeholder={q.placeholder || "Enter a number"}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-black outline-none transition placeholder:text-gray-400 focus:border-[#ff6347] focus:bg-white focus:ring-4 focus:ring-[#ff6347]/10"
          />
        )}

        {/* DATE */}
        {q.type === "date" && (
          <input
            type="date"
            value={value || ""}
            onChange={(e) => handleAnswer(q, e.target.value)}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-black outline-none transition focus:border-[#ff6347] focus:bg-white focus:ring-4 focus:ring-[#ff6347]/10"
          />
        )}

        {/* YES NO */}
        {q.type === "yes_no" && (
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Yes", val: true },
              { label: "No", val: false },
            ].map((item) => {
              const active = value === item.val;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAnswer(q, item.val)}
                  className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#ff6347] text-white shadow-md"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-[#ff6347]/40 hover:bg-[#fff4f1]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* SINGLE SELECT */}
        {q.type === "single_select" && q.options?.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {q.options.map((opt) => {
              const active = value === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(q, opt.value)}
                  className={`flex min-h-[56px] items-center rounded-2xl border px-4 text-left text-sm font-medium transition ${
                    active
                      ? "border-[#ff6347] bg-[#fff4f1] text-[#ff6347] shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#ff6347]/40 hover:bg-[#fafafa]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* MULTI SELECT */}
        {q.type === "multi_select" && q.options?.length ? (
          <div className="flex flex-wrap gap-3">
            {q.options.map((opt) => {
              const selected = Array.isArray(value) ? value : [];
              const active = selected.includes(opt.value);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (active) {
                      handleAnswer(
                        q,
                        selected.filter((v: string) => v !== opt.value)
                      );
                    } else {
                      handleAnswer(q, [...selected, opt.value]);
                    }
                  }}
                  className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                    active
                      ? "border border-[#ff6347] bg-[#fff4f1] text-[#ff6347] shadow-sm"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-[#ff6347]/40 hover:bg-[#fafafa]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  })}
</div>
  );
}