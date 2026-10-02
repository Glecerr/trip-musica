"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [verificando, setVerificando] = useState(
    pathname !== "/admin/login"
  );

  useEffect(() => {
    if (pathname === "/admin/login") {
      setVerificando(false);
      return;
    }

    let activo = true;

    async function verificarAdministrador() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !admin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      if (activo) {
        setVerificando(false);
      }
    }

    verificarAdministrador();

    return () => {
      activo = false;
    };
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ed]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />

          <p className="mt-4 text-sm font-bold text-black/40">
            Verificando acceso...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}