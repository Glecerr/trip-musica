"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditarNoticia() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [titulo, setTitulo] = useState("");
  const [bajada, setBajada] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contenido, setContenido] = useState("");
  const [publicada, setPublicada] = useState(false);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarNoticia();
  }, [id]);

  async function cargarNoticia() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("No se encontró la noticia.");
      router.push("/admin");
      return;
    }

    setTitulo(data.titulo ?? "");
    setBajada(data.bajada ?? "");
    setCategoria(data.categoria ?? "");
    setContenido(data.contenido ?? "");
    setPublicada(data.publicada ?? false);

    setLoading(false);
  }

  async function guardarCambios(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setGuardando(true);

    const { error } = await supabase
      .from("noticias")
      .update({
        titulo,
        bajada,
        categoria,
        contenido,
        publicada,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Error al guardar: " + error.message);
      setGuardando(false);
      return;
    }

    alert("Noticia actualizada correctamente.");

    router.push("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
        <p>Cargando noticia...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">

      <header className="border-b border-black/10 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <Link
            href="/admin"
            className="text-sm text-black/50 hover:text-black"
          >
            ← Volver al panel
          </Link>

          <h1 className="text-3xl font-bold mt-4">
            Editar noticia
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">

        <form
          onSubmit={guardarCambios}
          className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 space-y-6"
        >

          <div>
            <label className="block text-sm font-semibold mb-2">
              Título
            </label>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Bajada
            </label>

            <textarea
              value={bajada}
              onChange={(e) => setBajada(e.target.value)}
              rows={3}
              className="w-full border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Categoría
            </label>

            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Música, Internacional, Argentina..."
              className="w-full border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Contenido
            </label>

            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={14}
              required
              className="w-full border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-black resize-y"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={publicada}
              onChange={(e) => setPublicada(e.target.checked)}
              className="w-5 h-5"
            />

            <span className="font-semibold">
              Publicar noticia
            </span>
          </label>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-black text-white rounded-xl py-4 font-semibold hover:bg-black/80 transition disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>

        </form>

      </div>
    </main>
  );
}