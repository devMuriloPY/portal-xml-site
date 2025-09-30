import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import FirstAccessPage from "./pages/FirstAccessPage";
import TermosPage from "./pages/termos";
import PrivacidadePage from "./pages/privacidade";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import NewPasswordPage from "./pages/NewPasswordPage";
import Dashboard from "./pages/Dashboard";
import ClientDetails from "./pages/ClientDetails";
import MaintenancePage from "./pages/MaintenancePage";
import { Toaster } from "react-hot-toast";
import { useMaintenance } from "./hooks/useMaintenance";

function App() {
  const { isMaintenanceMode, isLoading } = useMaintenance();

  // Se está em modo de manutenção, mostrar apenas a página de manutenção
  if (isMaintenanceMode) {
    return (
      <>
        <MaintenancePage />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </>
    );
  }

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/primeiro-acesso" element={<FirstAccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes/:id" element={<ClientDetails />} />
        <Route path="/privacidade" element={<PrivacidadePage />} />
        <Route path="/termos" element={<TermosPage />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </Router>
  );
}

export default App;
