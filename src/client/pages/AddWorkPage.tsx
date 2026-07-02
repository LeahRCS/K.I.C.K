// @ts-nocheck
import React, { useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getCategories, createWork } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useNavigate } from 'react-router';

export const AddWorkPage = () => {
  const { data: categories, isLoading: loadingCategories } =
    useQuery(getCategories);
  const createWorkAction = useAction(createWork);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [relatedFileUrl, setRelatedFileUrl] = useState('');
  const [historicalLocation, setHistoricalLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Selecione uma categoria para a obra.');
      return;
    }
    if (!acceptedTerms) {
      setError('Você deve concordar com os Termos de Uso.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await createWorkAction({
        title,
        description,
        authorName: authorName || undefined,
        imageUrl: imageUrl || undefined,
        relatedFileUrl: relatedFileUrl || undefined,
        historicalLocation: historicalLocation || undefined,
        tags: '[]',
        categoryId,
      });
      navigate('/catalog');
    } catch (err: any) {
      setError(err?.message || 'Falha na submissão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-noise text-neutral-900 dark:text-white p-6 md:p-16 font-sans selection:bg-[#d90429] selection:text-white">
      <header className="mb-10 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-neutral-900 dark:border-white pb-6 md:pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">
            Formulário de Submissão
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-xs md:text-sm tracking-widest uppercase mt-2">
            Inclusão de Novos Registros no Acervo
          </p>
        </div>
        <Link
          to="/catalog"
          className="brutalist-border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full md:w-auto text-center"
        >
          Voltar ao Catálogo
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
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-lg md:text-xl font-bold bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-[#d90429] dark:focus:border-[#d90429] focus:outline-none transition-colors rounded-none"
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
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-lg md:text-xl font-bold bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-[#d90429] dark:focus:border-[#d90429] focus:outline-none transition-colors rounded-none"
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
                    className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg font-bold bg-transparent text-neutral-900 dark:text-white focus:border-[#d90429] focus:outline-none transition-colors rounded-none appearance-none"
                  >
                    <option value="" className="text-black">— Selecionar categoria —</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id} className="text-black">
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
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg font-bold bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-[#d90429] focus:outline-none transition-colors rounded-none"
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
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-[#d90429] focus:outline-none transition-colors font-mono rounded-none break-all"
                  placeholder="https://..."
                />
                <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
                  Forneça um link direto válido (.jpg, .png)
                </p>
              </div>

              <div className="flex flex-col">
                <label className="font-bold uppercase text-xs md:text-sm mb-2 text-neutral-600 dark:text-neutral-400 tracking-wider">
                  URL de Mídia / Vídeo
                </label>
                <input
                  value={relatedFileUrl}
                  onChange={(e: any) => setRelatedFileUrl(e.target.value)}
                  className="border-b-2 border-neutral-300 dark:border-neutral-700 p-3 text-base md:text-lg bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-[#d90429] focus:outline-none transition-colors font-mono rounded-none break-all"
                  placeholder="https://youtube.com/..."
                />
                <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
                  Opcional. Link para arquivo de áudio ou vídeo.
                </p>
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
                className="border-2 border-neutral-300 dark:border-neutral-700 p-4 text-sm md:text-base bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-[#d90429] focus:outline-none transition-colors resize-y rounded-none"
                placeholder="Forneça o contexto histórico, importância acadêmica e detalhes da obra..."
              />
            </div>

            <div className="flex items-start gap-4 p-4 border-2 border-[#d90429]/30 bg-[#d90429]/5 dark:bg-[#d90429]/10">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#d90429] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 cursor-pointer">
                Declaro que a obra carregada não infringe nossos <Link to="/terms" className="font-bold underline text-[#d90429] hover:text-neutral-900 dark:hover:text-white transition-colors" target="_blank">Termos de Uso</Link> e possuo os direitos necessários. Estou ciente de que, após a submissão, a obra ficará <strong>em análise</strong> e você deverá aguardar a aprovação até ela chegar ao feed público.
              </label>
            </div>

            <div className="pt-6 border-t-2 border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="brutalist-border w-full md:w-auto bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-widest text-base md:text-lg px-8 md:px-10 py-4 hover:bg-[#d90429] dark:hover:bg-[#d90429] dark:hover:text-white hover:-translate-y-2 hover:-rotate-1 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Submetendo...' : 'Submeter ao Acervo'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
