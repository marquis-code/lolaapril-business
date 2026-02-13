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
            :disabled="loading || detailsLoading"
            class="h-10 px-6 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <span v-if="loading || detailsLoading">Loading...</span>
            <span v-else>Apply Filter</span>
          </button>
        </div>
      </section>

      <!-- Tabs -->
      <div class="flex border-b border-gray-100">
        <button 
          @click="activeTab = 'performance'"
          class="px-6 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === 'performance' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'"
        >
          Page Performance
          <div v-if="activeTab === 'performance'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
        </button>
        <button 
          @click="activeTab = 'logs'"
          class="px-6 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === 'logs' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'"
        >
          Detailed Logs
          <div v-if="activeTab === 'logs'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
        </button>
      </div>

      <div v-if="activeTab === 'performance'" class="space-y-8">
        <!-- Summary Cards -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-50 rounded-xl text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Page Views</p>
                <h4 class="text-2xl font-bold text-gray-900">{{ formatNumber(totalViews) }}</h4>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-purple-50 rounded-xl text-purple-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Visitors</p>
                <h4 class="text-2xl font-bold text-gray-900">{{ formatNumber(totalUniqueVisitors) }}</h4>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-green-50 rounded-xl text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Engagement</p>
                <h4 class="text-2xl font-bold text-gray-900">{{ avgEngagement }}%</h4>
              </div>
            </div>
          </div>
        </section>

        <!-- Top Pages Chart -->
        <section v-if="data.length" class="grid grid-cols-1 gap-6">
          <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Page Performance Breakdown</h3>
              <p class="text-sm text-gray-500">{{ filteredData.length }} pages matching criteria</p>
            </div>
            <div class="relative max-w-sm w-full">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search pages..." 
                class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50/50">
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Page Information</th>
                  <th @click="sortBy('views')" class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors group">
                    <div class="flex items-center gap-1">
                      Views
                      <span v-if="sortKey === 'views'" class="text-primary">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
                      <span v-else class="opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
                    </div>
                  </th>
                  <th @click="sortBy('uniqueVisitors')" class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors group">
                    <div class="flex items-center gap-1">
                      Visitors
                      <span v-if="sortKey === 'uniqueVisitors'" class="text-primary">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
                      <span v-else class="opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Top Locations</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Engagement</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="page in sortedData" :key="page.pagePath" class="hover:bg-gray-50/80 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900 line-clamp-1">{{ page.title || 'Untitled Page' }}</div>
                        <div class="text-xs text-gray-400 mt-0.5 font-mono truncate max-w-[200px]">{{ page.pagePath }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700 font-semibold">{{ formatNumber(page.views) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ formatNumber(page.uniqueVisitors) }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex flex-col items-end gap-1">
                      <div v-for="(loc, idx) in page.topLocations?.slice(0, 2)" :key="idx" class="text-[10px] text-gray-500 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                        {{ loc.city }}, {{ loc.country }}
                      </div>
                      <span v-if="page.topLocations?.length > 2" class="text-[10px] text-gray-400 italic">
                        +{{ page.topLocations.length - 2 }} more
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-3">
                      <span class="text-xs font-bold" :class="getEngagementColor(calculateEngagement(page))">
                        {{ calculateEngagement(page) }}%
                      </span>
                      <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-500" 
                          :class="getEngagementBg(calculateEngagement(page))"
                          :style="{ width: calculateEngagement(page) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'logs'" class="space-y-8">
        <!-- Granular Logs Table -->
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Detailed Traffic Logs</h3>
              <p class="text-sm text-gray-500">{{ granularData.length }} interaction logs recorded</p>
            </div>
            <div class="relative max-w-sm w-full">
              <input 
                v-model="logsSearchQuery" 
                type="text" 
                placeholder="Search by IP, Page, Device..." 
                class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50/50">
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Page</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor Info (IP & Device)</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Location</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="log in filteredLogs" :key="log._id" class="hover:bg-gray-50/80 transition-colors">
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 font-medium">{{ formatDateFull(log.timestamp) }}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-wider">{{ formatTime(log.timestamp) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 font-medium line-clamp-1">{{ log.pageTitle || 'Untitled' }}</div>
                    <div class="text-xs text-gray-400 font-mono truncate max-w-[150px]">{{ log.pagePath }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1">
                      <div class="text-sm text-gray-700 font-mono">{{ log.ip }}</div>
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600">
                          {{ log.userAgent?.browser }} ({{ log.userAgent?.os }})
                        </span>
                        <span class="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600 capitalize">
                          {{ log.userAgent?.device }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div v-if="log.location" class="flex flex-col items-end">
                      <div class="text-sm text-gray-900 font-medium">{{ log.location.city }}, {{ log.location.region }}</div>
                      <div class="text-xs text-gray-500">{{ log.location.country }}</div>
                    </div>
                    <div v-else class="text-xs text-gray-400 italic">Unknown Location</div>
                  </td>
                </tr>
                <tr v-if="!filteredLogs.length && !detailsLoading">
                  <td colspan="4" class="px-6 py-20 text-center text-gray-400">
                    No detailed logs found for the selected criteria.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFetchTrafficPages } from '@/composables/modules/analytics/useFetchTrafficPages'
import { useFetchTrafficDetails } from '@/composables/modules/analytics/useFetchTrafficDetails'
import AnalyticsChartCard from '@/components/analytics/ChartCard.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { data, loading, execute } = useFetchTrafficPages()
const { data: granularData, loading: detailsLoading, execute: executeDetails } = useFetchTrafficDetails()

const getMonthDates = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const formatDate = (date: Date) => {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay)
  }
}

const dates = getMonthDates()
const startDate = ref(dates.start)
const endDate = ref(dates.end)
const activeTab = ref('performance')
const searchQuery = ref('')
const logsSearchQuery = ref('')

const sortKey = ref('views')
const sortOrder = ref<'asc' | 'desc'>('desc')

const totalViews = computed(() => data.value.reduce((acc, curr) => acc + (curr.views || 0), 0))
const totalUniqueVisitors = computed(() => data.value.reduce((acc, curr) => acc + (curr.uniqueVisitors || 0), 0))
const avgEngagement = computed(() => {
  if (!data.value.length) return 0
  const total = data.value.reduce((acc, curr) => acc + calculateEngagement(curr), 0)
  return Math.round(total / data.value.length)
})

const filteredData = computed(() => {
  if (!searchQuery.value) return data.value
  const query = searchQuery.value.toLowerCase()
  return data.value.filter(p => 
    (p.title && p.title.toLowerCase().includes(query)) || 
    (p.pagePath && p.pagePath.toLowerCase().includes(query))
  )
})

const filteredLogs = computed(() => {
  if (!logsSearchQuery.value) return granularData.value
  const query = logsSearchQuery.value.toLowerCase()
  return granularData.value.filter(l => 
    (l.ip && l.ip.toLowerCase().includes(query)) || 
    (l.pagePath && l.pagePath.toLowerCase().includes(query)) ||
    (l.userAgent?.browser && l.userAgent.browser.toLowerCase().includes(query)) ||
    (l.userAgent?.os && l.userAgent.os.toLowerCase().includes(query)) ||
    (l.location?.city && l.location.city.toLowerCase().includes(query)) ||
    (l.location?.country && l.location.country.toLowerCase().includes(query))
  )
})

const fetchData = async () => {
  await Promise.all([
    execute(startDate.value, endDate.value),
    executeDetails(startDate.value, endDate.value)
  ])
}

const formatNumber = (val: number) => val?.toLocaleString() || '0'

const formatDateFull = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const calculateEngagement = (page: any) => {
  if (!page.views) return 0
  return Math.round((page.interactions / page.views) * 100)
}

const getEngagementColor = (val: number) => {
  if (val > 50) return 'text-green-600'
  if (val > 20) return 'text-blue-600'
  return 'text-gray-600'
}

const getEngagementBg = (val: number) => {
  if (val > 50) return 'bg-green-500'
  if (val > 20) return 'bg-blue-500'
  return 'bg-gray-400'
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
  return [...filteredData.value].sort((a, b) => {
    const valA = a[sortKey.value] || 0
    const valB = b[sortKey.value] || 0
    return sortOrder.value === 'desc' ? valB - valA : valA - valB
  })
})

const topTenLabels = computed(() => {
  return [...data.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)
    .map(p => p.title || p.pagePath)
})

const topTenValues = computed(() => {
  return [...data.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)
    .map(p => p.views || 0)
})

onMounted(fetchData)
</script>
