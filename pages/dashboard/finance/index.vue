<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Finance Overview</h1>
          <p class="text-gray-500 text-sm mt-1">Track your sales and revenue performance</p>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Report
        </button>
      </div>

      <!-- Stats Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Revenue -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(stats?.payments?.totalRevenue || 0) }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">From {{ stats?.payments?.totalPayments || 0 }} payments</p>
        </div>

        <!-- Completed Payments -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats?.payments?.completedPayments || 0 }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Successful transactions</p>
        </div>

        <!-- Pending Payments -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats?.payments?.pendingPayments || 0 }}</p>
            </div>
            <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Awaiting confirmation</p>
        </div>

        <!-- Platform Fees -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Platform Fees</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(stats?.payments?.totalPlatformFees || 0) }}</p>
            </div>
            <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Transaction fees</p>
        </div>
      </div>

      <!-- Payment Methods & Gateway Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Payment Methods -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">Payment Methods</h3>
            <p class="text-xs text-gray-500 mt-1">Breakdown by payment type</p>
          </div>
          <div class="divide-y divide-gray-100">
            <div 
              v-for="method in stats?.payments?.paymentMethodStats || []" 
              :key="method._id"
              class="p-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="getPaymentMethodColor(method._id)"
                >
                  <component :is="getPaymentMethodIcon(method._id)" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 capitalize">{{ formatMethodName(method._id) }}</p>
                  <p class="text-xs text-gray-500">{{ method.count }} transactions</p>
                </div>
              </div>
              <p class="font-semibold text-gray-900">{{ formatCurrency(method.total) }}</p>
            </div>
            <div v-if="!stats?.payments?.paymentMethodStats?.length" class="p-8 text-center text-gray-500 text-sm">
              No payment method data available
            </div>
          </div>
        </div>

        <!-- Gateway Stats -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">Payment Gateways</h3>
            <p class="text-xs text-gray-500 mt-1">Breakdown by gateway provider</p>
          </div>
          <div class="divide-y divide-gray-100">
            <div 
              v-for="gateway in stats?.payments?.gatewayStats || []" 
              :key="gateway._id || 'direct'"
              class="p-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="getGatewayColor(gateway._id)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900 capitalize">{{ gateway._id || 'Direct/Cash' }}</p>
                  <p class="text-xs text-gray-500">{{ gateway.count }} transactions</p>
                </div>
              </div>
              <p class="font-semibold text-gray-900">{{ formatCurrency(gateway.total) }}</p>
            </div>
            <div v-if="!stats?.payments?.gatewayStats?.length" class="p-8 text-center text-gray-500 text-sm">
              No gateway data available
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex border-b border-gray-100">
          <button 
            @click="activeTab = 'sales'"
            class="px-6 py-4 text-sm font-medium transition-colors relative"
            :class="activeTab === 'sales' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-900'"
          >
            Sales History
            <span v-if="sales?.length" class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">{{ sales.length }}</span>
          </button>
          <button 
            @click="activeTab = 'payments'"
            class="px-6 py-4 text-sm font-medium transition-colors relative"
            :class="activeTab === 'payments' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-900'"
          >
            Payments
            <span v-if="payments?.length" class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">{{ payments.length }}</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Sales Table -->
        <div v-else-if="activeTab === 'sales'">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sale #</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="sale in sales" :key="sale._id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">{{ sale.saleNumber }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ sale.items?.length || 0 }} Items</td>
                <td class="px-6 py-4 font-medium text-gray-900">{{ formatCurrency(sale.totalAmount) }}</td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                    :class="getStatusClass(sale.status)"
                  >
                    {{ sale.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(sale.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!sales?.length" class="p-12 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-500">No sales records found</p>
          </div>
        </div>

        <!-- Payments Table -->
        <div v-else>
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="payment in payments" :key="payment._id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-mono text-sm text-gray-900">{{ payment.paymentReference }}</td>
                <td class="px-6 py-4">
                  <span class="capitalize text-gray-700">{{ formatMethodName(payment.paymentMethod) }}</span>
                </td>
                <td class="px-6 py-4 font-medium text-gray-900">{{ formatCurrency(payment.totalAmount) }}</td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                    :class="getStatusClass(payment.status)"
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(payment.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!payments?.length" class="p-12 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-500">No payment records found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetchSales } from "@/composables/modules/finance/useFetchSales"
import { useFetchPayments } from "@/composables/modules/finance/useFetchPayments"
import { useFetchFinanceStats } from "@/composables/modules/finance/useFetchFinanceStats"

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { data: sales, loading: salesLoading, execute: fetchSales } = useFetchSales()
const { data: payments, loading: paymentsLoading, execute: fetchPayments } = useFetchPayments()
const { data: stats, loading: statsLoading, execute: fetchStats } = useFetchFinanceStats()

const loading = ref(false)
const activeTab = ref('sales')

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([fetchSales(), fetchPayments(), fetchStats()])
  } finally {
    loading.value = false
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  }).format(amount || 0)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatMethodName = (method: string) => {
  if (!method) return 'Unknown'
  return method.replace(/_/g, ' ')
}

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'paid':
    case 'success':
      return 'bg-green-100 text-green-700'
    case 'pending':
    case 'processing':
      return 'bg-amber-100 text-amber-700'
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getPaymentMethodColor = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'online':
      return 'bg-blue-100 text-blue-600'
    case 'bank_transfer':
      return 'bg-purple-100 text-purple-600'
    case 'card':
      return 'bg-green-100 text-green-600'
    case 'cash':
      return 'bg-amber-100 text-amber-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getPaymentMethodIcon = (method: string) => {
  // Return a simple SVG icon based on payment method
  return {
    template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>`
  }
}

const getGatewayColor = (gateway: string | null) => {
  switch (gateway?.toLowerCase()) {
    case 'paystack':
      return 'bg-blue-100 text-blue-600'
    case 'flutterwave':
      return 'bg-orange-100 text-orange-600'
    case 'stripe':
      return 'bg-purple-100 text-purple-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
</script>
