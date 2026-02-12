<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Service menu</h1>
        <p class="text-gray-500 mt-1">View and manage the services offered by your business. <a href="#" class="text-primary hover:underline">Learn more</a></p>
      </div>
      <div class="flex items-center justify-center gap-3">
       <div>
         <NuxtLink to="/dashboard/services/create" class="bg-black block text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm">
          <span>+ Add Service</span>
        </NuxtLink>
       </div>
     <div>
                   <button @click="showCreateCategory = true" class="mt-6 w-full text-left px-4 py-3 text-primary font-bold hover:text-primary transition-colors flex items-center gap-2">
            <span class="text-xl">+</span> Add Category
          </button>
     </div>
         <div> <button @click="openCreateBundleFlow" class="mt-2 w-full text-left px-4 py-3 text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-2">
            <span class="text-xl">+</span> Add Bundle
          </button></div>

      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center gap-4 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
      <div class="relative flex-1">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search service name" 
          class="w-full bg-transparent pl-12 pr-4 py-2 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      <button class="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl hover:bg-gray-50 font-medium text-gray-600">
        Filters <span class="text-xs opacity-50">⚡</span>
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-12 gap-8 items-start">
      <!-- Sidebar Categories -->
      <aside class="col-span-12 lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-2 overflow-hidden sticky top-8 shadow-sm">
        <div class="p-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">Categories</h2>
          <div class="space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <button 
              class="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between font-medium group"
              :class="selectedCategoryFilter === 'all' ? 'bg-blue-50 text-primary' : 'hover:bg-gray-50 text-gray-500'"
              @click="selectedCategoryFilter = 'all'"
            >
              <span>All categories</span>
              <span class="text-xs" :class="selectedCategoryFilter === 'all' ? 'text-primary' : 'text-gray-300'">{{ (services || []).length }}</span>
            </button>
            <button 
              class="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between font-medium group"
              :class="selectedCategoryFilter === 'bundles' ? 'bg-blue-50 text-primary' : 'hover:bg-gray-50 text-gray-500'"
              @click="selectedCategoryFilter = 'bundles'"
            >
              <span>Bundles</span>
              <span class="text-xs" :class="selectedCategoryFilter === 'bundles' ? 'text-primary' : 'text-gray-300'">{{ (bundles || []).length }}</span>
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat._id"
              class="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between font-medium group"
              :class="selectedCategoryFilter === cat._id ? 'bg-blue-50 text-primary' : 'hover:bg-gray-50 text-gray-500'"
              @click="selectedCategoryFilter = cat._id"
            >
              <span class="truncate">{{ cat.categoryName }}</span>
              <span class="text-xs" :class="selectedCategoryFilter === cat._id ? 'text-primary' : 'text-gray-300'">{{ getServicesByCategory(cat._id).length }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Services Content -->
      <main class="col-span-12 lg:col-span-9 space-y-12 pb-20">
        <div v-if="loading" class="py-20 flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>

        <template v-else>
          <!-- Bundles Section -->
          <div v-if="selectedCategoryFilter === 'all' || selectedCategoryFilter === 'bundles'" class="space-y-6">
            <h3 v-if="bundles?.length" class="text-xl font-bold uppercase tracking-wide text-gray-800">Bundles</h3>
            <div class="space-y-4">
              <div 
                v-for="bundle in bundles" 
                :key="bundle._id"
                class="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-100 transition-all cursor-pointer shadow-sm group"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors uppercase">"{{ bundle.basicInfo.bundleName }}"</h4>
                    <p class="text-gray-400 text-sm mb-4">{{ bundle.services.length }} Services</p>
                    <p class="text-gray-600 text-sm leading-relaxed">{{ bundle.basicInfo.description }}</p>
                  </div>
                  <div class="text-xl font-bold text-gray-900">{{ formatBundlePrice(bundle.pricing.retailPrice) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Services Sections -->
          <div v-for="category in (selectedCategoryFilter === 'bundles' ? [] : filteredCategories)" :key="category._id" class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold uppercase tracking-wide text-gray-800">{{ category.categoryName }}</h3>
                <p class="text-gray-500 text-sm mt-1">{{ category.description || 'A relaxing and well-deserving services...' }}</p>
              </div>
              <button @click="openEditCategoryModal(category)" class="text-gray-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="service in getFilteredServices(category._id)" 
                :key="service._id"
                class="bg-white border border-gray-100 rounded-2xl p-6 transition-all hover:shadow-md hover:border-blue-100 cursor-pointer relative group"
                @click="openServiceDetails(service)"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1 pr-12">
                    <h4 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors uppercase">"{{ service.basicDetails.serviceName.toUpperCase() }}"</h4>
                    <p class="text-gray-400 text-sm mb-4">{{ formatDuration(service.pricingAndDuration.duration.totalDuration) }}</p>
                    <p class="text-gray-600 text-sm line-clamp-2 leading-relaxed">{{ service.basicDetails.description }}</p>
                  </div>
                  <div class="text-xl font-bold text-gray-900 whitespace-nowrap">{{ formatPriceLabel(service.pricingAndDuration.priceType, service.pricingAndDuration.price) }}</div>
                </div>
              </div>
              
              <div v-if="getFilteredServices(category._id).length === 0" class="text-gray-400 text-sm py-10 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
                No services matching your search in this category.
              </div>
            </div>

            <div class="flex items-center gap-2 text-gray-500 text-sm px-2">
              <span>{{ getServicesByCategory(category._id).length }} archived services.</span>
              <button class="text-primary hover:underline">View all</button>
            </div>
          </div>

          <!-- Uncategorized Section -->
          <div v-if="filteredUncategorizedServices.length" class="space-y-6">
            <h3 class="text-xl font-bold uppercase tracking-wide text-gray-800">UNCATEGORIZED</h3>
            <div class="space-y-4">
              <div 
                v-for="service in filteredUncategorizedServices" 
                :key="service._id"
                class="bg-white border border-gray-100 rounded-2xl p-6 transition-all hover:shadow-md hover:border-blue-100 cursor-pointer group"
                @click="openServiceDetails(service)"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors uppercase">"{{ service.basicDetails.serviceName.toUpperCase() }}"</h4>
                    <p class="text-gray-400 text-sm leading-relaxed">{{ formatDuration(service.pricingAndDuration.duration.totalDuration) }}</p>
                  </div>
                  <div class="text-xl font-bold text-gray-900">{{ formatPriceLabel(service.pricingAndDuration.priceType, service.pricingAndDuration.price) }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>

    <!-- Teleport Detailed Service Modal -->
    <Teleport to="body">
      <div v-if="showServiceDetails && selectedService" class="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeServiceDetails"></div>
        <div class="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 class="text-2xl font-bold text-gray-900 uppercase">Service Details</h2>
            <button @click="closeServiceDetails" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar space-y-8">
            <div>
              <h3 class="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">"{{ selectedService.basicDetails.serviceName }}"</h3>
              <p v-if="selectedService.basicDetails.serviceType" class="text-primary font-bold text-sm tracking-widest uppercase mb-4">{{ selectedService.basicDetails.serviceType }}</p>
              <div class="flex flex-wrap gap-4 items-center">
                <div class="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                  <span class="text-gray-400">⏱</span>
                  <span class="font-bold text-gray-700">{{ formatDuration(selectedService.pricingAndDuration.duration.totalDuration) }}</span>
                </div>
                <div class="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                  <span class="text-blue-400">💰</span>
                  <span class="font-black text-primary">{{ formatPriceLabel(selectedService.pricingAndDuration.priceType, selectedService.pricingAndDuration.price) }}</span>
                </div>
              </div>
            </div>

            <div v-if="selectedService.basicDetails.description" class="space-y-2">
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest">Description</h4>
              <p class="text-gray-600 leading-relaxed">{{ selectedService.basicDetails.description }}</p>
            </div>

            <!-- Variants Section -->
            <div v-if="selectedService.variants?.length" class="space-y-4">
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest">Available Options</h4>
              <div class="grid gap-3">
                <div v-for="variant in selectedService.variants" :key="variant._id" class="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-gray-900">{{ variant.variantName }}</p>
                    <p class="text-xs text-gray-400">{{ formatDuration(variant.pricing.duration) }}</p>
                  </div>
                  <p class="font-black text-gray-900">{{ formatPrice(variant.pricing.price) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Buttons -->
          <div class="p-6 border-t border-gray-100 flex gap-3 bg-white">
            <button @click="openEditServiceModal(selectedService)" class="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
              <span>Edit Service</span>
            </button>
            <button @click="handleDeleteService(selectedService._id)" class="px-6 border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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

          <!-- Service Variants -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Service Variants</h3>
              <button type="button" @click="addEditVariant" class="text-sm bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                + Add Variant
              </button>
            </div>
            
            <div class="space-y-6">
              <ServiceVariantForm 
                v-for="(variant, index) in editServiceForm.variants" 
                :key="index"
                v-model="editServiceForm.variants[index]"
                @remove="removeEditVariant(index)"
              />
              
              <div v-if="!editServiceForm.variants?.length" class="text-center py-4 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-100 text-sm">
                No variants added yet.
              </div>
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

    <!-- Create Category Modal -->
    <div v-if="showCreateCategory" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Add New Category</h2>
          <button @click="showCreateCategory = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleCreateCategory" class="p-6 space-y-6">
          <div class="space-y-4">
            <UiAnimatedInput v-model="categoryForm.categoryName" type="text" label="Category Name" required />
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Appointment Color</label>
              <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <input v-model="categoryForm.appointmentColor" type="color" class="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                <span class="text-sm font-medium text-gray-600 uppercase">{{ categoryForm.appointmentColor }}</span>
              </div>
            </div>
            <UiAnimatedInput v-model="categoryForm.description" type="text" label="Description (Optional)" />
          </div>
          <div class="flex gap-3 justify-between items-center pt-4">
            <button type="button" @click="showCreateCategory = false" class="px-6 py-3 w-full text-gray-500 font-bold bg-gray-50 rounded-2xl transition-all">Cancel</button>
            <button type="submit" :disabled="createCategoryLoading" class="px-8 py-3 w-full bg-primary text-white rounded-2xl font-bold hover:bg-primary disabled:opacity-70 shadow-lg shadow-blue-100 transition-all">
              {{ createCategoryLoading ? 'Creating...' : 'Create Category' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="showEditCategoryModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Edit Category</h2>
          <button @click="closeEditCategoryModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleUpdateCategory" class="p-6 space-y-6">
          <div class="space-y-4">
            <UiAnimatedInput v-model="editCategoryForm.categoryName" type="text" label="Category Name" required />
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Appointment Color</label>
              <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <input v-model="editCategoryForm.appointmentColor" type="color" class="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                <span class="text-sm font-medium text-gray-600 uppercase">{{ editCategoryForm.appointmentColor }}</span>
              </div>
            </div>
            <UiAnimatedInput v-model="editCategoryForm.description" type="textarea" label="Description (Optional)" />
          </div>
          <div class="flex gap-3 justify-between pt-4">
            <button type="button" @click="handleDeleteCategory(editCategoryForm._id)" class="px-4 py-2 text-red-500 font-bold bg-red-50 rounded-2xl transition-all">Delete Category</button>
            <div class="flex gap-3">
              <!-- <button type="button" @click="closeEditCategoryModal" class="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancel</button> -->
              <button type="submit" :disabled="updateCategoryLoading" class="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary disabled:opacity-70 shadow-lg shadow-blue-100 transition-all">
                {{ updateCategoryLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Bundle Modal -->
    <div v-if="showCreateBundleModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 class="text-xl font-bold text-gray-900">Create Service Bundle</h2>
          <button @click="showCreateBundleModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleCreateBundle" class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar space-y-8">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UiAnimatedInput v-model="bundleForm.basicInfo.bundleName" label="Bundle Name" required />
            <UiSelectInput v-model="bundleForm.basicInfo.category" label="Category" :options="categoryOptions" option-label="label" option-value="value" required />
          </div>
          <UiAnimatedInput v-model="bundleForm.basicInfo.description" type="textarea" :cols="6" :rows="6" label="Detailed Description" />

          <!-- Services Selection -->
          <div class="space-y-4">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Select Services</h3>
            <div class="flex flex-wrap gap-4 items-end bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div class="flex-1 min-w-[200px]">
                <UiSelectInput v-model="bundleServiceDraft.serviceId" label="Choose Service" :options="serviceOptions" option-label="label" option-value="value" />
              </div>
              <div class="w-24">
                <UiAnimatedInput v-model.number="bundleServiceDraft.duration" type="number" label="Mins" />
              </div>
              <button type="button" @click="addBundleService" class="bg-black text-white p-4 rounded-2xl hover:bg-gray-800 transition-all font-bold">Add</button>
            </div>

            <!-- List of selected services in bundle -->
            <div v-if="bundleForm.services.length" class="space-y-2">
              <div v-for="(s, index) in bundleForm.services" :key="index" class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                <div>
                  <p class="font-bold text-gray-900 uppercase">"{{ s.serviceName }}"</p>
                  <p class="text-xs text-gray-400">{{ s.duration }} mins</p>
                </div>
                <button type="button" @click="removeBundleService(index)" class="text-red-400 hover:text-red-600 p-2 transition-colors">&times;</button>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="grid grid-cols-2 gap-6 pt-4">
            <UiAnimatedInput v-model.number="bundleForm.pricing.retailPrice.amount" type="number" label="Bundle Price (NGN)" required />
            <UiSelectInput v-model="bundleForm.onlineBooking.availableFor" label="Available For" :options="availableForOptions" option-label="label" option-value="value" />
          </div>
        </form>

        <div class="p-6 border-t border-gray-100 flex gap-3 bg-white">
          <button type="button" @click="showCreateBundleModal = false" class="flex-1 px-6 py-4 text-gray-500 font-bold bg-gray-50 rounded-2xl transition-all">Cancel</button>
          <button type="button" @click="handleCreateBundle" :disabled="createBundleLoading || !bundleForm.services.length" class="flex-[2] bg-primary text-white rounded-2xl font-bold hover:bg-primary disabled:opacity-50 transition-all shadow-lg shadow-primary-100">
            {{ createBundleLoading ? 'Creating Bundle...' : 'Create Bundle' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { CreateCategoryDto, CreateServiceBundleDto, Price, Service, ServiceCategory, ServiceVariant } from '~/types/service'
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
const showCreateCategory = ref(false)
const showCreateBundleModal = ref(false)
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
  variants: [] as ServiceVariant[],
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

const searchQuery = ref('')
const selectedCategoryFilter = ref('all')
// const showCreateCategory = ref(false)

const filteredCategories = computed(() => {
  if (selectedCategoryFilter.value === 'all') {
    return categories.value || []
  }
  return (categories.value || []).filter(c => c._id === selectedCategoryFilter.value)
})

const getFilteredServices = (categoryId: string) => {
  const catServices = getServicesByCategory(categoryId)
  if (!searchQuery.value) return catServices
  return catServices.filter(s => 
    s.basicDetails.serviceName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

const filteredUncategorizedServices = computed(() => {
  const uncat = uncategorizedServices.value
  if (!searchQuery.value) return uncat
  return uncat.filter(s => 
    s.basicDetails.serviceName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const closeCategoryModals = () => {
  showCreateCategory.value = false
  showEditCategoryModal.value = false
  selectedCategory.value = null
}

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
  if (!price) return 'N/A'
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
  return duration || 'N/A'
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
  selectedService.value = { ...service } // Shallow copy to avoid immediate sync issues
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
  editServiceForm.variants = service.variants ? JSON.parse(JSON.stringify(service.variants)) : []
  editServiceForm.isActive = service.isActive ?? true
  showEditServiceModal.value = true
}

const addEditVariant = () => {
  editServiceForm.variants.push({
    variantName: '',
    variantDescription: '',
    pricing: {
      priceType: 'Fixed',
      price: {
        amount: 0,
        currency: 'NGN'
      },
      duration: { value: 30, unit: 'min' }
    },
    settings: {
      sku: ''
    }
  })
}

const removeEditVariant = (index: number) => {
  editServiceForm.variants.splice(index, 1)
}

const closeEditServiceModal = () => {
  showEditServiceModal.value = false
}

const openCreateBundleFlow = () => {
  showCreateBundleModal.value = true
}

const handleUpdateService = async () => {
  try {
    updateServiceLoading.value = true
    
    // Ensure variants numeric values are numbers
    const cleanedVariants = editServiceForm.variants.map(v => ({
      ...v,
      pricing: {
        ...v.pricing,
        price: { ...v.pricing.price, amount: Number(v.pricing.price.amount) || 0 },
        duration: { ...v.pricing.duration, value: Number(v.pricing.duration.value) || 0 }
      }
    }))

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
      variants: cleanedVariants,
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
  try {
    await createCategory({
      categoryName: categoryForm.categoryName,
      appointmentColor: categoryForm.appointmentColor,
      description: categoryForm.description || undefined
    })
    categoryForm.categoryName = ''
    categoryForm.description = ''
    showCreateCategory.value = false
    await fetchCategories()
  } catch (e: any) {
    alert(e.message || 'Failed to create category')
  }
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
  try {
    await createBundle(bundleForm)
    bundleForm.basicInfo.bundleName = ''
    bundleForm.basicInfo.category = ''
    bundleForm.basicInfo.description = ''
    bundleForm.services = []
    bundleForm.pricing.retailPrice.amount = 0
    showCreateBundleModal.value = false
    await fetchBundles()
  } catch (e: any) {
    alert(e.message || 'Failed to create bundle')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}

input::placeholder {
  color: #4B5563;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
