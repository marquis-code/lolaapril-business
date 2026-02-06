<template>
  <div>
    <h2 class="text-2xl font-bold mb-2 text-gray-900">Create Your Business Account</h2>
    <p class="text-gray-600 mb-6">Get started with your digital salon in minutes</p>
    
    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Step Indicator -->
      <div class="flex items-center justify-between mb-6">
        <div 
          v-for="(stepItem, idx) in steps" 
          :key="idx"
          class="flex items-center"
          :class="{ 'flex-1': idx < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
              :class="step >= idx + 1 ? 'bg-[#005967] text-white' : 'bg-gray-200 text-gray-500'"
            >
              {{ idx + 1 }}
            </div>
            <span class="ml-2 text-xs font-medium" :class="step >= idx + 1 ? 'text-[#005967]' : 'text-gray-400'">
              {{ stepItem }}
            </span>
          </div>
          <div 
            v-if="idx < steps.length - 1"
            class="flex-1 h-0.5 mx-3"
            :class="step > idx + 1 ? 'bg-[#005967]' : 'bg-gray-200'"
          ></div>
        </div>
      </div>

      <!-- Step 1: Owner Details -->
      <div v-show="step === 1" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <UiAnimatedInput 
              v-model="form.owner.firstName"
              type="text" 
              required
              label="First Name"
            />
          </div>
          <div>
            <UiAnimatedInput 
              v-model="form.owner.lastName"
              label="Last Name"
              type="text" 
              required
            />
          </div>
        </div>

        <div>
          <UiAnimatedInput 
            v-model="form.owner.email"
            type="email" 
            required
            label="Email Address"
          />
        </div>

        <div>
          <UiAnimatedInput 
            v-model="form.owner.phone"
            type="tel" 
            required
            label="Phone Number"
          />
        </div>

        <div>
          <UiAnimatedInput 
            v-model="form.owner.password"
            type="password" 
            required
            minlength="6"
            label="Password"
          />
          <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>
      </div>

      <!-- Step 2: Business Details -->
      <div v-show="step === 2" class="space-y-4">
        <div>
          <UiAnimatedInput 
            v-model="form.businessName"
            type="text" 
            required
            label="Business Name"
          />
        </div>

        <div>
          <div class="flex w-full">
            <input
              v-model="form.subdomain"
              type="text" 
              required
              pattern="[a-z0-9-]+"
              @input="validateSubdomain"
              @blur="checkSubdomain"
              :disabled="subdomainLoading"
              class="py-4 px-4 border-[0.5px] border-r-0 outline-none border-gray-100 bg-white w-full rounded-l-lg outline-none focus:ring-2 focus:ring-[#005967] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <span class="inline-flex items-center px-4 py-4 rounded-r-lg border border-gray-100 bg-gray-50 text-gray-600 text-sm">
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
          <div v-else-if="subdomainError" class="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ subdomainError }}
          </div>
          
          <p class="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens allowed (minimum 3 characters)</p>
        </div>

        <div>
          <UiSelectInput 
            v-model="form.businessType"
            :options="[
              { label: 'Salon', value: 'salon' },
              { label: 'Spa', value: 'spa' },
              { label: 'Barbershop', value: 'barbershop' },
              { label: 'Beauty Clinic', value: 'beauty_clinic' },
              { label: 'Wellness Center', value: 'wellness_center' },
              { label: 'Other', value: 'other' }
            ]"
            label="Business Type"
            required
          />
        </div>

        <div>
          <UiAnimatedInput
            v-model="form.businessDescription"
            label="Business Description (Optional)"
            type="textarea"
            :rows="3"
          />
        </div>
      </div>

      <!-- Step 3: Location & Contact -->
      <div v-show="step === 3" class="space-y-4">
        <div>
          <UiAnimatedInput 
            v-model="form.address.street"
            type="text" 
            required
            label="Street Address"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <UiAnimatedInput 
              v-model="form.address.city"
              type="text" 
              required
              label="City"
            />
          </div>
          <div>
            <UiAnimatedInput 
              v-model="form.address.state"
              type="text" 
              required
              label="State"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <UiAnimatedInput 
              v-model="form.address.country"
              type="text" 
              required
              label="Country"
            />
          </div>
          <div>
            <UiAnimatedInput 
              v-model="form.address.postalCode"
              type="text"
              label="Postal Code (Optional)"
            />
          </div>
        </div>

        <div>
          <UiAnimatedInput 
            v-model="form.contact.primaryPhone"
            type="tel" 
            required
            label="Business Phone"
          />
        </div>

        <div>
          <UiAnimatedInput 
            v-model="form.contact.email"
            type="email" 
            required
            label="Business Email"
          />
        </div>

        <div>
          <UiAnimatedInput 
            v-model="form.contact.website"
            type="url"
            label="Website (Optional)"
          />
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex gap-3 pt-4">
        <button 
          v-if="step > 1"
          type="button"
          @click="step--"
          class="flex-1 px-6 py-3 rounded-full text-sm border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        
        <button 
          v-if="step < 3"
          type="button"
          @click="nextStep"
          :disabled="!canProceed"
          class="flex-1 text-white font-semibold text-sm text-sm py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style="background-color: #005967"
        >
          Continue
        </button>
        
        <button 
          v-else
          type="submit" 
          :disabled="registerLoading || subdomainStatus !== 'available'"
          class="flex-1 text-white font-semibold py-3 text-sm rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style="background-color: #005967"
        >
          <span v-if="registerLoading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
          <span v-else>Create Business Account</span>
        </button>
      </div>
    </form>
    
    <p class="text-center mt-6 text-gray-600 text-sm">
      Already have an account? 
      <NuxtLink to="/auth/login" class="font-semibold hover:underline" style="color: #005967">Sign In</NuxtLink>
    </p>

    <!-- <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useCheckSubdomain } from '@/composables/modules/business/useCheckSubdomain'
import { useRegister } from '@/composables/modules/auth/useRegister'
import type { BusinessRegisterDto } from '~/types/auth'

definePageMeta({
  layout: 'auth'
})

const step = ref(1)
const steps = ['Owner', 'Business', 'Location']
const error = ref('')
const subdomainStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
const subdomainCheckTimeout = ref<NodeJS.Timeout | null>(null)

// Composables
const { 
  available, 
  loading: subdomainLoading, 
  error: subdomainError, 
  checkDomain 
} = useCheckSubdomain()

const { 
  register, 
  loading: registerLoading, 
  error: registerError 
} = useRegister()

// Form data
const form = reactive<BusinessRegisterDto>({
  owner: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  },
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

// Computed
const canProceed = computed(() => {
  if (step.value === 1) {
    return form.owner.firstName && form.owner.lastName && form.owner.email && 
           form.owner.phone && form.owner.password && form.owner.password.length >= 6
  }
  if (step.value === 2) {
    return form.businessName && form.subdomain && form.businessType && 
           subdomainStatus.value === 'available'
  }
  return true
})

// Watch for subdomain availability changes
watch(available, (newValue) => {
  if (newValue === true) {
    subdomainStatus.value = 'available'
  } else if (newValue === false && !subdomainLoading.value && form.subdomain.length >= 3) {
    subdomainStatus.value = 'unavailable'
  }
})

// Watch for register errors
watch(registerError, (newError) => {
  if (newError) {
    error.value = newError
  }
})

// Methods
const validateSubdomain = (e: Event) => {
  const input = e.target as HTMLInputElement
  // Only allow lowercase letters, numbers, and hyphens
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
      checkSubdomain()
    }, 500)
  }
}

const checkSubdomain = async () => {
  if (!form.subdomain || form.subdomain.length < 3) {
    subdomainStatus.value = 'idle'
    return
  }

  subdomainStatus.value = 'checking'
  await checkDomain(form.subdomain)
}

const nextStep = () => {
  if (canProceed.value) {
    step.value++
  }
}

const handleRegister = async () => {
  if (subdomainStatus.value !== 'available') {
    error.value = 'Please choose an available subdomain'
    return
  }

  error.value = ''
  await register(form)
  
  // If registration is successful, the useRegister composable should handle the redirect
  // Otherwise, error will be set through the watch on registerError
}

// Lifecycle
onUnmounted(() => {
  if (subdomainCheckTimeout.value) {
    clearTimeout(subdomainCheckTimeout.value)
  }
})
</script>