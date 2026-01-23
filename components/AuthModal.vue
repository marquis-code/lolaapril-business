
<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.stop
        >
          <div class="relative w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <!-- Close Button -->
            <button
              @click="closeModal"
              class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-700 hover:text-gray-900 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="flex flex-col md:flex-row h-full">
              <!-- Left Side - Form -->
              <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                <div class="max-w-md mx-auto w-full">
                  <!-- Logo -->
                  <div class="mb-8 pt-10">
                    <h2 class="lg:text-2xl text-xl font-bold text-primary-600 mb-2">
                      {{ getTitle }}
                    </h2>
                    <p class="text-gray-600">
                      {{ getSubtitle }}
                    </p>
                  </div>

                  <!-- Error Messages -->
                  <!-- <div v-if="displayError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-800">{{ displayError }}</p>
                  </div> -->

                  <!-- Signup Form -->
                  <form v-if="mode === 'signup'" @submit.prevent="handleSignup" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <UiAnimatedInput
                          id="firstName"
                          v-model="signupForm.firstName"
                          type="text"
                          required
                          label="First Name"
                        />
                      </div>
                      <div>
                        <UiAnimatedInput
                          id="lastName"
                          v-model="signupForm.lastName"
                          type="text"
                          required
                          label="Last Name"
                        />
                      </div>
                    </div>

                    <div>
                      <UiAnimatedInput
                        id="signupEmail"
                        v-model="signupForm.email"
                        type="email"
                        required
                        label="Email"
                      />
                    </div>

                    <div>
                      <UiAnimatedInput
                        id="phone"
                        v-model="signupForm.phone"
                        type="tel"
                        required
                        label="Phone Number"
                      />
                    </div>

                    <div>
                      <UiAnimatedInput
                        id="signupPassword"
                        v-model="signupForm.password"
                        type="password"
                        required
                        label="Password"
                      />
                    </div>

                    <div class="pt-6">
                      <button
                        type="submit"
                        :disabled="registerLoading"
                        class="w-full bg-primary hover:bg-primary-700 text-white text-sm font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {{ registerLoading ? 'Creating Account...' : 'Sign Up' }}
                      </button>
                    </div>

                    <!-- Divider -->
                    <div class="relative my-6">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                      </div>
                      <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <!-- Google Sign In -->
                    <button
                      type="button"
                      @click="handleGoogleAuth"
                      :disabled="googleAuthLoading"
                      
                      class="w-full disabled:cursor-not-allowed disabled:opacity-25 flex items-center justify-center gap-3 bg-white border-[0.5px] border-gray-100 hover:border-gray-100 text-gray-700 font-semibold py-3 rounded-full transition-all"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                       {{ googleAuthLoading ? 'processing..' : 'Continue with Google'   }}
                    </button>

                    <p class="text-center text-sm text-gray-600">
                      Already have an account?
                      <button
                        type="button"
                        @click="switchMode('login')"
                        class="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Sign In
                      </button>
                    </p>
                  </form>

                  <!-- Login Form -->
                  <form v-else-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                      <UiAnimatedInput
                        id="loginEmail"
                        v-model="loginForm.email"
                        type="email"
                        required
                        label="Email"
                      />
                    </div>

                    <div>
                      <UiAnimatedInput
                        id="loginPassword"
                        v-model="loginForm.password"
                        type="password"
                        required
                        label="Password"
                      />
                    </div>

                    <div class="flex items-center justify-between">
                      <label class="flex items-center">
                        <input type="checkbox" v-model="rememberMe" class="custom-checkbox" />
                        <span class="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <button 
                        type="button" 
                        @click="switchMode('forgot')"
                        class="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div class="pt-6">
                      <button
                        type="submit"
                        :disabled="loginLoading"
                        class="w-full bg-primary hover:bg-primary-700 text-white text-sm font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {{ loginLoading ? 'Signing In...' : 'Sign In' }}
                      </button>
                    </div>

                    <!-- Divider -->
                    <div class="relative my-6">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                      </div>
                      <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <!-- Google Sign In -->
                    <button
                      type="button"
                      @click="handleGoogleAuth"
                      :disabled="googleAuthLoading"
                      class="w-full flex disabled:cursor-not-allowed disabled:opacity-25 items-center justify-center gap-3 bg-white border-[0.5px] border-gray-100 hover:border-gray-100 text-gray-700 font-medium py-3 rounded-full transition-all"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                       {{ googleAuthLoading ? 'processing..' : 'Continue with Google' }}
                    </button>

                    <p class="text-center text-sm text-gray-600">
                      Don't have an account?
                      <button
                        type="button"
                        @click="switchMode('signup')"
                        class="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Sign Up
                      </button>
                    </p>
                  </form>

                  <!-- Forgot Password Form -->
                  <form v-else-if="mode === 'forgot'" @submit.prevent="handleForgotPassword" class="space-y-4">
                    <div>
                      <UiAnimatedInput
                        id="forgotEmail"
                        v-model="forgotPasswordForm.email"
                        type="email"
                        required
                        label="Email"
                      />
                    </div>

                    <div v-if="resetEmailSent" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p class="text-sm text-green-800">
                        <svg class="inline w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        Reset code sent! Check your email.
                      </p>
                    </div>

                    <div class="pt-6">
                      <button
                        type="submit"
                        :disabled="forgotLoading"
                        class="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 rounded-full text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {{ forgotLoading ? 'Sending...' : 'Send Reset Code' }}
                      </button>
                    </div>

                    <p class="text-center text-sm text-gray-600">
                      Remember your password?
                      <button
                        type="button"
                        @click="switchMode('login')"
                        class="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Sign In
                      </button>
                    </p>
                  </form>

                  <!-- OTP Verification Form -->
                  <form v-else-if="mode === 'verify-otp'" @submit.prevent="handleVerifyOTP" class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-4 text-center">Enter Verification Code</label>
                      <div class="flex gap-2 justify-center">
                        <input
                          v-for="(digit, index) in otpDigits"
                          :key="index"
                          :ref="el => { if (el) otpInputs[index] = el as HTMLInputElement }"
                          v-model="otpDigits[index]"
                          type="text"
                          inputmode="numeric"
                          maxlength="1"
                          @input="handleOTPInput(index, $event)"
                          @keydown="handleOTPKeydown(index, $event)"
                          @paste="handleOTPPaste"
                          class="w-16 h-14 text-center text-2xl font-bold rounded-lg border-[0.5px] border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                          :class="{ 'border-primary-500': otpDigits[index] }"
                        />
                      </div>
                    </div>

                    <div class="text-center">
                      <p class="text-sm text-gray-600 mb-2">
                        Didn't receive the code?
                      </p>
                      <button
                        v-if="canResend"
                        type="button"
                        @click="handleResendOTP"
                        :disabled="forgotLoading"
                        class="text-sm text-primary-600 hover:text-primary-700 font-semibold disabled:opacity-50"
                      >
                        {{ forgotLoading ? 'Sending...' : 'Resend Code' }}
                      </button>
                      <p v-else class="text-sm text-gray-500">
                        Resend in {{ resendTimer }}s
                      </p>
                    </div>

                    <button
                      type="submit"
                      :disabled="verifyLoading || !isOTPComplete"
                      class="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ verifyLoading ? 'Verifying...' : 'Verify Code' }}
                    </button>

                    <p class="text-center text-sm text-gray-600">
                      <button
                        type="button"
                        @click="switchMode('forgot')"
                        class="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        ← Back to email
                      </button>
                    </p>
                  </form>

                  <!-- Reset Password Form -->
                  <form v-else-if="mode === 'reset-password'" @submit.prevent="handleResetPassword" class="space-y-4">
                    <div>
                      <UiAnimatedInput
                        id="newPassword"
                        v-model="resetPasswordForm.newPassword"
                        type="password"
                        label="New Password"
                        required
                        minlength="8"
                      />
                      <p class="mt-2 text-xs text-gray-500">
                        Must contain at least 8 characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    <div>
                      <UiAnimatedInput
                        id="confirmPassword"
                        v-model="resetPasswordForm.confirmPassword"
                        label="Confirm Password"
                        type="password"
                        required
                        minlength="8"
                      />
                    </div>

                    <div v-if="passwordMismatch" class="p-3.5 bg-red-50 border border-red-50 rounded-xl">
                      <p class="text-xs font-medium text-red-500">Passwords do not match</p>
                    </div>

                    <div class="pt-6">
                      <button
                        type="submit"
                        :disabled="resetLoading || passwordMismatch || !resetPasswordForm.newPassword"
                        class="w-full bg-primary hover:bg-primary-700 text-white text-sm font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {{ resetLoading ? 'Resetting...' : 'Reset Password' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Right Side - Image/Brand -->
              <div class="hidden md:block md:w-1/2 bg-gradient-to-br from-primary to-primary-700 relative overflow-hidden">
                <div class="absolute inset-0 bg-green-striped opacity-10"></div>
                <div class="relative h-full flex flex-col items-center justify-center p-12 text-white">
                  <div class="max-w-md text-center">
                    <div class="mb-6">
                      <svg v-if="mode === 'forgot' || mode === 'verify-otp' || mode === 'reset-password'" class="w-20 h-20 mx-auto text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <svg v-else class="w-20 h-20 mx-auto text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 class="text-3xl font-bold mb-4">
                      {{ mode === 'forgot' || mode === 'verify-otp' || mode === 'reset-password' 
                        ? 'Secure Password Recovery' 
                        : 'Your Wellness Journey Starts Here' }}
                    </h3>
                    <p class="text-lg text-white/90 mb-8">
                      {{ mode === 'forgot' || mode === 'verify-otp' || mode === 'reset-password'
                        ? 'We\'ll help you reset your password securely and get you back to your wellness journey.'
                        : 'Experience luxury spa treatments, expert care, and a sanctuary for your well-being at Lola April Wellness Spa.' }}
                    </p>
                    <ul v-if="mode !== 'forgot' && mode !== 'verify-otp' && mode !== 'reset-password'" class="space-y-3 text-left">
                      <li class="flex items-center">
                        <svg class="w-5 h-5 mr-3 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span>Easy online booking</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="w-5 h-5 mr-3 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span>Expert therapists</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="w-5 h-5 mr-3 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span>Personalized treatments</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRegister } from "@/composables/modules/auth/useRegister"
import { useLogin } from "@/composables/modules/auth/useLogin"
import { useForgotPassword } from "@/composables/modules/auth/useForgotPassword"
import { useResetPassword } from "@/composables/modules/auth/useResetPassword"
import { useVerifyResetPasswordOtp } from "@/composables/modules/auth/useVerifyResetPasswordOTP"
import { useGoogleAuth } from "@/composables/modules/auth/useGoogleAuth"

const props = defineProps<{
  isOpen: boolean
  initialMode?: 'login' | 'signup'
}>()

const emit = defineEmits<{
  close: []
}>()

// Composables
const { loading: loginLoading, login } = useLogin()
const { loading: registerLoading, register } = useRegister()
const { loading: forgotLoading, forgotPassword } = useForgotPassword()
const { loading: resetLoading, resetPassword } = useResetPassword()
const { loading: verifyLoading, verifyResetPasswordOtp } = useVerifyResetPasswordOtp()
const { loginWithGoogle, loading: googleAuthLoading } = useGoogleAuth()

type AuthMode = 'login' | 'signup' | 'forgot' | 'verify-otp' | 'reset-password'

// State
const mode = ref<AuthMode>(props.initialMode || 'signup')
const resetEmailSent = ref(false)
const canResend = ref(false)
const resendTimer = ref(60)
const otpInputs = ref<HTMLInputElement[]>([])
const otpDigits = ref(['', '', '', '', '', ''])
const rememberMe = ref(false)

// Forms
const signupForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: ''
})

const loginForm = ref({
  email: '',
  password: ''
})

const forgotPasswordForm = ref({
  email: ''
})

const resetPasswordForm = ref({
  newPassword: '',
  confirmPassword: ''
})

// Computed
const getTitle = computed(() => {
  switch (mode.value) {
    case 'signup': return 'Create Account'
    case 'login': return 'Welcome Back'
    case 'forgot': return 'Forgot Password'
    case 'verify-otp': return 'Verify Code'
    case 'reset-password': return 'Reset Password'
    default: return 'Welcome'
  }
})

const getSubtitle = computed(() => {
  switch (mode.value) {
    case 'signup': return 'Join Lola April Wellness Spa'
    case 'login': return 'Sign in to your account'
    case 'forgot': return 'Enter your email to receive a reset code'
    case 'verify-otp': return 'Enter the 6-digit code sent to your email'
    case 'reset-password': return 'Create a new password for your account'
    default: return ''
  }
})

const isOTPComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '' && /^\d$/.test(digit))
})

const passwordMismatch = computed(() => {
  return resetPasswordForm.value.newPassword !== '' && 
         resetPasswordForm.value.confirmPassword !== '' &&
         resetPasswordForm.value.newPassword !== resetPasswordForm.value.confirmPassword
})

// const displayError = computed(() => {
//   return loginError.value || registerError.value || forgotError.value || resetError.value || verifyError.value
// })

let resendInterval: NodeJS.Timeout | null = null

// Watch for initialMode changes
watch(() => props.initialMode, (newMode) => {
  if (newMode) {
    mode.value = newMode
  }
})

const closeModal = () => {
  emit('close')
  // Clear timers
  if (resendInterval) {
    clearInterval(resendInterval)
    resendInterval = null
  }
  
  // Reset forms
  setTimeout(() => {
    signupForm.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    }
    loginForm.value = {
      email: '',
      password: ''
    }
    forgotPasswordForm.value = {
      email: ''
    }
    resetPasswordForm.value = {
      newPassword: '',
      confirmPassword: ''
    }
    otpDigits.value = ['', '', '', '', '', '']
    resetEmailSent.value = false
    canResend.value = false
    rememberMe.value = false
    mode.value = props.initialMode || 'signup'
  }, 300)
}

const handleSignup = async () => {
  try {
    await register(signupForm.value)
    closeModal()
    await navigateTo('/book?subdomain=lola-beauty')
  } catch (error) {
    console.error('Signup error:', error)
  }
}

const handleLogin = async () => {
  try {
    await login(loginForm.value)
    closeModal()
    await navigateTo('/book?subdomain=lola-beauty')
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleForgotPassword = async () => {
  try {
    await forgotPassword({ email: forgotPasswordForm.value.email })
    resetEmailSent.value = true
    
    // Move to OTP verification after showing success message
    setTimeout(() => {
      mode.value = 'verify-otp'
      startResendTimer()
      // Focus first OTP input
      nextTick(() => {
        otpInputs.value[0]?.focus()
      })
    }, 2000)
  } catch (error) {
    console.error('Forgot password error:', error)
  }
}

const handleVerifyOTP = async () => {
  try {
    const otp = otpDigits.value.join('')
    
    await verifyResetPasswordOtp({
      email: forgotPasswordForm.value.email,
      otp
    })
    
    // Move to reset password screen
    mode.value = 'reset-password'
  } catch (error) {
    console.error('OTP verification error:', error)
    // Clear OTP on error
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
  }
}

const handleResendOTP = async () => {
  try {
    await forgotPassword({ email: forgotPasswordForm.value.email })
    startResendTimer()
  } catch (error) {
    console.error('Resend OTP error:', error)
  }
}

const handleResetPassword = async () => {
  if (passwordMismatch.value) return
  
  try {
    const otp = otpDigits.value.join('')
    
    await resetPassword({
      email: forgotPasswordForm.value.email,
      otp,
      newPassword: resetPasswordForm.value.newPassword
    })
    
    // Switch to login mode with pre-filled email
    mode.value = 'login'
    loginForm.value.email = forgotPasswordForm.value.email
    
    // Clear the reset password form
    resetPasswordForm.value = {
      newPassword: '',
      confirmPassword: ''
    }
    otpDigits.value = ['', '', '', '', '', '']
  } catch (error) {
    console.error('Reset password error:', error)
  }
}

const handleGoogleAuth = async () => {
  await loginWithGoogle()
}


// Methods
const switchMode = (newMode: AuthMode) => {
  mode.value = newMode
  resetEmailSent.value = false
}

const startResendTimer = () => {
  canResend.value = false
  resendTimer.value = 60
  
  if (resendInterval) {
    clearInterval(resendInterval)
  }
  
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      canResend.value = true
      if (resendInterval) {
        clearInterval(resendInterval)
        resendInterval = null
      }
    }
  }, 1000)
}


const handleOTPInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value
  
  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    otpDigits.value[index] = ''
    input.value = ''
    return
  }
  
  // Take only the last character if multiple entered
  if (value.length > 1) {
    value = value.slice(-1)
  }
  
  otpDigits.value[index] = value
  input.value = value
  
  // Move to next input if value entered
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleOTPKeydown = (index: number, event: KeyboardEvent) => {
  // Move to previous input on backspace if current is empty
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    event.preventDefault()
    otpInputs.value[index - 1]?.focus()
    otpDigits.value[index - 1] = ''
  }
  // Move to next on arrow right
  else if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    otpInputs.value[index + 1]?.focus()
  }
  // Move to previous on arrow left
  else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    otpInputs.value[index - 1]?.focus()
  }
}


const handleOTPPaste = (event: ClipboardEvent) => {
  event.preventDefault()

  const pasteData = event.clipboardData?.getData('text') || ''
  const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('')

  digits.forEach((digit, index) => {
    if (index < 6) {
      otpDigits.value[index] = digit
      if (otpInputs.value[index]) {
        otpInputs.value[index].value = digit
      }
    }
  })

  // Focus the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex(d => !d)
  if (nextEmptyIndex !== -1) {
    otpInputs.value[nextEmptyIndex]?.focus()
  } else {
    otpInputs.value[5]?.focus()
  }
}



// Prevent body scroll when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
  if (resendInterval) {
    clearInterval(resendInterval)
  }
})

// Prevent body scroll when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
  if (resendInterval) {
    clearInterval(resendInterval)
  }
})
</script>