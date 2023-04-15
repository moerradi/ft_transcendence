// useAxios.ts
import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

type UseAxiosResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export const useAxios = <T>(url: string): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<T> = await axios.get(url);
        setData(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};
