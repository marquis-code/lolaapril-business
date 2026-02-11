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
          <UiAnimatedInput v-model="form.bannerUrl" label="Banner URL" type="url" />
        </div>
      </section>

      <!-- Content -->
       <section class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
        <h2 class="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Content</h2>
        <UiAnimatedInput v-model="form.content" label="Email Body (HTML)" placeholder="<h1>Hello</h1><p>Start writing...</p>" type="textarea" :rows="10" required />
        <p class="text-xs text-gray-500 mt-1">HTML tags are supported.</p>
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

const route = useRoute()
const router = useRouter()
const campaignId = computed(() => (route.params.id as string) || (route.query.id as string))
const isEditing = computed(() => !!campaignId.value && campaignId.value !== 'create')

const { createCampaign, loading: creating } = useCreateCampaign()
const { getCampaignDetails, loading: fetching } = useCampaignDetails()
const { updateCampaign, loading: updating } = useUpdateCampaign()

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

const handleSubmit = async () => {
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
