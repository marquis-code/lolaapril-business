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
      title: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        { name: "description", content: "Stop losing clients to no-shows and chaos. LolaApril helps salons, spas, and wellness businesses manage bookings, teams, finances, and multi-location operations from one intelligent dashboard." },
        { name: "keywords", content: "salon management software, spa booking system, wellness business platform, appointment scheduling, staff management, salon POS, multi-location management, Nigeria salon software, beauty business management" },
        { property: "og:title", content: "LolaApril Business Suite - All-in-One Salon & Spa Management Platform" },
        { property: "og:description", content: "Manage bookings, teams, finances, and multi-location operations for your salon, spa, or wellness business. Trusted by 500+ businesses across Nigeria." },
        { property: "og:image", content: "/img/og-image.jpg" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "LolaApril Business Suite - All-in-One Salon & Spa Management Platform" },
        { name: "twitter:description", content: "Stop losing clients to no-shows. Manage your salon, spa, or wellness business with LolaApril's intelligent booking and management platform." },
        { name: "twitter:image", content: "/img/og-image.jpg" },
      ],
      link: [
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
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
  ],

  sitemap: {
    hostname: 'https://lolaapril.com',
    gzip: true,
    routes: [
      '/',
      '/auth/login',
      '/auth/register',
      '/features',
      '/pricing',
      '/about',
      '/contact',
    ],
  },

  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/dashboard', '/admin'],
    Sitemap: 'https://lolaapril.com/sitemap.xml',
  },

  seo: {
    enabled: true,
    meta: {
      title: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
      description: 'Stop losing clients to no-shows and chaos. LolaApril helps salons, spas, and wellness businesses manage bookings, teams, finances, and multi-location operations from one intelligent dashboard. Trusted by 500+ businesses across Nigeria.',
      keywords: 'salon management software, spa booking system, wellness business platform, appointment scheduling, staff management, salon POS, multi-location management, Nigeria salon software, beauty business management, no-show reduction, KYC verification, automated reminders',
      ogTitle: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
      ogDescription: 'Manage bookings, teams, finances, and multi-location operations for your salon, spa, or wellness business. Reduce no-shows by 32% and save 4 hours daily.',
      ogImage: '/img/og-image.jpg',
      twitterCard: 'summary_large_image',
    },
  },

  compatibilityDate: "2025-11-01"
});