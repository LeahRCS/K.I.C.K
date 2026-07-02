// @ts-nocheck
import { Link } from "wasp/client/router";
import { ResetPasswordForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";

export function PasswordResetPage() {
  return (
    <AuthLayout title="Redefinir Senha">
      <ResetPasswordForm />
      <div className="mt-8 pt-6 border-t-4 border-neutral-900 dark:border-white text-center">
        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
          Senha redefinida?{" "}
          <Link to="/login" className="text-neutral-900 dark:text-white underline decoration-2 hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors">
            Acessar o Sistema
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
