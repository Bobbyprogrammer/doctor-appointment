"use client";

import { QuestionnaireProvider } from "@/features/questionnaire/context/QuestionnaireContext"
import { ServicesProvider } from "@/features/services/context/ServicesContext";
import QuestionnaireForm from "@/features/questionnaire/components/questionnaire-form"

export default function CreateQuestionnairePage() {
  return (
    <ServicesProvider>
      <QuestionnaireProvider>
        <div className="flex w-full flex-col gap-6">
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 shadow-2xl">
            <h1 className="text-3xl font-bold text-white">Create Questionnaire</h1>
            <p className="mt-2 text-sm text-blue-100">
              Build dynamic questions for a service that patients will answer during booking.
            </p>
          </div>

          <QuestionnaireForm />
        </div>
      </QuestionnaireProvider>
    </ServicesProvider>
  );
}