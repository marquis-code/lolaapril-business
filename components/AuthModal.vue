<!-- components/AuthModal.vue -->
<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="closeModal"
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
                  <div class="mb-8">
                    <h2 class="lg:text-3xl text-xl font-bold text-primary-600 mb-2">
                      {{ getTitle }}
                    </h2>
                    <p class="text-gray-600">
                      {{ getSubtitle }}
                    </p>
                  </div>

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

                    <button
                      type="submit"
                      :disabled="loading"
                      class="w-full bg-primary hover:bg-primary-700 text-white text-sm font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ loading ? 'Creating Account...' : 'Sign Up' }}
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
                        <input type="checkbox" class="custom-checkbox" />
                        <span class="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <button 
                        type="button" 
                        @click="switchMode('forgot')"
                        class="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      :disabled="loading"
                      class="w-full bg-primary hover:bg-primary-700 text-white text-sm font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ loading ? 'Signing In...' : 'Sign In' }}
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

                    <button
                      type="submit"
                      :disabled="loading"
                      class="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ loading ? 'Sending...' : 'Send Reset Code' }}
                    </button>

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
                  <form v-else-if="mode === 'verify-otp'" @submit.prevent="handleVerifyOTP" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">Enter Verification Code</label>
                      <div class="flex gap-2 justify-center">
                        <UiAnimatedInput
                          v-for="(digit, index) in otpDigits"
                          :key="index"
                          :ref="el => otpInputs[index] = el"
                          v-model="otpDigits[index]"
                          type="text"
                          maxlength="1"
                          @input="handleOTPInput(index, $event)"
                          @keydown="handleOTPKeydown(index, $event)"
                          class="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
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
                        class="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Resend Code
                      </button>
                      <p v-else class="text-sm text-gray-500">
                        Resend in {{ resendTimer }}s
                      </p>
                    </div>

                    <button
                      type="submit"
                      :disabled="loading || !isOTPComplete"
                      class="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ loading ? 'Verifying...' : 'Verify Code' }}
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
                        v-model="resetPasswordForm.password"
                        type="password"
                        label="Password"
                        required
                        minlength="8"
                      
                      />
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

                    <div v-if="passwordMismatch" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p class="text-sm text-red-800">Passwords do not match</p>
                    </div>

                    <button
                      type="submit"
                      :disabled="loading || passwordMismatch"
                      class="w-full bg-primary hover:bg-primary-700 text-white text-sm  font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ loading ? 'Resetting...' : 'Reset Password' }}
                    </button>
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
    
const props = defineProps<{
  isOpen: boolean
  initialMode?: 'login' | 'signup'
}>()

const emit = defineEmits<{
  close: []
}>()

const { loading: loginLoading, error: loginError, login } = useLogin()
const { loading: registerLoading, error: registerError, register } = useRegister()

type AuthMode = 'login' | 'signup' | 'forgot' | 'verify-otp' | 'reset-password'

const mode = ref<AuthMode>(props.initialMode || 'signup')
const loading = ref(false)
const resetEmailSent = ref(false)
const canResend = ref(false)
const resendTimer = ref(60)
const otpInputs = ref<HTMLInputElement[]>([])
const otpDigits = ref(['', '', '', '', '', ''])

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
  password: '',
  confirmPassword: ''
})

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
  return otpDigits.value.every(digit => digit !== '')
})

const passwordMismatch = computed(() => {
  return resetPasswordForm.value.password !== '' && 
         resetPasswordForm.value.confirmPassword !== '' &&
         resetPasswordForm.value.password !== resetPasswordForm.value.confirmPassword
})

let resendInterval: NodeJS.Timeout | null = null

// Watch for initialMode changes
watch(() => props.initialMode, (newMode) => {
  if (newMode) {
    mode.value = newMode
  }
})

const switchMode = (newMode: AuthMode) => {
  mode.value = newMode
  resetEmailSent.value = false
}

const startResendTimer = () => {
  canResend.value = false
  resendTimer.value = 60
  
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
  const value = input.value
  
  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }
  
  otpDigits.value[index] = value
  
  // Move to next input if value entered
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleOTPKeydown = (index: number, event: KeyboardEvent) => {
  // Move to previous input on backspace if current is empty
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

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
      password: '',
      confirmPassword: ''
    }
    otpDigits.value = ['', '', '', '', '', '']
    resetEmailSent.value = false
    canResend.value = false
    mode.value = props.initialMode || 'signup'
  }, 300)
}

const handleSignup = async () => {
  loading.value = true
  
  try {
    // TODO: Replace with your actual API call
    await register(signupForm.value)    
    closeModal()
    await navigateTo('/book?subdomain=lola-beauty')
  } catch (error) {
    console.error('Signup error:', error)
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  loading.value = true
  
  try {
    await login(loginForm.value)    
    closeModal()
    await navigateTo('/book?subdomain=lola-beauty')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  loading.value = true
  
  try {
    // TODO: Replace with your actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Forgot password for:', forgotPasswordForm.value.email)
    
    resetEmailSent.value = true
    
    // Move to OTP verification
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
  } finally {
    loading.value = false
  }
}

const handleVerifyOTP = async () => {
  loading.value = true
  
  try {
    const otp = otpDigits.value.join('')
    
    // TODO: Replace with your actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Verifying OTP:', otp)
    
    // Move to reset password
    mode.value = 'reset-password'
  } catch (error) {
    console.error('OTP verification error:', error)
  } finally {
    loading.value = false
  }
}

const handleResendOTP = async () => {
  loading.value = true
  
  try {
    // TODO: Replace with your actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Resending OTP to:', forgotPasswordForm.value.email)
    
    startResendTimer()
  } catch (error) {
    console.error('Resend OTP error:', error)
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (passwordMismatch.value) return
  
  loading.value = true
  
  try {
    // TODO: Replace with your actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Password reset successful')
    
    // Switch to login mode
    mode.value = 'login'
    loginForm.value.email = forgotPasswordForm.value.email
  } catch (error) {
    console.error('Reset password error:', error)
  } finally {
    loading.value = false
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
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>