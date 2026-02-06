<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Business Working Hours</h3>
                <p class="text-sm text-gray-500 mt-1">Set your operating hours for each day of the week</p>
              </div>
              <button
                @click="closeModal"
                class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
              <div class="space-y-4">
                <div
                  v-for="(day, index) in localSchedule"
                  :key="day.day"
                  class="bg-gray-50 rounded-xl p-4 space-y-3"
                >
                  <!-- Day Header -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <input
                        :id="`day-${day.day}`"
                        v-model="day.isOpen"
                        type="checkbox"
                        class="custom-checkbox"
                        @change="handleDayToggle(index)"
                      />
                      <label
                        :for="`day-${day.day}`"
                        class="text-base font-semibold text-gray-900 cursor-pointer"
                      >
                        {{ capitalize(day.day) }}
                      </label>
                    </div>
                    <span
                      v-if="!day.isOpen"
                      class="text-sm text-gray-400 font-medium"
                    >
                      Closed
                    </span>
                  </div>

                  <!-- Time Inputs -->
                  <div v-if="day.isOpen" class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                    <div>
                      <label class="block text-xs font-medium text-gray-600 mb-1">
                        Opening Time
                      </label>
                      <input
                        v-model="day.openTime"
                        type="time"
                        class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                        :required="day.isOpen"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-600 mb-1">
                        Closing Time
                      </label>
                      <input
                        v-model="day.closeTime"
                        type="time"
                        class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                        :required="day.isOpen"
                      />
                    </div>
                  </div>

                  <!-- Breaks Section -->
                  <div v-if="day.isOpen" class="pl-8 space-y-3">
                    <div class="flex items-center justify-between">
                      <label class="text-xs font-medium text-gray-600">
                        Breaks
                      </label>
                      <button
                        @click="addBreak(index)"
                        class="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Break
                      </button>
                    </div>

                    <div
                      v-for="(brk, breakIndex) in day.breaks"
                      :key="breakIndex"
                      class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">
                          Break Start
                        </label>
                        <input
                          v-model="brk.openTime"
                          type="time"
                          class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div class="flex gap-2">
                        <div class="flex-1">
                          <label class="block text-xs font-medium text-gray-600 mb-1">
                            Break End
                          </label>
                          <input
                            v-model="brk.closeTime"
                            type="time"
                            class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div class="flex items-end">
                          <button
                            @click="removeBreak(index, breakIndex)"
                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove break"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="setAllDays(true)"
                    class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Open All Days
                  </button>
                  <button
                    @click="setAllDays(false)"
                    class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close All Days
                  </button>
                  <button
                    @click="setWeekdaysOnly"
                    class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Weekdays Only
                  </button>
                  <button
                    @click="copyToAll"
                    class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Copy Monday to All
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
              <button
                @click="closeModal"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleSave"
                :disabled="loading || !isValid"
                class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Break {
  openTime: string
  closeTime: string
}

interface DaySchedule {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
  breaks: Break[]
}

interface Props {
  open: boolean
  schedule: DaySchedule[]
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', schedule: DaySchedule[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const localSchedule = ref<DaySchedule[]>([])

// Initialize local schedule when modal opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      // Deep copy the schedule
      localSchedule.value = props.schedule.map(day => ({
        ...day,
        breaks: day.breaks ? day.breaks.map(brk => ({ ...brk })) : []
      }))
      
      // If schedule is empty, initialize with default days
      if (localSchedule.value.length === 0) {
        localSchedule.value = [
          'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
        ].map(day => ({
          day,
          isOpen: false,
          openTime: '09:00',
          closeTime: '17:00',
          breaks: []
        }))
      }
    }
  },
  { immediate: true }
)

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const handleDayToggle = (index: number) => {
  const day = localSchedule.value[index]
  if (!day.isOpen) {
    // Clear times when closing
    day.openTime = ''
    day.closeTime = ''
    day.breaks = []
  } else {
    // Set default times when opening
    if (!day.openTime) day.openTime = '09:00'
    if (!day.closeTime) day.closeTime = '17:00'
  }
}

const addBreak = (dayIndex: number) => {
  localSchedule.value[dayIndex].breaks.push({
    openTime: '12:00',
    closeTime: '13:00'
  })
}

const removeBreak = (dayIndex: number, breakIndex: number) => {
  localSchedule.value[dayIndex].breaks.splice(breakIndex, 1)
}

const setAllDays = (isOpen: boolean) => {
  localSchedule.value.forEach(day => {
    day.isOpen = isOpen
    if (isOpen) {
      if (!day.openTime) day.openTime = '09:00'
      if (!day.closeTime) day.closeTime = '17:00'
    } else {
      day.openTime = ''
      day.closeTime = ''
      day.breaks = []
    }
  })
}

const setWeekdaysOnly = () => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  localSchedule.value.forEach(day => {
    day.isOpen = weekdays.includes(day.day)
    if (day.isOpen) {
      if (!day.openTime) day.openTime = '09:00'
      if (!day.closeTime) day.closeTime = '17:00'
    } else {
      day.openTime = ''
      day.closeTime = ''
      day.breaks = []
    }
  })
}

const copyToAll = () => {
  const monday = localSchedule.value.find(d => d.day === 'monday')
  if (!monday) return

  localSchedule.value.forEach(day => {
    if (day.day !== 'monday') {
      day.isOpen = monday.isOpen
      day.openTime = monday.openTime
      day.closeTime = monday.closeTime
      day.breaks = monday.breaks.map(brk => ({ ...brk }))
    }
  })
}

const isValid = computed(() => {
  return localSchedule.value.every(day => {
    if (!day.isOpen) return true
    
    // Check if times are set
    if (!day.openTime || !day.closeTime) return false
    
    // Check if breaks have valid times
    if (day.breaks && day.breaks.length > 0) {
      return day.breaks.every(brk => brk.openTime && brk.closeTime)
    }
    
    return true
  })
})

const handleSave = () => {
  if (!isValid.value) return
  
  // Clean up the schedule before saving
  const cleanedSchedule = localSchedule.value.map(day => ({
    day: day.day,
    isOpen: day.isOpen,
    openTime: day.isOpen ? day.openTime : '',
    closeTime: day.isOpen ? day.closeTime : '',
    breaks: day.isOpen && day.breaks ? day.breaks.filter(brk => brk.openTime && brk.closeTime) : []
  }))
  
  emit('save', cleanedSchedule)
}

const closeModal = () => {
  if (!props.loading) {
    emit('close')
  }
}
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>