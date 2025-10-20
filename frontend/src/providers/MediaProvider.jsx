import { createContext, useState, useEffect, useMemo } from 'react';
import { getMedias } from '../services/api';

export const MediaContext = createContext();

export function MediaProvider({ children }) {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedias();
  }, []);

  async function fetchMedias() {
    try {
      setLoading(true);
      const response = await getMedias();
      setMedias(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(() => ({
    medias,
    loading,
    error,
    refetch: fetchMedias
  }), [medias, loading, error]);

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
}
