<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Summary -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Commission Summary</h2>
            <p class="text-sm text-gray-500">Overview of commission impact</p>
          </div>
          <div class="flex items-end gap-3">
            <div>
              <UiAnimatedInput v-model="summaryStart" type="date" label="Start date" placeholder="" />
            </div>
            <div>
              <UiAnimatedInput v-model="summaryEnd" type="date" label="End date" placeholder="" />
            </div>
            <button
              @click="loadSummary"
              :disabled="summaryLoading"
              class="h-10 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {{ summaryLoading ? 'Loading...' : 'Load Summary' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Commission</p>
            <p class="text-lg font-semibold text-gray-900">₦{{ formatCurrency(summary?.totalCommission || 0) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Booking Count</p>
            <p class="text-lg font-semibold text-gray-900">{{ summary?.totalBookings || 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Average Rate</p>
            <p class="text-lg font-semibold text-gray-900">{{ summary?.averageRate || 0 }}%</p>
          </div>
        </div>
      </section>

      <!-- Tracking Codes -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Tracking Codes</h2>
          <p class="text-sm text-gray-500">Generate links and QR codes for marketing</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900">Create Tracking Code</h3>
            <UiAnimatedInput v-model="newCode.name" type="text" label="Name" placeholder="Enter code name" />
            <div>
              <UiSelectInput
                v-model="newCode.codeType"
                label="Code Type"
                :options="codeTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Select code type"
              />
            </div>
            <UiAnimatedInput v-model="newCode.description" type="text" label="Description" placeholder="Enter description" />
            <div>
              <UiAnimatedInput v-model="newCode.expiresAt" type="date" label="Expires At" placeholder="" />
            </div>
            <button
              @click="handleCreateCode"
              :disabled="codeLoading"
              class="w-full h-10 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {{ codeLoading ? 'Creating...' : 'Create Code' }}
            </button>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900">Codes</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="code in trackingCodes" :key="code.code" class="p-3 bg-white rounded-lg border border-gray-100">
                <p class="text-sm font-semibold text-gray-900">{{ code.name }}</p>
                <p class="text-xs text-gray-500">{{ code.codeType }} • {{ code.code }}</p>
                <a :href="code.trackingUrl" target="_blank" class="text-xs text-primary font-semibold">Open Link</a>
                <div v-if="code.qrCodeUrl" class="mt-2">
                  <a :href="code.qrCodeUrl" target="_blank" class="text-xs text-gray-700">View QR</a>
                </div>
              </div>
              <p v-if="!trackingCodes.length" class="text-xs text-gray-400">No tracking codes yet</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Source Breakdown -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Source Breakdown</h2>
            <p class="text-sm text-gray-500">Commission impact by channel</p>
          </div>
          <div class="flex items-end gap-3">
            <div>
              <UiAnimatedInput v-model="breakdownStart" type="date" label="Start date" placeholder="" />
            </div>
            <div>
              <UiAnimatedInput v-model="breakdownEnd" type="date" label="End date" placeholder="" />
            </div>
            <button
              @click="loadBreakdown"
              :disabled="breakdownLoading"
              class="h-10 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {{ breakdownLoading ? 'Loading...' : 'Load Breakdown' }}
            </button>
          </div>
        </div>

        <section class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ClientOnly>
            <AnalyticsChartCard
              title="Commission by Source"
              type="bar"
              dataset-label="Commission"
              :labels="breakdownLabels"
              :values="breakdownValues"
            />
          </ClientOnly>
          <ClientOnly>
            <AnalyticsChartCard
              title="Bookings by Source"
              type="doughnut"
              dataset-label="Bookings"
              :labels="breakdownLabels"
              :values="breakdownBookings"
            />
          </ClientOnly>
        </section>
      </section>

      <!-- Dispute & Lookup -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Commission Dispute</h2>
          <UiAnimatedInput v-model="disputeCommissionId" type="text" label="Commission ID" placeholder="Enter commission ID" />
          <div>
            <label class="text-xs text-gray-500">Reason</label>
            <textarea v-model="disputeReason" rows="3" class="mt-1 w-full rounded-lg border-gray-200 text-sm"></textarea>
          </div>
          <UiAnimatedInput v-model="disputedBy" type="text" label="Disputed By" placeholder="Enter disputer name" />
          <button
            @click="handleDispute"
            :disabled="disputeLoading"
            class="w-full h-10 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
          >
            {{ disputeLoading ? 'Submitting...' : 'Submit Dispute' }}
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Booking Commission Lookup</h2>
          <UiAnimatedInput v-model="lookupBookingId" type="text" label="Booking ID" placeholder="Enter booking ID" />
          <button
            @click="handleLookup"
            :disabled="lookupLoading"
            class="w-full h-10 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {{ lookupLoading ? 'Loading...' : 'Get Commission' }}
          </button>
          <div v-if="lookupResult" class="text-xs text-gray-600">
            <pre class="bg-gray-50 p-3 rounded-lg text-xs overflow-auto">{{ lookupResult }}</pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// import AnalyticsChartCard from '@/components/analytics/AnalyticsChartCard.vue'
import { useCreateTrackingCode } from '@/composables/modules/commission/useCreateTrackingCode'
import { useGetTrackingCodes } from '@/composables/modules/commission/useGetTrackingCodes'
import { useGetCommissionSummary } from '@/composables/modules/commission/useGetCommissionSummary'
import { useGetSourceBreakdown } from '@/composables/modules/commission/useGetSourceBreakdown'
import { useDisputeCommission } from '@/composables/modules/commission/useDisputeCommission'
import { useGetBookingCommission } from '@/composables/modules/commission/useGetBookingCommission'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const summaryStart = ref('')
const summaryEnd = ref('')
const { data: summary, loading: summaryLoading, execute: fetchSummary } = useGetCommissionSummary()

const newCode = ref({
  name: '',
  codeType: 'qr_code',
  description: '',
  expiresAt: ''
})

const codeTypeOptions = [
  { label: 'QR Code', value: 'qr_code' },
  { label: 'Direct Link', value: 'direct_link' },
  { label: 'Social Media', value: 'social_media' },
  { label: 'Email Campaign', value: 'email_campaign' }
]
const { loading: codeLoading, execute: createCode } = useCreateTrackingCode()
const { data: trackingData, execute: fetchTrackingCodes } = useGetTrackingCodes()

const breakdownStart = ref('')
const breakdownEnd = ref('')
const { data: breakdown, loading: breakdownLoading, execute: fetchBreakdown } = useGetSourceBreakdown()

const disputeCommissionId = ref('')
const disputeReason = ref('')
const disputedBy = ref('')
const { loading: disputeLoading, execute: disputeCommission } = useDisputeCommission()

const lookupBookingId = ref('')
const lookupResult = ref('')
const { loading: lookupLoading, execute: lookupCommission } = useGetBookingCommission()

const trackingCodes = computed(() => trackingData.value?.codes || trackingData.value?.trackingCodes || trackingData.value || [])

const breakdownRows = computed(() => breakdown.value?.sources || breakdown.value?.breakdown || breakdown.value || [])
const breakdownLabels = computed(() => breakdownRows.value.map((row: any) => row.sourceType || row.source || 'N/A'))
const breakdownValues = computed(() => breakdownRows.value.map((row: any) => row.commission || row.totalCommission || 0))
const breakdownBookings = computed(() => breakdownRows.value.map((row: any) => row.bookings || row.totalBookings || 0))

const loadSummary = async () => {
  await fetchSummary({
    startDate: summaryStart.value || undefined,
    endDate: summaryEnd.value || undefined
  })
}

const handleCreateCode = async () => {
  const result = await createCode({
    name: newCode.value.name,
    codeType: newCode.value.codeType,
    description: newCode.value.description || undefined,
    expiresAt: newCode.value.expiresAt || undefined
  })
  newCode.value = { name: '', codeType: 'qr_code', description: '', expiresAt: '' }
  await fetchTrackingCodes()
}

const loadBreakdown = async () => {
  if (!breakdownStart.value || !breakdownEnd.value) return
  await fetchBreakdown({ startDate: breakdownStart.value, endDate: breakdownEnd.value })
}

const handleDispute = async () => {
  if (!disputeCommissionId.value || !disputeReason.value || !disputedBy.value) return
  await disputeCommission(disputeCommissionId.value, {
    reason: disputeReason.value,
    disputedBy: disputedBy.value
  })
  disputeCommissionId.value = ''
  disputeReason.value = ''
  disputedBy.value = ''
}

const handleLookup = async () => {
  if (!lookupBookingId.value) return
  const result = await lookupCommission(lookupBookingId.value)
  lookupResult.value = JSON.stringify(result, null, 2)
}

const formatCurrency = (value: number) => {
  return Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
  const today = new Date()
  const prior = new Date()
  prior.setDate(today.getDate() - 30)
  summaryStart.value = prior.toISOString().slice(0, 10)
  summaryEnd.value = today.toISOString().slice(0, 10)
  breakdownStart.value = summaryStart.value
  breakdownEnd.value = summaryEnd.value
  await loadSummary()
  await fetchTrackingCodes()
  await loadBreakdown()
})
</script>
