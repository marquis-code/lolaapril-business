<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <section class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Traffic Analytics</h2>
          <p class="text-sm text-gray-500">Track page performance and user interactions</p>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <div>
            <UiAnimatedInput v-model="startDate" type="date" label="Start Date" placeholder="" />
          </div>
          <div>
            <UiAnimatedInput v-model="endDate" type="date" label="End Date" placeholder="" />
          </div>
          <button
            @click="fetchData"
            :disabled="loading"
            class="h-10 px-6 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <span v-if="loading">Loading...</span>
            <span v-else>Apply Filter</span>
          </button>
        </div>
      </section>

      <!-- Top Pages Chart -->
      <section v-if="data.length" class="grid grid-cols-1 gap-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <ClientOnly>
            <AnalyticsChartCard
              title="Top 10 Pages by Views"
              subtitle="Comparison of most visited pages"
              type="bar"
              dataset-label="Page Views"
              :labels="topTenLabels"
              :values="topTenValues"
              :loading="loading"
            />
          </ClientOnly>
        </div>
      </section>

      <!-- Table View -->
      <section class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Page Performance Breakdown</h3>
          <div class="text-sm text-gray-500">{{ data.length }} pages tracked</div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Page Information</th>
                <th @click="sortBy('views')" class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors">
                  Views <span v-if="sortKey === 'views'">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
                </th>
                <th @click="sortBy('uniqueVisitors')" class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors">
                  Unique Visitors <span v-if="sortKey === 'uniqueVisitors'">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
                </th>
                <th @click="sortBy('interactions')" class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors">
                  Interactions <span v-if="sortKey === 'interactions'">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
                </th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Engagement Rate</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="page in sortedData" :key="page.pagePath" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">{{ page.title }}</div>
                  <div class="text-xs text-gray-500 mt-1 font-mono">{{ page.pagePath }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 font-semibold">{{ formatNumber(page.views) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatNumber(page.uniqueVisitors) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatNumber(page.interactions) }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-2 bg-gray-100 rounded-full max-w-[100px]">
                      <div 
                        class="h-full bg-primary rounded-full" 
                        :style="{ width: calculateEngagement(page) + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs font-medium text-gray-500">{{ calculateEngagement(page) }}%</span>
                  </div>
                </td>
              </tr>
              <tr v-if="!data.length && !loading">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p class="text-gray-500">No traffic data found for the selected period.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFetchTrafficPages } from '@/composables/modules/analytics/useFetchTrafficPages'
import AnalyticsChartCard from '@/components/analytics/ChartCard.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { data, loading, execute } = useFetchTrafficPages()

const today = new Date()
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(today.getDate() - 30)

const formatDate = (date: Date) => date.toISOString().split('T')[0]

const startDate = ref(formatDate(thirtyDaysAgo))
const endDate = ref(formatDate(today))

const sortKey = ref('views')
const sortOrder = ref<'asc' | 'desc'>('desc')

const fetchData = async () => {
  await execute(startDate.value, endDate.value)
}

const formatNumber = (val: number) => val.toLocaleString()

const calculateEngagement = (page: any) => {
  if (!page.views) return 0
  return Math.round((page.interactions / page.views) * 100)
}

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

const sortedData = computed(() => {
  return [...data.value].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    return sortOrder.value === 'desc' ? valB - valA : valA - valB
  })
})

const topTenLabels = computed(() => {
  return sortedData.value.slice(0, 10).map(p => p.title || p.pagePath)
})

const topTenValues = computed(() => {
  return sortedData.value.slice(0, 10).map(p => p.views)
})

onMounted(fetchData)
</script>
