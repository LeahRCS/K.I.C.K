// @ts-nocheck
import React, { useState } from 'react';
import { Link } from "wasp/client/router";
import { signup } from 'wasp/client/auth';
import { AuthLayout } from '../AuthLayout';

export function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 6) {
      setError('O pseudônimo deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signup({ email, password, username });
      setSignupSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Falha ao registrar credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <AuthLayout title="Registro Criado">
        <div className="flex flex-col gap-6 text-center">
          <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold p-6 brutalist-border">
            <p className="text-lg uppercase tracking-wider mb-2">✓ Credenciais registradas</p>
            <p className="text-sm opacity-80">
              Um e-mail de verificação foi enviado para <strong>{email}</strong>.
            </p>
          </div>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
            Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
            Após a verificação, você poderá acessar o sistema.
          </p>

          <div className="border-t-4 border-neutral-900 dark:border-white pt-6">
            <Link 
              to="/login" 
              className="brutalist-border inline-block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#d90429] dark:hover:bg-[#d90429] dark:hover:text-white transition-all"
            >
              Ir para o Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Novo Registro">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="bg-[#d90429] text-white font-bold p-3 text-sm uppercase brutalist-border">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase tracking-wider text-sm text-neutral-900 dark:text-white">Pseudônimo (Mín. 6)</label>
          <input
            type="text"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="p-4 border-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-100 font-bold focus:outline-none focus:border-[#d90429] transition-colors"
            placeholder="spiderpunk99"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase tracking-wider text-sm text-neutral-900 dark:text-white">E-mail de Contato</label>
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
          <label className="font-bold uppercase tracking-wider text-sm text-neutral-900 dark:text-white">Senha Forte (Mín. 8)</label>
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
          {isLoading ? 'Processando...' : 'Autenticar Registro'}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t-4 border-neutral-900 dark:border-white text-center">
        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
          Já indexado no sistema?{" "}
          <Link to="/login" className="text-neutral-900 dark:text-white underline decoration-2 hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors">
            Acesso Direto
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
