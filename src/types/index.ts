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
  valor_nfe_autorizadas?: number;
  valor_nfe_canceladas?: number;
  valor_nfc_autorizadas?: number;
  valor_nfc_canceladas?: number;
  quantidade_nfe_autorizadas?: number;
  quantidade_nfe_canceladas?: number;
  quantidade_nfc_autorizadas?: number;
  quantidade_nfc_canceladas?: number;
}

export interface ClienteAPI {
  id_cliente: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
}

// Tipos para o novo fluxo de redefinição de senha com OTP
export interface PasswordResetRequest {
  identifier: string; // email ou CNPJ
}

export interface PasswordResetRequestResponse {
  message: string; // Sempre: "Se existir uma conta, enviamos um código para o e-mail cadastrado."
}

export interface PasswordResetVerify {
  identifier: string;
  code: string; // código de 4 dígitos
}

export interface PasswordResetVerifyResponse {
  status: "ok" | "error";
  reset_token?: string; // JWT token para usar no header Authorization
}

export interface PasswordResetConfirm {
  new_password: string;
}

export interface PasswordResetConfirmResponse {
  message: string; // "Senha atualizada."
}

// Tipos para solicitação em lotes
export interface BatchRequest {
  batch_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  total_requests: number;
  completed_requests: number;
  failed_requests: number;
  requests: BatchRequestItem[];
  created_at: string;
  completed_at?: string;
}

export interface BatchRequestItem {
  id: string;
  client_id: string;
  client_name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  xml_url?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface CreateBatchRequest {
  client_ids: string[];
  data_inicio: string;
  data_fim: string;
}

export interface BatchListResponse {
  batches: BatchSummary[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface BatchSummary {
  batch_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  total_requests: number;
  completed_requests: number;
  failed_requests: number;
  created_at: string;
  completed_at?: string;
}