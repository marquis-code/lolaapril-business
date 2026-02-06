<!-- layouts/auth.vue -->
<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-md">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2" style="color: #005967">
            <img src="@/assets/img/logo.png" alt="Lola April Logo" class="bg-primary p-2 rounded-xl h-10 w-auto" />
          </h1>
          <p class="text-gray-600">Empowering beauty businesses to go digital</p>
        </div>
        <slot />
      </div>
    </div>

    <!-- Right Side - Image/Brand -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden" style="background: linear-gradient(135deg, #005967 0%, #008B9E 100%)">
      <div class="absolute inset-0 flex items-center justify-center p-12">
        <div class="text-white max-w-lg">
          <div class="mb-8">
            <svg class="w-20 h-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 class="text-4xl font-bold mb-4">Transform Your Beauty Business</h2>
            <p class="text-lg text-white/90 mb-8">
              Join hundreds of salons and beauty professionals managing bookings, clients, and growth seamlessly with Lola April.
            </p>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <svg class="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="font-semibold mb-1">Online Booking System</h3>
                <p class="text-white/80 text-sm">Let clients book appointments 24/7 with your custom booking page</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <svg class="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="font-semibold mb-1">Client Management</h3>
                <p class="text-white/80 text-sm">Keep track of client history, preferences, and communications</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <svg class="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="font-semibold mb-1">Payment Integration</h3>
                <p class="text-white/80 text-sm">Accept payments online and manage your business finances</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
    </div>
  </div>
</template>