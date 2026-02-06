<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
        <span class="text-2xl">&times;</span>
      </button>
      <h2 class="text-lg font-semibold mb-4">Edit Business Working Hours</h2>
      <form @submit.prevent="handleSave">
        <div class="space-y-4">
          <div v-for="(day, idx) in localSchedule" :key="day.day" class="border rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium">{{ capitalize(day.day) }}</span>
              <label class="inline-flex items-center gap-2 text-xs">
                <input v-model="day.isOpen" type="checkbox" class="custom-checkbox" />
                Open
              </label>
            </div>
            <div v-if="day.isOpen" class="space-y-2">
              <div class="flex gap-2 items-center">
                <UiAnimatedInput v-model="day.openTime" type="time" label="Open" />
                <UiAnimatedInput v-model="day.closeTime" type="time" label="Close" />
              </div>
              <div>
                <div v-for="(brk, bIdx) in day.breaks" :key="bIdx" class="flex gap-2 items-center mt-2">
                  <UiAnimatedInput v-model="brk.openTime" type="time" label="Start" />
                  <span>-</span>
                  <UiAnimatedInput v-model="brk.closeTime" type="time" label="End" />
                  <button type="button" @click="removeBreak(idx, bIdx)" class="text-xs text-red-500 ml-2">Remove</button>
                </div>
                <button type="button" @click="addBreak(idx)" class="text-xs text-primary font-semibold mt-2">+ Add Break</button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-6 gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200">Cancel</button>
          <button type="submit" :disabled="loading" class="px-6 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60">
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  open: boolean
  schedule: any[]
  loading?: boolean
}>()
const emit = defineEmits(['close', 'save'])

const localSchedule = ref<any[]>([])

watch(() => props.schedule, (val) => {
  localSchedule.value = val ? JSON.parse(JSON.stringify(val)) : []
}, { immediate: true })

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const addBreak = (dayIdx: number) => {
  localSchedule.value[dayIdx].breaks.push({ openTime: '', closeTime: '' })
}
const removeBreak = (dayIdx: number, breakIdx: number) => {
  localSchedule.value[dayIdx].breaks.splice(breakIdx, 1)
}

const handleSave = () => {
  emit('save', JSON.parse(JSON.stringify(localSchedule.value)))
}
</script>
