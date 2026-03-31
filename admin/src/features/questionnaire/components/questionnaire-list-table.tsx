"use client";

import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { useQuestionnaires } from "../context/QuestionnaireContext";
import type { Questionnaire } from "@/types/questionnaire";

interface QuestionnaireListTableProps {
  questionnaires: Questionnaire[];
}

export default function QuestionnaireListTable({
  questionnaires,
}: QuestionnaireListTableProps) {
  const { deleteQuestionnaire } = useQuestionnaires();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this questionnaire?"
    );
    if (!confirmed) return;

    const success = await deleteQuestionnaire(id);

    if (success) {
      toast.success("Questionnaire deleted successfully");
    } else {
      toast.error("Failed to delete questionnaire");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#24303d] shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Service
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Questions
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {questionnaires.map((questionnaire) => {
              const service =
                typeof questionnaire.serviceId === "object"
                  ? questionnaire.serviceId
                  : null;

              return (
                <tr
                  key={questionnaire._id}
                  className="border-b border-white/5 last:border-b-0"
                >
                  <td className="px-6 py-4 text-white">
                    <div>
                      <p className="font-medium">{questionnaire.title}</p>
                      <p className="text-sm text-slate-400">
                        {questionnaire.description || "No description"}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {service?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {service?.category || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {questionnaire.questions?.length || 0}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        questionnaire.isActive
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-red-500/10 text-red-300"
                      }`}
                    >
                      {questionnaire.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/questionnaires/edit/${questionnaire._id}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition hover:bg-white/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(questionnaire._id!)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}