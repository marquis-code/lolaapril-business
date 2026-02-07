<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Stats -->
      <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-if="statsLoading" class="animate-pulse">
          <div class="bg-gray-200 rounded-xl h-24"></div>
        </div>
        <template v-else>
          <div class="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#005967]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[#005967]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ stats?.overview?.total || 0 }}</p>
                <p class="text-xs text-gray-500">Total Appointments</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#005967]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[#005967]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ stats?.overview?.upcoming || 0 }}</p>
                <p class="text-xs text-gray-500">Upcoming</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#005967]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[#005967]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ stats?.overview?.completed || 0 }}</p>
                <p class="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#005967]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[#005967]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ stats?.overview?.cancelled || 0 }}</p>
                <p class="text-xs text-gray-500">Cancelled</p>
              </div>
            </div>
          </div>
        </template>
      </section>

      <!-- Filters -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Appointments Calendar</h2>
            <p class="text-sm text-gray-500">View and manage appointments</p>
          </div>
          <div class="flex flex-wrap items-end gap-3">
            <div class="min-w-[160px]">
              <UiSelectInput
                v-model="filterStatus"
                label="Status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                placeholder="All Statuses"
              />
            </div>
            <div class="min-w-[160px]">
              <UiSelectInput
                v-model="filterStaff"
                label="Staff Member"
                :options="staffOptions"
                option-label="label"
                option-value="value"
                placeholder="All Staff"
              />
            </div>
            <div class="min-w-[140px]">
              <label class="block text-xs font-medium text-gray-700 mb-1">Go to Date</label>
              <input
                v-model="goToDateInput"
                type="date"
                @change="navigateToDate"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-[#005967] focus:ring-[#005967] focus:ring-1 outline-none"
              />
            </div>
            <button
              @click="handleTodayClick"
              class="h-10 px-4 rounded-lg text-sm font-medium text-[#005967] border border-[#005967]/30 hover:bg-[#005967]/5 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </section>

      <!-- Calendar -->
      <section class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-4">
            <button
              @click="previousMonth"
              class="p-2 rounded-lg hover:bg-[#005967]/5 text-gray-600 hover:text-[#005967] transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 class="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
              {{ currentMonthYear }}
            </h3>
            <button
              @click="nextMonth"
              class="p-2 rounded-lg hover:bg-[#005967]/5 text-gray-600 hover:text-[#005967] transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <div class="w-2.5 h-2.5 rounded-full bg-[#005967]"></div>
              <span>Confirmed</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <div class="w-2.5 h-2.5 rounded-full bg-[#005967]/40"></div>
              <span>Pending</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <div class="w-2.5 h-2.5 rounded-full bg-[#005967]/70"></div>
              <span>Completed</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <div class="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-6 space-y-4 animate-pulse">
          <div class="grid grid-cols-7 gap-2">
            <div v-for="n in 35" :key="n" class="bg-gray-200 rounded-lg h-24"></div>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div v-else class="p-6">
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 gap-2 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-center text-xs font-semibold text-gray-500 py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="day in calendarDays"
              :key="day.key"
              :class="[
                'relative border rounded-xl p-2 min-h-[100px] transition-all',
                day.isCurrentMonth ? 'bg-white border-gray-200 hover:border-[#005967]/30' : 'bg-gray-50/50 border-gray-100',
                day.isToday ? 'ring-2 ring-[#005967] border-[#005967]' : '',
                day.appointments.length > 0 ? 'cursor-pointer hover:shadow-md' : ''
              ]"
              @click="day.appointments.length > 0 ? openDayDetails(day) : null"
            >
              <!-- Date Number -->
              <div class="flex items-center justify-between mb-1">
                <span
                  :class="[
                    'text-sm font-medium',
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                    day.isToday ? 'text-[#005967] font-bold' : ''
                  ]"
                >
                  {{ day.date }}
                </span>
                <span
                  v-if="day.appointments.length > 0"
                  class="text-xs font-semibold text-[#005967] bg-[#005967]/10 px-2 py-0.5 rounded-full"
                >
                  {{ day.appointments.length }}
                </span>
              </div>

              <!-- Appointment Dots -->
              <div class="space-y-1">
                <div
                  v-for="(appointment, idx) in day.appointments.slice(0, 3)"
                  :key="idx"
                  :class="[
                    'text-xs p-1.5 rounded truncate',
                    getAppointmentColor(appointment.status)
                  ]"
                >
                  <div class="flex items-center gap-1">
                    <div :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', getAppointmentDotColor(appointment.status)]"></div>
                    <span class="truncate">{{ appointment.selectedTime }}</span>
                  </div>
                </div>
                <div
                  v-if="day.appointments.length > 3"
                  class="text-xs text-gray-500 text-center"
                >
                  +{{ day.appointments.length - 3 }} more
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredAppointments.length === 0" class="py-16 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p class="text-sm text-gray-500">Try adjusting your filters or select a different date range.</p>
        </div>
      </section>

      <!-- Charts -->
      <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ClientOnly>
          <!-- Loading skeleton for charts -->
          <template v-if="loading">
            <div v-for="n in 3" :key="n" class="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-64 bg-gray-200 rounded"></div>
            </div>
          </template>

          <!-- Charts -->
          <template v-else>
            <AnalyticsChartCard
              title="Status Mix"
              subtitle="Appointments by status"
              type="doughnut"
              dataset-label="Appointments"
              :labels="statusChartLabels"
              :values="statusChartValues"
            />

            <AnalyticsChartCard
              title="Volume by Day"
              subtitle="Top 7 days"
              type="bar"
              dataset-label="Appointments"
              :labels="volumeChartLabels"
              :values="volumeChartValues"
            />

            <AnalyticsChartCard
              title="Revenue by Day"
              subtitle="Top 7 days"
              type="bar"
              dataset-label="Revenue"
              :labels="revenueChartLabels"
              :values="revenueChartValues"
            />
          </template>
        </ClientOnly>
      </section>
    </div>

    <!-- Day Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedDay"
          class="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
          @click.self="selectedDay = null"
        >
          <div class="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Appointments on {{ selectedDay.fullDate }}</h3>
                <p class="text-xs text-gray-500">{{ selectedDay.appointments.length }} appointment(s)</p>
              </div>
              <button @click="selectedDay = null" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-6 space-y-3">
              <div
                v-for="appointment in selectedDay.appointments"
                :key="appointment._id || appointment.id"
                class="border border-gray-200 rounded-xl p-4 hover:border-primary/50 cursor-pointer transition-colors"
                @click="openAppointmentDetails(appointment)"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-sm font-semibold text-gray-900">{{ appointment.selectedTime }}</span>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusBadge(appointment.status)">
                        {{ appointment.status || 'pending' }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500">{{ appointment.appointmentNumber }}</p>
                  </div>
                  <button class="text-primary text-xs font-semibold">View Details</button>
                </div>

                <div class="space-y-2">
                  <div>
                    <p class="text-xs text-gray-500">Services</p>
                    <p class="text-sm text-gray-900">
                      {{ appointment.selectedServices?.map(s => s.serviceName).join(', ') || appointment.serviceDetails?.serviceName || '—' }}
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500">Duration</p>
                      <p class="text-sm text-gray-900">
                        {{ appointment.totalDuration?.hours || 0 }}h {{ appointment.totalDuration?.minutes || 0 }}m
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Total</p>
                      <p class="text-sm font-semibold text-gray-900">
                        ₦{{ (appointment.paymentDetails?.total?.amount || appointment.serviceDetails?.price?.amount || 0).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Appointment Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedAppointment"
          class="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
          @click.self="selectedAppointment = null"
        >
          <div class="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Appointment Details</h3>
                <p class="text-xs text-gray-500">{{ selectedAppointment.appointmentNumber }}</p>
              </div>
              <button @click="selectedAppointment = null" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-6 space-y-4">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Business</p>
                <p class="font-semibold text-gray-900">{{ selectedAppointment.businessInfo?.businessName || 'Business' }}</p>
                <p class="text-xs text-gray-500">{{ selectedAppointment.businessInfo?.address || '—' }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Date & Time</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatDate(selectedAppointment.selectedDate || selectedAppointment.appointmentDetails?.date) }}
                  </p>
                  <p class="text-sm text-gray-700">{{ selectedAppointment.selectedTime || selectedAppointment.appointmentDetails?.startTime }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Duration</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ selectedAppointment.totalDuration?.hours || 0 }}h {{ selectedAppointment.totalDuration?.minutes || 0 }}m
                  </p>
                </div>
              </div>

              <div>
                <p class="text-xs text-gray-500 mb-2">Services</p>
                <div class="space-y-2">
                  <div
                    v-for="(service, idx) in selectedAppointment.selectedServices"
                    :key="idx"
                    class="bg-gray-50 rounded-lg p-3"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ service.serviceName }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ service.selectedOption?.description }}</p>
                      </div>
                      <p class="text-sm font-semibold text-gray-900">
                        ₦{{ service.selectedOption?.price?.amount?.toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-4">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-sm text-gray-500">Subtotal</p>
                  <p class="text-sm text-gray-900">₦{{ (selectedAppointment.paymentDetails?.subtotal?.amount || 0).toLocaleString() }}</p>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <p class="text-sm text-gray-500">Tax</p>
                  <p class="text-sm text-gray-900">₦{{ (selectedAppointment.paymentDetails?.tax?.amount || 0).toLocaleString() }}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                  <p class="text-base font-semibold text-gray-900">Total</p>
                  <p class="text-lg font-bold text-gray-900">₦{{ (selectedAppointment.paymentDetails?.total?.amount || 0).toLocaleString() }}</p>
                </div>
              </div>

              <div>
                <p class="text-xs text-gray-500">Payment Method</p>
                <p class="text-sm font-medium text-gray-900 capitalize">{{ selectedAppointment.paymentDetails?.paymentMethod || '—' }}</p>
              </div>

              <div v-if="selectedAppointment.customerNotes">
                <p class="text-xs text-gray-500">Customer Notes</p>
                <p class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1">{{ selectedAppointment.customerNotes }}</p>
              </div>

              <div>
                <p class="text-xs text-gray-500 mb-2">Status</p>
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold" :class="statusBadge(selectedAppointment.status)">
                  {{ selectedAppointment.status || 'pending' }}
                </span>
              </div>

              <div class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <span>Created: {{ formatDate(selectedAppointment.createdAt) }}</span>
                <span>Updated: {{ formatDate(selectedAppointment.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useGetAppointments } from '@/composables/modules/appointment/useGetAppointments'
import { useGetAppointmentStats } from '@/composables/modules/appointment/useGetAppointmentStats'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const filterStatus = ref('')
const filterStaff = ref('')
const currentDate = ref(new Date())
const goToDateInput = ref('')

const selectedDay = ref<any>(null)
const selectedAppointment = ref<any>(null)

const { data: appointmentList, loading, execute: fetchAppointments } = useGetAppointments()
const { data: stats, loading: statsLoading, execute: fetchStats } = useGetAppointmentStats()

const appointments = computed(() => appointmentList.value || [])

// Status options for select
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'No Show', value: 'no_show' }
]

// Mock staff list - replace with actual staff data
const staffList = computed(() => {
  const staffMap = new Map()
  appointments.value.forEach((a: any) => {
    const staffId = a.staffId || a.staff?.id
    const staffName = a.staff?.fullName || a.staffName || staffId
    if (staffId && !staffMap.has(staffId)) {
      staffMap.set(staffId, { id: staffId, name: staffName })
    }
  })
  return Array.from(staffMap.values())
})

// Staff options for select
const staffOptions = computed(() => {
  return [
    { label: 'All Staff', value: '' },
    ...staffList.value.map((staff: any) => ({
      label: staff.name,
      value: staff.id
    }))
  ]
})

const filteredAppointments = computed(() => {
  return appointments.value.filter((appointment: any) => {
    const statusMatch = !filterStatus.value || appointment.status === filterStatus.value
    const staffMatch = !filterStaff.value || appointment.staffId === filterStaff.value || appointment.staff?.id === filterStaff.value
    return statusMatch && staffMatch
  })
})

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const days: any[] = []
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i
    const dayDate = new Date(year, month - 1, date)
    days.push({
      date,
      fullDate: dayDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      appointments: [],
      key: `prev-${date}`
    })
  }
  
  // Current month days
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let date = 1; date <= daysInMonth; date++) {
    const dayDate = new Date(year, month, date)
    const dateString = dayDate.toISOString().split('T')[0]
    const isToday = dayDate.getTime() === today.getTime()
    
    const dayAppointments = filteredAppointments.value.filter((apt: any) => {
      const aptDate = (apt.selectedDate || apt.appointmentDetails?.date || '').split('T')[0]
      return aptDate === dateString
    })
    
    days.push({
      date,
      fullDate: dateString,
      isCurrentMonth: true,
      isToday,
      appointments: dayAppointments,
      key: `curr-${date}`
    })
  }
  
  // Next month days
  const remainingDays = 42 - days.length // 6 weeks * 7 days
  for (let date = 1; date <= remainingDays; date++) {
    const dayDate = new Date(year, month + 1, date)
    days.push({
      date,
      fullDate: dayDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      appointments: [],
      key: `next-${date}`
    })
  }
  
  return days
})

const statusChartLabels = computed(() => ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])

const statusChartValues = computed(() => {
  const counts: Record<string, number> = {}
  statusChartLabels.value.forEach(status => {
    counts[status] = 0
  })
  filteredAppointments.value.forEach((a: any) => {
    const key = (a.status || 'pending').toLowerCase()
    counts[key] = (counts[key] || 0) + 1
  })
  return statusChartLabels.value.map(label => counts[label] || 0)
})

const volumeChartData = computed(() => {
  const totals: Record<string, number> = {}
  filteredAppointments.value.forEach((a: any) => {
    const date = (a.selectedDate || a.appointmentDetails?.date || '').split('T')[0]
    if (!date) return
    totals[date] = (totals[date] || 0) + 1
  })
  return Object.entries(totals)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7)
    .reverse()
})

const volumeChartLabels = computed(() => volumeChartData.value.map(([date]) => date))
const volumeChartValues = computed(() => volumeChartData.value.map(([, value]) => value))

const revenueChartData = computed(() => {
  const totals: Record<string, number> = {}
  filteredAppointments.value.forEach((a: any) => {
    const date = (a.selectedDate || a.appointmentDetails?.date || '').split('T')[0]
    if (!date) return
    const amount = Number(a.paymentDetails?.total?.amount || a.serviceDetails?.price?.amount || 0)
    totals[date] = (totals[date] || 0) + amount
  })
  return Object.entries(totals)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7)
    .reverse()
})

const revenueChartLabels = computed(() => revenueChartData.value.map(([date]) => date))
const revenueChartValues = computed(() => revenueChartData.value.map(([, value]) => value))

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const handleTodayClick = () => {
  currentDate.value = new Date()
  goToDateInput.value = ''
}

const navigateToDate = () => {
  if (goToDateInput.value) {
    const selectedDate = new Date(goToDateInput.value)
    currentDate.value = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  }
}

const openDayDetails = (day: any) => {
  selectedDay.value = day
}

const openAppointmentDetails = (appointment: any) => {
  selectedAppointment.value = appointment
  selectedDay.value = null
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const statusBadge = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':
      return 'bg-[#005967]/10 text-[#005967]'
    case 'completed':
      return 'bg-[#005967]/20 text-[#004450]'
    case 'cancelled':
      return 'bg-gray-100 text-gray-600'
    case 'no_show':
      return 'bg-gray-200 text-gray-700'
    default:
      return 'bg-[#005967]/5 text-[#005967]/80'
  }
}

const getAppointmentColor = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':
      return 'bg-[#005967]/10 text-[#005967]'
    case 'completed':
      return 'bg-[#005967]/20 text-[#004450]'
    case 'cancelled':
      return 'bg-gray-100 text-gray-500'
    case 'no_show':
      return 'bg-gray-200 text-gray-600'
    default:
      return 'bg-[#005967]/5 text-[#005967]/70'
  }
}

const getAppointmentDotColor = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':
      return 'bg-[#005967]'
    case 'completed':
      return 'bg-[#005967]/70'
    case 'cancelled':
      return 'bg-gray-300'
    case 'no_show':
      return 'bg-gray-400'
    default:
      return 'bg-[#005967]/40'
  }
}

const refreshAppointments = async () => {
await fetchAppointments({})
await fetchStats()
}
// Auto-refresh when filters change
watch([filterStatus, filterStaff], () => {
// Filters are applied reactively via computed properties
// No need to refetch - calendar will update automatically
})
onMounted(async () => {
await refreshAppointments()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>