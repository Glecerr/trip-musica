"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
} from "lucide-react";

export default function EditarEventoPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [imagenActual, setImagenActual] = useState("");

  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);

  useEffect(() => {
    async function cargarEvento() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        router.replace("/admin/eventos");
        return;
      }

      setNombre(data.nombre || "");
      setDescripcion(data.descripcion || "");
      setLugar(data.lugar || "");
      setCiudad(data.ciudad || "");
      setImagenActual(data.imagen_principal || "");

      if (data.fecha) {
        const fechaLocal = new Date(data.fecha);

        const year = fechaLocal.getFullYear();
        const month = String(
          fechaLocal.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
          fechaLocal.getDate()
        ).padStart(2, "0");
        const hours = String(
          fechaLocal.getHours()
        ).padStart(2, "0");
        const minutes = String(
          fechaLocal.getMinutes()
        ).padStart(2, "0");

        setFecha(
          `${year}-${month}-${day}T${hours}:${minutes}`
        );
      }

      setLoading(false);
    }

    cargarEvento();
  }, [id, router]);

  function generarSlug(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function guardarCambios(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setGuardando(true);
    setMensaje("");

    try {
      let imagenUrl = imagenActual || null;

      if (nuevaImagen) {
        const extension = nuevaImagen.name
          .split(".")
          .pop();

        const nombreArchivo = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${extension}`;

        const ruta = `eventos/${nombreArchivo}`;

        const { error: uploadError } =
          await supabase.storage
            .from("trip-media")
            .upload(ruta, nuevaImagen);

        if (uploadError) {
          throw new Error(
            "No se pudo subir la imagen: " +
              uploadError.message
          );
        }

        const { data } = supabase.storage
          .from("trip-media")
          .getPublicUrl(ruta);

        imagenUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("eventos")
        .update({
          nombre: nombre.trim(),
          slug: `${generarSlug(nombre)}-${id.slice(
            0,
            8
          )}`,
          descripcion:
            descripcion.trim() || null,
          fecha: fecha
            ? new Date(fecha).toISOString()
            : null,
          lugar: lugar.trim() || null,
          ciudad: ciudad.trim() || null,
          imagen_principal: imagenUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        throw new Error(
          "No se pudo actualizar: " +
            error.message
        );
      }

      setImagenActual(imagenUrl || "");
      setNuevaImagen(null);
      setMensaje(
        "Evento actualizado correctamente."
      );

      setTimeout(() => {
        router.push("/admin/eventos");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(error);

      setMensaje(
        error instanceof Error
          ? error.message
          : "Ocurrió un error."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarEvento() {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este evento?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("eventos")
      .delete()
      .eq("id", id);

    if (error) {
      alert(
        "No se pudo eliminar: " +
          error.message
      );
      return;
    }

    router.push("/admin/eventos");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
        <p className="font-bold text-black/50">
          Cargando evento...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 md:px-8">
          <div>
            <p className="text-xl font-black tracking-[-0.05em]">
              TRIP<span className="text-red-600">.</span>MUSIC
            </p>

            <p className="text-xs text-black/40">
              Editar evento
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/admin/eventos")
            }
            className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Administración
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Editar evento
          </h1>
        </div>

        <form
          onSubmit={guardarCambios}
          className="rounded-3xl bg-white p-6 ring-1 ring-black/5 md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold">
                Nombre
              </label>

              <input
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold">
                Descripción
              </label>

              <textarea
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(e.target.value)
                }
                rows={6}
                className="w-full resize-none rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Fecha y hora
              </label>

              <input
                type="datetime-local"
                value={fecha}
                onChange={(e) =>
                  setFecha(e.target.value)
                }
                className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Lugar
              </label>

              <input
                value={lugar}
                onChange={(e) =>
                  setLugar(e.target.value)
                }
                className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Ciudad
              </label>

              <input
                value={ciudad}
                onChange={(e) =>
                  setCiudad(e.target.value)
                }
                className="w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Nueva imagen
              </label>

              <label
                htmlFor="nueva-imagen"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-black/20 bg-[#f7f6f2] px-4 py-3 text-sm font-bold hover:border-red-600 hover:text-red-600"
              >
                <Upload size={18} />

                {nuevaImagen
                  ? nuevaImagen.name
                  : "Cambiar imagen"}
              </label>

              <input
                id="nueva-imagen"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNuevaImagen(
                    e.target.files?.[0] || null
                  )
                }
                className="hidden"
              />
            </div>
          </div>

          {imagenActual && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-bold">
                Imagen actual
              </p>

              <img
                src={imagenActual}
                alt={nombre}
                className="max-h-80 w-full rounded-2xl object-cover"
              />
            </div>
          )}

          {mensaje && (
            <div className="mt-6 rounded-xl bg-black/5 px-4 py-3 text-sm font-bold">
              {mensaje}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={eliminarEvento}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-600 hover:text-white"
            >
              <Trash2 size={18} />
              Eliminar evento
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-black text-white hover:bg-red-600 disabled:opacity-50"
            >
              <Save size={18} />

              {guardando
                ? "Guardando..."
                : "Guardar cambios"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}