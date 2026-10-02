import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Play } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Multimedia = {
  id: string;
  tipo: string;
  url: string;
  titulo: string | null;
};

export default async function EventoDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: evento, error } = await supabase
    .from("eventos")
    .select(
      "id, nombre, slug, descripcion, fecha, lugar, ciudad, imagen_principal"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !evento) {
    notFound();
  }

  const { data: multimedia } = await supabase
    .from("multimedia")
    .select("id, tipo, url, titulo")
    .eq("evento_id", evento.id)
    .order("created_at", { ascending: true });

  const fotos =
    multimedia?.filter(
      (item: Multimedia) => item.tipo === "imagen" || item.tipo === "foto"
    ) || [];

  const videos =
    multimedia?.filter((item: Multimedia) => item.tipo === "video") || [];

  const fecha = evento.fecha
    ? new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(evento.fecha))
    : null;

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <article>
        <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-16">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-sm font-black text-black/45 transition hover:text-red-600"
          >
            <ArrowLeft size={16} />
            Volver a eventos
          </Link>

          <div className="mt-10 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
              Evento
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.055em] md:text-6xl">
              {evento.nombre}
            </h1>

            <div className="mt-7 flex flex-col gap-3 text-sm font-bold text-black/45 md:flex-row md:flex-wrap md:gap-6">
              {fecha && (
                <span className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  {fecha}
                </span>
              )}

              {evento.lugar && (
                <span className="flex items-center gap-2">
                  <MapPin size={17} />
                  {evento.lugar}
                  {evento.ciudad ? ` · ${evento.ciudad}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {evento.imagen_principal && (
          <div className="mx-auto mt-12 max-w-7xl px-5 md:px-8">
            <div className="overflow-hidden rounded-[2rem] bg-black">
              <img
                src={evento.imagen_principal}
                alt={evento.nombre}
                className="max-h-[720px] w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
          <div className="whitespace-pre-wrap text-base leading-8 text-black/70 md:text-lg md:leading-9">
            {evento.descripcion || "Este evento todavía no tiene descripción."}
          </div>
        </div>

        {fotos.length > 0 && (
          <section className="border-y border-black/10 bg-white/40">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                Cobertura
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                Fotos
              </h2>

              <div className="mt-10 columns-1 gap-5 md:columns-2 lg:columns-3">
                {fotos.map((foto: Multimedia) => (
                  <div
                    key={foto.id}
                    className="mb-5 break-inside-avoid overflow-hidden rounded-3xl bg-black/5"
                  >
                    <img
                      src={foto.url}
                      alt={foto.titulo || evento.nombre}
                      className="w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
              Multimedia
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
              Videos
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {videos.map((video: Multimedia) => (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-[2rem] bg-black"
                >
                  <video
                    src={video.url}
                    controls
                    preload="metadata"
                    className="aspect-video w-full"
                  />

                  {video.titulo && (
                    <div className="flex items-center gap-2 px-5 py-4 text-sm font-bold text-white">
                      <Play size={15} />
                      {video.titulo}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      <SiteFooter />
    </main>
  );
}