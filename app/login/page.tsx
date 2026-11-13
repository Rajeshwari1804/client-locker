"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function fillCredentials(testEmail: string, testPass: string) {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-2xl shadow-md">
          CL
        </div>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          ClientLocker
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Vaigai Vel &amp; Associates &bull; Secure Accounting File Locker
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="name@vaigaivel.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {/* Quick 1-Click Test Logins for Milestone 2 Review */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              One-Click M2 Test Logins
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("kavitha@vaigaivel.com", "Partner123!")}
                className="w-full text-left px-3 py-2 text-xs rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 transition-colors flex justify-between items-center"
              >
                <span><strong>Partner:</strong> Kavitha Vel</span>
                <span className="text-[10px] bg-purple-200 text-purple-800 font-mono px-1.5 py-0.5 rounded">All Clients + Log</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("priya@vaigaivel.com", "Staff123!")}
                className="w-full text-left px-3 py-2 text-xs rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 transition-colors flex justify-between items-center"
              >
                <span><strong>Staff:</strong> Priya Raman</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 font-mono px-1.5 py-0.5 rounded">Assigned + Upload</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("client1@maduraispices.com", "Client123!")}
                className="w-full text-left px-3 py-2 text-xs rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-colors flex justify-between items-center"
              >
                <span><strong>Client:</strong> Madurai Spices</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 font-mono px-1.5 py-0.5 rounded">Own Files Only</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("dinesh@vaigaivel.com", "Staff123!")}
                className="w-full text-left px-3 py-2 text-xs rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors flex justify-between items-center"
              >
                <span><strong>Trainee:</strong> Dinesh Kumar</span>
                <span className="text-[10px] bg-amber-200 text-amber-800 font-mono px-1.5 py-0.5 rounded">Assigned Clients</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
