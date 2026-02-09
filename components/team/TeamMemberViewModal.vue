<template>
  <teleport to="body">
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Team Member Details</h2>
            <p class="text-sm text-gray-500 mt-1">View all information for this team member.</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-4">
            <img v-if="member?.profileImage" :src="member.profileImage" alt="Profile" class="w-16 h-16 rounded-full object-cover border border-gray-200" />
            <div>
              <div class="text-lg font-bold text-gray-900">{{ member?.firstName }} {{ member?.lastName }}</div>
              <div class="text-xs text-gray-500">{{ member?.email }}</div>
              <div class="text-xs text-gray-400 mt-1" v-if="member?.phone">{{ member.phone.countryCode }} {{ member.phone.number }}</div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="font-semibold text-gray-700">Role</div>
              <div class="capitalize">{{ member?.role }}</div>
              <div v-if="member?.skills?.experienceLevel" class="text-xs text-gray-400">{{ member.skills.experienceLevel }}</div>
              <div v-if="member?.skills?.specializations?.length" class="flex flex-wrap gap-1 mt-1">
                <span v-for="(spec, i) in member.skills.specializations" :key="i" class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{{ spec }}</span>
              </div>
            </div>
            <div>
              <div class="font-semibold text-gray-700">Department</div>
              <div>{{ member?.department || '—' }}</div>
            </div>
            <div>
              <div class="font-semibold text-gray-700">Status</div>
              <span class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                :class="member?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                {{ member?.isActive ? 'active' : 'inactive' }}
              </span>
              <div v-if="member?.canBookOnline === false" class="text-xs text-red-500 mt-1">Cannot book online</div>
            </div>
            <div>
              <div class="font-semibold text-gray-700">Employment</div>
              <div class="capitalize">{{ member?.employmentType?.replace('_', ' ') }}</div>
              <div v-if="member?.hireDate" class="text-xs text-gray-400">Hired: {{ member.hireDate }}</div>
              <div v-if="member?.salary" class="text-xs text-gray-400">₦{{ member.salary.toLocaleString() }}</div>
            </div>
            <div v-if="member?.workingHours && member.workingHours.length">
              <div class="font-semibold text-gray-700">Working Days</div>
              <div class="flex flex-wrap gap-1">
                <span v-for="(wh, i) in member.workingHours.filter(h => h.isWorking)" :key="i" class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{{ wh.day }} ({{ wh.startTime }}-{{ wh.endTime }})</span>
              </div>
            </div>
            <div v-if="member?.skills?.services?.length">
              <div class="font-semibold text-gray-700 mb-1">Services</div>
              <div class="flex flex-wrap gap-2">
                <span v-for="(service, i) in member.skills.services" :key="i" class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {{ getServiceName(service) }}
                </span>
              </div>
            </div>
            <div v-if="member?.commissions?.length">
              <div class="font-semibold text-gray-700">Commissions</div>
              <ul class="list-disc ml-4 text-xs text-gray-700">
                <li v-for="(c, i) in member.commissions" :key="i">
                  {{ c.serviceName }}: <span v-if="c.commissionType === 'percentage'">{{ c.commissionValue }}%</span><span v-else>₦{{ c.commissionValue }}</span>
                </li>
              </ul>
            </div>
            <div v-if="member?.bio">
              <div class="font-semibold text-gray-700">Bio</div>
              <div class="text-xs text-gray-600">{{ member.bio }}</div>
            </div>
            <div v-if="member?.emergencyContact">
              <div class="font-semibold text-gray-700">Emergency Contact</div>
              <div class="text-xs text-gray-600">{{ member.emergencyContact.name }} ({{ member.emergencyContact.relationship }}) - {{ member.emergencyContact.phone }}</div>
            </div>
            <div v-if="member?.createdAt">
              <div class="font-semibold text-gray-700">Created</div>
              <div class="text-xs text-gray-400">{{ new Date(member.createdAt).toLocaleString() }}</div>
            </div>
            <div v-if="member?.updatedAt">
              <div class="font-semibold text-gray-700">Updated</div>
              <div class="text-xs text-gray-400">{{ new Date(member.updatedAt).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { TeamMember } from '~/types/team'
import { computed } from 'vue'
import { useService } from '@/composables/modules/useService'

defineProps<{
  show: boolean
  member: TeamMember | null
}>()

defineEmits(['close'])

const { services } = useService()

function getServiceName(service) {
  // If service is an object with basicDetails, show its name
  if (service && typeof service === 'object' && service.basicDetails) {
    return service.basicDetails.serviceName
  }
  // If service is an ID, look up in global services
  if (typeof service === 'string') {
    const found = services.value?.find(s => s._id === service)
    return found && found.basicDetails ? found.basicDetails.serviceName : service
  }
  return 'Unknown Service'
}
</script>
