<template>
  <div class="p-8">
    <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Members</h1>
        <p class="text-gray-500 mt-1">Manage your staff, schedules, and permissions.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-40">
          <UiSelectInput
            v-model="statusFilter"
            label="Status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Select status"
          />
        </div>
        <NuxtLink 
          to="/dashboard/staff/create" 
          class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span>+ Add Staff</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>

    <!-- Staff List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="staff in staffList" :key="staff._id" class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-black transition-colors">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">
                {{ staff.firstName[0] }}{{ staff.lastName[0] }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ staff.firstName }} {{ staff.lastName }}</h3>
                <p class="text-sm text-gray-500 capitalize">{{ staff.role.replace('_', ' ') }}</p>
              </div>
            </div>
            <span 
              class="px-2.5 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-700': staff.status === 'active',
                'bg-gray-100 text-gray-700': staff.status === 'inactive'
              }"
            >
              {{ staff.status }}
            </span>
          </div>

          <div class="mt-6 space-y-2 text-sm text-gray-600">
             <div class="flex items-center gap-2">
               <span>📧</span> {{ staff.email }}
             </div>
             <div class="flex items-center gap-2">
               <span>📱</span> {{ staff.phone }}
             </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <NuxtLink :to="`/dashboard/staff/${staff._id}`" class="text-sm font-medium text-gray-900 hover:underline">
            View Details
          </NuxtLink>
          <div class="flex gap-2 items-center">
             <div>
               <label class="block text-[10px] font-medium text-gray-400 mb-1">Status</label>
               <select
                 v-model="staffStatuses[staff._id]"
                 @change="handleStatusChange(staff._id)"
                 class="text-xs border border-gray-200 rounded-md px-2 py-1"
               >
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
                 <option value="on_leave">On Leave</option>
                 <option value="terminated">Terminated</option>
               </select>
             </div>
             <NuxtLink :to="`/dashboard/staff/${staff._id}`" class="text-xs font-medium text-gray-500 hover:text-black">Schedule</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Staff } from '~/types/staff'
import { useFetchStaff } from '@/composables/modules/staff/useFetchStaff'
import { useUpdateStaffStatus } from '@/composables/modules/staff/useUpdateStaffStatus'
definePageMeta({
  layout: 'dashboard'
})

const statusFilter = ref('active')
const staffStatuses = reactive<Record<string, string>>({})

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'On Leave', value: 'on_leave' },
  { label: 'Terminated', value: 'terminated' }
]

const { data: staffList, loading, execute: fetchStaff } = useFetchStaff()
const { execute: updateStatus } = useUpdateStaffStatus()

onMounted(async () => {
  await fetchStaff(statusFilter.value)
  hydrateStatuses()
})

watch(statusFilter, async () => {
  await fetchStaff(statusFilter.value)
  hydrateStatuses()
})

const hydrateStatuses = () => {
  Object.keys(staffStatuses).forEach(key => {
    delete staffStatuses[key]
  })
  staffList.value.forEach((staff: Staff) => {
    staffStatuses[staff._id] = staff.status
  })
}

const handleStatusChange = async (staffId: string) => {
  const newStatus = staffStatuses[staffId]
  await updateStatus(staffId, newStatus)
  await fetchStaff(statusFilter.value)
}
</script>
