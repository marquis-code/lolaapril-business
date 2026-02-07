<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto py-8"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Add New Business</h2>
                <p class="text-sm text-gray-500 mt-1">Create another business under your account</p>
              </div>
              <button
                @click="handleClose"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form Content -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Step Indicator -->
                <div class="flex items-center gap-2 mb-6">
                  <div
                    v-for="step in 3"
                    :key="step"
                    class="flex-1 h-1.5 rounded-full transition-colors"
                    :class="currentStep >= step ? 'bg-primary' : 'bg-gray-200'"
                  />
                </div>

                <!-- Step 1: Business Info -->
                <div v-if="currentStep === 1" class="space-y-5">
                  <h3 class="text-sm font-semibold text-gray-900 mb-4">Business Information</h3>
                  
                  <!-- Business Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Business Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.businessName"
                      type="text"
                      placeholder="e.g., Glow Beauty Salon"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      :class="{ 'border-red-300': errors.businessName }"
                    />
                    <p v-if="errors.businessName" class="text-xs text-red-500 mt-1">{{ errors.businessName }}</p>
                  </div>

                  <!-- Subdomain -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Subdomain <span class="text-red-500">*</span>
                    </label>
                    <div class="flex">
                      <input
                        v-model="form.subdomain"
                        type="text"
                        placeholder="your-business"
                        pattern="[a-z0-9-]+"
                        class="flex-1 px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        :class="{ 
                          'border-red-300': errors.subdomain || subdomainStatus === 'unavailable',
                          'border-green-300': subdomainStatus === 'available'
                        }"
                        :disabled="subdomainLoading"
                        @input="handleSubdomainInput"
                        @blur="checkSubdomainAvailability"
                      />
                      <span class="px-4 py-3 bg-gray-100 text-gray-500 text-sm border border-l-0 border-gray-200 rounded-r-xl">
                        .lolaapril.com
                      </span>
                    </div>
                    
                    <!-- Loading State -->
                    <div v-if="subdomainLoading" class="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                      <svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking availability...
                    </div>
                    
                    <!-- Available State -->
                    <div v-else-if="subdomainStatus === 'available'" class="text-xs text-green-600 mt-1.5 flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span class="font-medium">Available!</span> Your booking page will be: <strong>{{ form.subdomain }}.lolaapril.com</strong>
                    </div>
                    
                    <!-- Unavailable State -->
                    <div v-else-if="subdomainStatus === 'unavailable'" class="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                      <span class="font-medium">This URL is already taken.</span> Please try another.
                    </div>
                    
                    <!-- Error State -->
                    <div v-else-if="errors.subdomain" class="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      {{ errors.subdomain }}
                    </div>
                    
                    <!-- Default helper text -->
                    <p v-else class="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens allowed (minimum 3 characters)</p>
                  </div>

                  <!-- Business Type -->
                  <div>
                    <UiSelectInput
                      v-model="form.businessType"
                      label="Business Type"
                      placeholder="Select business type"
                      :options="businessTypeOptions"
                      :error-message="errors.businessType"
                      :show-error="!!errors.businessType"
                      :has-error="!!errors.businessType"
                    />
                  </div>

                  <!-- Business Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Description <span class="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      v-model="form.businessDescription"
                      rows="3"
                      placeholder="Tell us about your business..."
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <!-- Step 2: Address -->
                <div v-if="currentStep === 2" class="space-y-5">
                  <h3 class="text-sm font-semibold text-gray-900 mb-4">Business Address</h3>
                  
                  <!-- Street -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Street Address <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.address.street"
                      type="text"
                      placeholder="e.g., 123 Main Street"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      :class="{ 'border-red-300': errors['address.street'] }"
                    />
                    <p v-if="errors['address.street']" class="text-xs text-red-500 mt-1">{{ errors['address.street'] }}</p>
                  </div>

                  <!-- City & State -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        City <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.address.city"
                        type="text"
                        placeholder="City"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        :class="{ 'border-red-300': errors['address.city'] }"
                      />
                      <p v-if="errors['address.city']" class="text-xs text-red-500 mt-1">{{ errors['address.city'] }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        State <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.address.state"
                        type="text"
                        placeholder="State"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        :class="{ 'border-red-300': errors['address.state'] }"
                      />
                      <p v-if="errors['address.state']" class="text-xs text-red-500 mt-1">{{ errors['address.state'] }}</p>
                    </div>
                  </div>

                  <!-- Country & Postal Code -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Country <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.address.country"
                        type="text"
                        placeholder="Country"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        :class="{ 'border-red-300': errors['address.country'] }"
                      />
                      <p v-if="errors['address.country']" class="text-xs text-red-500 mt-1">{{ errors['address.country'] }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        v-model="form.address.postalCode"
                        type="text"
                        placeholder="Postal Code"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <!-- Step 3: Contact -->
                <div v-if="currentStep === 3" class="space-y-5">
                  <h3 class="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.contact.primaryPhone"
                      type="tel"
                      placeholder="e.g., +234 800 123 4567"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      :class="{ 'border-red-300': errors['contact.primaryPhone'] }"
                    />
                    <p v-if="errors['contact.primaryPhone']" class="text-xs text-red-500 mt-1">{{ errors['contact.primaryPhone'] }}</p>
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Business Email <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.contact.email"
                      type="email"
                      placeholder="e.g., hello@yourbusiness.com"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      :class="{ 'border-red-300': errors['contact.email'] }"
                    />
                    <p v-if="errors['contact.email']" class="text-xs text-red-500 mt-1">{{ errors['contact.email'] }}</p>
                  </div>

                  <!-- Website -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Website <span class="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      v-model="form.contact.website"
                      type="url"
                      placeholder="e.g., https://yourbusiness.com"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="submitError" class="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p class="text-sm text-red-600">{{ submitError }}</p>
                </div>
              </form>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0 bg-gray-50">
              <button
                v-if="currentStep > 1"
                @click="prevStep"
                type="button"
                class="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Back
              </button>
              <div v-else></div>
              
              <div class="flex items-center gap-3">
                <button
                  @click="handleClose"
                  type="button"
                  class="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  v-if="currentStep < 3"
                  @click="nextStep"
                  type="button"
                  class="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors"
                >
                  Continue
                </button>
                
                <button
                  v-else
                  @click="handleSubmit"
                  type="button"
                  :disabled="submitting"
                  class="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {{ submitting ? 'Creating...' : 'Create Business' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useBusinessManagement } from '@/composables/modules/auth/useBusinessManagement'
import { useCheckSubdomain } from '@/composables/modules/business/useCheckSubdomain'
import type { AddBusinessDto } from '~/types/auth'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success', business: any): void
}>()

const { createNewBusiness, addLoading: submitting } = useBusinessManagement()

// Subdomain checking
const { 
  available: subdomainAvailable, 
  loading: subdomainLoading, 
  error: subdomainApiError, 
  checkDomain 
} = useCheckSubdomain()

const subdomainStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
const subdomainCheckTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const currentStep = ref(1)
const submitError = ref('')

// Business type options for the select
const businessTypeOptions = [
  { label: 'Salon', value: 'salon' },
  { label: 'Spa', value: 'spa' },
  { label: 'Barbershop', value: 'barbershop' },
  { label: 'Beauty Clinic', value: 'beauty_clinic' },
  { label: 'Wellness Center', value: 'wellness_center' },
  { label: 'Other', value: 'other' }
]

const form = reactive<AddBusinessDto>({
  businessName: '',
  subdomain: '',
  businessType: '' as any,
  businessDescription: '',
  address: {
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: ''
  },
  contact: {
    primaryPhone: '',
    email: '',
    website: ''
  }
})

const errors = reactive<Record<string, string>>({})

// Reset form when modal closes
watch(() => props.modelValue, (value: boolean) => {
  if (!value) {
    resetForm()
  }
})

// Watch subdomain availability result
watch(subdomainAvailable, (newValue: boolean | null) => {
  if (newValue === true) {
    subdomainStatus.value = 'available'
  } else if (newValue === false && !subdomainLoading.value && form.subdomain.length >= 3) {
    subdomainStatus.value = 'unavailable'
  }
})

// Methods
const resetForm = () => {
  currentStep.value = 1
  submitError.value = ''
  subdomainStatus.value = 'idle'
  Object.keys(errors).forEach(key => delete errors[key])
  
  form.businessName = ''
  form.subdomain = ''
  form.businessType = '' as any
  form.businessDescription = ''
  form.address = {
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: ''
  }
  form.contact = {
    primaryPhone: '',
    email: '',
    website: ''
  }
}

const handleSubdomainInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Convert to lowercase, remove spaces, and only allow alphanumeric and hyphens
  input.value = input.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  form.subdomain = input.value
  
  // Reset status when typing
  if (form.subdomain.length > 0) {
    subdomainStatus.value = 'idle'
    
    // Clear existing timeout
    if (subdomainCheckTimeout.value) {
      clearTimeout(subdomainCheckTimeout.value)
    }
    
    // Set new timeout to check after user stops typing
    subdomainCheckTimeout.value = setTimeout(() => {
      checkSubdomainAvailability()
    }, 500)
  } else {
    subdomainStatus.value = 'idle'
  }
}

const checkSubdomainAvailability = async () => {
  if (!form.subdomain || form.subdomain.length < 3) {
    subdomainStatus.value = 'idle'
    return
  }

  subdomainStatus.value = 'checking'
  try {
    await checkDomain(form.subdomain)
  } catch (e) {
    // Error is handled by the composable
  }
}

const validateStep = (step: number): boolean => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (step === 1) {
    if (!form.businessName.trim()) {
      errors.businessName = 'Business name is required'
    }
    if (!form.subdomain.trim()) {
      errors.subdomain = 'Subdomain is required'
    } else if (form.subdomain.length < 3) {
      errors.subdomain = 'Subdomain must be at least 3 characters'
    } else if (!/^[a-z0-9-]+$/.test(form.subdomain)) {
      errors.subdomain = 'Only lowercase letters, numbers, and hyphens allowed'
    } else if (subdomainStatus.value === 'unavailable') {
      errors.subdomain = 'This subdomain is already taken'
    } else if (subdomainStatus.value !== 'available') {
      errors.subdomain = 'Please wait for subdomain availability check'
    }
    if (!form.businessType) {
      errors.businessType = 'Please select a business type'
    }
  }
  
  if (step === 2) {
    if (!form.address.street.trim()) {
      errors['address.street'] = 'Street address is required'
    }
    if (!form.address.city.trim()) {
      errors['address.city'] = 'City is required'
    }
    if (!form.address.state.trim()) {
      errors['address.state'] = 'State is required'
    }
    if (!form.address.country.trim()) {
      errors['address.country'] = 'Country is required'
    }
  }
  
  if (step === 3) {
    if (!form.contact.primaryPhone.trim()) {
      errors['contact.primaryPhone'] = 'Phone number is required'
    }
    if (!form.contact.email.trim()) {
      errors['contact.email'] = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.email)) {
      errors['contact.email'] = 'Please enter a valid email'
    }
  }
  
  return Object.keys(errors).length === 0
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  if (!validateStep(currentStep.value)) return
  
  submitError.value = ''
  
  try {
    const result = await createNewBusiness(form)
    emit('success', result)
    emit('update:modelValue', false)
    
    // Optional: Switch to the new business
    if (confirm('Business created successfully! Do you want to switch to this business now?')) {
      window.location.reload()
    }
  } catch (err: any) {
    submitError.value = err.response?.data?.message || err.message || 'Failed to create business. Please try again.'
  }
}
</script>
