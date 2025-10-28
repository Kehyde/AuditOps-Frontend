import React from "react";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "AuditOps Dashboard" }) => {
  return (
    <header className="w-full bg-transparent py-4 px-6 flex items-center justify-between border-b border-gray-800">
      <div>
        <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400 hidden sm:block">
          example@auditops.local
        </div>
        {/* Simple avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          E
        </div>
      </div>
    </header>
  );
};

export default Header;
