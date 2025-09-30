import { useState, useEffect, useCallback } from 'react';
import { batchRequests } from '../services/api';
import type { BatchRequest, BatchListResponse, CreateBatchRequest } from '../types';

export const useBatchRequests = () => {
  const [batches, setBatches] = useState<BatchRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar novo lote
  const createBatch = useCallback(async (data: CreateBatchRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await batchRequests.createBatch(data);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar lote';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Consultar status de um lote específico
  const getBatchStatus = useCallback(async (batchId: string) => {
    try {
      const response = await batchRequests.getBatchStatus(batchId);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao consultar status do lote';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Listar lotes do usuário
  const getBatches = useCallback(async (page: number = 1, limit: number = 10, status?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: BatchListResponse = await batchRequests.getBatches(page, limit, status);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao listar lotes';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cancelar lote
  const cancelBatch = useCallback(async (batchId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await batchRequests.cancelBatch(batchId);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao cancelar lote';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    batches,
    isLoading,
    error,
    createBatch,
    getBatchStatus,
    getBatches,
    cancelBatch,
    setError,
  };
};

// Hook para monitorar um lote específico
export const useBatchMonitor = (batchId: string | null, interval: number = 5000) => {
  const [batch, setBatch] = useState<BatchRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchStatus = useCallback(async () => {
    if (!batchId) return;
    
    try {
      const response = await batchRequests.getBatchStatus(batchId);
      setBatch(response);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao consultar status do lote';
      setError(errorMessage);
    }
  }, [batchId]);

  useEffect(() => {
    if (!batchId) return;

    // Buscar status inicial
    setIsLoading(true);
    fetchBatchStatus().finally(() => setIsLoading(false));

    // Configurar polling apenas se o lote não estiver completo
    const shouldPoll = () => {
      return batch && !['completed', 'error'].includes(batch.status);
    };

    const pollInterval = setInterval(() => {
      if (shouldPoll()) {
        fetchBatchStatus();
      }
    }, interval);

    return () => clearInterval(pollInterval);
  }, [batchId, fetchBatchStatus, interval, batch]);

  return {
    batch,
    isLoading,
    error,
    refetch: fetchBatchStatus,
  };
};
