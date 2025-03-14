import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar,
  Link as LinkIcon,
  Mail,
  Phone,
  Building2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { api } from "../services/api";
import { toast } from "react-hot-toast";

const ClientDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const client = location.state?.client;

  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);

  // 🗓️ Preenche dataInicial e dataFinal com o mês passado
  useEffect(() => {
    const hoje = new Date();
  
    const mesPassado = hoje.getMonth() === 0 ? 11 : hoje.getMonth() - 1;
    const anoMesPassado = hoje.getMonth() === 0 ? hoje.getFullYear() - 1 : hoje.getFullYear();
  
    const primeiroDia = new Date(anoMesPassado, mesPassado, 1);
    const ultimoDia = new Date(anoMesPassado, mesPassado + 1, 0);
  
    const formatar = (data: Date) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    };
  
    setDataInicial(formatar(primeiroDia));
    setDataFinal(formatar(ultimoDia));
  }, []);
  

  // 🔄 Verifica conexão com o WebSocket
  useEffect(() => {
    const verificarConexao = async () => {
      try {
        const res = await api.get("/ws/clientes-conectados");
        const idsConectados = res.data.clientes_conectados || [];
        setIsOnline(idsConectados.includes(Number(id)));
      } catch (error) {
        console.error("Erro ao verificar status do cliente:", error);
        setIsOnline(null);
      }
    };

    verificarConexao();
  }, [id]);

  // 🔄 Carrega solicitações do banco
  useEffect(() => {
    const carregarSolicitacoes = async () => {
      try {
        const res = await api.get(`/auth/solicitacoes/${id}`);
        setSolicitacoes(res.data);
      } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
      }
    };

    if (id) {
      carregarSolicitacoes();
    }
  }, [id]);

  

  const handleSolicitacao = async () => {
    if (!dataInicial || !dataFinal) {
      toast.error("Preencha as duas datas para continuar.");
      return;
    }

    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);

    if (inicio > fim) {
      toast.error("A data inicial deve ser menor ou igual à data final.");
      return;
    }

    try {
      const payload = {
        id_cliente: Number(id),
        data_inicio: dataInicial,
        data_fim: dataFinal,
      };

      const res = await api.post("/auth/solicitacoes", payload);

      if (res.data?.id_solicitacao) {
        toast.success("📨 Solicitação registrada com sucesso!");
        setDataInicial("");
        setDataFinal("");

        // Recarrega histórico após nova solicitação
        const updated = await api.get(`/auth/solicitacoes/${id}`);
        setSolicitacoes(updated.data);
      } else {
        toast.error("Erro ao registrar solicitação.");
      }
    } catch (err) {
      console.error("Erro ao solicitar XML:", err);
      toast.error("Erro ao enviar solicitação.");
    }
  };

  if (!client) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-semibold">Cliente não encontrado</p>
        <p className="text-sm mt-1">Volte ao painel e tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">{client.name}</h1>
          <p className="text-sm text-gray-500">Detalhes do cliente</p>
        </div>

        {/* 🔷 Informações principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 className="w-5 h-5 text-blue-500" />
            <span>{client.cnpj}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5 text-blue-500" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-5 h-5 text-blue-500" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 relative">
            {isOnline === true ? (
              <>
                <Wifi className="w-5 h-5 text-green-500 animate-pulse" />
                <span>Status: Online</span>
              </>
            ) : isOnline === false ? (
              <>
                <WifiOff className="w-5 h-5 text-red-500 animate-pulse" />
                <span>Status: Offline</span>
              </>
            ) : (
              <span className="text-gray-400">Verificando status...</span>
            )}

            <button
              onClick={() => setMostrarExplicacao((prev) => !prev)}
              className="ml-2 w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition duration-200"
              title="O que é isso?"
            >
              ?
            </button>

            {mostrarExplicacao && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md p-3 text-sm text-gray-700 w-72 z-10">
                Essa informação indica se o cliente está com o <strong>Portal XML</strong> ativo no computador.
              </div>
            )}
          </div>
        </div>

        {/* 📩 Solicitar XML */}
        <div className="pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Solicitar XML</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full transition focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full transition focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={handleSolicitacao}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Solicitar
            </button>
          </div>
        </div>

        {/* 📜 Histórico de Solicitações */}
        <div className="pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Histórico de Solicitações</h2>
          <ul className="space-y-3">
            {solicitacoes.map((item) => (
              <li
                key={item.id_solicitacao}
                className="flex items-center justify-between border p-4 rounded-lg hover:shadow-sm transition"
              >
                <div className="flex flex-col text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {new Date(item.data_solicitacao).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="ml-6 text-sm text-gray-500">
                    <span>{item.status === "concluido" ? "Concluído" : "Pendente"}</span><br />
                    <span>
                      Período:{" "}
                      {new Date(item.data_inicio).toLocaleDateString()} até{" "}
                      {new Date(item.data_fim).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {item.xml_url ? (
                  <a
                    href={item.xml_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Baixar XML
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">Aguardando geração</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão de Voltar estilizado no final */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-300"
        >
          ← Voltar para o Dashboard
        </button>
      </div>
    </div>
  );
};

export default ClientDetails;
