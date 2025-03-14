import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { ClientList } from "../components/ClientList";
import { AccountantProfile } from "../components/AccountantProfile";
import { api } from "../services/api";
import { Client, Accountant } from "../types/index";

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountant, setAccountant] = useState<Accountant | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/auth/clientes");
    
        const formattedClients: Client[] = response.data.map((cliente: any) => ({
          id: cliente.id_cliente.toString(),
          name: cliente.nome,
          cnpj: cliente.cnpj,
          email: cliente.email,
          phone: cliente.telefone,
        }));
    
        setClients(formattedClients);
        setFilteredClients(formattedClients);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    

    const fetchAccountant = async () => {
      try {
        const response = await api.get("/auth/me");
    
        const data = response.data;
    
        const formattedAccountant: Accountant = {
          id: data.id_contador.toString(),
          name: data.nome,
          cnpj: data.cnpj,
          email: data.email,
          phone: data.telefone || "",
          totalClients: data.total_clientes, // ✅ agora direto da API
        };
    
        setAccountant(formattedAccountant);
      } catch (error) {
        console.error("Erro ao buscar dados do contador:", error);
      }
    };    
    
    

    fetchClients();
    fetchAccountant();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  
    const normalizedText = value.toLowerCase().trim();
    const numericText = value.replace(/\D/g, "").trim();
  
    const isNumericSearch = /^\d+$/.test(numericText); // se só tem números
  
    const filtered = clients.filter((client) => {
      const name = String(client.name || "").toLowerCase().trim();
      const cnpj = String(client.cnpj || "").replace(/\D/g, "");
  
      const nameMatch = name.includes(normalizedText);
      const cnpjMatch = isNumericSearch && cnpj.includes(numericText); // só busca CNPJ se for numérico
  
      return nameMatch || cnpjMatch;
    });
  
    setFilteredClients(filtered);
  };
  
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onProfileClick={() => setIsProfileOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <SearchBar value={searchTerm} onChange={handleSearch} />

  <div className="mt-6">
    {filteredClients.length === 0 ? (
      <div className="text-center text-gray-500 py-12 flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
        <p className="text-lg font-semibold">Nenhum cliente encontrado</p>
        <p className="text-sm mt-1">Tente outro nome ou CNPJ.</p>
      </div>
    ) : (
      <ClientList clients={filteredClients} />
    )}
  </div>
</main>

      {accountant && (
        <AccountantProfile
          accountant={accountant}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
