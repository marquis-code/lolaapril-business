<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="mb-6">
      <NuxtLink to="/dashboard/bookings" class="text-gray-500 hover:text-black mb-4 inline-block font-medium">← Back to Bookings</NuxtLink>
      <div class="flex justify-between items-start">
        <h1 class="text-2xl font-bold text-gray-900">Booking Details</h1>
        <div v-if="currentBooking">
          <span 
            class="inline-block px-3 py-1.5 rounded-full text-sm font-medium capitalize"
            :class="getStatusColor(currentBooking.status)"
          >
            {{ currentBooking.status.replace('_', ' ') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>

    <div v-else-if="currentBooking" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Details -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Services -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-100 bg-gray-50">
            <h3 class="font-semibold text-gray-900">Services Requested</h3>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="service in currentBooking.services" :key="service.serviceId" class="p-4 flex justify-between items-center">
               <div class="flex items-center gap-3">
                 <div class="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-xs">S</div>
                 <span class="font-medium text-gray-900">{{ service.serviceName || 'Service' }}</span>
               </div>
               <span class="text-gray-500">{{ formatCurrency(service.price || 0) }}</span>
            </div>
            <div class="p-4 flex justify-between items-center bg-gray-50 font-medium">
              <span>Total Amount</span>
              <span class="text-lg">{{ formatCurrency(currentBooking.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Client Info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div class="p-4 border-b border-gray-100 bg-gray-50">
            <h3 class="font-semibold text-gray-900">Client Information</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs text-gray-500 uppercase tracking-wide">Name</div>
                <div class="font-medium text-gray-900 mt-1">{{ currentBooking.clientName }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                <div class="font-medium text-gray-900 mt-1">{{ currentBooking.clientEmail }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 uppercase tracking-wide">Phone</div>
                <div class="font-medium text-gray-900 mt-1">{{ currentBooking.clientPhone }}</div>
              </div>
            </div>
            
            <div v-if="currentBooking.specialRequests">
               <div class="text-xs text-gray-500 uppercase tracking-wide">Special Requests</div>
               <div class="mt-1 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                 {{ currentBooking.specialRequests }}
               </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Actions -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Actions</h3>
          
          <div class="space-y-3">
            <button 
              v-if="currentBooking.status === 'pending'"
              @click="handleUpdateStatus('confirmed')" 
              class="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800"
            >
              Confirm Booking
            </button>
            <button 
              v-if="['pending', 'confirmed'].includes(currentBooking.status)"
              @click="handleUpdateStatus('cancelled')" 
              class="w-full bg-white text-red-600 border border-red-200 py-2.5 rounded-lg font-medium hover:bg-red-50"
            >
              Cancel Booking
            </button>
            <button 
              v-if="currentBooking.status === 'confirmed'"
              @click="handleUpdateStatus('completed')" 
               class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
            >
              Mark Completed
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Date & Time</h3>
          <div class="flex items-center gap-3 mb-2">
            <span class="text-gray-500">📅</span>
            <span class="font-medium">{{ new Date(currentBooking.preferredDate).toLocaleDateString() }}</span>
          </div>
           <div class="flex items-center gap-3">
            <span class="text-gray-500">⏰</span>
             <span class="font-medium">{{ formatTime(currentBooking.preferredStartTime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooking } from '@/composables/modules/useBooking'
definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const { fetchBookingById, updateStatus, currentBooking, loading } = useBooking()

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await fetchBookingById(id)
  }
})

const handleUpdateStatus = async (status: string) => {
  if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return
  
  try {
    if (currentBooking.value) {
      await updateStatus(currentBooking.value._id, { status })
      // Refresh
      await fetchBookingById(currentBooking.value._id)
    }
  } catch (e: any) {
    alert(e.message || 'Action failed')
  }
}

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

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
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
