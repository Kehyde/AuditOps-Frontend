import React, { useState } from "react";

interface Audit {
  _id: string;
  title: string;
  clientName: string;
  description?: string;
  status?: string;
  createdAt: string;
  findingsCount?: number;
}

interface EditAuditModalProps {
  audit: Audit;
  onClose: () => void;
  onSave: (updatedAudit: Audit) => void;
}

const EditAuditModal: React.FC<EditAuditModalProps> = ({
  audit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(audit.title);
  const [clientName, setClientName] = useState(audit.clientName);
  const [description, setDescription] = useState(audit.description || "");
  const [status, setStatus] = useState(audit.status || "Open");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://auditops-backend.onrender.com/audits/${audit._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, clientName, description, status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update audit");
      const updated: Audit = await res.json();
      onSave(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating audit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-gray-900 bg-opacity-95 p-6 rounded-lg w-full max-w-md text-gray-100 z-10">
        <h2 className="text-xl font-semibold mb-4">Edit Audit</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
            rows={4}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>

          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAuditModal;
