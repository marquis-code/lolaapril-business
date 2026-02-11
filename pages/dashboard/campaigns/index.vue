<template>
  <main class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mt-6">
      <h1 class="text-2xl font-medium text-gray-900">Email Campaigns</h1>
      <button
        @click="navigateTo('/dashboard/campaigns/create')"
        class="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium"
      >
        Create Campaign
      </button>
    </div>

    <div class="mt-6" v-if="loading">
       <div class="animate-pulse space-y-4">
          <div class="h-12 bg-gray-100 rounded w-full"></div>
          <div class="h-12 bg-gray-100 rounded w-full"></div>
          <div class="h-12 bg-gray-100 rounded w-full"></div>
       </div>
    </div>

    <div v-else class="mt-6 bg-white border border-gray-100 rounded-lg overflow-hidden">
        <div v-if="campaigns.length === 0" class="p-8 text-center text-gray-500">
            No campaigns found. Create your first campaign to get started.
        </div>
      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-xs uppercase text-gray-500 bg-gray-50">
            <th class="px-6 py-4 font-medium">Name</th>
            <th class="px-6 py-4 font-medium">Subject</th>
            <th class="px-6 py-4 font-medium">Status</th>
            <th class="px-6 py-4 font-medium">Stats</th>
            <th class="px-6 py-4 font-medium">Created At</th>
            <th class="px-6 py-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="campaign in campaigns"
            :key="campaign._id"
            class="hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ campaign.name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ campaign.subject }}
            </td>
            <td class="px-6 py-4 text-sm">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                :class="{
                  'bg-green-100 text-green-700': campaign.status === 'completed',
                  'bg-yellow-100 text-yellow-700': campaign.status === 'scheduled',
                  'bg-blue-100 text-blue-700': campaign.status === 'sending',
                  'bg-gray-100 text-gray-700': campaign.status === 'draft',
                  'bg-red-100 text-red-700': campaign.status === 'failed'
                }"
              >
                {{ campaign.status }}
              </span>
            </td>
             <td class="px-6 py-4 text-sm text-gray-600">
               <div v-if="campaign.stats" class="flex gap-3 text-xs">
                 <span class="text-green-600">Sent: {{ campaign.stats.sentCount }}</span>
                 <span class="text-red-600">Failed: {{ campaign.stats.failedCount }}</span>
               </div>
               <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
               {{ new Date(campaign.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-3">
                    <button @click="navigateTo(`/dashboard/campaigns/${campaign._id}`)" class="text-gray-500 hover:text-black">
                         Edit
                    </button>
                    <button @click="handleDuplicate(campaign._id)" class="text-gray-500 hover:text-black">
                        Duplicate
                    </button>
                    <button @click="handleDelete(campaign._id)" class="text-red-500 hover:text-red-700">
                        Delete
                    </button>
                </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useListCampaigns } from '@/composables/modules/campaigns/useListCampaigns'
import { useDeleteCampaign } from '@/composables/modules/campaigns/useDeleteCampaign'
import { useDuplicateCampaign } from '@/composables/modules/campaigns/useDuplicateCampaign'

const { campaigns, loading, fetchCampaigns } = useListCampaigns()
const { deleteCampaign } = useDeleteCampaign()
const { duplicateCampaign } = useDuplicateCampaign()

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this campaign?')) {
    await deleteCampaign(id)
    await fetchCampaigns()
  }
}

const handleDuplicate = async (id: string) => {
    await duplicateCampaign(id)
    await fetchCampaigns()
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>
