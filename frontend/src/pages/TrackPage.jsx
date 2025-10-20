import { useContext } from 'react';
import TrackContext from '../contexts/TrackContext'
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

function TrackPage() {
  const { tracks, loading, error } = useContext(TrackContext);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tracks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map(track => (
          <Card key={track.id} title={track.name}>
            <p>ID: {track.id}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TrackPage;
