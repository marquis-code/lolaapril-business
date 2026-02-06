<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bookings</h1>
        <p class="text-gray-500 mt-1">Manage appointments and reservations.</p>
      </div>
      <!-- Add manual booking button if needed -->
    </div>

    <!-- Stats Overview -->
    <div v-if="stats" class="grid grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div class="text-sm text-gray-500">Total Bookings</div>
        <div class="text-2xl font-bold text-gray-900">{{ stats.total || 0 }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div class="text-sm text-gray-500">Pending</div>
        <div class="text-2xl font-bold text-yellow-600">{{ stats.pending || 0 }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div class="text-sm text-gray-500">Confirmed</div>
        <div class="text-2xl font-bold text-green-600">{{ stats.confirmed || 0 }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div class="text-sm text-gray-500">Cancelled</div>
        <div class="text-2xl font-bold text-red-600">{{ stats.cancelled || 0 }}</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 mb-6">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="activeTab = tab.value"
        class="px-6 py-3 text-sm font-medium border-b-2 transition-colors relative top-[1px]"
        :class="activeTab === tab.value ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>

    <!-- Bookings List -->
    <div v-else class="space-y-4">
      <div v-if="filteredBookings.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <p class="text-gray-500">No bookings found</p>
      </div>
      
      <div v-for="booking in filteredBookings" :key="booking._id" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-black transition-colors">
        <div class="flex justify-between items-start">
          <div class="flex gap-4">
             <div class="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-900 font-bold border border-gray-200">
               <span class="text-xs uppercase text-gray-500">{{ formatDateMonth(booking.preferredDate) }}</span>
               <span class="text-lg">{{ formatDateDay(booking.preferredDate) }}</span>
             </div>
             <div>
               <h3 class="font-semibold text-gray-900">{{ booking.clientName }}</h3>
               <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                 <span>{{ booking.services[0]?.serviceName || 'Unknown Service' }}</span>
                 <span v-if="booking.services.length > 1" class="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">+{{ booking.services.length - 1 }} more</span>
               </div>
               <div class="text-sm text-gray-500 mt-0.5">{{ formatTime(booking.preferredStartTime) }}</div>
             </div>
          </div>
          
          <div class="text-right">
            <span 
              class="inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize mb-2"
              :class="getStatusColor(booking.status)"
            >
              {{ booking.status.replace('_', ' ') }}
            </span>
            <div class="font-medium text-gray-900">{{ formatCurrency(booking.totalAmount, booking.currency) }}</div>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
           <div class="text-sm text-gray-500">ID: #{{ booking._id.slice(-6).toUpperCase() }}</div>
           <NuxtLink :to="`/dashboard/bookings/${booking._id}`" class="text-sm font-medium text-black hover:underline">
             View Details
           </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchBookings } from '@/composables/modules/booking/useFetchBookings'
import { useFetchBookingStats } from '@/composables/modules/booking/useFetchBookingStats'
import { ref, computed, onMounted } from 'vue'
definePageMeta({
  layout: 'dashboard'
})

const { data: bookings, loading: bookingsLoading, execute: fetchBookings } = useFetchBookings()
const { data: stats, execute: fetchStats } = useFetchBookingStats()
const loading = bookingsLoading

const activeTab = ref('all')
const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Today', value: 'today' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

onMounted(() => {
  fetchBookings()
  fetchStats()
})

const filteredBookings = computed(() => {
  if (!bookings.value) return []
  if (activeTab.value === 'all') return bookings.value
  if (activeTab.value === 'today') {
    const today = new Date().toISOString().split('T')[0]
    return bookings.value.filter(b => b.preferredDate.includes(today))
  }
  return bookings.value.filter(b => b.status === activeTab.value)
})

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
    postponed: 'bg-orange-100 text-orange-800'
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

const formatDateMonth = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })
}

const formatDateDay = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).getDate()
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  // Assuming HH:mm format
  const [hours, minutes] = timeStr.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

const formatCurrency = (amount: number, currency = 'NGN') => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount)
}
</script>
