import { createContext, useState, useEffect, useMemo } from 'react';
import { getTags } from '../services/api';

export const TagContext = createContext();

export function TagProvider({ children }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      setLoading(true);
      const response = await getTags();
      setTags(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(() => ({
    tags,
    loading,
    error,
    refetch: fetchTags
  }), [tags, loading, error]);

  return (
    <TagContext.Provider value={value}>
      {children}
    </TagContext.Provider>
  );
}
