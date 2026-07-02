// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getApprovedWorks, getCategories, toggleFavorite, getFavorites } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { Link } from 'wasp/client/router';
import { Dialog } from '../../shared/components/Dialog';

export const CatalogPage = () => {
  const { data: user } = useAuth();
  const { data: works, isLoading: loadingWorks, error } = useQuery(getApprovedWorks);
  const { data: categories } = useQuery(getCategories);
  const { data: favorites } = useQuery(getFavorites, undefined, { enabled: !!user });
  const toggleFavAction = useAction(toggleFavorite);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const filteredWorks = useMemo(() => {
    if (!works) return [];
    let filtered = works;

    if (selectedCategory) {
      filtered = filtered.filter(w => w.categoryId === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(term) ||
        (w.authorName && w.authorName.toLowerCase().includes(term)) ||
        (w.description && w.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [works, searchTerm, selectedCategory]);

  const selectedWork = useMemo(() => {
    return works?.find(w => w.id === selectedWorkId);
  }, [works, selectedWorkId]);

  const handleToggleFavorite = async (e: React.MouseEvent, workId: string) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      await toggleFavAction({ workId });
    } catch (err: any) {
      alert(err.message || 'Erro ao favoritar.');
    }
  };

  const isFavorited = (workId: string) => {
    return favorites?.some(f => f.workId === workId) || false;
  };

  return (
    <div className="min-h-screen bg-noise text-neutral-900 dark:text-white p-6 md:p-16 font-sans selection:bg-[#d90429] selection:text-white relative">
      {user && user.strikes > 0 && (
        <div className="bg-[#d90429] text-white p-4 font-bold text-center uppercase tracking-widest text-sm md:text-base border-4 border-neutral-900 dark:border-white mb-8 brutalist-border shadow-[4px_4px_0_0_#171717] dark:shadow-[4px_4px_0_0_#fff] flex flex-col gap-2">
          <p>⚠️ ATENÇÃO: Você possui submissões rejeitadas ({user.strikes} strikes).</p>
          <p className="text-xs md:text-sm font-mono opacity-90">Se submeter mais obras que violem as regras e forem rejeitadas, sua conta será deletada e suas obras postadas apagadas PERMANENTEMENTE.</p>
        </div>
      )}

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

      {/* Busca e Filtros */}
      <div className="mb-12 flex flex-col md:flex-row gap-6 bg-white dark:bg-neutral-900 p-6 md:p-8 brutalist-border">
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-bold uppercase tracking-wider text-xs md:text-sm text-neutral-600 dark:text-neutral-400">Buscar no acervo</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            placeholder="Título, autor, descrição..."
            className="p-4 border-4 border-neutral-900 dark:border-white bg-transparent font-bold focus:outline-none focus:border-[#d90429] transition-colors"
          />
        </div>
        <div className="flex-1 md:max-w-xs flex flex-col gap-2">
          <label className="font-bold uppercase tracking-wider text-xs md:text-sm text-neutral-600 dark:text-neutral-400">Filtrar por classificação</label>
          <select
            value={selectedCategory}
            onChange={(e: any) => setSelectedCategory(e.target.value)}
            className="p-4 border-4 border-neutral-900 dark:border-white bg-transparent font-bold focus:outline-none focus:border-[#d90429] transition-colors appearance-none"
          >
            <option value="" className="text-black">Todas as categorias</option>
            {categories?.map(c => (
              <option key={c.id} value={c.id} className="text-black">{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loadingWorks && (
        <div className="text-lg md:text-xl font-mono animate-pulse text-neutral-600 dark:text-neutral-400 uppercase">Processando indexação...</div>
      )}
      
      {error && (
        <div className="brutalist-border bg-[#d90429] text-white font-mono p-4 mb-8 uppercase font-bold text-sm">
          [FALHA DE SISTEMA]: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredWorks?.map((work) => (
          <div key={work.id} className="brutalist-border bg-white dark:bg-neutral-900 flex flex-col h-full group hover:-translate-y-2 hover:rotate-1 transition-transform duration-300 relative">
            
            <button 
              onClick={(e) => handleToggleFavorite(e, work.id)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-900 brutalist-border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Favoritar obra"
            >
              {isFavorited(work.id) ? (
                <span className="text-[#d90429] text-xl">♥</span>
              ) : (
                <span className="text-neutral-900 dark:text-white text-xl">♡</span>
              )}
            </button>

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
              <div className="flex justify-between items-start mb-2 pr-12">
                <h2 className="text-xl md:text-2xl font-black uppercase leading-tight group-hover:text-[#d90429] transition-colors">{work.title}</h2>
              </div>
              <p className="text-xs md:text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 font-mono">
                AUTORIA: {work.authorName || 'N/D'}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300 text-sm line-clamp-3 mb-6 flex-1">
                {work.description}
              </p>
              
              <button 
                onClick={() => setSelectedWorkId(work.id)} 
                className="w-full block text-center bg-transparent text-neutral-900 dark:text-white font-bold uppercase py-3 border-2 border-neutral-900 dark:border-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-colors text-xs md:text-sm tracking-widest mt-auto cursor-pointer"
              >
                Inspecionar Registro
              </button>
            </div>
          </div>
        ))}
        
        {filteredWorks?.length === 0 && !loadingWorks && (
          <div className="col-span-full border-4 border-dashed border-neutral-400 dark:border-neutral-600 p-10 md:p-16 text-center bg-white/50 dark:bg-neutral-900/50">
            <h2 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase mb-2">Sem Resultados</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-mono text-xs md:text-sm uppercase">Nenhum registro encontrado para os filtros atuais.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedWorkId} onClose={() => setSelectedWorkId(null)}>
        {selectedWork && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-neutral-900 dark:border-white pb-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#d90429] break-words">
                  {selectedWork.title}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm tracking-widest uppercase mt-2">
                  ID: {selectedWork.id}
                </p>
              </div>
              {selectedWork.category && (
                <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-sm font-bold uppercase brutalist-border whitespace-nowrap">
                  {selectedWork.category.name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectedWork.imageUrl && (
                <div className="brutalist-border border-4">
                  <img src={selectedWork.imageUrl} alt={selectedWork.title} className="w-full h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              )}
              
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 text-sm mb-2">Autoria / Coletivo</h3>
                  <p className="text-xl md:text-2xl font-bold uppercase">{selectedWork.authorName || 'Não Documentado'}</p>
                </div>

                {selectedWork.historicalLocation && (
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 text-sm mb-2">Localização Histórica</h3>
                    <p className="text-lg font-bold uppercase">{selectedWork.historicalLocation}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 text-sm mb-2">Descrição Técnica</h3>
                  <p className="text-base leading-relaxed">{selectedWork.description}</p>
                </div>

                {selectedWork.relatedFileUrl && (
                  <div className="mt-auto pt-6 border-t-2 border-neutral-200 dark:border-neutral-800">
                    <a 
                      href={selectedWork.relatedFileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block brutalist-border bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#d90429] dark:hover:bg-[#d90429] dark:hover:text-white transition-colors"
                    >
                      Acessar Mídia Relacionada
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Auth Modal for Unregistered Users */}
      <Dialog open={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <div className="flex flex-col gap-6 text-center p-4">
          <div className="text-6xl mb-2">⚠️</div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#d90429]">
            Acesso Restrito
          </h2>
          <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 font-medium">
            Ei! Somente usuários cadastrados podem favoritar obras no acervo. Por que não se junta a nós?
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <Link to="/signup" className="brutalist-border bg-[#d90429] text-white px-8 py-4 font-black uppercase tracking-widest text-lg hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#171717] dark:hover:shadow-[4px_4px_0_0_#fff] transition-all">
              Juntar-se ao Acervo
            </Link>
            <button onClick={() => setShowAuthModal(false)} className="uppercase font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline decoration-2 underline-offset-4 text-sm mt-2">
              Talvez depois
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
