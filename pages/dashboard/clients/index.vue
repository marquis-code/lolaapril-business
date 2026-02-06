<template>
  <div class="p-8">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
        <p class="text-gray-500 mt-1">Manage your customer database and relationships.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Search clients..."
          class="px-4 py-2 rounded-lg border border-gray-200 text-sm"
        />
        <button
          @click="handleExportCsv"
          :disabled="exportCsvLoading"
          class="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-60"
        >
          {{ exportCsvLoading ? 'Exporting...' : 'Export CSV' }}
        </button>
        <button
          @click="handleExportPdf"
          :disabled="exportPdfLoading"
          class="px-4 py-2 rounded-lg text-sm font-medium text-gray-900 border border-gray-200 hover:bg-gray-50 disabled:opacity-60"
        >
          {{ exportPdfLoading ? 'Exporting...' : 'Export PDF' }}
        </button>
        <label class="px-4 py-2 rounded-lg text-sm font-medium text-gray-900 border border-gray-200 hover:bg-gray-50 cursor-pointer">
          Import CSV
          <input @change="handleImportCsv" type="file" accept=".csv" class="hidden" />
        </label>
        <button
          @click="handleEnableGrok"
          :disabled="grokLoading"
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
        >
          {{ grokLoading ? 'Enabling...' : 'Enable Grok' }}
        </button>
        <NuxtLink
          to="/dashboard/clients/create"
          class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span>+ Add Client</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Overview -->
    <div v-if="stats" class="grid grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div class="text-sm text-gray-500">Total Clients</div>
        <div class="text-2xl font-bold text-gray-900">{{ stats.totalClients || 0 }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div class="text-sm text-gray-500">New (This Month)</div>
        <div class="text-2xl font-bold text-green-600">{{ stats.newClients || 0 }}</div>
      </div>
       <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div class="text-sm text-gray-500">Active Clients</div>
        <div class="text-2xl font-bold text-blue-600">{{ stats.activeClients || 0 }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>

    <!-- Clients List -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-900">Contact</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-900">LTV</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-900">Joined</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="client in clients" :key="client._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                    {{ client.profile.firstName[0] }}{{ client.profile.lastName[0] }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ client.profile.firstName }} {{ client.profile.lastName }}</div>
                    <div class="text-xs text-gray-500 capitalize">{{ client.additionalInfo?.occupation || 'Client' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                 <div class="text-sm text-gray-900">{{ client.profile.email }}</div>
                 <div class="text-xs text-gray-500">{{ client.profile.phone.number }}</div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize"
                  :class="{
                    'bg-green-100 text-green-700': client.status === 'active',
                    'bg-gray-100 text-gray-600': client.status === 'inactive',
                    'bg-blue-100 text-blue-700': client.status === 'lead'
                  }"
                >
                  {{ client.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 font-medium">{{ formatCurrency(client.ltv || 0) }}</div>
                <div class="text-xs text-gray-500">{{ client.totalBookings || 0 }} bookings</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ new Date(client.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right space-x-3">
                <button @click.stop="handleDeactivate(client._id)" class="text-red-600 hover:text-red-700 font-medium text-sm">Deactivate</button>
                <button class="text-gray-400 hover:text-black font-medium text-sm">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="clients.length === 0" class="p-12 text-center text-gray-500">
        No clients found. Add your first client to get started.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFetchClients } from "@/composables/modules/client/useFetchClients"
import { useFetchClientStats } from "@/composables/modules/client/useFetchClientStats"
import { useExportClientsCsv } from "@/composables/modules/client/useExportClientsCsv"
import { useExportClientsPdf } from "@/composables/modules/client/useExportClientsPdf"
import { useImportClientsCsv } from "@/composables/modules/client/useImportClientsCsv"
import { useEnableGrokCodeFast1 } from "@/composables/modules/client/useEnableGrokCodeFast1"
import { useDeleteClient } from "@/composables/modules/client/useDeleteClient"
definePageMeta({
  layout: 'dashboard'
})

const { data: clients, loading: clientsLoading, execute: fetchClients } = useFetchClients()
const { data: stats, execute: fetchStats } = useFetchClientStats()
const loading = clientsLoading
const search = ref('')

const { loading: exportCsvLoading, execute: exportCsv } = useExportClientsCsv()
const { loading: exportPdfLoading, execute: exportPdf } = useExportClientsPdf()
const { loading: importLoading, execute: importCsv } = useImportClientsCsv()
const { loading: grokLoading, execute: enableGrok } = useEnableGrokCodeFast1()
const { loading: deleteLoading, execute: deleteClient } = useDeleteClient()

const reload = async () => {
  await fetchClients({ search: search.value || undefined })
  await fetchStats()
}

onMounted(() => {
  reload()
})

watch(search, () => {
  reload()
})

const handleExportCsv = async () => {
  await exportCsv()
}

const handleExportPdf = async () => {
  await exportPdf()
}

const handleImportCsv = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  await importCsv(file)
  target.value = ''
  await reload()
}

const handleEnableGrok = async () => {
  await enableGrok()
}

const handleDeactivate = async (id: string) => {
  await deleteClient(id)
  await reload()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
}
</script>
