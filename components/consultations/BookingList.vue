<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 class="text-lg font-semibold text-gray-900">Bookings ({{ bookings.length }})</h2>
      <div class="flex gap-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search client or package..."
            class="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none w-64"
          />
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div v-for="i in 5" :key="i" class="h-20 border-b border-gray-50 animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredBookings.length === 0"
      class="bg-white border border-gray-100 rounded-2xl p-12 text-center"
    >
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-gray-900 font-semibold mb-1">No bookings found</h3>
      <p class="text-gray-500 text-sm">When clients book consultations, they will appear here.</p>
    </div>

    <!-- Bookings Table -->
    <div v-else class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
      <table class="w-full text-left min-w-[800px]">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th class="px-6 py-4">Client</th>
            <th class="px-6 py-4">Package</th>
            <th class="px-6 py-4">Date & Time</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4">Payment</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="booking in filteredBookings" :key="booking._id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {{ booking.clientId?.firstName?.charAt(0) || 'C' }}
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">{{ booking.clientId?.firstName }} {{ booking.clientId?.lastName }}</p>
                  <p class="text-xs text-gray-500">{{ booking.clientId?.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-900 font-medium">{{ booking.packageId?.name }}</p>
              <p class="text-xs text-gray-400">{{ booking.packageId?.duration }} mins</p>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-900">{{ formatDate(booking.startTime) }}</p>
              <p class="text-xs text-gray-500">{{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}</p>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="statusClasses[booking.status] || 'bg-gray-100 text-gray-600'"
              >
                {{ booking.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <p class="text-sm font-bold text-gray-900">₦{{ booking.packageId?.price?.toLocaleString() }}</p>
                <span class="text-[10px] uppercase font-bold" :class="booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'">
                   {{ booking.paymentStatus }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
              <div class="flex justify-end gap-2">
                <button
                  @click="viewDetails(booking)"
                  class="p-2 text-gray-400 hover:text-primary transition-colors"
                  title="View Details"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  v-if="booking.status === 'pending'"
                  @click="handleConfirm(booking._id)"
                  :disabled="confirming"
                  class="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-all disabled:opacity-50"
                  title="Confirm Booking"
                >
                  Confirm
                </button>
                <button
                  v-if="booking.status === 'confirmed'"
                  @click="handleComplete(booking._id)"
                  :disabled="completing"
                  class="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                  title="Mark as Completed"
                >
                  Complete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <BookingDetailsModal
      v-model="showDetails"
      :booking="selectedBooking"
      @confirm="handleConfirm"
      @complete="handleComplete"
    />
  </div>
</template>

<script setup lang="ts">
import BookingDetailsModal from '@/components/consultations/BookingDetailsModal.vue'
import { useGetBookings } from '@/composables/modules/consultations/bookings/useGetBookings'
import { useConfirmBooking } from '@/composables/modules/consultations/bookings/useConfirmBooking'
import { useCompleteBooking } from '@/composables/modules/consultations/bookings/useCompleteBooking'

const { bookings, loading, fetchBookings } = useGetBookings()
const { confirmBooking, loading: confirming } = useConfirmBooking()
const { completeBooking, loading: completing } = useCompleteBooking()

const searchQuery = ref('')
const showDetails = ref(false)
const selectedBooking = ref<any>(null)

const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value
  const query = searchQuery.value.toLowerCase()
  return bookings.value.filter(b => 
    b.clientId?.firstName?.toLowerCase().includes(query) || 
    b.clientId?.lastName?.toLowerCase().includes(query) || 
    b.packageId?.name?.toLowerCase().includes(query)
  )
})

const statusClasses: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-blue-50 text-blue-600',
  completed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600'
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (time: string) => {
  if (!time) return ''
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewDetails = (booking: any) => {
  selectedBooking.value = booking
  showDetails.value = true
}

const handleConfirm = async (id: string) => {
  try {
    await confirmBooking(id)
    showDetails.value = false
    await fetchBookings()
  } catch (error) {
    console.error(error)
  }
}

const handleComplete = async (id: string) => {
  try {
    await completeBooking(id)
    showDetails.value = false
    await fetchBookings()
  } catch (error) {
    console.error(error)
  }
}
</script>
