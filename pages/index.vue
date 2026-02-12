<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-white shadow-lg' : 'bg-transparent'"
    >
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <img src="@/assets/img/logo.png" alt="LolaApril Logo" class="w-6 h-6" />
            <!-- <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg> -->
          </div>
          <div>
            <p class="text-lg font-bold" :class="scrolled ? 'text-gray-900' : 'text-white'">LolaApril</p>
            <p class="text-xs" :class="scrolled ? 'text-gray-500' : 'text-white/70'">Business Suite</p>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-8">
          <a 
            v-for="item in navItems" 
            :key="item.label" 
            :href="item.href" 
            class="text-sm font-medium transition-colors"
            :class="scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/90 hover:text-white'"
          >
            {{ item.label }}
          </a>
        </div>

        <!-- CTA Buttons -->
        <div class="hidden md:flex items-center gap-3">
          <NuxtLink 
            to="/auth/login" 
            class="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            :class="scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-white/80'"
          >
            Log in
          </NuxtLink>
          <NuxtLink 
            to="/auth/register" 
            class="text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Get Started Free
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 rounded-lg"
          :class="scrolled ? 'text-gray-900' : 'text-white'"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </nav>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t shadow-lg">
          <div class="px-4 py-6 space-y-4">
            <a 
              v-for="item in navItems" 
              :key="item.label" 
              :href="item.href" 
              @click="mobileMenuOpen = false"
              class="block text-gray-700 hover:text-primary font-medium py-2"
            >
              {{ item.label }}
            </a>
            <div class="pt-4 border-t space-y-3">
              <NuxtLink to="/auth/login" class="block text-center text-gray-700 font-medium py-2">Log in</NuxtLink>
              <NuxtLink to="/auth/register" class="block text-center bg-primary text-white font-semibold py-3 rounded-lg">Get Started Free</NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="relative min-h-screen flex items-center overflow-hidden bg-primary">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        </div>
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary-600 to-primary-700"></div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <!-- Left Content -->
            <div class="text-white space-y-8">
              <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-sm font-medium">Trusted by 500+ businesses across Nigeria</span>
              </div>
              
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Stop losing clients to
                <span class="text-secondary"> no-shows</span> and 
                <span class="text-secondary">chaos</span>
              </h1>
              
              <p class="text-lg text-white/80 max-w-xl">
                LolaApril is the all-in-one platform that helps salons, spas, and wellness businesses manage bookings, teams, finances, and multi-location operations — all from one intelligent dashboard.
              </p>

              <!-- Problem Stats -->
              <div class="grid grid-cols-3 gap-4 py-6 border-t border-b border-white/10">
                <div>
                  <p class="text-3xl font-bold text-secondary">35%</p>
                  <p class="text-sm text-white/60">Average no-show rate</p>
                </div>
                <div>
                  <p class="text-3xl font-bold text-secondary">4hrs</p>
                  <p class="text-sm text-white/60">Lost to manual tasks daily</p>
                </div>
                <div>
                  <p class="text-3xl font-bold text-secondary">₦2M+</p>
                  <p class="text-sm text-white/60">Revenue leakage/month</p>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <NuxtLink 
                  to="/auth/register" 
                  class="group inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </NuxtLink>
                <button 
                  @click="playDemo = true"
                  class="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Demo
                </button>
              </div>

              <!-- Trust Badges -->
              <div class="flex flex-wrap items-center gap-6 pt-4">
                <div class="flex items-center gap-2 text-sm text-white/60">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  No credit card required
                </div>
                <div class="flex items-center gap-2 text-sm text-white/60">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Free 14-day trial
                </div>
              </div>
            </div>

            <!-- Right Content - Dashboard Preview -->
            <div class="relative hidden lg:block">
              <div class="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-white/10 blur-3xl rounded-full"></div>
              <div class="relative bg-white rounded-3xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <!-- Dashboard Header -->
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <p class="text-xs uppercase text-gray-400 tracking-wide">Dashboard</p>
                    <p class="text-lg font-semibold text-gray-900">Today's Overview</p>
                  </div>
                  <span class="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    Live
                  </span>
                </div>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">Bookings</p>
                    </div>
                    <p class="text-2xl font-bold text-gray-900">124</p>
                    <p class="text-xs text-green-600 mt-1">↑ 12% from yesterday</p>
                  </div>
                  <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">Revenue</p>
                    </div>
                    <p class="text-2xl font-bold text-gray-900">₦4.8M</p>
                    <p class="text-xs text-green-600 mt-1">↑ 23% this week</p>
                  </div>
                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 rounded-lg bg-purple-200 flex items-center justify-center">
                        <svg class="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">Staff Active</p>
                    </div>
                    <p class="text-2xl font-bold text-gray-900">18</p>
                    <p class="text-xs text-gray-500 mt-1">All on schedule</p>
                  </div>
                  <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center">
                        <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">KYC Status</p>
                    </div>
                    <p class="text-lg font-bold text-green-600">Verified ✓</p>
                    <p class="text-xs text-gray-500 mt-1">Payouts enabled</p>
                  </div>
                </div>

                <!-- Business Switcher -->
                <div class="bg-primary rounded-2xl p-4 text-white">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-medium">Active Business</p>
                    <span class="text-xs bg-white/20 px-2 py-1 rounded-full">Switch →</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold">S</div>
                    <div>
                      <p class="font-semibold">Studio X</p>
                      <p class="text-xs text-white/70">Victoria Island, Lagos</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating Elements -->
              <div class="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">New Booking!</p>
                    <p class="text-xs text-gray-500">Aisha B. - Facial Treatment</p>
                  </div>
                </div>
              </div>

              <div class="absolute -bottom-2 -left-8 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">₦85,000</p>
                    <p class="text-xs text-gray-500">Payment received</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </section>

      <!-- Problems Section -->
      <section class="py-20 lg:py-28 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="inline-block text-primary font-semibold text-sm tracking-wide uppercase mb-4">The Problem</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Running a salon shouldn't feel like fighting fires all day
            </h2>
            <p class="text-lg text-gray-600">
              If you're managing bookings in notebooks, chasing payments manually, or losing track of staff schedules — you're not alone. These problems cost you time, money, and clients.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- No-shows -->
            <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">No-shows and last-minute cancellations</h3>
              <p class="text-gray-600">Clients forget appointments or cancel without notice, leaving gaps in your schedule and revenue.</p>
            </div>

            <!-- Manual booking -->
            <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Manual booking chaos</h3>
              <p class="text-gray-600">Managing appointments in notebooks or spreadsheets leads to double bookings and missed clients.</p>
            </div>

            <!-- Time wasted -->
            <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Time wasted on admin</h3>
              <p class="text-gray-600">Hours spent on scheduling, follow-ups, and paperwork instead of serving clients and growing your business.</p>
            </div>

            <!-- No visibility -->
            <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                  <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/>
                  <circle cx="17" cy="14" r="2"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">No visibility into finances</h3>
              <p class="text-gray-600">Tracking revenue, commissions, and expenses manually makes it impossible to know your true profitability.</p>
            </div>

            <!-- Staff scheduling -->
            <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Staff scheduling nightmares</h3>
              <p class="text-gray-600">Coordinating shifts, tracking hours, and calculating commissions across multiple staff is a headache.</p>
            </div>

            <!-- Multi-location -->
            <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Multi-location complexity</h3>
              <p class="text-gray-600">Managing multiple branches means juggling separate systems with no unified view of your operations.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Solutions/Features Section -->
      <section id="features" class="py-20 lg:py-28 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="inline-block text-primary font-semibold text-sm tracking-wide uppercase mb-4">The Solution</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to run a world-class operation
            </h2>
            <p class="text-lg text-gray-600">
              From booking to payouts, manage every aspect of your business in one powerful platform built specifically for the beauty and wellness industry.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Smart Booking -->
            <div class="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Smart Booking & Calendar</h3>
              <p class="text-gray-600 mb-4">Automated booking system that reduces no-shows and keeps your schedule optimized.</p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Automated reminders via SMS & WhatsApp
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Online booking widget for your website
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Waitlist management
                </li>
              </ul>
            </div>

            <!-- Team Management -->
            <div class="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Team Management</h3>
              <p class="text-gray-600 mb-4">Assign roles, manage schedules, and track performance across your entire team.</p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Role-based access control
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Shift scheduling & time tracking
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Commission tracking
                </li>
              </ul>
            </div>

            <!-- Finance & Payouts -->
            <div class="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                  <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/>
                  <circle cx="17" cy="14" r="2"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Finance & Payouts</h3>
              <p class="text-gray-600 mb-4">Track every naira with real-time financial insights and automated payouts.</p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Real-time revenue tracking
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Automated commission calculations
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  KYC-verified payouts
                </li>
              </ul>
            </div>

            <!-- Analytics -->
            <div class="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M3 3v18h18"/>
                  <path d="M7 14l4-4 4 4 5-6"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Analytics & Reports</h3>
              <p class="text-gray-600 mb-4">Data-driven insights to help you make smarter business decisions.</p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Revenue & growth metrics
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Client retention analysis
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Staff performance tracking
                </li>
              </ul>
            </div>

            <!-- KYC -->
            <div class="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">KYC & Compliance</h3>
              <p class="text-gray-600 mb-4">Simple verification process that unlocks the full power of the platform.</p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Quick document upload
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  24-hour verification
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Secure data handling
                </li>
              </ul>
            </div>

            <!-- Marketing Tools -->
            <div class="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M20 12v10H4V12"/>
                  <path d="M2 7h20v5H2z"/>
                  <path d="M12 22V7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 110-5C10 2 12 7 12 7z"/>
                  <path d="M12 7h4.5a2.5 2.5 0 100-5C14 2 12 7 12 7z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Marketing Tools</h3>
              <p class="text-gray-600 mb-4">Grow your client base with built-in marketing and promotional features.</p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Voucher & discount codes
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Membership programs
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Client communication tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="workflow" class="py-20 lg:py-28 bg-primary text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="inline-block text-secondary font-semibold text-sm tracking-wide uppercase mb-4">How It Works</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Get started in minutes, not days
            </h2>
            <p class="text-lg text-white/70">
              Our streamlined onboarding process gets you up and running fast so you can focus on what matters — your clients.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(step, index) in steps" :key="step.title" class="relative">
              <!-- Connector Line -->
              <div v-if="index < steps.length - 1" class="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-white/20"></div>
              
              <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-colors">
                <div class="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center text-xl font-bold mb-6">
                  {{ index + 1 }}
                </div>
                <h3 class="text-xl font-semibold mb-3">{{ step.title }}</h3>
                <p class="text-white/70">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <div class="text-center mt-12">
            <NuxtLink 
              to="/auth/register" 
              class="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors"
            >
              Start Your Free Trial
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Multi-Location Feature -->
      <section class="py-20 lg:py-28 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span class="inline-block text-primary font-semibold text-sm tracking-wide uppercase mb-4">Multi-Location Management</span>
              <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                One dashboard. Multiple businesses. Zero confusion.
              </h2>
              <p class="text-lg text-gray-600 mb-8">
                Whether you have 2 locations or 20, switch between businesses instantly and get a unified view of your entire empire.
              </p>

              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Instant Business Switching</h4>
                    <p class="text-gray-600">Jump between locations with a single click. No logging out required.</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Consolidated Reporting</h4>
                    <p class="text-gray-600">See combined revenue, bookings, and performance across all locations.</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Role-Based Access</h4>
                    <p class="text-gray-600">Give your managers access only to their specific locations.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Visual -->
            <div class="relative">
              <div class="bg-gray-100 rounded-3xl p-8">
                <div class="bg-white rounded-2xl shadow-xl p-6">
                  <div class="flex items-center justify-between mb-6">
                    <p class="font-semibold text-gray-900">Your Businesses</p>
                    <button class="text-sm text-primary font-medium">+ Add New</button>
                  </div>
                  <div class="space-y-4">
                    <div v-for="location in locations" :key="location.name" 
                      class="flex items-center justify-between p-4 rounded-xl border-2 transition-colors cursor-pointer"
                      :class="location.active ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'"
                    >
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center text-lg font-bold">
                          {{ location.name.charAt(0) }}
                        </div>
                        <div>
                          <p class="font-semibold text-gray-900">{{ location.name }}</p>
                          <p class="text-sm text-gray-500">{{ location.city }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <span 
                          class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                          :class="location.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                        >
                          <span class="w-1.5 h-1.5 rounded-full" :class="location.status === 'Active' ? 'bg-primary' : 'bg-amber-500'"></span>
                          {{ location.status }}
                        </span>
                        <p class="text-xs text-gray-400 mt-1">{{ location.bookings }} bookings today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- KYC Section -->
      <section id="kyc" class="py-20 lg:py-28 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <!-- Visual -->
            <div class="order-2 lg:order-1">
              <div class="bg-gradient-to-br from-primary via-primary-600 to-primary-800 rounded-3xl p-8 text-white">
                <div class="flex items-center gap-3 mb-8">
                  <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-white/70">KYC Status</p>
                    <p class="font-semibold">Verification Center</p>
                  </div>
                </div>

                <div class="space-y-4 mb-8">
                  <div class="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <span>Business Registration</span>
                    </div>
                    <span class="text-green-400 text-sm font-medium">Verified</span>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <span>Bank Account</span>
                    </div>
                    <span class="text-green-400 text-sm font-medium">Verified</span>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <span>ID Verification</span>
                    </div>
                    <span class="text-green-400 text-sm font-medium">Verified</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white/10 rounded-xl p-4 text-center">
                    <p class="text-3xl font-bold">4 min</p>
                    <p class="text-sm text-white/70">Average upload time</p>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4 text-center">
                    <p class="text-3xl font-bold">24 hrs</p>
                    <p class="text-sm text-white/70">Verification time</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="order-1 lg:order-2">
              <span class="inline-block text-primary font-semibold text-sm tracking-wide uppercase mb-4">KYC & Compliance</span>
              <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Verify once. Unlock everything.
              </h2>
              <p class="text-lg text-gray-600 mb-8">
                Our streamlined KYC process takes just minutes to complete. Once verified, you'll unlock the full power of the platform.
              </p>

              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Enable payouts and automated settlements</p>
                    <p class="text-gray-600 text-sm">Get paid directly to your bank account with automatic settlements.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Process staff commissions and payroll</p>
                    <p class="text-gray-600 text-sm">Automate commission calculations and payroll exports.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Access premium analytics and insights</p>
                    <p class="text-gray-600 text-sm">Get detailed reports on revenue, trends, and growth opportunities.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Launch marketing campaigns</p>
                    <p class="text-gray-600 text-sm">Create vouchers, memberships, and promotional offers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" class="py-20 lg:py-28 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="inline-block text-primary font-semibold text-sm tracking-wide uppercase mb-4">Testimonials</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by salon owners across Nigeria
            </h2>
            <p class="text-lg text-gray-600">
              Join hundreds of businesses that have transformed their operations with LolaApril.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="testimonial in testimonials" :key="testimonial.name" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <!-- Stars -->
              <div class="flex gap-1 mb-4">
                <svg v-for="i in 5" :key="i" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              
              <p class="text-gray-600 mb-6">"{{ testimonial.quote }}"</p>
              
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-semibold">
                  {{ testimonial.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ testimonial.name }}</p>
                  <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 bg-primary/5 rounded-3xl p-8 md:p-12">
            <div class="text-center">
              <p class="text-4xl font-bold text-primary">500+</p>
              <p class="text-gray-600 mt-1">Active Businesses</p>
            </div>
            <div class="text-center">
              <p class="text-4xl font-bold text-primary">50K+</p>
              <p class="text-gray-600 mt-1">Bookings Monthly</p>
            </div>
            <div class="text-center">
              <p class="text-4xl font-bold text-primary">₦2B+</p>
              <p class="text-gray-600 mt-1">Processed Payments</p>
            </div>
            <div class="text-center">
              <p class="text-4xl font-bold text-primary">98%</p>
              <p class="text-gray-600 mt-1">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->

      <section id="pricing" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PricingSection />
        <!-- <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="inline-block text-primary font-semibold text-sm tracking-wide uppercase mb-4">Pricing</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p class="text-lg text-gray-600">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div v-for="plan in plans" :key="plan.name" 
              class="bg-white rounded-2xl p-8 border-2 transition-all"
              :class="plan.popular ? 'border-primary shadow-xl scale-105' : 'border-gray-100'"
            >
              <div v-if="plan.popular" class="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Most Popular
              </div>
              <h3 class="text-xl font-bold text-gray-900">{{ plan.name }}</h3>
              <p class="text-gray-500 text-sm mt-1">{{ plan.description }}</p>
              
              <div class="my-6">
                <span class="text-4xl font-bold text-gray-900">{{ plan.price }}</span>
                <span v-if="plan.period" class="text-gray-500">{{ plan.period }}</span>
              </div>

              <ul class="space-y-3 mb-8">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm text-gray-600">
                  <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>

              <NuxtLink 
                to="/auth/register"
                class="block text-center py-3 rounded-xl font-semibold transition-colors"
                :class="plan.popular ? 'bg-primary text-white hover:bg-primary-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'"
              >
                {{ plan.cta }}
              </NuxtLink>
            </div>
          </div>
        </div> -->
      </section>

      <!-- FAQ Section -->
      <section class="py-20 lg:py-28 bg-white">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="inline-block text-primary font-semibold text-sm tracking-wide uppercase mb-4">FAQ</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <div class="space-y-4">
            <div v-for="(faq, index) in faqs" :key="index" class="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                @click="toggleFaq(index)"
                class="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span class="font-semibold text-gray-900">{{ faq.question }}</span>
                <svg 
                  class="w-5 h-5 text-gray-500 transition-transform"
                  :class="openFaq === index ? 'rotate-180' : ''"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div v-if="openFaq === index" class="px-6 pb-6">
                  <p class="text-gray-600">{{ faq.answer }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 lg:py-28 bg-primary">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform your business?
          </h2>
          <p class="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Join 500+ salons, spas, and wellness businesses that trust LolaApril to run their operations. Start your free trial today.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/auth/register" 
              class="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors"
            >
              Get Started Free
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </NuxtLink>
            <NuxtLink 
              to="/auth/login" 
              class="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Schedule a Demo
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <img src="@/assets/img/logo.png" alt="LolaApril Logo" class="w-6 h-6" />
                <!-- <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg> -->
              </div>
              <p class="text-lg font-bold">LolaApril</p>
            </div>
            <p class="text-gray-400 text-sm">
              The all-in-one platform for salons, spas, and wellness businesses.
            </p>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#features" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Updates</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-400">© 2026 LolaApril Business Suite. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/lolaaprilwellness/" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Demo Video Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="playDemo" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click="playDemo = false">
          <div class="bg-white rounded-2xl p-2 max-w-4xl w-full" @click.stop>
            <div class="flex justify-end mb-2">
              <button @click="playDemo = false" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
              <p class="text-white text-lg">Demo video coming soon...</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Navigation
const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#workflow' },
  { label: 'KYC', href: '#kyc' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' }
]

// State
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const playDemo = ref(false)
const openFaq = ref<number | null>(null)

// Scroll handler
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Toggle FAQ
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

// Steps Data
const steps = [
  { title: 'Create Account', description: 'Sign up in seconds and access your secure business workspace.' },
  { title: 'Add Businesses', description: 'Register your locations, services, and team members.' },
  { title: 'Verify KYC', description: 'Quick document upload to unlock payments and advanced features.' },
  { title: 'Start Operating', description: 'Accept bookings, manage your team, and grow your business.' }
]

// Locations Data
const locations = [
  { name: 'Studio X', city: 'Victoria Island', status: 'Active', bookings: 24, active: true },
  { name: 'Glow Lounge', city: 'Lekki Phase 1', status: 'Active', bookings: 18, active: false },
  { name: 'Pure Bliss Spa', city: 'Ikeja', status: 'Pending', bookings: 0, active: false }
]

// Testimonials Data
const testimonials = [
  { 
    name: 'Aisha Bello', 
    role: 'Owner, Studio X', 
    quote: 'We reduced no-shows by 32% in the first month. The automated reminders are a game-changer. Our clients love the easy online booking and we love the organized calendar.'
  },
  { 
    name: 'Daniel Okoro', 
    role: 'Founder, Glow Lounge', 
    quote: 'Managing 3 locations used to be chaos. Now I can switch between businesses instantly and see everything in one dashboard. The multi-business feature saved my sanity.'
  },
  { 
    name: 'Kemi Ade', 
    role: 'Finance Manager, Pure Bliss', 
    quote: 'Finally, I can track revenue, commissions, and expenses in real-time. The KYC process was smooth and payouts are now automated. No more Excel spreadsheets!'
  }
]

// Plans Data
const plans = [
  {
    name: 'Starter',
    description: 'Perfect for solo practitioners',
    price: 'Free',
    period: '',
    features: ['Up to 50 bookings/month', 'Basic calendar', 'SMS reminders', 'Email support'],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Professional',
    description: 'Best for growing salons',
    price: '₦25,000',
    period: '/month',
    features: ['Unlimited bookings', 'Team management (up to 10)', 'Financial reports', 'KYC & payouts', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For multi-location businesses',
    price: 'Custom',
    period: '',
    features: ['Everything in Professional', 'Unlimited locations', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false
  }
]

// FAQs Data
const faqs = [
  {
    question: 'How long does the free trial last?',
    answer: 'You get a full 14-day free trial with access to all Professional plan features. No credit card required to start.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including bank transfers, debit cards, and mobile money. For enterprise plans, we also offer invoicing.'
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
  },
  {
    question: 'How does KYC verification work?',
    answer: 'Simply upload your business registration documents and valid ID. Our team reviews submissions within 24 hours, and you\'ll be notified once verified.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use bank-level encryption and comply with Nigerian data protection regulations. Your data is stored securely and never shared with third parties.'
  },
  {
    question: 'Do you offer training and support?',
    answer: 'Yes! All plans include email support, and Professional/Enterprise plans get priority support plus access to training resources and webinars.'
  }
]
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 3s ease-in-out infinite;
  animation-delay: 1.5s;
}
</style>
