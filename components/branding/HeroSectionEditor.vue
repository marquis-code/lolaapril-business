<template>
  <div class="space-y-6">
    <!-- Hero Section Toggle -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Hero Section</h3>
          <p class="text-sm text-gray-500">Display a hero banner at the top of your storefront</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="hero.enabled" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>

    <template v-if="hero.enabled">
    <!-- Hero Type Selector -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Hero Type</h3>
        <p class="text-sm text-gray-500">Choose the background style for your hero section</p>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <button
          v-for="type in heroTypes"
          :key="type.value"
          @click="hero.type = type.value"
          :class="[
            'p-4 rounded-xl border-2 transition-all text-left',
            hero.type === type.value 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <component :is="type.icon" class="w-6 h-6 text-gray-600 mb-2" />
          <p class="font-medium text-sm text-gray-900">{{ type.label }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ type.description }}</p>
        </button>
      </div>
    </div>

    <!-- Hero Background Settings -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Background</h3>
        <p class="text-sm text-gray-500">Configure the hero background</p>
      </div>
      
      <!-- Image Upload -->
      <div v-if="hero.type === 'image'" class="space-y-4">
        <div 
          @click="!uploading && triggerImageUpload()"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          :class="[
            'relative h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all',
            uploading ? 'cursor-wait border-primary/50' : 'cursor-pointer',
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <img 
            v-if="hero.coverImage && !uploading" 
            :src="hero.coverImage" 
            alt="Hero background"
            class="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50"
          />
          
          <!-- Loading State -->
          <div v-if="uploading" class="relative z-10 text-center">
            <div class="w-12 h-12 mx-auto mb-3">
              <svg class="animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-primary">Uploading image...</p>
            <p class="text-xs text-gray-400 mt-1">Please wait</p>
          </div>
          
          <!-- Default State -->
          <div v-else class="relative z-10 text-center">
            <svg class="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm text-gray-600">{{ hero.coverImage ? 'Click to change image' : 'Click or drag to upload' }}</p>
            <p class="text-xs text-gray-400 mt-1">Recommended: 1920x600 or larger</p>
          </div>
        </div>
      </div>

      <!-- Gradient Settings -->
      <div v-if="hero.type === 'gradient'" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Start Color</label>
            <div class="flex items-center gap-2">
              <input 
                type="color" 
                v-model="gradient.from"
                class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input 
                v-model="gradient.from" 
                type="text" 
                class="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">End Color</label>
            <div class="flex items-center gap-2">
              <input 
                type="color" 
                v-model="gradient.to"
                class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input 
                v-model="gradient.to" 
                type="text" 
                class="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono"
              />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Gradient Direction</label>
          <select 
            v-model="gradient.direction"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="to-right">Left to Right</option>
            <option value="to-left">Right to Left</option>
            <option value="to-bottom">Top to Bottom</option>
            <option value="to-top">Bottom to Top</option>
            <option value="to-br">Diagonal (Top-Left to Bottom-Right)</option>
            <option value="to-bl">Diagonal (Top-Right to Bottom-Left)</option>
          </select>
        </div>
        
        <!-- Gradient Preview -->
        <div 
          class="h-24 rounded-xl"
          :style="gradientStyle"
        ></div>
      </div>

      <!-- Video URL or Upload -->
      <div v-if="hero.type === 'video'" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Video URL</label>
          <input 
            v-model="hero.videoUrl" 
            type="url" 
            placeholder="https://www.youtube.com/embed/..."
            class="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm"
          />
          <p class="text-xs text-gray-500">Supports YouTube and Vimeo embed URLs</p>
        </div>
        <div class="text-center text-sm text-gray-400">— or —</div>
        <button
          @click="triggerVideoUpload"
          :disabled="uploading"
          class="w-full h-12 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <template v-if="uploading">
            <svg class="animate-spin w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </template>
          <template v-else>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Video File
          </template>
        </button>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Content</h3>
        <p class="text-sm text-gray-500">Set your headline and subheadline</p>
      </div>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Headline</label>
          <input 
            v-model="hero.headline" 
            type="text" 
            placeholder="Welcome to Our Spa"
            class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Subheadline</label>
          <input 
            v-model="hero.subheadline" 
            type="text" 
            placeholder="Book your appointment today"
            class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Text Alignment</label>
            <select 
              v-model="hero.textAlignment"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Height</label>
            <input 
              v-model="hero.height" 
              type="text" 
              placeholder="500px"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay Settings -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Overlay</h3>
        <p class="text-sm text-gray-500">Add an overlay for better text readability</p>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Overlay Style</label>
          <select 
            v-model="hero.overlayStyle"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="none">None</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="gradient">Gradient</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Opacity: {{ Math.round(hero.overlayOpacity * 100) }}%</label>
          <input 
            type="range" 
            v-model.number="hero.overlayOpacity"
            min="0" 
            max="1" 
            step="0.1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </div>

    <!-- CTA Button -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Call-to-Action Button</h3>
          <p class="text-sm text-gray-500">Add a booking button to your hero</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="hero.showBookButton" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
      
      <div v-if="hero.showBookButton" class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Button Text</label>
        <input 
          v-model="hero.bookButtonText" 
          type="text" 
          placeholder="Book Now"
          class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
        />
      </div>
    </div>

    </template>

    <!-- Hidden File Inputs -->
    <input 
      ref="imageInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageSelect"
    />
    <input 
      ref="videoInput"
      type="file"
      accept="video/*"
      class="hidden"
      @change="handleVideoSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, h, watch } from 'vue'
import type { HeroSection } from '@/types/branding'

const props = defineProps<{
  hero: HeroSection
  uploading?: boolean
}>()

const emit = defineEmits(['update:hero', 'uploadImage', 'uploadVideo'])

const dragOver = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)
const videoInput = ref<HTMLInputElement | null>(null)

// Ensure gradient object exists with defaults
const gradient = computed({
  get: () => props.hero.gradient || { from: '#3B82F6', to: '#8B5CF6', direction: 'to-right' as const },
  set: (value) => {
    emit('update:hero', { ...props.hero, gradient: value })
  }
})

// Initialize gradient when type changes to gradient
watch(() => props.hero.type, (newType) => {
  if (newType === 'gradient' && !props.hero.gradient) {
    emit('update:hero', { 
      ...props.hero, 
      gradient: { from: '#3B82F6', to: '#8B5CF6', direction: 'to-right' }
    })
  }
}, { immediate: true })

// Trigger file input clicks
const triggerImageUpload = () => imageInput.value?.click()
const triggerVideoUpload = () => videoInput.value?.click()

// Handle file selection
const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('uploadImage', file)
  }
  target.value = '' // Reset input
}

const handleVideoSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('uploadVideo', file)
  }
  target.value = '' // Reset input
}

const heroTypes = [
  {
    value: 'image',
    label: 'Image',
    description: 'Upload a background image',
    icon: () => h('svg', { class: 'w-6 h-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  },
  {
    value: 'gradient',
    label: 'Gradient',
    description: 'Use a color gradient',
    icon: () => h('svg', { class: 'w-6 h-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' })
    ])
  },
  {
    value: 'video',
    label: 'Video',
    description: 'Embed a video background',
    icon: () => h('svg', { class: 'w-6 h-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' })
    ])
  }
]

const gradientStyle = computed(() => {
  const direction = {
    'to-right': 'to right',
    'to-left': 'to left',
    'to-bottom': 'to bottom',
    'to-top': 'to top',
    'to-br': 'to bottom right',
    'to-bl': 'to bottom left'
  }[props.hero.gradient?.direction || 'to-right']
  
  return {
    background: `linear-gradient(${direction}, ${props.hero.gradient?.from || '#3B82F6'}, ${props.hero.gradient?.to || '#8B5CF6'})`
  }
})

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    emit('uploadImage', file)
  }
  dragOver.value = false
}
</script>
