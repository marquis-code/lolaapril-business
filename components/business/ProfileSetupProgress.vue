<template>
  <div class="w-full max-w-lg mx-auto mb-8">
    <div class="flex items-center justify-between mb-2">
      <span class="font-semibold text-gray-700">Profile Setup</span>
      <span class="text-xs text-gray-500">{{ percent }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div class="bg-primary h-3 rounded-full transition-all duration-300" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="mt-2 text-xs text-gray-500">
      <span v-if="percent < 100">Complete all required fields and KYC to unlock all features.</span>
      <span v-else>Profile complete!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBusinessKYC } from '~/composables/modules/business/useBusinessKYC'

const props = defineProps<{ businessId: string }>()
const { getBusinessById } = useBusinessKYC()
const percent = ref(0)

const requiredFields = [
  'businessName',
  'subdomain',
  'businessType',
  'address.street',
  'address.city',
  'address.state',
  'address.country',
  'contact.primaryPhone',
  'contact.email',
  'settings.timezone',
  'settings.currency',
  'settings.language',
]

const requiredDocs = [
  'businessRegistration',
  'taxIdentification',
  'governmentId',
  'bankAccount',
]

const calcPercent = (business: any) => {
  let total = requiredFields.length + requiredDocs.length + 1 // +1 for KYC verified
  let filled = 0
  for (const field of requiredFields) {
    const parts = field.split('.')
    let val = business
    for (const p of parts) val = val?.[p]
    if (val) filled++
  }
  const docs = business.businessDocuments || {}
  for (const doc of requiredDocs) {
    if (docs[doc] && (docs[doc].documentUrl || docs[doc].bankStatementUrl)) filled++
  }
  if (docs.kycStatus === 'verified') filled++
  return Math.round((filled / total) * 100)
}

const fetchPercent = async () => {
  if (!props.businessId) return
  const business = await getBusinessById(props.businessId)
  percent.value = calcPercent(business)
}

onMounted(fetchPercent)
</script>

<style scoped>
.bg-primary { background: #005967; }
</style>
