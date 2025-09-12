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
import { Toaster } from "react-hot-toast";

function App() {
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
