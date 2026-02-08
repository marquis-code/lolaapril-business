<template>
  <section id="pricing" class="py-12 md:py-20 bg-white">
    <div class="">
      <div v-if="isLoading" class="flex flex-col md:flex-row gap-8 animate-pulse">
        <!-- Loading skeleton for Current Plan (left) -->
        <div class="md:w-1/3 w-full bg-gray-50 rounded-2xl p-6 flex flex-col mb-6 md:mb-0">
          <div class="h-4 w-24 bg-gray-200 rounded mb-4"></div>
          <div class="h-8 w-2/3 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
          <div class="space-y-2 mb-4">
            <div v-for="i in 6" :key="i" class="h-3 w-5/6 bg-gray-200 rounded"></div>
          </div>
          <div class="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
        <!-- Loading skeleton for Plans (right) -->
        <div class="md:w-2/3 w-full flex flex-col gap-4">
          <div class="flex gap-4 mb-4">
            <div class="h-8 w-24 bg-gray-200 rounded"></div>
            <div class="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
          <div v-for="i in 3" :key="i" class="rounded-2xl border bg-white flex flex-col md:flex-row items-start md:items-center p-6 gap-4 md:gap-0 relative">
            <div class="absolute left-6 top-6 flex items-center justify-center">
              <span class="inline-block w-4 h-4 rounded-full border-2 border-gray-200"></span>
            </div>
            <div class="flex-1 flex flex-col pl-10">
              <div class="h-6 w-32 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 w-40 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            </div>
            <div class="flex flex-col items-end md:items-center md:w-32">
              <div class="h-8 w-20 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col md:flex-row gap-8">
        <!-- Current Plan (left) -->
        <div class="md:w-1/3 w-full bg-gray-50 rounded-2xl p-6 flex flex-col mb-6 md:mb-0">
          <!-- <span class="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-2">Current Plan</span> -->
          <h3 class="text-2xl font-bold mb-2">{{ currentPlan.name }}</h3>
          <p class="text-gray-500 mb-6">{{ currentPlan.description }}</p>
          <ul class="mb-4 space-y-3">
            <li v-for="feature in currentPlan.features" :key="feature" class="text-sm text-gray-600 flex items-center">
              <svg class="w-3 h-3 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
              {{ feature }}
            </li>
          </ul>
          <div class="mb-2">
            <span class="text-sm text-gray-400">Commission Rate:</span>
            <span class="text-sm font-semibold">{{ currentPlan.commissionRate }}%</span>
          </div>
          <div class="mb-2">
            <span class="text-sm text-gray-400">Monthly:</span>
            <span class="text-sm font-semibold">{{ Number(currentPlan.monthlyPrice) === 0 ? 'Free' : '₦' + (Number(currentPlan.monthlyPrice) || 0).toLocaleString() }}</span>
          </div>
          <div class="mb-4">
            <span class="text-sm text-gray-400">Yearly:</span>
            <span class="text-sm font-semibold">{{ Number(currentPlan.yearlyPrice) === 0 ? 'Free' : '₦' + (Number(currentPlan.yearlyPrice) || 0).toLocaleString() }}</span>
          </div>
          <!-- <div class="mb-4">
            <p class="text-sm text-gray-400 mb-1">Subscription Date</p>
            <p class="text-lg font-semibold">{{ currentPlan.subscriptionDate }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400 mb-1">Expires on</p>
            <p class="text-lg font-semibold">{{ currentPlan.expiryDate }}</p>
          </div> -->
        </div>
        <!-- Plans (right) -->
        <div class="md:w-2/3 w-full flex flex-col gap-4">
          <div class="flex gap-4 mb-4">
            <button @click="showYearly = false" :class="['px-4 py-1 rounded-full text-sm font-semibold', !showYearly ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']">Monthly</button>
            <button @click="showYearly = true" :class="['px-4 py-1 rounded-full text-sm font-semibold', showYearly ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']">Yearly</button>
          </div>
          <div v-for="(tier, idx) in pricingTiers" :key="tier._id"
            class="rounded-2xl border bg-white flex flex-col md:flex-row items-start md:items-center p-6 gap-4 md:gap-0 relative transition-all duration-200"
            :class="[
              selectedPlan === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
              'hover:border-blue-500 hover:bg-blue-50'
            ]"
            @click="selectedPlan = idx"
            style="cursor:pointer"
          >
            <div class="absolute left-6 top-6 flex items-center justify-center">
              <span class="inline-block w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="selectedPlan === idx ? 'border-blue-500' : 'border-gray-400'">
                <span v-if="selectedPlan === idx" class="block w-2 h-2 rounded-full bg-blue-500"></span>
              </span>
            </div>
            <div class="flex-1 flex flex-col pl-10">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg md:text-xl font-bold text-gray-900">{{ tier.tierName }}</span>
                <span v-if="idx === recommendedIndex" class="bg-blue-100 text-blue-700 text-sm font-semibold px-2 py-1 rounded-full">Recommended</span>
              </div>
              <p class="text-gray-500 text-sm mb-2">{{ tier.description }}</p>
              <!-- Features moved to left card -->
              <NuxtLink to="#" class="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                See all features
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
            <div class="flex flex-col items-end md:items-center md:w-32">
              <span class="text-xl md:text-2xl font-bold text-blue-600">
                <template v-if="showYearly">
                  {{ Number(tier.yearlyPrice) === 0 ? 'Free' : '₦' + (Number(tier.yearlyPrice) || 0).toLocaleString() + '/yr' }}
                </template>
                <template v-else>
                  {{ Number(tier.monthlyPrice) === 0 ? 'Free' : '₦' + (Number(tier.monthlyPrice) || 0).toLocaleString() + '/mo' }}
                </template>
              </span>
              <span v-if="showYearly && idx === recommendedIndex" class="text-sm text-gray-500">paid annually</span>
              <span class="text-sm text-gray-400">Commission: {{ tier.commissionRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useFetchPricingTiers } from '~/composables/modules/pricing/useFetchPricingTiers'
const { data: pricingTiers, loading: isLoading } = useFetchPricingTiers();
const selectedPlan = ref(0);
const showYearly = ref(false);
const recommendedIndex = computed(() => 0);

function readableFeatures(features) {
  if (!features) return [];
  return [
    `Up to ${features.maxStaff} staff`,
    `Up to ${features.maxBookingsPerMonth} bookings/month`,
    features.customBranding ? 'Custom branding' : 'No custom branding',
    features.analyticsAccess ? 'Analytics access' : 'No analytics',
    features.prioritySupport ? 'Priority support' : 'Standard support',
    features.multiLocation ? 'Multi-location support' : 'Single location',
    features.apiAccess ? 'API access' : 'No API access',
  ];
}

const currentPlan = computed(() => {
  if (!pricingTiers.value || !pricingTiers.value.length) return {};
  const tier = pricingTiers.value[selectedPlan.value];
  return {
    name: tier?.tierName || '',
    description: tier?.description || '',
    commissionRate: tier?.commissionRate,
    features: readableFeatures(tier?.features),
    monthlyPrice: tier?.monthlyPrice,
    yearlyPrice: tier?.yearlyPrice,
    subscriptionDate: tier?.subscriptionDate || '2022 - 10 - 24',
    expiryDate: tier?.expiryDate || '2022 - 11 - 24',
  };
});
</script>

<style scoped>
.container {
  max-width: 1100px;
}
@media (max-width: 768px) {
  .container {
    max-width: 100vw;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .flex-col.md\:flex-row {
    flex-direction: column !important;
  }
  .md\:w-1\/3 {
    width: 100% !important;
  }
  .md\:w-2\/3 {
    width: 100% !important;
  }
  .pl-10 {
    padding-left: 0 !important;
  }
  .absolute.left-6.top-6 {
    position: static !important;
    margin-bottom: 0.5rem;
  }
}
</style>
