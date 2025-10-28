import React, { useState } from "react";

interface AddFindingModalProps {
  auditId: string;
  onClose: () => void;
  onSuccess: (finding: any) => void;
}

const AddFindingModal: React.FC<AddFindingModalProps> = ({
  auditId,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [status, setStatus] = useState("Open");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `https://auditops-backend.onrender.com/audits/${auditId}/findings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            severity,
            status,
            auditId,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to create finding");
      const data = await res.json();
      onSuccess(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating finding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark, blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-gray-900 p-6 rounded-lg w-full max-w-md text-gray-100 z-10">
        <h2 className="text-xl font-semibold mb-4">Add Finding</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
            rows={4}
            required
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
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
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-600"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFindingModal;
