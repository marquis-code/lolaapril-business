<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Overview -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Pricing & Fees</h2>
            <p class="text-sm text-gray-500">Manage fee structure and business pricing plan</p>
          </div>
          <button
            @click="refreshAll"
            :disabled="tiersLoading || feeLoading || historyLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-60"
          >
            {{ tiersLoading || feeLoading || historyLoading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Current Tier</p>
            <p class="text-lg font-semibold text-gray-900">{{ currentTierName }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Platform Fee (%)</p>
            <p class="text-lg font-semibold text-gray-900">{{ feeStructure?.platformFeePercentage ?? 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Fixed Fee</p>
            <p class="text-lg font-semibold text-gray-900">{{ feeStructure?.platformFeeFixed ? formatCurrency(feeStructure.platformFeeFixed) : 'N/A' }}</p>
          </div>
        </div>
      </section>

      <!-- Fee Structure -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Fee Structure</h2>
          <p class="text-sm text-gray-500">Configure platform fee and custom rules</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <UiSelectInput
              v-model="feeForm.pricingTierId"
              label="Pricing Tier"
              :options="tierOptions"
              option-label="label"
              option-value="value"
              placeholder="No tier selected"
            />
          </div>
          <UiAnimatedInput v-model.number="feeForm.platformFeePercentage" type="number" label="Platform Fee Percentage" placeholder="0" />
          <UiAnimatedInput v-model.number="feeForm.platformFeeFixed" type="number" label="Fixed Fee Amount" placeholder="0" />
          <UiAnimatedInput v-model="feeForm.effectiveFrom" type="date" label="Effective From" />
          <UiAnimatedInput v-model="feeForm.effectiveTo" type="date" label="Effective To" />
          <div class="flex items-center gap-2">
            <input id="grandfathered" v-model="feeForm.isGrandfathered" type="checkbox" class="custom-checkbox" />
            <label for="grandfathered" class="text-sm text-gray-700">Grandfathered pricing</label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model.number="feeForm.customRules.noShowFee" type="number" label="No-show Fee" placeholder="0" />
          <UiAnimatedInput v-model.number="feeForm.customRules.cancellationFee" type="number" label="Cancellation Fee" placeholder="0" />
          <UiAnimatedInput v-model.number="feeForm.customRules.minBookingAmount" type="number" label="Min Booking Amount" placeholder="0" />
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="saveFeeStructure"
            :disabled="feeSaveLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {{ feeSaveLoading ? 'Saving...' : 'Save Fee Structure' }}
          </button>
        </div>
      </section>

      <!-- Calculate Fees -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Fee Calculator</h2>
          <p class="text-sm text-gray-500">Estimate platform fees for a transaction</p>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <UiAnimatedInput v-model.number="calculateAmount" type="number" label="Amount" placeholder="Enter amount" class="w-48" />
          <button
            @click="handleCalculate"
            :disabled="calculateLoading"
            class="h-10 px-4 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
          >
            {{ calculateLoading ? 'Calculating...' : 'Calculate' }}
          </button>
        </div>
        <div v-if="calculatedFees" class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
          <pre class="text-xs whitespace-pre-wrap">{{ calculatedFees }}</pre>
        </div>
      </section>

      <!-- Change Plan -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Change Pricing Plan</h2>
          <p class="text-sm text-gray-500">Switch to a different tier</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <UiSelectInput
              v-model="changePlanForm.newTierId"
              label="New Tier"
              :options="tierOptions"
              option-label="label"
              option-value="value"
              placeholder="Select tier"
            />
          </div>
          <UiAnimatedInput v-model="changePlanForm.reason" type="text" label="Reason" placeholder="Enter reason for plan change" />
        </div>
        <button
          @click="handleChangePlan"
          :disabled="changePlanLoading"
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
        >
          {{ changePlanLoading ? 'Updating...' : 'Change Plan' }}
        </button>
      </section>

      <!-- Pricing History -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Pricing History</h2>
          <p class="text-sm text-gray-500">Track pricing changes over time</p>
        </div>
        <div class="space-y-3">
          <div v-for="entry in history" :key="entry._id" class="border border-gray-100 rounded-xl p-4">
            <p class="text-sm font-semibold text-gray-900">{{ entry.newTierId || 'Plan update' }}</p>
            <p class="text-xs text-gray-500">{{ entry.reason || 'No reason provided' }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(entry.changedAt) }}</p>
          </div>
          <p v-if="!history.length" class="text-sm text-gray-400">No pricing history yet.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FeeStructure, PricingTier, PricingHistoryItem } from '@/types/pricing'
import { useUser } from '@/composables/modules/auth/user'
import { useFetchPricingTiers } from '@/composables/modules/pricing/useFetchPricingTiers'
import { useFetchFeeStructure } from '@/composables/modules/pricing/useFetchFeeStructure'
import { useUpsertFeeStructure } from '@/composables/modules/pricing/useUpsertFeeStructure'
import { useCalculateFees } from '@/composables/modules/pricing/useCalculateFees'
import { useChangePricingPlan } from '@/composables/modules/pricing/useChangePricingPlan'
import { useFetchPricingHistory } from '@/composables/modules/pricing/useFetchPricingHistory'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { userId } = useUser()

const { data: tiersData, loading: tiersLoading, execute: fetchTiers } = useFetchPricingTiers()
const { data: feeStructureData, loading: feeLoading, execute: fetchFeeStructure } = useFetchFeeStructure()
const { loading: feeSaveLoading, execute: saveFeeStructureRequest } = useUpsertFeeStructure()
const { data: calculatedFees, loading: calculateLoading, execute: calculateFees } = useCalculateFees()
const { loading: changePlanLoading, execute: changePlan } = useChangePricingPlan()
const { data: historyData, loading: historyLoading, execute: fetchHistory } = useFetchPricingHistory()

const tiers = computed(() => tiersData.value || [])
const feeStructure = computed(() => feeStructureData.value)

const tierOptions = computed(() => [
  { label: 'No tier selected', value: '' },
  ...tiers.value.map((tier: PricingTier) => ({
    label: tier.tierName,
    value: tier._id
  }))
])
const history = computed(() => historyData.value || [])

const currentTierName = computed(() => {
  const pricingTier = feeStructure.value?.pricingTierId
  // Handle both populated object and string ID
  if (typeof pricingTier === 'object' && pricingTier?.tierName) {
    return pricingTier.tierName
  }
  // Fallback to string ID lookup
  const tierId = typeof pricingTier === 'string' ? pricingTier : pricingTier?._id
  const match = tiers.value.find((tier: PricingTier) => tier._id === tierId)
  return match?.tierName || 'Not set'
})

const feeForm = ref({
  pricingTierId: '',
  platformFeePercentage: 0,
  platformFeeFixed: 0,
  effectiveFrom: '',
  effectiveTo: '',
  isGrandfathered: false,
  customRules: {
    noShowFee: 0,
    cancellationFee: 0,
    minBookingAmount: 0
  }
})

const calculateAmount = ref(0)

const changePlanForm = ref({
  newTierId: '',
  reason: ''
})

const applyFeeForm = (structure: FeeStructure | null | undefined) => {
  if (!structure) return
  // Handle populated pricingTierId object - extract _id
  const tierId = typeof structure.pricingTierId === 'object' 
    ? structure.pricingTierId?._id 
    : structure.pricingTierId
  feeForm.value = {
    pricingTierId: tierId || '',
    platformFeePercentage: structure.platformFeePercentage || 0,
    platformFeeFixed: structure.platformFeeFixed || 0,
    effectiveFrom: structure.effectiveFrom ? structure.effectiveFrom.slice(0, 10) : '',
    effectiveTo: structure.effectiveTo ? structure.effectiveTo.slice(0, 10) : '',
    isGrandfathered: structure.isGrandfathered || false,
    customRules: {
      noShowFee: structure.customRules?.noShowFee || 0,
      cancellationFee: structure.customRules?.cancellationFee || 0,
      minBookingAmount: structure.customRules?.minBookingAmount || 0
    }
  }
}

const saveFeeStructure = async () => {
  await saveFeeStructureRequest({
    pricingTierId: feeForm.value.pricingTierId || undefined,
    platformFeePercentage: feeForm.value.platformFeePercentage,
    platformFeeFixed: feeForm.value.platformFeeFixed || undefined,
    effectiveFrom: feeForm.value.effectiveFrom || undefined,
    effectiveTo: feeForm.value.effectiveTo || undefined,
    isGrandfathered: feeForm.value.isGrandfathered || undefined,
    customRules: {
      noShowFee: feeForm.value.customRules.noShowFee || undefined,
      cancellationFee: feeForm.value.customRules.cancellationFee || undefined,
      minBookingAmount: feeForm.value.customRules.minBookingAmount || undefined
    }
  })
  await fetchFeeStructure()
}

const handleCalculate = async () => {
  if (!calculateAmount.value) return
  await calculateFees(calculateAmount.value)
}

const handleChangePlan = async () => {
  if (!changePlanForm.value.newTierId || !userId.value) return
  await changePlan({
    newTierId: changePlanForm.value.newTierId,
    changedBy: userId.value,
    reason: changePlanForm.value.reason || 'Updated plan'
  })
  await refreshAll()
}

const refreshAll = async () => {
  await Promise.all([
    fetchTiers(),
    fetchFeeStructure(),
    fetchHistory()
  ])
  applyFeeForm(feeStructureData.value)
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)
const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : ''

onMounted(async () => {
  await refreshAll()
})
</script>
