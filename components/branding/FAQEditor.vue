<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
          <p class="text-sm text-gray-500">{{ faqs.length }} FAQs added</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="$emit('importFromChat')"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import from Chat
          </button>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add FAQ
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!faqs.length" class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-900 mb-1">No FAQs yet</h4>
      <p class="text-sm text-gray-500 mb-4">Add common questions and answers to help your customers</p>
      <button
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Your First FAQ
      </button>
    </div>

    <!-- FAQs List -->
    <div v-else class="space-y-3">
      <div
        v-for="(faq, index) in faqs"
        :key="faq.id || index"
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Collapsed View -->
        <div 
          @click="toggleExpand(faq.id || String(index))"
          class="p-5 cursor-pointer"
        >
          <div class="flex items-start gap-4">
            <!-- Expand Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <svg 
                class="w-5 h-5 text-gray-400 transition-transform" 
                :class="{ 'rotate-180': expandedId === (faq.id || String(index)) }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <!-- Question -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">Q</span>
                <h4 class="font-medium text-gray-900">{{ faq.question }}</h4>
              </div>
              <p v-if="expandedId !== (faq.id || String(index))" class="text-sm text-gray-500 line-clamp-1">
                {{ faq.answer }}
              </p>
              <span v-if="faq.category" class="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {{ faq.category }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1" @click.stop>
              <button
                @click="editFAQ(faq)"
                class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(faq)"
                class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Expanded Answer -->
        <div 
          v-if="expandedId === (faq.id || String(index))"
          class="px-5 pb-5 pt-0"
        >
          <div class="pl-9 border-l-2 border-orange-200 ml-2">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">A</span>
            </div>
            <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ faq.answer }}</p>
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
              {{ editingId ? 'Edit FAQ' : 'Add FAQ' }}
            </h3>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Question -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Question *</label>
              <input
                v-model="form.question"
                type="text"
                placeholder="e.g., What are your opening hours?"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <!-- Answer -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Answer *</label>
              <textarea
                v-model="form.answer"
                rows="4"
                placeholder="Write your answer here..."
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              ></textarea>
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Category</label>
              <input
                v-model="form.category"
                type="text"
                placeholder="e.g., general, booking, pricing"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p class="text-xs text-gray-500">Use categories to group related questions</p>
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
              @click="saveFAQ"
              :disabled="!isFormValid || saving"
              class="px-4 py-2 rounded-lg text-white font-medium bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add FAQ') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="faqToDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Delete FAQ</h3>
              <p class="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete this FAQ?
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="faqToDelete = null"
              class="px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteFAQConfirmed"
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
import type { FAQItem } from '@/types/branding'

const props = defineProps<{
  faqs: FAQItem[]
}>()

const emit = defineEmits<{
  (e: 'add', faq: Omit<FAQItem, 'id'>): void
  (e: 'update', faqs: FAQItem[]): void
  (e: 'delete', id: string): void
  (e: 'importFromChat'): void
}>()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const deleting = ref(false)
const faqToDelete = ref<FAQItem | null>(null)
const expandedId = ref<string | null>(null)

const form = ref<Omit<FAQItem, 'id'>>({
  question: '',
  answer: '',
  category: ''
})

const isFormValid = computed(() => {
  return form.value.question && form.value.answer
})

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const openAddModal = () => {
  editingId.value = null
  form.value = {
    question: '',
    answer: '',
    category: ''
  }
  showModal.value = true
}

const editFAQ = (faq: FAQItem) => {
  editingId.value = faq.id || null
  form.value = {
    question: faq.question,
    answer: faq.answer,
    category: faq.category || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveFAQ = async () => {
  if (!isFormValid.value) return
  
  saving.value = true
  try {
    if (editingId.value) {
      // Update existing - emit full updated list
      const updated = props.faqs.map(f => 
        f.id === editingId.value 
          ? { ...f, ...form.value }
          : f
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

const confirmDelete = (faq: FAQItem) => {
  faqToDelete.value = faq
}

const deleteFAQConfirmed = async () => {
  if (!faqToDelete.value?.id) return
  
  deleting.value = true
  try {
    emit('delete', faqToDelete.value.id)
    faqToDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>
