<template>
  <div class="p-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Services</h1>
        <p class="text-gray-500 mt-1">Manage your service menu, categories, and bundles.</p>
      </div>
      <NuxtLink
        to="/dashboard/services/create"
        class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <span>+ Add Service</span>
      </NuxtLink>
    </div>

    <div class="flex items-center gap-2 mb-6">
      <button
        class="px-4 py-2 rounded-lg text-sm fontF-medium"
        :class="activeTab === 'services' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'"
        @click="activeTab = 'services'"
      >
        Services
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium"
        :class="activeTab === 'categories' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'"
        @click="activeTab = 'categories'"
      >
        Categories
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium"
        :class="activeTab === 'bundles' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'"
        @click="activeTab = 'bundles'"
      >
        Bundles
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>

    <!-- Services Tab -->
    <div v-else-if="activeTab === 'services'" class="grid grid-cols-1 gap-6">
      <div v-for="category in categories" :key="category._id" class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span :style="{ backgroundColor: category.appointmentColor }" class="w-3 h-3 rounded-full"></span>
          {{ category.categoryName }}
        </h3>

        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          <div
            v-for="service in getServicesByCategory(category._id)"
            :key="service._id"
            class="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
            @click="openServiceDetails(service)"
          >
            <div>
              <h4 class="font-medium text-gray-900">{{ service.basicDetails.serviceName }}</h4>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ formatDuration(service.pricingAndDuration.duration.totalDuration) }} •
                {{ formatPriceLabel(service.pricingAndDuration.priceType, service.pricingAndDuration.price) }}
              </p>
            </div>

            <div class="flex items-center gap-2" @click.stop>
              <button
                @click="openServiceDetails(service)"
                class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
              >
                View
              </button>
              <button
                @click="openEditServiceModal(service)"
                class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                @click="handleDeleteService(service._id)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          <div v-if="getServicesByCategory(category._id).length === 0" class="p-4 text-center text-gray-400 text-sm">
            No services in this category
          </div>
        </div>
      </div>

      <div v-if="uncategorizedServices.length" class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800">Uncategorized</h3>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          <div
            v-for="service in uncategorizedServices"
            :key="service._id"
            class="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
            @click="openServiceDetails(service)"
          >
            <div>
              <h4 class="font-medium text-gray-900">{{ service.basicDetails.serviceName }}</h4>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ formatDuration(service.pricingAndDuration.duration.totalDuration) }} •
                {{ formatPriceLabel(service.pricingAndDuration.priceType, service.pricingAndDuration.price) }}
              </p>
            </div>
            <div class="flex items-center gap-2" @click.stop>
              <button
                @click="openServiceDetails(service)"
                class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
              >
                View
              </button>
              <button
                @click="openEditServiceModal(service)"
                class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                @click="handleDeleteService(service._id)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Tab -->
    <div v-else-if="activeTab === 'categories'" class="space-y-6">
      <form @submit.prevent="handleCreateCategory" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold">Create Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="categoryForm.categoryName" type="text" label="Category Name" required />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Color</label>
            <input v-model="categoryForm.appointmentColor" type="color" class="w-full h-10 px-2 py-1 rounded-lg border border-gray-200" />
          </div>
          <UiAnimatedInput v-model="categoryForm.description" type="text" label="Description" />
        </div>
        <button type="submit" :disabled="createCategoryLoading" class="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-70">
          {{ createCategoryLoading ? 'Creating...' : 'Create Category' }}
        </button>
      </form>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="category in categories" :key="category._id" class="bg-white p-4 rounded-xl border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span :style="{ backgroundColor: category.appointmentColor }" class="w-4 h-4 rounded-full"></span>
              <div>
                <h3 class="font-medium text-gray-900">{{ category.categoryName }}</h3>
                <p class="text-sm text-gray-500">{{ category.description || 'No description' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="openEditCategoryModal(category)"
                class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                @click="handleDeleteCategory(category._id)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bundles Tab -->
    <div v-else class="space-y-6">
      <form @submit.prevent="handleCreateBundle" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold">Create Bundle</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="bundleForm.basicInfo.bundleName" type="text" label="Bundle Name" required />
          <UiSelectInput
            v-model="bundleForm.basicInfo.category"
            label="Category"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            placeholder="Select Category"
          />
          <div class="md:col-span-2">
            <UiAnimatedInput v-model="bundleForm.basicInfo.description" type="text" label="Description" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UiAnimatedInput v-model="bundleForm.scheduleType" type="text" label="Schedule Type" />
          <UiAnimatedInput v-model="bundleForm.pricing.priceType" type="text" label="Price Type" />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Retail Price</label>
            <div class="flex gap-2">
              <UiAnimatedInput v-model="bundleForm.pricing.retailPrice.currency" type="text" label="Currency" />
              <UiAnimatedInput v-model.number="bundleForm.pricing.retailPrice.amount" type="number" label="Amount" />
            </div>
          </div>
        </div>

        <div class="border border-dashed border-gray-200 rounded-lg p-4 space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Bundle Services</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <UiSelectInput
              v-model="bundleServiceDraft.serviceId"
              label="Service"
              :options="serviceOptions"
              option-label="label"
              option-value="value"
              placeholder="Select Service"
            />
            <UiAnimatedInput v-model.number="bundleServiceDraft.duration" type="number" label="Duration (mins)" />
            <UiAnimatedInput v-model.number="bundleServiceDraft.sequence" type="number" label="Sequence" />
            <button type="button" @click="addBundleService" class="bg-gray-900 text-white px-4 py-2 rounded-lg self-end">Add</button>
          </div>

          <div v-if="bundleForm.services.length" class="space-y-2">
            <div v-for="(bundleService, index) in bundleForm.services" :key="`${bundleService.serviceId}-${index}`" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <div class="text-sm text-gray-700">
                {{ bundleService.serviceName }} • {{ bundleService.duration }} mins • #{{ bundleService.sequence }}
              </div>
              <button type="button" @click="removeBundleService(index)" class="text-red-600 text-sm">Remove</button>
            </div>
          </div>
        </div>

        <button type="submit" :disabled="createBundleLoading" class="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-70">
          {{ createBundleLoading ? 'Creating...' : 'Create Bundle' }}
        </button>
      </form>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="bundle in bundles" :key="bundle._id" class="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900">{{ bundle.basicInfo.bundleName }}</h3>
            <span class="text-xs text-gray-500">{{ getCategoryNameById(bundle.basicInfo.category) }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ bundle.basicInfo.description }}</p>
          <p class="text-sm text-gray-700">{{ bundle.services.length }} services • {{ bundle.pricing.priceType }} • {{ formatBundlePrice(bundle.pricing.retailPrice) }}</p>
        </div>
      </div>
    </div>

    <!-- Service Details Modal -->
    <div v-if="showServiceDetails" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Service Details</h2>
          <button @click="closeServiceDetails" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div v-if="selectedService" class="p-6 space-y-6">
          <!-- Basic Details -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Basic Details</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500">Service Name</p>
                <p class="font-medium text-gray-900">{{ selectedService.basicDetails.serviceName }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Service Type</p>
                <p class="font-medium text-gray-900">{{ selectedService.basicDetails.serviceType }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Category</p>
                <div class="flex items-center gap-2">
                  <span 
                    v-if="selectedService.basicDetails.category?.appointmentColor"
                    :style="{ backgroundColor: selectedService.basicDetails.category.appointmentColor }" 
                    class="w-3 h-3 rounded-full"
                  ></span>
                  <p class="font-medium text-gray-900">{{ selectedService.basicDetails.category?.categoryName || 'Uncategorized' }}</p>
                </div>
              </div>
              <div>
                <p class="text-xs text-gray-500">Status</p>
                <span :class="selectedService.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ selectedService.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500">Description</p>
              <p class="text-gray-700">{{ selectedService.basicDetails.description || 'No description' }}</p>
            </div>
          </div>

          <!-- Pricing & Duration -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pricing & Duration</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-500">Price Type</p>
                <p class="font-medium text-gray-900">{{ selectedService.pricingAndDuration.priceType }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Price</p>
                <p class="font-medium text-gray-900">{{ formatPrice(selectedService.pricingAndDuration.price) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Service Time</p>
                <p class="font-medium text-gray-900">{{ selectedService.pricingAndDuration.duration.servicingTime.value }} {{ selectedService.pricingAndDuration.duration.servicingTime.unit }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Processing Time</p>
                <p class="font-medium text-gray-900">{{ selectedService.pricingAndDuration.duration.processingTime.value }} {{ selectedService.pricingAndDuration.duration.processingTime.unit }}</p>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Team Members</h3>
            <p class="text-gray-700">
              {{ selectedService.teamMembers?.allTeamMembers ? 'All Team Members' : `${selectedService.teamMembers?.selectedMembers?.length || 0} Selected` }}
            </p>
          </div>

          <!-- Online Booking -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Online Booking</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500">Enabled</p>
                <p class="font-medium text-gray-900">{{ selectedService.settings?.onlineBooking?.enabled ? 'Yes' : 'No' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Available For</p>
                <p class="font-medium text-gray-900">{{ selectedService.settings?.onlineBooking?.availableFor || 'All' }}</p>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Timestamps</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500">Created At</p>
                <p class="font-medium text-gray-900">{{ formatDate(selectedService.createdAt) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Updated At</p>
                <p class="font-medium text-gray-900">{{ formatDate(selectedService.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button @click="closeServiceDetails" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Close</button>
          <button @click="openEditServiceModal(selectedService)" class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Edit Service</button>
        </div>
      </div>
    </div>

    <!-- Edit Service Modal -->
    <div v-if="showEditServiceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Edit Service</h2>
          <button @click="closeEditServiceModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleUpdateService" class="p-6 space-y-6">
          <!-- Basic Details -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Basic Details</h3>
            <UiAnimatedInput v-model="editServiceForm.basicDetails.serviceName" type="text" label="Service Name" required />
            <div class="grid grid-cols-2 gap-4">
              <UiSelectInput
                v-model="editServiceForm.basicDetails.category"
                label="Category"
                :options="categoryOptions"
                option-label="label"
                option-value="value"
                placeholder="Select Category"
              />
              <UiAnimatedInput v-model="editServiceForm.basicDetails.serviceType" type="text" label="Service Type" />
            </div>
            <UiAnimatedInput v-model="editServiceForm.basicDetails.description" type="text" label="Description" />
          </div>

          <!-- Pricing -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pricing</h3>
            <div class="grid grid-cols-3 gap-4">
              <UiSelectInput
                v-model="editServiceForm.pricingAndDuration.priceType"
                label="Price Type"
                :options="priceTypeOptions"
                option-label="label"
                option-value="value"
              />
              <UiAnimatedInput v-model.number="editServiceForm.pricingAndDuration.price.amount" type="number" label="Amount" />
              <UiAnimatedInput v-model="editServiceForm.pricingAndDuration.price.currency" type="text" label="Currency" />
            </div>
          </div>

          <!-- Duration -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Duration</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex gap-2">
                <UiAnimatedInput v-model.number="editServiceForm.pricingAndDuration.duration.servicingTime.value" type="number" label="Service Time" />
                <UiSelectInput
                  v-model="editServiceForm.pricingAndDuration.duration.servicingTime.unit"
                  label="Unit"
                  :options="durationUnitOptions"
                  option-label="label"
                  option-value="value"
                />
              </div>
              <div class="flex gap-2">
                <UiAnimatedInput v-model.number="editServiceForm.pricingAndDuration.duration.processingTime.value" type="number" label="Processing Time" />
                <UiSelectInput
                  v-model="editServiceForm.pricingAndDuration.duration.processingTime.unit"
                  label="Unit"
                  :options="durationUnitOptions"
                  option-label="label"
                  option-value="value"
                />
              </div>
            </div>
          </div>

          <!-- Online Booking -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Online Booking</h3>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input v-model="editServiceForm.settings.onlineBooking.enabled" type="checkbox" class="custom-checkbox" />
                Enable online booking
              </label>
              <UiSelectInput
                v-model="editServiceForm.settings.onlineBooking.availableFor"
                label="Available For"
                :options="availableForOptions"
                option-label="label"
                option-value="value"
              />
            </div>
          </div>

          <!-- Active Status -->
          <div class="space-y-4">
            <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
              <input v-model="editServiceForm.isActive" type="checkbox" class="custom-checkbox" />
              Service is Active
            </label>
          </div>

          <div class="flex gap-3 justify-end pt-4">
            <button type="button" @click="closeEditServiceModal" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="updateServiceLoading" class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-70">
              {{ updateServiceLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="showEditCategoryModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Edit Category</h2>
          <button @click="closeEditCategoryModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleUpdateCategory" class="p-6 space-y-4">
          <UiAnimatedInput v-model="editCategoryForm.categoryName" type="text" label="Category Name" required />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Color</label>
            <input v-model="editCategoryForm.appointmentColor" type="color" class="w-full h-10 px-2 py-1 rounded-lg border border-gray-200" />
          </div>
          <UiAnimatedInput v-model="editCategoryForm.description" type="text" label="Description" />
          <div class="flex gap-3 justify-end pt-4">
            <button type="button" @click="closeEditCategoryModal" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="updateCategoryLoading" class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-70">
              {{ updateCategoryLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { CreateCategoryDto, CreateServiceBundleDto, Price, Service, ServiceCategory } from '~/types/service'
import { useFetchServices } from "@/composables/modules/service/useFetchServices"
import { useFetchCategories } from "@/composables/modules/service/useFetchCategories"
import { useDeleteService } from "@/composables/modules/service/useDeleteService"
import { useCreateCategory } from "@/composables/modules/service/useCreateCategory"
import { useFetchBundles } from "@/composables/modules/service/useFetchBundles"
import { useCreateBundle } from "@/composables/modules/service/useCreateBundle"
import { service_api } from '~/api_factory/modules'

definePageMeta({
  layout: 'dashboard'
})

const activeTab = ref<'services' | 'categories' | 'bundles'>('services')

const { data: services, loading: servicesLoading, execute: fetchServices } = useFetchServices()
const { data: categories, loading: categoriesLoading, execute: fetchCategories } = useFetchCategories()
const { data: bundles, loading: bundlesLoading, execute: fetchBundles } = useFetchBundles()
const { execute: deleteService } = useDeleteService()
const { loading: createCategoryLoading, execute: createCategory } = useCreateCategory()
const { loading: createBundleLoading, execute: createBundle } = useCreateBundle()

const loading = computed(() => servicesLoading.value || categoriesLoading.value || bundlesLoading.value)

// Modal states
const showServiceDetails = ref(false)
const showEditServiceModal = ref(false)
const showEditCategoryModal = ref(false)
const selectedService = ref<any>(null)
const selectedCategory = ref<any>(null)
const updateServiceLoading = ref(false)
const updateCategoryLoading = ref(false)

// Options for selects
const categoryOptions = computed(() => {
  return (categories.value || []).map((cat: any) => ({
    label: cat.categoryName,
    value: cat._id
  }))
})

const serviceOptions = computed(() => {
  return (services.value || []).map((service: any) => ({
    label: service.basicDetails.serviceName,
    value: service._id
  }))
})

const priceTypeOptions = [
  { label: 'Fixed', value: 'Fixed' },
  { label: 'From', value: 'From' },
  { label: 'Free', value: 'Free' }
]

const durationUnitOptions = [
  { label: 'min', value: 'min' },
  { label: 'hour', value: 'h' }
]

const availableForOptions = [
  { label: 'All', value: 'All' },
  { label: 'Members', value: 'Members' },
  { label: 'Guests', value: 'Guests' }
]

const categoryForm = reactive<CreateCategoryDto>({
  categoryName: '',
  appointmentColor: '#111827',
  description: ''
})

const editCategoryForm = reactive({
  _id: '',
  categoryName: '',
  appointmentColor: '#111827',
  description: ''
})

const editServiceForm = reactive({
  _id: '',
  basicDetails: {
    serviceName: '',
    serviceType: '',
    category: '',
    description: ''
  },
  pricingAndDuration: {
    priceType: 'Fixed' as 'Fixed' | 'From' | 'Free',
    price: { amount: 0, currency: 'NGN' },
    duration: {
      servicingTime: { value: 30, unit: 'min' as 'min' | 'h' },
      processingTime: { value: 0, unit: 'min' as 'min' | 'h' },
      totalDuration: '30 min'
    }
  },
  settings: {
    onlineBooking: { enabled: true, availableFor: 'All' as 'All' | 'Members' | 'Guests' }
  },
  isActive: true
})

const bundleForm = reactive<CreateServiceBundleDto>({
  basicInfo: {
    bundleName: '',
    category: '',
    description: ''
  },
  services: [],
  scheduleType: 'Fixed',
  pricing: {
    priceType: 'Fixed',
    retailPrice: {
      currency: 'NGN',
      amount: 0
    }
  },
  onlineBooking: {
    enabled: true,
    availableFor: 'All'
  }
})

const bundleServiceDraft = reactive({
  serviceId: '',
  duration: 30,
  sequence: 1
})

onMounted(async () => {
  await Promise.all([
    fetchServices(),
    fetchCategories(),
    fetchBundles()
  ])
})

// Fixed: Get category ID from the category object (handles both string and object)
const getServiceCategoryId = (service: any): string => {
  if (!service?.basicDetails?.category) return ''
  if (typeof service.basicDetails.category === 'string') return service.basicDetails.category
  return service.basicDetails.category._id || ''
}

const getServicesByCategory = (categoryId: string) => {
  if (!services.value) return []
  return services.value.filter((s: any) => getServiceCategoryId(s) === categoryId)
}

const uncategorizedServices = computed(() => {
  if (!services.value) return []
  const categoryIds = new Set((categories.value || []).map((c: ServiceCategory) => c._id))
  return services.value.filter((s: any) => {
    const catId = getServiceCategoryId(s)
    return !catId || !categoryIds.has(catId)
  })
})

const formatPrice = (price: Price) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: price.currency }).format(price.amount)
}

const formatBundlePrice = (price: { currency: string; amount: number }) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: price.currency }).format(price.amount)
}

const formatPriceLabel = (priceType: string, price: Price) => {
  if (priceType === 'Free') return 'Free'
  return formatPrice(price)
}

const formatDuration = (duration: string) => {
  return duration
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryNameById = (categoryId: string) => {
  const match = (categories.value || []).find((cat: ServiceCategory) => cat._id === categoryId)
  return match?.categoryName || 'Uncategorized'
}

// Service Details Modal
const openServiceDetails = (service: any) => {
  selectedService.value = service
  showServiceDetails.value = true
}

const closeServiceDetails = () => {
  showServiceDetails.value = false
  selectedService.value = null
}

// Edit Service Modal
const openEditServiceModal = (service: any) => {
  closeServiceDetails()
  selectedService.value = service
  editServiceForm._id = service._id
  editServiceForm.basicDetails.serviceName = service.basicDetails.serviceName
  editServiceForm.basicDetails.serviceType = service.basicDetails.serviceType
  editServiceForm.basicDetails.category = getServiceCategoryId(service)
  editServiceForm.basicDetails.description = service.basicDetails.description || ''
  editServiceForm.pricingAndDuration.priceType = service.pricingAndDuration.priceType
  editServiceForm.pricingAndDuration.price.amount = service.pricingAndDuration.price.amount
  editServiceForm.pricingAndDuration.price.currency = service.pricingAndDuration.price.currency
  editServiceForm.pricingAndDuration.duration.servicingTime.value = service.pricingAndDuration.duration.servicingTime.value
  editServiceForm.pricingAndDuration.duration.servicingTime.unit = service.pricingAndDuration.duration.servicingTime.unit
  editServiceForm.pricingAndDuration.duration.processingTime.value = service.pricingAndDuration.duration.processingTime.value
  editServiceForm.pricingAndDuration.duration.processingTime.unit = service.pricingAndDuration.duration.processingTime.unit
  editServiceForm.settings.onlineBooking.enabled = service.settings?.onlineBooking?.enabled ?? true
  editServiceForm.settings.onlineBooking.availableFor = service.settings?.onlineBooking?.availableFor || 'All'
  editServiceForm.isActive = service.isActive ?? true
  showEditServiceModal.value = true
}

const closeEditServiceModal = () => {
  showEditServiceModal.value = false
}

const handleUpdateService = async () => {
  try {
    updateServiceLoading.value = true
    
    const payload = {
      basicDetails: {
        serviceName: editServiceForm.basicDetails.serviceName,
        serviceType: editServiceForm.basicDetails.serviceType,
        category: editServiceForm.basicDetails.category,
        description: editServiceForm.basicDetails.description
      },
      pricingAndDuration: {
        priceType: editServiceForm.pricingAndDuration.priceType,
        price: {
          amount: Number(editServiceForm.pricingAndDuration.price.amount) || 0,
          currency: editServiceForm.pricingAndDuration.price.currency
        },
        duration: {
          servicingTime: {
            value: Number(editServiceForm.pricingAndDuration.duration.servicingTime.value) || 0,
            unit: editServiceForm.pricingAndDuration.duration.servicingTime.unit
          },
          processingTime: {
            value: Number(editServiceForm.pricingAndDuration.duration.processingTime.value) || 0,
            unit: editServiceForm.pricingAndDuration.duration.processingTime.unit
          },
          totalDuration: `${editServiceForm.pricingAndDuration.duration.servicingTime.value} ${editServiceForm.pricingAndDuration.duration.servicingTime.unit}`
        }
      },
      settings: {
        onlineBooking: {
          enabled: editServiceForm.settings.onlineBooking.enabled,
          availableFor: editServiceForm.settings.onlineBooking.availableFor
        }
      },
      isActive: editServiceForm.isActive
    }

    await service_api.updateService(editServiceForm._id, payload)
    closeEditServiceModal()
    await fetchServices()
  } catch (e: any) {
    alert(e.message || 'Failed to update service')
  } finally {
    updateServiceLoading.value = false
  }
}

const handleDeleteService = async (id: string) => {
  if (confirm('Are you sure you want to delete this service?')) {
    await deleteService(id)
    await fetchServices()
  }
}

// Edit Category Modal
const openEditCategoryModal = (category: any) => {
  selectedCategory.value = category
  editCategoryForm._id = category._id
  editCategoryForm.categoryName = category.categoryName
  editCategoryForm.appointmentColor = category.appointmentColor
  editCategoryForm.description = category.description || ''
  showEditCategoryModal.value = true
}

const closeEditCategoryModal = () => {
  showEditCategoryModal.value = false
  selectedCategory.value = null
}

const handleUpdateCategory = async () => {
  try {
    updateCategoryLoading.value = true
    await service_api.updateCategory(editCategoryForm._id, {
      categoryName: editCategoryForm.categoryName,
      appointmentColor: editCategoryForm.appointmentColor,
      description: editCategoryForm.description || undefined
    })
    closeEditCategoryModal()
    await fetchCategories()
  } catch (e: any) {
    alert(e.message || 'Failed to update category')
  } finally {
    updateCategoryLoading.value = false
  }
}

const handleDeleteCategory = async (id: string) => {
  if (confirm('Are you sure you want to delete this category? Services in this category will become uncategorized.')) {
    try {
      await service_api.deleteCategory(id)
      await fetchCategories()
    } catch (e: any) {
      alert(e.message || 'Failed to delete category')
    }
  }
}

const handleCreateCategory = async () => {
  await createCategory({
    categoryName: categoryForm.categoryName,
    appointmentColor: categoryForm.appointmentColor,
    description: categoryForm.description || undefined
  })
  categoryForm.categoryName = ''
  categoryForm.description = ''
  await fetchCategories()
}

const addBundleService = () => {
  if (!bundleServiceDraft.serviceId) return
  const selectedServiceItem = (services.value || []).find((s: Service) => s._id === bundleServiceDraft.serviceId)
  if (!selectedServiceItem) return

  bundleForm.services.push({
    serviceId: bundleServiceDraft.serviceId,
    serviceName: selectedServiceItem.basicDetails.serviceName,
    duration: Number(bundleServiceDraft.duration) || 0,
    sequence: Number(bundleServiceDraft.sequence) || bundleForm.services.length + 1
  })

  bundleServiceDraft.serviceId = ''
  bundleServiceDraft.duration = 30
  bundleServiceDraft.sequence = bundleForm.services.length + 1
}

const removeBundleService = (index: number) => {
  bundleForm.services.splice(index, 1)
}

const handleCreateBundle = async () => {
  if (!bundleForm.services.length) {
    alert('Please add at least one service to the bundle.')
    return
  }
  await createBundle(bundleForm)
  bundleForm.basicInfo.bundleName = ''
  bundleForm.basicInfo.category = ''
  bundleForm.basicInfo.description = ''
  bundleForm.services = []
  bundleForm.pricing.retailPrice.amount = 0
  await fetchBundles()
}
</script>
