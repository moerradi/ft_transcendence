import { useState, useEffect } from 'react';

interface FetchResult<T> {
  data: T | null;
  isPending: boolean;
  error: string | null;
}

const useFetch = <T>(url: string): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      fetch(url)
      .then((res: Response) => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        } 
        return res.json();
      })
      .then((data: T) => {
        setIsPending(false);
        setData(data);
        setError(null);
      })
      .catch((err: Error) => {
        // auto catches network / connection error
        setIsPending(false);
        setError(err.message);
      })
    }, 1000);
  }, [url])

  return { data, isPending, error };
}

export default useFetch;
