"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Loader2,
  MapPin,
  Play,
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

/*
|--------------------------------------------------------------------------
| REDES SOCIALES
|--------------------------------------------------------------------------
*/

const REDES = {
  instagram: "https://www.instagram.com/trip_musica/",
  youtube: "https://www.youtube.com/@Trip_musica",
  tiktok: "https://www.tiktok.com/@trip_musica",
  // Reemplazar cuando tengan la cuenta oficial de X.
  x: "https://x.com/TRIP_MUSICA",
};

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(fecha));
}

function formatearEvento(fecha: string | null) {
  if (!fecha) return null;

  const date = new Date(fecha);

  return {
    dia: new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
    }).format(date),

    mes: new Intl.DateTimeFormat("es-AR", {
      month: "short",
    })
      .format(date)
      .replace(".", "")
      .toUpperCase(),

    año: new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
    }).format(date),
  };
}

function ImagenFallback({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-[#dedbd3] ${className}`}
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-black/25">
          Trip Música
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 80vw"
      className={`object-cover transition-transform duration-700 group-hover:scale-[1.04] ${className}`}
    />
  );
}

export default function HomePage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);

  const [email, setEmail] = useState("");
  const [suscribiendo, setSuscribiendo] = useState(false);
  const [suscripto, setSuscripto] = useState(false);
  const [errorSuscripcion, setErrorSuscripcion] = useState("");

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
          .limit(7),

        supabase
          .from("eventos")
          .select(
            "id, nombre, slug, descripcion, fecha, lugar, ciudad, imagen_principal"
          )
          .order("fecha", { ascending: true })
          .limit(4),
      ]);

      if (!noticiasResponse.error) {
        setNoticias(noticiasResponse.data || []);
      }

      if (!eventosResponse.error) {
        setEventos(eventosResponse.data || []);
      }

      setCargando(false);
    }

    cargarContenido();
  }, []);

  async function suscribirse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailLimpio = email.trim().toLowerCase();

    if (!emailLimpio) {
      setErrorSuscripcion("Ingresá tu email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
      setErrorSuscripcion("Ingresá un email válido.");
      return;
    }

    setSuscribiendo(true);
    setErrorSuscripcion("");

    const { error } = await supabase.from("suscriptores").insert({
      email: emailLimpio,
      activo: true,
    });

    if (error) {
      if (error.code === "23505") {
        setSuscripto(true);
        setEmail("");
        setSuscribiendo(false);
        return;
      }

      setErrorSuscripcion(
        "No pudimos completar la suscripción. Intentá nuevamente."
      );

      setSuscribiendo(false);
      return;
    }

    setEmail("");
    setSuscripto(true);
    setSuscribiendo(false);
  }

  const principal = noticias[0];
  const secundarias = noticias.slice(1, 4);
  const ultimas = noticias.slice(4);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f2ec] text-[#0b0b0b]">
      <SiteHeader />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="trip-pattern">
        <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-14 lg:pt-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-5xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#0b0b0b]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/45">
                  Medio musical independiente
                </span>
              </div>

              <h1 className="max-w-5xl text-[clamp(3.5rem,9vw,9rem)] font-black leading-[0.82] tracking-[-0.07em]">
                DEL ESCENARIO
                <br />
                A TU PANTALLA.
              </h1>
            </div>

            <div className="max-w-sm lg:pb-2">
              <p className="text-sm leading-6 text-black/55 sm:text-base">
                Noticias, recitales, eventos y coberturas de la escena musical
                argentina.
              </p>

              <div className="mt-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-black/65">
                <span>Trip Música</span>

                <span className="h-px w-8 bg-black/20" />

                <span>Buenos Aires</span>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-14">
            {cargando ? (
              <div className="h-[55vh] min-h-[420px] animate-pulse rounded-[2rem] bg-black/5" />
            ) : principal ? (
              <Link
                href={`/noticias/${principal.slug}`}
                className="group relative block h-[58vh] min-h-[430px] overflow-hidden rounded-[1.75rem] bg-[#d8d5ce] shadow-[0_20px_70px_rgba(0,0,0,0.12)]"
              >
                <ImagenFallback
                  src={principal.imagen_principal}
                  alt={principal.titulo}
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
                  <div className="max-w-4xl">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {principal.categoria && (
                        <span className="rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                          {principal.categoria}
                        </span>
                      )}

                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
                        {formatearFecha(principal.created_at)}
                      </span>
                    </div>

                    <h2 className="max-w-4xl text-3xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                      {principal.titulo}
                    </h2>

                    {principal.bajada && (
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                        {principal.bajada}
                      </p>
                    )}
                  </div>

                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
                    <ArrowDownRight size={22} />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex h-[58vh] min-h-[430px] items-end rounded-[1.75rem] border border-black/10 bg-white p-8 lg:p-12">
                <div>
                  <p className="text-sm text-black/40">
                    Próximamente nuevas coberturas.
                  </p>

                  <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.04em]">
                    Trip Música está preparando algo nuevo.
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          ÚLTIMAS COBERTURAS
      ========================================================= */}

      <section className="bg-[#f4f2ec]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-10 flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                01 — Actualidad
              </p>

              <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">
                Últimas coberturas
              </h2>
            </div>

            <Link
              href="/noticias"
              className="group flex w-fit items-center gap-3 rounded-full border border-black/15 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] transition-colors hover:bg-black hover:text-white"
            >
              Ver todas

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {cargando ? (
            <div className="grid gap-5 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[480px] animate-pulse rounded-[1.5rem] bg-black/5"
                />
              ))}
            </div>
          ) : secundarias.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {secundarias.map((noticia, index) => (
                <Link
                  key={noticia.id}
                  href={`/noticias/${noticia.slug}`}
                  className="group"
                >
                  <article>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#dedbd3]">
                      <ImagenFallback
                        src={noticia.imagen_principal}
                        alt={noticia.titulo}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

                      <span className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-black text-black">
                        0{index + 2}
                      </span>

                      <span className="absolute bottom-5 left-5 rounded-full bg-black/60 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                        {noticia.categoria || "Música"}
                      </span>

                      <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <ArrowDownRight size={17} />
                      </span>
                    </div>

                    <div className="pt-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
                        {formatearFecha(noticia.created_at)}
                      </p>

                      <h3 className="mt-2 text-2xl font-black leading-[0.98] tracking-[-0.04em] transition-opacity group-hover:opacity-55 sm:text-3xl">
                        {noticia.titulo}
                      </h3>

                      {noticia.bajada && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/50">
                          {noticia.bajada}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-black/10 p-10 text-center">
              <p className="text-sm text-black/45">
                Todavía no hay más coberturas publicadas.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          MANIFIESTO
      ========================================================= */}

      <section className="trip-pattern border-y border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/35">
                02 — Trip Música
              </p>

              <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-black/15">
                <Play size={20} fill="currentColor" />
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                VIVIMOS LA
                <br />
                MÚSICA.
                <br />
                <span className="text-black/25">
                  CONTAMOS LO QUE PASA.
                </span>
              </h2>

              <div className="mt-8 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm leading-7 text-black/50 sm:text-base">
                  Cubrimos artistas, recitales y eventos para acercarte cada
                  experiencia un poco más.
                </p>

                <Link
                  href="/galeria"
                  className="group flex shrink-0 items-center gap-3 text-xs font-black uppercase tracking-[0.18em]"
                >
                  Explorar galería

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 transition-all group-hover:bg-black group-hover:text-white">
                    <ArrowRight size={15} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          EVENTOS
      ========================================================= */}

      <section className="bg-[#f4f2ec]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-10 flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                03 — Agenda
              </p>

              <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">
                Próximos eventos
              </h2>
            </div>

            <Link
              href="/eventos"
              className="group flex w-fit items-center gap-3 rounded-full border border-black/15 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] transition-colors hover:bg-black hover:text-white"
            >
              Ver agenda

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {eventos.length > 0 ? (
            <div className="divide-y divide-black/10 border-y border-black/10">
              {eventos.map((evento, index) => {
                const fecha = formatearEvento(evento.fecha);

                return (
                  <Link
                    key={evento.id}
                    href={`/eventos/${evento.slug}`}
                    className="group block"
                  >
                    <article className="grid gap-6 py-7 transition-all sm:grid-cols-[90px_1fr_auto] sm:items-center lg:grid-cols-[120px_1fr_1fr_auto]">
                      <div className="flex items-center gap-3 sm:block">
                        <span className="text-xs font-black text-black/25">
                          0{index + 1}
                        </span>

                        {fecha && (
                          <div className="sm:mt-2">
                            <span className="text-4xl font-black leading-none tracking-[-0.06em]">
                              {fecha.dia}
                            </span>

                            <span className="ml-2 text-[10px] font-black uppercase tracking-[0.16em] text-black/40 sm:ml-0 sm:block">
                              {fecha.mes}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-2xl font-black tracking-[-0.04em] transition-opacity group-hover:opacity-50 sm:text-3xl lg:text-4xl">
                          {evento.nombre}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">
                          {evento.lugar && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={12} />
                              {evento.lugar}
                            </span>
                          )}

                          {evento.ciudad && <span>{evento.ciudad}</span>}
                        </div>
                      </div>

                      <p className="hidden max-w-md text-sm leading-6 text-black/45 lg:block">
                        {evento.descripcion ||
                          "Conocé todos los detalles de este próximo evento."}
                      </p>

                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all group-hover:border-black group-hover:bg-black group-hover:text-white">
                        <ChevronRight size={18} />
                      </span>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border-y border-black/10 py-12 text-center">
              <CalendarDays size={24} className="mx-auto text-black/25" />

              <p className="mt-4 text-sm text-black/45">
                Próximamente nuevos eventos.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          MÁS NOTICIAS
      ========================================================= */}

      {ultimas.length > 0 && (
        <section className="bg-[#e8e5dd]">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="mb-10">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                04 — Más para descubrir
              </p>

              <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">
                Seguí el viaje.
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {ultimas.map((noticia) => (
                <Link
                  key={noticia.id}
                  href={`/noticias/${noticia.slug}`}
                  className="group flex gap-5 border-t border-black/10 pt-5"
                >
                  <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-2xl bg-[#dedbd3] sm:w-40">
                    <ImagenFallback
                      src={noticia.imagen_principal}
                      alt={noticia.titulo}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-black/35">
                          {noticia.categoria || "Música"}
                        </span>

                        <span className="text-black/15">•</span>

                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/35">
                          {formatearFecha(noticia.created_at)}
                        </span>
                      </div>

                      <h3 className="mt-2 text-xl font-black leading-[1] tracking-[-0.035em] transition-opacity group-hover:opacity-50 sm:text-2xl">
                        {noticia.titulo}
                      </h3>
                    </div>

                    <span className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em]">
                      Leer nota

                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          REDES SOCIALES
      ========================================================= */}

      <section className="bg-[#f4f2ec]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-10">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
              05 — Comunidad
            </p>

            <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl">
              SEGUINOS.
              <br />
              <span className="text-black/25">VIVÍ LA MÚSICA.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* INSTAGRAM */}
            <a
              href={REDES.instagram}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[210px] flex-col justify-between rounded-[1.5rem] bg-[#0a0a0a] p-7 text-white transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                  />
                </svg>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all group-hover:bg-white group-hover:text-black">
                  <ArrowRight size={16} />
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Seguinos en
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                  Instagram
                </h3>
              </div>
            </a>

            {/* YOUTUBE */}
            <a
              href={REDES.youtube}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[210px] flex-col justify-between rounded-[1.5rem] border border-black/10 bg-white p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path d="M10 9L16 12L10 15V9Z" fill="currentColor" />
                </svg>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-all group-hover:bg-black group-hover:text-white">
                  <ArrowRight size={16} />
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                  Miranos en
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                  YouTube
                </h3>
              </div>
            </a>

            {/* TIKTOK */}
            <a
              href={REDES.tiktok}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[210px] flex-col justify-between rounded-[1.5rem] bg-[#0a0a0a] p-7 text-white transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black leading-none">♪</span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all group-hover:bg-white group-hover:text-black">
                  <ArrowRight size={16} />
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Seguinos en
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                  TikTok
                </h3>
              </div>
            </a>

            {/* X */}
            <a
              href={REDES.x}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[210px] flex-col justify-between rounded-[1.5rem] border border-black/10 bg-white p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black leading-none">𝕏</span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-all group-hover:bg-black group-hover:text-white">
                  <ArrowRight size={16} />
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                  Seguinos en
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                  X
                </h3>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          SUSCRIPCIÓN
      ========================================================= */}

      <section className="bg-[#171717] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
              06 — No te pierdas nada
            </p>

            <h2 className="text-5xl font-black leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              ENTERATE
              <br />
              DE TODO.
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
              Suscribite y recibí novedades sobre nuevas coberturas, noticias
              y eventos de Trip Música.
            </p>

            {suscripto ? (
              <div className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                  <Check size={16} />
                </span>

                <div className="text-left">
                  <p className="text-sm font-bold">¡Ya estás suscripto!</p>

                  <p className="mt-1 text-xs text-white/40">
                    Te avisaremos cuando haya novedades.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={suscribirse}
                className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrorSuscripcion("");
                  }}
                  placeholder="Tu email"
                  autoComplete="email"
                  className="h-14 min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-6 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />

                <button
                  type="submit"
                  disabled={suscribiendo}
                  className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-xs font-black uppercase tracking-[0.15em] text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {suscribiendo ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Suscribiendo
                    </>
                  ) : (
                    <>
                      Suscribirme
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {errorSuscripcion && !suscripto && (
              <p className="mt-4 text-xs font-medium text-red-300">
                {errorSuscripcion}
              </p>
            )}

            <p className="mt-5 text-[10px] uppercase tracking-[0.15em] text-white/20">
              Sin spam. Solo novedades de Trip Música.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA FINAL
      ========================================================= */}

      <section className="bg-[#171717] text-white">
        <div className="mx-auto max-w-[1600px] border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                Trip Música
              </p>

              <h2 className="max-w-4xl text-5xl font-black leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                NOS VEMOS
                <br />
                EN EL PRÓXIMO
                <br />
                RECITAL.
              </h2>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              <p className="max-w-xs text-sm leading-6 text-white/45 lg:text-right">
                Del escenario a tu pantalla.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/noticias"
                  className="flex items-center gap-3 rounded-full bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-black transition-transform hover:-translate-y-1"
                >
                  Noticias
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/galeria"
                  className="flex items-center gap-3 rounded-full border border-white/20 px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-black"
                >
                  Galería
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}