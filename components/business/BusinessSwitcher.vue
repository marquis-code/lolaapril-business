<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all w-full"
      :class="{ 'bg-gray-100': isOpen }"
    >
      <!-- Business Avatar -->
      <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span class="text-primary font-semibold text-sm">
          {{ currentBusinessInitials }}
        </span>
      </div>
      
      <!-- Business Info -->
      <div class="flex-1 min-w-0 text-left">
        <p class="text-sm font-semibold text-gray-900 truncate">
          {{ currentBusiness?.businessName || 'Select Business' }}
        </p>
        <p class="text-xs text-gray-500 truncate">
          {{ currentBusiness?.subdomain ? `${currentBusiness.subdomain}.lolaapril.com` : 'No business selected' }}
        </p>
      </div>
      
      <!-- Dropdown Arrow -->
      <svg
        class="w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Your Businesses</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-4 text-center">
          <div class="inline-flex items-center gap-2 text-gray-500 text-sm">
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Loading...
          </div>
        </div>

        <!-- Business List -->
        <div v-else class="max-h-[280px] overflow-y-auto">
          <button
            v-for="business in businesses"
            :key="business.id"
            @click="handleSwitchBusiness(business.id)"
            class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            :class="{
              'bg-primary/5 border-l-4 border-primary': business.isCurrent,
              'border-l-4 border-transparent': !business.isCurrent
            }"
            :disabled="switchingTo === business.id"
          >
            <!-- Business Avatar -->
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="business.isCurrent ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
            >
              <span class="text-xs font-semibold">{{ getInitials(business.businessName) }}</span>
            </div>
            
            <!-- Business Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-gray-900 truncate">{{ business.businessName }}</p>
                <span
                  v-if="business.isOwner"
                  class="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded"
                >
                  Owner
                </span>
              </div>
              <p class="text-xs text-gray-500 truncate">{{ business.subdomain }}.lolaapril.com</p>
            </div>
            
            <!-- Status Indicator -->
            <div v-if="switchingTo === business.id" class="flex-shrink-0">
              <svg class="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
            <div v-else-if="business.isCurrent" class="flex-shrink-0">
              <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>

          <!-- Empty State -->
          <div v-if="businesses.length === 0 && !loading" class="p-6 text-center">
            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p class="text-sm text-gray-600">No businesses found</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="border-t border-gray-100 p-2 bg-gray-50">
          <button
            @click="handleAddBusiness"
            class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
          >
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Add New Business
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBusinessManagement } from '@/composables/modules/auth/useBusinessManagement'

const emit = defineEmits<{
  (e: 'add-business'): void
}>()

const {
  businesses,
  currentBusiness,
  fetchLoading: loading,
  switchToBusiness,
  refreshBusinesses
} = useBusinessManagement()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const switchingTo = ref<string | null>(null)

// Computed
const currentBusinessInitials = computed(() => {
  if (!currentBusiness.value?.businessName) return 'B'
  return getInitials(currentBusiness.value.businessName)
})

// Methods
const getInitials = (name: string) => {
  if (!name) return 'B'
  const words = name.trim().split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    refreshBusinesses()
  }
}

const handleSwitchBusiness = async (businessId: string) => {
  if (switchingTo.value || currentBusiness.value?.id === businessId) return
  
  try {
    switchingTo.value = businessId
    await switchToBusiness(businessId)
    isOpen.value = false
    // Refresh the page to load new business data
    window.location.reload()
  } catch (err) {
    console.error('Failed to switch business:', err)
  } finally {
    switchingTo.value = null
  }
}

const handleAddBusiness = () => {
  isOpen.value = false
  emit('add-business')
}

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  refreshBusinesses()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
