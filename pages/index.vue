<template>
  <div class="min-h-screen bg-white text-gray-900">
    <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500"></div>
          <div>
            <p class="text-sm font-semibold">LolaApril</p>
            <p class="text-xs text-gray-500">Business Suite</p>
          </div>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#features" class="hover:text-gray-900">Features</a>
          <a href="#workflow" class="hover:text-gray-900">How it works</a>
          <a href="#kyc" class="hover:text-gray-900">KYC</a>
          <a href="#testimonials" class="hover:text-gray-900">Stories</a>
        </nav>
        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</NuxtLink>
          <NuxtLink to="/auth/register" class="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg">Get started</NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                B2B salon operations suite
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Run every salon business from one intelligent dashboard.
              </h1>
              <p class="text-gray-600 text-lg">
                LolaApril helps salons, spas, and wellness businesses manage bookings, teams, finances, and multi-location operations. Sign up, add businesses, switch between them, and scale with confidence.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <NuxtLink to="/auth/register" class="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold">Start free</NuxtLink>
                <NuxtLink to="/auth/login" class="border border-gray-200 px-6 py-3 rounded-xl font-semibold text-gray-700">Book a demo</NuxtLink>
              </div>
              <div class="flex items-center gap-6 text-sm text-gray-500">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  KYC-ready payouts
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  Multi-business switching
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl rounded-full"></div>
              <div class="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <p class="text-xs uppercase text-gray-400">Today</p>
                    <p class="text-lg font-semibold">Business overview</p>
                  </div>
                  <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-2xl p-4">
                    <p class="text-xs text-gray-500">Bookings</p>
                    <p class="text-2xl font-bold">124</p>
                  </div>
                  <div class="bg-gray-50 rounded-2xl p-4">
                    <p class="text-xs text-gray-500">Revenue</p>
                    <p class="text-2xl font-bold">₦4.8M</p>
                  </div>
                  <div class="bg-gray-50 rounded-2xl p-4">
                    <p class="text-xs text-gray-500">Staff on shift</p>
                    <p class="text-2xl font-bold">18</p>
                  </div>
                  <div class="bg-gray-50 rounded-2xl p-4">
                    <p class="text-xs text-gray-500">KYC status</p>
                    <p class="text-2xl font-bold">Verified</p>
                  </div>
                </div>
                <div class="mt-6 bg-gray-900 text-white rounded-2xl p-4">
                  <p class="text-sm font-medium">Switch business</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="w-2 h-2 rounded-full bg-green-400"></span>
                    Studio X • Victoria Island
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold">Everything your salon needs to grow</h2>
            <p class="text-gray-600 mt-3">From booking to payouts, manage every department in one platform.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="feature in features" :key="feature.title" class="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition">
              <div class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-4">
                <component :is="feature.icon" class="w-5 h-5" />
              </div>
              <h3 class="text-lg font-semibold">{{ feature.title }}</h3>
              <p class="text-sm text-gray-600 mt-2">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl sm:text-4xl font-bold">Onboard fast. Operate smarter.</h2>
              <p class="text-gray-600 mt-3">Create an account, add your businesses, complete KYC, and switch between locations instantly.</p>
              <div class="mt-8 space-y-4">
                <div v-for="step in steps" :key="step.title" class="flex gap-4">
                  <div class="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">{{ step.step }}</div>
                  <div>
                    <p class="font-semibold">{{ step.title }}</p>
                    <p class="text-sm text-gray-600">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold">Business switcher</p>
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Multi-location</span>
              </div>
              <div class="mt-6 space-y-3">
                <div v-for="location in locations" :key="location.name" class="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div>
                    <p class="font-semibold">{{ location.name }}</p>
                    <p class="text-xs text-gray-500">{{ location.city }}</p>
                  </div>
                  <span class="text-xs" :class="location.status === 'Active' ? 'text-green-600' : 'text-gray-400'">{{ location.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kyc" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="bg-gradient-to-br from-gray-900 to-purple-900 text-white rounded-3xl p-8">
              <p class="text-xs uppercase text-white/70">KYC & compliance</p>
              <h2 class="text-3xl font-bold mt-3">Unlock core operations with fast KYC verification.</h2>
              <p class="text-white/80 mt-3">Upload business documents, verify once, and access payouts, advanced finance tools, and marketplace visibility.</p>
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="bg-white/10 rounded-2xl p-4">
                  <p class="text-sm font-semibold">Uploads</p>
                  <p class="text-2xl font-bold">4 mins</p>
                </div>
                <div class="bg-white/10 rounded-2xl p-4">
                  <p class="text-sm font-semibold">Review</p>
                  <p class="text-2xl font-bold">24 hrs</p>
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <h3 class="text-2xl font-bold">What you can do once verified</h3>
              <ul class="space-y-3 text-gray-600">
                <li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-green-500 mt-2"></span>Enable payouts and automated settlements.</li>
                <li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-green-500 mt-2"></span>Approve staff commissions and payroll exports.</li>
                <li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-green-500 mt-2"></span>Access premium analytics and reporting.</li>
                <li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-green-500 mt-2"></span>Run promotions, vouchers, and marketplace listings.</li>
              </ul>
              <NuxtLink to="/dashboard/profile" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                Go to business profile
                <span>→</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold">Built for operators who care about detail</h2>
            <p class="text-gray-600 mt-3">Teams trust LolaApril to keep their schedules full and finances organized.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="story in testimonials" :key="story.name" class="bg-white border border-gray-100 rounded-2xl p-6">
              <p class="text-sm text-gray-600">“{{ story.quote }}”</p>
              <div class="mt-4">
                <p class="font-semibold">{{ story.name }}</p>
                <p class="text-xs text-gray-500">{{ story.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-3xl p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-3xl font-bold">Ready to manage every business with clarity?</h2>
              <p class="text-white/80 mt-2">Create an account, add your locations, and start optimizing operations today.</p>
            </div>
            <div class="flex gap-4">
              <NuxtLink to="/auth/register" class="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold">Get started</NuxtLink>
              <NuxtLink to="/auth/login" class="border border-white/40 px-6 py-3 rounded-xl font-semibold text-white">Sign in</NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-gray-100 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500">© 2026 LolaApril Business Suite. All rights reserved.</p>
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <a href="#features" class="hover:text-gray-900">Features</a>
          <a href="#workflow" class="hover:text-gray-900">Workflow</a>
          <a href="#kyc" class="hover:text-gray-900">KYC</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const IconCalendar = {
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
}
const IconUsers = {
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
}
const IconWallet = {
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H6a2 2 0 0 0-2 2v2"/><circle cx="18" cy="13" r="1"/></svg>'
}
const IconChart = {
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>'
}
const IconShield = {
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
}
const IconGift = {
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 1 1 0-5c2.5 0 4.5 5 4.5 5z"/><path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C14 2 12 7 12 7z"/></svg>'
}

const features = [
  { title: 'Smart booking & calendar', description: 'Manage appointments, reschedules, and waitlists across locations.', icon: IconCalendar },
  { title: 'Team & roles', description: 'Assign roles, manage shifts, and track staff performance.', icon: IconUsers },
  { title: 'Finance & payouts', description: 'Track revenue, commissions, refunds, and payouts.', icon: IconWallet },
  { title: 'Analytics & reports', description: 'Real-time dashboards for sales, growth, and client retention.', icon: IconChart },
  { title: 'KYC & compliance', description: 'Upload documents once and unlock core business actions.', icon: IconShield },
  { title: 'Marketing tools', description: 'Launch vouchers, memberships, and promotions quickly.', icon: IconGift }
]

const steps = [
  { step: '1', title: 'Create an account', description: 'Sign up and access your secure business workspace.' },
  { step: '2', title: 'Add your businesses', description: 'Register multiple locations and assign staff.' },
  { step: '3', title: 'Upload KYC documents', description: 'Verify once to unlock payouts and core operations.' },
  { step: '4', title: 'Operate & scale', description: 'Switch between businesses and manage everything from one place.' }
]

const locations = [
  { name: 'Studio X', city: 'Victoria Island', status: 'Active' },
  { name: 'Glow Lounge', city: 'Lekki Phase 1', status: 'Active' },
  { name: 'Pure Bliss Spa', city: 'Ikeja', status: 'Pending' }
]

const testimonials = [
  { name: 'Aisha Bello', role: 'Operations Lead, Studio X', quote: 'We reduced no-shows by 32% and finally track profitability by location.' },
  { name: 'Daniel Okoro', role: 'Founder, Glow Lounge', quote: 'The multi-business switcher is a game changer for our management team.' },
  { name: 'Kemi Ade', role: 'Finance Manager, Pure Bliss', quote: 'KYC verification and payouts are now streamlined in one workflow.' }
]
</script>