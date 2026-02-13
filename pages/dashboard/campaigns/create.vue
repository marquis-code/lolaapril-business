<template>
  <main class="max-w-4xl mx-auto py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Campaign' : 'Create Campaign' }}
      </h1>
      <button @click="router.back()" class="text-sm text-gray-500 hover:text-black">
        Cancel
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Info -->
      <section class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
        <h2 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Campaign Details</h2>
        
        <div class="grid gap-4">
          <UiAnimatedInput v-model="form.name" label="Campaign Name" required />
          <UiAnimatedInput v-model="form.subject" label="Subject Line"  required />
          <UiAnimatedInput v-model="form.previewText" label="Preview Text" />
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Campaign Banner</label>
            <div class="flex items-start gap-4">
              <div v-if="form.bannerUrl" class="relative group w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img :src="form.bannerUrl" alt="Banner Preview" class="w-full h-full object-cover" />
                <button 
                  type="button"
                  @click="form.bannerUrl = ''" 
                  class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
              <div 
                v-else
                @click="bannerInput?.click()"
                class="w-32 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors"
              >
                <div v-if="uploadingBanner" class="flex flex-col items-center">
                  <div class="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span class="text-[10px] text-gray-400 mt-1">Uploading...</span>
                </div>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <span class="text-[10px] text-gray-400 mt-1">Upload</span>
                </template>
              </div>
              <input 
                ref="bannerInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleBannerUpload" 
              />
              <div class="flex-grow text-xs text-gray-500 py-2">
                Recommend size: 1200x600px.<br/>
                Max size: 5MB.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content -->
       <section class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
        <h2 class="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Content</h2>
        <UiRichTextEditor v-model="form.content" label="Email Body" placeholder="Start writing your campaign..." />
      </section>

      <!-- Audience -->
      <section class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
        <h2 class="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Audience</h2>
        <div class="grid gap-4">
            <UiSelectInput
              v-model="form.audience.type"
              label="Target Audience"
              :options="[
                { label: 'All Clients', value: 'all' },
                { label: 'Active Clients', value: 'active_clients' },
                { label: 'Specific Emails', value: 'specific_emails' }
              ]"
              option-label="label"
              option-value="value"
              placeholder="Select audience"
            />

            <UiAnimatedInput
              v-if="form.audience.type === 'specific_emails'"
              v-model="specificEmailsInput"
              label="Emails (comma separated)"
              type="textarea"
              :rows="3"
            />
        </div>
      </section>

       <!-- Schedule -->
      <section class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
        <h2 class="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Schedule</h2>
        <div class="grid gap-4">
            <UiSelectInput
              v-model="form.schedule.type"
              label="Send Time"
              :options="[
                { label: 'Send Immediately', value: 'now' },
                { label: 'Schedule for Future', value: 'scheduled' },
                { label: 'Recurring (Cron)', value: 'recurring' }
              ]"
              option-label="label"
              option-value="value"
              placeholder="Select send time"
            />

            <UiAnimatedInput
              v-if="form.schedule.type === 'scheduled'"
              v-model="form.schedule.scheduledAt"
              label="Date & Time"
              type="datetime-local"
              placeholder="Select date and time"
            />

            <UiAnimatedInput
              v-if="form.schedule.type === 'recurring'"
              v-model="form.schedule.cronExpression"
              label="Cron Expression"
              placeholder="0 9 * * 1"
            />
            <p v-if="form.schedule.type === 'recurring'" class="text-xs text-gray-500 mt-1">Example: 0 9 * * 1 (Every Monday at 9am)</p>
        </div>
      </section>

      <div class="flex justify-end gap-3 pt-4">
         <button type="button" @click="router.back()" class="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
            Cancel
        </button>
        <button type="submit" :disabled="loading" class="bg-black text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Saving...' : (isEditing ? 'Update Campaign' : 'Create Campaign') }}
        </button>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useCreateCampaign } from '@/composables/modules/campaigns/useCreateCampaign'
import { useCampaignDetails } from '@/composables/modules/campaigns/useCampaignDetails'
import { useUpdateCampaign } from '@/composables/modules/campaigns/useUpdateCampaign'
import { useUploadImage } from '@/composables/modules/upload/useUploadImage'

const route = useRoute()
const router = useRouter()
const bannerInput = ref<HTMLInputElement | null>(null)

const campaignId = computed(() => (route.params.id as string) || (route.query.id as string))
const isEditing = computed(() => !!campaignId.value && campaignId.value !== 'create')

const { createCampaign, loading: creating } = useCreateCampaign()
const { getCampaignDetails, loading: fetching } = useCampaignDetails()
const { updateCampaign, loading: updating } = useUpdateCampaign()
const { execute: uploadImage, loading: uploadingBanner } = useUploadImage()

const loading = computed(() => creating.value || updating.value || fetching.value)

const form = reactive({
  name: '',
  subject: '',
  content: '',
  previewText: '',
  bannerUrl: '',
  audience: {
    type: 'all',
  } as any,
  schedule: {
    type: 'now',
    scheduledAt: '',
    cronExpression: ''
  } as any
})

const specificEmailsInput = ref('')

watch(() => specificEmailsInput.value, (val) => {
    if (val) {
        form.audience.specificEmails = val.split(',').map(e => e.trim()).filter(e => e)
    } else {
        form.audience.specificEmails = []
    }
})

const handleBannerUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    try {
        const result = await uploadImage(file)
        if (result && result.url) {
            form.bannerUrl = result.url
        }
    } catch (error) {
        console.error('Failed to upload banner:', error)
    } finally {
        if (bannerInput.value) bannerInput.value.value = ''
    }
}

onMounted(async () => {
  if (isEditing.value) {
    const data = await getCampaignDetails(campaignId.value)
    if (data) {
        form.name = data.name
        form.subject = data.subject
        form.content = data.content
        form.previewText = data.previewText
        form.bannerUrl = data.bannerUrl
        form.audience = { ...data.audience }
        form.schedule = { ...data.schedule }
        
        if (data.audience.type === 'specific_emails' && data.audience.specificEmails) {
            specificEmailsInput.value = data.audience.specificEmails.join(', ')
        }

        // Format date for datetime-local input
        if (data.schedule.scheduledAt) {
            const date = new Date(data.schedule.scheduledAt)
            // Adjust to local ISO string for input
            const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
            form.schedule.scheduledAt = localIso
        }
    }
  }
})

const handleSubmit = async (e?: Event) => {
  if (e) e.preventDefault()
  console.log('Submitting campaign...', form)
  const payload = { ...form }
  
  // Cleanup schedule payload
  if (payload.schedule.type === 'now') {
      delete payload.schedule.scheduledAt
      delete payload.schedule.cronExpression
  } else if (payload.schedule.type === 'scheduled') {
      delete payload.schedule.cronExpression
      // Ensure ISO string
       if (payload.schedule.scheduledAt) {
          payload.schedule.scheduledAt = new Date(payload.schedule.scheduledAt).toISOString()
      }
  } else if (payload.schedule.type === 'recurring') {
      delete payload.schedule.scheduledAt
  }

  // Cleanup audience
  if (payload.audience.type !== 'specific_emails') {
      delete payload.audience.specificEmails
  }

  try {
    if (isEditing.value) {
      await updateCampaign(campaignId.value, payload)
    } else {
      await createCampaign(payload)
    }
    router.push('/dashboard/campaigns')
  } catch (e) {
    // Error handled in composable
  }
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>
