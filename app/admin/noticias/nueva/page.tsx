"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";

function crearSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NuevaNoticia() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [bajada, setBajada] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("Música");
  const [imagen, setImagen] = useState<File | null>(null);
  const [publicada, setPublicada] = useState(true);

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      if (!titulo.trim()) {
        throw new Error("El título es obligatorio.");
      }

      let imagenUrl = "";

      if (imagen) {
        const extension = imagen.name.split(".").pop();
        const nombreArchivo = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("trip-media")
          .upload(`noticias/${nombreArchivo}`, imagen);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("trip-media")
          .getPublicUrl(`noticias/${nombreArchivo}`);

        imagenUrl = data.publicUrl;
      }

      const slugBase = crearSlug(titulo);
      const slug = `${slugBase}-${Date.now()}`;

      const { error: insertError } = await supabase
        .from("noticias")
        .insert({
          titulo,
          slug,
          bajada,
          contenido,
          categoria,
          imagen_principal: imagenUrl,
          publicada,
        });

   setMensaje("La noticia fue creada correctamente.");

router.push("/admin");
router.refresh();

      setMensaje("La noticia fue creada correctamente.");

      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center px-5 md:px-8">
          <button
            onClick={() => router.push("/admin")}
            className="mr-5 rounded-xl p-2 transition hover:bg-black/5"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <p className="text-xl font-black tracking-[-0.05em]">
              TRIP<span className="text-red-600">.</span>MUSIC
            </p>
            <p className="text-xs text-black/40">
              Nueva noticia
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Noticias
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Crear noticia
          </h1>

          <p className="mt-3 text-black/50">
            Publicá una nueva cobertura desde el panel.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Título
              </label>

              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Airbag cerró su gira con un show inolvidable"
                className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Bajada
              </label>

              <textarea
                value={bajada}
                onChange={(e) => setBajada(e.target.value)}
                placeholder="Una breve descripción de la noticia..."
                rows={3}
                className="w-full resize-none rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Categoría
                </label>

                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-red-600"
                >
                  <option>Música</option>
                  <option>Shows</option>
                  <option>Entrevistas</option>
                  <option>Noticias</option>
                  <option>Festivales</option>
                  <option>Coberturas</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Imagen principal
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-black/20 bg-[#f7f6f2] px-4 py-3 transition hover:border-red-600">
                  <Upload size={18} />

                  <span className="text-sm">
                    {imagen ? imagen.name : "Seleccionar imagen"}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setImagen(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Contenido
              </label>

              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribí acá el cuerpo completo de la noticia..."
                rows={14}
                className="w-full resize-y rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 leading-7 outline-none focus:border-red-600"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={publicada}
                onChange={(e) => setPublicada(e.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm font-bold">
                Publicar inmediatamente
              </span>
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {mensaje && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle2 size={18} />
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Publicando..." : "Publicar noticia"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}