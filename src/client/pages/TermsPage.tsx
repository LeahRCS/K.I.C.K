import React from 'react';
import { Link } from 'wasp/client/router';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-noise text-neutral-900 dark:text-white p-6 md:p-16 font-sans selection:bg-[#d90429] selection:text-white">
      <header className="mb-10 md:mb-16 pb-6 md:pb-8 border-b-4 border-neutral-900 dark:border-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white break-words">
          Termos de Uso
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-mono text-xs md:text-sm tracking-widest uppercase mt-2">
          Políticas do Acervo K.I.C.K
        </p>
      </header>

      <main className="max-w-4xl bg-white dark:bg-neutral-900 brutalist-border p-8 md:p-12 mb-12">
        <div className="flex flex-col gap-8 text-base md:text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-[#d90429]">1. Política de Moderação</h2>
            <p className="mb-4">
              Todas as obras submetidas a este acervo passam por um rigoroso processo de revisão por nossa equipe de curadoria. Nenhuma obra é publicada "cegamente". Obras com conteúdo inapropriado, ofensivo, sexualmente explícito ou que violem as leis vigentes serão categoricamente rejeitadas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-[#d90429]">2. Punições e Banimentos</h2>
            <p className="mb-4">
              Levamos a integridade deste acervo muito a sério. Caso um usuário tenha uma submissão rejeitada por violação destes termos, um "strike" (aviso) será aplicado em sua conta. Múltiplos strikes resultarão no apagamento permanente de sua conta e de todas as obras atreladas a ela.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-[#d90429]">3. Direitos Autorais</h2>
            <p className="mb-4">
              Ao submeter uma obra, você declara que possui os direitos para catalogá-la ou que a mesma se encontra em domínio público. O K.I.C.K não se responsabiliza pelo uso indevido de mídias por parte dos usuários.
            </p>
          </section>
        </div>
      </main>

      <Link to="/" className="brutalist-border bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 inline-block">
        Voltar à Página Inicial
      </Link>
    </div>
  );
};
