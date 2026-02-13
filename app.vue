<template>
  <div>
    <UiToast class="z-[9999999]" />
    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />
    </NuxtLayout>
  </div>
</template>

<style>
body {
  font-family: 'Roobert PRO', sans-serif;
}
</style>

<script setup lang="ts">
// Global app configuration
useHead({
  title: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ]
})

useSeoMeta({
  title: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
  ogTitle: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
  description: 'Stop losing clients to no-shows and chaos. LolaApril helps salons, spas, and wellness businesses manage bookings, teams, finances, and multi-location operations from one intelligent dashboard. Trusted by 500+ businesses across Nigeria.',
  ogDescription: 'Manage bookings, teams, finances, and multi-location operations for your salon, spa, or wellness business. Reduce no-shows by 32% and save 4 hours daily.',
  keywords: 'salon management software, spa booking system, wellness business platform, appointment scheduling, staff management, salon POS, multi-location management, Nigeria salon software, beauty business management, no-show reduction, KYC verification, automated reminders, Lagos salon software',
  author: 'LolaApril',
  ogType: 'website',
  ogUrl: 'https://lolaapril.com',
  ogImage: 'https://lolaapril.com/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'LolaApril Business Suite - Stop Losing Clients to No-Shows',
  twitterDescription: 'All-in-one platform for salons, spas, and wellness businesses. Manage bookings, teams, and finances with automated reminders and real-time analytics. Trusted by 500+ businesses.',
  twitterImage: 'https://lolaapril.com/og-image.jpg'
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
</style>
