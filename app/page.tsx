"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Play,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Noticia = {
  id: string;
  titulo: string;
  slug: string;
  bajada: string | null;
  imagen_principal: string | null;
  categoria: string | null;
  created_at: string;
};

type Evento = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  fecha: string | null;
  lugar: string | null;
  ciudad: string | null;
  imagen_principal: string | null;
};

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(fecha));
}

function formatearFechaCorta(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  })
    .format(new Date(fecha))
    .replace(".", "")
    .toUpperCase();
}

export default function HomePage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarContenido() {
      const [noticiasResponse, eventosResponse] = await Promise.all([
        supabase
          .from("noticias")
          .select(
            "id, titulo, slug, bajada, imagen_principal, categoria, created_at"
          )
          .eq("publicada", true)
          .order("created_at", { ascending: false })
          .limit(8),

        supabase
          .from("eventos")
          .select(
            "id, nombre, slug, descripcion, fecha, lugar, ciudad, imagen_principal"
          )
          .order("fecha", { ascending: true })
          .limit(6),
      ]);

      if (noticiasResponse.error) {
        console.error("Error cargando noticias:", noticiasResponse.error);
      } else {
        setNoticias(noticiasResponse.data || []);
      }

      if (eventosResponse.error) {
        console.error("Error cargando eventos:", eventosResponse.error);
      } else {
        setEventos(eventosResponse.data || []);
      }

      setCargando(false);
    }

    cargarContenido();
  }, []);

  const principal = noticias[0];
  const secundarias = noticias.slice(1, 3);
  const ultimas = noticias.slice(3);

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 md:px-8 md:pt-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-600">
              <Sparkles size={14} />
              Trip Music
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.055em] md:text-6xl">
              Todo lo que pasa en la música.
            </h1>
          </div>

          <Link
            href="/noticias"
            className="hidden items-center gap-2 text-sm font-black transition hover:text-red-600 md:flex"
          >
            Ver todas las noticias
            <ArrowRight size={17} />
          </Link>
        </div>

        {cargando ? (
          <div className="grid gap-5 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="h-[520px] animate-pulse rounded-[2rem] bg-black/5" />
            <div className="grid gap-5">
              <div className="h-[247px] animate-pulse rounded-[2rem] bg-black/5" />
              <div className="h-[247px] animate-pulse rounded-[2rem] bg-black/5" />
            </div>
          </div>
        ) : principal ? (
          <>
            <div className="grid gap-5 lg:grid-cols-[1.6fr_0.8fr]">
              <Link
                href={`/noticias/${principal.slug}`}
                className="group relative min-h-[500px] overflow-hidden rounded-[2rem] bg-black"
              >
                {principal.imagen_principal ? (
                  <img
                    src={principal.imagen_principal}
                    alt={principal.titulo}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em]">
                      {principal.categoria || "Música"}
                    </span>

                    <span className="text-xs font-bold text-white/60">
                      {formatearFecha(principal.created_at)}
                    </span>
                  </div>

                  <h2 className="max-w-4xl text-3xl font-black leading-[1] tracking-[-0.045em] md:text-5xl">
                    {principal.titulo}
                  </h2>

                  {principal.bajada && (
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                      {principal.bajada}
                    </p>
                  )}

                  <div className="mt-7 flex items-center gap-2 text-sm font-black">
                    Leer noticia
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>

              <div className="grid gap-5">
                {secundarias.map((noticia) => (
                  <Link
                    key={noticia.id}
                    href={`/noticias/${noticia.slug}`}
                    className="group relative min-h-[240px] overflow-hidden rounded-[2rem] bg-black"
                  >
                    {noticia.imagen_principal ? (
                      <img
                        src={noticia.imagen_principal}
                        alt={noticia.titulo}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-black" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                        {noticia.categoria || "Música"}
                      </p>

                      <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.03em]">
                        {noticia.titulo}
                      </h3>
                    </div>
                  </Link>
                ))}

                {secundarias.length === 0 && (
                  <div className="flex min-h-[240px] items-center justify-center rounded-[2rem] border border-dashed border-black/10 bg-black/[0.02] p-8 text-center">
                    <p className="text-sm font-bold text-black/35">
                      Próximamente más noticias.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 md:hidden">
              <Link
                href="/noticias"
                className="flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-sm font-black text-white"
              >
                Ver todas las noticias
                <ArrowRight size={17} />
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-black/10 p-12 text-center">
            <p className="text-lg font-black">Todavía no hay noticias.</p>
            <p className="mt-2 text-sm text-black/40">
              Las próximas publicaciones aparecerán acá.
            </p>
          </div>
        )}
      </section>

      {ultimas.length > 0 && (
        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Actualidad
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] md:text-4xl">
                  Últimas noticias
                </h2>
              </div>

              <Link
                href="/noticias"
                className="hidden items-center gap-2 text-sm font-black hover:text-red-600 md:flex"
              >
                Ver todas
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {ultimas.map((noticia) => (
                <Link
                  key={noticia.id}
                  href={`/noticias/${noticia.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-black/5">
                    {noticia.imagen_principal ? (
                      <img
                        src={noticia.imagen_principal}
                        alt={noticia.titulo}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-black text-white/20">
                        <span className="text-4xl font-black">TM</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em]">
                      <span className="text-red-600">
                        {noticia.categoria || "Música"}
                      </span>

                      <span className="text-black/30">•</span>

                      <span className="text-black/35">
                        {formatearFecha(noticia.created_at)}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.03em] transition group-hover:text-red-600">
                      {noticia.titulo}
                    </h3>

                    {noticia.bajada && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/45">
                        {noticia.bajada}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
              Agenda
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] md:text-4xl">
              Próximos eventos
            </h2>
          </div>

          <Link
            href="/eventos"
            className="hidden items-center gap-2 text-sm font-black hover:text-red-600 md:flex"
          >
            Ver agenda
            <ArrowRight size={16} />
          </Link>
        </div>

        {eventos.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
              <Link
                key={evento.id}
                href={`/eventos/${evento.slug}`}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  {evento.imagen_principal ? (
                    <img
                      src={evento.imagen_principal}
                      alt={evento.nombre}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-800 to-black text-white/20">
                      <CalendarDays size={48} />
                    </div>
                  )}

                  {evento.fecha && (
                    <div className="absolute left-4 top-4 rounded-2xl bg-white px-4 py-3 text-center shadow-lg">
                      <p className="text-xs font-black leading-none text-red-600">
                        {formatearFechaCorta(evento.fecha)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black tracking-[-0.03em]">
                    {evento.nombre}
                  </h3>

                  <div className="mt-4 flex flex-col gap-2 text-xs font-bold text-black/45">
                    {evento.lugar && (
                      <span className="flex items-center gap-2">
                        <MapPin size={14} />
                        {evento.lugar}
                        {evento.ciudad ? ` · ${evento.ciudad}` : ""}
                      </span>
                    )}

                    {evento.fecha && (
                      <span className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        {formatearFecha(evento.fecha)}
                      </span>
                    )}
                  </div>

                  {evento.descripcion && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-black/45">
                      {evento.descripcion}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-sm font-black group-hover:text-red-600">
                    Ver evento
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-black/10 p-12 text-center">
            <CalendarDays className="mx-auto text-black/20" size={36} />
            <p className="mt-4 text-lg font-black">No hay eventos próximos.</p>
            <p className="mt-2 text-sm text-black/40">
              La agenda de Trip Music aparecerá acá.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-black px-7 py-12 text-white md:px-12 md:py-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600">
              <Play size={19} fill="currentColor" />
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-red-400">
              Trip Music
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
              Viví la música. Nosotros la contamos.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/50 md:text-base">
              Noticias, eventos y coberturas para estar cerca de todo lo que
              pasa en la escena musical.
            </p>

            <Link
              href="/galeria"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-black transition hover:bg-red-600 hover:text-white"
            >
              Explorar coberturas
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}