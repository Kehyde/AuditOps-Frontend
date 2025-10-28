import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuditDetails from "./pages/AuditDetails";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/audits/:id" element={<AuditDetails />} />
      </Routes>
    </div>
  );
}

export default App;
