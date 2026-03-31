"use client";

import { useParams } from "next/navigation";
import { QuestionnaireProvider } from "@/features/questionnaire/context/QuestionnaireContext"
import EditQuestionnaireForm from "@/features/questionnaire/components/edit-questionnaire-form"

export default function EditQuestionnairePage() {
  const params = useParams();
  const id = params?.id as string;
  console.log(params.id);
  return (
    <QuestionnaireProvider>
      <div className="flex w-full flex-col gap-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-white">Edit Questionnaire</h1>
          <p className="mt-2 text-sm text-blue-100">
            Update questionnaire questions and settings for the selected service.
          </p>
        </div>

        <EditQuestionnaireForm questionnaireId={id} />
      </div>
    </QuestionnaireProvider>
  );
}