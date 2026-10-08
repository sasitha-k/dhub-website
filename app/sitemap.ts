import type { MetadataRoute } from "next";
import { publicRoutes, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: path === "/" || path === "/packages" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/packages") ? 0.8 : 0.6,
  }));
}
