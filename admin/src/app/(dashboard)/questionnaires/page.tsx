"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionnaireProvider, useQuestionnaires } from "@/features/questionnaire/context/QuestionnaireContext";
import QuestionnaireListTable from "@/features/questionnaire/components/questionnaire-list-table"

function QuestionnairesPageContent() {
  const { questionnaires, loading, fetchQuestionnaires } = useQuestionnaires();

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-6 shadow-2xl md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Questionnaires</h1>
          <p className="mt-2 text-sm text-blue-100">
            Manage dynamic booking questions for services.
          </p>
        </div>

        <Link href="/questionnaires/create">
          <Button className="bg-white text-black hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Questionnaire
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-3xl bg-[#24303d]"
            />
          ))}
        </div>
      ) : questionnaires.length > 0 ? (
        <QuestionnaireListTable questionnaires={questionnaires} />
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-10 text-center text-slate-400">
          No questionnaires found.
        </div>
      )}
    </div>
  );
}

export default function QuestionnairesPage() {
  return (
    <QuestionnaireProvider>
      <QuestionnairesPageContent />
    </QuestionnaireProvider>
  );
}