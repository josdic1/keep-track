import { useContext } from 'react';
import { MediaContext } from '../providers/MediaProvider';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

export default function MediaPage() {
  const { medias, loading, error } = useContext(MediaContext);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Medias</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medias.map(media => (
          <Card key={media.id} title={media.name}>
            <p>ID: {media.id}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
