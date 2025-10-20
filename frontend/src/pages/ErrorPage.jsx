// src/pages/ErrorPage.jsx
import { useRouteError, Link, useNavigate } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  
  const errorMessages = {
    404: {
      emoji: '🔍',
      title: 'Page Not Found',
      message: "Looks like this track went missing!"
    },
    500: {
      emoji: '💥',
      title: 'Server Error',
      message: "Our servers hit a wrong note. Try again?"
    },
    default: {
      emoji: '😱',
      title: 'Oops!',
      message: "Something unexpected happened"
    }
  };
  
  const errorType = errorMessages[error?.status] || errorMessages.default;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        background: 'white',
        color: '#1a1a1a',
        padding: '3rem',
        borderRadius: '16px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {errorType.emoji}
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>
          {errorType.title}
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {errorType.message}
        </p>
        <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '2rem' }}>
          {error?.statusText || error?.message}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e5e5e5',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ← Go Back
          </button>
          <Link 
            to="/"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            🏠 Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage