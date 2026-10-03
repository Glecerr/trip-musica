"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galería" },
];

export default function SiteHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f4f2ed]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMenuAbierto(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-black text-white transition-transform group-hover:-rotate-3">
            TM
          </div>

          <div className="leading-none">
            <div className="text-xl font-black tracking-[-0.05em]">
              TRIP MUSICA
            </div>

            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-black/40">
              Música · Cultura · Coberturas
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-black/60 transition hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white md:hidden"
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuAbierto && (
        <div className="border-t border-black/10 bg-[#f4f2ed] px-5 py-5 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAbierto(false)}
                className="border-b border-black/10 py-4 text-lg font-black"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}