import { useState, useEffect, useMemo } from 'react';
import { getTracks, postTrack } from '../services/api';
import TrackContext from '../contexts/TrackContext';

function TrackProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inEditMode, setInEditMode] = useState(false);

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

  async function createTrack(trackData) {
    try {
      setLoading(true);
      const response = await postTrack(trackData);
      setTracks([...tracks, response.data]);
      setError(null);
      setInEditMode(false);
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
    fetchTracks,
    createTrack,
    inEditMode, setInEditMode
  }), [tracks, loading, error, inEditMode]);

  return (
    <TrackContext.Provider value={value}>
      {children}
    </TrackContext.Provider>
  );
}

export default TrackProvider