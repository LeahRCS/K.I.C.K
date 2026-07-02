// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getWork, getCategories, updateWork } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useNavigate, useParams } from 'react-router';

export const EditWorkPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: work, isLoading: loadingWork } = useQuery(getWork, {
    id: id!,
  });
  const { data: categories, isLoading: loadingCategories } =
    useQuery(getCategories);
  const updateWorkAction = useAction(updateWork);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [relatedFileUrl, setRelatedFileUrl] = useState('');
  const [historicalLocation, setHistoricalLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate form when work data loads
  useEffect(() => {
    if (work) {
      setTitle(work.title || '');
      setDescription(work.description || '');
      setAuthorName(work.authorName || '');
      setImageUrl(work.imageUrl || '');
      setRelatedFileUrl(work.relatedFileUrl || '');
      setHistoricalLocation(work.historicalLocation || '');
      setCategoryId(work.categoryId || '');
    }
  }, [work]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Selecione uma categoria para a obra.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await updateWorkAction({
        id: id!,
        title,
        description,
        authorName,
        imageUrl,
        relatedFileUrl,
        historicalLocation,
        categoryId,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Falha ao atualizar o registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingWork) {
    return (
      <div className="min-h-screen bg-noise text-neutral-900 dark:text-white flex items-center justify-center">
        <p className="font-mono text-lg uppercase animate-pulse">
          Carregando registro...
        </p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-noise text-neutral-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-black text-2xl uppercase mb-4">
            Registro não encontrado
          </p>
          <Link
            to="/dashboard"
            className="brutalist-border inline-block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#d90429] transition-all"
          >
            Retornar ao Painel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noise text-neutral-900 dark:text-white p-6 md:p-16 font-sans selection:bg-[#d90429] selection:text-white">
      <header className="mb-10 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-neutral-900 dark:border-white pb-6 md:pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">
            Editar Registro
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-xs md:text-sm tracking-widest uppercase mt-2">
            Revisão e Atualização do Acervo
          </p>
        </div>
        <Link
          to="/dashboard"
          className="brutalist-border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full md:w-auto text-center"
        >
          Voltar ao Painel
        </Link>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 brutalist-border p-6 md:p-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
            {error && (
              <div className="bg-[#d90429] text-white font-bold p-3 text-sm uppercase brutalist-border">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col">
                <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                  Título da Obra *
                </label>
                <input
                  required
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-lg md:text-xl font-bold bg-transparent focus:border-[#d90429] dark:focus:border-[#d90429] focus:outline-none transition-colors rounded-none"
                  placeholder="Insira o título principal"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                  Autoria / Coletivo
                </label>
                <input
                  value={authorName}
                  onChange={(e: any) => setAuthorName(e.target.value)}
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-lg md:text-xl font-bold bg-transparent focus:border-[#d90429] dark:focus:border-[#d90429] focus:outline-none transition-colors rounded-none"
                  placeholder="Nome do autor ou grupo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col">
                <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                  Classificação *
                </label>
                {loadingCategories ? (
                  <div className="p-3 text-neutral-500 font-mono text-sm animate-pulse">
                    Carregando categorias...
                  </div>
                ) : (
                  <select
                    required
                    value={categoryId}
                    onChange={(e: any) => setCategoryId(e.target.value)}
                    className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg font-bold bg-transparent focus:border-[#d90429] focus:outline-none transition-colors rounded-none appearance-none"
                  >
                    <option value="">— Selecionar categoria —</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                  Localização Histórica
                </label>
                <input
                  value={historicalLocation}
                  onChange={(e: any) => setHistoricalLocation(e.target.value)}
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg font-bold bg-transparent focus:border-[#d90429] focus:outline-none transition-colors rounded-none"
                  placeholder="Ex: São Paulo, BR — 1985"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col">
                <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                  URL da Imagem de Referência
                </label>
                <input
                  value={imageUrl}
                  onChange={(e: any) => setImageUrl(e.target.value)}
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg bg-transparent focus:border-[#d90429] focus:outline-none transition-colors font-mono rounded-none break-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                  URL de Mídia / Vídeo
                </label>
                <input
                  value={relatedFileUrl}
                  onChange={(e: any) => setRelatedFileUrl(e.target.value)}
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg bg-transparent focus:border-[#d90429] focus:outline-none transition-colors font-mono rounded-none break-all"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                Descrição Técnica / Histórica *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                className="border-2 border-neutral-300 dark:border-neutral-700 p-4 text-sm md:text-base bg-transparent focus:border-[#d90429] focus:outline-none transition-colors resize-y rounded-none"
                placeholder="Forneça o contexto histórico, importância acadêmica e detalhes da obra..."
              />
            </div>

            <div className="pt-6 border-t-2 border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row justify-end gap-4">
              <Link
                to="/dashboard"
                className="brutalist-border text-center bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold uppercase tracking-widest text-base px-8 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="brutalist-border bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-widest text-base md:text-lg px-8 md:px-10 py-4 hover:bg-[#d90429] dark:hover:bg-[#d90429] dark:hover:text-white hover:-translate-y-2 hover:-rotate-1 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
