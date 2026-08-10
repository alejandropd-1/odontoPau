'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Key, Eye, EyeOff, LogIn } from 'lucide-react';
import EditorialHeader from '@/components/EditorialHeader';
import Footer from '@/components/Footer';

export default function EditorialLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/editorial/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/editorial');
        router.refresh();
      } else {
        setError(data.error || 'Contraseña incorrecta. Intentá nuevamente.');
      }
    } catch {
      setError('Ocurrió un error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <EditorialHeader showLogout={false} />

      <main className="dashboard dashboard--login">
        <div className="dashboard__lock-card">
          <div className="dashboard__lock-icon-wrap">
            <Lock className="dashboard__lock-icon" />
          </div>

          <h1 className="dashboard__lock-title">Acceso Restringido</h1>
          <p className="dashboard__lock-subtitle">
            Panel interno para gestión clínica y trazabilidad editorial. Por favor ingresá tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="dashboard__lock-form">
            <div className="dashboard__lock-input-wrap">
              <Key className="dashboard__lock-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresá tu contraseña..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="dashboard__lock-input"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="dashboard__lock-eye-btn"
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="dashboard__lock-eye-icon" /> : <Eye className="dashboard__lock-eye-icon" />}
              </button>
            </div>

            {error && <p className="dashboard__lock-error">{error}</p>}

            <button type="submit" disabled={isLoading} className="dashboard__lock-btn">
              <LogIn className="dashboard__lock-btn-icon" />
              {isLoading ? 'Verificando...' : 'Ingresar al Dashboard'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
