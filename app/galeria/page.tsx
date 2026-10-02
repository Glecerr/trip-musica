"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Play,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Multimedia = {
  id: string;
  tipo: string;
  url: string;
  titulo: string | null;
  created_at: string;
};

export default function GaleriaPage() {
  const [multimedia, setMultimedia] = useState<Multimedia[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "foto" | "video">("todos");
  const [seleccionado, setSeleccionado] = useState<Multimedia | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data, error } = await supabase
        .from("multimedia")
        .select("id, tipo, url, titulo, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setMultimedia(data || []);
      }

      setCargando(false);
    }

    cargar();
  }, []);

  const filtrados = useMemo(() => {
    if (filtro === "foto") {
      return multimedia.filter(
        (item) => item.tipo === "imagen" || item.tipo === "foto"
      );
    }

    if (filtro === "video") {
      return multimedia.filter((item) => item.tipo === "video");
    }

    return multimedia;
  }, [multimedia, filtro]);

  function cambiarSeleccion(direccion: number) {
    if (!seleccionado) return;

    const indice = filtrados.findIndex(
      (item) => item.id === seleccionado.id
    );

    const nuevoIndice =
      (indice + direccion + filtrados.length) % filtrados.length;

    setSeleccionado(filtrados[nuevoIndice]);
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-600">
              <ImageIcon size={15} />
              Trip Music
            </p>

            <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
              Galería
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-black/45">
              Fotos y videos de nuestras coberturas y de todo lo que pasa en
              la escena musical.
            </p>
          </div>

          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-sm font-black hover:text-red-600"
          >
            Ver eventos
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-black/10 pb-5">
          {[
            ["todos", "Todo"],
            ["foto", "Fotos"],
            ["video", "Videos"],
          ].map(([valor, texto]) => (
            <button
              key={valor}
              onClick={() =>
                setFiltro(valor as "todos" | "foto" | "video")
              }
              className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                filtro === valor
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/50 hover:bg-black/10"
              }`}
            >
              {texto}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="mt-10 columns-1 gap-5 md:columns-2 lg:columns-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="mb-5 aspect-[4/3] break-inside-avoid animate-pulse rounded-3xl bg-black/5"
              />
            ))}
          </div>
        ) : filtrados.length > 0 ? (
          <div className="mt-10 columns-1 gap-5 md:columns-2 lg:columns-3">
            {filtrados.map((item) => {
              const esVideo = item.tipo === "video";

              return (
                <button
                  key={item.id}
                  onClick={() => setSeleccionado(item)}
                  className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-black text-left"
                >
                  {esVideo ? (
                    <video
                      src={item.url}
                      preload="metadata"
                      className="block w-full"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.titulo || "Trip Music"}
                      className="block w-full transition duration-500 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="absolute bottom-0 left-0 right-0 flex translate-y-2 items-end justify-between p-5 text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-sm font-black">
                      {item.titulo || (esVideo ? "Video" : "Fotografía")}
                    </span>

                    {esVideo && <Play size={18} fill="currentColor" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-black/10 p-16 text-center">
            <ImageIcon className="mx-auto text-black/20" size={44} />

            <h2 className="mt-5 text-2xl font-black">
              Todavía no hay multimedia
            </h2>

            <p className="mt-2 text-sm text-black/40">
              Las próximas fotos y videos aparecerán acá.
            </p>
          </div>
        )}
      </section>

      {seleccionado && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
          onClick={() => setSeleccionado(null)}
        >
          <button
            onClick={() => setSeleccionado(null)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              cambiarSeleccion(-1);
            }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:left-8"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              cambiarSeleccion(1);
            }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:right-8"
          >
            <ChevronRight />
          </button>

          <div
            className="max-h-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            {seleccionado.tipo === "video" ? (
              <video
                src={seleccionado.url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full rounded-2xl"
              />
            ) : (
              <img
                src={seleccionado.url}
                alt={seleccionado.titulo || "Trip Music"}
                className="max-h-[85vh] max-w-full rounded-2xl object-contain"
              />
            )}

            {seleccionado.titulo && (
              <p className="mt-4 text-center text-sm font-bold text-white/70">
                {seleccionado.titulo}
              </p>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </main>
  );
}