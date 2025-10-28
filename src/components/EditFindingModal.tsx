import React, { useState } from "react";

interface Finding {
  _id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
}

interface EditFindingModalProps {
  auditId: string;
  finding: Finding;
  onClose: () => void;
  onSave: (updatedFinding: Finding) => void;
}

const EditFindingModal: React.FC<EditFindingModalProps> = ({
  auditId,
  finding,
  onClose,
  onSave,
}) => {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
            setEditedFinding({
              ...editedFinding,
              description: e.target.value,
            })
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

export default EditFindingModal;
