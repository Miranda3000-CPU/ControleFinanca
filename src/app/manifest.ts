import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Controle de Finanças",
    short_name: "Finanças",
    description: "Dashboard pessoal de controle financeiro",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7fff8",
    theme_color: "#00e676",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
