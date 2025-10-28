import React from "react";
import { useNavigate } from "react-router-dom";

export interface AuditCardProps {
  id: string;
  title: string;
  clientName: string;
  createdAt: string;
  findingsCount: number;
  onOpen?: (id: string) => void; // for edit
  onDelete?: (id: string) => void; // for delete
}

const DashboardCard: React.FC<AuditCardProps> = ({
  id,
  title,
  clientName,
  createdAt,
  findingsCount,
  onOpen,
  onDelete,
}) => {
  const navigate = useNavigate();
  const date = new Date(createdAt).toLocaleDateString();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this audit? This action cannot be undone."
    );
    if (confirmed) {
      onDelete?.(id);
    }
  };

  return (
    <article
      className="bg-gray-800 text-gray-100 rounded-xl p-4 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
      onClick={() => navigate(`/audits/${id}`)}
    >
      <div>
        <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
        <p className="text-xs text-gray-400 mb-3">{clientName}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <div>
          <div className="text-sm text-gray-200 font-medium">
            {findingsCount}
          </div>
          <div>Findings</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-200">{date}</div>
          <div className="text-xs text-gray-500">Created</div>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition"
        >
          Delete
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(id);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded-md transition"
        >
          Edit Audit
        </button>
      </div>
    </article>
  );
};

export default DashboardCard;
