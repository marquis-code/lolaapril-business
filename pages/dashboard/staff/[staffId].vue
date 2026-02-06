<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/dashboard/staff" class="text-gray-500 hover:text-black mb-4 inline-block font-medium">← Back to Team</NuxtLink>
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ staff?.firstName }} {{ staff?.lastName }}</h1>
          <p class="text-gray-500">{{ staff?.role?.replace('_', ' ') }} • {{ staff?.email }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="staff?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
          >
            {{ staff?.status || 'unknown' }}
          </span>
          <button @click="handleCheckIn" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Check In</button>
          <button @click="handleCheckOut" class="border border-gray-200 px-4 py-2 rounded-lg text-sm">Check Out</button>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 rounded-lg text-sm font-medium"
        :class="activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Profile -->
    <div v-if="activeTab === 'profile'" class="space-y-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Profile</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="profile.phone" type="tel" label="Phone" />
          <UiAnimatedInput v-model="profile.bio" type="text" label="Bio" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Skills</h2>
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
        <div v-if="profile.skills.length" class="mt-3 space-y-2">
          <div v-for="(skill, index) in profile.skills" :key="`${skill.serviceId}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <div class="text-sm text-gray-700">{{ skill.serviceName }} • {{ skill.skillLevel }} • {{ skill.experienceMonths || 0 }} months</div>
            <button type="button" @click="removeSkill(index)" class="text-red-600 text-sm">Remove</button>
          </div>
        </div>
        <div class="pt-4">
          <button @click="saveSkills" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Skills</button>
        </div>
      </div>
    </div>

    <!-- Schedule -->
    <div v-if="activeTab === 'schedule'" class="space-y-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Create Schedule</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="scheduleForm.effectiveDate" type="date" label="Effective Date" />
          <UiAnimatedInput v-model="scheduleForm.endDate" type="date" label="End Date (optional)" />
          <UiSelectInput
            v-model="scheduleForm.scheduleType"
            label="Schedule Type"
            :options="scheduleTypeOptions"
            option-label="label"
            option-value="value"
          />
        </div>
        <div class="mt-4 flex items-center gap-2">
          <input v-model="scheduleForm.isDefault24_7" type="checkbox" class="custom-checkbox" />
          <span class="text-sm text-gray-600">Default 24/7 schedule</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Weekly Schedule</h2>
        <div class="hidden md:grid grid-cols-5 gap-4 text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          <div>Day</div>
          <div>Status</div>
          <div>Start</div>
          <div>End</div>
          <div></div>
        </div>
        <div class="space-y-3">
          <div v-for="day in scheduleForm.weeklySchedule" :key="day.dayOfWeek" class="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div class="font-medium text-gray-700">{{ dayNames[day.dayOfWeek - 1] }}</div>
            <label class="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" v-model="day.isWorkingDay" class="custom-checkbox" /> Working
            </label>
            <div>
              <UiAnimatedInput v-model="day.workingHours[0].startTime" type="time" label="Start" placeholder="" :disabled="!day.isWorkingDay" />
            </div>
            <div>
              <UiAnimatedInput v-model="day.workingHours[0].endTime" type="time" label="End" placeholder="" :disabled="!day.isWorkingDay" />
            </div>
            <div class="hidden md:block"></div>
          </div>
        </div>
        <div class="pt-4">
          <button @click="saveSchedule" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Schedule</button>
        </div>
      </div>

      <div v-if="staffSchedule" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Current Schedule</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div class="text-xs font-medium text-gray-400 uppercase">Effective</div>
            <div class="text-sm text-gray-700">{{ staffSchedule.effectiveDate }}</div>
          </div>
          <div>
            <div class="text-xs font-medium text-gray-400 uppercase">Ends</div>
            <div class="text-sm text-gray-700">{{ staffSchedule.endDate || '—' }}</div>
          </div>
          <div>
            <div class="text-xs font-medium text-gray-400 uppercase">Type</div>
            <div class="text-sm text-gray-700">{{ staffSchedule.scheduleType || 'regular' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assignments -->
    <div v-if="activeTab === 'assignments'" class="space-y-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Assignments</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="assignmentRange.startDate" type="date" label="Start Date" />
          <UiAnimatedInput v-model="assignmentRange.endDate" type="date" label="End Date" />
          <div class="flex items-end">
            <button @click="loadAssignments" class="bg-black text-white px-4 py-2 rounded-lg w-full">Load</button>
          </div>
        </div>

        <div v-if="assignments.length" class="mt-4">
          <div class="overflow-hidden border border-gray-200 rounded-xl">
            <div class="hidden md:grid grid-cols-5 gap-4 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div>Service</div>
              <div>Date</div>
              <div>Time</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            <div class="divide-y divide-gray-100">
              <div v-for="assignment in assignments" :key="assignment._id" class="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-3">
                <div class="text-sm font-medium text-gray-900">
                  {{ assignment.assignmentDetails.serviceName }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ assignment.assignmentDate }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ assignment.assignmentDetails.startTime }} - {{ assignment.assignmentDetails.endTime }}
                </div>
                <div>
                  <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {{ assignment.status || 'scheduled' }}
                  </span>
                </div>
                <div class="flex items-start">
                  <button @click="openCompletionModal(assignment)" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Complete</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="showCompletionModal" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50" @click="closeCompletionModal"></div>
            <div class="relative bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-base font-semibold text-gray-900">Complete Assignment</h3>
                  <p class="text-xs text-gray-500">
                    {{ selectedAssignment?.assignmentDetails.serviceName }} • {{ selectedAssignment?.assignmentDate }}
                  </p>
                </div>
                <button @click="closeCompletionModal" class="text-gray-500 hover:text-gray-900">✕</button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div class="rounded-lg border border-gray-200 p-3">
                  <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Service</div>
                  <div class="text-sm text-gray-900">
                    {{ selectedAssignment?.assignmentDetails.serviceName }}
                  </div>
                </div>
                <div class="rounded-lg border border-gray-200 p-3">
                  <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Date</div>
                  <div class="text-sm text-gray-900">{{ selectedAssignment?.assignmentDate }}</div>
                </div>
                <div class="rounded-lg border border-gray-200 p-3">
                  <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Scheduled Time</div>
                  <div class="text-sm text-gray-900">
                    {{ selectedAssignment?.assignmentDetails.startTime }} - {{ selectedAssignment?.assignmentDetails.endTime }}
                  </div>
                </div>
                <div class="rounded-lg border border-gray-200 p-3">
                  <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Client</div>
                  <div class="text-sm text-gray-900">{{ selectedAssignment?.clientId || '—' }}</div>
                </div>
                <div class="rounded-lg border border-gray-200 p-3">
                  <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Status</div>
                  <div class="text-sm text-gray-900">{{ selectedAssignment?.status || 'scheduled' }}</div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <UiAnimatedInput v-model="completionDraft.actualStartTime" type="time" label="Actual Start" placeholder="" />
                </div>
                <div>
                  <UiAnimatedInput v-model="completionDraft.actualEndTime" type="time" label="Actual End" placeholder="" />
                </div>
                <div>
                  <UiAnimatedInput v-model.number="completionDraft.rating" type="number" label="Rating" placeholder="1-5" />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-xs font-medium text-gray-500 mb-1">Completion Notes</label>
                <textarea v-model="completionDraft.completionNotes" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-200"></textarea>
              </div>

              <div class="pt-6 flex justify-end gap-3">
                <button @click="closeCompletionModal" class="px-4 py-2 rounded-lg border border-gray-200 text-sm">Cancel</button>
                <button @click="submitCompletion" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 text-sm">Submit Completion</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="mt-4 text-sm text-gray-500">No assignments found for selected range.</div>
      </div>
    </div>

    <!-- Working Hours -->
    <div v-if="activeTab === 'hours'" class="space-y-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Working Hours</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="hoursRange.startDate" type="date" label="Start Date" />
          <UiAnimatedInput v-model="hoursRange.endDate" type="date" label="End Date" />
          <div class="flex items-end">
            <button @click="loadWorkingHours" class="bg-black text-white px-4 py-2 rounded-lg w-full">Load</button>
          </div>
        </div>
        <div v-if="workingHours.length" class="mt-4">
          <div class="hidden md:grid grid-cols-2 gap-4 text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            <div>Date</div>
            <div>Total Hours</div>
          </div>
          <div class="space-y-2">
            <div v-for="(entry, index) in workingHours" :key="index" class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 px-3 py-2 rounded-lg">
              <div class="text-sm text-gray-700">{{ entry.date || entry.day || 'Date' }}</div>
              <div class="text-sm text-gray-700">{{ entry.totalHours || entry.hours || entry.duration || '0' }}</div>
            </div>
          </div>
        </div>
        <div v-else class="mt-4 text-sm text-gray-500">No working hours found for selected range.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type {
  CompleteAssignmentDto,
  CreateStaffScheduleDto,
  DailySchedule,
  StaffAssignment,
  StaffSkill
} from '~/types/staff'
import { useFetchStaffById } from '@/composables/modules/staff/useFetchStaffById'
import { useFetchStaffSchedule } from '@/composables/modules/staff/useFetchStaffSchedule'
import { useCreateStaffSchedule } from '@/composables/modules/staff/useCreateStaffSchedule'
import { useFetchStaffAssignments } from '@/composables/modules/staff/useFetchStaffAssignments'
import { useFetchStaffWorkingHours } from '@/composables/modules/staff/useFetchStaffWorkingHours'
import { useUpdateStaffSkills } from '@/composables/modules/staff/useUpdateStaffSkills'
import { useCheckInStaff } from '@/composables/modules/staff/useCheckInStaff'
import { useCheckOutStaff } from '@/composables/modules/staff/useCheckOutStaff'
import { useCompleteAssignment } from '@/composables/modules/staff/useCompleteAssignment'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const staffId = computed(() => route.params.staffId as string)

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'hours', label: 'Working Hours' }
]

const activeTab = ref('profile')
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Options for selects
const skillLevelOptions = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
  { label: 'Master', value: 'master' }
]

const scheduleTypeOptions = [
  { label: 'Regular', value: 'regular' },
  { label: 'Temporary', value: 'temporary' },
  { label: 'Override', value: 'override' },
  { label: '24/7', value: '24_7' }
]

const { data: staff, execute: fetchStaffById } = useFetchStaffById()
const { data: staffSchedule, execute: fetchSchedule } = useFetchStaffSchedule()
const { execute: createSchedule } = useCreateStaffSchedule()
const { data: assignments, execute: fetchAssignments } = useFetchStaffAssignments()
const { data: workingHours, execute: fetchWorkingHours } = useFetchStaffWorkingHours()
const { execute: updateSkills } = useUpdateStaffSkills()
const { execute: checkIn } = useCheckInStaff()
const { execute: checkOut } = useCheckOutStaff()
const { execute: completeAssignment } = useCompleteAssignment()

const selectedAssignment = ref<StaffAssignment | null>(null)
const showCompletionModal = ref(false)

const profile = reactive({
  phone: '',
  bio: '',
  skills: [] as StaffSkill[]
})

const skillDraft = reactive<StaffSkill>({
  serviceId: '',
  serviceName: '',
  skillLevel: 'beginner',
  experienceMonths: 0,
  isActive: true
})

const scheduleForm = reactive<CreateStaffScheduleDto>({
  staffId: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  endDate: '',
  scheduleType: 'regular',
  isDefault24_7: false,
  weeklySchedule: [] as DailySchedule[]
})

const assignmentRange = reactive({
  startDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
})

const hoursRange = reactive({
  startDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
})

const completionDraft = reactive<CompleteAssignmentDto>({
  actualStartTime: '',
  actualEndTime: '',
  completionNotes: '',
  rating: 5
})

const initializeWeeklySchedule = () => {
  scheduleForm.weeklySchedule = Array.from({ length: 7 }, (_, index) => ({
    dayOfWeek: index + 1,
    isWorkingDay: true,
    workingHours: [{ startTime: '09:00', endTime: '17:00' }],
    breaks: []
  }))
}

onMounted(async () => {
  scheduleForm.staffId = staffId.value
  initializeWeeklySchedule()

  await fetchStaffById(staffId.value)
  if (staff.value) {
    profile.phone = staff.value.phone
    profile.bio = staff.value.bio || ''
    profile.skills = staff.value.skills || []
  }

  await fetchSchedule(staffId.value)
  if (staffSchedule.value) {
    scheduleForm.weeklySchedule = staffSchedule.value.weeklySchedule || scheduleForm.weeklySchedule
    scheduleForm.effectiveDate = staffSchedule.value.effectiveDate
    scheduleForm.endDate = staffSchedule.value.endDate || ''
    scheduleForm.scheduleType = staffSchedule.value.scheduleType || 'regular'
    scheduleForm.isDefault24_7 = staffSchedule.value.isDefault24_7 || false
  }

  await loadAssignments()
  await loadWorkingHours()
})

const addSkill = () => {
  if (!skillDraft.serviceId || !skillDraft.serviceName) return
  profile.skills.push({ ...skillDraft })
  skillDraft.serviceId = ''
  skillDraft.serviceName = ''
  skillDraft.skillLevel = 'beginner'
  skillDraft.experienceMonths = 0
  skillDraft.isActive = true
}

const removeSkill = (index: number) => {
  profile.skills.splice(index, 1)
}

const saveSkills = async () => {
  await updateSkills(staffId.value, profile.skills)
  await fetchStaffById(staffId.value)
}

const saveSchedule = async () => {
  await createSchedule({ ...scheduleForm, staffId: staffId.value })
  await fetchSchedule(staffId.value)
}

const loadAssignments = async () => {
  await fetchAssignments(staffId.value, { ...assignmentRange })
}

const completeStaffAssignment = async (assignmentId: string) => {
  await completeAssignment(assignmentId, completionDraft)
  closeCompletionModal()
  await loadAssignments()
}

const selectAssignment = (assignment: StaffAssignment) => {
  selectedAssignment.value = assignment
  completionDraft.actualStartTime = ''
  completionDraft.actualEndTime = ''
  completionDraft.completionNotes = ''
  completionDraft.rating = 5
}

const clearSelectedAssignment = () => {
  selectedAssignment.value = null
  completionDraft.actualStartTime = ''
  completionDraft.actualEndTime = ''
  completionDraft.completionNotes = ''
  completionDraft.rating = 5
}

const openCompletionModal = (assignment: StaffAssignment) => {
  selectAssignment(assignment)
  showCompletionModal.value = true
}

const closeCompletionModal = () => {
  showCompletionModal.value = false
  clearSelectedAssignment()
}

const submitCompletion = async () => {
  if (!selectedAssignment.value) return
  await completeStaffAssignment(selectedAssignment.value._id)
}

const loadWorkingHours = async () => {
  await fetchWorkingHours(staffId.value, { ...hoursRange })
}

const handleCheckIn = async () => {
  await checkIn({ staffId: staffId.value, notes: 'Checked in via dashboard' })
}

const handleCheckOut = async () => {
  await checkOut(staffId.value)
}
</script>
