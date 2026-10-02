import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://trip-musica.vercel.app";

  const { data: noticias } = await supabase
    .from("noticias")
    .select("slug, updated_at")
    .eq("publicada", true);

  const { data: eventos } = await supabase
    .from("eventos")
    .select("slug, updated_at");

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/eventos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...(noticias || []).map((noticia) => ({
      url: `${baseUrl}/noticias/${noticia.slug}`,
      lastModified: noticia.updated_at
        ? new Date(noticia.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...(eventos || []).map((evento) => ({
      url: `${baseUrl}/eventos/${evento.slug}`,
      lastModified: evento.updated_at
        ? new Date(evento.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}