import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getWorks } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

export const CatalogPage = () => {
  const { data: works, isLoading, error } = useQuery(getWorks);

  return (
    <div className="min-h-screen bg-noise text-neutral-900 dark:text-white p-6 md:p-16 font-sans selection:bg-[#d90429] selection:text-white">
      <header className="mb-10 md:mb-16 pb-6 md:pb-8 border-b-4 border-neutral-900 dark:border-white flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white break-words">
            Base de Dados
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-xs md:text-sm tracking-widest uppercase mt-2">
            Acervo Geral Catalogado
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link to="/add-work" className="brutalist-border bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 font-bold uppercase tracking-wider text-sm text-center">
            Submeter Obra
          </Link>
          <Link to="/" className="brutalist-border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center">
            Retornar
          </Link>
        </div>
      </header>

      {isLoading && (
        <div className="text-lg md:text-xl font-mono animate-pulse text-neutral-600 dark:text-neutral-400 uppercase">Processando indexação...</div>
      )}
      
      {error && (
        <div className="brutalist-border bg-white dark:bg-neutral-900 text-[#d90429] font-mono p-4 mb-8">
          [FALHA DE SISTEMA]: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {works?.map((work) => (
          <div key={work.id} className="brutalist-border bg-white dark:bg-neutral-900 flex flex-col h-full group hover:-translate-y-2 hover:rotate-1 transition-transform duration-300">
            {work.imageUrl ? (
              <div className="h-56 md:h-64 border-b-4 border-neutral-900 dark:border-white bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative">
                <img 
                  src={work.imageUrl} 
                  alt={work.title} 
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" 
                />
                {work.category && (
                  <div className="absolute top-4 left-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-3 py-1 text-xs font-bold uppercase border-2 border-neutral-900 dark:border-white shadow-[2px_2px_0_0_#171717] dark:shadow-[2px_2px_0_0_#fff]">
                    {work.category.name}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-56 md:h-64 border-b-4 border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center p-6 text-center">
                 <span className="font-mono text-neutral-400 uppercase tracking-widest text-xs md:text-sm">Sem Mídia Visual</span>
              </div>
            )}
            
            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl md:text-2xl font-black uppercase leading-tight group-hover:text-[#d90429] transition-colors">{work.title}</h2>
              </div>
              <p className="text-xs md:text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 font-mono">
                AUTORIA: {work.authorName || 'N/D'}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300 text-sm line-clamp-3 mb-6 flex-1">
                {work.description}
              </p>
              
              <a href="#" className="block text-center bg-transparent text-neutral-900 dark:text-white font-bold uppercase py-3 border-2 border-neutral-900 dark:border-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-colors text-xs md:text-sm tracking-widest mt-auto">
                Inspecionar Registro
              </a>
            </div>
          </div>
        ))}
        
        {works?.length === 0 && (
          <div className="col-span-full border-4 border-dashed border-neutral-400 dark:border-neutral-600 p-10 md:p-16 text-center bg-white/50 dark:bg-neutral-900/50">
            <h2 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase mb-2">Base de Dados Vazia</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-mono text-xs md:text-sm uppercase">O acervo aguarda sua primeira submissão acadêmica.</p>
          </div>
        )}
      </div>
    </div>
  );
};
