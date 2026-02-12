<template>
  <UIModal v-model="show" :title="isEditing ? 'Edit Package' : 'Create Package'">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. Virtual Skin Analysis"
            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            placeholder="Describe what this package includes..."
            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
            <input
              v-model.number="form.price"
              type="number"
              required
              min="0"
              placeholder="0.00"
              class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
            <input
              v-model.number="form.duration"
              type="number"
              required
              min="1"
              placeholder="30"
              class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="button"
          @click="show = false"
          class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loadingCreate || loadingUpdate"
          class="flex-1 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <CircularLoader v-if="loadingCreate || loadingUpdate" />
          {{ isEditing ? 'Update Package' : 'Create Package' }}
        </button>
      </div>
    </form>
  </UIModal>
</template>

<script setup lang="ts">
import UIModal from '@/components/ui/Modal.vue'
import { useCreatePackage } from '@/composables/modules/consultations/packages/useCreatePackage'
import { useUpdatePackage } from '@/composables/modules/consultations/packages/useUpdatePackage'

const props = defineProps<{
  modelValue: boolean
  packageData?: any
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditing = computed(() => !!props.packageData)

const form = ref({
  name: '',
  description: '',
  price: 0,
  duration: 30
})

const { createPackage, loading: loadingCreate } = useCreatePackage()
const { updatePackage, loading: loadingUpdate } = useUpdatePackage()

watch(() => props.packageData, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name || '',
      description: newVal.description || '',
      price: newVal.price || 0,
      duration: newVal.duration || 30
    }
  } else {
    form.value = {
      name: '',
      description: '',
      price: 0,
      duration: 30
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await updatePackage(props.packageData.id, form.value)
    } else {
      await createPackage(form.value)
    }
    emit('success')
    show.value = false
  } catch (error) {
    console.error(error)
  }
}
</script>
