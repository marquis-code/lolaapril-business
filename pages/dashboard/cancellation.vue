<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Cancellations</h1>
          <p class="text-gray-500 text-sm mt-1">Manage policies and track cancelled bookings</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="currentTab = 'policy_analytics'"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            :class="currentTab === 'policy_analytics' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
          >
            Policy & Analytics
          </button>
          <button
            @click="currentTab = 'cancelled_bookings'"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            :class="currentTab === 'cancelled_bookings' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
          >
            Cancelled Bookings
          </button>
        </div>
      </div>

      <!-- Policy & Analytics Tab -->
      <div v-if="currentTab === 'policy_analytics'" class="space-y-6 animate-in fade-in duration-500">
        <div class="flex items-center justify-end">
          <button
            @click="showEditPolicyModal = true"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Policy
          </button>
        </div>

      <!-- Policy Overview Cards -->
      <div v-if="policy" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Policy Status -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ policy.policyName }}</p>
            </div>
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="policy.isActive ? 'bg-green-100' : 'bg-gray-100'"
            >
              <span 
                class="w-3 h-3 rounded-full"
                :class="policy.isActive ? 'bg-primary' : 'bg-gray-400'"
              ></span>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ policy.isActive ? 'Active' : 'Inactive' }}</p>
        </div>

        <!-- Deposit Info -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Deposit Required</p>
              <p class="text-lg font-bold text-gray-900 mt-1">
                {{ policy.requiresDeposit ? policy.depositPercentage + '%' : 'No' }}
              </p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Min: ₦{{ formatCurrency(policy.minimumDepositAmount || 0) }}</p>
        </div>

        <!-- Cancellation Window -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Cancel Window</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ policy.cancellationWindowHours }}h</p>
            </div>
            <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Before appointment</p>
        </div>

        <!-- No-Show Limit -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">No-Show Limit</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ policy.maxNoShowsBeforeDeposit }}</p>
            </div>
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Before deposit required</p>
        </div>
      </div>

      <!-- Loading skeleton for policy -->
      <div v-else-if="policyLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm animate-pulse">
          <div class="h-3 bg-gray-200 rounded w-20 mb-3"></div>
          <div class="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      <!-- Policy Details & Refund Rules -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Refund Rules Card -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">Refund Rules</h3>
            <p class="text-xs text-gray-500 mt-1">Based on cancellation timing</p>
          </div>
          <div class="divide-y divide-gray-100">
            <div 
              v-for="(rule, index) in policy?.rules || []" 
              :key="index"
              class="p-4 flex items-center gap-4"
            >
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                :class="rule.refundPercentage === 100 ? 'bg-green-100' : rule.refundPercentage >= 50 ? 'bg-amber-100' : 'bg-red-100'"
              >
                <span 
                  class="text-sm font-bold"
                  :class="rule.refundPercentage === 100 ? 'text-green-600' : rule.refundPercentage >= 50 ? 'text-amber-600' : 'text-red-600'"
                >
                  {{ rule.refundPercentage }}%
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900">{{ rule.hoursBeforeAppointment }}+ hours before</p>
                <p class="text-sm text-gray-500">{{ rule.description }}</p>
              </div>
              <div class="text-right">
                <span 
                  v-if="rule.penaltyPercentage > 0" 
                  class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full"
                >
                  {{ rule.penaltyPercentage }}% penalty
                </span>
              </div>
            </div>

            <!-- Same Day Cancellation -->
            <div v-if="policy?.allowSameDayCancellation" class="p-4 flex items-center gap-4 bg-gray-50">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-200">
                <span class="text-sm font-bold text-gray-600">{{ policy.sameDayRefundPercentage }}%</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900">Same Day Cancellation</p>
                <p class="text-sm text-gray-500">Cancellations made on the day of appointment</p>
              </div>
            </div>

            <div v-if="!policy?.rules?.length && !policyLoading" class="p-8 text-center text-gray-500">
              <p class="text-sm">No refund rules defined</p>
            </div>
          </div>
        </div>

        <!-- Reminder Settings & Quick Actions -->
        <div class="space-y-6">
          <!-- Reminder Settings -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900">Reminders</h3>
                  <p class="text-xs text-gray-500 mt-1">Automated reminder schedule</p>
                </div>
                <span 
                  class="text-xs font-medium px-2 py-1 rounded-full"
                  :class="policy?.sendReminders ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ policy?.sendReminders ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>
            <div v-if="policy?.sendReminders && policy?.reminderHours?.length" class="p-4">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="hours in policy.reminderHours" 
                  :key="hours"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ hours }}h before
                </span>
              </div>
            </div>
            <div v-else class="p-4 text-center text-sm text-gray-500">
              No reminders configured
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="showCancelModal = true"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">Cancel Booking</span>
              </button>

              <button
                @click="showNoShowModal = true"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
              >
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">Record No-Show</span>
              </button>

              <button
                @click="showRefundModal = true"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">Refund Calculator</span>
              </button>

              <button
                @click="showDepositModal = true"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">Deposit Calculator</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Section -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold text-gray-900">Analytics Overview</h3>
            <p class="text-xs text-gray-500 mt-1">Cancellation and no-show statistics</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <input 
              v-model="analyticsStart" 
              type="date" 
              class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <span class="text-gray-400">to</span>
            <input 
              v-model="analyticsEnd" 
              type="date" 
              class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              @click="loadAnalytics"
              :disabled="analyticsLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg disabled:opacity-60 transition-colors"
            >
              {{ analyticsLoading ? 'Loading...' : 'Apply' }}
            </button>
          </div>
        </div>

        <!-- Analytics Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div class="p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ noShowAnalytics?.totalNoShows || 0 }}</p>
                <p class="text-xs text-gray-500">No-Shows</p>
              </div>
            </div>
          </div>

          <div class="p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ noShowAnalytics?.lateCancellations || 0 }}</p>
                <p class="text-xs text-gray-500">Late Cancellations</p>
              </div>
            </div>
          </div>

          <div class="p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">₦{{ formatCurrency(noShowAnalytics?.revenueImpact || 0) }}</p>
                <p class="text-xs text-gray-500">Revenue Impact</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 border-t border-gray-100">
          <ClientOnly>
            <AnalyticsChartCard
              title="No-Show vs Late Cancellations"
              subtitle="Current period"
              type="doughnut"
              dataset-label="Incidents"
              :labels="['No-Shows', 'Late Cancellations']"
              :values="[noShowAnalytics?.totalNoShows || 0, noShowAnalytics?.lateCancellations || 0]"
            />
          </ClientOnly>

          <ClientOnly>
            <AnalyticsChartCard
              title="Revenue Impact"
              subtitle="Penalties collected"
              type="bar"
              dataset-label="Amount (₦)"
              :labels="['Impact', 'Penalties']"
              :values="[noShowAnalytics?.revenueImpact || 0, noShowAnalytics?.penaltiesCollected || 0]"
            />
          </ClientOnly>

          <ClientOnly>
            <AnalyticsChartCard
              title="Cancellation Trends"
              subtitle="Over time"
              type="line"
              dataset-label="Cancellations"
              :labels="trendLabels"
              :values="trendValues"
            />
          </ClientOnly>
        </div>
      </div>

      <!-- Client Reliability Lookup -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-gray-100">
          <h3 class="font-semibold text-gray-900">Client Reliability Check</h3>
          <p class="text-xs text-gray-500 mt-1">Look up client history and deposit requirements</p>
        </div>
        <div class="p-5">
          <div class="flex flex-wrap items-end gap-3">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-medium text-gray-500 mb-1">Client ID</label>
              <input 
                v-model="reliabilityClientId" 
                type="text" 
                placeholder="Enter client ID"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              @click="loadReliability"
              :disabled="reliabilityLoading || !reliabilityClientId"
              class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg disabled:opacity-60 transition-colors"
            >
              {{ reliabilityLoading ? 'Loading...' : 'Check Reliability' }}
            </button>
            <button
              @click="checkDeposit"
              :disabled="depositCheckLoading || !reliabilityClientId"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-60 transition-colors"
            >
              {{ depositCheckLoading ? 'Checking...' : 'Check Deposit Requirement' }}
            </button>
          </div>

          <!-- Reliability Result -->
          <div v-if="reliabilityData" class="mt-4 p-4 bg-gray-50 rounded-xl">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-500">Total Bookings</p>
                <p class="text-lg font-semibold text-gray-900">{{ reliabilityData.totalBookings || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Completed</p>
                <p class="text-lg font-semibold text-green-600">{{ reliabilityData.completedBookings || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Cancellations</p>
                <p class="text-lg font-semibold text-amber-600">{{ reliabilityData.cancellations || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">No-Shows</p>
                <p class="text-lg font-semibold text-red-600">{{ reliabilityData.noShows || 0 }}</p>
              </div>
            </div>
            <div v-if="reliabilityData.requiresDeposit !== undefined" class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center gap-2">
                <span 
                  class="text-sm font-medium px-3 py-1 rounded-full"
                  :class="reliabilityData.requiresDeposit ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                >
                  {{ reliabilityData.requiresDeposit ? 'Deposit Required' : 'No Deposit Required' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Cancel Appointment Modal -->
    <Teleport to="body">
      <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showCancelModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Cancel Appointment</h3>
            <button @click="showCancelModal = false" class="p-1 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
              <input 
                v-model="appointmentId" 
                type="text" 
                placeholder="Enter appointment ID"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea 
                v-model="cancelReason" 
                rows="3" 
                placeholder="Enter cancellation reason"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="showCancelModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleCancelAppointment"
              :disabled="cancelLoading || !appointmentId || !cancelReason"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60 transition-colors"
            >
              {{ cancelLoading ? 'Cancelling...' : 'Confirm Cancellation' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- No-Show Modal -->
    <Teleport to="body">
      <div v-if="showNoShowModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showNoShowModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Record No-Show</h3>
            <button @click="showNoShowModal = false" class="p-1 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
              <input 
                v-model="noShowAppointmentId" 
                type="text" 
                placeholder="Enter appointment ID"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea 
                v-model="noShowNotes" 
                rows="3" 
                placeholder="Add any notes"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="showNoShowModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleRecordNoShow"
              :disabled="noShowLoading || !noShowAppointmentId"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-60 transition-colors"
            >
              {{ noShowLoading ? 'Recording...' : 'Record No-Show' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Refund Calculator Modal -->
    <Teleport to="body">
      <div v-if="showRefundModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showRefundModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Refund Calculator</h3>
            <button @click="showRefundModal = false" class="p-1 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
              <input 
                v-model="refundDate" 
                type="datetime-local" 
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₦)</label>
              <input 
                v-model.number="paidAmount" 
                type="number" 
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (₦)</label>
              <input 
                v-model.number="depositAmount" 
                type="number" 
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <button
            @click="handleCalculateRefund"
            :disabled="refundLoading || !refundDate"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-60 transition-colors"
          >
            {{ refundLoading ? 'Calculating...' : 'Calculate Refund' }}
          </button>

          <div v-if="refundResult" class="p-4 bg-green-50 rounded-xl">
            <p class="text-xs text-gray-500 mb-2">Result</p>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Refund Amount:</span>
                <span class="text-sm font-semibold text-green-600">₦{{ formatCurrency(refundResult.refundAmount || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Penalty:</span>
                <span class="text-sm font-semibold text-red-600">₦{{ formatCurrency(refundResult.penaltyAmount || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Refund %:</span>
                <span class="text-sm font-semibold text-gray-900">{{ refundResult.refundPercentage || 0 }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Deposit Calculator Modal -->
    <Teleport to="body">
      <div v-if="showDepositModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDepositModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Deposit Calculator</h3>
            <button @click="showDepositModal = false" class="p-1 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Amount (₦)</label>
              <input 
                v-model.number="totalAmount" 
                type="number" 
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Client ID (optional)</label>
              <input 
                v-model="clientId" 
                type="text" 
                placeholder="Enter client ID for history check"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <button
            @click="handleCalculateDeposit"
            :disabled="depositLoading || !totalAmount"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 transition-colors"
          >
            {{ depositLoading ? 'Calculating...' : 'Calculate Deposit' }}
          </button>

          <div v-if="depositResult" class="p-4 bg-blue-50 rounded-xl">
            <p class="text-xs text-gray-500 mb-2">Result</p>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Deposit Required:</span>
                <span class="text-sm font-semibold text-blue-600">₦{{ formatCurrency(depositResult.depositAmount || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Percentage:</span>
                <span class="text-sm font-semibold text-gray-900">{{ depositResult.depositPercentage || 0 }}%</span>
              </div>
              <div v-if="depositResult.requiresDeposit !== undefined" class="flex justify-between">
                <span class="text-sm text-gray-600">Required:</span>
                <span 
                  class="text-sm font-semibold"
                  :class="depositResult.requiresDeposit ? 'text-red-600' : 'text-green-600'"
                >
                  {{ depositResult.requiresDeposit ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Policy Modal -->
    <Teleport to="body">
      <div v-if="showEditPolicyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showEditPolicyModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Edit Cancellation Policy</h3>
            <button @click="showEditPolicyModal = false" class="p-1 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Basic Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
                <input 
                  v-model="editForm.policyName" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div class="flex items-center gap-3 pt-6">
                <input 
                  v-model="editForm.isActive" 
                  type="checkbox" 
                  id="isActive"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label for="isActive" class="text-sm font-medium text-gray-700">Policy Active</label>
              </div>
            </div>

            <!-- Deposit Settings -->
            <div class="p-4 bg-gray-50 rounded-xl space-y-4">
              <h4 class="font-medium text-gray-900">Deposit Settings</h4>
              <div class="grid grid-cols-3 gap-4">
                <div class="flex items-center gap-3">
                  <input 
                    v-model="editForm.requiresDeposit" 
                    type="checkbox" 
                    id="requiresDeposit"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label for="requiresDeposit" class="text-sm font-medium text-gray-700">Require Deposit</label>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Deposit %</label>
                  <input 
                    v-model.number="editForm.depositPercentage" 
                    type="number" 
                    :disabled="!editForm.requiresDeposit"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Min Deposit (₦)</label>
                  <input 
                    v-model.number="editForm.minimumDepositAmount" 
                    type="number" 
                    :disabled="!editForm.requiresDeposit"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <!-- Cancellation Window -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cancellation Window (hours)</label>
                <input 
                  v-model.number="editForm.cancellationWindowHours" 
                  type="number" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max No-Shows Before Deposit</label>
                <input 
                  v-model.number="editForm.maxNoShowsBeforeDeposit" 
                  type="number" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <!-- Same Day Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <input 
                  v-model="editForm.allowSameDayCancellation" 
                  type="checkbox" 
                  id="allowSameDay"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label for="allowSameDay" class="text-sm font-medium text-gray-700">Allow Same-Day Cancellation</label>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Same Day Refund %</label>
                <input 
                  v-model.number="editForm.sameDayRefundPercentage" 
                  type="number" 
                  :disabled="!editForm.allowSameDayCancellation"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100"
                />
              </div>
            </div>

            <!-- Reminder Settings -->
            <div class="p-4 bg-gray-50 rounded-xl space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900">Reminder Settings</h4>
                <div class="flex items-center gap-2">
                  <input 
                    v-model="editForm.sendReminders" 
                    type="checkbox" 
                    id="sendReminders"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label for="sendReminders" class="text-sm text-gray-700">Send Reminders</label>
                </div>
              </div>
              <div v-if="editForm.sendReminders">
                <label class="block text-xs text-gray-500 mb-1">Reminder Hours (comma separated)</label>
                <input 
                  v-model="reminderHoursInput" 
                  type="text" 
                  placeholder="e.g., 24, 4, 1"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="editForm.description" 
                rows="2" 
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              ></textarea>
            </div>
          </div>

          <div class="p-6 border-t border-gray-100 flex gap-3">
            <button
              @click="showEditPolicyModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="savePolicy"
              :disabled="savingPolicy"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg disabled:opacity-60 transition-colors"
            >
              {{ savingPolicy ? 'Saving...' : 'Save Policy' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Cancelled Bookings Tab -->
    <div v-if="currentTab === 'cancelled_bookings'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="font-bold text-gray-900 text-lg">Cancelled Bookings</h3>
            <p class="text-sm text-gray-500 mt-1">Detailed log of bookings that were revoked</p>
          </div>
          <button 
            @click="loadCancellations"
            :disabled="cancellationsLoading"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': cancellationsLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div class="p-0">
          <div v-if="cancellationsLoading" class="p-12 flex flex-col items-center justify-center space-y-4">
            <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p class="text-gray-500 font-medium animate-pulse">Fetching cancellations...</p>
          </div>

          <div v-else-if="!cancellations.length" class="p-20 text-center flex flex-col items-center justify-center space-y-4 bg-gray-50/20">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-bold text-gray-900">No Cancellations Found</h4>
              <p class="text-gray-500 mt-1 max-w-sm">No bookings have been cancelled yet. When they are, they will appear here with full details.</p>
            </div>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div 
              v-for="booking in cancellations" 
              :key="booking._id"
              class="p-6 hover:bg-gray-50/80 transition-all group"
            >
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <!-- Booking & Client Info -->
                <div class="flex items-start gap-4 flex-1">
                  <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                    <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Cancelled</span>
                      <h4 class="font-bold text-gray-900 truncate">{{ booking.bookingNumber }}</h4>
                    </div>
                    <div class="mt-2 space-y-1">
                      <p class="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        {{ booking.clientName }}
                        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span class="text-gray-500 font-normal">{{ booking.clientEmail }}</span>
                      </p>
                      <p class="text-xs text-gray-500">{{ booking.clientPhone }}</p>
                    </div>
                  </div>
                </div>

                <!-- Cancellation Details -->
                <div class="flex-1 lg:border-l lg:border-gray-100 lg:pl-6">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ">Reason</p>
                  <div class="bg-gray-50 rounded-xl p-3 border border-gray-100 group-hover:bg-white transition-colors">
                    <p class="text-sm text-gray-700 italic">"{{ booking.cancellationReason || 'No reason provided' }}"</p>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-2 font-medium">
                    Cancelled on {{ new Date(booking.cancellationDate).toLocaleString() }}
                  </p>
                </div>

                <!-- Booking Detail & Price -->
                <div class="lg:w-64 text-right flex flex-col justify-between">
                  <div>
                    <p class="text-sm font-bold text-gray-900">
                      {{ new Date(booking.preferredDate).toLocaleDateString() }} @ {{ booking.preferredStartTime }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ booking.totalDuration }} mins duration</p>
                  </div>
                  <div class="mt-4 lg:mt-0">
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-tighter mb-0.5">Total Value</p>
                    <p class="text-xl font-black text-gray-900 tracking-tight">₦{{ formatCurrency(booking.estimatedTotal) }}</p>
                  </div>
                </div>
              </div>

              <!-- Services Accordion-style details -->
              <div v-if="booking.services?.length" class="mt-6 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                 <div 
                  v-for="service in booking.services" 
                  :key="service.serviceId?._id"
                  class="bg-white border border-gray-100 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-sm"
                 >
                   <span class="w-2 h-2 rounded-full bg-primary/40"></span>
                   <span class="font-bold text-gray-900 underline decoration-primary/20 underline-offset-2">{{ service.serviceName }}</span>
                   <span class="text-gray-400 font-medium">₦{{ formatCurrency(service.price) }}</span>
                 </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useGetCancellationPolicy } from '@/composables/modules/cancellation/useGetCancellationPolicy'
import { useSaveCancellationPolicy } from '@/composables/modules/cancellation/useSaveCancellationPolicy'
import { useCancelAppointment } from '@/composables/modules/cancellation/useCancelAppointment'
import { useRecordNoShow } from '@/composables/modules/cancellation/useRecordNoShow'
import { useCalculateRefund } from '@/composables/modules/cancellation/useCalculateRefund'
import { useCalculateDeposit } from '@/composables/modules/cancellation/useCalculateDeposit'
import { useGetNoShowAnalytics } from '@/composables/modules/cancellation/useGetNoShowAnalytics'
import { useGetCancellationTrends } from '@/composables/modules/cancellation/useGetCancellationTrends'
import { useGetClientReliability } from '@/composables/modules/cancellation/useGetClientReliability'
import { useCheckDepositRequirement } from '@/composables/modules/cancellation/useCheckDepositRequirement'
import { useGetCancellations } from '@/composables/modules/booking/useGetCancellations'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { showToast } = useCustomToast()

// Policy
const { data: policy, loading: policyLoading, execute: fetchPolicy } = useGetCancellationPolicy()
const { execute: savePolicyRequest, loading: savingPolicy } = useSaveCancellationPolicy()

// Modal states
const showCancelModal = ref(false)
const showNoShowModal = ref(false)
const showRefundModal = ref(false)
const showDepositModal = ref(false)
const showEditPolicyModal = ref(false)

// Cancel appointment
const appointmentId = ref('')
const cancelReason = ref('')
const { loading: cancelLoading, execute: cancelAppointment } = useCancelAppointment()

// No-show
const noShowAppointmentId = ref('')
const noShowNotes = ref('')
const { loading: noShowLoading, execute: recordNoShow } = useRecordNoShow()

// Refund calculator
const refundDate = ref('')
const paidAmount = ref(0)
const depositAmount = ref(0)
const refundResult = ref<any>(null)
const { loading: refundLoading, execute: calculateRefund } = useCalculateRefund()

// Deposit calculator
const totalAmount = ref(0)
const clientId = ref('')
const depositResult = ref<any>(null)
const { loading: depositLoading, execute: calculateDeposit } = useCalculateDeposit()

// Analytics
const analyticsStart = ref('')
const analyticsEnd = ref('')
const noShowAnalytics = ref<any>(null)
const { loading: analyticsLoading, execute: fetchNoShowAnalytics } = useGetNoShowAnalytics()
const { data: trendData, execute: fetchTrends } = useGetCancellationTrends()

// Client reliability
const reliabilityClientId = ref('')
const reliabilityData = ref<any>(null)
const { loading: reliabilityLoading, execute: fetchReliability } = useGetClientReliability()
const { loading: depositCheckLoading, execute: checkDepositRequirement } = useCheckDepositRequirement()

// Tab state
const currentTab = ref('policy_analytics')

// Cancellations List
const { data: cancellations, loading: cancellationsLoading, execute: fetchCancellations } = useGetCancellations()

// Edit form
const editForm = ref({
  policyName: '',
  isActive: true,
  requiresDeposit: true,
  depositPercentage: 20,
  minimumDepositAmount: 1000,
  cancellationWindowHours: 24,
  maxNoShowsBeforeDeposit: 2,
  allowSameDayCancellation: true,
  sameDayRefundPercentage: 0,
  sendReminders: true,
  description: '',
  rules: [] as any[]
})
const reminderHoursInput = ref('')

// Watch policy to update edit form
watch(policy, (newPolicy) => {
  if (newPolicy) {
    editForm.value = {
      policyName: newPolicy.policyName || '',
      isActive: newPolicy.isActive ?? true,
      requiresDeposit: newPolicy.requiresDeposit ?? true,
      depositPercentage: newPolicy.depositPercentage || 20,
      minimumDepositAmount: newPolicy.minimumDepositAmount || 1000,
      cancellationWindowHours: newPolicy.cancellationWindowHours || 24,
      maxNoShowsBeforeDeposit: newPolicy.maxNoShowsBeforeDeposit || 2,
      allowSameDayCancellation: newPolicy.allowSameDayCancellation ?? true,
      sameDayRefundPercentage: newPolicy.sameDayRefundPercentage || 0,
      sendReminders: newPolicy.sendReminders ?? true,
      description: newPolicy.description || '',
      rules: newPolicy.rules || []
    }
    reminderHoursInput.value = (newPolicy.reminderHours || []).join(', ')
  }
}, { immediate: true })

// Computed
const trendPoints = computed(() => trendData.value?.dataPoints || trendData.value?.points || trendData.value || [])
const trendLabels = computed(() => trendPoints.value.map((p: any) => p.date || p.label || p.period || ''))
const trendValues = computed(() => trendPoints.value.map((p: any) => p.cancellations || p.count || 0))

// Methods
const loadPolicy = async () => {
  await fetchPolicy()
}

const savePolicy = async () => {
  const payload = {
    ...editForm.value,
    reminderHours: reminderHoursInput.value
      .split(',')
      .map((h: string) => parseInt(h.trim()))
      .filter((h: number) => !isNaN(h))
  }
  
  try {
    await savePolicyRequest(payload)
    showToast({ title: 'Success', message: 'Policy saved successfully', toastType: 'success' })
    showEditPolicyModal.value = false
    await loadPolicy()
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save policy', toastType: 'error' })
  }
}

const handleCancelAppointment = async () => {
  if (!appointmentId.value || !cancelReason.value) return
  try {
    await cancelAppointment(appointmentId.value, { reason: cancelReason.value })
    showToast({ title: 'Success', message: 'Appointment cancelled', toastType: 'success' })
    showCancelModal.value = false
    appointmentId.value = ''
    cancelReason.value = ''
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to cancel appointment', toastType: 'error' })
  }
}

const handleRecordNoShow = async () => {
  if (!noShowAppointmentId.value) return
  try {
    await recordNoShow(noShowAppointmentId.value, { notes: noShowNotes.value })
    showToast({ title: 'Success', message: 'No-show recorded', toastType: 'success' })
    showNoShowModal.value = false
    noShowAppointmentId.value = ''
    noShowNotes.value = ''
    await loadAnalytics()
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to record no-show', toastType: 'error' })
  }
}

const handleCalculateRefund = async () => {
  if (!refundDate.value) return
  try {
    const result = await calculateRefund({
      appointmentDate: refundDate.value,
      paidAmount: paidAmount.value,
      depositAmount: depositAmount.value
    })
    refundResult.value = result
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to calculate refund', toastType: 'error' })
  }
}

const handleCalculateDeposit = async () => {
  try {
    const result = await calculateDeposit({
      totalAmount: totalAmount.value,
      clientId: clientId.value || undefined
    })
    depositResult.value = result
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to calculate deposit', toastType: 'error' })
  }
}

const loadAnalytics = async () => {
  const result = await fetchNoShowAnalytics({
    startDate: analyticsStart.value || undefined,
    endDate: analyticsEnd.value || undefined
  })
  noShowAnalytics.value = result
}

const loadTrends = async () => {
  if (!analyticsStart.value || !analyticsEnd.value) return
  await fetchTrends({
    startDate: analyticsStart.value,
    endDate: analyticsEnd.value,
    groupBy: 'day'
  })
}

const loadReliability = async () => {
  if (!reliabilityClientId.value) return
  try {
    const result = await fetchReliability(reliabilityClientId.value)
    reliabilityData.value = result
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to load client reliability', toastType: 'error' })
  }
}

const checkDeposit = async () => {
  if (!reliabilityClientId.value) return
  try {
    const result = await checkDepositRequirement(reliabilityClientId.value)
    reliabilityData.value = { ...reliabilityData.value, ...result }
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to check deposit requirement', toastType: 'error' })
  }
}

const formatCurrency = (value: number) => {
  return Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const loadCancellations = async () => {
  try {
    await fetchCancellations()
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to load cancellations', toastType: 'error' })
  }
}

watch(currentTab, (newTab) => {
  if (newTab === 'cancelled_bookings' && !cancellations.value.length) {
    loadCancellations()
  }
})

onMounted(async () => {
  await loadPolicy()
  
  // Set default date range (last 30 days)
  const today = new Date()
  const prior = new Date()
  prior.setDate(today.getDate() - 30)
  analyticsStart.value = prior.toISOString().slice(0, 10)
  analyticsEnd.value = today.toISOString().slice(0, 10)
  
  await loadAnalytics()
  await loadTrends()
})
</script>
