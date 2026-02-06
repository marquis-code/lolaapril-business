<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Overview -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Payments Overview</h2>
            <p class="text-sm text-gray-500">Monitor transactions, refunds, and payment status</p>
          </div>
          <button
            @click="refreshPayments"
            :disabled="paymentsLoading || statsLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-60"
          >
            {{ paymentsLoading || statsLoading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Payments</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.totalPayments ?? payments.length }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Revenue</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(statsSummary.totalRevenue ?? totalAmount) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Completed</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.completedPayments ?? successfulCount }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Pending</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.pendingPayments ?? 0 }}</p>
          </div>
        </div>
      </section>

      <!-- Filters -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Payment Records</h2>
            <p class="text-sm text-gray-500">Filter, verify, and manage payments</p>
          </div>
          <button
            @click="handleVerifyReference"
            :disabled="verifyLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
          >
            {{ verifyLoading ? 'Verifying...' : 'Verify Reference' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <UiAnimatedInput v-model="filters.search" type="text" label="Search" placeholder="Search reference or transaction" />
          <UiSelectInput
            v-model="filters.status"
            label="Status"
            :options="statusFilterOptions"
            option-label="label"
            option-value="value"
            placeholder="All Status"
          />
          <UiSelectInput
            v-model="filters.paymentMethod"
            label="Payment Method"
            :options="paymentMethodOptions"
            option-label="label"
            option-value="value"
            placeholder="All Methods"
          />
          <UiAnimatedInput v-model="filters.startDate" type="date" label="Start Date" />
          <UiAnimatedInput v-model="filters.endDate" type="date" label="End Date" />
          <UiAnimatedInput v-model="verifyReference" type="text" label="Reference" placeholder="Reference to verify" />
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="applyFilters"
            :disabled="paymentsLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {{ paymentsLoading ? 'Loading...' : 'Apply Filters' }}
          </button>
        </div>
      </section>

      <!-- Table -->
      <section class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs uppercase text-gray-500 border-b">
              <th class="px-5 py-3">Reference</th>
              <th class="px-5 py-3">Client</th>
              <th class="px-5 py-3">Amount</th>
              <th class="px-5 py-3">Method</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Date</th>
              <th class="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment._id" class="border-b last:border-0">
              <td class="px-5 py-4 font-mono text-xs text-gray-700">{{ payment.paymentReference }}</td>
              <td class="px-5 py-4 text-gray-700">
                <span v-if="payment.clientId && typeof payment.clientId === 'object'">
                  {{ payment.clientId.firstName }} {{ payment.clientId.lastName }}<br />
                  <span class="text-xs text-gray-500">{{ payment.clientId.email }}</span>
                </span>
                <span v-else>-</span>
              </td>
              <td class="px-5 py-4 font-semibold text-gray-900">{{ formatCurrency(payment.totalAmount) }}</td>
              <td class="px-5 py-4 text-gray-600 capitalize">{{ formatMethod(payment.paymentMethod) }}</td>
              <td class="px-5 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusClass(payment.status)">
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-500">{{ formatDate(payment.createdAt) }}</td>
              <td class="px-5 py-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="openStatusModal(payment)"
                    class="text-xs font-semibold text-primary"
                  >
                    Update Status
                  </button>
                  <button
                    @click="openRefundModal(payment)"
                    class="text-xs font-semibold text-rose-600"
                  >
                    Refund
                  </button>
                  <button
                    @click="handleGatewayRefund(payment)"
                    :disabled="gatewayRefundLoading"
                    class="text-xs font-semibold text-gray-700"
                  >
                    Gateway Refund
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!payments.length && !paymentsLoading">
              <td colspan="7" class="px-5 py-6 text-center text-gray-400">No payments found.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Status Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">Update Payment Status</h3>
        <UiSelectInput
          v-model="statusForm.status"
          label="Status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
        />
        <UiAnimatedInput v-model="statusForm.transactionId" type="text" label="Transaction ID" />
        <div class="flex justify-end gap-3">
          <button @click="closeStatusModal" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100">Cancel</button>
          <button
            @click="handleUpdateStatus"
            :disabled="statusLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {{ statusLoading ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Refund Modal -->
    <div v-if="showRefundModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">Process Refund</h3>
        <UiAnimatedInput v-model="refundForm.refundAmount" type="number" label="Refund Amount" />
        <UiAnimatedInput v-model="refundForm.refundReason" type="text" label="Refund Reason" />
        <div class="flex justify-end gap-3">
          <button @click="closeRefundModal" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100">Cancel</button>
          <button
            @click="handleProcessRefund"
            :disabled="refundLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60"
          >
            {{ refundLoading ? 'Processing...' : 'Process Refund' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Payment } from '@/types/finance'
import { useFetchPayments } from '@/composables/modules/payment/useFetchPayments'
import { useFetchPaymentStats } from '@/composables/modules/payment/useFetchPaymentStats'
import { useUpdatePaymentStatus } from '@/composables/modules/payment/useUpdatePaymentStatus'
import { useProcessPaymentRefund } from '@/composables/modules/payment/useProcessPaymentRefund'
import { useInitiatePaymentRefund } from '@/composables/modules/payment/useInitiatePaymentRefund'
import { useVerifyPayment } from '@/composables/modules/payment/useVerifyPayment'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const filters = ref({
  search: '',
  status: '',
  paymentMethod: '',
  startDate: '',
  endDate: ''
})

const verifyReference = ref('')

// Options for filters
const statusFilterOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Partially Refunded', value: 'partially_refunded' }
]

const paymentMethodOptions = [
  { label: 'All Methods', value: '' },
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Mobile Money', value: 'mobile_money' },
  { label: 'Online', value: 'online' }
]

// Options for modals
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Partially Refunded', value: 'partially_refunded' }
]

const { data: paymentsData, loading: paymentsLoading, execute: fetchPayments } = useFetchPayments()
const { data: statsData, loading: statsLoading, execute: fetchStats } = useFetchPaymentStats()
const { loading: statusLoading, execute: updateStatus } = useUpdatePaymentStatus()
const { loading: refundLoading, execute: processRefund } = useProcessPaymentRefund()
const { loading: gatewayRefundLoading, execute: initiateRefund } = useInitiatePaymentRefund()
const { loading: verifyLoading, execute: verifyPayment } = useVerifyPayment()

const payments = computed(() => paymentsData.value.payments || [])
const statsSummary = computed(() => statsData.value || {})

const totalAmount = computed(() => payments.value.reduce((sum: number, payment: Payment) => sum + (payment.totalAmount || 0), 0))
const successfulCount = computed(() => payments.value.filter((payment: Payment) => payment.status === 'completed').length)
const refundedCount = computed(() => payments.value.filter((payment: Payment) => payment.status === 'refunded' || payment.status === 'partially_refunded').length)

const showStatusModal = ref(false)
const showRefundModal = ref(false)
const selectedPayment = ref<Payment | null>(null)

const statusForm = ref({
  status: 'pending',
  transactionId: ''
})

const refundForm = ref({
  refundAmount: 0,
  refundReason: ''
})

const applyFilters = async () => {
  await fetchPayments({
    search: filters.value.search || undefined,
    status: filters.value.status || undefined,
    paymentMethod: filters.value.paymentMethod || undefined,
    startDate: filters.value.startDate || undefined,
    endDate: filters.value.endDate || undefined
  })
}

const refreshPayments = async () => {
  await Promise.all([applyFilters(), fetchStats()])
}

const openStatusModal = (payment: Payment) => {
  selectedPayment.value = payment
  statusForm.value = {
    status: payment.status,
    transactionId: payment.transactionId || ''
  }
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
}

const handleUpdateStatus = async () => {
  if (!selectedPayment.value) return
  await updateStatus(selectedPayment.value._id, {
    status: statusForm.value.status,
    transactionId: statusForm.value.transactionId || undefined
  })
  showStatusModal.value = false
  await applyFilters()
}

const openRefundModal = (payment: Payment) => {
  selectedPayment.value = payment
  refundForm.value = { refundAmount: payment.totalAmount || 0, refundReason: '' }
  showRefundModal.value = true
}

const closeRefundModal = () => {
  showRefundModal.value = false
}

const handleProcessRefund = async () => {
  if (!selectedPayment.value) return
  await processRefund(selectedPayment.value._id, {
    refundAmount: refundForm.value.refundAmount,
    refundReason: refundForm.value.refundReason
  })
  showRefundModal.value = false
  await applyFilters()
}

const handleGatewayRefund = async (payment: Payment) => {
  if (gatewayRefundLoading.value) return
  await initiateRefund(payment.paymentReference)
  await applyFilters()
}

const handleVerifyReference = async () => {
  if (!verifyReference.value) return
  await verifyPayment(verifyReference.value)
}

const statusClass = (status: string) => {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'pending' || status === 'processing') return 'bg-amber-100 text-amber-700'
  if (status?.includes('refunded')) return 'bg-blue-100 text-blue-700'
  return 'bg-rose-100 text-rose-700'
}

const formatMethod = (value: string) => value?.replace('_', ' ')
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)
const formatDate = (value: string) => value ? new Date(value).toLocaleDateString() : ''

onMounted(async () => {
  await refreshPayments()
})
</script>
