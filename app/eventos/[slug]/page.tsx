import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Play } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const dynamic = "force-dynamic";

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
      (item: Multimedia) =>
        item.tipo === "imagen" || item.tipo === "foto"
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
    <main className="min-h-screen overflow-x-hidden bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <article>
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-5 sm:pt-10 md:px-8 md:pt-16">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-sm font-black text-black/45 transition hover:text-red-600"
          >
            <ArrowLeft size={16} />
            Volver a eventos
          </Link>

          <div className="mt-8 max-w-4xl sm:mt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 sm:text-xs">
              Evento
            </p>

            <h1 className="mt-3 break-words text-4xl font-black leading-[0.92] tracking-[-0.055em] sm:text-5xl md:text-6xl">
              {evento.nombre}
            </h1>

            <div className="mt-6 flex flex-col gap-3 text-xs font-bold text-black/45 sm:text-sm md:flex-row md:flex-wrap md:gap-6">
              {fecha && (
                <span className="flex items-start gap-2">
                  <CalendarDays size={17} className="mt-0.5 shrink-0" />
                  <span>{fecha}</span>
                </span>
              )}

              {evento.lugar && (
                <span className="flex items-start gap-2">
                  <MapPin size={17} className="mt-0.5 shrink-0" />
                  <span className="break-words">
                    {evento.lugar}
                    {evento.ciudad ? ` · ${evento.ciudad}` : ""}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {evento.imagen_principal && (
          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-5 sm:mt-12 md:px-8">
            <div className="overflow-hidden rounded-[1.5rem] bg-black sm:rounded-[2rem]">
              <img
                src={evento.imagen_principal}
                alt={evento.nombre}
                className="max-h-[720px] w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-5 sm:py-14 md:px-8 md:py-20">
          <div className="whitespace-pre-wrap break-words text-base leading-8 text-black/70 md:text-lg md:leading-9">
            {evento.descripcion ||
              "Este evento todavía no tiene descripción."}
          </div>
        </div>

        {fotos.length > 0 && (
          <section className="border-y border-black/10 bg-white/40">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 md:px-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 sm:text-xs">
                Cobertura
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Fotos
              </h2>

              <div className="mt-8 columns-1 gap-4 sm:mt-10 sm:gap-5 md:columns-2 lg:columns-3">
                {fotos.map((foto: Multimedia) => (
                  <div
                    key={foto.id}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-[1.25rem] bg-black/5 sm:mb-5 sm:rounded-3xl"
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
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 md:px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 sm:text-xs">
              Multimedia
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Videos
            </h2>

            <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2">
              {videos.map((video: Multimedia) => (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-[1.5rem] bg-black sm:rounded-[2rem]"
                >
                  <video
                    src={video.url}
                    controls
                    preload="metadata"
                    className="aspect-video w-full"
                  />

                  {video.titulo && (
                    <div className="flex items-start gap-2 px-4 py-4 text-sm font-bold text-white sm:px-5">
                      <Play size={15} className="mt-0.5 shrink-0" />
                      <span className="break-words">{video.titulo}</span>
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