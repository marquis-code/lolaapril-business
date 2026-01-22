<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-lg font-bold text-gray-900 mb-8">Appointments</h1>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-500 text-lg">Failed to load appointments</p>
        <p class="text-gray-500 mt-2">{{ error.message }}</p>
      </div>

      <div v-else>
        <!-- Upcoming Appointments -->
        <div class="mb-12">
          <h2 v-if="upcomingBookings.length" class="text-lg font-bold text-gray-900 mb-6">Upcoming</h2>

          <div v-if="upcomingBookings.length === 0" class="text-center py-16 bg-white rounded-2xl border-[0.5px] border-gray-100">
            <svg class="w-14 h-14 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-900 text-lg font-semibold mb-2">No upcoming appointments</p>
            <p class="text-gray-500 mb-6 text-sm">Your upcoming appointments will appear here when you book</p>
            <button
              @click="navigateTo('/#book')"
              class="inline-flex items-center text-sm gap-2 bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              Search salons
            </button>
          </div>

          <div v-else class="grid gap-4">
            <div
              v-for="booking in upcomingBookings"
              :key="booking._id"
              class="bg-white rounded-2xl border-[0.5px] border-gray-100 overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
              @click="selectBooking(booking)"
            >
              <div class="p-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0">
                       <img
                      src="@/assets/img/logo.png"
                      alt="Business"
                      class="w-16 h-16 p-2 bg-primary rounded-lg object-cover"
                    />
                  </div>
                  <!-- <div v-else class="flex-shrink-0 w-16 h-16 p-2 bg-primary rounded-lg"></div> -->
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-sm text-gray-900 mb-1">
                      {{ booking.business?.name || 'Lola April Wellness Spa' }}
                    </h3>
                    <p class="text-sm text-gray-600 mb-2">
                      {{ formatDateTime(booking.preferredDate, booking.preferredStartTime) }}
                    </p>
                    <p class="text-sm text-gray-600 mb-2">
                      ₦{{ formatPrice(booking.estimatedTotal) }} • {{ booking.services?.length || 1 }} item{{ booking.services?.length > 1 ? 's' : '' }}
                    </p>
                    <button
                      class="text-sm text-primary font-medium hover:text-primary-700"
                      @click.stop="navigateTo('/book?subdomain=lola-beauty')"
                    >
                      Book again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Appointments -->
        <div v-if="pastBookings.length > 0">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Past {{ pastBookings.length }}</h2>

          <div class="grid gap-4">
            <div
              v-for="booking in pastBookings"
              :key="booking._id"
              class="bg-white rounded-2xl border-[0.5px] border-gray-100 overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
              @click="selectBooking(booking)"
            >
              <div class="p-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0">
                    <img
                      src="@/assets/img/logo.png"
                      alt="Business"
                      class="w-16 h-16 p-2 bg-primary rounded-lg object-cover"
                    />
                  </div>
                  <!-- <div v-else class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg"></div> -->
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-sm text-gray-900 mb-1">
                      {{ booking.business?.name || 'Lola April Wellness Spa' }}
                    </h3>
                    <p class="text-sm text-gray-600 mb-2">
                      {{ formatDateTime(booking.preferredDate, booking.preferredStartTime) }}
                    </p>
                    <p class="text-sm text-gray-600 mb-2">
                      ₦{{ formatPrice(booking.estimatedTotal) }} • {{ booking.services?.length || 1 }} item{{ booking.services?.length > 1 ? 's' : '' }}
                    </p>
                    <button
                      class="text-sm text-primary font-medium hover:text-primary-700"
                      @click.stop="navigateTo('/book?subdomain=lola-beauty')"
                    >
                      Book again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Detail Modal -->
    <Transition name="modal">
      <div
        v-if="selectedBooking"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"
        @click.self="selectedBooking = null"
      >
        <div class="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <!-- Header Image -->
          <div class="relative h-48">
            <img
              src="@/assets/img/logo.png"
              alt="Business"
              class="w-full h-full object-cover"
            />
            <!-- <div v-else class="w-full h-full bg-gray-300"></div> -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <h2 class="absolute bottom-4 left-6 text-2xl font-bold text-white">
              {{ selectedBooking.business?.name || 'Lola April Wellness Spa' }}
            </h2>
          </div>

          <!-- Status Badge -->
          <div class="px-6 py-4 border-b border-gray-200">
            <span
              :class="getStatusClass(selectedBooking.status)"
              class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
            >
              {{ selectedBooking.status }}
            </span>
          </div>

          <!-- Details -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">
              {{ formatDateTime(selectedBooking.preferredDate, selectedBooking.preferredStartTime) }}
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              {{ selectedBooking.services?.[0]?.duration || 60 }} minute duration
            </p>

            <!-- Actions -->
            <div class="flex gap-3 mb-6">
              <button
                class="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 rounded-full hover:bg-gray-800 transition-colors"
                @click="navigateTo('/book?subdomain=lola-beauty')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Book again
              </button>
              <button
                class="px-6 py-3 border-2 border-gray-900 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <!-- Overview -->
            <div class="border-t border-gray-200 pt-6">
              <h4 class="font-bold text-gray-900 mb-4">Overview</h4>
              
              <div class="space-y-3">
                <div
                  v-for="service in selectedBooking.services"
                  :key="service.serviceId"
                  class="flex justify-between items-center"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ service.serviceName }}</p>
                    <p class="text-sm text-gray-500">{{ service.duration || 60 }} min - Me & Mine</p>
                  </div>
                  <p class="font-bold text-gray-900">₦{{ formatPrice(service.price) }}</p>
                </div>
              </div>

              <div class="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-900">₦{{ formatPrice(selectedBooking.estimatedTotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="text-gray-900">₦{{ formatPrice(selectedBooking.estimatedTotal * 0.075) }}</span>
                </div>
                <div class="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>₦{{ formatPrice(selectedBooking.estimatedTotal * 1.075) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGetMyBookings } from '@/composables/modules/booking/useGetMyBookings'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { loading, bookings, getMyBookings, error } = useGetMyBookings()

const normalizeDate = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
const selectedBooking = ref<any>(null)

const upcomingBookings = computed(() => {
  const today = normalizeDate(new Date())

  return bookings.value.filter((booking: any) => {
    const bookingDate = normalizeDate(new Date(booking.preferredDate))
    const status = booking.status?.toLowerCase()

    return (
      bookingDate >= today &&
      status !== 'completed' &&
      status !== 'cancelled'
    )
  })
})


const pastBookings = computed(() => {
  const today = normalizeDate(new Date())

  return bookings.value.filter((booking: any) => {
    const bookingDate = normalizeDate(new Date(booking.preferredDate))
    const status = booking.status?.toLowerCase()

    return (
      bookingDate < today ||
      status === 'completed' ||
      status === 'cancelled'
    )
  })
})

const formatDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)

  const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.getFullYear()

  return `${dayName}, ${day} ${month} ${year} at ${timeStr}`
}

const formatPrice = (price: number) => {
  if (!price) return '0'
  return Math.round(price).toLocaleString('en-NG')
}

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase()

  if (s === 'confirmed') return 'bg-green-100 text-green-800'
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800'
  if (s === 'cancelled') return 'bg-red-100 text-red-800'
  if (s === 'completed') return 'bg-blue-100 text-blue-800'

  return 'bg-gray-100 text-gray-800'
}

const selectBooking = (booking: any) => {
  selectedBooking.value = booking
}

onMounted(() => {
  getMyBookings()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(0) scale(0.9);
  }
}
</style>