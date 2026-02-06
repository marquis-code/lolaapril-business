<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p class="text-sm text-gray-500 mt-1">View and manage all customer bookings</p>
        </div>
        <button
          @click="refreshBookings"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Stats Cards -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-400">Total</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-3">{{ trends?.bookings?.total || stats?.totalBookings || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">All bookings</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-green-500">Completed</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-3">{{ trends?.bookings?.completed || stats?.completedBookings || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Successfully completed</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span class="text-xs font-medium text-red-500">Cancelled</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-3">{{ trends?.bookings?.cancelled || stats?.cancelledBookings || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Cancelled bookings</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-blue-500">Revenue</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-3">₦{{ formatCurrency(trends?.revenue?.gross || stats?.totalRevenue || 0) }}</p>
          <p class="text-xs text-gray-500 mt-1">Avg: ₦{{ formatCurrency(trends?.bookings?.averageValue || 0) }}</p>
        </div>
      </section>

      <!-- Filters & Search -->
      <section class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex flex-col lg:flex-row lg:items-center gap-4">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by client name, email, or booking number..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="min-w-[140px]">
              <UiSelectInput
                v-model="filterStatus"
                label=""
                :options="filterStatusOptions"
                option-label="label"
                option-value="value"
                placeholder="All Status"
              />
            </div>
            <div class="min-w-[100px]">
              <UiSelectInput
                v-model="pageSize"
                label=""
                :options="pageSizeOptions"
                option-label="label"
                option-value="value"
              />
            </div>
            <button
              @click="refreshBookings"
              class="h-10 px-4 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      <!-- Bookings Table -->
      <section class="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p class="text-sm font-medium text-gray-900">Booking List</p>
            <p class="text-xs text-gray-500">{{ filteredBookings.length }} booking(s) found</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              @click="quickFilterStatus = tab.value"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              :class="quickFilterStatus === tab.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p class="text-sm text-gray-500 mt-4">Loading bookings...</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50/50 text-left">
                <th class="py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Booking</th>
                <th class="py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Client</th>
                <th class="py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Services</th>
                <th class="py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Schedule</th>
                <th class="py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                <th class="py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th class="py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="booking in filteredBookings"
                :key="booking._id"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <!-- Booking Number -->
                <td class="py-4 px-6">
                  <p class="font-mono text-xs font-semibold text-primary">{{ booking.bookingNumber || '—' }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ formatDateShort(booking.createdAt) }}</p>
                </td>

                <!-- Client Info -->
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm font-semibold text-primary">{{ getInitials(booking.clientName) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 truncate">{{ booking.clientName || 'Unknown' }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ booking.clientEmail || booking.clientPhone || '—' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Services -->
                <td class="py-4 px-6">
                  <div class="max-w-[200px]">
                    <p class="font-medium text-gray-900 truncate">
                      {{ booking.services?.[0]?.serviceName || '—' }}
                    </p>
                    <p v-if="booking.services?.length > 1" class="text-xs text-gray-500">
                      +{{ booking.services.length - 1 }} more service(s)
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ booking.totalDuration || 0 }} min</p>
                  </div>
                </td>

                <!-- Schedule -->
                <td class="py-4 px-6">
                  <p class="font-medium text-gray-900">{{ formatDateShort(booking.preferredDate) }}</p>
                  <p class="text-xs text-gray-500">{{ booking.preferredStartTime }} - {{ booking.estimatedEndTime }}</p>
                </td>

                <!-- Amount -->
                <td class="py-4 px-6">
                  <p class="font-semibold text-gray-900">₦{{ formatCurrency(booking.estimatedTotal || 0) }}</p>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span 
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                      :class="booking.depositPaid ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'"
                    >
                      {{ booking.depositPaid ? 'Deposit Paid' : 'No Deposit' }}
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="py-4 px-6">
                  <span 
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="getStatusBadgeClass(booking.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(booking.status)"></span>
                    {{ formatStatus(booking.status) }}
                  </span>
                  <p v-if="booking.firstTimeClient" class="text-xs text-blue-600 mt-1">🆕 New Client</p>
                </td>

                <!-- Actions -->
                <td class="py-4 px-6 text-right">
                  <button
                    @click="openBookingModal(booking)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    View Details
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredBookings.length === 0">
                <td colspan="7" class="py-16 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-gray-500 font-medium">No bookings found</p>
                    <p class="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ClientOnly>
          <AnalyticsChartCard
            title="Booking Status Distribution"
            subtitle="Current status breakdown"
            type="doughnut"
            dataset-label="Bookings"
            :labels="statusChartLabels"
            :values="statusChartValues"
          />
        </ClientOnly>

        <ClientOnly>
          <AnalyticsChartCard
            title="Daily Revenue"
            subtitle="Last 7 days"
            type="bar"
            dataset-label="Revenue (₦)"
            :labels="revenueChartLabels"
            :values="revenueChartValues"
          />
        </ClientOnly>

        <ClientOnly>
          <AnalyticsChartCard
            title="Booking Volume"
            subtitle="Last 7 days"
            type="bar"
            dataset-label="Bookings"
            :labels="volumeChartLabels"
            :values="volumeChartValues"
          />
        </ClientOnly>
      </section>
    </div>

    <!-- Booking Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedBooking"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          @click.self="closeModal"
        >
          <div class="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getStatusBgClass(selectedBooking.status)">
                  <svg class="w-5 h-5" :class="getStatusIconClass(selectedBooking.status)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Booking Details</h3>
                  <p class="text-xs text-gray-500 font-mono">{{ selectedBooking.bookingNumber }}</p>
                </div>
              </div>
              <button @click="closeModal" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Tabs -->
            <div class="px-6 border-b border-gray-100 flex-shrink-0">
              <div class="flex gap-6">
                <button
                  v-for="tab in modalTabs"
                  :key="tab.id"
                  @click="activeModalTab = tab.id"
                  class="py-3 text-sm font-medium border-b-2 transition-colors"
                  :class="activeModalTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Overview Tab -->
              <div v-if="activeModalTab === 'overview'" class="space-y-6">
                <!-- Status Badge -->
                <div class="flex items-center justify-between p-4 rounded-xl" :class="getStatusBgClass(selectedBooking.status)">
                  <div class="flex items-center gap-3">
                    <span 
                      class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold"
                      :class="getStatusBadgeClass(selectedBooking.status)"
                    >
                      {{ formatStatus(selectedBooking.status) }}
                    </span>
                    <span v-if="selectedBooking.firstTimeClient" class="text-sm text-blue-600 font-medium">🆕 First-time client</span>
                  </div>
                  <p class="text-xs text-gray-500">Created {{ formatDateTime(selectedBooking.createdAt) }}</p>
                </div>

                <!-- Client Information -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Client Information</h4>
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span class="text-lg font-semibold text-primary">{{ getInitials(selectedBooking.clientName) }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-900">{{ selectedBooking.clientName }}</p>
                      <div class="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {{ selectedBooking.clientEmail }}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {{ selectedBooking.clientPhone }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Appointment Details -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-xl p-4">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date & Time</h4>
                    <p class="font-semibold text-gray-900">{{ formatDateFull(selectedBooking.preferredDate) }}</p>
                    <p class="text-sm text-gray-600">{{ selectedBooking.preferredStartTime }} - {{ selectedBooking.estimatedEndTime }}</p>
                    <p class="text-xs text-gray-400 mt-1">Duration: {{ selectedBooking.totalDuration }} min</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment</h4>
                    <p class="font-semibold text-gray-900">₦{{ formatCurrency(selectedBooking.estimatedTotal) }}</p>
                    <p class="text-sm text-gray-600">
                      {{ selectedBooking.requiresDeposit ? `Deposit: ₦${formatCurrency(selectedBooking.depositAmount)}` : 'No deposit required' }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ selectedBooking.depositPaid ? '✓ Deposit paid' : 'Pending payment' }}
                    </p>
                  </div>
                </div>

                <!-- Services List -->
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Services Booked</h4>
                  <div class="space-y-2">
                    <div 
                      v-for="service in selectedBooking.services" 
                      :key="service._id"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900">{{ service.serviceName }}</p>
                        <p class="text-xs text-gray-500">{{ service.duration }} min</p>
                      </div>
                      <p class="font-semibold text-gray-900">₦{{ formatCurrency(service.price) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Booking Source -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Booking Source</h4>
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white border border-gray-200">
                      {{ formatSourceType(selectedBooking.bookingSource?.sourceType) }}
                    </span>
                    <span class="text-xs text-gray-500">{{ selectedBooking.metadata?.platform || 'web' }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions Tab -->
              <div v-else-if="activeModalTab === 'actions'" class="space-y-6">
                <!-- Quick Status Actions -->
                <div v-if="canShowQuickActions" class="space-y-4">
                  <h4 class="text-sm font-semibold text-gray-900">Quick Actions</h4>
                  
                  <!-- Confirm Booking (for pending) -->
                  <div v-if="selectedBooking.status === 'pending'" class="p-4 border border-green-200 rounded-xl bg-green-50/50">
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="font-medium text-gray-900">Confirm Booking</p>
                        <p class="text-sm text-gray-500 mt-0.5">Approve this booking and notify the client</p>
                      </div>
                      <button
                        @click="handleConfirm"
                        :disabled="confirmLoading"
                        class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors"
                      >
                        {{ confirmLoading ? 'Confirming...' : 'Confirm' }}
                      </button>
                    </div>
                  </div>

                  <!-- Complete Booking (for confirmed) -->
                  <div v-if="selectedBooking.status === 'confirmed'" class="p-4 border border-blue-200 rounded-xl bg-blue-50/50">
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="font-medium text-gray-900">Mark as Complete</p>
                        <p class="text-sm text-gray-500 mt-0.5">Mark this appointment as successfully completed</p>
                      </div>
                      <button
                        @click="handleComplete"
                        :disabled="statusLoading"
                        class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors"
                      >
                        {{ statusLoading ? 'Updating...' : 'Complete' }}
                      </button>
                    </div>
                  </div>

                  <!-- Reject Booking (for pending) -->
                  <div v-if="selectedBooking.status === 'pending'" class="p-4 border border-gray-200 rounded-xl">
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="font-medium text-gray-900">Reject Booking</p>
                        <p class="text-sm text-gray-500 mt-0.5">Decline this booking request</p>
                      </div>
                      <button
                        @click="showRejectForm = !showRejectForm"
                        class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        {{ showRejectForm ? 'Cancel' : 'Reject' }}
                      </button>
                    </div>
                    <div v-if="showRejectForm" class="mt-4 space-y-3">
                      <UiAnimatedInput
                        v-model="reason"
                        type="textarea"
                        label="Reason for rejection"
                        :rows="2"
                      />
                      <button
                        @click="handleReject"
                        :disabled="rejectLoading || !reason"
                        class="w-full h-10 rounded-lg text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-60 transition-colors"
                      >
                        {{ rejectLoading ? 'Rejecting...' : 'Submit Rejection' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Reschedule Section -->
                <div v-if="canReschedule" class="space-y-4">
                  <h4 class="text-sm font-semibold text-gray-900">Reschedule</h4>
                  <div class="p-4 border border-gray-200 rounded-xl space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                      <UiAnimatedInput
                        v-model="rescheduleDate"
                        type="date"
                        label="New Date"
                      />
                      <UiAnimatedInput
                        v-model="rescheduleTime"
                        type="time"
                        label="New Time"
                      />
                    </div>
                    <UiAnimatedInput
                      v-model="rescheduleReason"
                      type="textarea"
                      label="Reason for rescheduling"
                      :rows="2"
                    />
                    <button
                      @click="handleReschedule"
                      :disabled="rescheduleLoading || !rescheduleDate || !rescheduleTime || !rescheduleReason"
                      class="w-full h-10 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                      {{ rescheduleLoading ? 'Rescheduling...' : 'Reschedule Booking' }}
                    </button>
                  </div>
                </div>

                <!-- Cancel Section -->
                <div v-if="canCancel" class="space-y-4">
                  <h4 class="text-sm font-semibold text-gray-900">Cancel Booking</h4>
                  <div class="p-4 border border-red-200 rounded-xl bg-red-50/30 space-y-4">
                    <p class="text-sm text-gray-600">This action cannot be undone. The client will be notified.</p>
                    <UiAnimatedInput
                      v-model="cancelReason"
                      type="textarea"
                      label="Reason for cancellation"
                      :rows="2"
                    />
                    <button
                      @click="handleCancel"
                      :disabled="cancelLoading || !cancelReason"
                      class="w-full h-10 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors"
                    >
                      {{ cancelLoading ? 'Cancelling...' : 'Cancel Booking' }}
                    </button>
                  </div>
                </div>

                <!-- Extend Expiry (for pending/expired) -->
                <div v-if="canExtend" class="space-y-4">
                  <h4 class="text-sm font-semibold text-gray-900">Extend Expiry</h4>
                  <div class="p-4 border border-yellow-200 rounded-xl bg-yellow-50/30 space-y-4">
                    <p class="text-sm text-gray-600">Give the client more time to complete their booking.</p>
                    <UiAnimatedInput
                      v-model="extendMinutes"
                      type="number"
                      label="Extend by (minutes)"
                    />
                    <button
                      @click="handleExtend"
                      :disabled="extendLoading"
                      class="w-full h-10 rounded-lg text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 transition-colors"
                    >
                      {{ extendLoading ? 'Extending...' : 'Extend Expiry' }}
                    </button>
                  </div>
                </div>

                <!-- Reset for Retry (for expired/payment_failed) -->
                <div v-if="canReset" class="space-y-4">
                  <h4 class="text-sm font-semibold text-gray-900">Reset Booking</h4>
                  <div class="p-4 border border-gray-200 rounded-xl space-y-4">
                    <p class="text-sm text-gray-600">Allow the client to retry their booking.</p>
                    <button
                      @click="handleResetRetry"
                      :disabled="resetLoading"
                      class="w-full h-10 rounded-lg text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-60 transition-colors"
                    >
                      {{ resetLoading ? 'Resetting...' : 'Reset for Retry' }}
                    </button>
                  </div>
                </div>

                <!-- No actions available message -->
                <div v-if="!canShowQuickActions && !canReschedule && !canCancel && !canExtend && !canReset" class="text-center py-8">
                  <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-gray-500">No actions available for this booking status</p>
                </div>
              </div>

              <!-- History Tab -->
              <div v-else-if="activeModalTab === 'history'" class="space-y-4">
                <div class="text-center py-8">
                  <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-gray-500">Booking history will appear here</p>
                  <p class="text-sm text-gray-400 mt-1">Track status changes and updates</p>
                </div>

                <!-- Booking metadata -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Activity Log</h4>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <div class="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                      <div>
                        <p class="text-sm text-gray-900">Booking created</p>
                        <p class="text-xs text-gray-500">{{ formatDateTime(selectedBooking.createdAt) }}</p>
                      </div>
                    </div>
                    <div v-if="selectedBooking.updatedAt !== selectedBooking.createdAt" class="flex items-start gap-3">
                      <div class="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div>
                        <p class="text-sm text-gray-900">Last updated</p>
                        <p class="text-xs text-gray-500">{{ formatDateTime(selectedBooking.updatedAt) }}</p>
                      </div>
                    </div>
                    <div v-if="selectedBooking.remindersSent > 0" class="flex items-start gap-3">
                      <div class="w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
                      <div>
                        <p class="text-sm text-gray-900">{{ selectedBooking.remindersSent }} reminder(s) sent</p>
                        <p v-if="selectedBooking.lastReminderAt" class="text-xs text-gray-500">
                          Last: {{ formatDateTime(selectedBooking.lastReminderAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFetchBookings } from '@/composables/modules/booking/useFetchBookings'
import { useFetchBookingStats } from '@/composables/modules/booking/useFetchBookingStats'
import { useConfirmBooking } from '@/composables/modules/booking/useConfirmBooking'
import { useRejectBooking } from '@/composables/modules/booking/useRejectBooking'
import { useCancelBooking } from '@/composables/modules/booking/useCancelBooking'
import { useRescheduleBooking } from '@/composables/modules/booking/useRescheduleBooking'
import { useUpdateBookingStatus } from '@/composables/modules/booking/useUpdateBookingStatus'
import { useExtendBooking } from '@/composables/modules/booking/useExtendBooking'
import { useResetBookingForRetry } from '@/composables/modules/booking/useResetBookingForRetry'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// State
const filterStatus = ref('')
const pageSize = ref('20')
const searchQuery = ref('')
const quickFilterStatus = ref('all')
const selectedBooking = ref<any>(null)
const activeModalTab = ref('overview')

// Action form states
const reason = ref('')
const rescheduleDate = ref('')
const rescheduleTime = ref('')
const rescheduleReason = ref('')
const cancelReason = ref('')
const extendMinutes = ref(30)
const showRejectForm = ref(false)

// Trends data (would come from API)
const trends = ref<any>(null)

// Options
const filterStatusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Expired', value: 'expired' },
  { label: 'No Show', value: 'no_show' },
  { label: 'Payment Failed', value: 'payment_failed' }
]

const pageSizeOptions = [
  { label: '10 per page', value: '10' },
  { label: '20 per page', value: '20' },
  { label: '50 per page', value: '50' }
]

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' }
]

const modalTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'actions', label: 'Actions' },
  { id: 'history', label: 'History' }
]

// Composables
const { data: bookingsData, loading, execute: fetchBookings } = useFetchBookings()
const { data: stats, execute: fetchStats } = useFetchBookingStats()
const { loading: confirmLoading, execute: confirmBooking } = useConfirmBooking()
const { loading: rejectLoading, execute: rejectBooking } = useRejectBooking()
const { loading: cancelLoading, execute: cancelBooking } = useCancelBooking()
const { loading: rescheduleLoading, execute: rescheduleBooking } = useRescheduleBooking()
const { loading: statusLoading, execute: updateStatus } = useUpdateBookingStatus()
const { loading: extendLoading, execute: extendBooking } = useExtendBooking()
const { loading: resetLoading, execute: resetBooking } = useResetBookingForRetry()

// Computed
const bookings = computed(() => bookingsData.value || [])

const filteredBookings = computed(() => {
  let result = bookings.value

  // Quick filter by status
  if (quickFilterStatus.value !== 'all') {
    result = result.filter((b: any) => b.status === quickFilterStatus.value)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((b: any) => 
      b.clientName?.toLowerCase().includes(query) ||
      b.clientEmail?.toLowerCase().includes(query) ||
      b.bookingNumber?.toLowerCase().includes(query) ||
      b.clientPhone?.includes(query)
    )
  }

  return result
})

// Action visibility computed
const canShowQuickActions = computed(() => {
  const status = selectedBooking.value?.status
  return status === 'pending' || status === 'confirmed'
})

const canReschedule = computed(() => {
  const status = selectedBooking.value?.status
  return status === 'pending' || status === 'confirmed'
})

const canCancel = computed(() => {
  const status = selectedBooking.value?.status
  return status === 'pending' || status === 'confirmed'
})

const canExtend = computed(() => {
  const status = selectedBooking.value?.status
  return status === 'pending' || status === 'expired'
})

const canReset = computed(() => {
  const status = selectedBooking.value?.status
  return status === 'expired' || status === 'payment_failed'
})

// Chart data
const statusChartLabels = computed((): string[] => ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Expired'])

const statusChartValues = computed(() => {
  const counts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    expired: 0
  }
  bookings.value.forEach((b: any) => {
    const key = (b.status || 'pending').toLowerCase()
    if (counts[key] !== undefined) {
      counts[key]++
    }
  })
  return [counts.pending, counts.confirmed, counts.completed, counts.cancelled, counts.expired]
})

const revenueChartData = computed(() => {
  const totals: Record<string, number> = {}
  bookings.value.forEach((b: any) => {
    const date = (b.preferredDate || '').slice(0, 10)
    if (!date) return
    const amount = Number(b.estimatedTotal || 0)
    totals[date] = (totals[date] || 0) + amount
  })
  return Object.entries(totals)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7)
    .reverse()
})

const revenueChartLabels = computed(() => revenueChartData.value.map(([date]: [string, number]) => formatDateShort(date)))
const revenueChartValues = computed(() => revenueChartData.value.map(([, value]: [string, number]) => value))

const volumeChartData = computed(() => {
  const totals: Record<string, number> = {}
  bookings.value.forEach((b: any) => {
    const date = (b.preferredDate || '').slice(0, 10)
    if (!date) return
    totals[date] = (totals[date] || 0) + 1
  })
  return Object.entries(totals)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7)
    .reverse()
})

const volumeChartLabels = computed(() => volumeChartData.value.map(([date]: [string, number]) => formatDateShort(date)))
const volumeChartValues = computed(() => volumeChartData.value.map(([, value]: [string, number]) => value))

// Methods
const refreshBookings = async () => {
  await fetchBookings({
    status: filterStatus.value || undefined,
    limit: parseInt(pageSize.value)
  })
  await fetchStats()
}

const openBookingModal = (booking: any) => {
  selectedBooking.value = booking
  activeModalTab.value = 'overview'
  resetActionForms()
}

const closeModal = () => {
  selectedBooking.value = null
  resetActionForms()
}

const resetActionForms = () => {
  reason.value = ''
  rescheduleDate.value = ''
  rescheduleTime.value = ''
  rescheduleReason.value = ''
  cancelReason.value = ''
  extendMinutes.value = 30
  showRejectForm.value = false
}

const handleConfirm = async () => {
  if (!selectedBooking.value) return
  await confirmBooking(selectedBooking.value._id, {})
  await refreshBookings()
  closeModal()
}

const handleComplete = async () => {
  if (!selectedBooking.value) return
  await updateStatus(selectedBooking.value._id, { status: 'completed' })
  await refreshBookings()
  closeModal()
}

const handleReject = async () => {
  if (!selectedBooking.value || !reason.value) return
  await rejectBooking(selectedBooking.value._id, reason.value)
  await refreshBookings()
  closeModal()
}

const handleCancel = async () => {
  if (!selectedBooking.value || !cancelReason.value) return
  await cancelBooking(selectedBooking.value._id, cancelReason.value)
  await refreshBookings()
  closeModal()
}

const handleReschedule = async () => {
  if (!selectedBooking.value || !rescheduleDate.value || !rescheduleTime.value || !rescheduleReason.value) return
  await rescheduleBooking(selectedBooking.value._id, {
    newPreferredDate: rescheduleDate.value,
    newPreferredStartTime: rescheduleTime.value,
    reason: rescheduleReason.value
  })
  await refreshBookings()
  closeModal()
}

const handleExtend = async () => {
  if (!selectedBooking.value) return
  await extendBooking(selectedBooking.value._id, extendMinutes.value)
  await refreshBookings()
  closeModal()
}

const handleResetRetry = async () => {
  if (!selectedBooking.value) return
  await resetBooking(selectedBooking.value._id)
  await refreshBookings()
  closeModal()
}

// Formatters
const formatCurrency = (value: number) => {
  return Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const formatDateShort = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  })
}

const formatDateFull = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateTime = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired',
    no_show: 'No Show',
    payment_failed: 'Payment Failed'
  }
  return statusMap[status || 'pending'] || status
}

const formatSourceType = (source?: string) => {
  const sourceMap: Record<string, string> = {
    direct_link: 'Direct Link',
    website: 'Website',
    marketplace: 'Marketplace',
    referral: 'Referral'
  }
  return sourceMap[source || ''] || source || 'Unknown'
}

const getInitials = (name?: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusBadgeClass = (status?: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    expired: 'bg-gray-100 text-gray-700',
    no_show: 'bg-orange-50 text-orange-700',
    payment_failed: 'bg-red-50 text-red-700'
  }
  return classes[status || 'pending'] || 'bg-gray-100 text-gray-700'
}

const getStatusDotClass = (status?: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
    expired: 'bg-gray-500',
    no_show: 'bg-orange-500',
    payment_failed: 'bg-red-500'
  }
  return classes[status || 'pending'] || 'bg-gray-500'
}

const getStatusBgClass = (status?: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-50',
    confirmed: 'bg-blue-50',
    completed: 'bg-green-50',
    cancelled: 'bg-red-50',
    expired: 'bg-gray-50',
    no_show: 'bg-orange-50',
    payment_failed: 'bg-red-50'
  }
  return classes[status || 'pending'] || 'bg-gray-50'
}

const getStatusIconClass = (status?: string) => {
  const classes: Record<string, string> = {
    pending: 'text-yellow-600',
    confirmed: 'text-blue-600',
    completed: 'text-green-600',
    cancelled: 'text-red-600',
    expired: 'text-gray-600',
    no_show: 'text-orange-600',
    payment_failed: 'text-red-600'
  }
  return classes[status || 'pending'] || 'text-gray-600'
}

onMounted(async () => {
  await refreshBookings()
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
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(20px);
}
</style>
