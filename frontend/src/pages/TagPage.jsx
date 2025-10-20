import { useContext } from 'react';
import { TagContext } from '../providers/TagProvider';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

export default function TagPage() {
  const { tags, loading, error } = useContext(TagContext);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tags</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.map(tag => (
          <Card key={tag.id} title={tag.name}>
            <p>ID: {tag.id}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
