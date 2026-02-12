<template>
  <div class="space-y-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
    <div class="flex justify-between items-center">
      <h4 class="font-medium text-gray-900">Variant Details</h4>
      <button @click="$emit('remove')" type="button" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
    </div>
    
    <UiAnimatedInput v-model="modelValue.variantName" type="text" label="Variant Name" required />
    <UiAnimatedInput v-model="modelValue.variantDescription" type="textarea" :rows="2" label="Variant Description" />
    
    <div class="grid grid-cols-3 gap-4">
      <UiSelectInput
        v-model="modelValue.pricing.priceType"
        label="Price Type"
        :options="priceTypeOptions"
        option-label="label"
        option-value="value"
      />
      <UiAnimatedInput v-if="modelValue.pricing.priceType !== 'Free'" v-model.number="modelValue.pricing.price.amount" type="number" label="Amount" />
      <UiAnimatedInput v-if="modelValue.pricing.priceType !== 'Free'" v-model="modelValue.pricing.price.currency" type="text" label="Currency" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UiAnimatedInput v-model.number="modelValue.pricing.duration.value" type="number" label="Duration" />
      <UiSelectInput
        v-model="modelValue.pricing.duration.unit"
        label="Unit"
        :options="durationUnitOptions"
        option-label="label"
        option-value="value"
      />
    </div>

    <UiAnimatedInput v-model="modelValue.settings!.sku" type="text" label="SKU (Optional)" />
  </div>
</template>

<script setup lang="ts">
import type { ServiceVariant } from '~/types/service'

const props = defineProps<{
  modelValue: ServiceVariant
}>()

const emit = defineEmits(['update:modelValue', 'remove'])

const priceTypeOptions = [
  { label: 'Fixed', value: 'Fixed' },
  { label: 'From', value: 'From' },
  { label: 'Free', value: 'Free' }
]

const durationUnitOptions = [
  { label: 'min', value: 'min' },
  { label: 'hour', value: 'h' }
]
</script>
