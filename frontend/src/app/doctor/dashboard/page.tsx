export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-green-600 to-teal-600 p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-white">
          Doctor Dashboard
        </h1>
        <p className="mt-2 text-sm text-green-100">
          Manage your consultations and patient cases efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-[#24303d] p-6 shadow">
          <h3 className="text-sm text-slate-400">Assigned Cases</h3>
          <p className="mt-2 text-2xl font-bold">12</p>
        </div>

        <div className="rounded-2xl bg-[#24303d] p-6 shadow">
          <h3 className="text-sm text-slate-400">Under Review</h3>
          <p className="mt-2 text-2xl font-bold">5</p>
        </div>

        <div className="rounded-2xl bg-[#24303d] p-6 shadow">
          <h3 className="text-sm text-slate-400">Completed</h3>
          <p className="mt-2 text-2xl font-bold">20</p>
        </div>
      </div>
    </div>
  );
}