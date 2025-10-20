export default function Card({ children, title }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
