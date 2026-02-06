<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/dashboard/staff" class="text-gray-500 hover:text-black mb-4 inline-block font-medium">← Back to Team</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Add Team Member</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Personal Info -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.firstName" type="text" label="First Name" required />
          <UiAnimatedInput v-model="form.lastName" type="text" label="Last Name" required />
          <UiAnimatedInput v-model="form.email" type="email" label="Email" required />
          <UiAnimatedInput v-model="form.phone" type="tel" label="Phone" required />
        </div>
      </section>

      <!-- Role & Permissions -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Role & Employment</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiSelectInput
            v-model="form.role"
            label="Role"
            :options="roleOptions"
            option-label="label"
            option-value="value"
            required
          />
          <UiSelectInput
            v-model="form.employmentType"
            label="Employment Type"
            :options="employmentTypeOptions"
            option-label="label"
            option-value="value"
          />
          <UiAnimatedInput v-model="form.hireDate" type="date" label="Hire Date" required />
        </div>
      </section>

      <!-- Skills & Commission -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Skills & Commission</h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <UiAnimatedInput v-model="skillDraft.serviceName" type="text" label="Service Name" />
          <UiAnimatedInput v-model="skillDraft.serviceId" type="text" label="Service ID" />
          <UiSelectInput
            v-model="skillDraft.skillLevel"
            label="Skill Level"
            :options="skillLevelOptions"
            option-label="label"
            option-value="value"
          />
          <UiAnimatedInput v-model="skillDraft.experienceMonths" type="number" label="Experience (months)" />
          <div class="flex items-end">
            <button type="button" @click="addSkill" class="bg-gray-900 text-white px-4 py-2 rounded-lg w-full">Add Skill</button>
          </div>
        </div>
        <div v-if="form.skills?.length" class="mt-3 space-y-2">
          <div v-for="(skill, index) in form.skills" :key="`${skill.serviceId}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <div class="text-sm text-gray-700">{{ skill.serviceName }} • {{ skill.skillLevel }}</div>
            <button type="button" @click="removeSkill(index)" class="text-red-600 text-sm">Remove</button>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <UiAnimatedInput v-model="commissionDraft.serviceId" type="text" label="Service ID (optional)" />
          <UiSelectInput
            v-model="commissionDraft.commissionType"
            label="Commission Type"
            :options="commissionTypeOptions"
            option-label="label"
            option-value="value"
          />
          <UiAnimatedInput v-model="commissionDraft.commissionValue" type="number" label="Value" />
          <UiAnimatedInput v-model="commissionDraft.minimumAmount" type="number" label="Minimum Amount" />
          <div class="flex items-end">
            <button type="button" @click="addCommission" class="bg-gray-900 text-white px-4 py-2 rounded-lg w-full">Add Commission</button>
          </div>
        </div>
        <div v-if="form.commissionStructure?.length" class="mt-3 space-y-2">
          <div v-for="(commission, index) in form.commissionStructure" :key="`${commission.serviceId || 'all'}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <div class="text-sm text-gray-700">{{ commission.commissionType }} • {{ commission.commissionValue }}</div>
            <button type="button" @click="removeCommission(index)" class="text-red-600 text-sm">Remove</button>
          </div>
        </div>
      </section>

      <!-- Profile & Notes -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Profile & Notes</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.profileImage" type="url" label="Profile Image URL" />
          <UiAnimatedInput v-model="form.password" type="password" label="Password (optional)" />
        </div>
        <div class="mt-4">
          <UiAnimatedInput v-model="form.bio" type="text" label="Bio" />
        </div>
        <div class="mt-4">
          <UiAnimatedInput v-model="certificationsInput" type="text" label="Certifications (comma separated)" />
        </div>
      </section>

      <div class="flex justify-end gap-4 pt-4">
        <NuxtLink to="/dashboard/staff" class="px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-70">
          {{ loading ? 'Adding...' : 'Add Team Member' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { CreateStaffDto, StaffCommission, StaffSkill } from '~/types/staff'
import { useCreateStaff } from '@/composables/modules/staff/useCreateStaff'

definePageMeta({
  layout: 'dashboard'
})

const { execute: createStaff, loading } = useCreateStaff()
const router = useRouter()

const form = reactive<CreateStaffDto>({
  businessId: '', // Will be set by composable
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'stylist',
  employmentType: 'full_time',
  hireDate: new Date().toISOString().split('T')[0],
  skills: [],
  commissionStructure: [],
  certifications: []
})

const certificationsInput = ref('')

// Options for selects
const roleOptions = [
  { label: 'Stylist', value: 'stylist' },
  { label: 'Barber', value: 'barber' },
  { label: 'Therapist', value: 'therapist' },
  { label: 'Nail Tech', value: 'nail_tech' },
  { label: 'Receptionist', value: 'receptionist' },
  { label: 'Manager', value: 'manager' },
  { label: 'Owner', value: 'owner' }
]

const employmentTypeOptions = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contractor', value: 'contractor' },
  { label: 'Intern', value: 'intern' }
]

const skillLevelOptions = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
  { label: 'Master', value: 'master' }
]

const commissionTypeOptions = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed', value: 'fixed' }
]

const skillDraft = reactive<StaffSkill>({
  serviceId: '',
  serviceName: '',
  skillLevel: 'beginner',
  experienceMonths: 0,
  isActive: true
})

const commissionDraft = reactive<StaffCommission>({
  serviceId: '',
  commissionType: 'percentage',
  commissionValue: 0,
  minimumAmount: 0,
  isActive: true
})

const handleSubmit = async () => {
  try {
    form.certifications = certificationsInput.value
      ? certificationsInput.value.split(',').map((item: string) => item.trim()).filter(Boolean)
      : []
    await createStaff(form)
    router.push('/dashboard/staff')
  } catch (e: any) {
    alert(e.message || 'Failed to add staff member')
  }
}

const addSkill = () => {
  if (!skillDraft.serviceName || !skillDraft.serviceId) return
  form.skills?.push({ ...skillDraft })
  skillDraft.serviceId = ''
  skillDraft.serviceName = ''
  skillDraft.skillLevel = 'beginner'
  skillDraft.experienceMonths = 0
  skillDraft.isActive = true
}

const removeSkill = (index: number) => {
  form.skills?.splice(index, 1)
}

const addCommission = () => {
  if (!commissionDraft.commissionValue) return
  form.commissionStructure?.push({ ...commissionDraft })
  commissionDraft.serviceId = ''
  commissionDraft.commissionType = 'percentage'
  commissionDraft.commissionValue = 0
  commissionDraft.minimumAmount = 0
  commissionDraft.isActive = true
}

const removeCommission = (index: number) => {
  form.commissionStructure?.splice(index, 1)
}
</script>
