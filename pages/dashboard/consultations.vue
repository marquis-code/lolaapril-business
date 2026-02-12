<template>
  <main class="container mx-auto px-6 py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Consultation Management</h1>
        <p class="text-gray-500 text-sm">Manage your consultation packages, availability, and bookings.</p>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-100 mb-8">
      <div class="flex gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-4 text-sm font-medium transition-all relative"
          :class="activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.name }}
          <div
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          ></div>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="transition-all duration-300">
      <div v-if="activeTab === 'packages'" class="animate-in fade-in slide-in-from-bottom-4">
        <PackageList />
      </div>
      <div v-if="activeTab === 'availability'" class="animate-in fade-in slide-in-from-bottom-4">
        <AvailabilitySchedule />
      </div>
      <div v-if="activeTab === 'bookings'" class="animate-in fade-in slide-in-from-bottom-4">
        <BookingList />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import PackageList from '@/components/consultations/PackageList.vue'
import AvailabilitySchedule from '@/components/consultations/AvailabilitySchedule.vue'
import BookingList from '@/components/consultations/BookingList.vue'

definePageMeta({
  layout: 'dashboard'
})

const activeTab = ref('packages')

const tabs = [
  { id: 'packages', name: 'Consultation Packages' },
  { id: 'availability', name: 'Weekly Schedule' },
  { id: 'bookings', name: 'Bookings' }
]
</script>

<style scoped>
.animate-in {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
