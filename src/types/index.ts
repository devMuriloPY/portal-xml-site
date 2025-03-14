export interface Client {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
}

export interface Accountant {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  totalClients: number;
}
