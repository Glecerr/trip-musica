"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  FilePlus,
  Newspaper,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Noticia = {
  id: string;
  titulo: string;
  slug: string;
  bajada: string | null;
  categoria: string | null;
  publicada: boolean;
  created_at: string;
};

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);

  async function cargarNoticias() {
    setCargando(true);

    const { data, error } = await supabase
      .from("noticias")
      .select(
        "id, titulo, slug, bajada, categoria, publicada, created_at"
      )
      .order("created_at", { ascending: false });

    if (!error) {
      setNoticias(data ?? []);
    }

    setCargando(false);
  }

  useEffect(() => {
    cargarNoticias();
  }, []);

  async function eliminarNoticia(id: string) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta noticia? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    setEliminando(id);

    const { error } = await supabase
      .from("noticias")
      .delete()
      .eq("id", id);

    if (!error) {
      setNoticias((actuales) =>
        actuales.filter((noticia) => noticia.id !== id)
      );
    } else {
      window.alert("No se pudo eliminar la noticia.");
    }

    setEliminando(null);
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-black/50 transition hover:text-black"
            >
              <ArrowLeft size={16} />
              Volver al panel
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                <Newspaper size={21} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Gestión de contenido
                </p>

                <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                  Noticias
                </h1>
              </div>
            </div>
          </div>

          <Link
            href="/admin/noticias/nueva"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
          >
            <FilePlus size={18} />
            Nueva noticia
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-6 py-5">
            <p className="text-sm font-bold text-black/50">
              {noticias.length}{" "}
              {noticias.length === 1 ? "noticia cargada" : "noticias cargadas"}
            </p>
          </div>

          {cargando ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />
                <p className="mt-4 text-sm font-bold text-black/40">
                  Cargando noticias...
                </p>
              </div>
            </div>
          ) : noticias.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <Newspaper className="mx-auto mb-4 text-black/20" size={42} />

              <h2 className="text-xl font-black">
                Todavía no hay noticias
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Creá la primera noticia para comenzar a publicar contenido.
              </p>

              <Link
                href="/admin/noticias/nueva"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-black text-white"
              >
                <FilePlus size={17} />
                Crear noticia
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {noticias.map((noticia) => (
                <article
                  key={noticia.id}
                  className="flex flex-col gap-5 px-6 py-6 transition hover:bg-black/[0.02] md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${
                          noticia.publicada
                            ? "bg-green-100 text-green-700"
                            : "bg-black/5 text-black/50"
                        }`}
                      >
                        {noticia.publicada ? "Publicada" : "Borrador"}
                      </span>

                      {noticia.categoria && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-red-600">
                          {noticia.categoria}
                        </span>
                      )}
                    </div>

                    <h2 className="truncate text-lg font-black md:text-xl">
                      {noticia.titulo}
                    </h2>

                    {noticia.bajada && (
                      <p className="mt-1 line-clamp-2 text-sm text-black/50">
                        {noticia.bajada}
                      </p>
                    )}

                    <p className="mt-3 text-xs font-bold text-black/30">
                      {new Date(noticia.created_at).toLocaleDateString(
                        "es-AR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/noticias/${noticia.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-black transition hover:bg-black hover:text-white"
                    >
                      <Edit3 size={16} />
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() => eliminarNoticia(noticia.id)}
                      disabled={eliminando === noticia.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {eliminando === noticia.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}