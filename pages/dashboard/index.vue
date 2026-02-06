<template>
  <div class="p-8 min-h-screen">
    <div class="flex flex-col gap-2 mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Business Dashboard</h1>
      <p class="text-gray-600">Monitor performance, bookings, and revenue across your business.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="card in metricCards" :key="card.label" class="bg-white rounded-2xl p-5 border-[0.5px] border-gray-100 -sm">
        <div class="text-xs font-semibold text-gray-400 uppercase">{{ card.label }}</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ card.value }}</div>
        <div v-if="card.sub" class="text-xs text-gray-500 mt-1">{{ card.sub }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 border-[0.5px] border-gray-100 -sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold">Revenue trend</h2>
            <p class="text-xs text-gray-500">Daily revenue for the last {{ rangeLabel }}</p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <button
              v-for="option in rangeOptions"
              :key="option.value"
              @click="setRange(option.value)"
              class="px-3 py-1 rounded-full border"
              :class="selectedRange === option.value ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600'"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="mt-6">
          <ClientOnly>
            <apexchart
              type="area"
              height="200"
              :options="revenueChartOptions"
              :series="revenueChartSeries"
            />
          </ClientOnly>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 border-[0.5px] border-gray-100 -sm">
        <h2 class="text-lg font-semibold">Booking volume</h2>
        <p class="text-xs text-gray-500">Bookings trend (same period)</p>
        <div class="mt-6">
          <ClientOnly>
            <apexchart
              type="line"
              height="160"
              :options="bookingChartOptions"
              :series="bookingChartSeries"
            />
          </ClientOnly>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-xs text-gray-500">Upcoming</p>
            <p class="font-semibold text-gray-900">{{ upcomingBookingsCount }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Completed</p>
            <p class="font-semibold text-gray-900">{{ completedAppointments }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 border-[0.5px] border-gray-100 -sm">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Upcoming appointments</h2>
          <NuxtLink to="/dashboard/appointments" class="text-xs text-gray-500 hover:text-gray-900">View all</NuxtLink>
        </div>
        <div class="mt-4 space-y-4">
          <div v-for="appointment in upcomingAppointments" :key="appointment._id" class="flex items-center justify-between border border-gray-100 rounded-xl p-4">
            <div>
              <p class="font-medium text-gray-900">{{ appointment.businessInfo?.businessName || 'Business' }}</p>
              <p class="text-xs text-gray-500">
                {{ formatDate(appointment.appointmentDetails?.date || appointment.selectedDate) }} · {{ appointment.serviceDetails?.serviceName || 'Services' }}
              </p>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              {{ appointment.status || 'confirmed' }}
            </span>
          </div>
          <div v-if="!upcomingAppointments.length" class="text-sm text-gray-500">No upcoming appointments.</div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 border-[0.5px] border-gray-100 -sm">
        <h2 class="text-lg font-semibold">Recent bookings</h2>
        <div class="mt-4 space-y-4">
          <div v-for="booking in recentBookings" :key="booking._id" class="border border-gray-100 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-900">{{ booking.clientName }}</p>
              <span class="text-xs text-gray-500">{{ formatDate(booking.createdAt) }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ booking.services?.[0]?.serviceName || 'Service' }}</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">{{ booking.status }}</span>
              <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(totalForBooking(booking)) }}</span>
            </div>
          </div>
          <div v-if="!recentBookings.length" class="text-sm text-gray-500">No recent bookings.</div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="mt-8 text-sm text-gray-500">Refreshing metrics...</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DashboardMetrics, RevenueChartData } from '~/types/growth'
import type { Booking } from '~/types/booking'
import { useAnalytics } from '@/composables/modules/useAnalytics'
import { useBooking } from '@/composables/modules/useBooking'
import { useGetAppointmentStats } from '@/composables/modules/appointment/useGetAppointmentStats'
import { useGetAppointments } from '@/composables/modules/appointment/useGetAppointments'

definePageMeta({
  layout: 'dashboard'
})

const { dashboardMetrics, loading: analyticsLoading, fetchDashboardMetrics, fetchRevenueTrends } = useAnalytics()
const { bookings, loading: bookingLoading, fetchUpcomingBookings, fetchBookings } = useBooking()
const { data: appointmentStats, loading: appointmentStatsLoading, execute: fetchAppointmentStats } = useGetAppointmentStats()
const { data: appointments, loading: appointmentsLoading, execute: fetchAppointments } = useGetAppointments()

const trends = ref<RevenueChartData[]>([])
const selectedRange = ref('14d')

const rangeOptions = [
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' }
]

const rangeLabel = computed(() => selectedRange.value.replace('d', ' days'))

const metricCards = computed(() => {
  const metrics: DashboardMetrics | null = dashboardMetrics.value
  const overview = appointmentStats.value?.overview || {}
  return [
    {
      label: 'Today bookings',
      value: overview?.todayAppointments ?? metrics?.today?.bookings ?? 0,
      sub: 'Appointments scheduled today'
    },
    {
      label: 'Today revenue',
      value: formatCurrency(metrics?.today?.revenue ?? 0),
      sub: 'Gross revenue today'
    },
    {
      label: 'Month-to-date revenue',
      value: formatCurrency(metrics?.monthToDate?.revenue ?? 0),
      sub: `Bookings: ${metrics?.monthToDate?.bookings ?? 0}`
    },
    {
      label: 'Pending appointments',
      value: overview?.pending ?? metrics?.pending?.bookings ?? 0,
      sub: `Confirmed: ${overview?.confirmed ?? 0}`
    }
  ]
})

const upcomingAppointments = computed(() => (appointments.value || []).slice(0, 5))
const recentBookings = computed(() => (bookings.value || []).slice(0, 5))

const upcomingBookingsCount = computed(() => bookings.value?.length || 0)
const completedAppointments = computed(() => appointmentStats.value?.overview?.completed || 0)

const loading = computed(() =>
  analyticsLoading.value || bookingLoading.value || appointmentStatsLoading.value || appointmentsLoading.value
)

// ApexCharts configuration for Revenue Chart
const revenueChartSeries = computed(() => [{
  name: 'Revenue',
  data: revenueValues.value
}])

const revenueChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 200,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#7c3aed'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0,
      stops: [0, 100]
    }
  },
  grid: {
    borderColor: '#f3f4f6',
    strokeDashArray: 4
  },
  xaxis: {
    categories: trends.value.map((_: any, idx: number) => `Day ${idx + 1}`),
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' }
    }
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' },
      formatter: (value: number) => formatCurrency(value)
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => formatCurrency(value)
    }
  }
}))

// ApexCharts configuration for Booking Chart
const bookingChartSeries = computed(() => [{
  name: 'Bookings',
  data: bookingValues.value
}])

const bookingChartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 160,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#0f172a'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  grid: {
    borderColor: '#f3f4f6',
    strokeDashArray: 4
  },
  xaxis: {
    categories: trends.value.map((_: any, idx: number) => `Day ${idx + 1}`),
    labels: {
      style: { colors: '#9ca3af', fontSize: '10px' }
    }
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af', fontSize: '10px' }
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => `${value} bookings`
    }
  }
}))

const revenueValues = computed(() => {
  const series = buildSeries(trends.value, 'revenue')
  console.log('Revenue values for chart:', series)
  return series
})

const bookingValues = computed(() => {
  const series = buildSeries(trends.value, 'bookings')
  console.log('Booking values for chart:', series)
  return series
})

const setRange = async (value: string) => {
  selectedRange.value = value
  await loadTrends()
}

const loadTrends = async () => {
  const days = Number(selectedRange.value.replace('d', ''))
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  try {
    console.log(`Loading trends for ${days} days from ${startDate.toISOString()} to ${endDate.toISOString()}`)
    const data = await fetchRevenueTrends(startDate.toISOString(), endDate.toISOString(), 'daily')
    console.log('Revenue trends API response:', JSON.stringify(data, null, 2))
    
    // Handle both array response (time series) and single aggregate object
    if (Array.isArray(data)) {
      trends.value = data
      console.log('Set trends from array:', trends.value.length, 'items')
    } else if (data && typeof data === 'object') {
      // Single aggregate response - spread across time period for visualization
      const aggregateValue = {
        date: data?.period?.end || endDate.toISOString(),
        revenue: data?.revenue?.gross ?? 0,
        bookings: data?.bookings?.total ?? 0
      }
      console.log('Creating trend array from aggregate:', aggregateValue)
      
      // Create array with same values for smooth line rendering
      trends.value = Array(days).fill(null).map((_, idx) => ({
        date: new Date(startDate.getTime() + idx * 24 * 60 * 60 * 1000).toISOString(),
        revenue: aggregateValue.revenue,
        bookings: aggregateValue.bookings
      }))
      console.log('Set trends from aggregate:', trends.value.length, 'items')
    } else {
      console.warn('No valid data received from API')
      trends.value = []
    }
  } catch (error: any) {
    console.error('Error loading trends:', error.response?.data || error.message)
    // Create fallback data with zeros to at least show something
    trends.value = []
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
}

const formatDate = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString()
}

const totalForBooking = (booking: Booking) => {
  // totalAmount is always present per Booking interface
  return booking.totalAmount || 0
}

const buildSeries = (data: RevenueChartData[], key: 'revenue' | 'bookings') => {
  if (!data.length) {
    console.log(`buildSeries: no data for ${key}, returning zeros`)
    return [0, 0, 0, 0, 0, 0, 0]
  }
  if (data.length === 1) {
    console.log(`buildSeries: single data point for ${key}:`, data[0][key])
    return new Array(7).fill(data[0][key] || 0)
  }
  const series = data.map(item => item[key] || 0)
  console.log(`buildSeries: ${key} series:`, series)
  return series
}

onMounted(async () => {
  await Promise.all([
    fetchDashboardMetrics(),
    fetchUpcomingBookings(7),
    fetchBookings({ limit: 5 }),
    fetchAppointmentStats(),
    fetchAppointments({ status: 'confirmed', limit: 5 })
  ])
  await loadTrends()
})
</script>
