import { Calendar, Link as LinkIcon, Trash2 } from "lucide-react";
import { Solicitacao } from "../types/index";

interface Props {
  item: Solicitacao;
  onDelete: (id: number) => void;
}

export const SolicitacaoItem = ({ item, onDelete }: Props) => (
  <li className="flex items-center justify-between border p-4 rounded-xl bg-gray-50 hover:bg-white transition">
    <div className="flex flex-col text-gray-700">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="font-medium">
        {(() => {
          const [data, hora] = item.data_solicitacao.split("T"); // "2025-03-15", "09:30:03"
          const [ano, mes, dia] = data.split("-");
          const horaFormatada = hora.slice(0, 5); // "09:30"
          return `${dia}/${mes}/${ano}, ${horaFormatada}`;
        })()}
      </span>

      </div>
      <div className="ml-6 text-sm text-gray-500">
        <span>{item.status === "concluido" ? "Concluído" : "Pendente"}</span><br />
        <span>
          Período: {new Date(item.data_inicio).toLocaleDateString()} até {new Date(item.data_fim).toLocaleDateString()}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3">
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
      <button onClick={() => onDelete(item.id_solicitacao)} title="Excluir">
        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 transition" />
      </button>
    </div>
  </li>
);
