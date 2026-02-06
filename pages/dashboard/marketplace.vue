<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Overview -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Marketplace Overview</h2>
            <p class="text-sm text-gray-500">Visibility, reviews, and quality signals</p>
          </div>
          <button
            @click="refreshMarketplace"
            :disabled="statsLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-60"
          >
            {{ statsLoading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Marketplace Views</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatNumber(statsSummary.views || 0) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Bookings From Marketplace</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatNumber(statsSummary.bookings || 0) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Average Rating</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.averageRating || qualityScoreValue || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Review Count</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatNumber(statsSummary.reviewCount || reviews.length) }}</p>
          </div>
        </div>
      </section>

      <!-- Verification -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Verification</h2>
            <p class="text-sm text-gray-500">Manage marketplace verification status</p>
          </div>
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="verificationBadgeClass"
          >
            {{ verificationStatusLabel }}
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UiAnimatedInput v-model="tenantId" type="text" label="Tenant ID" placeholder="Enter tenant ID" />
          <UiAnimatedInput v-model="businessIdInput" type="text" label="Business ID" placeholder="Enter business ID" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="verificationPayload.legalName" type="text" label="Legal Name" placeholder="Enter legal name" />
          <UiAnimatedInput v-model="verificationPayload.contactEmail" type="email" label="Contact Email" placeholder="Enter contact email" />
          <UiAnimatedInput v-model="verificationPayload.contactPhone" type="text" label="Contact Phone" placeholder="Enter contact phone" />
          <div class="lg:col-span-2">
            <UiAnimatedInput v-model="verificationPayload.businessAddress" type="text" label="Business Address" placeholder="Enter business address" />
          </div>
          <UiAnimatedInput v-model="verificationPayload.registrationNumber" type="text" label="Registration Number" placeholder="Enter registration number" />
          <UiAnimatedInput v-model="verificationPayload.website" type="text" label="Website" placeholder="Enter website URL" />
          <div class="lg:col-span-3">
            <label class="text-xs text-gray-500">Supporting Notes</label>
            <textarea v-model="verificationPayload.notes" rows="3" class="mt-1 w-full rounded-lg border-gray-200 text-sm"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="loadVerificationStatus"
            :disabled="verificationStatusLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
          >
            {{ verificationStatusLoading ? 'Loading...' : 'Refresh Status' }}
          </button>
          <button
            @click="submitVerification"
            :disabled="verificationSubmitLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {{ verificationSubmitLoading ? 'Submitting...' : 'Submit Verification' }}
          </button>
        </div>
      </section>

      <!-- Quality Score -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Quality Score</h2>
            <p class="text-sm text-gray-500">Performance indicators for marketplace ranking</p>
          </div>
          <button
            @click="updateQuality"
            :disabled="qualityUpdateLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
          >
            {{ qualityUpdateLoading ? 'Updating...' : 'Update Metrics' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Quality Score</p>
            <p class="text-lg font-semibold text-gray-900">{{ qualityScoreValue || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Response Rate</p>
            <p class="text-lg font-semibold text-gray-900">{{ qualityScoreMetrics.responseRate ?? 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Completion Rate</p>
            <p class="text-lg font-semibold text-gray-900">{{ qualityScoreMetrics.completionRate ?? 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Dispute Rate</p>
            <p class="text-lg font-semibold text-gray-900">{{ qualityScoreMetrics.disputeRate ?? 'N/A' }}</p>
          </div>
        </div>
      </section>

      <!-- Reviews -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Marketplace Reviews</h2>
            <p class="text-sm text-gray-500">Manage feedback and responses</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-24">
              <UiAnimatedInput v-model.number="reviewPage" type="number" label="Page" placeholder="1" />
            </div>
            <div class="w-24">
              <UiAnimatedInput v-model.number="reviewLimit" type="number" label="Limit" placeholder="1" />
            </div>
            <button
              @click="loadReviews"
              :disabled="reviewsLoading"
              class="h-10 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {{ reviewsLoading ? 'Loading...' : 'Load Reviews' }}
            </button>
          </div>
        </div>

        <section class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ClientOnly>
            <AnalyticsChartCard
              title="Rating Distribution"
              type="bar"
              dataset-label="Reviews"
              :labels="ratingLabels"
              :values="ratingValues"
            />
          </ClientOnly>
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-900">Latest Reviews</h3>
            <div class="mt-3 space-y-3 max-h-96 overflow-y-auto">
              <div v-for="review in reviews" :key="review._id || review.id" class="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ review.reviewerName || review.clientName || 'Anonymous' }}</p>
                    <p class="text-xs text-gray-500">Rating: {{ review.rating || review.stars || 'N/A' }}</p>
                  </div>
                  <button
                    @click="markReviewHelpful(review._id || review.id)"
                    :disabled="markHelpfulLoading"
                    class="text-xs font-semibold text-primary"
                  >
                    Mark Helpful
                  </button>
                </div>
                <p class="text-sm text-gray-700">{{ review.text || review.comment || review.message || 'No review text provided.' }}</p>
                <div class="space-y-2">
                  <label class="text-xs text-gray-500">Response</label>
                  <textarea
                    v-model="reviewResponses[review._id || review.id]"
                    rows="2"
                    class="w-full rounded-lg border-gray-200 text-sm"
                  ></textarea>
                  <button
                    @click="respondToReview(review._id || review.id)"
                    :disabled="responseLoading"
                    class="px-3 py-2 rounded-lg text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
                  >
                    Respond
                  </button>
                </div>
              </div>
              <p v-if="!reviews.length" class="text-xs text-gray-400">No reviews yet.</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
// import AnalyticsChartCard from '@/components/analytics/AnalyticsChartCard.vue'
import { useUser } from '@/composables/modules/auth/user'
import { useSubmitMarketplaceVerification } from '@/composables/modules/marketplace/useSubmitMarketplaceVerification'
import { useMarketplaceVerificationStatus } from '@/composables/modules/marketplace/useMarketplaceVerificationStatus'
import { useMarketplaceReviews } from '@/composables/modules/marketplace/useMarketplaceReviews'
import { useRespondToMarketplaceReview } from '@/composables/modules/marketplace/useRespondToMarketplaceReview'
import { useMarkMarketplaceReviewHelpful } from '@/composables/modules/marketplace/useMarkMarketplaceReviewHelpful'
import { useUpdateMarketplaceQualityMetrics } from '@/composables/modules/marketplace/useUpdateMarketplaceQualityMetrics'
import { useMarketplaceQualityScore } from '@/composables/modules/marketplace/useMarketplaceQualityScore'
import { useMarketplaceStats } from '@/composables/modules/marketplace/useMarketplaceStats'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { businessId, userId } = useUser()

const tenantId = ref(businessId.value || '')
const businessIdInput = ref(businessId.value || '')

watch(businessId, (value: string) => {
  if (!tenantId.value) tenantId.value = value || ''
  if (!businessIdInput.value) businessIdInput.value = value || ''
})

const verificationPayload = ref({
  legalName: '',
  contactEmail: '',
  contactPhone: '',
  businessAddress: '',
  registrationNumber: '',
  website: '',
  notes: ''
})

const { data: verificationStatus, loading: verificationStatusLoading, execute: fetchVerificationStatus } = useMarketplaceVerificationStatus()
const { loading: verificationSubmitLoading, execute: submitVerificationRequest } = useSubmitMarketplaceVerification()

const { data: qualityScore, loading: qualityScoreLoading, execute: fetchQualityScore } = useMarketplaceQualityScore()
const { loading: qualityUpdateLoading, execute: updateQualityMetrics } = useUpdateMarketplaceQualityMetrics()

const { data: statsData, loading: statsLoading, execute: fetchStats } = useMarketplaceStats()

const { data: reviewsData, loading: reviewsLoading, execute: fetchReviews } = useMarketplaceReviews()
const { loading: responseLoading, execute: submitResponse } = useRespondToMarketplaceReview()
const { loading: markHelpfulLoading, execute: markHelpful } = useMarkMarketplaceReviewHelpful()

const reviewPage = ref(1)
const reviewLimit = ref(8)
const reviewResponses = ref<Record<string, string>>({})

const statsSummary = computed(() => statsData.value?.summary || statsData.value?.stats || statsData.value || {})
const qualityScoreValue = computed(() => qualityScore.value?.score || qualityScore.value?.qualityScore || qualityScore.value?.value || '')
const qualityScoreMetrics = computed(() => qualityScore.value?.metrics || qualityScore.value?.details || {})

const reviews = computed(() => reviewsData.value?.reviews || reviewsData.value?.data || reviewsData.value || [])

const ratingLabels = ['1', '2', '3', '4', '5']
const ratingValues = computed(() => {
  const buckets = [0, 0, 0, 0, 0]
  reviews.value.forEach((review: any) => {
    const rating = Number(review.rating || review.stars || review.score || 0)
    if (rating >= 1 && rating <= 5) {
      buckets[Math.round(rating) - 1] += 1
    }
  })
  return buckets
})

const verificationStatusLabel = computed(() => {
  const status = verificationStatus.value?.status || verificationStatus.value?.state || verificationStatus.value || 'pending'
  return String(status).replace('_', ' ').toUpperCase()
})

const verificationBadgeClass = computed(() => {
  const status = verificationStatus.value?.status || verificationStatus.value?.state || verificationStatus.value || 'pending'
  if (status === 'approved' || status === 'verified') return 'bg-emerald-100 text-emerald-700'
  if (status === 'rejected' || status === 'failed') return 'bg-rose-100 text-rose-700'
  return 'bg-amber-100 text-amber-700'
})

const loadVerificationStatus = async () => {
  if (!tenantId.value) return
  await fetchVerificationStatus(tenantId.value)
}

const submitVerification = async () => {
  if (!tenantId.value) return
  const payload = Object.fromEntries(
    Object.entries(verificationPayload.value).filter(([, value]) => value)
  )
  await submitVerificationRequest(tenantId.value, payload)
  await loadVerificationStatus()
}

const updateQuality = async () => {
  if (!tenantId.value) return
  await updateQualityMetrics(tenantId.value)
  await fetchQualityScore(tenantId.value)
}

const loadQualityScore = async () => {
  if (!tenantId.value) return
  await fetchQualityScore(tenantId.value)
}

const loadReviews = async () => {
  if (!businessIdInput.value) return
  await fetchReviews(businessIdInput.value, { page: reviewPage.value, limit: reviewLimit.value })
}

const respondToReview = async (reviewId: string) => {
  const text = reviewResponses.value[reviewId]
  if (!text || !userId.value) return
  await submitResponse(reviewId, { text, responderId: userId.value })
  reviewResponses.value[reviewId] = ''
  await loadReviews()
}

const markReviewHelpful = async (reviewId: string) => {
  await markHelpful(reviewId, true)
  await loadReviews()
}

const refreshMarketplace = async () => {
  await fetchStats()
  await loadVerificationStatus()
  await loadQualityScore()
  await loadReviews()
}

const formatNumber = (value: number) => {
  if (Number.isNaN(value)) return '0'
  return new Intl.NumberFormat().format(value)
}

onMounted(async () => {
  await refreshMarketplace()
})
</script>
