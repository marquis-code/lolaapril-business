import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,

    devServer: {
    port: 3002,
    host: 'localhost' // or '0.0.0.0' to allow external access
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
       title: 'Lola April Wellness Spa - Outside Health Starts Inside',
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },

        // ✅ SEO meta
        {
          name: "description",
            content: 'Premier destination for holistic rejuvenation. Bespoke wellness experiences with 24/7 spa services in Lagos, Nigeria.' 
        },
        {
          name: "keywords",
           content: 'Premier destination for holistic rejuvenation. Bespoke wellness experiences with 24/7 spa services in Lagos, Nigeria.' 
        },
        { name: "author", content: "Lola April Wellness Spa" },

        // ✅ Open Graph (for social previews)
        { property: "og:title", content: "Lola April Wellness Spa — Outside Health Starts Inside" },
        {
          property: "og:description",
          content:
            "Premier destination for holistic rejuvenation. Bespoke wellness experiences with 24/7 spa services in Lagos, Nigeria.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://lolaaprilwellnessspa.com" },
        { property: "og:image", content: "https://lolaaprilwellnessspa.com/og-image.jpg" },

        // ✅ Twitter meta
        { name: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://lolaaprilwellnessspa.com" },
        { name: "twitter:title", content: "Lola April Wellness Spa — Outside Health Starts Inside" },
        {
          name: "twitter:description",
          content:
            "Premier destination for holistic rejuvenation. Bespoke wellness experiences with 24/7 spa services in Lagos, Nigeria.",
        },
        { name: "twitter:image", content: "https://lolaaprilwellnessspa.com/og-image.jpg" },
      ],

      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],

      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
          type: "text/javascript",
        },
      ],
    },
  },

  build: {
    transpile: ["lucide-vue-next"],
  },

  css: ['/assets/css/font/stylesheet.css', "/assets/css/main.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
  ],
  compatibilityDate: "2025-11-01"
});