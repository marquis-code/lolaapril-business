<template>
  <div>
    <div class="mb-8">
      <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4" style="background-color: rgba(0, 89, 103, 0.1)">
        <svg class="w-6 h-6" style="color: #005967" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold mb-2 text-gray-900">Set New Password</h2>
      <p class="text-gray-600">Your new password must be different from previously used passwords</p>
    </div>
    
    <form @submit.prevent="handleResetPassword" class="space-y-5">
      <div>
        <div class="relative">
          <UiAnimatedInput 
            v-model="form.password"
            required
            minlength="6"
            :disabled="loading"
            label="New Password"
            @input="validatePassword"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        
        <!-- Password Strength Indicator -->
        <div class="mt-2">
          <div class="flex gap-1 mb-1.5">
            <div 
              class="h-1 flex-1 rounded-full transition-all"
              :class="passwordStrength >= 1 ? strengthColor : 'bg-gray-200'"
            ></div>
            <div 
              class="h-1 flex-1 rounded-full transition-all"
              :class="passwordStrength >= 2 ? strengthColor : 'bg-gray-200'"
            ></div>
            <div 
              class="h-1 flex-1 rounded-full transition-all"
              :class="passwordStrength >= 3 ? strengthColor : 'bg-gray-200'"
            ></div>
            <div 
              class="h-1 flex-1 rounded-full transition-all"
              :class="passwordStrength >= 4 ? strengthColor : 'bg-gray-200'"
            ></div>
          </div>
          <p class="text-xs" :class="strengthTextClass">
            {{ strengthText }}
          </p>
        </div>
      </div>

      <div>
        <div class="relative">
          <UiAnimatedInput 
            v-model="form.confirmPassword"
            required
            :disabled="loading"
            label="Confirm New Password"
            @input="checkPasswordMatch"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="passwordMismatch" class="text-xs text-red-600 mt-1.5">
          Passwords do not match
        </p>
        <p v-else-if="form.confirmPassword" class="text-xs text-green-600 mt-1.5 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Passwords match
        </p>
      </div>

      <!-- Password Requirements -->
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
        <ul class="space-y-1.5">
          <li class="flex items-center gap-2 text-sm" :class="requirements.minLength ? 'text-green-600' : 'text-gray-500'">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="requirements.minLength" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              <circle v-else cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
            At least 6 characters
          </li>
          <li class="flex items-center gap-2 text-sm" :class="requirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="requirements.hasUpperCase" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              <circle v-else cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
            One uppercase letter
          </li>
          <li class="flex items-center gap-2 text-sm" :class="requirements.hasNumber ? 'text-green-600' : 'text-gray-500'">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="requirements.hasNumber" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              <circle v-else cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
            One number
          </li>
        </ul>
      </div>
      
      <button 
        type="submit" 
        :disabled="loading || !isFormValid"
        class="w-full text-white font-semibold py-3 text-sm rounded-full hover:opacity-90 focus:ring-4 focus:ring-[#005967]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: #005967"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Resetting Password...
        </span>
        <span v-else>Reset Password</span>
      </button>
    </form>

    <!-- <div v-if="error" class="mt-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ error }}</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useResetPassword } from '@/composables/modules/auth/useResetPassword'
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const config = useRuntimeConfig()

const resetToken = ref(route.query.token as string || '')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const passwordMismatch = ref(false)
const { resetPassword, loading } = useResetPassword()  

const form = reactive({
  password: '',
  confirmPassword: ''
})

const requirements = reactive({
  minLength: false,
  hasUpperCase: false,
  hasNumber: false
})

const passwordStrength = computed(() => {
  let strength = 0
  if (requirements.minLength) strength++
  if (requirements.hasUpperCase) strength++
  if (requirements.hasNumber) strength++
  if (form.password.length >= 10) strength++
  return strength
})

const strengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'bg-red-500'
  if (passwordStrength.value === 2) return 'bg-yellow-500'
  if (passwordStrength.value === 3) return 'bg-blue-500'
  return 'bg-green-500'
})

const strengthTextClass = computed(() => {
  if (passwordStrength.value <= 1) return 'text-red-600'
  if (passwordStrength.value === 2) return 'text-yellow-600'
  if (passwordStrength.value === 3) return 'text-blue-600'
  return 'text-green-600'
})

const strengthText = computed(() => {
  if (!form.password) return 'Enter a password'
  if (passwordStrength.value <= 1) return 'Weak password'
  if (passwordStrength.value === 2) return 'Fair password'
  if (passwordStrength.value === 3) return 'Good password'
  return 'Strong password'
})

const isFormValid = computed(() => {
  return form.password.length >= 6 && 
         form.password === form.confirmPassword &&
         requirements.minLength &&
         requirements.hasUpperCase &&
         requirements.hasNumber
})

const validatePassword = () => {
  const password = form.password
  requirements.minLength = password.length >= 6
  requirements.hasUpperCase = /[A-Z]/.test(password)
  requirements.hasNumber = /[0-9]/.test(password)
  
  if (form.confirmPassword) {
    checkPasswordMatch()
  }
}

const checkPasswordMatch = () => {
  passwordMismatch.value = form.confirmPassword.length > 0 && form.password !== form.confirmPassword
}

const handleResetPassword = async () => {
  if (!isFormValid.value) {
    error.value = 'Please ensure your password meets all requirements and both passwords match'
    return
  }
  
  await resetPassword({
      email: resetToken.value,
      otp: '', // You might need to adjust this based on your actual payload structure
      newPassword: form.password
    })
}

onMounted(() => {
  // Redirect if no token provided
  if (!resetToken.value) {
    navigateTo('/auth/forgot-password')
  }
})
</script>