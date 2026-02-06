<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/dashboard/clients" class="text-gray-500 hover:text-black mb-4 inline-block font-medium">← Back to Clients</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Add New Client</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Personal Info -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.profile.firstName" type="text" label="First Name" placeholder="Enter first name" />
          <UiAnimatedInput v-model="form.profile.lastName" type="text" label="Last Name" placeholder="Enter last name" />
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.profile.email" type="email" label="Email" placeholder="Enter email address" />
          <UiAnimatedInput v-model="form.profile.phone.number" type="tel" label="Phone" placeholder="Enter phone number" />
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.profile.additionalEmail" type="email" label="Additional Email" placeholder="Enter additional email" />
          <UiAnimatedInput v-model="form.profile.additionalPhone.number" type="tel" label="Additional Phone" placeholder="Enter additional phone" />
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.profile.birthday.dayAndMonth" type="text" label="Birthday (MM-DD)" placeholder="01-15" />
          <UiAnimatedInput v-model="form.profile.birthday.year" type="text" label="Birth Year" placeholder="1990" />
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.profile.gender" type="text" label="Gender" placeholder="Enter gender" />
          <UiAnimatedInput v-model="form.profile.pronouns" type="text" label="Pronouns" placeholder="Enter pronouns" />
        </div>
      </section>

      <!-- Additional Info -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Additional Details</h2>
        <div class="grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.additionalInfo.occupation" type="text" label="Occupation" placeholder="Enter occupation" />
          <UiAnimatedInput v-model="form.additionalInfo.preferredLanguage" type="text" label="Preferred Language" placeholder="Enter preferred language" />
        </div>
        
        <div class="mt-4">
          <UiSelectInput 
            v-model="form.additionalInfo.clientSource" 
            label="Client Source" 
            :options="clientSourceOptions" 
            placeholder="Select client source" 
          />
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.additionalInfo.country" type="text" label="Country" placeholder="Enter country" />
          <UiAnimatedInput v-model="form.additionalInfo.referredBy.clientId" type="text" label="Referred By (Client ID)" placeholder="Enter client ID" />
        </div>
        <div class="mt-4">
          <UiAnimatedInput v-model="form.additionalInfo.referredBy.clientName" type="text" label="Referred By (Client Name)" placeholder="Enter client name" />
        </div>
      </section>

      <!-- Address -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Address</h2>
        <div class="grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.address.street" type="text" label="Street" placeholder="Enter street address" />
          <UiAnimatedInput v-model="form.address.city" type="text" label="City" placeholder="Enter city" />
          <UiAnimatedInput v-model="form.address.state" type="text" label="State" placeholder="Enter state" />
          <UiAnimatedInput v-model="form.address.country" type="text" label="Country" placeholder="Enter country" />
          <UiAnimatedInput v-model="form.address.zipCode" type="text" label="Zip Code" placeholder="Enter zip code" />
        </div>
      </section>

      <!-- Emergency Contacts -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Emergency Contacts</h2>
        <div class="grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.emergencyContacts.primary.fullName" type="text" label="Primary Contact Name" placeholder="Enter contact name" />
          <UiAnimatedInput v-model="form.emergencyContacts.primary.relationship" type="text" label="Primary Relationship" placeholder="Enter relationship" />
          <UiAnimatedInput v-model="form.emergencyContacts.primary.email" type="email" label="Primary Email" placeholder="Enter email" />
          <UiAnimatedInput v-model="form.emergencyContacts.primary.phone.number" type="tel" label="Primary Phone" placeholder="Enter phone number" />
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.emergencyContacts.secondary.fullName" type="text" label="Secondary Contact Name" placeholder="Enter contact name" />
          <UiAnimatedInput v-model="form.emergencyContacts.secondary.relationship" type="text" label="Secondary Relationship" placeholder="Enter relationship" />
          <UiAnimatedInput v-model="form.emergencyContacts.secondary.email" type="email" label="Secondary Email" placeholder="Enter email" />
          <UiAnimatedInput v-model="form.emergencyContacts.secondary.phone.number" type="tel" label="Secondary Phone" placeholder="Enter phone number" />
        </div>
      </section>

      <!-- Settings -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Notifications & Settings</h2>
        <div class="space-y-3">
          <label class="flex items-center gap-3 text-sm text-gray-700">
            <input v-model="form.settings.appointmentNotifications.emailNotifications" type="checkbox" class="custom-checkbox" />
            Email appointment notifications
          </label>
          <label class="flex items-center gap-3 text-sm text-gray-700">
            <input v-model="form.settings.marketingNotifications.clientAcceptsEmailMarketing" type="checkbox" class="custom-checkbox" />
            Accept marketing emails
          </label>
          <label class="flex items-center gap-3 text-sm text-gray-700">
            <input v-model="form.settings.grokCodeFast1Enabled" type="checkbox" class="custom-checkbox" />
            Enable Grok Code Fast 1
          </label>
        </div>
      </section>

      <div class="flex justify-end gap-4 pt-4">
        <NuxtLink to="/dashboard/clients" class="px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-70">
          {{ loading ? 'Creating...' : 'Create Client' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CreateClientDto } from '~/types/client'
import { useCreateClient } from "@/composables/modules/client/useCreateClient"


definePageMeta({
  layout: 'dashboard'
})

const { execute: createClient, loading } = useCreateClient()
const router = useRouter()

const clientSourceOptions = [
  { label: 'Walk-In', value: 'Walk-In' },
  { label: 'Referral', value: 'Referral' },
  { label: 'Social Media', value: 'Social Media' },
  { label: 'Website', value: 'Website' }
]

const form = reactive<CreateClientDto>({
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    phone: {
      countryCode: '+234',
      number: ''
    },
    birthday: {
      dayAndMonth: '',
      year: ''
    },
    gender: '',
    pronouns: '',
    additionalEmail: '',
    additionalPhone: {
      countryCode: '+234',
      number: ''
    }
  },
  additionalInfo: {
    occupation: '',
    preferredLanguage: 'English',
    clientSource: 'Walk-In',
    country: '',
    referredBy: {
      clientId: '',
      clientName: ''
    }
  },
  address: {
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  },
  emergencyContacts: {
    primary: {
      fullName: '',
      relationship: '',
      email: '',
      phone: {
        countryCode: '+234',
        number: ''
      }
    },
    secondary: {
      fullName: '',
      relationship: '',
      email: '',
      phone: {
        countryCode: '+234',
        number: ''
      }
    }
  },
  settings: {
    appointmentNotifications: {
      emailNotifications: true
    },
    marketingNotifications: {
      clientAcceptsEmailMarketing: false
    },
    grokCodeFast1Enabled: true
  }
})

const handleSubmit = async () => {
  try {
    await createClient(form)
    router.push('/dashboard/clients')
  } catch (e: any) {
    alert(e.message || 'Failed to create client')
  }
}
</script>
