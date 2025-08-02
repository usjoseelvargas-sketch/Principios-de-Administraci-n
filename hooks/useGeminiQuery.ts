
import { useState, useCallback } from 'react';
import { generateText, generateTextWithJsonOutput } from '../services/geminiService';
import { GeminiServiceError } from '../types';

type QueryFunction<T> = (prompt: string, systemInstruction?: string) => Promise<T | GeminiServiceError>;

interface UseGeminiQueryReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  executeQuery: (prompt: string, systemInstruction?: string) => Promise<void>;
  reset: () => void;
}

function useGeminiQuery<T,>(queryFn: QueryFunction<T>): UseGeminiQueryReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeQuery = useCallback(async (prompt: string, systemInstruction?: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    const result = await queryFn(prompt, systemInstruction);
    if (typeof result === 'object' && result !== null && 'message' in result && typeof (result as any).message === 'string') {
      setError((result as GeminiServiceError).message);
      setData(null);
    } else {
      setData(result as T);
      setError(null);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFn]); // queryFn is stable if it's a direct import

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, executeQuery, reset };
}

export const useGeminiTextQuery = (): UseGeminiQueryReturn<string> => {
  return useGeminiQuery<string>(generateText);
};

export const useGeminiJsonQuery = <T,>(): UseGeminiQueryReturn<T> => {
  return useGeminiQuery<T>(generateTextWithJsonOutput as QueryFunction<T>);
};

export default useGeminiQuery;
