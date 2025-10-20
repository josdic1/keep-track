import { createContext, useState, useEffect, useMemo } from 'react';
import { getLinks } from '../services/api';

export const LinkContext = createContext();

export function LinkProvider({ children }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      setLoading(true);
      const response = await getLinks();
      setLinks(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(() => ({
    links,
    loading,
    error,
    refetch: fetchLinks
  }), [links, loading, error]);

  return (
    <LinkContext.Provider value={value}>
      {children}
    </LinkContext.Provider>
  );
}
