<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-900">Packages ({{ packages.length }})</h2>
      <button
        @click="openCreateModal"
        class="bg-primary text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center gap-2 shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Package
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-2xl p-6 h-48 animate-pulse border border-gray-100"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="packages.length === 0"
      class="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200"
    >
      <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 class="text-gray-900 font-semibold mb-1">No packages found</h3>
      <p class="text-gray-500 max-w-xs mx-auto mb-6">Create your first consultation package to start accepting bookings.</p>
      <button
        @click="openCreateModal"
        class="text-primary font-semibold hover:underline"
      >
        Create a package
      </button>
    </div>

    <!-- Package Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all group"
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="pkg.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'"
          >
            {{ pkg.isActive ? 'Active' : 'Inactive' }}
          </div>
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="editPackage(pkg)"
              class="p-2 text-gray-400 hover:text-primary transition-colors"
              title="Edit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="togglePackageStatus(pkg)"
              class="p-2 text-gray-400 hover:text-primary transition-colors"
              :title="pkg.isActive ? 'Deactivate' : 'Activate'"
            >
              <svg v-if="pkg.isActive" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        <h3 class="font-bold text-gray-900 mb-1 line-clamp-1">{{ pkg.name }}</h3>
        <p class="text-gray-500 text-sm line-clamp-2 mb-6 h-10">{{ pkg.description }}</p>

        <div class="flex items-end justify-between border-t border-gray-50 pt-4">
          <div>
            <p class="text-xs text-gray-400 uppercase font-semibold">Duration</p>
            <p class="text-gray-900 font-medium">{{ pkg.duration }} mins</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400 uppercase font-semibold">Price</p>
            <p class="text-primary font-bold text-lg">₦{{ pkg.price?.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <PackageModal
      v-model="showModal"
      :package-data="selectedPackage"
      @success="fetchPackages"
    />
  </div>
</template>

<script setup lang="ts">
import PackageModal from '@/components/consultations/PackageModal.vue'
import { useGetPackages } from '@/composables/modules/consultations/packages/useGetPackages'
import { useUpdatePackage } from '@/composables/modules/consultations/packages/useUpdatePackage'

const { packages, loading, fetchPackages } = useGetPackages()
const { updatePackage } = useUpdatePackage()

const showModal = ref(false)
const selectedPackage = ref<any>(null)

const openCreateModal = () => {
  selectedPackage.value = null
  showModal.value = true
}

const editPackage = (pkg: any) => {
  selectedPackage.value = { ...pkg }
  showModal.value = true
}

const togglePackageStatus = async (pkg: any) => {
  try {
    await updatePackage(pkg.id, { isActive: !pkg.isActive })
    await fetchPackages()
  } catch (error) {
    console.error(error)
  }
}
</script>
