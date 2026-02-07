<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Business Profile</h1>
      <p class="text-gray-500 mt-1">Manage your business profile and complete KYC verification.</p>
    </div>

    <section class="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <ProfileSetupProgress v-if="business?.id" :business-id="business.id" />
      <BusinessKYCModal v-if="business?.id" :business-id="business.id" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/modules/useAuth'
import BusinessKYCModal from '~/components/business/BusinessKYCModal.vue'
import ProfileSetupProgress from '~/components/business/ProfileSetupProgress.vue'

definePageMeta({
  layout: 'dashboard'
})

const { business } = useAuth()
</script>