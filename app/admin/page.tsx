"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Image as ImageIcon,
  LogOut,
  Newspaper,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Estadisticas = {
  noticias: number;
  eventos: number;
  multimedia: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Estadisticas>({
    noticias: 0,
    eventos: 0,
    multimedia: 0,
  });

  const [cargando, setCargando] = useState(true);
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    async function cargar() {
      const [noticias, eventos, multimedia] = await Promise.all([
        supabase.from("noticias").select("id", { count: "exact", head: true }),
        supabase.from("eventos").select("id", { count: "exact", head: true }),
        supabase
          .from("multimedia")
          .select("id", { count: "exact", head: true }),
      ]);

      setStats({
        noticias: noticias.count || 0,
        eventos: eventos.count || 0,
        multimedia: multimedia.count || 0,
      });

      setCargando(false);
    }

    cargar();
  }, []);

  async function cerrarSesion() {
    setCerrando(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-center md:justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-sm font-black">
              TM
            </div>

            <div>
              <p className="text-lg font-black tracking-[-0.04em]">
                Trip Music
              </p>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                Panel de administración
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-black text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Ver sitio
              <ExternalLink size={14} />
            </Link>

            <button
              onClick={cerrarSesion}
              disabled={cerrando}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-black text-white/70 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
            >
              <LogOut size={14} />
              {cerrando ? "Saliendo..." : "Cerrar sesión"}
            </button>
          </div>
        </header>

        <section className="py-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] md:text-6xl">
            Buen día 👋
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Desde acá podés administrar todo el contenido de Trip Music.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              titulo: "Noticias",
              valor: stats.noticias,
              icono: Newspaper,
              href: "/admin/noticias",
            },
            {
              titulo: "Eventos",
              valor: stats.eventos,
              icono: CalendarDays,
              href: "/admin/eventos",
            },
            {
              titulo: "Multimedia",
              valor: stats.multimedia,
              icono: ImageIcon,
              href: "/admin/multimedia",
            },
          ].map((item) => {
            const Icon = item.icono;

            return (
              <Link
                key={item.titulo}
                href={item.href}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={19} />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-white/20 transition group-hover:translate-x-1 group-hover:text-red-500"
                  />
                </div>

                <p className="mt-8 text-sm font-bold text-white/40">
                  {item.titulo}
                </p>

                <p className="mt-1 text-4xl font-black">
                  {cargando ? "—" : item.valor}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-black">Acciones rápidas</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/noticias/nueva"
              className="group rounded-[2rem] bg-red-600 p-6 transition hover:bg-red-500"
            >
              <Plus size={22} />

              <p className="mt-8 text-lg font-black">Nueva noticia</p>

              <p className="mt-2 text-sm text-white/60">
                Crear y publicar contenido.
              </p>
            </Link>

            <Link
              href="/admin/eventos"
              className="group rounded-[2rem] bg-white/[0.06] p-6 transition hover:bg-white/[0.1]"
            >
              <CalendarDays size={22} />

              <p className="mt-8 text-lg font-black">Gestionar eventos</p>

              <p className="mt-2 text-sm text-white/40">
                Crear, editar y eliminar eventos.
              </p>
            </Link>

            <Link
              href="/admin/multimedia"
              className="group rounded-[2rem] bg-white/[0.06] p-6 transition hover:bg-white/[0.1]"
            >
              <ImageIcon size={22} />

              <p className="mt-8 text-lg font-black">Subir multimedia</p>

              <p className="mt-2 text-sm text-white/40">
                Fotos y videos de las coberturas.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}