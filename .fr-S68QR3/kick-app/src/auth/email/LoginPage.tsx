import React, { useState } from 'react';
import { Link } from "wasp/client/router";
import { login } from 'wasp/client/auth';
import { AuthLayout } from '../AuthLayout';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      window.location.href = '/';
    } catch (err: any) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Identificação">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="bg-[#d90429] text-white font-bold p-3 text-sm uppercase brutalist-border">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase tracking-wider text-sm text-neutral-900 dark:text-white">E-mail de Acesso</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-4 border-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-100 font-bold focus:outline-none focus:border-[#d90429] transition-colors"
            placeholder="contato@acervo.org"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase tracking-wider text-sm text-neutral-900 dark:text-white">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-4 border-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-100 font-bold focus:outline-none focus:border-[#d90429] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-4 brutalist-border w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black uppercase tracking-widest text-lg px-8 py-4 hover:bg-[#d90429] dark:hover:bg-[#d90429] dark:hover:text-white transition-all disabled:opacity-50"
        >
          {isLoading ? 'Verificando...' : 'Entrar no Sistema'}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t-4 border-neutral-900 dark:border-white text-center">
        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
          Não possui credenciais?{" "}
          <Link to="/signup" className="text-neutral-900 dark:text-white underline decoration-2 hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors">
            Registrar-se
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
