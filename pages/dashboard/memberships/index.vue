<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Overview -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Membership Overview</h2>
            <p class="text-sm text-gray-500">Manage membership programs and client enrollments</p>
          </div>
          <button
            @click="refreshAll"
            :disabled="statsLoading || programsLoading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-60"
          >
            {{ statsLoading || programsLoading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Programs</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.totalPrograms || programs.length }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Active Programs</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.activePrograms || activeProgramCount }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Members Enrolled</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.totalMembers || 0 }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500">Average Tier</p>
            <p class="text-lg font-semibold text-gray-900">{{ statsSummary.averageTier || 'N/A' }}</p>
          </div>
        </div>
      </section>

      <!-- Membership Programs -->
      <section class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Membership Programs</h2>
            <p class="text-sm text-gray-500">Create and update loyalty programs for clients</p>
          </div>
          <button
            @click="openCreateModal"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            + Create Program
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <UiAnimatedInput
            v-model="filters.search"
            type="text"
            label="Search"
            placeholder="Search programs"
          />
          <UiSelectInput
            v-model="filters.membershipType"
            label="Membership Type"
            :options="membershipTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="All Types"
          />
          <UiSelectInput
            v-model="filters.isActive"
            label="Status"
            :options="activeStatusOptions"
            option-label="label"
            option-value="value"
            placeholder="All Status"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="program in programs"
            :key="program._id"
            class="border border-gray-100 rounded-xl p-5 bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-semibold text-gray-900">{{ program.membershipName }}</h3>
                <p class="text-xs text-gray-500">{{ formatMembershipType(program.membershipType) }}</p>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="program.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
              >
                {{ program.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mt-3">{{ program.description }}</p>

            <div class="grid grid-cols-2 gap-3 mt-4 text-xs text-gray-600">
              <div v-if="program.tiers?.length">Tiers: {{ program.tiers.length }}</div>
              <div v-if="program.pointsPerDollar">Points/$: {{ program.pointsPerDollar }}</div>
              <div v-if="program.pointsRedemptionValue">Redeem Value: {{ program.pointsRedemptionValue }}</div>
              <div v-if="program.subscriptionPrice">Subscription: {{ formatCurrency(program.subscriptionPrice) }}</div>
              <div v-if="program.subscriptionDuration">Duration: {{ program.subscriptionDuration }} months</div>
            </div>

            <div class="flex items-center gap-3 mt-5">
              <button
                @click="openEditModal(program)"
                class="px-3 py-2 rounded-lg text-xs font-medium text-white bg-gray-900 hover:bg-gray-800"
              >
                Edit
              </button>
              <button
                @click="handleDelete(program._id)"
                class="px-3 py-2 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100"
              >
                Delete
              </button>
            </div>
          </div>

          <div v-if="!programs.length && !programsLoading" class="border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500">
            No membership programs yet.
          </div>
        </div>
      </section>

      <!-- Client Membership Management -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Enroll Client</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiAnimatedInput v-model="enrollForm.clientId" type="text" label="Client ID" placeholder="Enter client ID" />
            <UiAnimatedInput v-model="enrollForm.membershipId" type="text" label="Membership ID" placeholder="Enter membership ID" />
            <UiAnimatedInput v-model="enrollForm.membershipNumber" type="text" label="Membership Number" placeholder="Enter membership number" />
            <UiAnimatedInput v-model="enrollForm.joinDate" type="date" label="Join Date" placeholder="Select join date" />
            <UiAnimatedInput v-model="enrollForm.expiryDate" type="date" label="Expiry Date" placeholder="Select expiry date" />
            <UiSelectInput
              v-model="enrollForm.status"
              label="Status"
              :options="enrollmentStatusOptions"
              option-label="label"
              option-value="value"
              placeholder="Select status"
            />
            <UiAnimatedInput v-model.number="enrollForm.totalPoints" type="number" label="Total Points" placeholder="Enter total points" />
            <UiAnimatedInput v-model.number="enrollForm.totalSpent" type="number" label="Total Spent" placeholder="Enter total spent" />
            <UiAnimatedInput v-model="enrollForm.currentTier" type="text" label="Current Tier" placeholder="Enter current tier" />
            <UiAnimatedInput v-model.number="enrollForm.tierProgress" type="number" label="Tier Progress" placeholder="Enter tier progress" />
          </div>
          <button
            @click="handleEnroll"
            :disabled="enrollLoading"
            class="w-full h-10 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {{ enrollLoading ? 'Enrolling...' : 'Enroll Client' }}
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Client Memberships</h2>
          <div>
            <div class="flex items-center gap-3">
              <UiAnimatedInput v-model="clientLookupId" type="text" label="Client ID" placeholder="Enter client ID" class="flex-1" />
              <button
                @click="loadClientMemberships"
                :disabled="clientMembershipsLoading"
                class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
              >
                {{ clientMembershipsLoading ? 'Loading...' : 'Fetch' }}
              </button>
            </div>
          </div>

          <div class="space-y-2 max-h-52 overflow-y-auto">
            <div
              v-for="membership in clientMemberships"
              :key="membership._id"
              class="border border-gray-100 rounded-lg p-3 text-xs text-gray-600"
            >
              <p class="text-sm font-semibold text-gray-900">{{ membership.membershipNumber }}</p>
              <p>Status: {{ membership.status || 'N/A' }}</p>
              <p>Tier: {{ membership.currentTier || 'N/A' }}</p>
              <p>Points: {{ membership.totalPoints || 0 }}</p>
            </div>
            <p v-if="!clientMemberships.length" class="text-xs text-gray-400">No memberships found.</p>
          </div>

          <div class="border-t border-gray-100 pt-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900">Membership Actions</h3>
            <UiAnimatedInput v-model="actionForm.membershipId" type="text" label="Client Membership ID" placeholder="Enter membership ID" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <UiAnimatedInput v-model.number="actionForm.points" type="number" label="Points" placeholder="Enter points" />
              <UiAnimatedInput v-model.number="actionForm.amount" type="number" label="Amount Spent" placeholder="Enter amount" />
            </div>
            <UiAnimatedInput v-model="actionForm.description" type="text" label="Description" placeholder="Enter description" />
            <div class="flex flex-wrap gap-3">
              <button
                @click="handleAddPoints"
                :disabled="addPointsLoading"
                class="px-3 py-2 rounded-lg text-xs font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60"
              >
                Add Points
              </button>
              <button
                @click="handleRedeemPoints"
                :disabled="redeemPointsLoading"
                class="px-3 py-2 rounded-lg text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
              >
                Redeem Points
              </button>
              <button
                @click="handleUpdateSpending"
                :disabled="updateSpendingLoading"
                class="px-3 py-2 rounded-lg text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
              >
                Update Spending
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Program Modal -->
    <div v-if="showProgramModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ editingProgram ? 'Edit Program' : 'Create Program' }}</h3>
          <button @click="closeProgramModal" class="text-sm text-gray-500">Close</button>
        </div>

        <form @submit.prevent="handleSaveProgram" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiAnimatedInput v-model="programForm.membershipName" type="text" label="Membership Name" placeholder="Enter membership name" required />
            <UiSelectInput
              v-model="programForm.membershipType"
              label="Membership Type"
              :options="programMembershipTypeOptions"
              option-label="label"
              option-value="value"
              placeholder="Select type"
            />
            <div class="md:col-span-2">
              <label class="text-xs text-gray-500">Description</label>
              <textarea v-model="programForm.description" rows="3" class="mt-1 w-full rounded-lg border-gray-200 text-sm"></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="programForm.membershipType === 'points_based'">
            <UiAnimatedInput v-model.number="programForm.pointsPerDollar" type="number" label="Points Per Dollar" placeholder="Enter points per dollar" />
            <UiAnimatedInput v-model.number="programForm.pointsRedemptionValue" type="number" label="Points Redemption Value" placeholder="Enter redemption value" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="programForm.membershipType === 'subscription'">
            <UiAnimatedInput v-model.number="programForm.subscriptionPrice" type="number" label="Subscription Price" placeholder="Enter subscription price" />
            <UiAnimatedInput v-model.number="programForm.subscriptionDuration" type="number" label="Subscription Duration (months)" placeholder="Enter duration" />
          </div>

          <div v-if="programForm.membershipType === 'tier_based'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-semibold text-gray-900">Tiers</h4>
              <button type="button" @click="addTier" class="text-xs font-semibold text-primary">+ Add Tier</button>
            </div>
            <div v-for="(tier, index) in programForm.tiers" :key="index" class="border border-gray-100 rounded-xl p-4 space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <UiAnimatedInput v-model="tier.tierName" type="text" label="Tier Name" placeholder="Enter tier name" />
                <UiAnimatedInput v-model.number="tier.tierLevel" type="number" label="Tier Level" placeholder="Enter tier level" />
                <UiAnimatedInput v-model.number="tier.minimumSpend" type="number" label="Minimum Spend" placeholder="Enter minimum spend" />
                <UiAnimatedInput v-model.number="tier.pointsMultiplier" type="number" label="Points Multiplier" placeholder="Enter multiplier" />
                <UiAnimatedInput v-model="tier.tierColor" type="text" label="Tier Color" placeholder="Enter color (e.g. #6B7280)" />
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h5 class="text-xs font-semibold text-gray-900">Benefits</h5>
                  <button type="button" @click="addBenefit(index)" class="text-xs text-primary">+ Add Benefit</button>
                </div>
                <div v-for="(benefit, benefitIndex) in tier.benefits" :key="benefitIndex" class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <UiSelectInput
                    v-model="benefit.benefitType"
                    label="Benefit Type"
                    :options="benefitTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select benefit type"
                  />
                  <UiAnimatedInput v-model="benefit.description" type="text" label="Description" placeholder="Enter benefit description" />
                  <UiAnimatedInput v-model.number="benefit.discountPercentage" type="number" label="Discount %" placeholder="Enter discount percentage" />
                  <UiAnimatedInput v-model="benefit.freeServiceName" type="text" label="Free Service Name" placeholder="Enter service name" />
                </div>
              </div>

              <button type="button" @click="removeTier(index)" class="text-xs text-rose-500">Remove Tier</button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input id="isActive" v-model="programForm.isActive" type="checkbox" class="custom-checkbox" />
            <label for="isActive" class="text-sm text-gray-700">Program is active</label>
          </div>

          <div class="flex justify-end gap-3 pt-3">
            <button type="button" @click="closeProgramModal" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90">
              {{ programSaving ? 'Saving...' : 'Save Program' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { MembershipProgram, MembershipTier, MembershipBenefit } from '@/types/growth'
import { useUser } from '@/composables/modules/auth/user'
import { useFetchMembershipPrograms } from '@/composables/modules/membership/useFetchMembershipPrograms'
import { useCreateProgram } from '@/composables/modules/membership/useCreateProgram'
import { useUpdateProgram } from '@/composables/modules/membership/useUpdateProgram'
import { useDeleteProgram } from '@/composables/modules/membership/useDeleteProgram'
import { useFetchMembershipStats } from '@/composables/modules/membership/useFetchMembershipStats'
import { useEnrollClient } from '@/composables/modules/membership/useEnrollClient'
import { useFetchClientMemberships } from '@/composables/modules/membership/useFetchClientMemberships'
import { useAddPoints } from '@/composables/modules/membership/useAddPoints'
import { useRedeemPoints } from '@/composables/modules/membership/useRedeemPoints'
import { useUpdateMembershipSpending } from '@/composables/modules/membership/useUpdateMembershipSpending'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { userId } = useUser()

// Options arrays for select inputs
const membershipTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Points Based', value: 'points_based' },
  { label: 'Tier Based', value: 'tier_based' },
  { label: 'Subscription', value: 'subscription' },
  { label: 'Prepaid', value: 'prepaid' }
]

const activeStatusOptions = [
  { label: 'All Status', value: undefined },
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

const enrollmentStatusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Expired', value: 'expired' },
  { label: 'Suspended', value: 'suspended' }
]

const programMembershipTypeOptions = [
  { label: 'Points Based', value: 'points_based' },
  { label: 'Tier Based', value: 'tier_based' },
  { label: 'Subscription', value: 'subscription' },
  { label: 'Prepaid', value: 'prepaid' }
]

const benefitTypeOptions = [
  { label: 'Discount', value: 'discount' },
  { label: 'Free Service', value: 'free_service' },
  { label: 'Priority Booking', value: 'priority_booking' },
  { label: 'Exclusive Access', value: 'exclusive_access' }
]

const filters = reactive({
  search: '',
  membershipType: '',
  isActive: undefined as undefined | boolean
})

const { data: programsData, loading: programsLoading, execute: fetchPrograms } = useFetchMembershipPrograms()
const programs = computed(() => programsData.value || [])

const { data: statsData, loading: statsLoading, execute: fetchStats } = useFetchMembershipStats()
const statsSummary = computed(() => statsData.value?.summary || statsData.value || {})

const { loading: createLoading, execute: createProgram } = useCreateProgram()
const { loading: updateLoading, execute: updateProgram } = useUpdateProgram()
const { loading: deleteLoading, execute: deleteProgram } = useDeleteProgram()

const { loading: enrollLoading, execute: enrollClient } = useEnrollClient()
const { data: clientMembershipsData, loading: clientMembershipsLoading, execute: fetchClientMemberships } = useFetchClientMemberships()
const clientMemberships = computed(() => clientMembershipsData.value || [])

const { loading: addPointsLoading, execute: addPoints } = useAddPoints()
const { loading: redeemPointsLoading, execute: redeemPoints } = useRedeemPoints()
const { loading: updateSpendingLoading, execute: updateSpending } = useUpdateMembershipSpending()

const showProgramModal = ref(false)
const editingProgram = ref<MembershipProgram | null>(null)

const programForm = reactive({
  membershipName: '',
  description: '',
  membershipType: 'points_based',
  tiers: [] as MembershipTier[],
  pointsPerDollar: undefined as number | undefined,
  pointsRedemptionValue: undefined as number | undefined,
  subscriptionPrice: undefined as number | undefined,
  subscriptionDuration: undefined as number | undefined,
  generalBenefits: [] as MembershipBenefit[],
  isActive: true
})

const enrollForm = reactive({
  clientId: '',
  membershipId: '',
  membershipNumber: '',
  joinDate: '',
  expiryDate: '',
  totalPoints: 0,
  totalSpent: 0,
  currentTier: '',
  tierProgress: 0,
  status: 'active'
})

const clientLookupId = ref('')

const actionForm = reactive({
  membershipId: '',
  points: 0,
  description: '',
  amount: 0
})

const programSaving = computed(() => createLoading.value || updateLoading.value)
const activeProgramCount = computed(() => programs.value.filter((program: MembershipProgram) => program.isActive).length)

const refreshAll = async () => {
  await Promise.all([fetchPrograms(buildFilters()), fetchStats()])
}

const buildFilters = () => ({
  search: filters.search || undefined,
  membershipType: filters.membershipType || undefined,
  isActive: filters.isActive
})

watch(filters, () => {
  fetchPrograms(buildFilters())
}, { deep: true })

const openCreateModal = () => {
  editingProgram.value = null
  resetProgramForm()
  showProgramModal.value = true
}

const openEditModal = (program: MembershipProgram) => {
  editingProgram.value = program
  Object.assign(programForm, {
    membershipName: program.membershipName,
    description: program.description,
    membershipType: program.membershipType,
    tiers: program.tiers ? JSON.parse(JSON.stringify(program.tiers)) : [],
    pointsPerDollar: program.pointsPerDollar,
    pointsRedemptionValue: program.pointsRedemptionValue,
    subscriptionPrice: program.subscriptionPrice,
    subscriptionDuration: program.subscriptionDuration,
    generalBenefits: program.generalBenefits ? JSON.parse(JSON.stringify(program.generalBenefits)) : [],
    isActive: program.isActive ?? true
  })
  showProgramModal.value = true
}

const closeProgramModal = () => {
  showProgramModal.value = false
}

const resetProgramForm = () => {
  Object.assign(programForm, {
    membershipName: '',
    description: '',
    membershipType: 'points_based',
    tiers: [],
    pointsPerDollar: undefined,
    pointsRedemptionValue: undefined,
    subscriptionPrice: undefined,
    subscriptionDuration: undefined,
    generalBenefits: [],
    isActive: true
  })
}

const addTier = () => {
  programForm.tiers.push({
    tierName: '',
    tierLevel: programForm.tiers.length + 1,
    minimumSpend: 0,
    pointsMultiplier: 1,
    benefits: [],
    tierColor: '#6B7280'
  })
}

const removeTier = (index: number) => {
  programForm.tiers.splice(index, 1)
}

const addBenefit = (tierIndex: number) => {
  programForm.tiers[tierIndex].benefits.push({
    benefitType: 'discount',
    description: '',
    discountPercentage: undefined,
    freeServiceId: undefined,
    freeServiceName: undefined
  })
}

const normalizeProgramPayload = () => {
  const payload: Partial<MembershipProgram> = {
    membershipName: programForm.membershipName,
    description: programForm.description,
    membershipType: programForm.membershipType as MembershipProgram['membershipType'],
    tiers: programForm.membershipType === 'tier_based' ? programForm.tiers : undefined,
    pointsPerDollar: programForm.membershipType === 'points_based' ? programForm.pointsPerDollar : undefined,
    pointsRedemptionValue: programForm.membershipType === 'points_based' ? programForm.pointsRedemptionValue : undefined,
    subscriptionPrice: programForm.membershipType === 'subscription' ? programForm.subscriptionPrice : undefined,
    subscriptionDuration: programForm.membershipType === 'subscription' ? programForm.subscriptionDuration : undefined,
    generalBenefits: programForm.generalBenefits?.length ? programForm.generalBenefits : undefined,
    isActive: programForm.isActive,
    createdBy: userId.value
  }

  return payload
}

const handleSaveProgram = async () => {
  const payload = normalizeProgramPayload()
  if (editingProgram.value) {
    await updateProgram(editingProgram.value._id, payload)
  } else {
    await createProgram(payload)
  }
  await fetchPrograms(buildFilters())
  showProgramModal.value = false
}

const handleDelete = async (id: string) => {
  if (deleteLoading.value) return
  await deleteProgram(id)
  await fetchPrograms(buildFilters())
}

const handleEnroll = async () => {
  if (!enrollForm.clientId || !enrollForm.membershipId || !enrollForm.membershipNumber || !enrollForm.joinDate) {
    return
  }
  const payload = {
    clientId: enrollForm.clientId,
    membershipId: enrollForm.membershipId,
    membershipNumber: enrollForm.membershipNumber,
    joinDate: toIsoDate(enrollForm.joinDate),
    expiryDate: enrollForm.expiryDate ? toIsoDate(enrollForm.expiryDate) : undefined,
    totalPoints: enrollForm.totalPoints || undefined,
    totalSpent: enrollForm.totalSpent || undefined,
    currentTier: enrollForm.currentTier || undefined,
    tierProgress: enrollForm.tierProgress || undefined,
    status: enrollForm.status
  }
  await enrollClient(payload)
}

const loadClientMemberships = async () => {
  if (!clientLookupId.value) return
  await fetchClientMemberships(clientLookupId.value)
}

const handleAddPoints = async () => {
  if (!actionForm.membershipId || !actionForm.points || !actionForm.description) return
  await addPoints(actionForm.membershipId, actionForm.points, actionForm.description)
}

const handleRedeemPoints = async () => {
  if (!actionForm.membershipId || !actionForm.points || !actionForm.description) return
  await redeemPoints(actionForm.membershipId, actionForm.points, actionForm.description)
}

const handleUpdateSpending = async () => {
  if (!actionForm.membershipId || !actionForm.amount) return
  await updateSpending(actionForm.membershipId, actionForm.amount)
}

const toIsoDate = (value: string) => {
  if (!value) return value
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toISOString()
}

const formatMembershipType = (type: string) => type.replace('_', ' ')
const formatCurrency = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value)

onMounted(async () => {
  await refreshAll()
})
</script>
