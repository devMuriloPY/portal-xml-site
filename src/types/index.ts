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