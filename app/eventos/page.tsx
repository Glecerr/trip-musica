import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const dynamic = "force-dynamic";

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

function fechaCompleta(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(fecha));
}

function dia(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
  }).format(new Date(fecha));
}

function mes(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    month: "short",
  })
    .format(new Date(fecha))
    .replace(".", "")
    .toUpperCase();
}

export default async function EventosPage() {
  const { data: eventos, error } = await supabase
    .from("eventos")
    .select(
      "id, nombre, slug, descripcion, fecha, lugar, ciudad, imagen_principal"
    )
    .order("fecha", { ascending: true });

  if (error) {
    console.error("Error cargando eventos:", error);
  }

  const lista = eventos || [];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-5 sm:pb-20 sm:pt-12 md:px-8 md:pt-16">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 sm:text-xs">
            <CalendarDays size={15} />
            Agenda Trip Música
          </p>

          <h1 className="mt-3 text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl md:text-7xl">
            Eventos
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/45 sm:text-base sm:leading-7">
            Recitales, festivales, shows y los eventos que forman parte de la
            escena musical.
          </p>
        </div>

        {lista.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((evento) => (
              <Link
                key={evento.id}
                href={`/eventos/${evento.slug}`}
                className="group min-w-0 overflow-hidden rounded-[1.5rem] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[2rem]"
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
                      <CalendarDays size={52} />
                    </div>
                  )}

                  {evento.fecha && (
                    <div className="absolute left-3 top-3 flex min-w-[58px] flex-col items-center rounded-xl bg-white px-2.5 py-2.5 shadow-xl sm:left-4 sm:top-4 sm:min-w-[62px] sm:rounded-2xl sm:px-3 sm:py-3">
                      <span className="text-xl font-black leading-none sm:text-2xl">
                        {dia(evento.fecha)}
                      </span>

                      <span className="mt-1 text-[8px] font-black tracking-[0.15em] text-red-600 sm:text-[9px]">
                        {mes(evento.fecha)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="break-words text-xl font-black leading-tight tracking-[-0.035em] transition group-hover:text-red-600 sm:text-2xl">
                    {evento.nombre}
                  </h2>

                  {evento.fecha && (
                    <p className="mt-4 flex items-start gap-2 text-xs font-bold text-black/45">
                      <CalendarDays size={14} className="mt-0.5 shrink-0" />
                      <span>{fechaCompleta(evento.fecha)}</span>
                    </p>
                  )}

                  {evento.lugar && (
                    <p className="mt-2 flex items-start gap-2 text-xs font-bold text-black/45">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span className="break-words">
                        {evento.lugar}
                        {evento.ciudad ? ` · ${evento.ciudad}` : ""}
                      </span>
                    </p>
                  )}

                  {evento.descripcion && (
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-black/45">
                      {evento.descripcion}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-sm font-black">
                    Ver evento
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-black/10 p-10 text-center sm:mt-12 sm:rounded-[2rem] sm:p-14">
            <CalendarDays className="mx-auto text-black/20" size={42} />

            <h2 className="mt-5 text-2xl font-black">
              Todavía no hay eventos
            </h2>

            <p className="mt-2 text-sm text-black/40">
              Cuando el equipo publique eventos, van a aparecer acá.
            </p>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}