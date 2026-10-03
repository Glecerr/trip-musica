import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

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
    <main className="min-h-screen bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-600">
            <CalendarDays size={15} />
            Agenda Trip Musica
          </p>

          <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
            Eventos
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/45">
            Recitales, festivales, shows y los eventos que forman parte de la
            escena musical.
          </p>
        </div>

        {lista.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((evento) => (
              <Link
                key={evento.id}
                href={`/eventos/${evento.slug}`}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                    <div className="absolute left-4 top-4 flex min-w-[62px] flex-col items-center rounded-2xl bg-white px-3 py-3 shadow-xl">
                      <span className="text-2xl font-black leading-none">
                        {dia(evento.fecha)}
                      </span>

                      <span className="mt-1 text-[9px] font-black tracking-[0.15em] text-red-600">
                        {mes(evento.fecha)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-black leading-tight tracking-[-0.035em] transition group-hover:text-red-600">
                    {evento.nombre}
                  </h2>

                  {evento.fecha && (
                    <p className="mt-4 flex items-center gap-2 text-xs font-bold text-black/45">
                      <CalendarDays size={14} />
                      {fechaCompleta(evento.fecha)}
                    </p>
                  )}

                  {evento.lugar && (
                    <p className="mt-2 flex items-center gap-2 text-xs font-bold text-black/45">
                      <MapPin size={14} />
                      {evento.lugar}
                      {evento.ciudad ? ` · ${evento.ciudad}` : ""}
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
          <div className="mt-12 rounded-[2rem] border border-dashed border-black/10 p-14 text-center">
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