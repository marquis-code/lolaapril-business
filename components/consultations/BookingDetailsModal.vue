<template>
  <UIModal v-model="show" title="Booking Details">
    <div v-if="booking" class="space-y-6">
      <!-- Client Information -->
      <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Client Information</h3>
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
            {{ booking.clientId?.firstName?.charAt(0) || 'C' }}
          </div>
          <div>
            <p class="font-bold text-gray-900 text-lg">{{ booking.clientId?.firstName }} {{ booking.clientId?.lastName }}</p>
            <p class="text-sm text-gray-500">{{ booking.clientId?.email }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-400 font-medium mb-1">Phone Number</p>
            <p class="text-gray-900">{{ booking.clientId?.phone || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-gray-400 font-medium mb-1">Timezone</p>
            <p class="text-gray-900">{{ booking.clientId?.preferences?.timezone || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Package & Session -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Package</h3>
          <p class="font-bold text-gray-900">{{ booking.packageId?.name }}</p>
          <p class="text-sm text-gray-500">{{ booking.packageId?.duration }} mins session</p>
        </div>
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Price</h3>
          <p class="font-bold text-primary text-lg">₦{{ booking.packageId?.price?.toLocaleString() }}</p>
          <p class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1" :class="paymentStatusClasses[booking.paymentStatus]">
            {{ booking.paymentStatus }}
          </p>
        </div>
      </div>

      <!-- Schedule -->
      <div class="border-t border-gray-100 pt-6">
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Schedule</h3>
        <div class="flex items-center gap-4 text-sm">
          <div class="bg-primary/5 p-3 rounded-xl">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="font-bold text-gray-900">{{ formatDate(booking.startTime) }}</p>
            <p class="text-gray-500">{{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}</p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="booking.notes" class="border-t border-gray-100 pt-6">
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Client Notes</h3>
        <p class="text-sm text-gray-700 leading-relaxed bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 italic">
          "{{ booking.notes }}"
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4 border-t border-gray-100">
        <button
          v-if="booking.status === 'pending'"
          @click="$emit('confirm', booking._id)"
          class="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-sm"
        >
          Confirm Booking
        </button>
        <button
          v-if="booking.status === 'confirmed'"
          @click="$emit('complete', booking._id)"
          class="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-all shadow-sm"
        >
          Mark as Completed
        </button>
        <button
          @click="show = false"
          class="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import UIModal from '@/components/ui/Modal.vue'

const props = defineProps<{
  modelValue: boolean
  booking: any
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'complete'])

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const paymentStatusClasses: Record<string, string> = {
  unpaid: 'bg-red-50 text-red-600',
  paid: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-600'
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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
</script>
