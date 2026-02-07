<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <!-- Quick Stats -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Quick Stats</h2>
            <p class="text-sm text-gray-500">Today and month-to-date overview</p>
          </div>
          <span v-if="quickStatsLoading || dashboardLoading" class="text-xs text-gray-400">Loading...</span>
          <button
            @click="refreshQuickStats"
            class="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5"
          >
            Refresh
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <p class="text-xs text-gray-500">Today Revenue</p>
            <p class="text-2xl font-bold text-gray-900">₦{{ formatCurrency(quickStatsData?.today?.revenue) }}</p>
            <p class="text-xs text-gray-500 mt-2">Bookings: {{ quickStatsData?.today?.bookings ?? 0 }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <p class="text-xs text-gray-500">Today Net Revenue</p>
            <p class="text-2xl font-bold text-gray-900">₦{{ formatCurrency(quickStatsData?.today?.netRevenue) }}</p>
            <p class="text-xs text-gray-500 mt-2">Pending: {{ quickStatsData?.pending?.count ?? 0 }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <p class="text-xs text-gray-500">Month Revenue</p>
            <p class="text-2xl font-bold text-gray-900">₦{{ formatCurrency(quickStatsData?.thisMonth?.revenue) }}</p>
            <p class="text-xs text-gray-500 mt-2">Bookings: {{ quickStatsData?.thisMonth?.bookings ?? 0 }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <p class="text-xs text-gray-500">Commission Savings</p>
            <p class="text-2xl font-bold text-gray-900">₦{{ formatCurrency(quickStatsData?.thisMonth?.commissionSavings) }}</p>
            <p class="text-xs text-gray-500 mt-2">Net: ₦{{ formatCurrency(quickStatsData?.thisMonth?.netRevenue) }}</p>
          </div>
        </div>

      </section>

      <!-- Dashboard Metrics -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Operational Snapshot</h2>
            <p class="text-sm text-gray-500">Real-time performance indicators</p>
          </div>
          <span v-if="dashboardLoading" class="text-xs text-gray-400">Loading...</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Pending Bookings</p>
            <p class="text-lg font-semibold text-gray-900">{{ dashboardData?.pending?.bookings ?? 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Pending Value</p>
            <p class="text-lg font-semibold text-gray-900">₦{{ formatCurrency(dashboardData?.pending?.amount) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Revenue Trend</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ dashboardData?.trends?.revenueChange ?? 'N/A' }}
            </p>
          </div>
        </div>
      </section>

      <!-- Filters -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Performance Filters</h2>
            <p class="text-sm text-gray-500">Set date ranges for revenue and source analytics</p>
          </div>
          <div class="flex flex-wrap items-end gap-3">
            <div>
              <UiAnimatedInput v-model="rangeStart" type="date" label="Start date" placeholder="" />
            </div>
            <div>
              <UiAnimatedInput v-model="rangeEnd" type="date" label="End date" placeholder="" />
            </div>
            <div>
              <UiSelectInput
                v-model="granularity"
                label="Granularity"
                :options="granularityOptions"
                option-label="label"
                option-value="value"
                placeholder="Select granularity"
              />
            </div>
            <button
              @click="refreshRangeAnalytics"
              class="h-10 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </div>
      </section>

      <!-- Revenue Trends -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Revenue Trends</h2>
            <p class="text-sm text-gray-500">{{ rangeStart }} → {{ rangeEnd }} ({{ granularity }})</p>
          </div>
          <span v-if="revenueLoading" class="text-xs text-gray-400">Loading...</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Gross Revenue</p>
            <p class="text-xl font-semibold text-gray-900">₦{{ formatCurrency(revenueTrends?.revenue?.gross) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Net Revenue</p>
            <p class="text-xl font-semibold text-gray-900">₦{{ formatCurrency(revenueTrends?.revenue?.net) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Commissions</p>
            <p class="text-xl font-semibold text-gray-900">₦{{ formatCurrency(revenueTrends?.revenue?.commissions) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Processing Fees</p>
            <p class="text-xl font-semibold text-gray-900">₦{{ formatCurrency(revenueTrends?.revenue?.processingFees) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Bookings</p>
            <p class="text-lg font-semibold text-gray-900">{{ revenueTrends?.bookings?.total ?? 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Completed</p>
            <p class="text-lg font-semibold text-gray-900">{{ revenueTrends?.bookings?.completed ?? 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Average Booking Value</p>
            <p class="text-lg font-semibold text-gray-900">₦{{ formatCurrency(revenueTrends?.bookings?.averageValue) }}</p>
          </div>
        </div>
      </section>

      <!-- Charts -->
      <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">

        <ClientOnly>
          <AnalyticsChartCard
            :key="revenueBreakdownKey"
            title="Revenue Breakdown"
            subtitle="Gross vs net and fees"
            type="bar"
            dataset-label="Revenue"
            :labels="revenueBreakdownLabels"
            :values="revenueBreakdownValues"
            :loading="revenueLoading"
            @select="showChartDetail($event)"
          />
        </ClientOnly>

        <ClientOnly>
          <AnalyticsChartCard
            :key="sourcePerformanceKey"
            title="Source Performance"
            subtitle="Revenue by source"
            type="bar"
            dataset-label="Revenue"
            :labels="sourcePerformanceLabels"
            :values="sourcePerformanceValues"
            :loading="sourceLoading"
            @select="showChartDetail($event)"
          />
        </ClientOnly>

        <ClientOnly>
          <AnalyticsChartCard
            :key="commissionMixKey"
            title="Commission Mix"
            subtitle="Commission by source"
            type="doughnut"
            dataset-label="Commission"
            :labels="commissionMixLabels"
            :values="commissionMixValues"
            :loading="commissionLoading"
            @select="showChartDetail($event)"
          />
          </ClientOnly>


      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="selectedChartDetail"
            class="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
            @click.self="selectedChartDetail = null"
          >
            <div class="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
              <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ selectedChartDetail.title }} Detail</h3>
                  <p class="text-xs text-gray-500">{{ selectedChartDetail.subtitle }}</p>
                </div>
                <button @click="selectedChartDetail = null" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="p-6 space-y-2">
                <div>
                  <p class="text-xs text-gray-500">Label</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedChartDetail.label }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Value</p>
                  <p class="text-sm font-medium text-gray-900">₦{{ formatCurrency(selectedChartDetail.value) }}</p>
                </div>
                <div v-if="selectedChartDetail.datasetLabel">
                  <p class="text-xs text-gray-500">Dataset</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedChartDetail.datasetLabel }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
      </section>

      <!-- Commission Breakdown -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Commission Breakdown</h2>
            <p class="text-sm text-gray-500">Commissions by source and booking type</p>
          </div>
          <span v-if="commissionLoading" class="text-xs text-gray-400">Loading...</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Bookings</p>
            <p class="text-lg font-semibold text-gray-900">{{ commissionBreakdown?.summary?.totalBookings ?? 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Direct Bookings</p>
            <p class="text-lg font-semibold text-gray-900">{{ commissionBreakdown?.summary?.directBookings ?? 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Marketplace Commissions</p>
            <p class="text-lg font-semibold text-gray-900">₦{{ formatCurrency(commissionBreakdown?.summary?.marketplaceCommissions) }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs uppercase text-gray-500 border-b">
                <th class="py-3 pr-4">Source</th>
                <th class="py-3 pr-4">Bookings</th>
                <th class="py-3 pr-4">Revenue</th>
                <th class="py-3 pr-4">Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in commissionBreakdown?.bySource || []"
                :key="idx"
                class="border-b last:border-0"
              >
                <td class="py-3 pr-4 text-gray-900 capitalize">{{ item.source || 'N/A' }}</td>
                <td class="py-3 pr-4 text-gray-700">{{ item.bookings ?? 0 }}</td>
                <td class="py-3 pr-4 text-gray-700">₦{{ formatCurrency(item.revenue) }}</td>
                <td class="py-3 pr-4 text-gray-700">₦{{ formatCurrency(item.commission) }}</td>
              </tr>
              <tr v-if="!(commissionBreakdown?.bySource?.length)">
                <td colspan="4" class="py-6 text-center text-gray-400">No breakdown data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Source Performance -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Source Performance</h2>
            <p class="text-sm text-gray-500">Top performing booking sources</p>
          </div>
          <span v-if="sourceLoading" class="text-xs text-gray-400">Loading...</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs uppercase text-gray-500 border-b">
                <th class="py-3 pr-4">Source</th>
                <th class="py-3 pr-4">Bookings</th>
                <th class="py-3 pr-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in sourcePerformance?.sources || []"
                :key="idx"
                class="border-b last:border-0"
              >
                <td class="py-3 pr-4 text-gray-900 capitalize">{{ item.sourceType || item.source || 'N/A' }}</td>
                <td class="py-3 pr-4 text-gray-700">{{ item.bookings ?? item.totalBookings ?? 0 }}</td>
                <td class="py-3 pr-4 text-gray-700">₦{{ formatCurrency(item.revenue) }}</td>
              </tr>
              <tr v-if="!(sourcePerformance?.sources?.length)">
                <td colspan="3" class="py-6 text-center text-gray-400">No source performance data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Fee Comparison -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Fee Comparison</h2>
            <p class="text-sm text-gray-500">Savings compared to other platforms</p>
          </div>
          <span v-if="feeLoading" class="text-xs text-gray-400">Loading...</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Savings</p>
            <p class="text-xl font-semibold text-gray-900">₦{{ formatCurrency(feeComparison?.savings) }}</p>
          </div>
          <div
            v-for="(item, idx) in feeComparison?.platforms || []"
            :key="idx"
            class="bg-gray-50 rounded-xl p-4"
          >
            <p class="text-xs text-gray-500">{{ item.name || 'Platform' }}</p>
            <p class="text-xl font-semibold text-gray-900">₦{{ formatCurrency(item.fees) }}</p>
            <p class="text-xs text-gray-500 mt-1">Rate: {{ item.rate ? `${item.rate}%` : 'N/A' }}</p>
          </div>
        </div>
      </section>

      <!-- Commission Insights -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Commission Insights</h2>
            <p class="text-sm text-gray-500">Last {{ commissionMonths }} months</p>
          </div>
          <span v-if="insightsLoading" class="text-xs text-gray-400">Loading...</span>
          <div class="flex items-center gap-3">
            <UiSelectInput
              v-model="commissionMonths"
              label=""
              :options="commissionMonthsOptions"
              option-label="label"
              option-value="value"
              placeholder="Select months"
            />
            <button
              @click="refreshCommissionInsights"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Refresh
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Bookings</p>
            <p class="text-lg font-semibold text-gray-900">{{ commissionInsights?.breakdown?.totalBookings ?? 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Direct Booking %</p>
            <p class="text-lg font-semibold text-gray-900">{{ commissionInsights?.breakdown?.directPercentage ?? 0 }}%</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Marketplace Commissions</p>
            <p class="text-lg font-semibold text-gray-900">₦{{ formatCurrency(commissionInsights?.breakdown?.marketplaceCommissions) }}</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Recommendations</h3>
          <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li v-for="(rec, idx) in commissionInsights?.recommendations || []" :key="idx">
              {{ rec }}
            </li>
            <li v-if="!(commissionInsights?.recommendations?.length)">
              No recommendations yet.
            </li>
          </ul>
        </div>
      </section>

      <!-- Reports -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Financial Reports</h2>
          <p class="text-sm text-gray-500">Generate, view, and export reports</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900">Generate Report</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <UiAnimatedInput v-model="reportStart" type="date" label="Start date" placeholder="" />
              </div>
              <div>
                <UiAnimatedInput v-model="reportEnd" type="date" label="End date" placeholder="" />
              </div>
              <div>
                <UiSelectInput
                  v-model="reportPeriod"
                  label="Report period"
                  :options="reportPeriodOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select period"
                />
              </div>
            </div>
            <button
              @click="handleGenerateReport"
              :disabled="generateLoading"
              class="w-full h-10 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="generateLoading">Generating...</span>
              <span v-else>Generate report</span>
            </button>
            <p v-if="generatedReportId" class="text-xs text-gray-500">
              Latest report ID: <span class="font-mono">{{ generatedReportId }}</span>
            </p>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900">Fetch / Export Report</h3>
            <div>
              <UiAnimatedInput v-model="reportId" type="text" label="Report ID" placeholder="Paste report ID" />
            </div>
            <div class="flex gap-3">
              <button
                @click="handleFetchReport"
                :disabled="reportLoading"
                class="flex-1 h-10 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="reportLoading">Loading...</span>
                <span v-else>View report</span>
              </button>
              <button
                @click="handleExportReport"
                :disabled="exportLoading"
                class="flex-1 h-10 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="exportLoading">Exporting...</span>
                <span v-else>Export CSV</span>
              </button>
            </div>
            <div v-if="reportData" class="text-xs text-gray-600">
              <p class="font-semibold text-gray-900 mb-1">Report Summary</p>
              <p>Total bookings: {{ reportData.totalBookings ?? 0 }}</p>
              <p>Gross revenue: ₦{{ formatCurrency(reportData.revenue?.grossRevenue) }}</p>
              <p>Net revenue: ₦{{ formatCurrency(reportData.revenue?.netRevenue) }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
// import AnalyticsChartCard from '@/components/analytics/AnalyticsChartCard.vue'
import { useFetchDashboardMetrics } from '@/composables/modules/analytics/useFetchDashboardMetrics'
import { useFetchRevenueTrends } from '@/composables/modules/analytics/useFetchRevenueTrends'
import { useFetchCommissionBreakdown } from '@/composables/modules/analytics/useFetchCommissionBreakdown'
import { useFetchQuickStats } from '@/composables/modules/analytics/useFetchQuickStats'
import { useFetchFeeComparison } from '@/composables/modules/analytics/useFetchFeeComparison'
import { useFetchSourcePerformance } from '@/composables/modules/analytics/useFetchSourcePerformance'
import { useFetchCommissionInsights } from '@/composables/modules/analytics/useFetchCommissionInsights'
import { useGenerateFinancialReport } from '@/composables/modules/analytics/useGenerateFinancialReport'
import { useGetFinancialReport } from '@/composables/modules/analytics/useGetFinancialReport'
import { useExportFinancialReportCsv } from '@/composables/modules/analytics/useExportFinancialReportCsv'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const formatDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatCurrency = (value?: number) => {
  if (!value && value !== 0) return '0.00'
  return Number(value).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const today = new Date()
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(today.getDate() - 30)

const rangeStart = ref(formatDateInput(thirtyDaysAgo))
const rangeEnd = ref(formatDateInput(today))
const granularity = ref<'daily' | 'weekly' | 'monthly'>('daily')

const reportStart = ref(rangeStart.value)
const reportEnd = ref(rangeEnd.value)
const reportPeriod = ref('custom')

const reportId = ref('')
const generatedReportId = ref('')

const commissionMonths = ref(3)

// Options arrays for select inputs
const granularityOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
]

const commissionMonthsOptions = [
  { label: '3 months', value: 3 },
  { label: '6 months', value: 6 },
  { label: '12 months', value: 12 }
]

const reportPeriodOptions = [
  { label: 'Custom', value: 'custom' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' }
]

const { data: dashboardData, execute: fetchDashboardMetrics, loading: dashboardLoading } = useFetchDashboardMetrics()
const { data: revenueTrends, execute: fetchRevenueTrends, loading: revenueLoading } = useFetchRevenueTrends()
const { data: commissionBreakdown, execute: fetchCommissionBreakdown, loading: commissionLoading } = useFetchCommissionBreakdown()
const { data: quickStatsData, execute: fetchQuickStats, loading: quickStatsLoading } = useFetchQuickStats()
const { data: feeComparison, execute: fetchFeeComparison, loading: feeLoading } = useFetchFeeComparison()
const { data: sourcePerformance, execute: fetchSourcePerformance, loading: sourceLoading } = useFetchSourcePerformance()
const { data: commissionInsights, execute: fetchCommissionInsights, loading: insightsLoading } = useFetchCommissionInsights()

// --- ChartCard computed props for template ---
const revenueBreakdownLabels = ['Gross', 'Net', 'Commissions', 'Processing', 'Refunds']
const revenueBreakdownValues = computed(() => [
  revenueTrends.value?.revenue?.gross || 0,
  revenueTrends.value?.revenue?.net || 0,
  revenueTrends.value?.revenue?.commissions || 0,
  revenueTrends.value?.revenue?.processingFees || 0,
  revenueTrends.value?.revenue?.refunds || 0
])
const revenueBreakdownKey = computed(() => 'revenue-breakdown-' + revenueBreakdownValues.value.join('-'))

const sourcePerformanceLabels = computed(() => (sourcePerformance.value?.sources || []).map((s: any) => s.sourceType || s.source || 'N/A'))
const sourcePerformanceValues = computed(() => (sourcePerformance.value?.sources || []).map((s: any) => s.revenue || 0))
const sourcePerformanceKey = computed(() => 'source-performance-' + sourcePerformanceValues.value.join('-'))

const commissionMixLabels = computed(() => (commissionBreakdown.value?.bySource || []).map((s: any) => s.source || 'N/A'))
const commissionMixValues = computed(() => (commissionBreakdown.value?.bySource || []).map((s: any) => s.commission || 0))
const commissionMixKey = computed(() => 'commission-mix-' + commissionMixValues.value.join('-'))

const selectedChartDetail = ref<any>(null)
function showChartDetail(detail: any) {
  selectedChartDetail.value = detail
}

const { execute: generateReport, loading: generateLoading } = useGenerateFinancialReport()
const { data: reportData, execute: getReport, loading: reportLoading } = useGetFinancialReport()
const { execute: exportReportCsv, loading: exportLoading } = useExportFinancialReportCsv()

const refreshRangeAnalytics = async () => {
  await Promise.all([
    fetchRevenueTrends(rangeStart.value, rangeEnd.value, granularity.value),
    fetchCommissionBreakdown(rangeStart.value, rangeEnd.value),
    fetchSourcePerformance(rangeStart.value, rangeEnd.value)
  ])
}

const refreshQuickStats = async () => {
  await Promise.all([
    fetchQuickStats(),
    fetchDashboardMetrics(),
    fetchFeeComparison()
  ])
}

const refreshCommissionInsights = async () => {
  await fetchCommissionInsights(commissionMonths.value)
}

const handleGenerateReport = async () => {
  const report = await generateReport({
    startDate: reportStart.value,
    endDate: reportEnd.value,
    reportPeriod: reportPeriod.value
  })
  generatedReportId.value = report?.id || report?._id || ''
  if (generatedReportId.value) {
    reportId.value = generatedReportId.value
  }
}

const handleFetchReport = async () => {
  if (!reportId.value) return
  await getReport(reportId.value)
}

const handleExportReport = async () => {
  if (!reportId.value) return
  await exportReportCsv(reportId.value, { filename: `financial-report-${reportId.value}.csv` })
}

onMounted(async () => {
  await Promise.all([
    refreshQuickStats(),
    refreshRangeAnalytics(),
    refreshCommissionInsights()
  ])
})
// ...existing script setup code remains unchanged...
</script>
