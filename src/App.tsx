import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import FirstAccessPage from "./pages/FirstAccessPage";
import TermosPage from "./pages/termos";
import PrivacidadePage from "./pages/privacidade";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import ClientDetails from "./pages/ClientDetails";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/primeiro-acesso" element={<FirstAccessPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
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
