import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import MaintenanceAnimation from '../components/maintenance/MaintenanceAnimation';

const MaintenancePage: React.FC = () => {

  const handleSupport = () => {
    window.location.href = 'mailto:suporte@wmsistemas.inf.br?subject=Suporte - Portal Contador';
  };


  return (
    <div className="min-h-screen bg-[#0E0F13] text-[#F5F7FA] flex flex-col">
      {/* Header minimalista */}
      <header className="px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#4C9BFF] to-[#FFC24B] rounded-lg flex items-center justify-center">
              <span className="text-[#0E0F13] font-bold text-lg">WM</span>
            </div>
            <span className="text-xl font-bold text-[#F5F7FA]">WM SISTEMAS DE GESTÃO</span>
          </motion.div>
        </div>
      </header>

      {/* Hero central */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo textual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              {/* Badge de manutenção */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-[#FFC24B] text-[#0E0F13] px-4 py-2 rounded-full text-sm font-semibold mb-6"
              >
                <div className="w-2 h-2 bg-[#0E0F13] rounded-full animate-pulse" />
                Em manutenção
              </motion.div>

              {/* Título principal */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ fontFamily: 'Plus Jakarta Sans, Poppins, sans-serif' }}
              >
                Estamos em manutenção{' '}
                <span className="text-[#FFC24B]">🚧</span>
              </motion.h1>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg md:text-xl text-[#AAB2C8] mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Estamos trabalhando em melhorias para deixar tudo mais rápido e estável. 
                Voltamos em breve!
              </motion.p>

              {/* Botão de suporte */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSupport}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFC24B] text-[#0E0F13] rounded-xl hover:bg-[#FFC24B]/90 transition-all duration-300 font-medium mx-auto lg:mx-0"
                >
                  <Mail className="w-4 h-4" />
                  Falar com o suporte
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Ilustração animada */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center lg:justify-end"
            >
              <MaintenanceAnimation />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="px-6 py-8 border-t border-[#AAB2C8]/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center text-[#AAB2C8] text-sm"
          >
            <p className="mb-2">
              <span className="font-semibold text-[#F5F7FA]">WM SISTEMAS DE GESTÃO</span>
              {' • '}
              <span className="font-semibold text-[#F5F7FA]">Portal Contador</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <a
                href="mailto:suporte@wmsistemas.inf.br"
                className="flex items-center gap-1 hover:text-[#4C9BFF] transition-colors"
              >
                <Mail className="w-3 h-3" />
                suporte@wmsistemas.inf.br
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="tel:+553434238595"
                className="flex items-center gap-1 hover:text-[#4C9BFF] transition-colors"
              >
                <Phone className="w-3 h-3" />
                (34) 3423-8595
              </a>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Estilos para reduzir movimento se preferido */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
