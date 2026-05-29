import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import '../styles/dashboard.css';

export default function NotFound() {
  return (
    <div className="db-root" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
      <AlertCircle size={64} style={{ color: 'var(--error-1)' }} />
      <h1 style={{ fontSize: '2rem', color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-2)' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  );
}
