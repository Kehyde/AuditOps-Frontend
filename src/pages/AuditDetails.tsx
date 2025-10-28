import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddFindingModal from "../components/AddFindingModal";

interface Finding {
  _id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
}

interface Audit {
  _id: string;
  title: string;
  clientName: string;
  createdAt: string;
  findings?: Finding[];
}

// Edit Finding Modal
const EditFindingModal: React.FC<{
  auditId: string;
  finding: Finding;
  onClose: () => void;
  onSave: (updated: Finding) => void;
}> = ({ auditId, finding, onClose, onSave }) => {
  const [editedFinding, setEditedFinding] = useState(finding);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `https://auditops-backend.onrender.com/audits/${auditId}/findings/${editedFinding._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedFinding),
        }
      );
      if (!res.ok) throw new Error("Failed to update finding");
      const updated = await res.json();
      onSave(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating finding");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Finding</h3>
        <label className="block mb-2 text-sm">Title</label>
        <input
          type="text"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={editedFinding.title}
          onChange={(e) =>
            setEditedFinding({ ...editedFinding, title: e.target.value })
          }
        />
        <label className="block mb-2 text-sm">Description</label>
        <textarea
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={editedFinding.description}
          onChange={(e) =>
            setEditedFinding({ ...editedFinding, description: e.target.value })
          }
        />
        <label className="block mb-2 text-sm">Severity</label>
        <select
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={editedFinding.severity}
          onChange={(e) =>
            setEditedFinding({ ...editedFinding, severity: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <label className="block mb-2 text-sm">Status</label>
        <select
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={editedFinding.status}
          onChange={(e) =>
            setEditedFinding({ ...editedFinding, status: e.target.value })
          }
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Finding Card
const FindingCard: React.FC<{
  finding: Finding;
  onEdit: (f: Finding) => void;
  onDelete: (id: string) => void;
}> = ({ finding, onEdit, onDelete }) => {
  const statusColor =
    finding.status === "Open"
      ? "text-red-400"
      : finding.status === "Closed"
      ? "text-green-400"
      : "text-gray-400";
  const severityColor =
    finding.severity === "Low"
      ? "text-green-400"
      : finding.severity === "Medium"
      ? "text-orange-400"
      : finding.severity === "High"
      ? "text-red-400"
      : "text-red-700"; // Critical

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition relative">
      {/* Delete button (left corner) */}
      <button
        onClick={() => onDelete(finding._id)}
        className="absolute top-3 right-15 text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
      >
        Delete
      </button>

      <h3 className="text-lg font-medium text-blue-400">{finding.title}</h3>
      <p className="text-sm text-gray-300 mt-2">{finding.description}</p>
      <div className="mt-3 flex justify-between text-sm">
        <span className={severityColor}>Severity: {finding.severity}</span>
        <span className={statusColor}>{finding.status}</span>
      </div>

      {/* Edit button (right corner) */}
      <button
        onClick={() => onEdit(finding)}
        className="absolute top-3 right-3 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Edit
      </button>
    </div>
  );
};

// Main Component
const AuditDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editFinding, setEditFinding] = useState<Finding | null>(null);
  const [showAddFinding, setShowAddFinding] = useState(false);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await fetch(
          `https://auditops-backend.onrender.com/audits/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch audit");
        const data = await res.json();
        setAudit(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [id]);

  const handleDeleteFinding = async (findingId: string) => {
    if (!audit) return;
    if (!window.confirm("Are you sure you want to delete this finding?"))
      return;

    try {
      const res = await fetch(
        `https://auditops-backend.onrender.com/audits/${audit._id}/findings/${findingId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete finding");

      setAudit({
        ...audit,
        findings: audit.findings?.filter((f) => f._id !== findingId),
      });
    } catch (err) {
      console.error(err);
      alert("Error deleting finding");
    }
  };

  const handleDownloadPDF = async () => {
    if (!audit) return;
    try {
      const res = await fetch(
        `https://auditops-backend.onrender.com/audits/${audit._id}/export`
      );
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${audit.title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    }
  };

  if (loading) return <div className="p-6 text-gray-300">Loading audit...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!audit) return <div className="p-6 text-gray-400">No audit found.</div>;

  return (
    <div className="p-8 relative">
      {editFinding && audit && (
        <EditFindingModal
          auditId={audit._id}
          finding={editFinding}
          onClose={() => setEditFinding(null)}
          onSave={(updated) => {
            setAudit({
              ...audit,
              findings: audit.findings?.map((f) =>
                f._id === updated._id ? updated : f
              ),
            });
          }}
        />
      )}

      {showAddFinding && audit && (
        <AddFindingModal
          auditId={audit._id}
          onClose={() => setShowAddFinding(false)}
          onSuccess={(newFinding) => {
            setAudit({
              ...audit,
              findings: audit.findings
                ? [...audit.findings, newFinding]
                : [newFinding],
            });
          }}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddFinding(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
          >
            + Add Finding
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Download PDF
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-2">{audit.title}</h1>
      <p className="text-gray-400 mb-1">Client: {audit.clientName}</p>
      <p className="text-gray-400 mb-6">
        Created: {new Date(audit.createdAt).toLocaleDateString()}
      </p>

      <h2 className="text-2xl font-semibold mb-3">Findings</h2>
      {audit.findings && audit.findings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.findings.map((f) => (
            <FindingCard
              key={f._id}
              finding={f}
              onEdit={setEditFinding}
              onDelete={handleDeleteFinding}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No findings yet for this audit.</p>
      )}
    </div>
  );
};

export default AuditDetails;
