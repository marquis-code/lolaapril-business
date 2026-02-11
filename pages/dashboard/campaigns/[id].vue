<template>
  <main class="max-w-5xl mx-auto py-6">
    <div v-if="loading" class="animate-pulse space-y-4">
       <div class="h-8 bg-gray-100 rounded w-1/3"></div>
       <div class="h-64 bg-gray-100 rounded w-full"></div>
    </div>

    <div v-else-if="campaign" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
           <div class="flex items-center gap-3 mb-1">
             <h1 class="text-2xl font-bold text-gray-900">{{ campaign.name }}</h1>
             <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
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
           </div>
           <p class="text-gray-500 text-sm">Created on {{ new Date(campaign.createdAt).toLocaleDateString() }}</p>
        </div>
        <div class="flex items-center gap-3">
             <button @click="navigateTo('/dashboard/campaigns')" class="text-gray-600 hover:text-black font-medium">
                Back
             </button>
             <button 
                v-if="campaign.status !== 'sending' && campaign.status !== 'completed'"
                @click="navigateTo(`/dashboard/campaigns/${campaign._id}?edit=true`)" 
                class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
             >
                Edit Campaign
             </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="text-gray-500 text-sm font-medium">Sent</h3>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ campaign.stats?.sentCount || 0 }}</p>
        </div>
        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="text-gray-500 text-sm font-medium">Failed</h3>
             <p class="text-2xl font-bold text-red-600 mt-1">{{ campaign.stats?.failedCount || 0 }}</p>
        </div>
        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="text-gray-500 text-sm font-medium">Click Rate</h3>
             <p class="text-2xl font-bold text-gray-900 mt-1">0%</p> <!-- Placeholder for now -->
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content Preview -->
        <div class="lg:col-span-2 space-y-6">
           <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <div class="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                   <h2 class="font-medium text-gray-900">Email Preview</h2>
                   <span class="text-xs text-gray-500">Subject: {{ campaign.subject }}</span>
               </div>
               <div class="p-6">
                 <!-- Email Preview Container -->
                 <div class="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px]">
                    <div class="bg-white rounded shadow-sm max-w-2xl mx-auto overflow-hidden">
                         <img v-if="campaign.bannerUrl" :src="campaign.bannerUrl" class="w-full h-auto object-cover" />
                         <div class="p-6 prose prose-sm max-w-none" v-html="campaign.content"></div>
                    </div>
                 </div>
               </div>
           </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
            <!-- Audience -->
             <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 class="font-medium text-gray-900 mb-3">Audience</h3>
                <div class="text-sm text-gray-600">
                    <p class="capitalize"><span class="font-medium text-gray-900">Type:</span> {{ campaign.audience.type?.replace('_', ' ') }}</p>
                    <div v-if="campaign.audience.specificEmails && campaign.audience.specificEmails.length" class="mt-2">
                         <p class="font-medium text-gray-900 mb-1">Recipients:</p>
                         <div class="flex flex-wrap gap-1">
                             <span v-for="email in campaign.audience.specificEmails.slice(0, 5)" :key="email" class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                                 {{ email }}
                             </span>
                             <span v-if="campaign.audience.specificEmails.length > 5" class="text-xs text-gray-500">
                                 +{{ campaign.audience.specificEmails.length - 5 }} more
                             </span>
                         </div>
                    </div>
                </div>
            </div>

            <!-- Schedule -->
             <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 class="font-medium text-gray-900 mb-3">Schedule</h3>
                <div class="text-sm text-gray-600 space-y-2">
                    <p class="capitalize"><span class="font-medium text-gray-900">Type:</span> {{ campaign.schedule.type }}</p>
                     <p v-if="campaign.schedule.scheduledAt">
                        <span class="font-medium text-gray-900">Scheduled For:</span><br>
                        {{ new Date(campaign.schedule.scheduledAt).toLocaleString() }}
                    </p>
                     <p v-if="campaign.schedule.cronExpression">
                        <span class="font-medium text-gray-900">Cron:</span> {{ campaign.schedule.cronExpression }}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
     <div v-else class="text-center py-12">
        <p class="text-gray-500">Campaign not found.</p>
        <button @click="navigateTo('/dashboard/campaigns')" class="text-black hover:underline mt-2">Go back to list</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useCampaignDetails } from '@/composables/modules/campaigns/useCampaignDetails'

const route = useRoute()
const campaignId = route.params.id as string
const { campaign, loading, getCampaignDetails } = useCampaignDetails()

// Redirect to edit if edit query param is present
if (route.query.edit === 'true') {
   navigateTo(`/dashboard/campaigns/create?id=${campaignId}`)
}

onMounted(() => {
    // If we have an edit mode in query, create.vue handles it by checking route params.
    // Actually, create.vue uses route.params.id to check for edit mode. 
    // If I navigate to /dashboard/campaigns/create?id=... it might not work as create.vue expects /:id
    // Wait, my router likely handles /dashboard/campaigns/[id] separately from /dashboard/campaigns/create.
    // My previous logic in create.vue: `const isEditing = computed(() => route.params.id && route.params.id !== 'create')`
    // This implies `create.vue` is likely mapped to `.../create`. 
    // And `[id].vue` is mapped to `.../:id`.
    // So to edit, I should send them to `create.vue`?
    // But `create.vue` doesn't take an ID query param, it takes it from path if it was a dynamic route.
    // Re-reading create.vue: `const isEditing = computed(() => route.params.id && route.params.id !== 'create')`
    // This looks like I am relying on the same file for both? 
    // Nuxt file routing:
    // `pages/dashboard/campaigns/create.vue` -> `/dashboard/campaigns/create`
    // `pages/dashboard/campaigns/[id].vue` -> `/dashboard/campaigns/:id` containing `create` IF `create.vue` didn't exist?
    // No, `create` takes precedence.
    // So if I go to `/dashboard/campaigns/create`, `route.params.id` is undefined.
    // If I go to `/dashboard/campaigns/123`, `route.params.id` is `123`.
    // So `create.vue` logic `route.params.id` will only be true if `create.vue` WAS `[id].vue` or similar.
    // But `create.vue` IS `create.vue`.
    // So `route.params.id` will be empty in `create.vue`.
    // So my `create.vue` logic for editing is flawed if it's a separate file.
    // It should facilitate editing if I navigate to it with some state or if I use a different route for edit.
    
    // Correction:
    // I should probably move the edit logic to `[id].vue` OR create a separate `edit/[id].vue` OR use `create.vue` for everything but then `create.vue` needs to be `[id].vue` handling 'create' as a special ID? No, that's messy.
    
    // Best approach:
    // `pages/dashboard/campaigns/create.vue` -> Create new.
    // `pages/dashboard/campaigns/[id]/edit.vue` -> Edit existing.
    // OR:
    // Reuse `create.vue` logic but I need to pass the ID.
    // If I navigate to `/dashboard/campaigns/create?id=123`, `route.params.id` is still undefined.
    // I should update `create.vue` to check `route.query.id` as well, OR I should make `create.vue` handle edits.
    
    // Let's modify `create.vue` in the next step to support `route.query.id` OR just make a specific edit route.
    // Actually, I can just use `pages/dashboard/campaigns/create.vue` for create.
    // And for edit, I can use `pages/dashboard/campaigns/edit/[id].vue` which reuses the form component?
    // I didn't make a form component.
    
    // Quick fix:
    // Modify `create.vue` to check for `route.query.id` if `route.params.id` is missing?
    // Or better:
    // `pages/dashboard/campaigns/[id].vue` is the details view.
    // I want an edit view.
    // I can make a dynamic route `pages/dashboard/campaigns/edit-[id].vue`? No.
    // `pages/dashboard/campaigns/edit/[id].vue`.
    
    // Let's stick to the current plan but fix `create.vue`.
    // I will modify `create.vue` to look at `route.query.id` if present, OR better, I will rename `create.vue` to `[id].vue` and handle both?
    // But I want a details view too.
    
    // Let's keep `create.vue` for creating.
    // And I will create `pages/dashboard/campaigns/[id]/edit.vue` which imports the same form logic? 
    // That involves refactoring to a component.
    
    // Alternative:
    // Just use `pages/dashboard/campaigns/create.vue` and pass `?id=...` for editing.
    // I will update `create.vue` to check `route.query.id`.
    
    // And `[id].vue` will be the details view.
    // The "Edit" button in `[id].vue` will go to `/dashboard/campaigns/create?id=...`
    
    getCampaignDetails(campaignId)
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>
