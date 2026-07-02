// @ts-nocheck
import { logout, useAuth } from "wasp/client/auth";
import { Link } from "wasp/client/router";
// Remover o import do Logo antigo que não combina com a nova UI

export function Header() {
  const { data: user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex w-full items-center justify-between p-4 md:px-8">
        <Link to="/" className="flex items-center hover:-translate-y-1 transition-transform group">
          <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black text-xl px-2 py-1 uppercase tracking-tighter mr-3 brutalist-border group-hover:bg-[#d90429] transition-colors">
            K.I.C.K
          </div>
          <h1 className="text-sm font-bold tracking-widest hidden sm:block uppercase">Acervo</h1>
        </Link>
        <nav>
          <ul className="flex gap-4 font-bold uppercase text-xs sm:text-sm tracking-wider items-center">
            {user ? (
              <>
                <li className="hidden sm:block mr-2 font-mono text-neutral-500 dark:text-neutral-400">
                  [{user.username || user.email}]
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors underline decoration-2 underline-offset-4">Painel</Link>
                </li>
                <li>
                  <button onClick={logout} className="hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors underline decoration-2 underline-offset-4 cursor-pointer">Sair</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signup" className="hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors underline decoration-2 underline-offset-4">Registrar</Link>
                </li>
                <li>
                  <Link to="/login" className="brutalist-border bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 hover:bg-[#d90429] dark:hover:bg-[#d90429] dark:hover:text-white transition-colors">
                    Entrar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
