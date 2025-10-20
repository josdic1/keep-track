import { useContext } from 'react';
import { LinkContext } from '../providers/LinkProvider';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

export default function LinkPage() {
  const { links, loading, error } = useContext(LinkContext);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Links</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map(link => (
          <Card key={link.id} title={link.name}>
            <p>ID: {link.id}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
