<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Gallery Images</h3>
          <p class="text-sm text-gray-500">{{ images.length }} images in gallery</p>
        </div>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Image
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!images.length" class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-pink-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-900 mb-1">No gallery images yet</h4>
      <p class="text-sm text-gray-500 mb-4">Showcase your work with beautiful images</p>
      <button
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Your First Image
      </button>
    </div>

    <!-- Images Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(image, index) in images"
        :key="image.id || index"
        class="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
      >
        <img 
          :src="image.url" 
          :alt="image.caption || 'Gallery image'"
          class="w-full h-full object-cover"
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
          <!-- Top Actions -->
          <div class="flex justify-end gap-1">
            <button
              @click="editImage(image)"
              class="p-1.5 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(image)"
              class="p-1.5 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <!-- Bottom Info -->
          <div>
            <p v-if="image.caption" class="text-white text-sm font-medium line-clamp-1">{{ image.caption }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span v-if="image.category" class="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                {{ image.category }}
              </span>
              <span v-if="image.serviceName" class="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/50 text-white">
                {{ image.serviceName }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Badge -->
        <div class="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-xs font-medium text-gray-700">
          {{ index + 1 }}
        </div>
      </div>

      <!-- Add More Card -->
      <div 
        @click="openAddModal"
        class="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
      >
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-xs text-gray-500 mt-1">Add Image</span>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingId ? 'Edit Image' : 'Add Gallery Image' }}
            </h3>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Image URL -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Image URL *</label>
              <input
                v-model="form.url"
                type="url"
                placeholder="https://example.com/work1.jpg"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <!-- Image Preview -->
            <div v-if="form.url" class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Preview</label>
              <div class="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img :src="form.url" alt="Preview" class="w-full h-full object-contain" />
              </div>
            </div>

            <!-- Caption -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Caption</label>
              <input
                v-model="form.caption"
                type="text"
                placeholder="e.g., Beautiful balayage transformation"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Category</label>
              <input
                v-model="form.category"
                type="text"
                placeholder="e.g., hair, nails, makeup"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <!-- Service Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Service Name</label>
              <input
                v-model="form.serviceName"
                type="text"
                placeholder="e.g., Balayage Highlights"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p class="text-xs text-gray-500">Link this image to a specific service</p>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              @click="closeModal"
              class="px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveImage"
              :disabled="!isFormValid || saving"
              class="px-4 py-2 rounded-lg text-white font-medium bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Image') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="imageToDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Delete Image</h3>
              <p class="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          
          <!-- Image Preview -->
          <div v-if="imageToDelete.url" class="mb-4 w-24 h-24 mx-auto rounded-lg overflow-hidden border border-gray-200">
            <img :src="imageToDelete.url" alt="Image to delete" class="w-full h-full object-cover" />
          </div>
          
          <p class="text-gray-600 mb-6 text-center">
            Are you sure you want to delete this image?
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="imageToDelete = null"
              class="px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteImageConfirmed"
              :disabled="deleting"
              class="px-4 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GalleryImageItem } from '@/types/branding'

const props = defineProps<{
  images: GalleryImageItem[]
}>()

const emit = defineEmits<{
  (e: 'add', image: Omit<GalleryImageItem, 'id'>): void
  (e: 'update', images: GalleryImageItem[]): void
  (e: 'delete', id: string): void
}>()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const deleting = ref(false)
const imageToDelete = ref<GalleryImageItem | null>(null)

const form = ref<Omit<GalleryImageItem, 'id'>>({
  url: '',
  caption: '',
  category: '',
  serviceName: ''
})

const isFormValid = computed(() => {
  return form.value.url && form.value.url.startsWith('http')
})

const openAddModal = () => {
  editingId.value = null
  form.value = {
    url: '',
    caption: '',
    category: '',
    serviceName: ''
  }
  showModal.value = true
}

const editImage = (image: GalleryImageItem) => {
  editingId.value = image.id || null
  form.value = {
    url: image.url,
    caption: image.caption || '',
    category: image.category || '',
    serviceName: image.serviceName || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveImage = async () => {
  if (!isFormValid.value) return
  
  saving.value = true
  try {
    if (editingId.value) {
      // Update existing - emit full updated list
      const updated = props.images.map(img => 
        img.id === editingId.value 
          ? { ...img, ...form.value }
          : img
      )
      emit('update', updated)
    } else {
      // Add new
      emit('add', { ...form.value })
    }
    closeModal()
  } finally {
    saving.value = false
  }
}

const confirmDelete = (image: GalleryImageItem) => {
  imageToDelete.value = image
}

const deleteImageConfirmed = async () => {
  if (!imageToDelete.value?.id) return
  
  deleting.value = true
  try {
    emit('delete', imageToDelete.value.id)
    imageToDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>
