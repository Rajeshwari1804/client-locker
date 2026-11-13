"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "partner" | "staff" | "client" | "auditor";
  client_id?: string | null;
}

interface ClientSummary {
  id: string;
  name: string;
  firm_id: string;
  files_count: number;
  checklist_total: number;
  checklist_completed: number;
  created_at: string;
}

interface StoredFile {
  id: string;
  client_id: string;
  uploaded_by: string;
  uploader_name?: string;
  name: string;
  file_type: string;
  file_size?: number;
  checklist_item_id?: string | null;
  created_at: string;
}

interface ChecklistItem {
  id: string;
  client_id: string;
  name: string;
  done: "yes" | "no";
}

interface AssignedStaff {
  id: string;
  person_id: string;
  name: string;
  role: string;
  email: string;
}

interface ClientDetail {
  client: { id: string; name: string };
  files: StoredFile[];
  checklist: ChecklistItem[];
  assigned_staff: AssignedStaff[];
}

interface ActivityItem {
  id: string;
  person_id: string;
  person_name?: string;
  file_id?: string | null;
  file_name?: string | null;
  action: string;
  blocked: "yes" | "no";
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientDetail, setClientDetail] = useState<ClientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Partner view tabs
  const [partnerTab, setPartnerTab] = useState<"clients" | "activity">("clients");
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        const clientsRes = await fetch("/api/clients");
        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData.clients || []);
          if (clientsData.clients && clientsData.clients.length > 0) {
            loadClientDetail(clientsData.clients[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  async function loadClientDetail(clientId: string) {
    setSelectedClientId(clientId);
    setDetailLoading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      const res = await fetch(`/api/clients/${clientId}`);
      if (res.ok) {
        const data = await res.json();
        setClientDetail(data);
      } else {
        setClientDetail(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }

  async function loadActivityLog() {
    setActivityLoading(true);
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const data = await res.json();
        setActivityLog(data.activity_log || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActivityLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !selectedClientId) return;

    if (uploadFile.size > 4 * 1024 * 1024) {
      setUploadError("File exceeds 4 MB maximum limit.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", uploadFile);
    if (selectedChecklistItem) {
      formData.append("checklistItemId", selectedChecklistItem);
    }

    try {
      const res = await fetch(`/api/clients/${selectedClientId}/files`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      setUploadSuccess(`Successfully uploaded "${uploadFile.name}"!`);
      setUploadFile(null);
      setSelectedChecklistItem("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh client detail and clients list
      await loadClientDetail(selectedClientId);
      const cRes = await fetch("/api/clients");
      if (cRes.ok) {
        const cData = await cRes.json();
        setClients(cData.clients || []);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm font-medium">Loading ClientLocker...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              CL
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-900">
                ClientLocker
              </h1>
              <p className="text-xs text-slate-500">
                Vaigai Vel &amp; Associates &bull; Madurai
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <span
                className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  user.role === "partner"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : user.role === "staff"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                Role: {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Partner Navigation Tabs */}
        {user.role === "partner" && (
          <div className="mb-6 flex space-x-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setPartnerTab("clients")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                partnerTab === "clients"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              All Clients ({clients.length})
            </button>
            <button
              onClick={() => {
                setPartnerTab("activity");
                loadActivityLog();
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                partnerTab === "activity"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              Activity Audit Log
            </button>
          </div>
        )}

        {/* Partner Activity Log View */}
        {user.role === "partner" && partnerTab === "activity" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Firm Activity Audit Log
                </h2>
                <p className="text-xs text-slate-500">
                  Immutable record of uploads, downloads, access, and security blocks
                </p>
              </div>
              <button
                onClick={loadActivityLog}
                className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-md font-medium"
              >
                Refresh Log
              </button>
            </div>

            {activityLoading ? (
              <div className="p-8 text-center text-sm text-slate-500">Loading log records...</div>
            ) : activityLog.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No activity recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Person</th>
                      <th className="px-6 py-3">Action</th>
                      <th className="px-6 py-3">File / Target</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {activityLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 font-sans font-medium text-slate-900">
                          {log.person_name || log.person_id}
                        </td>
                        <td className="px-6 py-3 text-slate-700">{log.action}</td>
                        <td className="px-6 py-3 text-slate-600">
                          {log.file_name || log.file_id || "—"}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.blocked === "yes"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {log.blocked === "yes" ? "BLOCKED (403)" : "ALLOWED"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Clients & File Locker View (For Partner, Staff, and Client) */}
        {(user.role !== "partner" || partnerTab === "clients") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Client List (Hidden for Client role since they only have one) */}
            {user.role !== "client" && (
              <div className="lg:col-span-4 space-y-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      {user.role === "partner" ? "All Firm Clients" : "My Assigned Clients"}
                    </h2>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                      {clients.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    {user.role === "partner"
                      ? "As Partner, you have oversight across every client."
                      : "Server-enforced: You only see client records assigned to you."}
                  </p>

                  <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                    {clients.map((c) => {
                      const isSelected = c.id === selectedClientId;
                      return (
                        <button
                          key={c.id}
                          onClick={() => loadClientDetail(c.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/70 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {c.files_count} files
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                            <span>Checklist: {c.checklist_completed}/{c.checklist_total}</span>
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{
                                  width: `${(c.checklist_completed / Math.max(c.checklist_total, 1)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Right Column: Selected Client Files & Upload */}
            <div className={user.role === "client" ? "lg:col-span-12" : "lg:col-span-8"}>
              {detailLoading ? (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-3 text-sm">Loading client file locker...</p>
                </div>
              ) : clientDetail ? (
                <div className="space-y-6">
                  {/* Client Info Card */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Client Locker
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 mt-1">
                        {clientDetail.client.name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Private encrypted vault &bull; Files protected from public URL disclosure
                      </p>
                    </div>

                    {/* Assigned staff badge */}
                    {clientDetail.assigned_staff && clientDetail.assigned_staff.length > 0 && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="font-semibold block text-[11px] text-slate-700 mb-1">
                          Assigned Staff ({clientDetail.assigned_staff.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {clientDetail.assigned_staff.map((s) => (
                            <span
                              key={s.id}
                              className="bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded text-[11px]"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checklist & Requirements Status */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                      Client Document Checklist (Annual Filing)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {clientDetail.checklist.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            item.done === "yes"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span className="font-medium">{item.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.done === "yes"
                                ? "bg-emerald-200 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {item.done === "yes" ? "Done" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload File Section (Visible to Partner & Staff only) */}
                  {(user.role === "partner" || user.role === "staff") && (
                    <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200">
                      <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider mb-1">
                        Upload Client File
                      </h3>
                      <p className="text-xs text-blue-700 mb-4">
                        Allowed formats: PDF, JPG, PNG (Max 4 MB). Stored in private storage.
                      </p>

                      <form onSubmit={handleFileUpload} className="space-y-4">
                        {uploadError && (
                          <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg text-xs">
                            {uploadError}
                          </div>
                        )}
                        {uploadSuccess && (
                          <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                            {uploadSuccess}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Select File (PDF, JPG, PNG &le; 4MB)
                            </label>
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                              required
                              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                              className="block w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border border-slate-300 rounded-lg bg-white p-1"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Match Checklist Item (Optional)
                            </label>
                            <select
                              value={selectedChecklistItem}
                              onChange={(e) => setSelectedChecklistItem(e.target.value)}
                              className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">-- None / General File --</option>
                              {clientDetail.checklist.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name} ({item.done === "yes" ? "Done" : "Pending"})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={uploading || !uploadFile}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                          >
                            {uploading ? "Uploading Securely..." : "Upload & Save to Locker"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Files List Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Stored Files ({clientDetail.files.length})
                        </h3>
                        <p className="text-xs text-slate-500">
                          Private storage with role-authorized access validation
                        </p>
                      </div>
                    </div>

                    {clientDetail.files.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        No files uploaded for this client yet. Use the upload form above to add a client file.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200">
                        {clientDetail.files.map((file) => (
                          <div
                            key={file.id}
                            className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase flex-shrink-0">
                                {file.name.endsWith(".pdf")
                                  ? "PDF"
                                  : file.name.endsWith(".png")
                                  ? "PNG"
                                  : "JPG"}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 break-all">
                                  {file.name}
                                </h4>
                                <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                                  <span>
                                    Uploaded by: <strong>{file.uploader_name || "Staff"}</strong>
                                  </span>
                                  <span>&bull;</span>
                                  <span>{new Date(file.created_at).toLocaleString()}</span>
                                  {file.file_size && (
                                    <>
                                      <span>&bull;</span>
                                      <span>{(file.file_size / 1024).toFixed(1)} KB</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <a
                                href={`/api/files/${file.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
                              >
                                Open / View File
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
                  Please select a client from the list to view their files.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
