<template>
  <div class="p-8">
    <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Voucher Management</h1>
        <p class="text-gray-500 mt-1">Create, track, and redeem vouchers for your business.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="openValidationModal" class="border border-gray-200 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50">
          Validate Voucher
        </button>
        <button @click="openCreateModal" class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800">
          + Create Voucher
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Total</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.total ?? derivedStats.total }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Active</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.active ?? derivedStats.active }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Inactive</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.inactive ?? derivedStats.inactive }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Expired</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.expired ?? derivedStats.expired }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Used Up</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.used_up ?? derivedStats.used_up }}</div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <UiAnimatedInput v-model="filters.search" type="text" label="Search" placeholder="Code or name" />
        <UiSelectInput
          v-model="filters.status"
          label="Status"
          :options="statusFilterOptions"
          option-label="label"
          option-value="value"
          placeholder="All"
        />
        <UiSelectInput
          v-model="filters.discountType"
          label="Discount Type"
          :options="discountTypeOptions"
          option-label="label"
          option-value="value"
          placeholder="All"
        />
        <UiAnimatedInput v-model="filters.validFrom" type="date" label="Valid From" />
        <UiAnimatedInput v-model="filters.validUntil" type="date" label="Valid Until" />
        <div class="flex items-end">
          <button @click="applyFilters" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm w-full">Apply</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>

    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="hidden md:grid grid-cols-7 gap-4 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
        <div>Code</div>
        <div>Name</div>
        <div>Discount</div>
        <div>Validity</div>
        <div>Usage</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="voucher in vouchers" :key="voucher._id" class="grid grid-cols-1 md:grid-cols-7 gap-4 px-6 py-4">
          <div>
            <div class="text-sm font-medium text-gray-900">{{ voucher.voucherCode }}</div>
            <div class="text-xs text-gray-500">{{ voucher.discountType.replace(/_/g, ' ') }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900">{{ voucher.voucherName }}</div>
            <div class="text-xs text-gray-500 line-clamp-2">{{ voucher.description }}</div>
          </div>
          <div class="text-sm text-gray-600">{{ formatDiscount(voucher) }}</div>
          <div class="text-sm text-gray-600">
            {{ formatDate(voucher.validFrom) }} - {{ formatDate(voucher.validUntil) }}
          </div>
          <div class="text-sm text-gray-600">
            {{ voucher.usageCount || 0 }} / {{ voucher.usageLimit ?? '∞' }}
          </div>
          <div>
            <span class="px-2 py-1 rounded-full text-xs font-medium capitalize" :class="statusClass(voucher.status)">
              {{ voucher.status || 'active' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openEditModal(voucher)" class="text-xs font-medium text-gray-600 hover:text-black">Edit</button>
            <button @click="openStatusModal(voucher)" class="text-xs font-medium text-gray-600 hover:text-black">Status</button>
            <button @click="handleUseVoucher(voucher)" class="text-xs font-medium text-gray-600 hover:text-black">Use</button>
            <button @click="handleDelete(voucher._id)" class="text-xs font-medium text-red-600">Delete</button>
          </div>
        </div>
      </div>
      <div v-if="vouchers.length === 0" class="p-12 text-center text-gray-500">No vouchers found.</div>
    </div>

    <div v-if="showFormModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">{{ editingVoucher ? 'Edit Voucher' : 'Create Voucher' }}</h2>
          <button @click="closeFormModal" class="text-gray-500 hover:text-gray-900">✕</button>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiAnimatedInput v-model="form.voucherCode" type="text" label="Voucher Code" required />
            <UiAnimatedInput v-model="form.voucherName" type="text" label="Voucher Name" required />
          </div>

          <UiAnimatedInput v-model="form.description" type="text" label="Description" />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UiSelectInput
              v-model="form.discountType"
              label="Discount Type"
              :options="discountTypeFormOptions"
              option-label="label"
              option-value="value"
            />
            <UiAnimatedInput v-model="form.discountValue" type="number" label="Discount Value" />
            <UiSelectInput
              v-model="form.status"
              label="Status"
              :options="statusFormOptions"
              option-label="label"
              option-value="value"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiAnimatedInput v-model="form.validFrom" type="date" label="Valid From" required />
            <UiAnimatedInput v-model="form.validUntil" type="date" label="Valid Until" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiAnimatedInput v-model="form.usageLimit" type="number" label="Usage Limit" />
            <UiAnimatedInput v-model="form.usagePerClient" type="number" label="Usage Per Client" />
          </div>

          <div class="border border-gray-200 rounded-xl p-5 space-y-4">
            <div class="text-sm font-semibold text-gray-700">Restrictions</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiAnimatedInput v-model="applicableServicesInput" type="text" label="Applicable Service IDs (comma separated)" />
              <UiAnimatedInput v-model="applicableCategoriesInput" type="text" label="Applicable Category IDs (comma separated)" />
              <UiAnimatedInput v-model="excludedServicesInput" type="text" label="Excluded Service IDs (comma separated)" />
              <UiAnimatedInput v-model="applicableDaysInput" type="text" label="Applicable Days (comma separated)" />
              <UiAnimatedInput v-model="restrictionsForm.minimumSpend" type="number" label="Minimum Spend" />
              <UiAnimatedInput v-model="restrictionsForm.maximumDiscount" type="number" label="Maximum Discount" />
              <UiSelectInput
                v-model="restrictionsForm.firstTimeClientsOnly"
                label="First Time Clients Only"
                :options="firstTimeClientsOptions"
                option-label="label"
                option-value="value"
              />
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button type="button" @click="closeFormModal" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" class="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              {{ editingVoucher ? 'Update Voucher' : 'Create Voucher' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showStatusModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Update Status</h3>
          <button @click="closeStatusModal" class="text-gray-500 hover:text-gray-900">✕</button>
        </div>
        <div class="space-y-4">
          <UiSelectInput
            v-model="statusUpdate"
            label="Status"
            :options="statusFormOptions"
            option-label="label"
            option-value="value"
          />
        </div>
        <div class="flex gap-3 pt-6">
          <button @click="closeStatusModal" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg">Cancel</button>
          <button @click="handleUpdateStatus" class="flex-1 bg-black text-white px-4 py-2 rounded-lg">Update</button>
        </div>
      </div>
    </div>

    <div v-if="showValidationModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Validate Voucher</h3>
          <button @click="closeValidationModal" class="text-gray-500 hover:text-gray-900">✕</button>
        </div>
        <form @submit.prevent="handleValidateVoucher" class="space-y-4">
          <UiAnimatedInput v-model="validationForm.voucherCode" type="text" label="Voucher Code" required />
          <UiAnimatedInput v-model="validationForm.clientId" type="text" label="Client ID" required />
          <UiAnimatedInput v-model="serviceIdsInput" type="text" label="Service IDs (comma separated)" />
          <UiAnimatedInput v-model="validationForm.totalAmount" type="number" label="Total Amount" />

          <div v-if="validationResult" class="rounded-lg border border-gray-200 p-4 text-sm space-y-3">
            <div class="font-semibold text-gray-800">Result</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Valid</div>
                <div class="font-semibold" :class="validationSummary.isValid ? 'text-green-600' : 'text-rose-600'">
                  {{ validationSummary.isValid ? 'Yes' : 'No' }}
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Discount Amount</div>
                <div class="font-semibold text-gray-800">{{ formatCurrency(validationSummary.discountAmount) }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Final Amount</div>
                <div class="font-semibold text-gray-800">{{ formatCurrency(validationSummary.finalAmount) }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Message</div>
                <div class="font-semibold text-gray-800">{{ validationSummary.message || '—' }}</div>
              </div>
            </div>
            <div v-if="validationSummary.raw" class="text-xs text-gray-500">
              <details>
                <summary class="cursor-pointer">View raw response</summary>
                <pre class="text-xs text-gray-600 whitespace-pre-wrap mt-2">{{ validationSummary.raw }}</pre>
              </details>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeValidationModal" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg">Close</button>
            <button type="submit" class="flex-1 bg-black text-white px-4 py-2 rounded-lg">Validate</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { CreateVoucherDto, Voucher, VoucherQueryDto, VoucherRestrictions, VoucherStats } from '~/types/voucher'
import { useFetchVouchers } from '@/composables/modules/voucher/useFetchVouchers'
import { useCreateVoucher } from '@/composables/modules/voucher/useCreateVoucher'
import { useUpdateVoucher } from '@/composables/modules/voucher/useUpdateVoucher'
import { useDeleteVoucher } from '@/composables/modules/voucher/useDeleteVoucher'
import { useFetchVoucherStats } from '@/composables/modules/voucher/useFetchVoucherStats'
import { useUseVoucher } from '@/composables/modules/voucher/useUseVoucher'
import { useValidateVoucher } from '@/composables/modules/voucher/useValidateVoucher'

definePageMeta({
  layout: 'dashboard'
})

const { data: vouchers, loading, execute: fetchVouchers } = useFetchVouchers()
const { execute: createVoucher } = useCreateVoucher()
const { execute: updateVoucher } = useUpdateVoucher()
const { execute: deleteVoucher } = useDeleteVoucher()
const { data: stats, execute: fetchStats } = useFetchVoucherStats()
const { execute: useVoucherCode } = useUseVoucher()
const { execute: validateVoucher } = useValidateVoucher()

const filters = reactive<VoucherQueryDto>({
  page: 1,
  limit: 10,
  status: undefined,
  discountType: undefined,
  validFrom: '',
  validUntil: '',
  search: ''
})

const showFormModal = ref(false)
const showStatusModal = ref(false)
const showValidationModal = ref(false)
const editingVoucher = ref<Voucher | null>(null)
const statusUpdate = ref('active')
const statusTarget = ref<Voucher | null>(null)
const validationResult = ref<string | null>(null)

// Options for filters
const statusFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Expired', value: 'expired' },
  { label: 'Used Up', value: 'used_up' }
]

const discountTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed Amount', value: 'fixed_amount' },
  { label: 'Service Discount', value: 'service_discount' },
  { label: 'Buy One Get One', value: 'buy_one_get_one' }
]

// Options for form
const statusFormOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Expired', value: 'expired' },
  { label: 'Used Up', value: 'used_up' }
]

const discountTypeFormOptions = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed Amount', value: 'fixed_amount' },
  { label: 'Service Discount', value: 'service_discount' },
  { label: 'Buy One Get One', value: 'buy_one_get_one' }
]

const firstTimeClientsOptions = [
  { label: 'No', value: false },
  { label: 'Yes', value: true }
]

const restrictionsForm = reactive<VoucherRestrictions>({
  applicableServices: [],
  applicableCategories: [],
  excludedServices: [],
  minimumSpend: undefined,
  maximumDiscount: undefined,
  firstTimeClientsOnly: false,
  applicableDays: []
})

const form = reactive<CreateVoucherDto>({
  voucherCode: '',
  voucherName: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  validFrom: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  usageLimit: undefined,
  usagePerClient: undefined,
  status: 'active',
  restrictions: restrictionsForm
})

const applicableServicesInput = ref('')
const applicableCategoriesInput = ref('')
const excludedServicesInput = ref('')
const applicableDaysInput = ref('')
const serviceIdsInput = ref('')

const validationForm = reactive({
  voucherCode: '',
  clientId: '',
  totalAmount: 0
})

const derivedStats = computed<VoucherStats>(() => {
  const list: Voucher[] = vouchers.value || []
  return {
    total: list.length,
    active: list.filter((v: Voucher) => (v.status || 'active') === 'active').length,
    inactive: list.filter((v: Voucher) => v.status === 'inactive').length,
    expired: list.filter((v: Voucher) => v.status === 'expired').length,
    used_up: list.filter((v: Voucher) => v.status === 'used_up').length
  }
})

const buildQuery = (): VoucherQueryDto => ({
  page: filters.page,
  limit: filters.limit,
  ...(filters.status ? { status: filters.status } : {}),
  ...(filters.discountType ? { discountType: filters.discountType } : {}),
  ...(filters.validFrom ? { validFrom: filters.validFrom } : {}),
  ...(filters.validUntil ? { validUntil: filters.validUntil } : {}),
  ...(filters.search ? { search: filters.search } : {})
})

onMounted(async () => {
  await Promise.all([
    fetchVouchers(buildQuery()),
    fetchStats()
  ])
})

const applyFilters = async () => {
  await fetchVouchers(buildQuery())
}

const openCreateModal = () => {
  editingVoucher.value = null
  resetForm()
  showFormModal.value = true
}

const openEditModal = (voucher: Voucher) => {
  editingVoucher.value = voucher
  Object.assign(form, {
    voucherCode: voucher.voucherCode,
    voucherName: voucher.voucherName,
    description: voucher.description,
    discountType: voucher.discountType,
    discountValue: voucher.discountValue,
    validFrom: voucher.validFrom?.split('T')[0] || voucher.validFrom,
    validUntil: voucher.validUntil?.split('T')[0] || voucher.validUntil,
    usageLimit: voucher.usageLimit,
    usagePerClient: voucher.usagePerClient,
    status: voucher.status || 'active'
  })

  Object.assign(restrictionsForm, {
    applicableServices: voucher.restrictions?.applicableServices || [],
    applicableCategories: voucher.restrictions?.applicableCategories || [],
    excludedServices: voucher.restrictions?.excludedServices || [],
    minimumSpend: voucher.restrictions?.minimumSpend,
    maximumDiscount: voucher.restrictions?.maximumDiscount,
    firstTimeClientsOnly: voucher.restrictions?.firstTimeClientsOnly || false,
    applicableDays: voucher.restrictions?.applicableDays || []
  })

  applicableServicesInput.value = restrictionsForm.applicableServices?.join(', ') || ''
  applicableCategoriesInput.value = restrictionsForm.applicableCategories?.join(', ') || ''
  excludedServicesInput.value = restrictionsForm.excludedServices?.join(', ') || ''
  applicableDaysInput.value = restrictionsForm.applicableDays?.join(', ') || ''

  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
}

const openStatusModal = (voucher: Voucher) => {
  statusTarget.value = voucher
  statusUpdate.value = voucher.status || 'active'
  showStatusModal.value = true
}

const openValidationModal = () => {
  validationResult.value = null
  Object.assign(validationForm, { voucherCode: '', clientId: '', totalAmount: 0 })
  serviceIdsInput.value = ''
  showValidationModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
}

const closeValidationModal = () => {
  showValidationModal.value = false
}

const handleSubmit = async () => {
  try {
    updateRestrictionArrays()
    if (editingVoucher.value) {
      await updateVoucher(editingVoucher.value._id, { ...form })
    } else {
      await createVoucher({ ...form })
    }
    await fetchVouchers(buildQuery())
    await fetchStats()
    closeFormModal()
  } catch (e: any) {
    alert(e.message || 'Failed to save voucher')
  }
}

const handleUpdateStatus = async () => {
  if (!statusTarget.value) return
  try {
    await updateVoucher(statusTarget.value._id, { status: statusUpdate.value as CreateVoucherDto['status'] })
    await fetchVouchers(buildQuery())
    await fetchStats()
    closeStatusModal()
  } catch (e: any) {
    alert(e.message || 'Failed to update status')
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this voucher?')) return
  try {
    await deleteVoucher(id)
    await fetchVouchers(buildQuery())
    await fetchStats()
  } catch (e: any) {
    alert(e.message || 'Failed to delete voucher')
  }
}

const handleUseVoucher = async (voucher: Voucher) => {
  if (!confirm(`Mark voucher ${voucher.voucherCode} as used?`)) return
  try {
    await useVoucherCode(voucher.voucherCode)
    await fetchVouchers(buildQuery())
    await fetchStats()
  } catch (e: any) {
    alert(e.message || 'Failed to use voucher')
  }
}

const handleValidateVoucher = async () => {
  try {
    const serviceIds = splitInput(serviceIdsInput.value)
    const result = await validateVoucher(
      validationForm.voucherCode,
      validationForm.clientId,
      serviceIds,
      validationForm.totalAmount
    )
    validationResult.value = JSON.stringify(result, null, 2)
  } catch (e: any) {
    alert(e.message || 'Failed to validate voucher')
  }
}

const validationSummary = computed(() => {
  if (!validationResult.value) {
    return { isValid: false, discountAmount: 0, finalAmount: 0, message: '', raw: '' }
  }

  try {
    const parsed = JSON.parse(validationResult.value)
    const normalized = parsed?.data || parsed
    const isValid = Boolean(
      normalized?.isValid ?? normalized?.valid ?? normalized?.success ?? normalized?.status === 'valid'
    )
    const discountAmount = Number(
      normalized?.discountAmount ?? normalized?.discount ?? normalized?.discountValue ?? 0
    )
    const finalAmount = Number(
      normalized?.finalAmount ?? normalized?.amountToPay ?? normalized?.payableAmount ?? 0
    )
    const message = normalized?.message || normalized?.reason || normalized?.error || ''

    return {
      isValid,
      discountAmount,
      finalAmount,
      message,
      raw: JSON.stringify(normalized, null, 2)
    }
  } catch {
    return { isValid: false, discountAmount: 0, finalAmount: 0, message: '', raw: validationResult.value }
  }
})

const resetForm = () => {
  Object.assign(form, {
    voucherCode: '',
    voucherName: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: undefined,
    usagePerClient: undefined,
    status: 'active'
  })

  Object.assign(restrictionsForm, {
    applicableServices: [],
    applicableCategories: [],
    excludedServices: [],
    minimumSpend: undefined,
    maximumDiscount: undefined,
    firstTimeClientsOnly: false,
    applicableDays: []
  })

  applicableServicesInput.value = ''
  applicableCategoriesInput.value = ''
  excludedServicesInput.value = ''
  applicableDaysInput.value = ''
}

const updateRestrictionArrays = () => {
  restrictionsForm.applicableServices = splitInput(applicableServicesInput.value)
  restrictionsForm.applicableCategories = splitInput(applicableCategoriesInput.value)
  restrictionsForm.excludedServices = splitInput(excludedServicesInput.value)
  restrictionsForm.applicableDays = splitInput(applicableDaysInput.value)
}

const splitInput = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean)

const formatDiscount = (voucher: Voucher) => {
  if (voucher.discountType === 'percentage') return `${voucher.discountValue}%`
  if (voucher.discountType === 'fixed_amount') return formatCurrency(voucher.discountValue)
  if (voucher.discountType === 'service_discount') return `Service - ${voucher.discountValue}`
  return 'Buy One Get One'
}

const formatDate = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
}

const statusClass = (status?: Voucher['status']) => {
  switch (status) {
    case 'inactive':
      return 'bg-gray-100 text-gray-700'
    case 'expired':
      return 'bg-amber-100 text-amber-700'
    case 'used_up':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-green-100 text-green-700'
  }
}
</script>
