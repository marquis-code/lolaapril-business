<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Reviews</h1>
          <p class="text-gray-500">Manage customer reviews and feedback</p>
        </div>
      </section>

       <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
         <div v-for="n in 3" :key="n" class="bg-white rounded-xl border border-gray-100 p-6 animate-pulse h-24"></div>
      </div>

       <!-- Reviews List -->
      <div v-else class="space-y-4">
        <div v-if="reviews.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-100">
           <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">No reviews yet</h3>
          <p class="text-gray-500">Reviews from your customers will appear here.</p>
        </div>

        <div
          v-for="review in reviews"
          :key="review.id || review._id"
          class="bg-white rounded-xl border border-gray-100 p-6"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Review Content -->
            <div class="flex-1 space-y-3">
               <div class="flex items-center justify-between">
                   <div class="flex items-center gap-3">
                       <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                           {{ (review.customerName || 'A').charAt(0).toUpperCase() }}
                       </div>
                       <div>
                           <p class="font-semibold text-gray-900">{{ review.customerName || 'Anonymous' }}</p>
                           <p class="text-xs text-gray-500">{{ formatDate(review.createdAt) }}</p>
                       </div>
                   </div>
                   <div class="flex items-center gap-1">
                        <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                   </div>
               </div>
               
               <p class="text-gray-700">{{ review.comment }}</p>

               <div v-if="review.response" class="pl-4 border-l-2 border-gray-100 mt-4">
                   <p class="text-xs text-gray-500 mb-1">Your Response</p>
                   <p class="text-gray-600 text-sm">{{ review.response }}</p>
               </div>
            </div>

            <!-- Action -->
            <div class="flex items-start" v-if="!review.response">
                 <button
                    @click="openRespondModal(review)"
                    class="px-4 py-2 rounded-lg border border-[#005967] text-[#005967] text-sm font-medium hover:bg-[#005967]/5 transition-colors whitespace-nowrap"
                >
                    Respond
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Respond Modal -->
     <UiModal v-model="showRespondModal" title="Respond to Review">
        <div class="space-y-4">
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
                <textarea v-model="responseForm.response" rows="4" class="w-full rounded-lg border-gray-300 focus:border-[#005967] focus:ring-[#005967]" placeholder="Write your response..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-4">
                <button @click="showRespondModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button @click="confirmRespond" :disabled="respondLoading" class="px-4 py-2 bg-[#005967] text-white rounded-lg hover:bg-[#004450] disabled:opacity-50">
                    {{ respondLoading ? 'Posting...' : 'Post Response' }}
                </button>
            </div>
        </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGetBusinessReviews } from '@/composables/modules/review/useGetBusinessReviews'
import { useRespondToReview } from '@/composables/modules/review/useRespondToReview'
import { useAuth } from '@/composables/modules/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { business } = useAuth()
const { reviews, loading, getReviews } = useGetBusinessReviews()
const { respondToReview, loading: respondLoading } = useRespondToReview()

const showRespondModal = ref(false)
const selectedReview = ref<any>(null)
const responseForm = ref({ response: '' })

onMounted(() => {
   if(business.value?.id) {
        getReviews(business.value.id)
   }
})

const formatDate = (dateString: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const openRespondModal = (review: any) => {
    selectedReview.value = review
    responseForm.value.response = ''
    showRespondModal.value = true
}

const confirmRespond = async () => {
    if (!selectedReview.value) return
    await respondToReview(selectedReview.value.id || selectedReview.value._id, responseForm.value.response)
    showRespondModal.value = false
    if(business.value?.id) {
        getReviews(business.value.id)
   }
}
</script>
