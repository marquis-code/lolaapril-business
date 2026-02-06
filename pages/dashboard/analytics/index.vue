<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p class="text-gray-500 mt-1">Track your business performance and insights.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>

    <div v-else-if="dashboardMetrics">
      <!-- Today's Stats -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h2>
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Revenue</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ formatCurrency(dashboardMetrics.today.revenue) }}</div>
            <div class="text-sm text-green-600 mt-2">↑ {{ dashboardMetrics.trends.revenueChange }}%</div>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Bookings</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ dashboardMetrics.today.bookings }}</div>
            <div class="text-sm text-green-600 mt-2">↑ {{ dashboardMetrics.trends.bookingsChange }}%</div>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Net Revenue</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ formatCurrency(dashboardMetrics.today.netRevenue) }}</div>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">New Clients</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ dashboardMetrics.today.clients }}</div>
          </div>
        </div>
      </div>

      <!-- Month to Date -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Total Revenue</div>
            <div class="text-2xl font-bold text-gray-900 mt-2">{{ formatCurrency(dashboardMetrics.monthToDate.revenue) }}</div>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Total Bookings</div>
            <div class="text-2xl font-bold text-gray-900 mt-2">{{ dashboardMetrics.monthToDate.bookings }}</div>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Net Revenue</div>
            <div class="text-2xl font-bold text-gray-900 mt-2">{{ formatCurrency(dashboardMetrics.monthToDate.netRevenue) }}</div>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Commission Savings</div>
            <div class="text-2xl font-bold text-green-600 mt-2">{{ formatCurrency(dashboardMetrics.monthToDate.commissionSavings) }}</div>
            <div class="text-xs text-gray-500 mt-1">vs competitors</div>
          </div>
        </div>
      </div>

      <!-- Pending -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Pending Actions</h3>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <div class="text-sm text-gray-500">Pending Bookings</div>
            <div class="text-xl font-bold text-yellow-600">{{ dashboardMetrics.pending.bookings }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Pending Amount</div>
            <div class="text-xl font-bold text-yellow-600">{{ formatCurrency(dashboardMetrics.pending.amount) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchDashboardMetrics } from "@/composables/modules/analytics/useFetchDashboardMetrics"
definePageMeta({
  layout: 'dashboard'
})

const { data: dashboardMetrics, loading, execute: fetchDashboardMetrics } = useFetchDashboardMetrics()

onMounted(() => {
  fetchDashboardMetrics()
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)
}
</script>
