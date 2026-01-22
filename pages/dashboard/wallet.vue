<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-xl font-bold text-gray-900 mb-8">Wallet</h1>

      <!-- Balance Card -->
      <div class="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-2">Available Balance</p>
          <p class="text-4xl font-bold text-gray-900 mb-6">₦0.00</p>
          <button
            class="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Add Funds
          </button>
        </div>
      </div>

      <!-- Transactions -->
      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-900 mb-6">
          Transaction History
        </h2>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div
            v-for="i in 5"
            :key="i"
            class="h-12 bg-gray-100 rounded-lg animate-pulse"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!sortedTransactions.length"
          class="text-center py-12"
        >
          <svg
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <p class="text-gray-500">No transactions yet</p>
        </div>

        <!-- Transactions Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-left text-gray-500">
                <th class="pb-3 font-medium">Date</th>
                <th class="pb-3 font-medium">Description</th>
                <th class="pb-3 font-medium">Amount</th>
                <th class="pb-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr
                v-for="transaction in sortedTransactions"
                :key="transaction._id"
                class="hover:bg-gray-50"
              >
                <td class="py-4 text-gray-600">
                  {{ formatDate(transaction.paidAt || transaction.createdAt) }}
                </td>

                <td class="py-4">
                  <p class="font-medium text-gray-900">
                    {{ transaction.businessId?.businessName }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ transaction.items[0]?.itemName }}
                  </p>
                </td>

                <td class="py-4 font-semibold text-gray-900">
                  ₦{{ formatAmount(transaction.totalAmount) }}
                </td>

                <td class="py-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="statusClasses(transaction.status)"
                  >
                    {{ transaction.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGetTransactions } from '@/composables/modules/payment/useGetTransactions'

const { transactions, loading } = useGetTransactions()

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

/**
 * Sort transactions: most recent first
 */
const sortedTransactions = computed(() => {
  if (!transactions?.value) return []
  return [...transactions.value].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
})

/**
 * Helpers
 */
const formatAmount = (amount: number) =>
  amount.toLocaleString('en-NG')

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

const statusClasses = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
</script>
