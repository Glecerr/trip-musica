"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Upload,
} from "lucide-react";

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

export default function AdminEventosPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [imagen, setImagen] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function cargar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      await cargarEventos();

      setLoading(false);
    }

    cargar();
  }, [router]);

  async function cargarEventos() {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) {
      console.error("Error cargando eventos:", error);
      return;
    }

    setEventos(data || []);
  }

  function generarSlug(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function crearEvento(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre.trim()) {
      setMensaje("El nombre del evento es obligatorio.");
      return;
    }

    setSubiendo(true);
    setMensaje("");

    try {
      let imagenUrl: string | null = null;

      if (imagen) {
        const extension = imagen.name.split(".").pop();

        const nombreArchivo = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${extension}`;

        const ruta = `eventos/${nombreArchivo}`;

        const { error: uploadError } = await supabase.storage
          .from("trip-media")
          .upload(ruta, imagen);

        if (uploadError) {
          throw new Error(
            "No se pudo subir la imagen: " + uploadError.message
          );
        }

        const { data } = supabase.storage
          .from("trip-media")
          .getPublicUrl(ruta);

        imagenUrl = data.publicUrl;
      }

      const slugBase = generarSlug(nombre);

      const slug = `${slugBase}-${Date.now()}`;

      const { error } = await supabase.from("eventos").insert({
        nombre: nombre.trim(),
        slug,
        descripcion: descripcion.trim() || null,
        fecha: fecha ? new Date(fecha).toISOString() : null,
        lugar: lugar.trim() || null,
        ciudad: ciudad.trim() || null,
        imagen_principal: imagenUrl,
      });

      if (error) {
        throw new Error(
          "No se pudo crear el evento: " + error.message
        );
      }

      setNombre("");
      setDescripcion("");
      setFecha("");
      setLugar("");
      setCiudad("");
      setImagen(null);

      const input = document.getElementById(
        "imagen-evento"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      setMensaje("Evento creado correctamente.");

      await cargarEventos();
    } catch (error) {
      console.error(error);

      setMensaje(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear el evento."
      );
    } finally {
      setSubiendo(false);
    }
  }

  async function eliminarEvento(id: string) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este evento?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("eventos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("No se pudo eliminar el evento: " + error.message);
      return;
    }

    setEventos((actuales) =>
      actuales.filter((evento) => evento.id !== id)
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
        <p className="text-sm font-bold text-black/50">
          Cargando eventos...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <div>
            <p className="text-xl font-black tracking-[-0.05em]">
              TRIP<span className="text-red-600">.</span>MUSIC
            </p>

            <p className="text-xs text-black/40">
              Administración de eventos
            </p>
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
          >
            <ArrowLeft size={16} />
            Volver al panel
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Eventos
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Administrar eventos
          </h1>

          <p className="mt-3 max-w-2xl text-black/50">
            Creá los shows y eventos que después van a aparecer
            automáticamente en la web pública.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <Plus size={20} />
              </div>

              <div>
                <h2 className="font-black">
                  Nuevo evento
                </h2>

                <p className="text-xs text-black/40">
                  Completá los datos del show
                </p>
              </div>
            </div>

            <form
              onSubmit={crearEvento}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Nombre del evento
                </label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Airbag en Vélez"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Descripción
                </label>

                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Contá de qué se trata el evento..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Fecha y hora
                </label>

                <input
                  type="datetime-local"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Lugar
                </label>

                <input
                  type="text"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  placeholder="Ej: Estadio Vélez"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Ciudad
                </label>

                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ej: Buenos Aires"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Imagen
                </label>

                <label
                  htmlFor="imagen-evento"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-black/20 bg-[#f7f6f2] px-4 py-4 text-sm font-bold transition hover:border-red-600 hover:text-red-600"
                >
                  <Upload size={18} />

                  {imagen
                    ? imagen.name
                    : "Seleccionar imagen"}
                </label>

                <input
                  id="imagen-evento"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImagen(e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
              </div>

              {mensaje && (
                <div className="rounded-xl bg-black/5 px-4 py-3 text-sm font-semibold">
                  {mensaje}
                </div>
              )}

              <button
                type="submit"
                disabled={subiendo}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />

                {subiendo
                  ? "Creando evento..."
                  : "Crear evento"}
              </button>
            </form>
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                  Contenido
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Eventos cargados
                </h2>
              </div>

              <span className="text-sm font-bold text-black/40">
                {eventos.length}{" "}
                {eventos.length === 1
                  ? "evento"
                  : "eventos"}
              </span>
            </div>

            {eventos.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-black/5">
                <CalendarDays
                  size={40}
                  className="mx-auto text-black/20"
                />

                <p className="mt-4 font-bold">
                  Todavía no hay eventos.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventos.map((evento) => (
                  <article
                    key={evento.id}
                    className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/5"
                  >
                    <div className="flex flex-col md:flex-row">
                      {evento.imagen_principal ? (
                        <img
                          src={evento.imagen_principal}
                          alt={evento.nombre}
                          className="h-52 w-full object-cover md:h-auto md:w-56"
                        />
                      ) : (
                        <div className="flex h-52 w-full items-center justify-center bg-black/5 md:h-auto md:w-56">
                          <CalendarDays
                            size={40}
                            className="text-black/20"
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <h3 className="text-2xl font-black">
                            {evento.nombre}
                          </h3>

                          {evento.descripcion && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/50">
                              {evento.descripcion}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-black/50">
                            {evento.fecha && (
                              <span className="flex items-center gap-2">
                                <CalendarDays size={16} />

                                {new Date(
                                  evento.fecha
                                ).toLocaleString("es-AR", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </span>
                            )}

                            {(evento.lugar ||
                              evento.ciudad) && (
                              <span className="flex items-center gap-2">
                                <MapPin size={16} />

                                {[
                                  evento.lugar,
                                  evento.ciudad,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                          <button
                            onClick={() =>
                           router.push(`/admin/eventos/${evento.id}`)
                            }
                            className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
                          >
                            <Pencil size={15} />
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              eliminarEvento(evento.id)
                            }
                            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 size={15} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}