<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
        <p class="text-gray-500 mt-1">Generate daily, weekly, and monthly sales reports.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="type in reportTypes"
          :key="type.id"
          @click="selectedType = type.id"
          class="p-5 rounded-2xl border transition-all text-left"
          :class="selectedType === type.id ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'"
        >
          <div class="text-2xl">{{ type.icon }}</div>
          <h3 class="mt-2 font-semibold text-gray-900">{{ type.name }}</h3>
          <p class="text-sm text-gray-500">{{ type.description }}</p>
        </button>
      </div>

      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900">Report Inputs</h2>

        <div v-if="selectedType === 'daily'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="dailyDate" type="date" label="Date" />
          <div class="flex items-end gap-3">
            <button
              @click="fetchDaily"
              :disabled="dailyLoading"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {{ dailyLoading ? 'Loading...' : 'Fetch Summary' }}
            </button>
            <button
              @click="generateDaily"
              :disabled="dailyGenerateLoading"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
            >
              {{ dailyGenerateLoading ? 'Generating...' : 'Generate Summary' }}
            </button>
          </div>
        </div>

        <div v-else-if="selectedType === 'weekly'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="weekStart" type="date" label="Start Date" />
          <UiAnimatedInput v-model="weekEnd" type="date" label="End Date" />
          <div class="flex items-end">
            <button
              @click="fetchWeekly"
              :disabled="weeklyLoading"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {{ weeklyLoading ? 'Loading...' : 'Load Weekly Report' }}
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="monthYear" type="number" label="Year" />
          <UiAnimatedInput v-model="monthValue" type="number" label="Month" />
          <div class="flex items-end">
            <button
              @click="fetchMonthly"
              :disabled="monthlyLoading"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {{ monthlyLoading ? 'Loading...' : 'Load Monthly Report' }}
            </button>
          </div>
        </div>
      </section>

      <section v-if="selectedType === 'daily' && dailySummary" class="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h2 class="text-lg font-semibold text-gray-900">Daily Sales Summary</h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Revenue</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(dailySummary.totalRevenue) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Appointments</p>
            <p class="text-lg font-semibold text-gray-900">{{ dailySummary.totalAppointments }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">New Clients</p>
            <p class="text-lg font-semibold text-gray-900">{{ dailySummary.newClients }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Avg Ticket</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(dailySummary.averageTicketSize) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-900">Service Summary</h3>
            <div class="mt-3 space-y-2 max-h-56 overflow-y-auto">
              <div v-for="service in dailySummary.servicesSummary" :key="service.serviceId" class="flex justify-between text-xs text-gray-600">
                <span>{{ service.serviceName }} ({{ service.quantity }})</span>
                <span class="font-medium">{{ formatCurrency(service.revenue) }}</span>
              </div>
              <p v-if="!dailySummary.servicesSummary.length" class="text-xs text-gray-400">No services data.</p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-900">Staff Summary</h3>
            <div class="mt-3 space-y-2 max-h-56 overflow-y-auto">
              <div v-for="staff in dailySummary.staffSummary" :key="staff.staffId" class="text-xs text-gray-600">
                <div class="flex justify-between">
                  <span>{{ staff.staffName }}</span>
                  <span class="font-medium">{{ formatCurrency(staff.revenue) }}</span>
                </div>
                <p class="text-[11px] text-gray-400">{{ staff.appointmentsCompleted }} appointments • Commission {{ formatCurrency(staff.commission) }}</p>
              </div>
              <p v-if="!dailySummary.staffSummary.length" class="text-xs text-gray-400">No staff data.</p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-900">Payment Methods</h3>
            <div class="mt-3 space-y-2">
              <div v-for="method in dailySummary.paymentMethodsSummary" :key="method.method" class="flex justify-between text-xs text-gray-600">
                <span>{{ method.method }}</span>
                <span class="font-medium">{{ formatCurrency(method.amount) }} ({{ method.count }})</span>
              </div>
              <p v-if="!dailySummary.paymentMethodsSummary.length" class="text-xs text-gray-400">No payment methods data.</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="selectedType === 'weekly' && weeklyReport" class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900">Weekly Sales Report</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Revenue</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(weeklyReport.totalRevenue) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Appointments</p>
            <p class="text-lg font-semibold text-gray-900">{{ weeklyReport.totalAppointments }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Service Charge</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(weeklyReport.totalServiceCharge || 0) }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="day in weeklyReport.dailyBreakdown" :key="day.date" class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 text-sm">
            <span>{{ day.date }}</span>
            <span class="font-semibold">{{ formatCurrency(day.totalRevenue) }}</span>
          </div>
        </div>
      </section>

      <section v-if="selectedType === 'monthly' && monthlyReport" class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900">Monthly Sales Report</h2>
        <div class="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 whitespace-pre-wrap">
          {{ monthlyReport }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DailySalesSummary, WeeklySalesReport } from '@/types/settings'
import { useFetchDailySalesSummary } from '@/composables/modules/reports/useFetchDailySalesSummary'
import { useGenerateDailySalesSummary } from '@/composables/modules/reports/useGenerateDailySalesSummary'
import { useFetchWeeklySalesReport } from '@/composables/modules/reports/useFetchWeeklySalesReport'
import { useFetchMonthlySalesReport } from '@/composables/modules/reports/useFetchMonthlySalesReport'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const reportTypes = [
  { id: 'daily', name: 'Daily Report', description: 'Summary for a specific day', icon: '📅' },
  { id: 'weekly', name: 'Weekly Report', description: 'Revenue over a date range', icon: '📊' },
  { id: 'monthly', name: 'Monthly Report', description: 'Revenue by month', icon: '📈' }
]

const selectedType = ref('daily')
const today = new Date().toISOString().split('T')[0]

const dailyDate = ref(today)
const weekStart = ref(today)
const weekEnd = ref(today)
const monthYear = ref(new Date().getFullYear())
const monthValue = ref(new Date().getMonth() + 1)

const { data: dailyData, loading: dailyLoading, execute: fetchDailySummary } = useFetchDailySalesSummary()
const { loading: dailyGenerateLoading, execute: generateDailySummary } = useGenerateDailySalesSummary()
const { data: weeklyData, loading: weeklyLoading, execute: fetchWeeklyReport } = useFetchWeeklySalesReport()
const { data: monthlyData, loading: monthlyLoading, execute: fetchMonthlyReport } = useFetchMonthlySalesReport()

const dailySummary = computed(() => dailyData.value as DailySalesSummary | null)
const weeklyReport = computed(() => weeklyData.value as WeeklySalesReport | null)
const monthlyReport = computed(() => monthlyData.value)

const fetchDaily = async () => {
  if (!dailyDate.value) return
  await fetchDailySummary(dailyDate.value)
}

const generateDaily = async () => {
  if (!dailyDate.value) return
  await generateDailySummary(dailyDate.value)
  await fetchDaily()
}

const fetchWeekly = async () => {
  if (!weekStart.value || !weekEnd.value) return
  await fetchWeeklyReport(weekStart.value, weekEnd.value)
}

const fetchMonthly = async () => {
  if (!monthYear.value || !monthValue.value) return
  await fetchMonthlyReport(monthYear.value, monthValue.value)
}

const refreshAll = async () => {
  if (selectedType.value === 'daily') return fetchDaily()
  if (selectedType.value === 'weekly') return fetchWeekly()
  return fetchMonthly()
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)
</script>
