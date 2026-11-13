import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-16 text-slate-900">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-3xl shadow-lg">
          CL
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
          ClientLocker
        </h1>

        <p className="text-xl font-medium text-slate-700">
          Hello!
        </p>

        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          A private file locker where each person sees only the client files they are allowed to see.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all text-center"
          >
            Enter ClientLocker
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all text-center"
          >
            Sign In with Role
          </Link>
        </div>

        {/* M2 Quick Role Test Grid */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Milestone 2 Role-Based Access Controls
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 bg-white border border-purple-200 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded">
                Partner
              </span>
              <h3 className="font-bold text-sm mt-1 text-slate-900">Kavitha Vel</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full oversight over all 10 clients, staff assignments, and firm activity audit logs.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-blue-200 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                Staff
              </span>
              <h3 className="font-bold text-sm mt-1 text-slate-900">Priya Raman</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Can only view &amp; upload files (&le;4MB) for assigned clients. Log is strictly hidden.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-emerald-200 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                Client
              </span>
              <h3 className="font-bold text-sm mt-1 text-slate-900">Madurai Spices</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Can view &amp; download only their own company files. No upload or staff visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
