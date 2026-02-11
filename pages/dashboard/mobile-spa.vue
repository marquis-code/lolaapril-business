<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mobile SPA Requests</h1>
          <p class="text-gray-500">Manage service requests from mobile users</p>
        </div>
        <div class="flex items-center gap-3">
             <UiSelectInput
                v-model="filterStatus"
                label=""
                :options="statusOptions"
                option-label="label"
                option-value="value"
                placeholder="All Statuses"
                class="min-w-[180px]"
              />
        </div>
      </section>

       <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
         <div v-for="n in 5" :key="n" class="bg-white rounded-xl border border-gray-100 p-6 animate-pulse h-32"></div>
      </div>

      <!-- Requests List -->
      <div v-else class="space-y-4">
        <div v-if="requests.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-100">
           <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">No requests found</h3>
          <p class="text-gray-500">New mobile service requests will appear here.</p>
        </div>

        <div
          v-for="request in requests"
          :key="request._id"
          class="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="openRequestDetails(request)"
        >
             <div class="flex flex-col md:flex-row justify-between gap-4">
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                      <h3 class="text-lg font-semibold text-gray-900">
                          {{ request.services && request.services.length > 0 ? request.services[0].serviceName : 'Service Request' }}
                      </h3>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" :class="getStatusClass(request.status)">
                          {{ request.status }}
                      </span>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                     <div class="flex items-center gap-1.5">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                         {{ formatDate(request.requestedDate) }}
                     </div>
                      <div class="flex items-center gap-1.5">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         {{ request.requestedTime }}
                     </div>
                      <div class="flex items-center gap-1.5">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                         {{ request.location && request.location.address ? request.location.address : 'No address provided' }}
                     </div>
                  </div>
                  <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-900">{{ request.clientName || 'Customer' }}</span>
                      <span class="text-sm text-gray-500">• {{ request.clientPhone || 'No phone' }}</span>
                  </div>
                </div>
            
            <div class="flex items-center gap-3">
                <button
                    v-if="request.status === 'pending'"
                    @click.stop="openAcceptModal(request)"
                    class="px-4 py-2 rounded-lg bg-[#005967] text-white text-sm font-medium hover:bg-[#004450] transition-colors"
                >
                    Accept
                </button>
                 <button
                    v-if="request.status === 'pending'"
                    @click.stop="openRejectModal(request)"
                    class="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                    Reject
                </button>
                 <button
                    v-if="request.status === 'pending'"
                    @click.stop="openSuggestTimeModal(request)"
                    class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    Suggest Time
                </button>
                 <button
                    v-if="request.status === 'confirmed' || request.status === 'accepted'"
                    @click.stop="handleComplete(request)"
                    class="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                >
                    Mark Complete
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Accept Modal -->
    <UiModal v-model="showAcceptModal" title="Accept Request">
        <div class="space-y-4">
            <p class="text-gray-600">Are you sure you want to accept this request?</p>
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Custom Payment Link (Optional)</label>
                <input v-model="acceptForm.paymentLink" type="url" placeholder="https://..." class="custom-input" />
                 <p class="text-xs text-gray-500 mt-1">If left blank, a system payment link will be generated.</p>
            </div>
            <div class="flex justify-end gap-3 pt-4">
                <button @click="showAcceptModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button @click="confirmAccept" :disabled="acceptLoading" class="px-4 py-2 bg-[#005967] text-white rounded-lg hover:bg-[#004450] disabled:opacity-50">
                    {{ acceptLoading ? 'Accepting...' : 'Confirm Accept' }}
                </button>
            </div>
        </div>
    </UiModal>

    <!-- Reject Modal -->
    <UiModal v-model="showRejectModal" title="Reject Request">
        <div class="space-y-4">
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                <UiAnimatedInput type="textarea" v-model="rejectForm.reason" :rows="3" :cols="6"  placeholder="Please provide a reason..." />
            </div>
            <div class="flex justify-end gap-3 pt-4">
                <button @click="showRejectModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button @click="confirmReject" :disabled="rejectLoading" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                    {{ rejectLoading ? 'Rejecting...' : 'Confirm Reject' }}
                </button>
            </div>
        </div>
    </UiModal>

     <!-- Suggest Time Modal -->
    <UiModal v-model="showSuggestTimeModal" title="Suggest New Time">
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input v-model="suggestTimeForm.suggestedDate" type="date" class="w-full rounded-lg border-gray-300 focus:border-[#005967] focus:ring-[#005967]" />
                 </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input v-model="suggestTimeForm.suggestedTime" type="time" class="w-full rounded-lg border-gray-300 focus:border-[#005967] focus:ring-[#005967]" />
                 </div>
             </div>
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea v-model="suggestTimeForm.note" rows="3" class="w-full rounded-lg border-gray-300 focus:border-[#005967] focus:ring-[#005967]" placeholder="Reason for suggesting new time..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-4">
                <button @click="showSuggestTimeModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button @click="confirmSuggestTime" :disabled="suggestTimeLoading" class="px-4 py-2 bg-[#005967] text-white rounded-lg hover:bg-[#004450] disabled:opacity-50">
                    {{ suggestTimeLoading ? 'Sending...' : 'Send Suggestion' }}
                </button>
            </div>
        </div>
    </UiModal>

    <!-- Teleport Modal for Request Details -->
    <!-- <teleport to="body"> -->
    <RequestDetailsModal v-model="showDetailsModal" :selectedRequest="selectedRequest" @close="showDetailsModal = false" />
    <!-- </teleport> -->

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGetMobileSpaRequests } from '@/composables/modules/mobileSpa/useGetMobileSpaRequests'
import { useAcceptMobileSpaRequest } from '@/composables/modules/mobileSpa/useAcceptMobileSpaRequest'
import { useRejectMobileSpaRequest } from '@/composables/modules/mobileSpa/useRejectMobileSpaRequest'
import { useSuggestMobileSpaTime } from '@/composables/modules/mobileSpa/useSuggestMobileSpaTime'
import { useCompleteMobileSpaRequest } from '@/composables/modules/mobileSpa/useCompleteMobileSpaRequest'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const filterStatus = ref('')
const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Completed', value: 'completed' },
     { label: 'Cancelled', value: 'cancelled' }
]

const { requests, loading, getRequests } = useGetMobileSpaRequests()
const { acceptRequest, loading: acceptLoading } = useAcceptMobileSpaRequest()
const { rejectRequest, loading: rejectLoading } = useRejectMobileSpaRequest()
const { suggestTime, loading: suggestTimeLoading } = useSuggestMobileSpaTime()
const { completeRequest, loading: completeLoading } = useCompleteMobileSpaRequest()

const showAcceptModal = ref(false)
const showRejectModal = ref(false)
const showSuggestTimeModal = ref(false)
const showDetailsModal = ref(false)
const selectedRequest = ref<any>(null)

const acceptForm = ref({ paymentLink: '' })
const rejectForm = ref({ reason: '' })
const suggestTimeForm = ref({ suggestedDate: '', suggestedTime: '', note: '' })

onMounted(() => {
    getRequests()
})

watch(filterStatus, () => {
    getRequests({ status: filterStatus.value || undefined })
})

// Helpers
const formatDate = (dateString: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusClass = (status: string) => {
    switch(status?.toLowerCase()) {
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'accepted': return 'bg-blue-100 text-blue-800'
        case 'confirmed': return 'bg-blue-100 text-blue-800'
        case 'completed': return 'bg-green-100 text-green-800'
        case 'rejected': return 'bg-red-100 text-red-800'
        case 'cancelled': return 'bg-gray-100 text-gray-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Actions
const openRequestDetails = (request: any) => {
    selectedRequest.value = request
    showDetailsModal.value = true
}

const openAcceptModal = (request: any) => {
    selectedRequest.value = request
    acceptForm.value.paymentLink = ''
    showAcceptModal.value = true
}

const confirmAccept = async () => {
    if(!selectedRequest.value) return
    await acceptRequest(selectedRequest.value.id || selectedRequest.value._id, acceptForm.value.paymentLink ? { paymentLink: acceptForm.value.paymentLink } : undefined)
    showAcceptModal.value = false
    getRequests({ status: filterStatus.value || undefined })
}

const openRejectModal = (request: any) => {
    selectedRequest.value = request
    rejectForm.value.reason = ''
    showRejectModal.value = true
}

const confirmReject = async () => {
     if(!selectedRequest.value) return
     await rejectRequest(selectedRequest.value.id || selectedRequest.value._id, rejectForm.value.reason)
     showRejectModal.value = false
     getRequests({ status: filterStatus.value || undefined })
}

const openSuggestTimeModal = (request: any) => {
    selectedRequest.value = request
    suggestTimeForm.value = { suggestedDate: '', suggestedTime: '', note: '' }
    showSuggestTimeModal.value = true
}

const confirmSuggestTime = async () => {
    if(!selectedRequest.value) return
    await suggestTime(selectedRequest.value.id || selectedRequest.value._id, suggestTimeForm.value)
    showSuggestTimeModal.value = false
    getRequests({ status: filterStatus.value || undefined })
}

const handleComplete = async (request: any) => {
    if(confirm('Are you sure you want to mark this request as completed?')) {
        await completeRequest(request.id || request._id)
        getRequests({ status: filterStatus.value || undefined })
    }
}

</script>
