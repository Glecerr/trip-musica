import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-[#111] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="text-3xl font-black tracking-[-0.06em]">
              TRIP MUSIC
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
              Noticias, eventos, coberturas, fotos y videos del mundo de la
              música.
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
              Navegación
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link href="/" className="text-sm text-white/65 hover:text-white">
                Inicio
              </Link>

              <Link
                href="/noticias"
                className="text-sm text-white/65 hover:text-white"
              >
                Noticias
              </Link>

              <Link
                href="/eventos"
                className="text-sm text-white/65 hover:text-white"
              >
                Eventos
              </Link>

              <Link
                href="/galeria"
                className="text-sm text-white/65 hover:text-white"
              >
                Galería
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
              Trip Music
            </p>

            <p className="mt-5 text-sm leading-6 text-white/45">
              Un espacio para descubrir, cubrir y compartir la música que
              mueve la escena.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Trip Music</span>

          <span>Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}