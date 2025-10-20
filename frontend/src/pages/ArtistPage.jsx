import { useContext } from 'react';
import { ArtistContext } from '../providers/ArtistProvider';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

export default function ArtistPage() {
  const { artists, loading, error } = useContext(ArtistContext);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Artists</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map(artist => (
          <Card key={artist.id} title={artist.name}>
            <p>ID: {artist.id}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
