import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const BASE_URL = "https://trip-musica.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: noticias }, { data: eventos }] = await Promise.all([
    supabase
      .from("noticias")
      .select("slug, updated_at, created_at")
      .eq("publicada", true),

    supabase
      .from("eventos")
      .select("slug, updated_at, fecha"),
  ]);

  const paginas: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/noticias`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/eventos`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/galeria`,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const noticiasUrls: MetadataRoute.Sitemap =
    (noticias || []).map((noticia) => ({
      url: `${BASE_URL}/noticias/${noticia.slug}`,
      lastModified:
        noticia.updated_at || noticia.created_at || undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const eventosUrls: MetadataRoute.Sitemap =
    (eventos || []).map((evento) => ({
      url: `${BASE_URL}/eventos/${evento.slug}`,
      lastModified: evento.updated_at || evento.fecha || undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...paginas, ...noticiasUrls, ...eventosUrls];
}