import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#111]">
      <SiteHeader />

      <section className="flex min-h-[65vh] items-center justify-center px-5 py-20">
        <div className="text-center">
          <p className="text-8xl font-black tracking-[-0.08em] text-black/10 md:text-[12rem]">
            404
          </p>

          <h1 className="-mt-5 text-3xl font-black tracking-[-0.04em] md:text-5xl">
            Esta página no existe.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/45">
            Puede que el contenido haya sido eliminado o que la dirección sea
            incorrecta.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-black text-white transition hover:bg-red-600"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}