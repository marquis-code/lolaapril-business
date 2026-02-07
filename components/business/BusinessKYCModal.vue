<template>
  <div class="kyc-modal p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
    <h2 class="text-xl font-bold mb-2">Business KYC Verification</h2>
    <div v-if="kycStatus === 'verified'" class="mb-4 text-green-600 flex items-center gap-2">
      <span class="font-semibold">KYC Verified</span>
      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
    </div>
    <div v-else-if="kycStatus === 'pending'" class="mb-4 text-yellow-600 flex items-center gap-2">
      <span class="font-semibold">KYC Pending</span>
      <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l2 2"/></svg>
    </div>
    <div v-else-if="kycStatus === 'rejected'" class="mb-4 text-red-600 flex items-center gap-2">
      <span class="font-semibold">KYC Rejected</span>
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      <span v-if="rejectionReason">- {{ rejectionReason }}</span>
    </div>
    <div class="mb-4">
      <div v-for="(doc, key) in requiredDocs" :key="key" class="mb-2 flex items-center gap-2">
        <span class="w-48 inline-block">{{ doc.label }}</span>
        <input type="file" :accept="doc.accept" @change="e => handleFileUpload(e, key)" :disabled="kycStatus === 'verified'" />
        <span v-if="uploadedDocs[key]" class="text-green-600">Uploaded</span>
        <span v-else class="text-gray-400">Not uploaded</span>
      </div>
    </div>
    <div class="flex items-center gap-4 mt-6">
      <button v-if="canSubmit" @click="submitKYC" class="bg-primary text-white px-4 py-2 rounded" :disabled="loading">Submit KYC</button>
      <button v-if="kycStatus === 'rejected'" @click="submitKYC" class="bg-primary text-white px-4 py-2 rounded" :disabled="loading">Re-submit</button>
    </div>
    <div v-if="loading" class="mt-4 text-primary">Processing...</div>
    <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBusinessKYC } from '~/composables/modules/business/useBusinessKYC'

const props = defineProps<{ businessId: string }>()
const { loading, error, verify, uploadKycDocument, getBusinessById } = useBusinessKYC()

const kycStatus = ref<string>('pending')
const rejectionReason = ref<string>('')
const uploadedDocs = ref<Record<string, boolean>>({})

const requiredDocs = {
  businessRegistration: { label: 'Business Registration Certificate', accept: '.pdf,.jpg,.jpeg,.png' },
  taxIdentification: { label: 'Tax Identification Certificate', accept: '.pdf,.jpg,.jpeg,.png' },
  governmentId: { label: 'Government ID', accept: '.pdf,.jpg,.jpeg,.png' },
  bankStatement: { label: 'Bank Statement', accept: '.pdf,.jpg,.jpeg,.png' },
}

const canSubmit = computed(() => {
  return Object.keys(requiredDocs).every(key => uploadedDocs.value[key]) && kycStatus.value !== 'verified'
})

const fetchKYC = async () => {
  const business = await getBusinessById(props.businessId)
  const docs = business?.businessDocuments || {}
  kycStatus.value = docs.kycStatus || 'pending'
  rejectionReason.value = docs.rejectionReason || ''
  uploadedDocs.value = {
    businessRegistration: !!docs.businessRegistration?.documentUrl,
    taxIdentification: !!docs.taxIdentification?.documentUrl,
    governmentId: !!docs.governmentId?.documentUrl,
    bankStatement: !!docs.bankAccount?.bankStatementUrl,
  }
}

const handleFileUpload = async (e: Event, key: string) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  await uploadKycDocument(props.businessId, key, file)
  uploadedDocs.value[key] = true
}

const submitKYC = async () => {
  await verify(props.businessId)
  await fetchKYC()
}

onMounted(fetchKYC)
</script>

<script lang="ts">
export default {
  name: 'BusinessKYCModal'
}
</script>

<style scoped>
.kyc-modal { min-width: 350px; }
.bg-primary { background: #005967; }
</style>
