import React from "react";
import {
  HomeIcon,
  Cog6ToothIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  return (
    <aside
      className={`w-72 min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col ${className}`}
      aria-label="Sidebar"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">AuditOps</h1>
        <p className="text-xs text-gray-400 mt-1">Audit dashboard</p>
      </div>

      <div className="flex-1 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition">
          <HomeIcon className="h-5 w-5 text-gray-300" />
          <span className="text-sm">All Audits</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition">
          <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-300" />
          <span className="text-sm">Search</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition">
          <Cog6ToothIcon className="h-5 w-5 text-gray-300" />
          <span className="text-sm">Settings</span>
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>Version 0.1 • MVP</p>
      </div>
    </aside>
  );
};

export default Sidebar;
