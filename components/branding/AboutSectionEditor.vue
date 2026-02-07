<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 class="font-medium text-emerald-900">About Section</h4>
          <p class="text-sm text-emerald-700 mt-1">Tell your story and connect with customers</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Main Content</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Title -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Section Title</label>
            <input
              v-model="localAbout.title"
              type="text"
              placeholder="e.g., About Our Salon"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <!-- Subtitle -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Subtitle</label>
            <input
              v-model="localAbout.subtitle"
              type="text"
              placeholder="e.g., Your beauty is our passion"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="mt-4 space-y-2">
          <label class="text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="localAbout.description"
            rows="4"
            placeholder="Tell your story..."
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          ></textarea>
        </div>

        <!-- Image -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Section Image URL</label>
            <input
              v-model="localAbout.image"
              type="url"
              placeholder="https://example.com/about-image.jpg"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Image Position</label>
            <select
              v-model="localAbout.imagePosition"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-if="localAbout.image" class="mt-4">
          <div class="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
            <img :src="localAbout.image" alt="About section image" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <!-- Highlights -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Highlights</h3>
          <p class="text-sm text-gray-500">Key points about your business</p>
        </div>
        <button
          @click="addHighlight"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      <div v-if="!localAbout.highlights?.length" class="text-center py-8 text-gray-500 text-sm">
        No highlights added yet. Click "Add" to create one.
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="(highlight, index) in localAbout.highlights"
          :key="index"
          class="flex items-center gap-2"
        >
          <svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <input
            v-model="localAbout.highlights[index]"
            type="text"
            placeholder="e.g., 10+ Years Experience"
            class="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            @click="removeHighlight(index)"
            class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Founder Info -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Founder / Owner</h3>
          <p class="text-sm text-gray-500">Add a personal touch with founder information</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="showFounder" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div v-if="showFounder" class="space-y-4 pt-4 border-t border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Founder Name -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="localAbout.founderName"
              type="text"
              placeholder="e.g., Jane Doe"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <!-- Founder Title -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="localAbout.founderTitle"
              type="text"
              placeholder="e.g., Founder & Lead Stylist"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <!-- Founder Photo -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Photo URL</label>
          <input
            v-model="localAbout.founderPhoto"
            type="url"
            placeholder="https://example.com/founder.jpg"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <!-- Photo Preview -->
        <div v-if="localAbout.founderPhoto" class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
            <img :src="localAbout.founderPhoto" alt="Founder photo" class="w-full h-full object-cover" />
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ localAbout.founderName || 'Founder Name' }}</p>
            <p class="text-sm text-gray-500">{{ localAbout.founderTitle || 'Title' }}</p>
          </div>
        </div>

        <!-- Founder Quote -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Quote</label>
          <textarea
            v-model="localAbout.founderQuote"
            rows="3"
            placeholder="e.g., Beauty is not just about looks, it's about feeling confident."
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Team Stats Toggle -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Show Team Stats</h3>
          <p class="text-sm text-gray-500">Display team size and experience metrics</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="localAbout.showTeamStats" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        @click="saveAbout"
        :disabled="saving"
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ saving ? 'Saving...' : 'Save About Section' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { AboutContent } from '@/types/branding'

const props = defineProps<{
  about: AboutContent
}>()

const emit = defineEmits<{
  (e: 'update', about: AboutContent): void
}>()

const saving = ref(false)

const localAbout = ref<AboutContent>({
  title: '',
  subtitle: '',
  description: '',
  image: '',
  imagePosition: 'right',
  highlights: [],
  founderName: '',
  founderPhoto: '',
  founderTitle: '',
  founderQuote: '',
  showTeamStats: false,
  ...props.about
})

const showFounder = computed({
  get: () => !!(localAbout.value.founderName || localAbout.value.founderPhoto || localAbout.value.founderQuote),
  set: (val: boolean) => {
    if (!val) {
      localAbout.value.founderName = ''
      localAbout.value.founderPhoto = ''
      localAbout.value.founderTitle = ''
      localAbout.value.founderQuote = ''
    }
  }
})

// Watch for prop changes
watch(() => props.about, (newVal) => {
  localAbout.value = { ...localAbout.value, ...newVal }
}, { deep: true })

const addHighlight = () => {
  if (!localAbout.value.highlights) {
    localAbout.value.highlights = []
  }
  localAbout.value.highlights.push('')
}

const removeHighlight = (index: number) => {
  localAbout.value.highlights?.splice(index, 1)
}

const saveAbout = async () => {
  saving.value = true
  try {
    // Filter out empty highlights
    const cleanedAbout = {
      ...localAbout.value,
      highlights: localAbout.value.highlights?.filter(h => h.trim()) || []
    }
    emit('update', cleanedAbout)
  } finally {
    saving.value = false
  }
}
</script>
