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
        const response = await api.get("/clientes");
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    const fetchAccountant = async () => {
      try {
        const response = await api.get("/conta");
        setAccountant(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do contador:", error);
      }
    };

    fetchClients();
    fetchAccountant();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lowerCaseValue = value.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerCaseValue) ||
        client.cnpj.includes(lowerCaseValue)
    );
    setFilteredClients(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onProfileClick={() => setIsProfileOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchBar value={searchTerm} onChange={handleSearch} />
        <div className="mt-6">
          <ClientList clients={filteredClients} />
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
