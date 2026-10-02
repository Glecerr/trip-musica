"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Noticia = {
  id: string;
  titulo: string;
};

type Evento = {
  id: string;
  nombre: string;
};

type Multimedia = {
  id: string;
  tipo: string;
  url: string;
  titulo: string | null;
  noticia_id: string | null;
  evento_id: string | null;
  created_at: string;
};

export default function AdminMultimediaPage() {
  const [multimedia, setMultimedia] = useState<Multimedia[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  const [titulo, setTitulo] = useState("");
  const [noticiaId, setNoticiaId] = useState("");
  const [eventoId, setEventoId] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);

    const [
      { data: multimediaData, error: multimediaError },
      { data: noticiasData },
      { data: eventosData },
    ] = await Promise.all([
      supabase
        .from("multimedia")
        .select(
          "id, tipo, url, titulo, noticia_id, evento_id, created_at"
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("noticias")
        .select("id, titulo")
        .order("created_at", { ascending: false }),

      supabase
        .from("eventos")
        .select("id, nombre")
        .order("fecha", { ascending: true }),
    ]);

    if (multimediaError) {
      console.error("Error cargando multimedia:", multimediaError);
    }

    setMultimedia(multimediaData || []);
    setNoticias(noticiasData || []);
    setEventos(eventosData || []);

    setCargando(false);
  }

  async function subirMultimedia() {
    if (!archivo) {
      alert("Seleccioná una imagen o video.");
      return;
    }

    if (!archivo.type.startsWith("image/") && !archivo.type.startsWith("video/")) {
      alert("Solo podés subir imágenes o videos.");
      return;
    }

    setSubiendo(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Tu sesión expiró. Volvé a iniciar sesión.");
        return;
      }

      const extension = archivo.name.split(".").pop() || "file";

      const nombreArchivo = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${extension}`;

      const carpeta = archivo.type.startsWith("video")
        ? "videos"
        : "fotos";

      const ruta = `multimedia/${carpeta}/${nombreArchivo}`;

      const { error: uploadError } = await supabase.storage
        .from("trip-media")
        .upload(ruta, archivo, {
          cacheControl: "3600",
          upsert: false,
          contentType: archivo.type,
        });

      if (uploadError) {
        console.error(uploadError);
        alert("No se pudo subir el archivo.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("trip-media")
        .getPublicUrl(ruta);

      const tipo = archivo.type.startsWith("video")
        ? "video"
        : "imagen";

      const { error: insertError } = await supabase
        .from("multimedia")
        .insert({
          tipo,
          url: publicUrlData.publicUrl,
          titulo: titulo.trim() || null,
          noticia_id: noticiaId || null,
          evento_id: eventoId || null,
        });

      if (insertError) {
        console.error(insertError);
        alert("El archivo se subió, pero no se pudo guardar el registro.");
        return;
      }

      alert("Multimedia subida correctamente.");

      setTitulo("");
      setNoticiaId("");
      setEventoId("");
      setArchivo(null);

      const input = document.getElementById(
        "archivo"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      await cargarDatos();
    } finally {
      setSubiendo(false);
    }
  }

  async function eliminarMultimedia(item: Multimedia) {
    const confirmar = confirm(
      "¿Seguro que querés eliminar este material?"
    );

    if (!confirmar) return;

    const partes = item.url.split("/trip-media/");

    if (partes.length > 1) {
      const ruta = decodeURIComponent(partes[1]);

      const { error: storageError } = await supabase.storage
        .from("trip-media")
        .remove([ruta]);

      if (storageError) {
        console.error("Error eliminando archivo:", storageError);
      }
    }

    const { error } = await supabase
      .from("multimedia")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error(error);
      alert("No se pudo eliminar el material.");
      return;
    }

    await cargarDatos();
  }

  function nombreNoticia(id: string | null) {
    if (!id) return null;

    return noticias.find((noticia) => noticia.id === id)?.titulo || null;
  }

  function nombreEvento(id: string | null) {
    if (!id) return null;

    return eventos.find((evento) => evento.id === id)?.nombre || null;
  }

  return (
    <main className="min-h-screen bg-[#f5f4f0] text-[#111]">
      {/* HEADER */}
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
              Administración
            </p>

            <h1 className="text-xl font-black tracking-tight">
              Multimedia
            </h1>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-bold transition hover:text-red-600"
          >
            <ArrowLeft size={16} />
            Volver al panel
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-8">
        {/* SUBIR */}
        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
              Nueva cobertura
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Subir multimedia
            </h2>

            <p className="mt-2 text-sm text-black/50">
              Las fotos y videos publicados acá aparecerán automáticamente
              en la galería.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* ARCHIVO */}
            <div className="md:col-span-2">
              <label className="text-sm font-black">
                Foto o video
              </label>

              <label
                htmlFor="archivo"
                className="mt-2 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/10 bg-[#f7f6f2] px-6 text-center transition hover:border-red-600 hover:bg-red-50"
              >
                <Upload size={30} className="text-black/30" />

                <span className="mt-3 text-sm font-black">
                  {archivo
                    ? archivo.name
                    : "Elegí una foto o video"}
                </span>

                <span className="mt-1 text-xs text-black/40">
                  JPG, PNG, WEBP, MP4, MOV, etc.
                </span>
              </label>

              <input
                id="archivo"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => {
                  setArchivo(event.target.files?.[0] || null);
                }}
              />
            </div>

            {/* TITULO */}
            <div>
              <label className="text-sm font-black">
                Título
              </label>

              <input
                type="text"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                placeholder="Ej: Cobertura del show de Airbag"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none transition focus:border-red-600"
              />
            </div>

            {/* NOTICIA */}
            <div>
              <label className="text-sm font-black">
                Asociar a noticia
              </label>

              <select
                value={noticiaId}
                onChange={(event) => setNoticiaId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none transition focus:border-red-600"
              >
                <option value="">Sin noticia</option>

                {noticias.map((noticia) => (
                  <option key={noticia.id} value={noticia.id}>
                    {noticia.titulo}
                  </option>
                ))}
              </select>
            </div>

            {/* EVENTO */}
            <div>
              <label className="text-sm font-black">
                Asociar a evento
              </label>

              <select
                value={eventoId}
                onChange={(event) => setEventoId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none transition focus:border-red-600"
              >
                <option value="">Sin evento</option>

                {eventos.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* BOTON */}
            <div className="flex items-end">
              <button
                onClick={subirMultimedia}
                disabled={subiendo}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {subiendo ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Publicar multimedia
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* LISTADO */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                Biblioteca
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Material publicado
              </h2>
            </div>

            <p className="text-sm font-bold text-black/40">
              {multimedia.length}{" "}
              {multimedia.length === 1 ? "archivo" : "archivos"}
            </p>
          </div>

          {cargando ? (
            <div className="mt-8 rounded-3xl bg-white p-10 text-center">
              <Loader2
                size={28}
                className="mx-auto animate-spin text-black/30"
              />

              <p className="mt-3 text-sm text-black/40">
                Cargando multimedia...
              </p>
            </div>
          ) : multimedia.length === 0 ? (
            <div className="mt-8 rounded-3xl bg-white p-12 text-center ring-1 ring-black/5">
              <ImageIcon
                size={40}
                className="mx-auto text-black/20"
              />

              <p className="mt-4 font-black">
                Todavía no hay multimedia.
              </p>

              <p className="mt-2 text-sm text-black/40">
                Subí la primera foto o video desde el formulario.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {multimedia.map((item) => {
                const noticia = nombreNoticia(item.noticia_id);
                const evento = nombreEvento(item.evento_id);

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      {item.tipo === "video" ? (
                        <video
                          src={item.url}
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.titulo || "Multimedia"}
                          className="h-full w-full object-cover"
                        />
                      )}

                      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                        {item.tipo === "video" ? (
                          <Video size={13} />
                        ) : (
                          <ImageIcon size={13} />
                        )}

                        {item.tipo === "video" ? "VIDEO" : "FOTO"}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-black">
                        {item.titulo || "Sin título"}
                      </h3>

                      {noticia && (
                        <p className="mt-2 text-xs font-bold text-red-600">
                          📰 {noticia}
                        </p>
                      )}

                      {evento && (
                        <p className="mt-1 text-xs font-bold text-black/40">
                          📍 {evento}
                        </p>
                      )}

                      <button
                        onClick={() => eliminarMultimedia(item)}
                        className="mt-5 flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-800"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}