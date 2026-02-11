<template>
  <div class="p-8 max-wo">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="text-gray-500 mt-1">Manage your business configuration and preferences.</p>
    </div>

    <div class="flex gap-8">
      <div class="w-64 flex-shrink-0">
        <nav class="space-y-4">
          <div v-for="group in tabGroups" :key="group.id" class="space-y-1">
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-400 px-4">
              {{ group.label }}
            </div>
            <button
              v-for="tab in group.tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="activeTab === tab.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              {{ tab.label }}
            </button>
          </div>
        </nav>
      </div>

      <div class="flex-1">
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>

        <div v-else class="bg-white rounded-xl border-[0.5px] border-gray-50 shadow-sm p-8">
          <!-- Business Info -->
          <div v-if="activeTab === 'business'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Business Information</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UiAnimatedInput v-model="form.settings.businessName" type="text" label="Business Name"  />
              <UiAnimatedInput v-model="form.settings.businessEmail" type="email" label="Business Email"  />
              <UiAnimatedInput v-model="form.settings.businessPhone.countryCode" type="text" label="Phone Country Code" />
              <UiAnimatedInput v-model="form.settings.businessPhone.number" type="text" label="Phone Number" />
              <UiAnimatedInput v-model="form.settings.businessAddress.street" type="text" label="Street" />
              <UiAnimatedInput v-model="form.settings.businessAddress.city" type="text" label="City" />
              <UiAnimatedInput v-model="form.settings.businessAddress.region" type="text" label="Region" />
              <UiAnimatedInput v-model="form.settings.businessAddress.postcode" type="text" label="Postcode" />
              <UiAnimatedInput v-model="form.settings.businessAddress.country" type="text" label="Country" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UiSelectInput v-model="form.settings.defaultCurrency" label="Default Currency" :options="currencyOptions" option-label="label" option-value="value" placeholder="Select currency" />
              <UiSelectInput v-model="form.settings.timezone" label="Timezone" :options="timezoneOptions" option-label="label" option-value="value" placeholder="Select timezone" />
            </div>

            <div class="pt-4">
              <button @click="saveGeneral" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Changes</button>
            </div>
          </div>

          <!-- Business Hours -->
          <div v-if="activeTab === 'hours'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Business Hours</h2>

            <div class="space-y-3">
              <div v-for="(hour, index) in form.businessHours" :key="`${hour.day}-${index}`" class="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div class="font-medium text-gray-700">{{ hour.day }}</div>
                <label class="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" v-model="hour.isOpen" class="custom-checkbox" /> Open
                </label>
                <UiAnimatedInput v-model="hour.startTime" type="time" label="Start Time" placeholder="Start time" :disabled="!hour.isOpen" />
                <UiAnimatedInput v-model="hour.endTime" type="time" label="End Time" placeholder="End time" :disabled="!hour.isOpen" />
              </div>
            </div>

            <div class="pt-4">
              <button @click="saveBusinessHours" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Update Hours</button>
            </div>
          </div>

          <!-- Appointment Settings -->
          <div v-if="activeTab === 'appointments'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Appointment Settings</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UiAnimatedInput v-model.number="form.appointmentSettings.defaultAppointmentDuration" type="number" label="Default Appointment Duration (mins)" />
              <UiAnimatedInput v-model.number="form.appointmentSettings.bookingWindowHours" type="number" label="Booking Window (hours)" />
              <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input v-model="form.appointmentSettings.allowOnlineBooking" type="checkbox" class="custom-checkbox" />
                Allow online booking
              </label>
              <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input v-model="form.appointmentSettings.requireClientConfirmation" type="checkbox" class="custom-checkbox" />
                Require client confirmation
              </label>
            </div>

            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Appointment Statuses</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <UiAnimatedInput v-model="appointmentStatusDraft.statusName" type="text" label="Status Name" />
                  <UiAnimatedInput v-model="appointmentStatusDraft.statusIcon" type="text" label="Icon" />
                  <UiAnimatedInput v-model="appointmentStatusDraft.statusColor" type="text" label="Color" />
                  <UiAnimatedInput v-model.number="appointmentStatusDraft.characterLimit" type="number" label="Limit" />
                  <button type="button" @click="addAppointmentStatus" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
                </div>
                <div v-if="form.appointmentSettings.appointmentStatuses.length" class="mt-3 space-y-2">
                  <div v-for="(status, index) in form.appointmentSettings.appointmentStatuses" :key="`${status.statusName}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div class="text-sm text-gray-700">{{ status.statusName }} • {{ status.statusColor }}</div>
                    <button type="button" @click="removeAppointmentStatus(index)" class="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Cancellation Reasons</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UiAnimatedInput v-model="cancellationReasonDraft.name" type="text" label="Reason" />
                  <UiSelectInput v-model="cancellationReasonDraft.reasonType" label="Reason Type" :options="cancellationReasonTypeOptions" option-label="label" option-value="value" />
                  <button type="button" @click="addCancellationReason" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
                </div>
                <div v-if="form.appointmentSettings.cancellationReasons.length" class="mt-3 space-y-2">
                  <div v-for="(reason, index) in form.appointmentSettings.cancellationReasons" :key="`${reason.name}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div class="text-sm text-gray-700">{{ reason.name }} • {{ reason.reasonType }}</div>
                    <button type="button" @click="removeCancellationReason(index)" class="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              </div>

            </div>

            <div class="pt-4">
              <button @click="saveAppointments" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Appointment Settings</button>
            </div>
          </div>

          <!-- Resources & Blocked Time -->
          <div v-if="activeTab === 'resources'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Resources & Blocked Time</h2>

            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Resources</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <UiAnimatedInput v-model="resourceDraft.name" type="text" label="Resource Name" />
                  <UiAnimatedInput v-model="resourceDraft.description" type="text" label="Description" />
                  <button type="button" @click="addResource" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
                </div>
                <div class="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <input v-model="resourceDraft.isActive" type="checkbox" class="custom-checkbox" /> Active
                </div>
                <div v-if="form.settings.resources.length" class="mt-3 space-y-2">
                  <div v-for="(resource, index) in form.settings.resources" :key="`${resource.name}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div class="text-sm text-gray-700">{{ resource.name }} • {{ resource.description }}</div>
                    <button type="button" @click="removeResource(index)" class="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Blocked Time Types</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <UiAnimatedInput v-model="blockedTimeDraft.type" type="text" label="Type" />
                  <UiAnimatedInput v-model="blockedTimeDraft.typeIcon" type="text" label="Icon" />
                  <UiAnimatedInput v-model="blockedTimeDraft.duration" type="text" label="Duration" />
                  <UiSelectInput v-model="blockedTimeDraft.compensation" label="Compensation" :options="compensationOptions" option-label="label" option-value="value" />
                </div>
                <div class="flex items-center gap-3 mt-2">
                  <label class="flex items-center gap-2 text-sm text-gray-600">
                    <input v-model="blockedTimeDraft.isActive" type="checkbox" class="custom-checkbox" /> Active
                  </label>
                  <button type="button" @click="addBlockedTimeType" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
                </div>
                <div v-if="form.settings.blockedTimeTypes.length" class="mt-3 space-y-2">
                  <div v-for="(blocked, index) in form.settings.blockedTimeTypes" :key="`${blocked.type}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div class="text-sm text-gray-700">{{ blocked.type }} • {{ blocked.duration }} • {{ blocked.compensation }}</div>
                    <button type="button" @click="removeBlockedTimeType(index)" class="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button @click="saveResourcesAndBlockedTimes" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Resources</button>
            </div>
          </div>

          <!-- Closed Periods -->
          <div v-if="activeTab === 'closures'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Closed Periods</h2>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <UiAnimatedInput v-model="closedPeriodDraft.startDate" type="date" label="Start Date" />
              <UiAnimatedInput v-model="closedPeriodDraft.endDate" type="date" label="End Date" />
              <UiAnimatedInput v-model="closedPeriodDraft.description" type="text" label="Description" />
              <button type="button" @click="addClosedPeriod" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
            </div>
            <div class="flex gap-6 mt-3">
              <label class="flex items-center gap-2 text-sm text-gray-600">
                <input v-model="closedPeriodDraft.businessClosed" type="checkbox" class="custom-checkbox" /> Business closed
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-600">
                <input v-model="closedPeriodDraft.onlineBookingBlocked" type="checkbox" class="custom-checkbox" /> Block online booking
              </label>
            </div>
            <div v-if="form.settings.closedPeriods.length" class="mt-4 space-y-2">
              <div v-for="(period, index) in form.settings.closedPeriods" :key="`${period.startDate}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <div class="text-sm text-gray-700">{{ period.startDate }} → {{ period.endDate }} • {{ period.description }}</div>
                <button type="button" @click="removeClosedPeriod(index)" class="text-red-600 text-sm">Remove</button>
              </div>
            </div>
            <div class="pt-4">
              <button @click="saveClosedPeriods" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Closed Periods</button>
            </div>
          </div>

          <!-- Payments -->
          <div v-if="activeTab === 'payments'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Payment Settings</h2>

            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Payment Methods</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <UiAnimatedInput v-model="paymentMethodDraft.name" type="text" label="Method Name" />
                  <UiSelectInput v-model="paymentMethodDraft.paymentType" label="Payment Type" :options="paymentTypeOptions" option-label="label" option-value="value" />
                  <label class="flex items-center gap-2 text-sm text-gray-600">
                    <input v-model="paymentMethodDraft.enabled" type="checkbox" class="custom-checkbox" /> Enabled
                  </label>
                  <button type="button" @click="addPaymentMethod" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
                </div>
                <div v-if="form.paymentSettings.paymentMethods.length" class="mt-3 space-y-2">
                  <div v-for="(method, index) in form.paymentSettings.paymentMethods" :key="`${method.name}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div class="text-sm text-gray-700">{{ method.name }} • {{ method.paymentType }}</div>
                    <button type="button" @click="removePaymentMethod(index)" class="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Taxes</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <UiAnimatedInput v-model="taxDraft.taxName" type="text" label="Tax Name" />
                  <UiAnimatedInput v-model.number="taxDraft.taxRate" type="number" label="Tax Rate" />
                  <button type="button" @click="addTax" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
                </div>
                <div v-if="form.paymentSettings.taxes.length" class="mt-3 space-y-2">
                  <div v-for="(tax, index) in form.paymentSettings.taxes" :key="`${tax.taxName}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div class="text-sm text-gray-700">{{ tax.taxName }} • {{ tax.taxRate }}%</div>
                    <button type="button" @click="removeTax(index)" class="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              </div>

            </div>

            <div class="pt-4">
              <button @click="savePayments" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Payment Settings</button>
            </div>
          </div>

          <!-- Service Charges -->
          <div v-if="activeTab === 'charges'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Service Charges</h2>

            <div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <UiAnimatedInput v-model="serviceChargeDraft.basicInfo.name" type="text" label="Charge Name" />
                <UiAnimatedInput v-model="serviceChargeDraft.basicInfo.description" type="text" label="Description" />
                <UiSelectInput v-model="serviceChargeDraft.rateType.type" label="Rate Type" :options="rateTypeOptions" option-label="label" option-value="value" />
                <UiAnimatedInput v-model.number="serviceChargeDraft.rateType.percentage" type="number" label="Percentage" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                <UiAnimatedInput v-model="serviceChargeDraft.settings.applyServiceChargeOn" type="text" label="Apply On" />
                <label class="flex items-center gap-2 text-sm text-gray-600">
                  <input v-model="serviceChargeDraft.settings.automaticallyApplyDuringCheckout" type="checkbox" class="custom-checkbox" /> Auto apply
                </label>
                <UiAnimatedInput v-model="serviceChargeDraft.taxRate.tax" type="text" label="Tax" />
                <UiAnimatedInput v-model.number="serviceChargeDraft.taxRate.rate" type="number" label="Tax Rate" />
              </div>
              <div class="flex items-center gap-3 mt-2">
                <label class="flex items-center gap-2 text-sm text-gray-600">
                  <input v-model="serviceChargeDraft.isActive" type="checkbox" class="custom-checkbox" /> Active
                </label>
                <button type="button" @click="addServiceCharge" class="bg-gray-900 text-white px-4 py-2 rounded-lg">Add</button>
              </div>
              <div v-if="form.paymentSettings.serviceCharges.length" class="mt-3 space-y-2">
                <div v-for="(charge, index) in form.paymentSettings.serviceCharges" :key="`${charge.basicInfo.name}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <div class="text-sm text-gray-700">{{ charge.basicInfo.name }} • {{ charge.rateType.type }} • {{ charge.taxRate.tax }}</div>
                  <button type="button" @click="removeServiceCharge(index)" class="text-red-600 text-sm">Remove</button>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button @click="saveServiceCharges" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Service Charges</button>
            </div>
          </div>

          <!-- Branding -->
          <div v-if="activeTab === 'branding'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Brand Appearance</h2>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div class="flex gap-2">
                   <input type="color" v-model="form.theme.primaryColor" class="h-10 w-10 rounded border border-gray-200 cursor-pointer p-1" />
                   <UiAnimatedInput v-model="form.theme.primaryColor" type="text" label="Color Code" />
                </div>
              </div>
              <UiSelectInput v-model="form.theme.fontFamily" label="Font Family" :options="fontFamilyOptions" option-label="label" option-value="value" />
            </div>

            <div class="pt-4">
              <button @click="saveBranding" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Update Branding</button>
            </div>
          </div>

          <!-- Notifications -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Notification Preferences</h2>

            <div class="space-y-4">
               <div v-for="(prefs, key) in form.preferences" :key="key" class="flex items-center justify-between py-2">
                 <div class="capitalize font-medium text-gray-700">{{ key.replace(/_/g, ' ') }}</div>
                 <div class="flex gap-4">
                   <label class="flex items-center gap-2 text-sm text-gray-600">
                     <input type="checkbox" v-model="prefs.email" class="custom-checkbox" /> Email
                   </label>
                   <label class="flex items-center gap-2 text-sm text-gray-600">
                     <input type="checkbox" v-model="prefs.sms" class="custom-checkbox" /> SMS
                   </label>
                 </div>
               </div>
            </div>

            <div class="pt-4">
              <button @click="saveNotifications" class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Save Preferences</button>
            </div>
          </div>

          <!-- Domains -->
          <div v-if="activeTab === 'domains'" class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Custom Domains</h2>

            <div class="flex gap-4 mb-6">
               <UiAnimatedInput v-model="newDomain" type="text" label="Domain"   class="flex-1" />
               <button @click="addDomain" class="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800">Connect Domain</button>
            </div>

            <div v-if="mapDomains.length > 0" class="space-y-3">
               <div v-for="d in mapDomains" :key="d.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div class="font-medium text-gray-900">{{ d.domain }}</div>
                    <div v-if="d.subdomain" class="text-xs text-gray-500">{{ d.subdomain }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                      :class="d.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                    >
                      {{ d.status }}
                    </span>
                    <span
                      v-if="d.sslStatus && d.sslStatus !== 'unknown'"
                      class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                      :class="d.sslStatus === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                    >
                      SSL: {{ d.sslStatus }}
                    </span>
                  </div>
               </div>
            </div>
            <div v-else class="text-center text-gray-500 py-4">No custom domains connected</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  AppointmentStatus,
  BlockedTimeType,
  BusinessHours,
  BusinessSettings,
  CancellationReason,
  ClosedPeriod,
  NotificationPreferences,
  PaymentMethod,
  Resource,
  ServiceCharge,
  Tax
} from '~/types/settings'
import { useSettings } from '@/composables/modules/useSettings'

definePageMeta({
  layout: 'dashboard'
})

// ==================== OPTIONS ====================
const currencyOptions = [
  { label: 'Nigerian Naira (NGN)', value: 'NGN' },
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'Euro (EUR)', value: 'EUR' }
]

const timezoneOptions = [
  { label: 'Africa/Lagos (WAT)', value: 'Africa/Lagos' },
  { label: 'UTC', value: 'UTC' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'America/New_York', value: 'America/New_York' }
]

const cancellationReasonTypeOptions = [
  { label: 'Client initiated', value: 'client_initiated' },
  { label: 'Business initiated', value: 'business_initiated' },
  { label: 'External factors', value: 'external_factors' }
]

const compensationOptions = [
  { label: 'Paid', value: 'Paid' },
  { label: 'Unpaid', value: 'Unpaid' }
]

const paymentTypeOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Credit card', value: 'credit_card' },
  { label: 'Debit card', value: 'debit_card' },
  { label: 'Bank transfer', value: 'bank_transfer' },
  { label: 'Digital wallet', value: 'digital_wallet' }
]

const rateTypeOptions = [
  { label: 'Flat rate', value: 'Flat rate' },
  { label: 'Percentage', value: 'Percentage' },
  { label: 'Both', value: 'Both' }
]

const fontFamilyOptions = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' }
]

// ==================== COMPOSABLE ====================
const {
  fetchSettings,
  updateSettings,
  fetchBusinessHours,
  updateBusinessHours,
  fetchAppointmentSettings,
  updateAppointmentSettings,
  fetchPaymentSettings,
  fetchTheme,
  updateTheme,
  fetchNotificationPreferences,
  updateNotificationPreferences,
  fetchDomains,
  requestDomain,
  settings,
  businessHours,
  appointmentSettings,
  paymentSettings,
  theme,
  preferences,
  domains,
  loading
} = useSettings()

// ==================== STATE ====================
const activeTab = ref('business')
const newDomain = ref('')
const saving = ref(false)

const tabGroups = [
  {
    id: 'operations',
    label: 'Operations',
    tabs: [
      { id: 'business', label: 'Business' },
      { id: 'hours', label: 'Business Hours' },
      { id: 'appointments', label: 'Appointments' },
      { id: 'resources', label: 'Resources' },
      { id: 'closures', label: 'Closed Periods' }
    ]
  },
  {
    id: 'payments',
    label: 'Payments',
    tabs: [
      { id: 'payments', label: 'Payment Methods' },
      { id: 'charges', label: 'Service Charges' }
    ]
  },
  {
    id: 'brand',
    label: 'Brand & Comms',
    tabs: [
      { id: 'branding', label: 'Branding' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'domains', label: 'Domains' }
    ]
  }
]

// ==================== FORM STATE ====================
const form = reactive({
  // Business Info (from settings endpoint)
  settings: {
    businessName: '',
    businessEmail: '',
    businessPhone: { countryCode: '+234', number: '' },
    businessAddress: { street: '', city: '', region: '', postcode: '', country: 'Nigeria' },
    defaultCurrency: 'NGN',
    timezone: 'Africa/Lagos',
    resources: [] as Resource[],
    blockedTimeTypes: [] as BlockedTimeType[],
    closedPeriods: [] as ClosedPeriod[]
  },
  
  // Business Hours (from businessHours endpoint)
  businessHours: [] as BusinessHours[],
  
  // Appointment Settings (from appointmentSettings endpoint)
  appointmentSettings: {
    allowOnlineBooking: true,
    requireClientConfirmation: false,
    defaultAppointmentDuration: 30,
    bookingWindowHours: 2,
    appointmentStatuses: [] as AppointmentStatus[],
    cancellationReasons: [] as CancellationReason[]
  },
  
  // Payment Settings (from paymentSettings endpoint)
  paymentSettings: {
    paymentMethods: [] as PaymentMethod[],
    serviceCharges: [] as ServiceCharge[],
    taxes: [] as Tax[],
    defaultCurrency: 'NGN'
  },
  
  // Theme (from theme endpoint - nested under theme.theme)
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    fontFamily: 'Inter, sans-serif'
  },
  
  // Notification Preferences
  preferences: {} as NotificationPreferences
})

// ==================== DRAFT STATES FOR ADDING ITEMS ====================
const appointmentStatusDraft = reactive<AppointmentStatus>({
  statusName: '',
  statusIcon: '',
  statusColor: '#3b82f6',
  isActive: true
})

const cancellationReasonDraft = reactive<CancellationReason>({
  name: '',
  reasonType: 'client_initiated',
  isActive: true
})

const paymentMethodDraft = reactive<PaymentMethod>({
  name: '',
  paymentType: 'cash',
  enabled: true
})

const resourceDraft = reactive<Resource>({
  name: '',
  description: '',
  isActive: true
})

const blockedTimeDraft = reactive<BlockedTimeType>({
  type: '',
  typeIcon: '',
  duration: '',
  compensation: 'Unpaid',
  isActive: true
})

const closedPeriodDraft = reactive<ClosedPeriod>({
  startDate: '',
  endDate: '',
  description: '',
  businessClosed: true,
  onlineBookingBlocked: true
})

const serviceChargeDraft = reactive<ServiceCharge>({
  basicInfo: { name: '', description: '' },
  settings: { applyServiceChargeOn: 'All services', automaticallyApplyDuringCheckout: false },
  rateType: { type: 'Percentage', percentage: 0 },
  taxRate: { tax: 'VAT', rate: 0 },
  isActive: true
})

const taxDraft = reactive<Tax>({
  taxName: '',
  taxRate: 0,
  isActive: true
})

const defaultHours: BusinessHours[] = [
  { day: 'Monday', startTime: '09:00', endTime: '17:00', isOpen: true },
  { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isOpen: true },
  { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isOpen: true },
  { day: 'Thursday', startTime: '09:00', endTime: '17:00', isOpen: true },
  { day: 'Friday', startTime: '09:00', endTime: '17:00', isOpen: true },
  { day: 'Saturday', startTime: '10:00', endTime: '16:00', isOpen: true },
  { day: 'Sunday', startTime: '00:00', endTime: '00:00', isOpen: false }
]

// ==================== DATA MAPPING FUNCTIONS ====================

/**
 * Map settings data from backend to form
 */
const mapSettingsToForm = (data: any) => {
  if (!data) return
  
  form.settings.businessName = data.businessName || ''
  form.settings.businessEmail = data.businessEmail || ''
  form.settings.businessPhone = {
    countryCode: data.businessPhone?.countryCode || '+234',
    number: data.businessPhone?.number || ''
  }
  form.settings.businessAddress = {
    street: data.businessAddress?.street || '',
    city: data.businessAddress?.city || '',
    region: data.businessAddress?.region || '',
    postcode: data.businessAddress?.postcode || '',
    country: data.businessAddress?.country || 'Nigeria'
  }
  form.settings.defaultCurrency = data.defaultCurrency || 'NGN'
  form.settings.timezone = data.timezone || 'Africa/Lagos'
  form.settings.resources = data.resources || []
  form.settings.blockedTimeTypes = data.blockedTimeTypes || []
  form.settings.closedPeriods = data.closedPeriods || []
}

/**
 * Map business hours from backend to form
 */
const mapBusinessHoursToForm = (data: any[]) => {
  if (!data || !data.length) {
    form.businessHours = [...defaultHours]
    return
  }
  
  form.businessHours = data.map(hour => ({
    day: hour.day,
    startTime: hour.startTime || '09:00',
    endTime: hour.endTime || '17:00',
    isOpen: hour.isOpen ?? true
  }))
}

/**
 * Map appointment settings from backend to form
 */
const mapAppointmentSettingsToForm = (data: any) => {
  if (!data) return
  
  form.appointmentSettings.allowOnlineBooking = data.allowOnlineBooking ?? true
  form.appointmentSettings.requireClientConfirmation = data.requireClientConfirmation ?? false
  form.appointmentSettings.defaultAppointmentDuration = data.defaultAppointmentDuration || 30
  form.appointmentSettings.bookingWindowHours = data.bookingWindowHours || 2
  form.appointmentSettings.appointmentStatuses = (data.appointmentStatuses || []).map((s: any) => ({
    statusName: s.statusName,
    statusIcon: s.statusIcon,
    statusColor: s.statusColor,
    isActive: s.isActive ?? true
  }))
  form.appointmentSettings.cancellationReasons = (data.cancellationReasons || []).map((r: any) => ({
    name: r.name,
    reasonType: r.reasonType,
    isActive: r.isActive ?? true
  }))
}

/**
 * Map payment settings from backend to form
 */
const mapPaymentSettingsToForm = (data: any) => {
  if (!data) return
  
  form.paymentSettings.paymentMethods = (data.paymentMethods || []).map((m: any) => ({
    name: m.name,
    paymentType: m.paymentType,
    enabled: m.enabled ?? true
  }))
  form.paymentSettings.serviceCharges = data.serviceCharges || []
  form.paymentSettings.taxes = data.taxes || []
  form.paymentSettings.defaultCurrency = data.defaultCurrency || 'NGN'
}

/**
 * Map theme from backend to form
 * Backend structure: { isDefault: boolean, theme: { colors: {...}, typography: {...}, ... } }
 */
const mapThemeToForm = (data: any) => {
  if (!data) return
  
  // Handle nested theme structure
  const themeData = data.theme || data
  
  form.theme.primaryColor = themeData.colors?.primary || '#3B82F6'
  form.theme.secondaryColor = themeData.colors?.secondary || '#10B981'
  form.theme.accentColor = themeData.colors?.accent || '#F59E0B'
  form.theme.fontFamily = themeData.typography?.fontFamily || 'Inter, sans-serif'
}

/**
 * Map domains from backend
 * Backend: { id, domain, subdomain, verificationStatus, sslStatus, isActive, verifiedAt, createdAt }
 */
const mapDomains = computed(() => {
  return domains.value.map((d: any) => ({
    id: d.id || d._id,
    domain: d.domain,
    subdomain: d.subdomain,
    status: d.verificationStatus || d.status || 'pending',
    sslStatus: d.sslStatus || 'unknown',
    isActive: d.isActive ?? false,
    verifiedAt: d.verifiedAt,
    createdAt: d.createdAt
  }))
})

// ==================== INITIALIZATION ====================
onMounted(async () => {
  await Promise.all([
    fetchSettings(),
    fetchBusinessHours(),
    fetchAppointmentSettings(),
    fetchPaymentSettings(),
    fetchTheme(),
    fetchNotificationPreferences(),
    fetchDomains()
  ])

  // Map all data to form
  mapSettingsToForm(settings.value)
  mapBusinessHoursToForm(businessHours.value)
  mapAppointmentSettingsToForm(appointmentSettings.value)
  mapPaymentSettingsToForm(paymentSettings.value)
  mapThemeToForm(theme.value)
  
  if (preferences.value) {
    form.preferences = { ...preferences.value }
  }
})

// ==================== SAVE FUNCTIONS ====================
const saveGeneral = async () => {
  saving.value = true
  try {
    await updateSettings({
      businessName: form.settings.businessName,
      businessEmail: form.settings.businessEmail,
      businessPhone: form.settings.businessPhone,
      businessAddress: form.settings.businessAddress,
      defaultCurrency: form.settings.defaultCurrency,
      timezone: form.settings.timezone
    })
    alert('Settings saved successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to save settings')
  } finally {
    saving.value = false
  }
}

const saveBusinessHours = async () => {
  saving.value = true
  try {
    await updateBusinessHours(form.businessHours)
    alert('Business hours updated successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to update business hours')
  } finally {
    saving.value = false
  }
}

const saveAppointments = async () => {
  saving.value = true
  try {
    await updateAppointmentSettings({
      allowOnlineBooking: form.appointmentSettings.allowOnlineBooking,
      requireClientConfirmation: form.appointmentSettings.requireClientConfirmation,
      defaultAppointmentDuration: form.appointmentSettings.defaultAppointmentDuration,
      bookingWindowHours: form.appointmentSettings.bookingWindowHours,
      appointmentStatuses: form.appointmentSettings.appointmentStatuses,
      cancellationReasons: form.appointmentSettings.cancellationReasons
    })
    alert('Appointment settings updated successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to update appointment settings')
  } finally {
    saving.value = false
  }
}

const savePayments = async () => {
  saving.value = true
  try {
    await updateSettings({
      paymentMethods: form.paymentSettings.paymentMethods,
      taxes: form.paymentSettings.taxes
    })
    alert('Payment settings updated successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to update payment settings')
  } finally {
    saving.value = false
  }
}

const saveServiceCharges = async () => {
  saving.value = true
  try {
    await updateSettings({
      serviceCharges: form.paymentSettings.serviceCharges
    })
    alert('Service charges updated successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to update service charges')
  } finally {
    saving.value = false
  }
}

const saveResourcesAndBlockedTimes = async () => {
  saving.value = true
  try {
    await updateSettings({
      resources: form.settings.resources,
      blockedTimeTypes: form.settings.blockedTimeTypes
    })
    alert('Resource settings updated successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to update resource settings')
  } finally {
    saving.value = false
  }
}

const saveClosedPeriods = async () => {
  saving.value = true
  try {
    await updateSettings({
      closedPeriods: form.settings.closedPeriods
    })
    alert('Closed periods updated successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to update closed periods')
  } finally {
    saving.value = false
  }
}

const saveBranding = async () => {
  saving.value = true
  try {
    // Map form theme back to backend structure
    await updateTheme({
      colors: {
        primary: form.theme.primaryColor,
        secondary: form.theme.secondaryColor,
        accent: form.theme.accentColor
      },
      typography: {
        fontFamily: form.theme.fontFamily
      }
    } as any)
    alert('Branding updated successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to update branding')
  } finally {
    saving.value = false
  }
}

const saveNotifications = async () => {
  saving.value = true
  try {
    await updateNotificationPreferences(form.preferences)
    alert('Preferences saved successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to save preferences')
  } finally {
    saving.value = false
  }
}

// ==================== ADD/REMOVE FUNCTIONS ====================
const addAppointmentStatus = () => {
  if (!appointmentStatusDraft.statusName) return
  form.appointmentSettings.appointmentStatuses.push({ ...appointmentStatusDraft })
  appointmentStatusDraft.statusName = ''
  appointmentStatusDraft.statusIcon = ''
  appointmentStatusDraft.statusColor = '#3b82f6'
}

const removeAppointmentStatus = (index: number) => {
  form.appointmentSettings.appointmentStatuses.splice(index, 1)
}

const addCancellationReason = () => {
  if (!cancellationReasonDraft.name) return
  form.appointmentSettings.cancellationReasons.push({ ...cancellationReasonDraft })
  cancellationReasonDraft.name = ''
  cancellationReasonDraft.reasonType = 'client_initiated'
}

const removeCancellationReason = (index: number) => {
  form.appointmentSettings.cancellationReasons.splice(index, 1)
}

const addPaymentMethod = () => {
  if (!paymentMethodDraft.name) return
  form.paymentSettings.paymentMethods.push({ ...paymentMethodDraft })
  paymentMethodDraft.name = ''
  paymentMethodDraft.paymentType = 'cash'
  paymentMethodDraft.enabled = true
}

const removePaymentMethod = (index: number) => {
  form.paymentSettings.paymentMethods.splice(index, 1)
}

const addResource = () => {
  if (!resourceDraft.name || !resourceDraft.description) return
  form.settings.resources.push({ ...resourceDraft })
  resourceDraft.name = ''
  resourceDraft.description = ''
  resourceDraft.isActive = true
}

const removeResource = (index: number) => {
  form.settings.resources.splice(index, 1)
}

const addBlockedTimeType = () => {
  if (!blockedTimeDraft.type || !blockedTimeDraft.duration) return
  form.settings.blockedTimeTypes.push({ ...blockedTimeDraft })
  blockedTimeDraft.type = ''
  blockedTimeDraft.typeIcon = ''
  blockedTimeDraft.duration = ''
  blockedTimeDraft.compensation = 'Unpaid'
  blockedTimeDraft.isActive = true
}

const removeBlockedTimeType = (index: number) => {
  form.settings.blockedTimeTypes.splice(index, 1)
}

const addServiceCharge = () => {
  if (!serviceChargeDraft.basicInfo.name) return
  form.paymentSettings.serviceCharges.push({
    ...serviceChargeDraft,
    basicInfo: { ...serviceChargeDraft.basicInfo },
    settings: { ...serviceChargeDraft.settings },
    rateType: { ...serviceChargeDraft.rateType },
    taxRate: { ...serviceChargeDraft.taxRate }
  })
  serviceChargeDraft.basicInfo.name = ''
  serviceChargeDraft.basicInfo.description = ''
  serviceChargeDraft.rateType = { type: 'Percentage', percentage: 0 }
  serviceChargeDraft.taxRate = { tax: 'VAT', rate: 0 }
  serviceChargeDraft.settings.applyServiceChargeOn = 'All services'
  serviceChargeDraft.settings.automaticallyApplyDuringCheckout = false
}

const removeServiceCharge = (index: number) => {
  form.paymentSettings.serviceCharges.splice(index, 1)
}

const addTax = () => {
  if (!taxDraft.taxName) return
  form.paymentSettings.taxes.push({ ...taxDraft })
  taxDraft.taxName = ''
  taxDraft.taxRate = 0
  taxDraft.isActive = true
}

const removeTax = (index: number) => {
  form.paymentSettings.taxes.splice(index, 1)
}

const addClosedPeriod = () => {
  if (!closedPeriodDraft.startDate || !closedPeriodDraft.endDate || !closedPeriodDraft.description) return
  form.settings.closedPeriods.push({ ...closedPeriodDraft })
  closedPeriodDraft.startDate = ''
  closedPeriodDraft.endDate = ''
  closedPeriodDraft.description = ''
  closedPeriodDraft.businessClosed = true
  closedPeriodDraft.onlineBookingBlocked = true
}

const removeClosedPeriod = (index: number) => {
  form.settings.closedPeriods.splice(index, 1)
}

const addDomain = async () => {
  if (!newDomain.value) return
  saving.value = true
  try {
    await requestDomain(newDomain.value)
    newDomain.value = ''
    alert('Domain requested successfully')
  } catch (e: any) {
    alert(e.message || 'Failed to request domain')
  } finally {
    saving.value = false
  }
}
</script>
