<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="verifying" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-3 border-primary mx-auto"></div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
        <p class="text-gray-600 text-sm">Please wait while we confirm your transaction...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="verificationSuccess && paymentData" class="space-y-4">
        <!-- Header Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 text-center">
          <div class="mx-auto w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Payment Successful</h1>
          <p class="text-sm text-gray-600">Your booking has been confirmed</p>
          
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-center gap-2 text-sm">
              <span class="text-gray-600">Reference:</span>
              <span class="font-mono font-semibold text-gray-900">{{ bookingData?.bookingNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Appointment Details Card -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
          
          <div class="space-y-3">
            <div class="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ bookingData?.services?.[0]?.serviceName }}</p>
                <p class="text-sm text-gray-600 mt-0.5">{{ bookingData?.totalDuration }} minutes</p>
              </div>
            </div>

            <div class="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ formatDate(bookingData?.preferredDate) }}</p>
                <p class="text-sm text-gray-600 mt-0.5">{{ bookingData?.preferredStartTime }} - {{ bookingData?.estimatedEndTime }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ clientData?.firstName }} {{ clientData?.lastName }}</p>
                <p class="text-sm text-gray-600 mt-0.5 truncate">{{ clientData?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Summary Card -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium text-gray-900">₦{{ formatPrice(paymentData?.subtotal) }}</span>
            </div>
            
            <div v-if="paymentData?.totalDiscount > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Discount</span>
              <span class="font-medium text-green-600">-₦{{ formatPrice(paymentData?.totalDiscount) }}</span>
            </div>
            
            <div v-if="paymentData?.totalTax > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="font-medium text-gray-900">₦{{ formatPrice(paymentData?.totalTax) }}</span>
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t border-gray-200">
              <span class="text-base font-semibold text-gray-900">Total Paid</span>
              <span class="text-xl font-bold text-primary">₦{{ formatPrice(paymentData?.totalAmount) }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600 mb-1">Payment Method</p>
                <p class="font-medium text-gray-900 capitalize">{{ paymentData?.paymentMethod }}</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1">Transaction ID</p>
                <p class="font-mono text-xs font-medium text-gray-900 truncate" :title="paymentData?.transactionId">
                  {{ paymentData?.transactionId }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Commission Info (if available) -->
        <div v-if="bookingData?.commissionInfo" class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Commission Details</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Commission Rate</span>
              <span class="font-medium text-gray-900">{{ (bookingData.commissionInfo.commissionRate * 100) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Commission Amount</span>
              <span class="font-medium text-gray-900">₦{{ formatPrice(bookingData.commissionInfo.commissionAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Reason</span>
              <span class="font-medium text-gray-900 capitalize">{{ bookingData.commissionInfo.commissionReason?.replace('_', ' ') }}</span>
            </div>
          </div>
        </div>

        <!-- Platform Fee (if available) -->
        <div v-if="platformFeeData" class="bg-gray-50 rounded-xl p-4">
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Platform Fee ({{ platformFeeData.platformFeePercentage }}%)</span>
              <span>₦{{ formatPrice(platformFeeData.totalPlatformFee) }}</span>
            </div>
            <div class="flex justify-between font-medium text-gray-900">
              <span>Business Receives</span>
              <span>₦{{ formatPrice(platformFeeData.businessReceives) }}</span>
            </div>
          </div>
        </div>

        <!-- Important Notice -->
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-blue-900">
              <p class="font-medium mb-2">Important Reminders</p>
              <ul class="space-y-1 text-blue-800">
                <li>• Confirmation email sent to <strong>{{ clientData?.email }}</strong></li>
                <li>• Arrive 10 minutes early</li>
                <li>• Bring a valid ID</li>
                <li>• Cancel/reschedule 24 hours in advance</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 pt-6">
          <button
            @click="goToBookings"
            class="w-full bg-[#005967] text-white font-semibold py-3.5 text-sm rounded-full transition-all shadow-sm hover:bg-[#004552]"
          >
            View My Bookings
          </button>
          
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="downloadPDFReceipt"
              :disabled="downloadingPDF"
              class="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full text-sm transition-all border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="!downloadingPDF" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span v-if="downloadingPDF">Generating...</span>
              <span v-else>Download PDF</span>
            </button>
            
            <button
              @click="navigateTo('/')"
              class="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full text-sm transition-all border border-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationError" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Verification Failed</h2>
        <p class="text-sm text-gray-600 mb-6 max-w-md mx-auto">{{ verificationError }}</p>
        
        <div class="space-y-3 max-w-sm mx-auto">
          <button
            @click="retryVerification"
            class="w-full bg-[#005967] text-white rounded-full text-sm font-semibold py-3 transition-all hover:bg-[#004552]"
          >
            Retry Verification
          </button>
          
          <button
            @click="navigateTo('/')"
            class="w-full bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 font-medium py-3 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVerifyPayment } from '@/composables/modules/payment/useVerifyPayment'
import jsPDF from 'jspdf'

const route = useRoute()
const router = useRouter()

const { verifyPayment } = useVerifyPayment()

const verifying = ref(true)
const verificationSuccess = ref(false)
const verificationError = ref<string | null>(null)
const paymentData = ref<any>(null)
const downloadingPDF = ref(false)

// Computed properties for easier access to nested data
const bookingData = computed(() => paymentData.value?.bookingId)
const clientData = computed(() => paymentData.value?.clientId)
const platformFeeData = computed(() => paymentData.value?.metadata?.feeCalculation)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price: number) => {
  if (!price && price !== 0) return '0'
  return price.toLocaleString('en-NG')
}

const goToBookings = () => {
  navigateTo('/dashboard/bookings')
}

const downloadPDFReceipt = async () => {
  try {
    downloadingPDF.value = true
    
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    
    // Brand color
    const primaryColor = [0, 89, 103] // #005967
    const lightPrimary = [230, 245, 247]
    const darkGray = [51, 51, 51]
    const mediumGray = [107, 114, 128]
    const lightGray = [243, 244, 246]
    
    let yPos = margin
    
    // Header with brand color background
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 60, 'F')
    
    // Logo placeholder - you can replace this with actual logo loading
    doc.setFillColor(255, 255, 255)
    doc.circle(30, 30, 12, 'F')
    doc.setTextColor(0, 89, 103)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('LA', 30, 33, { align: 'center' })
    
    // Business Name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Lola April Wellness Spa', 50, 28)
    
    // Tagline
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Outside Health Starts Inside', 50, 36)
    
    // Payment Receipt Title
    yPos = 75
    doc.setTextColor(...darkGray)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Receipt', pageWidth / 2, yPos, { align: 'center' })
    
    // Success Badge
    yPos += 15
    doc.setFillColor(220, 252, 231)
    doc.setDrawColor(134, 239, 172)
    doc.roundedRect(pageWidth / 2 - 25, yPos - 5, 50, 10, 2, 2, 'FD')
    doc.setTextColor(22, 163, 74)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('PAID', pageWidth / 2, yPos + 2, { align: 'center' })
    
    // Booking Reference
    yPos += 18
    doc.setTextColor(...mediumGray)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Booking Reference', pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 6
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(bookingData.value?.bookingNumber || 'N/A', pageWidth / 2, yPos, { align: 'center' })
    
    // Divider
    yPos += 10
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    // Client Information Section
    yPos += 12
    doc.setFillColor(...lightPrimary)
    doc.roundedRect(margin, yPos, contentWidth, 28, 2, 2, 'F')
    
    yPos += 8
    doc.setTextColor(...primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('CLIENT INFORMATION', margin + 5, yPos)
    
    yPos += 8
    doc.setTextColor(...darkGray)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${clientData.value?.firstName} ${clientData.value?.lastName}`, margin + 5, yPos)
    
    yPos += 6
    doc.text(`Email: ${clientData.value?.email}`, margin + 5, yPos)
    
    yPos += 6
    doc.text(`Phone: ${bookingData.value?.clientPhone || 'N/A'}`, margin + 5, yPos)
    
    // Appointment Details Section
    yPos += 12
    doc.setFillColor(...lightPrimary)
    doc.roundedRect(margin, yPos, contentWidth, 34, 2, 2, 'F')
    
    yPos += 8
    doc.setTextColor(...primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('APPOINTMENT DETAILS', margin + 5, yPos)
    
    yPos += 8
    doc.setTextColor(...darkGray)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Service: ${bookingData.value?.services?.[0]?.serviceName || 'N/A'}`, margin + 5, yPos)
    
    yPos += 6
    doc.text(`Duration: ${bookingData.value?.totalDuration || 0} minutes`, margin + 5, yPos)
    
    yPos += 6
    doc.text(`Date: ${formatDate(bookingData.value?.preferredDate)}`, margin + 5, yPos)
    
    yPos += 6
    doc.text(`Time: ${bookingData.value?.preferredStartTime} - ${bookingData.value?.estimatedEndTime}`, margin + 5, yPos)
    
    // Payment Summary Section
    yPos += 12
    doc.setFillColor(...lightGray)
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, 'F')
    
    yPos += 6
    doc.setTextColor(...primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT SUMMARY', margin + 5, yPos)
    
    // Payment Items
    yPos += 10
    const lineItems = [
      { label: 'Subtotal', value: `₦${formatPrice(paymentData.value?.subtotal)}`, bold: false },
    ]
    
    if (paymentData.value?.totalDiscount > 0) {
      lineItems.push({ label: 'Discount', value: `-₦${formatPrice(paymentData.value?.totalDiscount)}`, bold: false })
    }
    
    if (paymentData.value?.totalTax > 0) {
      lineItems.push({ label: 'Tax', value: `₦${formatPrice(paymentData.value?.totalTax)}`, bold: false })
    }
    
    doc.setTextColor(...darkGray)
    doc.setFontSize(10)
    
    lineItems.forEach(item => {
      doc.setFont('helvetica', item.bold ? 'bold' : 'normal')
      doc.text(item.label, margin + 5, yPos)
      doc.text(item.value, pageWidth - margin - 5, yPos, { align: 'right' })
      yPos += 6
    })
    
    // Total Line
    yPos += 2
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.8)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    yPos += 8
    doc.setTextColor(...primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL PAID', margin + 5, yPos)
    doc.text(`₦${formatPrice(paymentData.value?.totalAmount)}`, pageWidth - margin - 5, yPos, { align: 'right' })
    
    // Payment Details
    yPos += 12
    doc.setFillColor(...lightPrimary)
    doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F')
    
    yPos += 8
    doc.setTextColor(...primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT DETAILS', margin + 5, yPos)
    
    yPos += 8
    doc.setTextColor(...darkGray)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Payment Method: ${paymentData.value?.paymentMethod?.toUpperCase() || 'N/A'}`, margin + 5, yPos)
    
    yPos += 5
    doc.setFontSize(8)
    doc.text(`Transaction ID: ${paymentData.value?.transactionId || 'N/A'}`, margin + 5, yPos)
    
    yPos += 5
    const paidDate = paymentData.value?.paidAt ? new Date(paymentData.value.paidAt).toLocaleString() : 'N/A'
    doc.text(`Payment Date: ${paidDate}`, margin + 5, yPos)
    
    // Important Reminders
    yPos += 15
    doc.setFillColor(239, 246, 255)
    doc.setDrawColor(191, 219, 254)
    doc.roundedRect(margin, yPos, contentWidth, 26, 2, 2, 'FD')
    
    yPos += 7
    doc.setTextColor(30, 64, 175)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Important Reminders', margin + 5, yPos)
    
    yPos += 6
    doc.setTextColor(51, 65, 85)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('• Please arrive 10 minutes before your appointment', margin + 8, yPos)
    
    yPos += 5
    doc.text('• Bring a valid form of identification', margin + 8, yPos)
    
    yPos += 5
    doc.text('• Cancellations must be made 24 hours in advance', margin + 8, yPos)
    
    // Footer
    const footerY = pageHeight - 25
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.3)
    doc.line(margin, footerY, pageWidth - margin, footerY)
    
    doc.setTextColor(...mediumGray)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Thank you for choosing Lola April Wellness Spa', pageWidth / 2, footerY + 5, { align: 'center' })
    doc.text('For inquiries, please contact us at info@lolaaprils pa.com', pageWidth / 2, footerY + 10, { align: 'center' })
    doc.text(`Receipt generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY + 15, { align: 'center' })
    
    // Save the PDF
    const fileName = `receipt-${bookingData.value?.bookingNumber || 'payment'}.pdf`
    doc.save(fileName)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF receipt. Please try again.')
  } finally {
    downloadingPDF.value = false
  }
}

const verifyPaymentFromUrl = async () => {
  try {
    verifying.value = true
    verificationError.value = null
    
    const reference = route.query.reference as string || route.query.trxref as string
    
    if (!reference) {
      verificationError.value = 'Payment reference not found in URL'
      verifying.value = false
      return
    }

    const result = await verifyPayment(reference)
    console.log("Payment Verification Result:", result)
    
    if (result && result._id) {
      paymentData.value = result
      verificationSuccess.value = true
    } else {
      verificationError.value = 'Payment verification failed. Please contact support with your payment reference.'
    }
  } catch (error: any) {
    console.error('Payment verification error:', error)
    verificationError.value = error.message || 'An error occurred during verification. Please try again or contact support.'
  } finally {
    verifying.value = false
  }
}

const retryVerification = () => {
  verifyPaymentFromUrl()
}

onMounted(() => {
  verifyPaymentFromUrl()
})
</script>

<style scoped>
.border-primary {
  border-color: #005967;
}

.bg-primary {
  background-color: #005967;
}

.bg-primary\/90 {
  background-color: rgba(0, 89, 103, 0.9);
}

.bg-primary\/10 {
  background-color: rgba(0, 89, 103, 0.1);
}

.text-primary {
  color: #005967;
}

.hover\:bg-primary\/90:hover {
  background-color: rgba(0, 89, 103, 0.9);
}
</style>