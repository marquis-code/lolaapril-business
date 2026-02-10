<template>
  <div>
    <h2 class="text-2xl font-bold mb-2 text-gray-900">Welcome Back</h2>
    <p class="text-gray-600 mb-8">Sign in to manage your beauty business</p>
    
    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <UiAnimatedInput 
          v-model="form.email"
          type="email" 
          required
          label="Email Address"
        />
      </div>
      
      <div>
        <div class="relative">
          <UiAnimatedInput 
            v-model="form.password"
            required
            label="Password"
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
      </div>
      
      <div class="flex items-center justify-between space-x-2 text-sm">
        <label class="flex items-center text-gray-600 cursor-pointer hover:text-gray-800">
          <div class="mr-2">
            <input 
            v-model="rememberMe"
            type="checkbox" 
            class="custom-checkbox"
          >
          </div>
          Remember me
        </label>
        <NuxtLink 
          to="/auth/forgot-password" 
          class="font-semibold hover:underline"
          style="color: #005967"
        >
          Forgot password?
        </NuxtLink>
      </div>
      
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full text-white font-semibold text-sm py-3 rounded-full hover:opacity-90 focus:ring-4 focus:ring-[#005967]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: #005967"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-4 bg-white text-gray-500">New to Lola April?</span>
      </div>
    </div>

    <!-- Register Link -->
    <NuxtLink 
      to="/auth/register"
      class="block w-full text-center text-sm px-6 py-3 rounded-full border-[0.5px] font-semibold hover:bg-gray-50 transition-all"
      style="border-color: #005967; color: #005967"
    >
      Create Business Account
    </NuxtLink>

    <!-- <div v-if="error" class="mt-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <div v-if="success" class="mt-6 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg flex items-start gap-2">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span>{{ success }}</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/modules/auth/useLogin'
import type { BusinessLoginDto } from '~/types/auth'

definePageMeta({
  layout: 'auth'
})

const config = useRuntimeConfig()
const showPassword = ref(false)
const rememberMe = ref(false)
const success = ref('')

const { login, loading, error } = useLogin()

const form = reactive<BusinessLoginDto>({
  email: '',
  password: ''
  // email: 'benita@gmail.com',
  // password: 'Miles1999@'
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  await login(form)

}
</script>