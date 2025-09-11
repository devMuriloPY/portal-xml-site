import { X, MessageSquare, AlertTriangle, Lightbulb, Send } from "lucide-react";
import { useState } from "react";
import { api } from "../services/api";
import { FeedbackConfirmationModal } from "./FeedbackConfirmationModal";
import toast from "react-hot-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'sugestao' | 'problema' | 'feedback';

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feedback');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<FeedbackType>('feedback');

  if (!isOpen) return null;

  // Se o modal de confirmação estiver aberto, não renderizar o modal principal
  if (showConfirmation) {
    return (
      <FeedbackConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          onClose(); // Fechar o modal principal também
        }}
        feedbackType={confirmationType}
      />
    );
  }

  const handleSubmit = async () => {
    if (!description.trim() || description.trim().length < 10) {
      toast.error('A descrição deve ter pelo menos 10 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    
    // Salvar valores antes de resetar
    const currentFeedbackType = feedbackType;
    const currentDescription = description.trim();
    
    // Definir tipo para confirmação
    setConfirmationType(currentFeedbackType);
    
    // Resetar formulário
    setDescription('');
    setFeedbackType('feedback');
    
    // Mostrar modal de confirmação imediatamente (sem fechar o modal principal ainda)
    setShowConfirmation(true);
    
    // Fazer chamada da API em background
    try {
      // Mapear tipos para o formato da API
      const tipoMap = {
        'sugestao': 'Sugestão',
        'problema': 'Bug',
        'feedback': 'Elogio'
      };

      await api.post('/feedback/enviar', {
        tipo_feedback: tipoMap[currentFeedbackType],
        descricao: currentDescription
      });
      
    } catch (error: any) {
      console.error('Erro ao enviar feedback:', error);
      
      // Mostrar toast de erro mesmo com confirmação já exibida
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (error.response?.status === 403) {
        toast.error('Você não tem permissão para enviar feedback.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erro ao enviar feedback. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeInfo = (type: FeedbackType) => {
    switch (type) {
      case 'sugestao':
        return {
          icon: Lightbulb,
          title: 'Sugestão de Melhoria',
          description: 'Tem uma ideia para melhorar o sistema? Conte-nos!',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'problema':
        return {
          icon: AlertTriangle,
          title: 'Reportar Problema',
          description: 'Encontrou algum bug ou problema? Ajude-nos a corrigir.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'feedback':
        return {
          icon: MessageSquare,
          title: 'Feedback Geral',
          description: 'Compartilhe sua experiência e opinião sobre o sistema.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const typeInfo = getTypeInfo(feedbackType);
  const IconComponent = typeInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Enviar Feedback</h2>
                <p className="text-blue-100 text-sm">Sua opinião é importante para nós</p>
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
        <div className="p-6 overflow-y-auto flex-1">
          {/* Tipo de Feedback */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tipo de Feedback</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setFeedbackType('sugestao')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  feedbackType === 'sugestao'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <Lightbulb className={`w-8 h-8 mb-2 ${
                    feedbackType === 'sugestao' ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    feedbackType === 'sugestao' ? 'text-yellow-800' : 'text-gray-700'
                  }`}>
                    Sugestão
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Melhorias</span>
                </div>
              </button>

              <button
                onClick={() => setFeedbackType('problema')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  feedbackType === 'problema'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <AlertTriangle className={`w-8 h-8 mb-2 ${
                    feedbackType === 'problema' ? 'text-red-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    feedbackType === 'problema' ? 'text-red-800' : 'text-gray-700'
                  }`}>
                    Problema
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Bugs</span>
                </div>
              </button>

              <button
                onClick={() => setFeedbackType('feedback')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  feedbackType === 'feedback'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <MessageSquare className={`w-8 h-8 mb-2 ${
                    feedbackType === 'feedback' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    feedbackType === 'feedback' ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    Feedback
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Geral</span>
                </div>
              </button>
            </div>
          </div>

          {/* Informações do tipo selecionado */}
          <div className={`p-4 rounded-lg border ${typeInfo.borderColor} ${typeInfo.bgColor} mb-6`}>
            <div className="flex items-center gap-3">
              <IconComponent className={`w-6 h-6 ${typeInfo.color}`} />
              <div>
                <h4 className={`font-semibold ${typeInfo.color}`}>{typeInfo.title}</h4>
                <p className="text-sm text-gray-600">{typeInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Campo de descrição */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva detalhadamente:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Conte-nos sobre ${feedbackType === 'sugestao' ? 'sua sugestão' : feedbackType === 'problema' ? 'seu problema' : 'seu feedback'}... (mínimo 10 caracteres)`}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={`${description.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                {description.length < 10 ? `Mínimo 10 caracteres (${description.length}/10)` : `${description.length}/1000 caracteres`}
              </span>
              {description.length >= 10 && (
                <span className="text-green-600">✓ Mínimo atingido</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={description.trim().length < 10 || isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              description.trim().length < 10 || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
