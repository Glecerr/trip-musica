import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
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

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(fecha));
}

export default async function NoticiasPage() {
  const { data: noticias, error } = await supabase
    .from("noticias")
    .select(
      "id, titulo, slug, bajada, imagen_principal, categoria, created_at"
    )
    .eq("publicada", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando noticias:", error);
  }

  const lista = noticias || [];
  const principal = lista[0];
  const restantes = lista.slice(1);

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-600">
            <Newspaper size={15} />
            Actualidad
          </p>

          <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
            Noticias
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/45">
            Las últimas novedades de la música, artistas, lanzamientos,
            recitales y todo lo que pasa en la escena.
          </p>
        </div>

        {principal ? (
          <div className="mt-12">
            <Link
              href={`/noticias/${principal.slug}`}
              className="group relative block min-h-[480px] overflow-hidden rounded-[2rem] bg-black"
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

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em]">
                    {principal.categoria || "Música"}
                  </span>

                  <span className="text-xs font-bold text-white/50">
                    {formatearFecha(principal.created_at)}
                  </span>
                </div>

                <h2 className="mt-5 max-w-4xl text-3xl font-black leading-[1] tracking-[-0.045em] md:text-5xl">
                  {principal.titulo}
                </h2>

                {principal.bajada && (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
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
          </div>
        ) : (
          <div className="mt-12 rounded-[2rem] border border-dashed border-black/10 p-14 text-center">
            <Newspaper className="mx-auto text-black/20" size={42} />

            <h2 className="mt-5 text-2xl font-black">
              Todavía no hay noticias
            </h2>

            <p className="mt-2 text-sm text-black/40">
              Las próximas publicaciones aparecerán acá.
            </p>
          </div>
        )}

        {restantes.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between border-b border-black/10 pb-5">
              <h2 className="text-2xl font-black tracking-[-0.03em] md:text-3xl">
                Todas las noticias
              </h2>

              <span className="text-xs font-black uppercase tracking-[0.15em] text-black/30">
                {lista.length} publicaciones
              </span>
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {restantes.map((noticia) => (
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

                      <span className="text-black/25">•</span>

                      <span className="text-black/35">
                        {formatearFecha(noticia.created_at)}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.03em] transition group-hover:text-red-600">
                      {noticia.titulo}
                    </h3>

                    {noticia.bajada && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/45">
                        {noticia.bajada}
                      </p>
                    )}

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black">
                      Leer más
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}