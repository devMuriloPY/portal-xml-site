export interface Client {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  isOnline?: boolean;
}

export interface Accountant {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  totalClients: number;
}

export interface Solicitacao {
  id_solicitacao: number;
  data_solicitacao: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  xml_url: string | null;
}

export interface ClienteAPI {
  id_cliente: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
}
