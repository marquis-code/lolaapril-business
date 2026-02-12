<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Weekly Schedule</h2>
        <p class="text-sm text-gray-500">Set your consultation hours for each day of the week.</p>
      </div>
      <button
        @click="handleSave"
        :disabled="saving"
        class="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50"
      >
        <CircularLoader v-if="saving" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 7" :key="i" class="h-20 bg-gray-50 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(day, index) in schedule"
        :key="index"
        class="bg-white border border-gray-100 rounded-2xl p-6 transition-all"
        :class="{ 'opacity-60 bg-gray-50/50': !day.isOpen }"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4 w-40">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="day.isOpen" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span class="font-bold text-gray-900 uppercase tracking-wider text-sm">{{ dayNames[day.dayOfWeek] }}</span>
          </div>

          <div v-if="day.isOpen" class="flex-1 space-y-3">
            <div v-for="(slot, slotIndex) in day.timeSlots" :key="slotIndex" class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <input
                  v-model="slot.startTime"
                  type="time"
                  class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                />
                <span class="text-gray-400">to</span>
                <input
                  v-model="slot.endTime"
                  type="time"
                  class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                />
              </div>
              <button
                @click="removeSlot(index, slotIndex)"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button
              @click="addSlot(index)"
              class="text-primary text-sm font-semibold flex items-center gap-1 hover:underline px-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add time slot
            </button>
          </div>
          <div v-else class="flex-1 py-2 italic text-gray-400 text-sm">
            Closed for the day
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetAvailability } from '@/composables/modules/consultations/availability/useGetAvailability'
import { useUpdateAvailability } from '@/composables/modules/consultations/availability/useUpdateAvailability'

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const { availability, loading, fetchAvailability } = useGetAvailability()
const { updateAvailability, loading: saving } = useUpdateAvailability()

const schedule = ref<any[]>([])

const initializeDefaultSchedule = () => {
  schedule.value = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    isOpen: true,
    timeSlots: [{ startTime: '09:00', endTime: '17:00' }]
  }))
}

watch(availability, (newVal) => {
  if (newVal && newVal.weeklySchedule) {
    schedule.value = JSON.parse(JSON.stringify(newVal.weeklySchedule))
  } else if (!loading.value) {
    initializeDefaultSchedule()
  }
}, { immediate: true })

const addSlot = (dayIndex: number) => {
  schedule.value[dayIndex].timeSlots.push({ startTime: '09:00', endTime: '17:00' })
}

const removeSlot = (dayIndex: number, slotIndex: number) => {
  schedule.value[dayIndex].timeSlots.splice(slotIndex, 1)
  if (schedule.value[dayIndex].timeSlots.length === 0) {
    schedule.value[dayIndex].isOpen = false
  }
}

const handleSave = async () => {
  try {
    await updateAvailability({ weeklySchedule: schedule.value })
    await fetchAvailability()
  } catch (error) {
    console.error(error)
  }
}
</script>
