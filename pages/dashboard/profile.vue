<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Business Profile</h1>
      <p class="text-gray-500 mt-1">Manage your business profile and complete KYC verification.</p>
    </div>

    <section class="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">KYC Verification</h2>
          <p class="text-sm text-gray-500 mt-1">
            Upload required documents to unlock core business operations and payouts.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-xs font-semibold uppercase px-3 py-1 rounded-full"
            :class="kycStatus === 'verified'
              ? 'bg-green-100 text-green-700'
              : kycStatus === 'pending'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-700'">
            {{ kycStatusLabel }}
          </div>
          <button
            @click="handleVerifyKyc"
            class="bg-black text-white px-4 py-2 rounded-lg"
            :disabled="verifyLoading"
          >
            {{ verifyLoading ? 'Submitting...' : 'Request Verification' }}
          </button>
        </div>
      </div>
    </section>

    <UploadManager />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVerifyKyc } from '@/composables/modules/business/useVerifyKyc'

definePageMeta({
  layout: 'dashboard'
})

const businessId = useCookie<string | null>('businessId') as unknown as { value: string | null }
const kycStatus = ref<'unverified' | 'pending' | 'verified'>('unverified')
const { loading: verifyLoading, execute: verifyKyc } = useVerifyKyc()

const kycStatusLabel = computed(() => {
  if (kycStatus.value === 'verified') return 'Verified'
  if (kycStatus.value === 'pending') return 'Pending review'
  return 'Not verified'
})

const handleVerifyKyc = async () => {
  if (!businessId.value) return alert('Business ID is required')
  try {
    await verifyKyc(businessId.value)
    kycStatus.value = 'pending'
    alert('KYC verification request submitted')
  } catch (e: any) {
    alert(e.message || 'Failed to submit verification request')
  }
}
</script>