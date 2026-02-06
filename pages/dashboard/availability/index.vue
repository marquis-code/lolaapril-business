<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Availability Management</h1>
          <p class="text-gray-500 mt-1">View and manage your business availability</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="showBusinessHoursModal = true"
            class="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ hasBusinessHours ? 'Edit Hours' : 'Set Hours' }}
          </button>
          <button
            @click="fetchSummary"
            :disabled="summaryLoading"
            class="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            <svg v-if="summaryLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ summary?.summary?.totalDates ?? 0 }}</p>
              <p class="text-xs text-gray-500">Total Days</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ summary?.summary?.datesWithAvailability ?? 0 }}</p>
              <p class="text-xs text-gray-500">Available Days</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ summary?.summary?.datesFullyBooked ?? 0 }}</p>
              <p class="text-xs text-gray-500">Fully Booked</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ totalSlotsCount }}</p>
              <p class="text-xs text-gray-500">Total Slots</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Calendar Section -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Date Range Selector -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Availability Calendar</h2>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                  <input
                    v-model="summaryStart"
                    type="date"
                    class="rounded-lg border-gray-200 text-sm focus:border-black focus:ring-black"
                  />
                  <span class="text-gray-400">to</span>
                  <input
                    v-model="summaryEnd"
                    type="date"
                    class="rounded-lg border-gray-200 text-sm focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded bg-green-500"></div>
                <span class="text-xs text-gray-600">High Availability (>75%)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded bg-yellow-500"></div>
                <span class="text-xs text-gray-600">Medium (50-75%)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded bg-orange-500"></div>
                <span class="text-xs text-gray-600">Low (25-50%)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded bg-red-500"></div>
                <span class="text-xs text-gray-600">Almost Full (&lt;25%)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded bg-gray-200"></div>
                <span class="text-xs text-gray-600">Fully Booked</span>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="summaryLoading" class="grid grid-cols-7 gap-2">
              <div v-for="n in 35" :key="n" class="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
            </div>

            <!-- Calendar Grid -->
            <div v-else-if="calendarData.length > 0">
              <!-- Week Headers -->
              <div class="grid grid-cols-7 gap-2 mb-2">
                <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="text-center text-xs font-medium text-gray-500 py-2">
                  {{ day }}
                </div>
              </div>
              
              <!-- Calendar Days -->
              <div class="grid grid-cols-7 gap-2">
                <!-- Empty slots for alignment -->
                <div v-for="n in calendarStartOffset" :key="'empty-'+n" class="aspect-square"></div>
                
                <!-- Actual days -->
                <div
                  v-for="(slot, idx) in calendarData"
                  :key="idx"
                  @click="selectDate(slot)"
                  class="aspect-square rounded-xl cursor-pointer transition-all hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center p-1 relative group"
                  :class="getSlotColorClass(slot)"
                >
                  <span class="text-sm font-semibold" :class="slot.availableSlotCount === 0 ? 'text-gray-400' : 'text-white'">
                    {{ getDayNumber(slot.date) }}
                  </span>
                  <span class="text-[10px] mt-0.5" :class="slot.availableSlotCount === 0 ? 'text-gray-400' : 'text-white/80'">
                    {{ slot.availableSlotCount }}/{{ slot.totalSlots }}
                  </span>
                  
                  <!-- Tooltip -->
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    <div class="font-semibold">{{ formatDate(slot.date) }}</div>
                    <div>Available: {{ slot.availableSlotCount }} slots</div>
                    <div>Booked: {{ slot.takenSlotCount }} slots</div>
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="py-16 text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No availability data</h3>
              <p class="text-sm text-gray-500">Select a date range to view availability</p>
            </div>
          </div>

          <!-- Selected Date Details -->
          <div v-if="selectedSlot" class="bg-white rounded-2xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ formatDateFull(selectedSlot.date) }}</h3>
              <button @click="selectedSlot = null" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-green-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-green-700">{{ selectedSlot.availableSlotCount }}</p>
                <p class="text-xs text-green-600 mt-1">Available Slots</p>
              </div>
              <div class="bg-blue-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-blue-700">{{ selectedSlot.totalSlots }}</p>
                <p class="text-xs text-blue-600 mt-1">Total Slots</p>
              </div>
              <div class="bg-orange-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-orange-700">{{ selectedSlot.takenSlotCount }}</p>
                <p class="text-xs text-orange-600 mt-1">Booked Slots</p>
              </div>
              <div class="bg-purple-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-purple-700">{{ getAvailabilityPercentage(selectedSlot) }}%</p>
                <p class="text-xs text-purple-600 mt-1">Available</p>
              </div>
            </div>

            <!-- Availability Bar -->
            <div class="mt-4">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-600">Utilization</span>
                <span class="font-medium text-gray-900">{{ 100 - getAvailabilityPercentage(selectedSlot) }}%</span>
              </div>
              <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="getUtilizationBarColor(selectedSlot)"
                  :style="{ width: `${100 - getAvailabilityPercentage(selectedSlot)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Business Hours Card -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">Business Hours</h3>
              <button
                @click="showBusinessHoursModal = true"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
            
            <div v-if="hasBusinessHours" class="space-y-2">
              <div
                v-for="day in businessHoursSchedule"
                :key="day.day"
                class="flex items-center justify-between py-2 px-3 rounded-lg"
                :class="day.isOpen ? 'bg-green-50' : 'bg-gray-50'"
              >
                <span class="text-sm font-medium" :class="day.isOpen ? 'text-green-700' : 'text-gray-400'">
                  {{ capitalize(day.day).slice(0, 3) }}
                </span>
                <span v-if="day.isOpen" class="text-xs text-green-600">
                  {{ formatTime(day.openTime) }} - {{ formatTime(day.closeTime) }}
                </span>
                <span v-else class="text-xs text-gray-400">Closed</span>
              </div>
            </div>
            <div v-else class="py-8 text-center">
              <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-gray-500">No hours set</p>
              <button
                @click="showBusinessHoursModal = true"
                class="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Configure now
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div class="space-y-3">
              <button
                @click="showBlockTimeModal = true"
                class="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Block Time</p>
                  <p class="text-xs text-gray-500">Mark time as unavailable</p>
                </div>
              </button>

              <button
                @click="showExtendModal = true"
                class="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Extend Availability</p>
                  <p class="text-xs text-gray-500">Add more available days</p>
                </div>
              </button>

              <button
                @click="showInitializeModal = true"
                class="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Initialize Availability</p>
                  <p class="text-xs text-gray-500">Set up 24/7 availability</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Availability Chart -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Availability Overview</h3>
            <ClientOnly>
              <div v-if="summary?.slots?.length">
                <AnalyticsChartCard
                  title=""
                  type="doughnut"
                  dataset-label="Status"
                  :labels="['Available', 'Booked']"
                  :values="[totalAvailableSlots, totalBookedSlots]"
                  class="!border-0 !p-0 !shadow-none"
                />
              </div>
              <div v-else class="py-8 text-center">
                <svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
                <p class="text-sm text-gray-400">No data available</p>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientOnly>
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Daily Slot Availability</h3>
            <div v-if="summary?.slots?.length">
              <AnalyticsChartCard
                title=""
                type="bar"
                dataset-label="Available Slots"
                :labels="chartLabels"
                :values="chartAvailableValues"
                class="!border-0 !p-0 !shadow-none"
              />
            </div>
            <div v-else class="h-64 flex items-center justify-center">
              <p class="text-sm text-gray-400">No data to display</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Booking Utilization Trend</h3>
            <div v-if="summary?.slots?.length">
              <AnalyticsChartCard
                title=""
                type="line"
                dataset-label="Utilization %"
                :labels="chartLabels"
                :values="chartUtilizationValues"
                class="!border-0 !p-0 !shadow-none"
              />
            </div>
            <div v-else class="h-64 flex items-center justify-center">
              <p class="text-sm text-gray-400">No data to display</p>
            </div>
          </div>
        </ClientOnly>
      </div>

      <!-- Business Hours Modal -->
      <BusinessHoursModal
        :open="showBusinessHoursModal"
        :schedule="businessHoursSchedule"
        :loading="saveHoursLoading"
        @close="showBusinessHoursModal = false"
        @save="handleSaveBusinessHours"
      />

      <!-- Block Time Modal -->
      <div v-if="showBlockTimeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-md w-full">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Block Time</h2>
            <button @click="showBlockTimeModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Staff (optional)</label>
              <select
                v-model="blockStaffId"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="">Block my own time</option>
                <option v-for="staff in staffOptions" :key="staff.value" :value="staff.value">
                  {{ staff.label }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Leave empty to block your own time</p>
            </div>
            <UiAnimatedInput v-model="blockDate" type="date" label="Date" required />
            <div class="grid grid-cols-2 gap-4">
              <UiAnimatedInput v-model="blockStart" type="time" label="Start Time" required />
              <UiAnimatedInput v-model="blockEnd" type="time" label="End Time" required />
            </div>
            <UiAnimatedInput v-model="blockReason" type="text" label="Reason" placeholder="e.g., Meeting, Lunch break" />
          </div>
          <div class="p-6 border-t border-gray-100 flex gap-3 justify-end">
            <button @click="showBlockTimeModal = false" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button
              @click="handleBlockTime"
              :disabled="blockMyLoading || blockStaffLoading || !canBlockTime"
              class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
            >
              {{ blockMyLoading || blockStaffLoading ? 'Blocking...' : 'Block Time' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Extend Availability Modal -->
      <div v-if="showExtendModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-md w-full">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Extend Availability</h2>
            <button @click="showExtendModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Staff (optional)</label>
              <select
                v-model="extendStaffId"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="">All Staff</option>
                <option v-for="staff in staffOptions" :key="staff.value" :value="staff.value">
                  {{ staff.label }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Leave empty to extend for all staff</p>
            </div>
            <UiAnimatedInput v-model.number="extendDays" type="number" label="Days Ahead" placeholder="90" />
          </div>
          <div class="p-6 border-t border-gray-100 flex gap-3 justify-end">
            <button @click="showExtendModal = false" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button
              @click="handleExtendAndClose"
              :disabled="extendLoading || !extendDays"
              class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
            >
              {{ extendLoading ? 'Extending...' : 'Extend Availability' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Initialize Business Modal -->
      <div v-if="showInitializeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Initialize Business Availability</h2>
            <button @click="showInitializeModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto flex-1">
            <div class="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              <p class="font-medium mb-1">24/7 Availability Setup</p>
              <p class="text-blue-600">This will set up full-time availability for the selected staff members.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Select Staff Members</label>
              <div v-if="staffOptions.length > 0" class="space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-3">
                <label
                  v-for="staff in staffOptions"
                  :key="staff.value"
                  class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="staff.value"
                    v-model="selectedStaffIds"
                    class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span class="text-sm text-gray-900">{{ staff.label }}</span>
                </label>
              </div>
              <div v-else class="text-sm text-gray-500 py-4 text-center">
                No staff members found. Please add staff first.
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ selectedStaffIds.length }} staff selected</p>
            </div>
          </div>
          <div class="p-6 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0">
            <button @click="showInitializeModal = false" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button
              @click="handleInitializeAndClose"
              :disabled="initializeLoading || selectedStaffIds.length === 0"
              class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
            >
              {{ initializeLoading ? 'Initializing...' : 'Initialize' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useBusinessWorkingHours } from '@/composables/modules/availability/useBusinessWorkingHours'
import { useGetAllSlots } from '@/composables/modules/availability/useGetAllSlots'
import { useBlockStaffTime } from '@/composables/modules/availability/useBlockStaffTime'
import { useBlockMyTime } from '@/composables/modules/availability/useBlockMyTime'
import { useExtendAvailability } from '@/composables/modules/availability/useExtendAvailability'
import { useInitializeBusinessAvailability } from '@/composables/modules/availability/useInitializeBusinessAvailability'
import { useStaff } from '@/composables/modules/useStaff'
import type { Staff } from '@/types/staff'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

interface Break {
  openTime: string
  closeTime: string
}

interface DaySchedule {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
  breaks: Break[]
}

interface SlotData {
  date: string
  hasSlots: boolean
  availableSlotCount: number
  takenSlotCount: number
  totalSlots: number
  staffAvailable: number
}

const { businessId } = useUser()

// Staff list for dropdowns
const { staffList, loading: staffLoading, fetchStaff } = useStaff()
const staffOptions = computed(() => {
  return staffList.value.map((staff: Staff) => ({
    label: `${staff.firstName} ${staff.lastName}`,
    value: staff._id
  }))
})

const {
  data: businessHoursData,
  loading: businessHoursLoading,
  error: businessHoursError,
  fetchWorkingHours,
  createWorkingHours,
  updateWorkingHours
} = useBusinessWorkingHours()

const showBusinessHoursModal = ref(false)
const showBlockTimeModal = ref(false)
const showExtendModal = ref(false)
const showInitializeModal = ref(false)
const saveHoursLoading = ref(false)
const businessHoursSchedule = ref<DaySchedule[]>([])
const selectedSlot = ref<SlotData | null>(null)

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}:${minutes} ${ampm}`
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

const formatDateFull = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getDayNumber = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).getDate()
}

const hasBusinessHours = computed(() => businessHoursSchedule.value.length > 0)

const loadBusinessHours = async () => {
  await fetchWorkingHours()
  
  if (businessHoursData.value) {
    if (Array.isArray(businessHoursData.value)) {
      businessHoursSchedule.value = businessHoursData.value
    } else if (businessHoursData.value.schedule) {
      businessHoursSchedule.value = businessHoursData.value.schedule
    }
  }
  
  // Initialize default schedule if empty
  if (businessHoursSchedule.value.length === 0) {
    businessHoursSchedule.value = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ].map(day => ({
      day,
      isOpen: false,
      openTime: '',
      closeTime: '',
      breaks: []
    }))
  }
}

const handleSaveBusinessHours = async (schedule: DaySchedule[]) => {
  saveHoursLoading.value = true
  try {
    if (businessHoursData.value && (businessHoursData.value._id || businessHoursData.value.id)) {
      await updateWorkingHours(schedule)
    } else {
      await createWorkingHours(schedule)
    }
    await loadBusinessHours()
    showBusinessHoursModal.value = false
  } catch (error) {
    console.error('Error saving business hours:', error)
  } finally {
    saveHoursLoading.value = false
  }
}

// Availability Summary
const summaryStart = ref('')
const summaryEnd = ref('')
const { data: summary, loading: summaryLoading, execute: getSummary } = useGetAllSlots()

const fetchSummary = async () => {
  if (!summaryStart.value || !summaryEnd.value) return
  await getSummary({
    startDate: summaryStart.value,
    endDate: summaryEnd.value,
    businessId: businessId.value || undefined
  })
}

// Calendar data
const calendarData = computed(() => summary.value?.slots || [])

const calendarStartOffset = computed(() => {
  if (!calendarData.value.length) return 0
  const firstDate = new Date(calendarData.value[0].date)
  return firstDate.getDay() // 0 = Sunday, 1 = Monday, etc.
})

const totalSlotsCount = computed(() => {
  return calendarData.value.reduce((sum: number, slot: SlotData) => sum + (slot.totalSlots || 0), 0)
})

const totalAvailableSlots = computed(() => {
  return calendarData.value.reduce((sum: number, slot: SlotData) => sum + (slot.availableSlotCount || 0), 0)
})

const totalBookedSlots = computed(() => {
  return calendarData.value.reduce((sum: number, slot: SlotData) => sum + (slot.takenSlotCount || 0), 0)
})

const getAvailabilityPercentage = (slot: SlotData) => {
  if (!slot.totalSlots) return 0
  return Math.round((slot.availableSlotCount / slot.totalSlots) * 100)
}

const getSlotColorClass = (slot: SlotData) => {
  const percentage = getAvailabilityPercentage(slot)
  if (slot.availableSlotCount === 0) return 'bg-gray-200'
  if (percentage >= 75) return 'bg-green-500'
  if (percentage >= 50) return 'bg-yellow-500'
  if (percentage >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

const getUtilizationBarColor = (slot: SlotData) => {
  const utilization = 100 - getAvailabilityPercentage(slot)
  if (utilization >= 75) return 'bg-red-500'
  if (utilization >= 50) return 'bg-orange-500'
  if (utilization >= 25) return 'bg-yellow-500'
  return 'bg-green-500'
}

const selectDate = (slot: SlotData) => {
  selectedSlot.value = slot
}

// Chart data - limit to 14 days for better visibility
const chartLabels = computed(() => {
  return calendarData.value.slice(0, 14).map((s: SlotData) => {
    const d = new Date(s.date)
    return `${d.getDate()}/${d.getMonth() + 1}`
  })
})

const chartAvailableValues = computed(() => {
  return calendarData.value.slice(0, 14).map((s: SlotData) => s.availableSlotCount || 0)
})

const chartUtilizationValues = computed(() => {
  return calendarData.value.slice(0, 14).map((s: SlotData) => {
    if (!s.totalSlots) return 0
    return Math.round((s.takenSlotCount / s.totalSlots) * 100)
  })
})

const summaryChartData = computed(() => {
  const slots = summary.value?.slots || []
  return slots.slice(0, 7).map((slot: any) => ({
    date: slot.date,
    available: slot.availableSlotCount || 0,
    total: slot.totalSlots || 0,
    staff: slot.staffAvailable || 0
  }))
})

const summaryChartLabels = computed(() => summaryChartData.value.map((s: any) => formatDate(s.date)))
const summaryChartValues = computed(() => summaryChartData.value.map((s: any) => s.available))
const staffChartLabels = computed(() => summaryChartData.value.map((s: any) => formatDate(s.date)))
const staffChartValues = computed(() => summaryChartData.value.map((s: any) => s.staff))

// Block Time
const blockStaffId = ref('')
const blockDate = ref('')
const blockStart = ref('')
const blockEnd = ref('')
const blockReason = ref('')

const { loading: blockStaffLoading, execute: blockStaffTime } = useBlockStaffTime()
const { loading: blockMyLoading, execute: blockMyTime } = useBlockMyTime()

const canBlockTime = computed(() => 
  blockDate.value && blockStart.value && blockEnd.value
)

const canBlockStaffTime = computed(() => 
  canBlockTime.value && blockStaffId.value
)

const handleBlockTime = async () => {
  if (!canBlockTime.value) return
  
  try {
    if (blockStaffId.value) {
      await blockStaffTime({
        staffId: blockStaffId.value,
        date: blockDate.value,
        startTime: blockStart.value,
        endTime: blockEnd.value,
        reason: blockReason.value || undefined
      })
    } else {
      await blockMyTime({
        date: blockDate.value,
        startTime: blockStart.value,
        endTime: blockEnd.value,
        reason: blockReason.value || undefined
      })
    }
    // Clear form and close modal
    blockStaffId.value = ''
    blockDate.value = ''
    blockStart.value = ''
    blockEnd.value = ''
    blockReason.value = ''
    showBlockTimeModal.value = false
    // Refresh summary
    await fetchSummary()
  } catch (error) {
    console.error('Error blocking time:', error)
  }
}

const handleBlockStaffTime = async () => {
  if (!canBlockStaffTime.value) return
  
  try {
    await blockStaffTime({
      staffId: blockStaffId.value,
      date: blockDate.value,
      startTime: blockStart.value,
      endTime: blockEnd.value,
      reason: blockReason.value || undefined
    })
    // Clear form
    blockStaffId.value = ''
    blockDate.value = ''
    blockStart.value = ''
    blockEnd.value = ''
    blockReason.value = ''
    // Refresh summary
    await fetchSummary()
  } catch (error) {
    console.error('Error blocking staff time:', error)
  }
}

const handleBlockMyTime = async () => {
  if (!canBlockTime.value) return
  
  try {
    await blockMyTime({
      date: blockDate.value,
      startTime: blockStart.value,
      endTime: blockEnd.value,
      reason: blockReason.value || undefined
    })
    // Clear form
    blockDate.value = ''
    blockStart.value = ''
    blockEnd.value = ''
    blockReason.value = ''
    // Refresh summary
    await fetchSummary()
  } catch (error) {
    console.error('Error blocking my time:', error)
  }
}

// Extend Availability
const extendStaffId = ref('')
const extendDays = ref(90)
const { loading: extendLoading, execute: extendAvailability } = useExtendAvailability()

const handleExtendAvailability = async () => {
  try {
    await extendAvailability({
      staffId: extendStaffId.value || undefined,
      daysAhead: extendDays.value || undefined
    })
    // Refresh summary
    await fetchSummary()
  } catch (error) {
    console.error('Error extending availability:', error)
  }
}

const handleExtendAndClose = async () => {
  await handleExtendAvailability()
  showExtendModal.value = false
}

// Initialize Business
const selectedStaffIds = ref<string[]>([])
const { loading: initializeLoading, execute: initializeBusiness } = useInitializeBusinessAvailability()

const handleInitializeBusiness = async () => {
  if (!selectedStaffIds.value.length) return

  try {
    await initializeBusiness({ staffIds: selectedStaffIds.value })
    selectedStaffIds.value = []
    // Refresh summary
    await fetchSummary()
  } catch (error) {
    console.error('Error initializing business:', error)
  }
}

const handleInitializeAndClose = async () => {
  await handleInitializeBusiness()
  showInitializeModal.value = false
}

// Initialize dates on mount
const initializeDates = () => {
  const today = new Date()
  const future = new Date()
  future.setDate(today.getDate() + 30)
  summaryStart.value = today.toISOString().slice(0, 10)
  summaryEnd.value = future.toISOString().slice(0, 10)
}

// Watch for date changes
watch([summaryStart, summaryEnd], ([newStart, newEnd]: [string, string]) => {
  if (newStart && newEnd && new Date(newStart) <= new Date(newEnd)) {
    fetchSummary()
  }
})

onMounted(() => {
  loadBusinessHours()
  initializeDates()
  fetchSummary()
  fetchStaff()
})
</script>