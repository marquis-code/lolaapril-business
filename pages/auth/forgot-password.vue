<template>
  <div>
    <div class="mb-8">
      <NuxtLink 
        to="/auth/login" 
        class="inline-flex items-center text-sm font-semibold mb-6 hover:underline"
        style="color: #005967"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to login
      </NuxtLink>
      
      <h2 class="text-2xl font-bold mb-2 text-gray-900">Forgot Password?</h2>
      <p class="text-gray-600">No worries, we'll send you reset instructions</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <UiAnimatedInput 
          v-model="email"
          type="email" 
          required
          :disabled="loading"
          label="Email Address"
        />
        <p class="text-xs text-gray-500 mt-1.5">
          Enter the email address associated with your account
        </p>
      </div>
      
      <button 
        type="submit" 
        :disabled="loading || !email"
        class="w-full text-white font-semibold py-3 text-sm rounded-full hover:opacity-90 focus:ring-4 focus:ring-[#005967]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: #005967"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </span>
        <span v-else>Send Reset Instructions</span>
      </button>
    </form>

    <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #005967">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-green-900 mb-1">Check your email</h3>
          <p class="text-sm text-green-700 mb-3">
            We've sent password reset instructions to <strong>{{ email }}</strong>
          </p>
          <p class="text-xs text-green-600">
            Didn't receive the email? Check your spam folder or 
            <button 
              @click="handleSubmit" 
              :disabled="loading"
              class="underline font-medium hover:no-underline disabled:opacity-50"
            >
              click to resend
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- <div v-if="error" class="mt-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ error }}</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useForgotPassword } from '@/composables/modules/auth/useForgotPassword'
definePageMeta({
  layout: 'auth'
})

const config = useRuntimeConfig()
const email = ref('')
const error = ref('')
const success = ref(false)
const { forgotPassword, loading } = useForgotPassword()

const handleSubmit = async () => {
  await forgotPassword({ email: email.value })
}
</script>