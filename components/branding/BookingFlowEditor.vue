<template>
  <div class="space-y-6">
    <!-- Booking Flow Type -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Booking Flow</h3>
        <p class="text-sm text-gray-500">Choose the order of steps in the booking process</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          @click="bookingFlow.flow = 'service-first'"
          :class="[
            'p-4 rounded-xl border-2 text-left transition-all',
            bookingFlow.flow === 'service-first' 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex flex-col items-center text-center">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
              bookingFlow.flow === 'service-first' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            ]">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p class="font-medium text-gray-900 mb-1">Service First</p>
            <div class="flex items-center gap-1 text-xs text-gray-400 flex-wrap justify-center">
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Service</span>
              <span>→</span>
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Staff</span>
              <span>→</span>
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Time</span>
            </div>
          </div>
        </button>

        <button
          @click="bookingFlow.flow = 'date-first'"
          :class="[
            'p-4 rounded-xl border-2 text-left transition-all',
            bookingFlow.flow === 'date-first' 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex flex-col items-center text-center">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
              bookingFlow.flow === 'date-first' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            ]">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="font-medium text-gray-900 mb-1">Date First</p>
            <div class="flex items-center gap-1 text-xs text-gray-400 flex-wrap justify-center">
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Date</span>
              <span>→</span>
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Service</span>
              <span>→</span>
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Time</span>
            </div>
          </div>
        </button>

        <button
          @click="bookingFlow.flow = 'staff-first'"
          :class="[
            'p-4 rounded-xl border-2 text-left transition-all',
            bookingFlow.flow === 'staff-first' 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex flex-col items-center text-center">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
              bookingFlow.flow === 'staff-first' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            ]">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p class="font-medium text-gray-900 mb-1">Staff First</p>
            <div class="flex items-center gap-1 text-xs text-gray-400 flex-wrap justify-center">
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Staff</span>
              <span>→</span>
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Service</span>
              <span>→</span>
              <span class="px-1.5 py-0.5 rounded bg-gray-100">Time</span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Staff Selection -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Staff Selection</h3>
        <p class="text-sm text-gray-500">Configure how clients choose staff members</p>
      </div>
      
      <!-- Booking Mode Selector -->
      <div class="mb-6 p-4 bg-gray-50 rounded-xl">
        <p class="text-sm font-medium text-gray-700 mb-3">Booking Mode</p>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="bookingFlow.showStaffSelection = false"
            :class="[
              'p-4 rounded-xl border-2 text-left transition-all',
              !bookingFlow.showStaffSelection
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', !bookingFlow.showStaffSelection ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600']">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Book the Business</p>
                <p class="text-xs text-gray-500">Any available staff assigned automatically</p>
              </div>
            </div>
          </button>
          <button
            @click="bookingFlow.showStaffSelection = true"
            :class="[
              'p-4 rounded-xl border-2 text-left transition-all',
              bookingFlow.showStaffSelection
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', bookingFlow.showStaffSelection ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600']">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Choose Staff</p>
                <p class="text-xs text-gray-500">Clients can select their preferred staff</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <div v-if="bookingFlow.showStaffSelection" class="space-y-4">
        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Require Staff Selection</p>
            <p class="text-sm text-gray-500">Make staff selection mandatory (no "Any Available" option)</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.requireStaffSelection" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>

        <div v-if="!bookingFlow.requireStaffSelection" class="p-4 bg-blue-50 rounded-xl">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-blue-900">Any Available Option Enabled</p>
              <p class="text-xs text-blue-700">Clients will see an "Any Available" option to let the system automatically assign staff</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="p-4 bg-green-50 rounded-xl">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-green-900">Business Booking Mode</p>
            <p class="text-xs text-green-700">Staff selection step will be skipped. The system will automatically assign available staff based on their schedule.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Style & Progress -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Booking UI Style</h3>
        <p class="text-sm text-gray-500">Customize the booking interface appearance</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Booking Style -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Booking Style</label>
          <select 
            v-model="bookingFlow.style"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="stepped">Stepped (Multi-page)</option>
            <option value="single">Single Page</option>
            <option value="compact">Compact</option>
          </select>
        </div>

        <!-- Confirmation Style -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Confirmation Style</label>
          <select 
            v-model="bookingFlow.confirmationStyle"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="modal">Modal Popup</option>
            <option value="page">Dedicated Page</option>
            <option value="inline">Inline Confirmation</option>
          </select>
        </div>
      </div>

      <div class="mt-4">
        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Show Progress Indicator</p>
            <p class="text-sm text-gray-500">Display step progress during booking</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.showProgress" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>
      </div>
    </div>

    <!-- Booking Options -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Booking Options</h3>
        <p class="text-sm text-gray-500">Configure booking behavior</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Guest Booking</p>
            <p class="text-sm text-gray-500">Allow booking without account</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.allowGuestBooking" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>

        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Multiple Services</p>
            <p class="text-sm text-gray-500">Allow booking multiple services at once</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.allowMultipleServices" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>

        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Show Service Images</p>
            <p class="text-sm text-gray-500">Display images in service selection</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.showServiceImages" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>

        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Show Available Slots</p>
            <p class="text-sm text-gray-500">Display availability on date selection</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.showAvailableSlots" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>

        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Show Policies</p>
            <p class="text-sm text-gray-500">Display cancellation & booking policies</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.showPolicies" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>
      </div>
    </div>

    <!-- Required Fields -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Required Information</h3>
        <p class="text-sm text-gray-500">Configure required customer details</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Require Phone</p>
            <p class="text-sm text-gray-500">Clients must provide phone number</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.requirePhone" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>

        <label class="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div>
            <p class="font-medium text-gray-900">Require Email</p>
            <p class="text-sm text-gray-500">Clients must provide email address</p>
          </div>
          <input type="checkbox" v-model="bookingFlow.requireEmail" class="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5" />
        </label>
      </div>
    </div>

    <!-- Date & Time Settings -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Date & Time Settings</h3>
        <p class="text-sm text-gray-500">Configure scheduling options</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Date Picker Style -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Date Picker Style</label>
          <select 
            v-model="bookingFlow.datePickerStyle"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="calendar">Calendar View</option>
            <option value="list">Date List</option>
            <option value="horizontal">Horizontal Scroll</option>
          </select>
        </div>

        <!-- Slot Duration -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Time Slot Duration</label>
          <select 
            v-model="bookingFlow.slotDuration"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option :value="15">15 minutes</option>
            <option :value="30">30 minutes</option>
            <option :value="60">60 minutes</option>
          </select>
        </div>

        <!-- Advance Booking Days -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Advance Booking (days)</label>
          <input 
            type="number" 
            v-model.number="bookingFlow.advanceBookingDays"
            min="1"
            max="365"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          />
          <p class="text-xs text-gray-500">How far in advance clients can book</p>
        </div>

        <!-- Minimum Advance Hours -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Minimum Notice (hours)</label>
          <input 
            type="number" 
            v-model.number="bookingFlow.minAdvanceHours"
            min="0"
            max="168"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          />
          <p class="text-xs text-gray-500">Minimum hours before appointment</p>
        </div>
      </div>
    </div>

    <!-- Social Proof -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Social Proof</h3>
        <p class="text-sm text-gray-500">Build trust with social proof elements</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="socialProof.showReviewCount" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Review Count</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="socialProof.showAverageRating" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Average Rating</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="socialProof.showTotalBookings" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Total Bookings</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="socialProof.showBadges" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Trust Badges</p>
          </div>
        </label>
      </div>

      <!-- Trust Badges Management -->
      <div v-if="socialProof.showBadges" class="mt-6 space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">Custom Badges</label>
          <button
            @click="addBadge"
            class="text-sm text-primary hover:text-primary/80 font-medium"
          >
            + Add Badge
          </button>
        </div>
        
        <div v-if="socialProof.badges?.length" class="flex flex-wrap gap-2">
          <div 
            v-for="(badge, index) in socialProof.badges" 
            :key="index"
            class="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full"
          >
            <span class="text-sm text-primary font-medium">{{ badge }}</span>
            <button
              @click="removeBadge(index)"
              class="text-primary/60 hover:text-primary"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="showBadgeInput" class="flex items-center gap-2">
          <input 
            v-model="newBadgeText"
            type="text"
            placeholder="e.g., Top Rated, 5+ Years Experience"
            class="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm"
            @keyup.enter="saveBadge"
          />
          <button
            @click="saveBadge"
            class="px-4 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            Add
          </button>
          <button
            @click="showBadgeInput = false; newBadgeText = ''"
            class="px-4 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <p class="text-xs text-gray-500">Add badges like "Top Rated", "Verified Business", "Premium Salon"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BookingFlowSettings, SocialProofSettings } from '@/types/branding'

const props = defineProps<{
  bookingFlow: BookingFlowSettings
  socialProof: SocialProofSettings
}>()

const showBadgeInput = ref(false)
const newBadgeText = ref('')

const addBadge = () => {
  showBadgeInput.value = true
}

const saveBadge = () => {
  if (newBadgeText.value.trim()) {
    if (!props.socialProof.badges) {
      props.socialProof.badges = []
    }
    props.socialProof.badges.push(newBadgeText.value.trim())
    newBadgeText.value = ''
    showBadgeInput.value = false
  }
}

const removeBadge = (index: number) => {
  props.socialProof.badges?.splice(index, 1)
}
</script>
