"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function iniciarSesion(event: FormEvent) {
    event.preventDefault();

    setCargando(true);
    setError("");

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError || !data.user) {
      setError("El correo o la contraseña son incorrectos.");
      setCargando(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();

      setError("Este usuario no tiene permisos de administrador.");
      setCargando(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111] px-5 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm font-bold text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Volver al sitio
        </Link>

        <div className="rounded-[2rem] bg-[#f4f2ed] p-7 md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
            <Lock size={23} />
          </div>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-red-600">
            Trip Music
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Panel privado
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/40">
            Accedé al sistema de administración de Trip Music.
          </p>

          <form onSubmit={iniciarSesion} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-black">
                Correo electrónico
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="correo@ejemplo.com"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
              />
            </div>

            <div>
              <label className="text-sm font-black">Contraseña</label>

              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar al panel"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}