// @ts-nocheck
import { ReactNode } from "react";
import { Link } from "wasp/client/router";
import { TearingBackground } from "../client/components/TearingBackground";

export function AuthLayout({ children, title }: { children: ReactNode, title?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-noise text-neutral-900 dark:text-white relative overflow-hidden">
      <TearingBackground />
      <nav className="p-6 border-b-4 border-neutral-900 dark:border-white bg-white dark:bg-neutral-950 flex justify-between items-center z-10">
        <Link to="/" className="text-2xl font-black uppercase tracking-tighter hover:text-[#d90429] transition-colors">K.I.C.K.</Link>
      </nav>
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-neutral-900 brutalist-border p-8 md:p-10 relative">
          {title && (
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 border-b-4 border-neutral-900 dark:border-white pb-4 text-neutral-900 dark:text-white">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
