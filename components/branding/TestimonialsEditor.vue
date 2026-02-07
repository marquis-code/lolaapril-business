<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Testimonials</h3>
          <p class="text-sm text-gray-500">{{ testimonials.length }} customer testimonials</p>
        </div>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!testimonials.length" class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-900 mb-1">No testimonials yet</h4>
      <p class="text-sm text-gray-500 mb-4">Add customer reviews to build trust with potential clients</p>
      <button
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Your First Testimonial
      </button>
    </div>

    <!-- Testimonials List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(testimonial, index) in testimonials"
        :key="testimonial.id || index"
        class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start gap-4">
          <!-- Client Photo -->
          <div class="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
            <img 
              v-if="testimonial.clientPhoto" 
              :src="testimonial.clientPhoto" 
              :alt="testimonial.clientName"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium">
              {{ testimonial.clientName?.charAt(0)?.toUpperCase() || '?' }}
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-medium text-gray-900">{{ testimonial.clientName }}</h4>
              <span v-if="testimonial.clientTitle" class="text-xs text-gray-500">{{ testimonial.clientTitle }}</span>
            </div>
            
            <!-- Rating -->
            <div class="flex items-center gap-1 mb-2">
              <svg 
                v-for="star in 5" 
                :key="star" 
                class="w-4 h-4" 
                :class="star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-200'"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            
            <p class="text-sm text-gray-600 line-clamp-3">{{ testimonial.content }}</p>
            
            <div v-if="testimonial.serviceName" class="mt-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                {{ testimonial.serviceName }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <button
              @click="editTestimonial(testimonial)"
              class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(testimonial)"
              class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingId ? 'Edit Testimonial' : 'Add Testimonial' }}
            </h3>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Client Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Client Name *</label>
              <input
                v-model="form.clientName"
                type="text"
                placeholder="e.g., Sarah Johnson"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <!-- Client Title -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Client Title</label>
              <input
                v-model="form.clientTitle"
                type="text"
                placeholder="e.g., Regular Client"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <!-- Client Photo URL -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Photo URL</label>
              <input
                v-model="form.clientPhoto"
                type="url"
                placeholder="https://example.com/photo.jpg"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <!-- Rating -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Rating *</label>
              <div class="flex items-center gap-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="form.rating = star"
                  type="button"
                  class="p-1 transition-transform hover:scale-110"
                >
                  <svg 
                    class="w-6 h-6" 
                    :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-200'"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Testimonial Content *</label>
              <textarea
                v-model="form.content"
                rows="4"
                placeholder="Write the customer's testimonial..."
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              ></textarea>
            </div>

            <!-- Service Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Service Name</label>
              <input
                v-model="form.serviceName"
                type="text"
                placeholder="e.g., Hair Styling"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
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
              @click="saveTestimonial"
              :disabled="!isFormValid || saving"
              class="px-4 py-2 rounded-lg text-white font-medium bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Testimonial') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="testimonialToDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Delete Testimonial</h3>
              <p class="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete the testimonial from <strong>{{ testimonialToDelete.clientName }}</strong>?
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="testimonialToDelete = null"
              class="px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteTestimonialConfirmed"
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
import type { TestimonialItem } from '@/types/branding'

const props = defineProps<{
  testimonials: TestimonialItem[]
}>()

const emit = defineEmits<{
  (e: 'add', testimonial: Omit<TestimonialItem, 'id'>): void
  (e: 'update', testimonials: TestimonialItem[]): void
  (e: 'delete', id: string): void
}>()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const deleting = ref(false)
const testimonialToDelete = ref<TestimonialItem | null>(null)

const form = ref<Omit<TestimonialItem, 'id'>>({
  clientName: '',
  clientPhoto: '',
  clientTitle: '',
  content: '',
  rating: 5,
  serviceName: ''
})

const isFormValid = computed(() => {
  return form.value.clientName && form.value.content && form.value.rating > 0
})

const openAddModal = () => {
  editingId.value = null
  form.value = {
    clientName: '',
    clientPhoto: '',
    clientTitle: '',
    content: '',
    rating: 5,
    serviceName: ''
  }
  showModal.value = true
}

const editTestimonial = (testimonial: TestimonialItem) => {
  editingId.value = testimonial.id || null
  form.value = {
    clientName: testimonial.clientName,
    clientPhoto: testimonial.clientPhoto || '',
    clientTitle: testimonial.clientTitle || '',
    content: testimonial.content,
    rating: testimonial.rating,
    serviceName: testimonial.serviceName || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveTestimonial = async () => {
  if (!isFormValid.value) return
  
  saving.value = true
  try {
    if (editingId.value) {
      // Update existing - emit full updated list
      const updated = props.testimonials.map(t => 
        t.id === editingId.value 
          ? { ...t, ...form.value }
          : t
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

const confirmDelete = (testimonial: TestimonialItem) => {
  testimonialToDelete.value = testimonial
}

const deleteTestimonialConfirmed = async () => {
  if (!testimonialToDelete.value?.id) return
  
  deleting.value = true
  try {
    emit('delete', testimonialToDelete.value.id)
    testimonialToDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>
