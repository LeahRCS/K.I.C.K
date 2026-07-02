import React from 'react';
import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { motion } from 'framer-motion';
import { LogOut, ArrowRight, Library, Shield, Menu } from 'lucide-react';
import { logout } from 'wasp/client/auth';
import { TearingBackground } from '../components/TearingBackground';

export const LandingPage = () => {
  const { data: user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-noise font-sans text-neutral-900 dark:text-white overflow-x-hidden selection:bg-[#d90429] selection:text-white flex flex-col">
      <TearingBackground />
      <nav className="flex items-center justify-between p-4 md:p-6 px-6 md:px-12 border-b-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-950 z-10 relative">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-neutral-900 dark:text-white">
            K.I.C.K
          </h1>
          <span className="text-xs font-bold tracking-widest bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1 uppercase hidden lg:inline-block">
            Keep It Cult, Kiddo.
          </span>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-neutral-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={28} />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 font-bold uppercase tracking-widest text-xs">
          {user ? (
            <>
              <Link to="/catalog" className="hover:text-[#d90429] transition-colors">
                Acervo
              </Link>
              <Link to="/dashboard" className="hover:text-[#d90429] transition-colors">
                Administração
              </Link>
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border-2 border-neutral-900 dark:border-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-colors">
                Sair <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#d90429] transition-colors">
                Acesso
              </Link>
              <Link to="/signup" className="px-6 py-2 border-2 border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-white dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Registrar
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col border-b-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-950 font-bold uppercase tracking-widest text-sm divide-y-2 divide-neutral-200 dark:divide-neutral-800">
          {user ? (
            <>
              <Link to="/catalog" className="p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">Acervo</Link>
              <Link to="/dashboard" className="p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">Administração</Link>
              <button onClick={logout} className="p-4 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-left w-full">
                Sair <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">Acesso</Link>
              <Link to="/signup" className="p-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">Registrar</Link>
            </>
          )}
        </div>
      )}

      <main className="flex-1 flex flex-col justify-center px-6 md:px-12 py-10 md:py-16 relative">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-block border-l-4 border-[#d90429] pl-4 mb-6">
                <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-neutral-600 dark:text-neutral-400">Sistema de Arquivamento Digital</p>
              </div>
              
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[1.1] md:leading-[0.9] tracking-tighter text-neutral-900 dark:text-white mb-6 md:mb-8 break-words">
                Preserve a <br/>
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #d90429' }}>História</span><br/>
                Do seu jeito.
              </h2>
              
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-neutral-700 dark:text-neutral-300 max-w-2xl mb-8 md:mb-10 leading-relaxed">
                Uma plataforma acadêmica e curatorial para gerenciamento de acervo cultural. Estruturamos, organizamos e preservamos a memória da cultura pop e movimentos marginais.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={user ? "/catalog" : "/signup"} className="w-full sm:w-auto">
                  <button className="brutalist-border w-full flex justify-center items-center gap-4 bg-[#d90429] text-white font-bold uppercase tracking-widest px-6 md:px-8 py-4 text-base md:text-lg">
                    Consultar Acervo <ArrowRight size={20} />
                  </button>
                </Link>
                
                <Link to="/add-work" className="w-full sm:w-auto">
                  <button className="brutalist-border w-full flex justify-center items-center gap-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold uppercase tracking-widest px-6 md:px-8 py-4 text-base md:text-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    Submeter Obra
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 brutalist-border p-8 hover:-translate-y-2 hover:rotate-1 cursor-default transition-transform duration-300 group"
            >
              <Library size={36} className="text-[#d90429] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-xl uppercase mb-2 group-hover:text-[#d90429] transition-colors">Curadoria Aberta</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Nosso sistema utiliza indexação de URLs para referenciar arquivos externos sem sobrecarregar a base de dados, garantindo um acervo vasto e descentralizado.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#d90429] brutalist-border p-8 text-white hover:-translate-y-2 hover:-rotate-1 cursor-default transition-transform duration-300 group"
            >
              <Shield size={36} className="text-white mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-xl uppercase mb-2 group-hover:text-neutral-900 dark:group-hover:text-black transition-colors">Preservação</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Manutenção e registro histórico de obras raras, fotografias de época e manifestos culturais. Um esforço acadêmico para imortalizar o efêmero.
              </p>
            </motion.div>
          </div>
          
        </div>
      </main>
      
      <footer className="border-t-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-950 p-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
        <p>&copy; 2026 K.I.C.K PROJECT</p>
        <p className="text-center">DISCIPLINA DE PROGRAMAÇÃO FULL STACK</p>
      </footer>
    </div>
  );
};
