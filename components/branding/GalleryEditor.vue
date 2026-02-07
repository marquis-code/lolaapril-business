<template>
  <div class="space-y-6">
    <!-- Gallery Toggle -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Gallery Section</h3>
          <p class="text-sm text-gray-500">Showcase your work with an image gallery</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="gallery.enabled" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>

    <div v-if="gallery.enabled" class="space-y-6">
      <!-- Gallery Layout -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Gallery Layout</h3>
          <p class="text-sm text-gray-500">Choose how images are displayed</p>
        </div>
        
        <div class="grid grid-cols-4 gap-4">
          <button
            v-for="layout in layoutOptions"
            :key="layout.value"
            @click="gallery.layout = layout.value"
            :class="[
              'p-4 rounded-xl border-2 transition-all text-center',
              gallery.layout === layout.value 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <component :is="layout.icon" class="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <p class="text-xs font-medium text-gray-900">{{ layout.label }}</p>
          </button>
        </div>

        <div v-if="gallery.layout === 'grid'" class="mt-4 space-y-3">
          <label class="text-sm font-medium text-gray-700">Columns: {{ gallery.columns }}</label>
          <input 
            type="range" 
            v-model.number="gallery.columns"
            min="2" 
            max="5" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div class="flex justify-between text-xs text-gray-500">
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      </div>

      <!-- Upload Images -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Gallery Images</h3>
            <p class="text-sm text-gray-500">{{ gallery.images?.length || 0 }} images uploaded</p>
          </div>
          <button
            @click="triggerUpload"
            :disabled="uploading"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <svg v-if="uploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ uploading ? 'Uploading...' : 'Add Images' }}
          </button>
        </div>

        <!-- Upload Area -->
        <div 
          v-if="!gallery.images?.length"
          @click="triggerUpload"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          :class="[
            'h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all',
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-600 font-medium">Drop images here or click to upload</p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
        </div>

        <!-- Images Grid -->
        <div 
          v-else
          class="grid gap-4"
          :class="{
            'grid-cols-2': gallery.columns === 2,
            'grid-cols-3': gallery.columns === 3,
            'grid-cols-4': gallery.columns === 4,
            'grid-cols-5': gallery.columns === 5
          }"
        >
          <div 
            v-for="(image, index) in gallery.images" 
            :key="index"
            class="relative group aspect-square rounded-xl overflow-hidden bg-gray-100"
            :draggable="true"
            @dragstart="handleImageDragStart($event, index)"
            @dragover.prevent="handleImageDragOver($event, index)"
            @drop.prevent="handleImageDrop($event, index)"
          >
            <img 
              :src="image" 
              :alt="`Gallery image ${index + 1}`"
              class="w-full h-full object-cover"
            />
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <!-- Drag Handle -->
              <div class="p-2 bg-white/20 rounded-lg cursor-move text-white">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>
              <!-- Delete -->
              <button
                @click="$emit('removeImage', index)"
                class="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Order Badge -->
            <div class="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-xs font-medium text-gray-700">
              {{ index + 1 }}
            </div>
          </div>

          <!-- Add More -->
          <div 
            @click="$emit('uploadImage')"
            class="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
          >
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-xs text-gray-500 mt-1">Add More</span>
          </div>
        </div>

        <p v-if="gallery.images?.length" class="text-xs text-gray-500 mt-4">
          <span class="font-medium">Tip:</span> Drag images to reorder them. The first image will be featured.
        </p>
      </div>

      <!-- Gallery Style -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Display Options</h3>
          <p class="text-sm text-gray-500">Additional gallery settings</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="gallery.showLightbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Lightbox</p>
              <p class="text-xs text-gray-500">Click to enlarge</p>
            </div>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="gallery.showCaptions" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Captions</p>
              <p class="text-xs text-gray-500">Show image titles</p>
            </div>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="gallery.autoplay" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Autoplay</p>
              <p class="text-xs text-gray-500">For carousel layout</p>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input 
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import type { GallerySettings } from '@/types/branding'

const props = defineProps<{
  gallery: GallerySettings
  uploading?: boolean
}>()

const emit = defineEmits(['uploadImage', 'uploadImages', 'removeImage', 'reorderImages'])

const dragOver = ref(false)
const draggedImageIndex = ref<number | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Trigger file input
const triggerUpload = () => fileInput.value?.click()

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    emit('uploadImages', Array.from(files))
  }
  target.value = '' // Reset input
}

// Handle drag and drop upload
const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      emit('uploadImages', imageFiles)
    }
  }
  dragOver.value = false
}

const layoutOptions = [
  {
    value: 'grid',
    label: 'Grid',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
    ])
  },
  {
    value: 'masonry',
    label: 'Masonry',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 11a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z' })
    ])
  },
  {
    value: 'carousel',
    label: 'Carousel',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4' })
    ])
  },
  {
    value: 'featured',
    label: 'Featured',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 10h16M4 14h16M4 18h16' })
    ])
  }
]

const handleImageDragStart = (event: DragEvent, index: number) => {
  draggedImageIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleImageDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
}

const handleImageDrop = (event: DragEvent, targetIndex: number) => {
  if (draggedImageIndex.value !== null && draggedImageIndex.value !== targetIndex) {
    emit('reorderImages', draggedImageIndex.value, targetIndex)
  }
  draggedImageIndex.value = null
}
</script>
