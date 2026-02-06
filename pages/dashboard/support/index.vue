<template>
  <div class="p-8">
    <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Support Center</h1>
        <p class="text-gray-500 mt-1">Get help and manage support tickets.</p>
      </div>
      <button
        @click="showCreateTicket = true"
        class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800"
      >
        + Create Ticket
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Total</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.totalTickets || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Open</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.openTickets || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">In Progress</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.inProgressTickets || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Resolved</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.resolvedTickets || 0 }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UiSelectInput
          v-model="filters.status"
          label="Status"
          :options="statusFilterOptions"
          option-label="label"
          option-value="value"
          placeholder="All"
        />
        <UiSelectInput
          v-model="filters.priority"
          label="Priority"
          :options="priorityFilterOptions"
          option-label="label"
          option-value="value"
          placeholder="All"
        />
        <UiSelectInput
          v-model="filters.channel"
          label="Channel"
          :options="channelFilterOptions"
          option-label="label"
          option-value="value"
          placeholder="All"
        />
        <UiAnimatedInput
          v-model="filters.category"
          type="text"
          label="Category"
          placeholder="Category"
        />
      </div>
      <div class="pt-4 flex justify-end">
        <button @click="applyFilters" class="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm">Apply Filters</button>
      </div>
    </div>

    <!-- Tickets List -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="hidden md:grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
        <div>Subject</div>
        <div>Category</div>
        <div>Priority</div>
        <div>Status</div>
        <div>Channel</div>
        <div>Created</div>
      </div>
      <div class="divide-y divide-gray-50">
        <div
          v-for="ticket in tickets"
          :key="ticket._id"
          class="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
          @click="openTicket(ticket._id)"
        >
          <div class="font-medium text-gray-900">{{ ticket.subject }}</div>
          <div class="text-sm text-gray-600 capitalize">{{ ticket.category }}</div>
          <div>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              :class="{
                'bg-red-100 text-red-700': ticket.priority === 'urgent',
                'bg-orange-100 text-orange-700': ticket.priority === 'high',
                'bg-yellow-100 text-yellow-700': ticket.priority === 'medium',
                'bg-gray-100 text-gray-700': ticket.priority === 'low'
              }"
            >
              {{ ticket.priority }}
            </span>
          </div>
          <div>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              :class="{
                'bg-green-100 text-green-700': ticket.status === 'resolved',
                'bg-blue-100 text-blue-700': ticket.status === 'in_progress',
                'bg-gray-100 text-gray-700': ticket.status === 'open'
              }"
            >
              {{ (ticket.status || 'open').replace('_', ' ') }}
            </span>
          </div>
          <div class="text-sm text-gray-600 capitalize">{{ ticket.channel || '—' }}</div>
          <div class="text-sm text-gray-500">{{ ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—' }}</div>
        </div>
      </div>
      <div v-if="tickets.length === 0" class="p-12 text-center text-gray-500">
        No support tickets yet.
      </div>
    </div>

    <!-- Create Ticket Modal -->
    <div v-if="showCreateTicket" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Create Support Ticket</h2>
          <button @click="showCreateTicket = false" class="text-gray-500 hover:text-gray-900">✕</button>
        </div>
        <form @submit.prevent="handleCreateTicket" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiAnimatedInput
              v-model="ticketForm.clientId"
              type="text"
              label="Client ID"
              placeholder="Client ID"
              required
            />
            <UiAnimatedInput
              v-model="ticketForm.bookingId"
              type="text"
              label="Booking ID (optional)"
              placeholder="Booking ID"
            />
          </div>
          <UiAnimatedInput
            v-model="ticketForm.subject"
            type="text"
            label="Subject"
            placeholder="Subject"
            required
          />
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea v-model="ticketForm.description" rows="4" required class="w-full px-4 py-2 rounded-lg border border-gray-200"></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UiSelectInput
              v-model="ticketForm.channel"
              label="Channel"
              :options="channelOptions"
              option-label="label"
              option-value="value"
              placeholder="Select channel"
            />
            <UiAnimatedInput
              v-model="ticketForm.category"
              type="text"
              label="Category"
              placeholder="Category"
            />
            <UiSelectInput
              v-model="ticketForm.priority"
              label="Priority"
              :options="priorityOptions"
              option-label="label"
              option-value="value"
              placeholder="Select priority"
            />
          </div>
          <UiAnimatedInput
            v-model="ticketTags"
            type="text"
            label="Tags (comma separated)"
            placeholder="Tags"
          />
          <div class="flex gap-4 pt-4">
            <button type="button" @click="showCreateTicket = false" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" class="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Create Ticket</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="showTicketModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold">Ticket Details</h2>
            <p class="text-xs text-gray-500">{{ selectedTicket?.subject }}</p>
          </div>
          <button @click="closeTicket" class="text-gray-500 hover:text-gray-900">✕</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="rounded-lg border border-gray-200 p-3">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Client</div>
            <div class="text-sm text-gray-900">{{ selectedTicket?.clientId }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Status</div>
            <div class="text-sm text-gray-900">{{ selectedTicket?.status || 'open' }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Priority</div>
            <div class="text-sm text-gray-900">{{ selectedTicket?.priority }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Channel</div>
            <div class="text-sm text-gray-900">{{ selectedTicket?.channel }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <UiSelectInput
            v-model="ticketStatusUpdate"
            label="Update Status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Select status"
          />
          <UiAnimatedInput
            v-model="assignAgentId"
            type="text"
            label="Assign Agent ID"
            placeholder="Agent ID"
          />
          <div class="flex items-end gap-2">
            <button @click="handleUpdateStatus" class="bg-black text-white px-4 py-2 rounded-lg text-sm">Update</button>
            <button @click="handleAssign" class="border border-gray-200 px-4 py-2 rounded-lg text-sm">Assign</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <UiAnimatedInput
              v-model="callPhone"
              type="text"
              label="Call Phone Number"
              placeholder="Phone number"
            />
            <button @click="handleCall" class="mt-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Call</button>
          </div>
          <div>
            <UiAnimatedInput
              v-model="smsPhone"
              type="text"
              label="SMS Phone Number"
              placeholder="Phone number"
            />
            <textarea v-model="smsMessage" rows="2" class="mt-2 w-full px-4 py-2 rounded-lg border border-gray-200" placeholder="Message"></textarea>
            <button @click="handleSms" class="mt-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Send SMS</button>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Messages</h3>
            <label class="text-xs text-gray-500 flex items-center gap-2">
              <input v-model="includeInternal" type="checkbox" class="custom-checkbox" /> Include internal
            </label>
          </div>
          <div class="space-y-3 max-h-60 overflow-y-auto">
            <div v-for="msg in messages" :key="msg._id" class="bg-white border border-gray-200 rounded-lg p-3">
              <div class="text-xs text-gray-400">{{ msg.senderType || 'agent' }} • {{ msg.createdAt || '' }}</div>
              <div class="text-sm text-gray-700 mt-1">{{ msg.message }}</div>
            </div>
            <div v-if="messages.length === 0" class="text-sm text-gray-500">No messages yet.</div>
          </div>
          <div class="mt-4">
            <label class="block text-xs font-medium text-gray-500 mb-1">Add Message</label>
            <textarea v-model="messageDraft" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-200"></textarea>
            <div class="flex items-center justify-between mt-2">
              <label class="text-xs text-gray-500 flex items-center gap-2">
                <input v-model="messageInternal" type="checkbox" class="custom-checkbox" /> Internal
              </label>
              <button @click="handleAddMessage" class="bg-black text-white px-4 py-2 rounded-lg text-sm">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { CreateTicketDto, SupportMessage, SupportTicket } from '~/types/support'
import { useFetchTickets } from '@/composables/modules/support/useFetchTickets'
import { useCreateTicket } from '@/composables/modules/support/useCreateTicket'
import { useUpdateTicketStatus } from '@/composables/modules/support/useUpdateTicketStatus'
import { useFetchTicketById } from '@/composables/modules/support/useFetchTicketById'
import { useFetchTicketMessages } from '@/composables/modules/support/useFetchTicketMessages'
import { useAddComment } from '@/composables/modules/support/useAddComment'
import { useAssignTicket } from '@/composables/modules/support/useAssignTicket'
import { useSupportStats } from '@/composables/modules/support/useSupportStats'
import { useMakeSupportCall } from '@/composables/modules/support/useMakeSupportCall'
import { useSendSupportSms } from '@/composables/modules/support/useSendSupportSms'
import { useAuth } from '@/composables/modules/useAuth'
definePageMeta({
  layout: 'dashboard'
})

const { user } = useAuth()

const { data: tickets, execute: fetchTickets } = useFetchTickets()
const { execute: createTicket } = useCreateTicket()
const { execute: updateTicketStatus } = useUpdateTicketStatus()
const { data: selectedTicket, execute: fetchTicketById } = useFetchTicketById()
const { data: messages, execute: fetchMessages } = useFetchTicketMessages()
const { execute: addMessage } = useAddComment()
const { execute: assignTicket } = useAssignTicket()
const { data: stats, execute: fetchStats } = useSupportStats()
const { execute: makeCall } = useMakeSupportCall()
const { execute: sendSms } = useSendSupportSms()

const showCreateTicket = ref(false)
const showTicketModal = ref(false)

const filters = reactive({
  status: '',
  priority: '',
  channel: '',
  category: ''
})

const ticketForm = reactive<CreateTicketDto>({
  clientId: '',
  bookingId: '',
  subject: '',
  description: '',
  priority: 'medium',
  channel: 'email',
  category: 'general',
  tags: []
})

const ticketTags = ref('')
const ticketStatusUpdate = ref('open')
const assignAgentId = ref('')
const includeInternal = ref(false)
const messageDraft = ref('')
const messageInternal = ref(false)
const callPhone = ref('')
const smsPhone = ref('')
const smsMessage = ref('')

// Options for filter selects (include 'All' option with empty value)
const statusFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
]

const priorityFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' }
]

const channelFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Phone', value: 'phone' },
  { label: 'In App', value: 'in_app' }
]

// Options for form selects (no 'All' option)
const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
]

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' }
]

const channelOptions = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Phone', value: 'phone' },
  { label: 'In App', value: 'in_app' }
]

onMounted(async () => {
  await Promise.all([
    fetchTickets(),
    fetchStats()
  ])
})

watch(includeInternal, async () => {
  if (selectedTicket.value?._id) {
    await fetchMessages(selectedTicket.value._id, includeInternal.value)
  }
})

const applyFilters = async () => {
  await fetchTickets({ ...filters })
}

const openTicket = async (ticketId: string) => {
  await fetchTicketById(ticketId)
  if (selectedTicket.value) {
    ticketStatusUpdate.value = selectedTicket.value.status || 'open'
    await fetchMessages(selectedTicket.value._id, includeInternal.value)
    showTicketModal.value = true
  }
}

const closeTicket = () => {
  showTicketModal.value = false
  messageDraft.value = ''
  assignAgentId.value = ''
  callPhone.value = ''
  smsPhone.value = ''
  smsMessage.value = ''
}

const handleCreateTicket = async () => {
  try {
    ticketForm.tags = ticketTags.value
      ? ticketTags.value.split(',').map((item: string) => item.trim()).filter(Boolean)
      : []
    await createTicket(ticketForm)
    showCreateTicket.value = false
    Object.assign(ticketForm, {
      clientId: '',
      bookingId: '',
      subject: '',
      description: '',
      priority: 'medium',
      channel: 'email',
      category: 'general',
      tags: []
    })
    ticketTags.value = ''
    await fetchTickets({ ...filters })
    await fetchStats()
  } catch (e: any) {
    alert(e.message || 'Failed to create ticket')
  }
}

const handleUpdateStatus = async () => {
  if (!selectedTicket.value?._id || !user.value?._id) return
  await updateTicketStatus(selectedTicket.value._id, ticketStatusUpdate.value, user.value._id)
  await openTicket(selectedTicket.value._id)
  await fetchTickets({ ...filters })
}

const handleAssign = async () => {
  if (!selectedTicket.value?._id || !assignAgentId.value) return
  await assignTicket(selectedTicket.value._id, assignAgentId.value)
  await openTicket(selectedTicket.value._id)
}

const handleAddMessage = async () => {
  if (!selectedTicket.value?._id || !messageDraft.value) return
  const payload: SupportMessage = {
    message: messageDraft.value,
    isInternal: messageInternal.value
  }
  await addMessage(selectedTicket.value._id, payload)
  messageDraft.value = ''
  await fetchMessages(selectedTicket.value._id, includeInternal.value)
}

const handleCall = async () => {
  if (!selectedTicket.value?._id || !callPhone.value || !user.value?._id) return
  await makeCall(selectedTicket.value._id, callPhone.value, user.value._id)
}

const handleSms = async () => {
  if (!selectedTicket.value?._id || !smsPhone.value || !smsMessage.value) return
  await sendSms(selectedTicket.value._id, smsPhone.value, smsMessage.value)
}
</script>
