import React, { useState } from "react";
import axios from "axios";

const TestFirstAccess = () => {
  const [cnpj, setCnpj] = useState("77.618.498/0001-85");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "https://portal-xml-api-new-portal-xml-api.up.railway.app/auth/primeiro-acesso",
        {
          cnpj,
          senha: password,
          senha_confirmacao: confirmPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Resposta da API:", response);
      setMessage(response.data.message);
    } catch (error: any) {
      console.error("Erro na API:", error);
      setError(error.response?.data?.detail || "Erro ao cadastrar senha");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Teste de Primeiro Acesso</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>CNPJ:</label>
          <input
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>

      {message && <p style={{ color: "green" }}>✅ {message}</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
};

export default TestFirstAccess;
