import { CheckCircle, X } from "lucide-react";

interface FeedbackConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackType: 'sugestao' | 'problema' | 'feedback';
}

export const FeedbackConfirmationModal = ({ isOpen, onClose, feedbackType }: FeedbackConfirmationModalProps) => {
  if (!isOpen) return null;

  const getTypeInfo = (type: 'sugestao' | 'problema' | 'feedback') => {
    switch (type) {
      case 'sugestao':
        return {
          title: 'Sugestão Enviada!',
          message: 'Obrigado pela sua sugestão de melhoria. Nossa equipe analisará sua proposta.',
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'problema':
        return {
          title: 'Problema Reportado!',
          message: 'Recebemos seu relatório de problema. Nossa equipe técnica investigará e corrigirá.',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'feedback':
        return {
          title: 'Feedback Enviado!',
          message: 'Obrigado pelo seu feedback. Sua opinião é muito importante para nós.',
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const typeInfo = getTypeInfo(feedbackType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sucesso!</h2>
                <p className="text-green-100 text-sm">Feedback processado com sucesso</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ícone de sucesso centralizado */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Informações do tipo de feedback */}
          <div className={`p-4 rounded-lg border ${typeInfo.borderColor} ${typeInfo.bgColor} mb-6`}>
            <h3 className={`text-lg font-semibold ${typeInfo.iconColor} mb-2`}>
              {typeInfo.title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {typeInfo.message}
            </p>
          </div>

          {/* Informações adicionais */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">O que acontece agora?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Seu feedback foi enviado para nossa equipe</li>
              <li>• Você receberá uma confirmação por email</li>
              <li>• Nossa equipe analisará sua contribuição</li>
              <li>• Você pode continuar usando o sistema normalmente</li>
            </ul>
          </div>

          {/* Botão de ação */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Entendi, obrigado!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
