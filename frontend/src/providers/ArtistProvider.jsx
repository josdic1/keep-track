import { createContext, useState, useEffect, useMemo } from 'react';
import { getArtists } from '../services/api';

export const ArtistContext = createContext();

export function ArtistProvider({ children }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  async function fetchArtists() {
    try {
      setLoading(true);
      const response = await getArtists();
      setArtists(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(() => ({
    artists,
    loading,
    error,
    refetch: fetchArtists
  }), [artists, loading, error]);

  return (
    <ArtistContext.Provider value={value}>
      {children}
    </ArtistContext.Provider>
  );
}
