<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-2">
      <button @click="prevMonth" class="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
      <div class="font-semibold text-lg">{{ monthYearLabel }}</div>
      <button @click="nextMonth" class="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 mb-1">
      <div v-for="d in daysOfWeek" :key="d">{{ d }}</div>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <div v-for="(cell, idx) in calendarCells" :key="idx"
           class="h-16 border rounded flex flex-col items-center justify-start cursor-pointer hover:bg-blue-50"
           :class="{ 'bg-blue-100': isToday(cell.date), 'opacity-50': !cell.inMonth }"
           @click="cell.inMonth && $emit('select-date', cell.date)">
        <div class="text-xs mt-1">{{ cell.day }}</div>
        <div v-if="cell.hasSlots" class="mt-1 w-2 h-2 rounded-full bg-primary"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  year?: number
  month?: number
  slotsByDate?: Record<string, { hasSlots: boolean } & Record<string, any>>
}>()
const emit = defineEmits(['update:year', 'update:month', 'select-date'])

const currentYear = ref(props.year)
const currentMonth = ref(props.month)

watch(() => props.year, v => currentYear.value = v)
watch(() => props.month, v => currentMonth.value = v)

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthYearLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value)
  return d.toLocaleString('default', { month: 'long', year: 'numeric' })
})

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const days = daysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const cells: Array<{ day: number; date: string; inMonth: boolean; hasSlots: boolean }> = []
  // Previous month's trailing days
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const prevMonthDays = daysInMonth(prevYear, prevMonth)
  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDays - firstDay + i + 1
    const date = new Date(prevYear, prevMonth, day)
    cells.push({
      day,
      date: date.toISOString().slice(0, 10),
      inMonth: false,
      hasSlots: false
    })
  }
  // Current month days
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d)
    const dateStr = date.toISOString().slice(0, 10)
    cells.push({
      day: d,
      date: dateStr,
      inMonth: true,
      hasSlots: !!props.slotsByDate?.[dateStr]?.hasSlots
    })
  }
  // Next month's leading days
  const total = cells.length
  for (let i = 1; total + i <= 42; i++) {
    const date = new Date(year, month + 1, i)
    cells.push({
      day: i,
      date: date.toISOString().slice(0, 10),
      inMonth: false,
      hasSlots: false
    })
  }
  return cells
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  emit('update:year', currentYear.value)
  emit('update:month', currentMonth.value)
}
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  emit('update:year', currentYear.value)
  emit('update:month', currentMonth.value)
}
function isToday(dateStr: string) {
  const today = new Date()
  return dateStr === today.toISOString().slice(0, 10)
}
// Export for Nuxt auto-import
export default {}
</script>

<style scoped>
/* Add custom styles as needed */
</style>
