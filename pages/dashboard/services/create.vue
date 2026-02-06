<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/dashboard/services" class="text-gray-500 hover:text-black mb-4 inline-block font-medium">← Back to Services</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Create New Service</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Basic Details -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Basic Details</h2>
        <div class="space-y-4">
          <UiAnimatedInput v-model="form.basicDetails.serviceName" type="text" label="Service Name" required />
          
          <div class="grid grid-cols-2 gap-4">
            <UiSelectInput
              v-model="form.basicDetails.category"
              label="Category"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              placeholder="Select Category"
              required
            />
            <UiAnimatedInput v-model="form.basicDetails.serviceType" type="text" label="Service Type" placeholder="e.g. Haircut" required />
          </div>

          <UiAnimatedInput v-model="form.basicDetails.description" type="textarea" :cols="6" :rows="6" label="Description" />
        </div>
      </section>

      <!-- Pricing -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Pricing</h2>
        <div class="grid grid-cols-3 gap-4">
          <UiSelectInput
            v-model="form.pricingAndDuration.priceType"
            label="Price Type"
            :options="priceTypeOptions"
            option-label="label"
            option-value="value"
          />
          <UiAnimatedInput v-if="form.pricingAndDuration.priceType !== 'Free'" v-model.number="form.pricingAndDuration.price.amount" type="number" label="Amount" />
          <UiAnimatedInput v-if="form.pricingAndDuration.priceType !== 'Free'" v-model="form.pricingAndDuration.price.currency" type="text" label="Currency" />
        </div>
      </section>

      <!-- Duration -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Duration</h2>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-2">Service Time</h3>
            <div class="flex gap-2">
              <UiAnimatedInput v-model.number="form.pricingAndDuration.duration.servicingTime.value" type="number" label="Value" />
              <UiSelectInput
                v-model="form.pricingAndDuration.duration.servicingTime.unit"
                label="Unit"
                :options="durationUnitOptions"
                option-label="label"
                option-value="value"
              />
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-2">Processing Time (Buffer)</h3>
            <div class="flex gap-2">
              <UiAnimatedInput v-model.number="form.pricingAndDuration.duration.processingTime.value" type="number" label="Value" />
              <UiSelectInput
                v-model="form.pricingAndDuration.duration.processingTime.unit"
                label="Unit"
                :options="durationUnitOptions"
                option-label="label"
                option-value="value"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Online Booking -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Online Booking</h2>
        <div class="grid grid-cols-2 gap-6">
          <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input v-model="form.settings.onlineBooking.enabled" type="checkbox" class="custom-checkbox" />
            Enable online booking
          </label>
          <UiSelectInput
            v-model="form.settings.onlineBooking.availableFor"
            label="Available For"
            :options="availableForOptions"
            option-label="label"
            option-value="value"
          />
        </div>
      </section>

      <div class="flex justify-end gap-4 pt-4">
        <NuxtLink to="/dashboard/services" class="px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-70">
          {{ loading ? 'Creating...' : 'Create Service' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CreateServiceDto } from '~/types/service'
import { useCreateService } from '~/composables/modules/service/useCreateService'
import { useFetchCategories } from '~/composables/modules/service/useFetchCategories'

definePageMeta({
  layout: 'dashboard'
})

const { data: categories, execute: fetchCategories } = useFetchCategories()
const { loading, execute: createService } = useCreateService()
const router = useRouter()

onMounted(() => {
  fetchCategories()
})

// Options for selects
const categoryOptions = computed(() => {
  return (categories.value || []).map((cat: any) => ({
    label: cat.categoryName,
    value: cat._id
  }))
})

const priceTypeOptions = [
  { label: 'Fixed', value: 'Fixed' },
  { label: 'From', value: 'From' },
  { label: 'Free', value: 'Free' }
]

const durationUnitOptions = [
  { label: 'min', value: 'min' },
  { label: 'hour', value: 'h' }
]

const availableForOptions = [
  { label: 'All', value: 'All' },
  { label: 'Members', value: 'Members' },
  { label: 'Guests', value: 'Guests' }
]

const form = reactive<CreateServiceDto>({
  basicDetails: {
    serviceName: '',
    serviceType: '',
    category: '',
    description: ''
  },
  teamMembers: {
    allTeamMembers: true,
    selectedMembers: []
  },
  pricingAndDuration: {
    priceType: 'Fixed',
    price: {
      amount: 0,
      currency: 'NGN'
    },
    duration: {
      servicingTime: { value: 30, unit: 'min' },
      processingTime: { value: 0, unit: 'min' },
      totalDuration: '30 min'
    }
  },
  settings: {
    onlineBooking: {
      enabled: true,
      availableFor: 'All'
    }
  }
})

const handleSubmit = async () => {
  try {
    // Ensure numeric values are numbers
    form.pricingAndDuration.price.amount = Number(form.pricingAndDuration.price.amount) || 0
    form.pricingAndDuration.duration.servicingTime.value = Number(form.pricingAndDuration.duration.servicingTime.value) || 0
    form.pricingAndDuration.duration.processingTime.value = Number(form.pricingAndDuration.duration.processingTime.value) || 0

    // Basic duration formatting logic
    const durationVal = form.pricingAndDuration.duration.servicingTime.value
    const durationUnit = form.pricingAndDuration.duration.servicingTime.unit
    form.pricingAndDuration.duration.totalDuration = `${durationVal} ${durationUnit}`

    await createService(form)
    router.push('/dashboard/services')
  } catch (e: any) {
    alert(e.message || 'Failed to create service')
  }
}
</script>
