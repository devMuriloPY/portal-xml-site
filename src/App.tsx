import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import FirstAccessPage from "./pages/FirstAccessPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard"; // Importação do Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/primeiro-acesso" element={<FirstAccessPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Nova rota */}
      </Routes>
    </Router>
  );
}

export default App;
