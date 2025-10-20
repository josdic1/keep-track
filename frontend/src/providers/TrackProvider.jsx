import { useState, useEffect, useMemo } from 'react';
import { getTracks } from '../services/api';
import TrackContext from '../contexts/TrackContext';

function TrackProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTracks();
  }, []);



  async function fetchTracks() {
    try {
      setLoading(true);
      const response = await getTracks();
      setTracks(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(() => ({
    tracks,
    loading,
    error,
    refetch: fetchTracks
  }), [tracks, loading, error]);

  return (
    <TrackContext.Provider value={value}>
      {children}
    </TrackContext.Provider>
  );
}

export default TrackProvider