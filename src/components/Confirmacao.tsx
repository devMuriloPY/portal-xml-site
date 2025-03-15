import { toast } from "react-hot-toast"

interface ConfirmacaoProps {
  mensagem: string
  onConfirmar: () => void
  onCancelar: () => void
}

export const Confirmacao = ({ mensagem, onConfirmar, onCancelar }: ConfirmacaoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmar Exclusão</h3>
      <p className="text-gray-600 mb-6">{mensagem}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancelar}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}

export const confirmarExclusao = (mensagem: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.custom(
      (t) => (
        <Confirmacao
          mensagem={mensagem}
          onConfirmar={() => {
            toast.dismiss(t.id)
            resolve(true)
          }}
          onCancelar={() => {
            toast.dismiss(t.id)
            resolve(false)
          }}
        />
      ),
      {
        duration: Infinity, // Mantém o toast aberto até o usuário interagir
      }
    )
  })
}