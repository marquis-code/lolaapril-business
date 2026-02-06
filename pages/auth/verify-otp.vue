<template>
  <div>
    <div class="mb-8">
      <NuxtLink 
        to="/auth/forgot-password" 
        class="inline-flex items-center text-sm font-medium mb-6 hover:underline"
        style="color: #005967"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </NuxtLink>
      
      <h2 class="text-2xl font-bold mb-2 text-gray-900">Verify Your Email</h2>
      <p class="text-gray-600">
        We sent a 6-digit code to <strong>{{ emailDisplay }}</strong>
      </p>
    </div>
    
    <form @submit.prevent="handleVerify" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3 text-center">
          Enter Verification Code
        </label>
        
        <!-- OTP Input Fields -->
        <div class="flex gap-3 justify-center mb-2">
          <input
            v-for="(digit, index) in otp"
            :key="index"
            :ref="el => otpInputs[index] = el"
            v-model="otp[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            :disabled="loading"
            @input="handleInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
            @paste="handlePaste"
            class="w-16 h-14 text-center text-2xl font-bold rounded-lg border-[0.5px] border-gray-300 focus:border-[#005967] focus:ring focus:ring-[#005967]/20 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="{ 'border-red-500': error && !loading }"
          />
        </div>
        
        <p class="text-xs text-gray-500 text-center">
          Please enter the 6-digit code we sent to your email
        </p>
      </div>

      <!-- Timer & Resend -->
      <div class="text-center">
        <p v-if="timer > 0" class="text-sm text-gray-600">
          Code expires in <span class="font-semibold" style="color: #005967">{{ formatTime(timer) }}</span>
        </p>
        <div v-else class="text-sm text-gray-600">
          Didn't receive the code?
          <button
            type="button"
            @click="handleResend"
            :disabled="resending"
            class="font-semibold hover:underline disabled:opacity-50 ml-1"
            style="color: #005967"
          >
            {{ resending ? 'Sending...' : 'Resend Code' }}
          </button>
        </div>
      </div>
      
      <button 
        type="submit" 
        :disabled="loading || !isOtpComplete"
        class="w-full text-white font-semibold py-3 text-sm rounded-full hover:opacity-90 focus:ring-4 focus:ring-[#005967]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: #005967"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying...
        </span>
        <span v-else>Verify Code</span>
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
import { useVerifyResetOTP } from '@/composables/modules/auth/useVerifyResetOTP'
import { useForgotPassword } from '@/composables/modules/auth/useForgotPassword'
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const config = useRuntimeConfig()

const email = ref(route.query.email as string || '')
const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref<(HTMLInputElement | null)[]>([])
const resending = ref(false)
const timer = ref(300) // 5 minutes in seconds
let timerInterval: NodeJS.Timeout | null = null
const { loading, error, verifyResetOTP } = useVerifyResetOTP()
const { forgotPassword, loading: forgotLoading } = useForgotPassword()

const emailDisplay = computed(() => {
  if (!email.value) return '***@***.com'
  const [name, domain] = email.value.split('@')
  return `${name.slice(0, 2)}***@${domain}`
})

const isOtpComplete = computed(() => {
  return otp.value.every(digit => digit !== '')
})

const otpCode = computed(() => {
  return otp.value.join('')
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // Only allow numbers
  if (value && !/^\d$/.test(value)) {
    otp.value[index] = ''
    return
  }
  
  otp.value[index] = value
  error.value = ''
  
  // Auto-focus next input
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    otpInputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    otpInputs.value[index + 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  
  if (!pastedData) return
  
  // Extract only digits
  const digits = pastedData.replace(/\D/g, '').slice(0, 6)
  
  digits.split('').forEach((digit, index) => {
    if (index < 6) {
      otp.value[index] = digit
    }
  })
  
  // Focus the next empty field or the last field
  const nextEmptyIndex = otp.value.findIndex(d => d === '')
  if (nextEmptyIndex !== -1) {
    otpInputs.value[nextEmptyIndex]?.focus()
  } else {
    otpInputs.value[5]?.focus()
  }
}

const handleVerify = async () => {
  if (!isOtpComplete.value) return

  await verifyResetOTP(email.value, otpCode.value).then(() => {
    // Clear OTP on success
    otp.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
  }).catch(() => {
    // Clear OTP on error
    otp.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
  })
}

const handleResend = async () => {
  resending.value = true
  error.value = ''

  await forgotPassword({ email: email.value }).then(() => {
    // Reset timer
    timer.value = 300
    startTimer()
    // Clear OTP
    otp.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
  }).finally(() => {
    resending.value = false
  })
}
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, 1000)
}

onMounted(() => {
  // Focus first input on mount
  otpInputs.value[0]?.focus()
  // Start timer
  startTimer()
  
  // Redirect if no email provided
  if (!email.value) {
    navigateTo('/auth/forgot-password')
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>