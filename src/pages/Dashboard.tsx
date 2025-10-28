import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import AddAuditModal from "../components/AddAuditModal";
import EditAuditModal from "../components/EditAuditModal";

interface Audit {
  _id: string;
  title: string;
  clientName: string;
  createdAt: string;
  findingsCount?: number;
  description?: string;
  status?: string;
}

const Dashboard: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editAudit, setEditAudit] = useState<Audit | null>(null);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://auditops-backend.onrender.com/audits");
        if (!res.ok) throw new Error("Failed to fetch audits");
        const data = await res.json();
        const mapped = data.map((a: any) => ({
          _id: a._id,
          title: a.title,
          clientName: a.clientName ?? a.client ?? "Unknown",
          createdAt: a.createdAt ?? a.date ?? new Date().toISOString(),
          findingsCount: a.findingsCount ?? a.findings?.length ?? 0,
          description: a.description ?? "",
          status: a.status ?? "Open",
        }));
        setAudits(mapped);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  const handleEditSuccess = (updated: Audit) => {
    setAudits(audits.map((a) => (a._id === updated._id ? updated : a)));
    setEditAudit(null);
  };

  const handleDeleteAudit = async (id: string) => {
    const res = await fetch(
      `https://auditops-backend.onrender.com/audits/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setAudits(audits.filter((a) => a._id !== id));
    } else {
      alert("Failed to delete audit");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">All Audits</h3>
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
            >
              + New Audit
            </button>
          </div>

          {/* Add Audit Modal */}
          {addModalOpen && (
            <AddAuditModal
              onClose={() => setAddModalOpen(false)}
              onSuccess={(audit) => setAudits([audit, ...audits])}
            />
          )}

          {/* Edit Audit Modal */}
          {editAudit && (
            <EditAuditModal
              audit={editAudit}
              onClose={() => setEditAudit(null)}
              onSave={handleEditSuccess}
            />
          )}

          {/* Audit Grid */}
          {loading ? (
            <div className="text-gray-400">Loading audits…</div>
          ) : error ? (
            <div className="text-red-400">Error: {error}</div>
          ) : audits.length === 0 ? (
            <div className="text-gray-400">No audits yet — create one.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {audits.map((a) => (
                <DashboardCard
                  key={a._id}
                  id={a._id}
                  title={a.title}
                  clientName={a.clientName}
                  createdAt={a.createdAt}
                  findingsCount={a.findingsCount ?? 0}
                  onDelete={handleDeleteAudit}
                  onOpen={(id) => {
                    const auditToEdit = audits.find((a) => a._id === id);
                    if (auditToEdit) setEditAudit(auditToEdit);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
