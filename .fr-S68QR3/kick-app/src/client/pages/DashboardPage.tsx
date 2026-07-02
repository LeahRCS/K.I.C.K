import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getWorks } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

export const DashboardPage = () => {
  const { data: works, isLoading } = useQuery(getWorks);

  return (
    <div className="min-h-screen bg-noise text-neutral-900 dark:text-white p-6 md:p-16 font-sans selection:bg-[#d90429] selection:text-white">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 md:mb-16 border-b-4 border-neutral-900 dark:border-white pb-6 md:pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">
            Painel Administrativo
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-xs md:text-sm tracking-widest uppercase mt-2">
            Gestão do Sistema de Arquivamento
          </p>
        </div>
        <Link to="/" className="brutalist-border bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-wider text-sm px-6 py-3 hover:bg-[#d90429] dark:hover:bg-[#d90429] dark:hover:text-white transition-colors w-full md:w-auto text-center">
          Retornar à Home
        </Link>
      </header>
      
      {isLoading ? (
        <div className="text-neutral-600 dark:text-neutral-400 font-mono text-lg md:text-xl uppercase animate-pulse">Sincronizando com a base de dados...</div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 brutalist-border p-6 md:p-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 border-b-2 border-neutral-200 dark:border-neutral-700 pb-4 gap-4">
            <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 dark:text-white tracking-tight">
              Registros Indexados <span className="text-neutral-400 dark:text-neutral-500 font-mono">[{works?.length}]</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse border-2 border-neutral-900 dark:border-white min-w-[600px]">
              <thead>
                <tr className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs md:text-sm font-bold uppercase tracking-wider">
                  <th className="p-3 md:p-4 border-r-2 border-neutral-700 dark:border-neutral-300">Identificação da Obra</th>
                  <th className="p-3 md:p-4 border-r-2 border-neutral-700 dark:border-neutral-300">Autoria</th>
                  <th className="p-3 md:p-4 border-r-2 border-neutral-700 dark:border-neutral-300">Classificação</th>
                  <th className="p-3 md:p-4 text-center">Controles</th>
                </tr>
              </thead>
              <tbody className="font-medium text-neutral-800 dark:text-neutral-200">
                {works?.map((work, index) => (
                  <tr key={work.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-800'} border-b-2 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:-translate-y-1 hover:shadow-[0_4px_0_0_#171717] dark:hover:shadow-[0_4px_0_0_#fff] transition-all text-sm md:text-base`}>
                    <td className="p-3 md:p-4 border-r-2 border-neutral-300 dark:border-neutral-700 font-bold">{work.title}</td>
                    <td className="p-3 md:p-4 border-r-2 border-neutral-300 dark:border-neutral-700 text-xs md:text-sm text-neutral-600 dark:text-neutral-400 uppercase">{work.authorName || 'N/D'}</td>
                    <td className="p-3 md:p-4 border-r-2 border-neutral-300 dark:border-neutral-700">
                      <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 px-2 md:px-3 py-1 uppercase text-[10px] md:text-xs font-bold border border-neutral-400 dark:border-neutral-500 whitespace-nowrap">
                        {work.category?.name || 'Não Classificado'}
                      </span>
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                        <button className="text-neutral-900 dark:text-white uppercase text-[10px] md:text-xs font-bold tracking-wider hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors underline decoration-2 underline-offset-4">Revisar</button>
                        <button className="text-[#d90429] uppercase text-[10px] md:text-xs font-bold tracking-wider hover:text-neutral-900 dark:hover:text-white transition-colors underline decoration-2 underline-offset-4">Expurgar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {works?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 md:p-12 text-center text-neutral-500 dark:text-neutral-400 font-mono text-xs md:text-sm uppercase bg-neutral-50 dark:bg-neutral-900">
                      O sistema não encontrou registros na base de dados ativa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
