import { useState, useEffect } from 'react';

interface MaintenanceConfig {
  isMaintenanceMode: boolean;
  message?: string;
}

export const useMaintenance = () => {
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>({
    isMaintenanceMode: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        // Verificar variável de ambiente no frontend
        const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
        
        if (maintenanceMode) {
          setMaintenanceConfig({
            isMaintenanceMode: true,
            message: 'Sistema em manutenção'
          });
        } else {
          // Opcional: verificar via API se necessário
          // const response = await api.get('/maintenance/status');
          // setMaintenanceConfig(response.data);
          setMaintenanceConfig({
            isMaintenanceMode: false
          });
        }
      } catch (error) {
        console.error('Erro ao verificar modo de manutenção:', error);
        // Em caso de erro, assumir que não está em manutenção
        setMaintenanceConfig({
          isMaintenanceMode: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceMode();
  }, []);

  return {
    isMaintenanceMode: maintenanceConfig.isMaintenanceMode,
    maintenanceMessage: maintenanceConfig.message,
    isLoading
  };
};
