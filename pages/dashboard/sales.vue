<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Overview -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <p class="text-sm text-gray-500">Track sales performance and revenue trends</p>
          </div>
          <button
            @click="refreshAll"
            :disabled="salesLoading || statsLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-60"
          >
            {{ salesLoading || statsLoading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Sales</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.totalSales || sales.length }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Total Revenue</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(statsSummary.totalRevenue || totalRevenue) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Paid Sales</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.paidSales || paidSalesCount }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Pending Sales</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.pendingSales || pendingSalesCount }}</p>
          </div>
        </div>
      </section>

      <!-- Filters -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Sales Records</h2>
            <p class="text-sm text-gray-500">Filter and manage sales status</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <UiAnimatedInput v-model="filters.search" type="text" label="Search" placeholder="Search sale number" />
          <UiSelectInput
            v-model="filters.status"
            label="Status"
            :options="statusFilterOptions"
            option-label="label"
            option-value="value"
            placeholder="All Status"
          />
          <UiSelectInput
            v-model="filters.paymentStatus"
            label="Payment Status"
            :options="paymentStatusFilterOptions"
            option-label="label"
            option-value="value"
            placeholder="All Payment Status"
          />
          <UiAnimatedInput v-model="filters.startDate" type="date" label="Start Date" />
          <UiAnimatedInput v-model="filters.endDate" type="date" label="End Date" />
        </div>

        <div class="flex justify-end">
          <button
            @click="applyFilters"
            :disabled="salesLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {{ salesLoading ? 'Loading...' : 'Apply Filters' }}
          </button>
        </div>
      </section>

      <!-- Tables -->
      <section class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs uppercase text-gray-500 border-b">
              <th class="px-5 py-3">Sale #</th>
              <th class="px-5 py-3">Client</th>
              <th class="px-5 py-3">Amount</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Payment</th>
              <th class="px-5 py-3">Date</th>
              <th class="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale._id" class="border-b last:border-0">
              <td class="px-5 py-4 font-mono text-xs text-gray-700">{{ sale.saleNumber }}</td>
              <td class="px-5 py-4 text-gray-700">{{ sale.clientId }}</td>
              <td class="px-5 py-4 font-semibold text-gray-900">{{ formatCurrency(sale.totalAmount) }}</td>
              <td class="px-5 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusClass(sale.status)">
                  {{ sale.status }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="paymentStatusClass(sale.paymentStatus)">
                  {{ sale.paymentStatus }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-500">{{ formatDate(sale.createdAt) }}</td>
              <td class="px-5 py-4">
                <div class="flex flex-wrap gap-2">
                  <button @click="openStatusModal(sale)" class="text-xs font-semibold text-primary">Update Status</button>
                  <button @click="openPaymentModal(sale)" class="text-xs font-semibold text-gray-700">Update Payment</button>
                </div>
              </td>
            </tr>
            <tr v-if="!sales.length && !salesLoading">
              <td colspan="7" class="px-5 py-6 text-center text-gray-400">No sales found.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Top Services -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Top Services</h2>
            <p class="text-sm text-gray-500">Best performing items</p>
          </div>
          <button
            @click="fetchTopServices"
            :disabled="topServicesLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            {{ topServicesLoading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
        <div class="space-y-2">
          <div v-for="service in topServices" :key="service.serviceId || service.itemId" class="flex justify-between text-sm text-gray-600">
            <span>{{ service.serviceName || service.itemName }}</span>
            <span class="font-semibold">{{ formatCurrency(service.revenue || service.totalRevenue || 0) }}</span>
          </div>
          <p v-if="!topServices.length" class="text-sm text-gray-400">No top services yet.</p>
        </div>
      </section>
    </div>

    <!-- Status Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">Update Sale Status</h3>
        <UiSelectInput
          v-model="statusForm.status"
          label="Status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
        />
        <div class="flex justify-end gap-3">
          <button @click="closeStatusModal" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100">Cancel</button>
          <button
            @click="handleUpdateStatus"
            :disabled="updateStatusLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary"
          >
            {{ updateStatusLoading ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">Update Payment Status</h3>
        <UiSelectInput
          v-model="paymentForm.paymentStatus"
          label="Payment Status"
          :options="paymentStatusOptions"
          option-label="label"
          option-value="value"
        />
        <UiAnimatedInput v-model="paymentForm.amountPaid" type="number" label="Amount Paid" />
        <div class="flex justify-end gap-3">
          <button @click="closePaymentModal" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100">Cancel</button>
          <button
            @click="handleUpdatePaymentStatus"
            :disabled="updatePaymentLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary"
          >
            {{ updatePaymentLoading ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Sale } from '@/types/finance'
import { useFetchSales } from '@/composables/modules/sales/useFetchSales'
import { useFetchSalesStats } from '@/composables/modules/sales/useFetchSalesStats'
import { useFetchTopServices } from '@/composables/modules/sales/useFetchTopServices'
import { useUpdateSaleStatus } from '@/composables/modules/sales/useUpdateSaleStatus'
import { useUpdateSalePaymentStatus } from '@/composables/modules/sales/useUpdateSalePaymentStatus'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const filters = ref({
  search: '',
  status: '',
  paymentStatus: '',
  startDate: '',
  endDate: ''
})

// Options for filters
const statusFilterOptions = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const paymentStatusFilterOptions = [
  { label: 'All Payment Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Partially Paid', value: 'partially_paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Cancelled', value: 'cancelled' }
]

// Options for modals
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const paymentStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Partially Paid', value: 'partially_paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Cancelled', value: 'cancelled' }
]

const { data: salesData, loading: salesLoading, execute: fetchSales } = useFetchSales()
const { data: statsData, loading: statsLoading, execute: fetchStats } = useFetchSalesStats()
const { data: topServicesData, loading: topServicesLoading, execute: fetchTopServices } = useFetchTopServices()
const { loading: updateStatusLoading, execute: updateStatus } = useUpdateSaleStatus()
const { loading: updatePaymentLoading, execute: updatePaymentStatus } = useUpdateSalePaymentStatus()

const sales = computed(() => salesData.value || [])
const statsSummary = computed(() => statsData.value?.summary || statsData.value || {})
const topServices = computed(() => topServicesData.value || [])

const totalRevenue = computed(() => sales.value.reduce((sum: number, sale: Sale) => sum + (sale.totalAmount || 0), 0))
const paidSalesCount = computed(() => sales.value.filter((sale: Sale) => sale.paymentStatus === 'paid').length)
const pendingSalesCount = computed(() => sales.value.filter((sale: Sale) => sale.paymentStatus === 'pending').length)

const showStatusModal = ref(false)
const showPaymentModal = ref(false)
const selectedSale = ref<Sale | null>(null)

const statusForm = ref({ status: 'draft' })
const paymentForm = ref({ paymentStatus: 'pending', amountPaid: 0 })

const applyFilters = async () => {
  await fetchSales({
    search: filters.value.search || undefined,
    status: filters.value.status || undefined,
    paymentStatus: filters.value.paymentStatus || undefined,
    startDate: filters.value.startDate || undefined,
    endDate: filters.value.endDate || undefined
  })
}

const refreshAll = async () => {
  await Promise.all([applyFilters(), fetchStats()])
}

const openStatusModal = (sale: Sale) => {
  selectedSale.value = sale
  statusForm.value = { status: sale.status }
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
}

const handleUpdateStatus = async () => {
  if (!selectedSale.value) return
  await updateStatus(selectedSale.value._id, statusForm.value.status)
  showStatusModal.value = false
  await applyFilters()
}

const openPaymentModal = (sale: Sale) => {
  selectedSale.value = sale
  paymentForm.value = { paymentStatus: sale.paymentStatus, amountPaid: sale.amountPaid }
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
}

const handleUpdatePaymentStatus = async () => {
  if (!selectedSale.value) return
  await updatePaymentStatus(selectedSale.value._id, {
    paymentStatus: paymentForm.value.paymentStatus,
    amountPaid: paymentForm.value.amountPaid
  })
  showPaymentModal.value = false
  await applyFilters()
}

const statusClass = (status: string) => {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'confirmed') return 'bg-blue-100 text-blue-700'
  if (status === 'draft') return 'bg-gray-100 text-gray-700'
  return 'bg-rose-100 text-rose-700'
}

const paymentStatusClass = (status: string) => {
  if (status === 'paid') return 'bg-emerald-100 text-emerald-700'
  if (status === 'partially_paid') return 'bg-amber-100 text-amber-700'
  if (status === 'pending') return 'bg-gray-100 text-gray-700'
  return 'bg-rose-100 text-rose-700'
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)
const formatDate = (value: string) => value ? new Date(value).toLocaleDateString() : ''

onMounted(async () => {
  await refreshAll()
  await fetchTopServices()
})
</script>
