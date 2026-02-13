<template>
  <div class="p-8">
    <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Management</h1>
        <p class="text-gray-500 mt-1">Manage team members, roles, and departments.</p>
      </div>
      <button @click="openCreateModal" class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800">
        + Add Team Member
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Total</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.total || teamMembers.length }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Active</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.active || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Inactive</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ stats?.inactive || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-xs font-semibold text-gray-400 uppercase">Departments</div>
        <div class="text-2xl font-bold text-gray-900 mt-2">{{ departmentCount }}</div>
      </div>
    </div>


    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <UiAnimatedInput v-model="filters.search" type="text" label="Search" placeholder="Name or email" />
        <UiSelectInput
          v-model="filters.role"
          label="Role"
          :options="roleFilterOptions"
          option-label="label"
          option-value="value"
          placeholder="All"
        />
        <UiSelectInput
          v-model="filters.status"
          label="Status"
          :options="statusFilterOptions"
          option-label="label"
          option-value="value"
          placeholder="All"
        />
        <UiAnimatedInput v-model="filters.department" type="text" label="Department" placeholder="Department" />
        <div class="flex items-end">
          <button @click="applyFilters" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm w-full">Apply</button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="hidden md:grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
        <div>Name</div>
        <div>Role</div>
        <div>Department</div>
        <div>Status</div>
        <div>Employment</div>
        <div>Actions</div>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="member in teamMembers" :key="member._id" class="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4">
          <div>
            <div class="font-medium text-gray-900 flex items-center gap-2">
              <img v-if="member.profileImage" :src="member.profileImage" alt="Profile" class="w-8 h-8 rounded-full object-cover border border-gray-200" />
              <span>{{ member.firstName }} {{ member.lastName }}</span>
            </div>
            <div class="text-xs text-gray-500">{{ member.email }}</div>
            <div class="text-xs text-gray-400 mt-1" v-if="member.phone">{{ member.phone.countryCode }} {{ member.phone.number }}</div>
          </div>
          <div class="text-sm text-gray-600 capitalize">
            {{ member.role }}
            <div v-if="member.skills?.experienceLevel" class="text-xs text-gray-400">{{ member.skills.experienceLevel }}</div>
            <div v-if="member.skills?.specializations?.length" class="flex flex-wrap gap-1 mt-1">
              <span v-for="(spec, i) in member.skills.specializations" :key="i" class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{{ spec }}</span>
            </div>
          </div>
          <div class="text-sm text-gray-600">
            {{ member.department || '—' }}
            <div v-if="member.workingHours && member.workingHours.length" class="text-xs text-gray-400 mt-1">
              <span v-for="(wh, i) in member.workingHours.filter(h => h.isWorking)" :key="i">
                {{ wh.day }}<span v-if="i < member.workingHours.filter(h => h.isWorking).length - 1">, </span>
              </span>
            </div>
          </div>
          <div>
            <span class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              :class="member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
              {{ member.isActive ? 'active' : 'inactive' }}
            </span>
            <div v-if="member.canBookOnline === false" class="text-xs text-red-500 mt-1">Cannot book online</div>
          </div>
          <div class="text-sm text-gray-600 capitalize">
            {{ member.employmentType?.replace('_', ' ') }}
            <div v-if="member.hireDate" class="text-xs text-gray-400">Hired: {{ member.hireDate }}</div>
            <div v-if="member.salary" class="text-xs text-gray-400">₦{{ member.salary.toLocaleString() }}</div>
          </div>
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            <button @click="openViewModal(member)" class="text-xs font-medium text-blue-600 hover:underline">View</button>
            <button @click="openEditModal(member)" class="text-xs font-medium text-gray-600 hover:text-black">Edit</button>
            <button @click="openStatusModal(member)" class="text-xs font-medium text-gray-600 hover:text-black">Status</button>
            <button @click="handleDelete(member._id)" class="text-xs font-medium text-red-600">Delete</button>
          </div>
        </div>
      </div>
      <div v-if="teamMembers.length === 0" class="p-12 text-center text-gray-500">No team members found.</div>
    </div>

    <!-- Create/Edit Modal - Stepwise Form -->
    <div v-if="showMemberModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ editingMember ? 'Edit Team Member' : 'Add Team Member' }}</h2>
            <p class="text-sm text-gray-500 mt-1">Step {{ currentStep }} of {{ totalSteps }}</p>
          </div>
          <button @click="closeMemberModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <!-- Step Progress -->
        <div class="px-6 pt-4 flex-shrink-0">
          <div class="flex items-center justify-between mb-2">
            <div
              v-for="step in totalSteps"
              :key="step"
              class="flex items-center"
              :class="step < totalSteps ? 'flex-1' : ''"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all"
                :class="step <= currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'"
              >
                {{ step }}
              </div>
              <div
                v-if="step < totalSteps"
                class="flex-1 h-1 mx-2 rounded-full transition-all"
                :class="step < currentStep ? 'bg-black' : 'bg-gray-200'"
              ></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 px-1">
            <span>Basic Info</span>
            <span>Working Hours</span>
            <span>Skills</span>
            <span>Commissions</span>
            <span>Details</span>
          </div>
        </div>

        <!-- Form Steps -->
        <div class="p-6 overflow-y-auto flex-1">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiAnimatedInput v-model="memberForm.firstName" type="text" label="First Name" required />
              <UiAnimatedInput v-model="memberForm.lastName" type="text" label="Last Name" required />
            </div>
            <UiAnimatedInput v-model="memberForm.email" type="email" label="Email Address" required />
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UiAnimatedInput v-model="memberForm.phone.countryCode" type="text" label="Country Code" placeholder="+234" required />
              <div class="md:col-span-2">
                <UiAnimatedInput v-model="memberForm.phone.number" type="text" label="Phone Number" required />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiSelectInput
                v-model="memberForm.role"
                label="Role"
                :options="roleOptions"
                option-label="label"
                option-value="value"
              />
              <UiSelectInput
                v-model="memberForm.employmentType"
                label="Employment Type"
                :options="employmentTypeOptions"
                option-label="label"
                option-value="value"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiAnimatedInput v-model="memberForm.hireDate" type="date" label="Hire Date" />
              <UiAnimatedInput v-model.number="memberForm.salary" type="number" label="Salary" placeholder="0" />
            </div>
          </div>

          <!-- Step 2: Working Hours -->
          <div v-if="currentStep === 2" class="space-y-4">
            <div class="bg-blue-50 rounded-xl p-4 mb-4">
              <p class="text-sm text-blue-800">Configure the working schedule for this team member. Toggle each day on/off and set the working hours.</p>
            </div>
            
            <div class="space-y-3">
              <div
                v-for="hours in memberForm.workingHours"
                :key="hours.day"
                class="bg-gray-50 rounded-xl p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="hours.isWorking" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                    <span class="font-medium text-gray-900">{{ hours.day }}</span>
                  </div>
                  <span v-if="hours.isWorking" class="text-xs text-green-600 font-medium">Working</span>
                  <span v-else class="text-xs text-gray-400">Off</span>
                </div>
                
                <div v-if="hours.isWorking" class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                    <input
                      v-model="hours.startTime"
                      type="time"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                    <input
                      v-model="hours.endTime"
                      type="time"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex flex-wrap gap-2 pt-4">
              <button
                type="button"
                @click="applyWeekdayHours"
                class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700"
              >
                Apply Weekday Schedule (Mon-Fri, 9-17)
              </button>
              <button
                type="button"
                @click="clearAllHours"
                class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700"
              >
                Clear All
              </button>
            </div>
          </div>

          <!-- Step 3: Skills & Services -->
          <div v-if="currentStep === 3" class="space-y-6">
            <div class="bg-blue-50 rounded-xl p-4">
              <p class="text-sm text-blue-800">Select the services this team member can perform and add any specializations.</p>
            </div>

            <!-- Services Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Services</label>
              <div v-if="servicesLoading" class="text-sm text-gray-500 py-4">Loading services...</div>
              <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-100 rounded-xl p-3">
                <label
                  v-for="service in services"
                  :key="service._id"
                  class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent"
                  :class="selectedServices.includes(service._id) ? 'bg-gray-100 border-gray-300' : ''"
                >
                  <input
                    type="checkbox"
                    :value="service._id"
                    v-model="selectedServices"
                    class="custom-checkbox"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ getServiceName(service) }}</p>
                    <!-- {{ service }} -->
                    <p class="text-xs text-gray-500">{{ getServiceCategory(service) }}</p>
                  </div>
                </label>
              </div>
              <div v-else class="text-sm text-gray-500 py-4 text-center border border-gray-100 rounded-xl">
                No services found. Create services first.
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ selectedServices.length }} services selected</p>
            </div>

            <!-- Specializations -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="(spec, index) in specializations"
                  :key="index"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                >
                  {{ spec }}
                  <button type="button" @click="removeSpecialization(index)" class="text-gray-400 hover:text-red-500">&times;</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newSpecialization"
                  type="text"
                  placeholder="Add specialization (e.g., Bridal Hair)"
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  @keyup.enter="addSpecialization"
                />
                <button
                  type="button"
                  @click="addSpecialization"
                  class="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>

            <!-- Experience Level -->
            <UiSelectInput
              v-model="memberForm.skills.experienceLevel"
              label="Experience Level"
              :options="experienceLevelOptions"
              option-label="label"
              option-value="value"
            />
          </div>

          <!-- Step 4: Commissions -->
          <div v-if="currentStep === 4" class="space-y-6">
            <div class="bg-blue-50 rounded-xl p-4">
              <p class="text-sm text-blue-800">Set up commission structures for this team member. You can set different commission rates for each service.</p>
            </div>

            <!-- Add Commission Form -->
            <div class="bg-gray-50 rounded-xl p-4 space-y-4">
              <h4 class="font-medium text-gray-900">Add Commission</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Select Service</label>
                  <select
                    v-model="commissionDraft.serviceId"
                    @change="onCommissionServiceChange"
                    class="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option v-for="service in services" :key="service._id" :value="service._id">
                      {{ getServiceName(service) }}
                    </option>
                  </select>
                </div>
                <UiSelectInput
                  v-model="commissionDraft.commissionType"
                  label="Commission Type"
                  :options="commissionTypeOptions"
                  option-label="label"
                  option-value="value"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UiAnimatedInput
                  v-model.number="commissionDraft.commissionValue"
                  type="number"
                  :label="commissionDraft.commissionType === 'percentage' ? 'Commission (%)' : 'Commission Amount'"
                  placeholder="0"
                />
                <div class="flex items-end">
                  <button
                    type="button"
                    @click="addCommission"
                    :disabled="!canAddCommission"
                    class="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Commission
                  </button>
                </div>
              </div>
            </div>

            <!-- Commission List -->
            <div v-if="memberForm.commissions.length > 0" class="space-y-2">
              <h4 class="font-medium text-gray-900">Added Commissions ({{ memberForm.commissions.length }})</h4>
              <div
                v-for="(commission, index) in memberForm.commissions"
                :key="`${commission.serviceId}-${index}`"
                class="flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ commission.serviceName }}</p>
                  <p class="text-xs text-gray-500">
                    {{ commission.commissionType === 'percentage' ? `${commission.commissionValue}%` : `₦${commission.commissionValue}` }} per service
                  </p>
                </div>
                <button type="button" @click="removeCommission(index)" class="text-red-500 hover:text-red-700 text-sm font-medium">
                  Remove
                </button>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-400 text-sm">
              No commissions added yet. Add commissions above.
            </div>
          </div>

          <!-- Step 5: Additional Details -->
          <div v-if="currentStep === 5" class="space-y-6">
            <UiAnimatedInput
              v-model="memberForm.profileImage"
              type="text"
              label="Profile Image URL"
              placeholder="https://example.com/profile.jpg"
            />

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                v-model="memberForm.bio"
                rows="4"
                placeholder="Brief description about this team member..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiSelectInput
                v-model="isActiveString"
                label="Active Status"
                :options="isActiveOptions"
                option-label="label"
                option-value="value"
              />
              <UiSelectInput
                v-model="canBookOnlineString"
                label="Can Book Online"
                :options="canBookOnlineOptions"
                option-label="label"
                option-value="value"
              />
            </div>

            <!-- Emergency Contact -->
            <div class="border-t border-gray-100 pt-6">
              <h4 class="font-medium text-gray-900 mb-4">Emergency Contact</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UiAnimatedInput
                  v-model="memberForm.emergencyContact.name"
                  type="text"
                  label="Contact Name"
                  placeholder="Jane Doe"
                />
                <UiAnimatedInput
                  v-model="memberForm.emergencyContact.relationship"
                  type="text"
                  label="Relationship"
                  placeholder="Spouse"
                />
                <UiAnimatedInput
                  v-model="memberForm.emergencyContact.phone"
                  type="text"
                  label="Phone Number"
                  placeholder="+234 123 456 7890"
                />
              </div>
            </div>

            <!-- Summary Preview -->
            <div class="bg-gray-50 rounded-xl p-4 mt-6">
              <h4 class="font-medium text-gray-900 mb-3">Summary</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="text-gray-500">Name:</div>
                <div class="text-gray-900 font-medium">{{ memberForm.firstName }} {{ memberForm.lastName }}</div>
                <div class="text-gray-500">Email:</div>
                <div class="text-gray-900">{{ memberForm.email }}</div>
                <div class="text-gray-500">Role:</div>
                <div class="text-gray-900 capitalize">{{ memberForm.role }}</div>
                <div class="text-gray-500">Working Days:</div>
                <div class="text-gray-900">{{ workingDaysCount }} days</div>
                <div class="text-gray-500">Services:</div>
                <div class="text-gray-900">{{ selectedServices.length }} services</div>
                <div class="text-gray-500">Commissions:</div>
                <div class="text-gray-900">{{ memberForm.commissions.length }} configured</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="prevStep"
            class="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="closeMemberModal"
              class="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              v-if="currentStep < totalSteps"
              type="button"
              @click="nextStep"
              :disabled="!canProceed"
              class="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              Continue
            </button>
            <button
              v-else
              type="button"
              @click="handleSubmit"
              :disabled="submitting"
              class="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : (editingMember ? 'Update Member' : 'Create Member') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Modal -->
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
            :options="statusUpdateOptions"
            option-label="label"
            option-value="value"
            placeholder="Select status"
          />
        </div>
        <div class="flex gap-3 pt-6">
          <button @click="closeStatusModal" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg">Cancel</button>
          <button @click="handleUpdateStatus" class="flex-1 bg-black text-white px-4 py-2 rounded-lg">Update</button>
        </div>
      </div>
    </div>
  </div>
  <TeamMemberViewModal :show="showViewModal" :member="viewMember" @close="closeViewModal" />
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import TeamMemberViewModal from '@/components/team/TeamMemberViewModal.vue'
import type { Commission, CreateTeamMemberDto, TeamMember, TeamMemberQuery, TeamStats, WorkingHours } from '~/types/team'
import { useFetchTeamMembers } from '@/composables/modules/team/useFetchTeamMembers'
import { useCreateTeamMember } from '@/composables/modules/team/useCreateTeamMember'
import { useUpdateTeamMember } from '@/composables/modules/team/useUpdateTeamMember'
import { useUpdateTeamStatus } from '@/composables/modules/team/useUpdateTeamStatus'
import { useDeleteTeamMember } from '@/composables/modules/team/useDeleteTeamMember'
import { useTeamStats } from '@/composables/modules/team/useTeamStats'
import { useService } from '@/composables/modules/useService'
import type { Service } from '~/types/service'

definePageMeta({
  layout: 'dashboard'
})

const { data: teamMembers, execute: fetchTeamMembers } = useFetchTeamMembers()
const { execute: createTeamMember } = useCreateTeamMember()
const { execute: updateTeamMember } = useUpdateTeamMember()
const { execute: updateTeamStatus } = useUpdateTeamStatus()
const { execute: deleteTeamMember } = useDeleteTeamMember()
const { data: stats, execute: fetchStats } = useTeamStats()
const { services, loading: servicesLoading, fetchServices } = useService()

// Step Form State
const currentStep = ref(1)
const totalSteps = 5
const submitting = ref(false)

const showViewModal = ref(false)
const viewMember = ref<TeamMember | null>(null)

function openViewModal(member: TeamMember) {
  viewMember.value = member
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  viewMember.value = null
}

// Options
const roleFilterOptions = [
  { label: 'All Roles', value: '' },
  { label: 'Stylist', value: 'stylist' },
  { label: 'Manager', value: 'manager' },
  { label: 'Admin', value: 'admin' },
  { label: 'Therapist', value: 'therapist' },
  { label: 'Receptionist', value: 'receptionist' }
]

const statusFilterOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const roleOptions = [
  { label: 'Stylist', value: 'stylist' },
  { label: 'Manager', value: 'manager' },
  { label: 'Admin', value: 'admin' },
  { label: 'Therapist', value: 'therapist' },
  { label: 'Receptionist', value: 'receptionist' },
  { label: 'Cleaner', value: 'cleaner' }
]

const employmentTypeOptions = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Freelance', value: 'freelance' }
]

const experienceLevelOptions = [
  { label: 'Junior', value: 'Junior' },
  { label: 'Mid-Level', value: 'Mid-Level' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Expert', value: 'Expert' }
]

const canBookOnlineOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]

const isActiveOptions = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
]

const commissionTypeOptions = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed Amount', value: 'fixed' }
]

const statusUpdateOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Filters
const filters = reactive<TeamMemberQuery>({
  page: 1,
  limit: 10,
  search: '',
  role: undefined,
  status: undefined,
  department: ''
})

// Modal State
const showMemberModal = ref(false)
const showStatusModal = ref(false)
const editingMember = ref<TeamMember | null>(null)
const statusUpdate = ref('active')
const statusTarget = ref<TeamMember | null>(null)

// Form State
const memberForm = reactive<CreateTeamMemberDto & {
  emergencyContact: { name: string; relationship: string; phone: string };
  skills: { services: string[]; specializations: string[]; experienceLevel: string };
  commissions: Commission[];
  workingHours: WorkingHours[];
}>({
  firstName: '',
  lastName: '',
  email: '',
  phone: { countryCode: '+234', number: '' },
  role: 'stylist',
  employmentType: 'full_time',
  department: '',
  hireDate: '',
  salary: undefined,
  workingHours: daysOfWeek.map(day => ({
    day,
    startTime: '09:00',
    endTime: '17:00',
    isWorking: false
  })),
  skills: { services: [], specializations: [], experienceLevel: '' },
  commissions: [],
  profileImage: '',
  bio: '',
  isActive: true,
  canBookOnline: true,
  emergencyContact: { name: '', relationship: '', phone: '' }
})

// Skills State
const selectedServices = ref<string[]>([])
const specializations = ref<string[]>([])
const newSpecialization = ref('')

// Commission Draft
const commissionDraft = reactive<Commission>({
  serviceId: '',
  serviceName: '',
  commissionType: 'percentage',
  commissionValue: 0
})

// String refs for boolean select inputs
const isActiveString = computed({
  get: () => memberForm.isActive ? 'true' : 'false',
  set: (val: string) => { memberForm.isActive = val === 'true' }
})

const canBookOnlineString = computed({
  get: () => memberForm.canBookOnline ? 'true' : 'false',
  set: (val: string) => { memberForm.canBookOnline = val === 'true' }
})

// Computed
const departmentCount = computed(() => {
  const departments = new Set(teamMembers.value.map((member: TeamMember) => member.department).filter(Boolean))
  return departments.size
})

const workingDaysCount = computed(() => {
  return memberForm.workingHours.filter((h: WorkingHours) => h.isWorking).length
})

const canAddCommission = computed(() => {
  return commissionDraft.serviceId && commissionDraft.commissionValue > 0
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return memberForm.firstName && memberForm.lastName && memberForm.email && memberForm.phone.number
  }
  return true
})

// Helper functions for service display
const getServiceName = (service: Service): string => {
  return service.basicDetails?.serviceName || (service as any).name || 'Unnamed Service'
}

const getServiceCategory = (service: Service): string => {
  return service.basicDetails?.category.categoryName || ''
}

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const applyWeekdayHours = () => {
  memberForm.workingHours.forEach((h: WorkingHours) => {
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(h.day)) {
      h.isWorking = true
      h.startTime = '09:00'
      h.endTime = '17:00'
    } else {
      h.isWorking = false
    }
  })
}

const clearAllHours = () => {
  memberForm.workingHours.forEach((h: WorkingHours) => {
    h.isWorking = false
    h.startTime = '09:00'
    h.endTime = '17:00'
  })
}

const addSpecialization = () => {
  if (newSpecialization.value.trim()) {
    specializations.value.push(newSpecialization.value.trim())
    newSpecialization.value = ''
  }
}

const removeSpecialization = (index: number) => {
  specializations.value.splice(index, 1)
}

const onCommissionServiceChange = () => {
  const service = services.value.find((s: Service) => s._id === commissionDraft.serviceId)
  if (service) {
    commissionDraft.serviceName = getServiceName(service)
  }
}

const addCommission = () => {
  if (!canAddCommission.value) return
  
  // Check if already exists
  const exists = memberForm.commissions.some((c: Commission) => c.serviceId === commissionDraft.serviceId)
  if (exists) {
    alert('Commission for this service already added')
    return
  }

  memberForm.commissions.push({ ...commissionDraft })
  commissionDraft.serviceId = ''
  commissionDraft.serviceName = ''
  commissionDraft.commissionType = 'percentage'
  commissionDraft.commissionValue = 0
}

const removeCommission = (index: number) => {
  memberForm.commissions.splice(index, 1)
}

const openCreateModal = () => {
  editingMember.value = null
  resetForm()
  currentStep.value = 1
  showMemberModal.value = true
}

const openEditModal = (member: TeamMember) => {
  editingMember.value = member
  currentStep.value = 1
  
  // Populate form
  Object.assign(memberForm, {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone || { countryCode: '+234', number: '' },
    role: member.role,
    employmentType: member.employmentType,
    department: member.department || '',
    hireDate: member.hireDate ? member.hireDate.split('T')[0] : '',
    salary: member.salary,
    workingHours: member.workingHours?.length ? member.workingHours : daysOfWeek.map(day => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      isWorking: false
    })),
    skills: member.skills || { services: [], specializations: [], experienceLevel: '' },
    commissions: member.commissions || [],
    profileImage: member.profileImage || '',
    bio: member.bio || '',
    isActive: member.isActive ?? true,
    canBookOnline: member.canBookOnline ?? true,
    emergencyContact: member.emergencyContact || { name: '', relationship: '', phone: '' }
  })
  
  selectedServices.value = member.skills?.services || []
  specializations.value = member.skills?.specializations || []
  
  showMemberModal.value = true
}

const closeMemberModal = () => {
  showMemberModal.value = false
  currentStep.value = 1
}

const openStatusModal = (member: TeamMember) => {
  statusTarget.value = member
  statusUpdate.value = member.isActive ? 'active' : 'inactive'
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  statusTarget.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  
  try {
    // Build final payload
    memberForm.skills.services = selectedServices.value
    memberForm.skills.specializations = specializations.value
    
    // Filter out non-working days or keep all for backend to handle
    const workingHoursFiltered = memberForm.workingHours.filter((h: WorkingHours) => h.isWorking)
    
    // Destructure to exclude department which is not accepted by the API
    const { department, ...formWithoutDepartment } = memberForm
    
    const payload = {
      ...formWithoutDepartment,
      workingHours: workingHoursFiltered,
      hireDate: memberForm.hireDate ? new Date(memberForm.hireDate).toISOString() : undefined
    }

    if (editingMember.value) {
      await updateTeamMember(editingMember.value._id, payload)
    } else {
      await createTeamMember(payload)
    }

    showMemberModal.value = false
    currentStep.value = 1
    await fetchTeamMembers({ ...filters })
    await fetchStats()
  } catch (error) {
    console.error('Error saving team member:', error)
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Delete this team member?')) return
  await deleteTeamMember(id)
  await fetchTeamMembers({ ...filters })
  await fetchStats()
}

const handleUpdateStatus = async () => {
  if (!statusTarget.value) return
  await updateTeamStatus(statusTarget.value._id, statusUpdate.value)
  closeStatusModal()
  await fetchTeamMembers({ ...filters })
  await fetchStats()
}

const applyFilters = async () => {
  await fetchTeamMembers({ ...filters })
}

const resetForm = () => {
  Object.assign(memberForm, {
    firstName: '',
    lastName: '',
    email: '',
    phone: { countryCode: '+234', number: '' },
    role: 'stylist',
    employmentType: 'full_time',
    department: '',
    hireDate: '',
    salary: undefined,
    workingHours: daysOfWeek.map(day => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      isWorking: false
    })),
    skills: { services: [], specializations: [], experienceLevel: '' },
    commissions: [],
    profileImage: '',
    bio: '',
    isActive: true,
    canBookOnline: true,
    emergencyContact: { name: '', relationship: '', phone: '' }
  })
  selectedServices.value = []
  specializations.value = []
  newSpecialization.value = ''
  commissionDraft.serviceId = ''
  commissionDraft.serviceName = ''
  commissionDraft.commissionType = 'percentage'
  commissionDraft.commissionValue = 0
}

onMounted(async () => {
  await Promise.all([
    fetchTeamMembers(filters),
    fetchStats(),
    fetchServices()
  ])
})
</script>
