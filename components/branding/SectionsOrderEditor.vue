<template>
  <div class="space-y-6">
    <!-- Section Order Info -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
        <div>
          <h4 class="font-medium text-blue-900">Drag & Drop Ordering</h4>
          <p class="text-sm text-blue-700 mt-1">Drag sections to reorder them. Toggle visibility to show/hide sections on your storefront.</p>
        </div>
      </div>
    </div>

    <!-- Sections List -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Page Sections</h3>
          <p class="text-sm text-gray-500">Organize and customize your storefront sections</p>
        </div>
        
        <!-- Add Section Dropdown -->
        <div class="relative">
          <button
            @click="showAddMenu = !showAddMenu"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Section
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="showAddMenu"
            class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
          >
            <button
              v-for="sectionType in availableSectionTypes"
              :key="sectionType.type"
              @click="addSection(sectionType.type)"
              :disabled="isSectionTypeUsed(sectionType.type) && !sectionType.allowMultiple"
              :class="[
                'w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm transition-colors',
                isSectionTypeUsed(sectionType.type) && !sectionType.allowMultiple
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', sectionType.bgColor]">
                <component :is="getSectionIcon(sectionType.type)" :class="['w-4 h-4', sectionType.iconColor]" />
              </div>
              <div>
                <p class="font-medium">{{ sectionType.label }}</p>
                <p class="text-xs text-gray-500">{{ sectionType.description }}</p>
              </div>
              <svg v-if="isSectionTypeUsed(sectionType.type) && !sectionType.allowMultiple" class="w-4 h-4 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!sections?.length" class="p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h4 class="text-lg font-medium text-gray-900 mb-1">No sections yet</h4>
        <p class="text-sm text-gray-500 mb-4">Add your first section to start building your storefront</p>
        <button
          @click="showAddMenu = true"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Section
        </button>
      </div>
      
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="(section, index) in sortedSections"
          :key="section.id"
          :draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover.prevent="handleDragOver($event, index)"
          @drop.prevent="handleDrop($event, index)"
          @dragend="handleDragEnd"
          :class="[
            'p-5 transition-all cursor-move',
            draggedIndex === index ? 'opacity-50 bg-gray-50' : '',
            dropTargetIndex === index ? 'border-t-2 border-primary' : '',
            !section.enabled ? 'bg-gray-50' : 'hover:bg-gray-50'
          ]"
        >
          <div class="flex items-center gap-4">
            <!-- Drag Handle -->
            <div class="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
              </svg>
            </div>

            <!-- Section Icon -->
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              section.enabled ? getSectionColor(section.type).bg : 'bg-gray-100'
            ]">
              <component 
                :is="getSectionIcon(section.type)" 
                :class="['w-5 h-5', section.enabled ? getSectionColor(section.type).text : 'text-gray-400']" 
              />
            </div>

            <!-- Section Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <input
                  v-model="section.title"
                  type="text"
                  :class="[
                    'font-medium bg-transparent border-0 p-0 focus:ring-0 text-sm',
                    section.enabled ? 'text-gray-900' : 'text-gray-500'
                  ]"
                  @blur="$emit('updateSection', section)"
                />
                <span :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                  section.enabled ? getSectionColor(section.type).badge : 'bg-gray-100 text-gray-500'
                ]">
                  {{ section.type }}
                </span>
              </div>
              <p v-if="section.subtitle" class="text-xs text-gray-500 mt-1">{{ section.subtitle }}</p>
            </div>

            <!-- Order Badge -->
            <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
              {{ section.order }}
            </div>

            <!-- Toggle Switch -->
            <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input 
                v-model="section.enabled" 
                type="checkbox" 
                class="sr-only peer"
                @change="$emit('toggleSection', section.id)"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>

            <!-- Expand/Settings Button -->
            <button
              @click="toggleExpanded(section.id)"
              :class="[
                'p-2 rounded-lg transition-colors',
                expandedSections.includes(section.id) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'
              ]"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- Delete Button -->
            <button
              @click="confirmDeleteSection(section)"
              class="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Delete section"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Expanded Settings -->
          <div 
            v-if="expandedSections.includes(section.id)"
            class="mt-4 pt-4 border-t border-gray-100 space-y-4"
          >
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-medium text-gray-600">Section Title</label>
                <input 
                  v-model="section.title" 
                  type="text" 
                  class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm"
                  @blur="$emit('updateSection', section)"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium text-gray-600">Subtitle</label>
                <input 
                  v-model="section.subtitle" 
                  type="text" 
                  class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm"
                  placeholder="Optional subtitle"
                  @blur="$emit('updateSection', section)"
                />
              </div>
            </div>

            <!-- Section-specific settings slot -->
            <slot :name="`section-settings-${section.type}`" :section="section"></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="sectionToDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Delete Section</h3>
            <p class="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete the <strong>{{ sectionToDelete.title }}</strong> section?
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="sectionToDelete = null"
            class="px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteSection"
            class="px-4 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete Section
          </button>
        </div>
      </div>
    </div>

    <!-- Enabled Sections Summary -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <h4 class="text-sm font-semibold text-gray-900 mb-3">Preview Order</h4>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="section in enabledSections" 
          :key="section.id"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium',
            getSectionColor(section.type).badge
          ]"
        >
          {{ section.order }}. {{ section.title }}
        </span>
        <span v-if="enabledSections.length === 0" class="text-sm text-gray-500">
          No sections enabled
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import type { StorefrontSection } from '@/types/branding'

const props = defineProps<{
  sections: StorefrontSection[]
}>()

const emit = defineEmits(['updateOrder', 'toggleSection', 'updateSection', 'addSection', 'deleteSection'])

const expandedSections = ref<string[]>([])
const draggedIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)
const showAddMenu = ref(false)
const sectionToDelete = ref<StorefrontSection | null>(null)

// Available section types
const availableSectionTypes = [
  { type: 'services', label: 'Services', description: 'Display your services', bgColor: 'bg-violet-100', iconColor: 'text-violet-600', allowMultiple: false },
  { type: 'staff', label: 'Staff / Team', description: 'Showcase your team', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', allowMultiple: false },
  { type: 'gallery', label: 'Gallery', description: 'Image gallery', bgColor: 'bg-pink-100', iconColor: 'text-pink-600', allowMultiple: false },
  { type: 'testimonials', label: 'Testimonials', description: 'Customer reviews', bgColor: 'bg-amber-100', iconColor: 'text-amber-600', allowMultiple: false },
  { type: 'about', label: 'About', description: 'About your business', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600', allowMultiple: false },
  { type: 'contact', label: 'Contact', description: 'Contact information', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600', allowMultiple: false },
  { type: 'faq', label: 'FAQ', description: 'Frequently asked questions', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', allowMultiple: false },
  { type: 'map', label: 'Map', description: 'Location map', bgColor: 'bg-teal-100', iconColor: 'text-teal-600', allowMultiple: false },
  { type: 'hours', label: 'Business Hours', description: 'Opening hours', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600', allowMultiple: false },
  { type: 'custom', label: 'Custom Block', description: 'Custom content section', bgColor: 'bg-gray-100', iconColor: 'text-gray-600', allowMultiple: true }
]

// Check if a section type is already used
const isSectionTypeUsed = (type: string) => {
  return props.sections?.some(s => s.type === type) || false
}

// Add new section
const addSection = (type: string) => {
  const sectionType = availableSectionTypes.find(s => s.type === type)
  if (!sectionType) return
  
  const newSection: StorefrontSection = {
    id: `${type}-${Date.now()}`,
    type: type as StorefrontSection['type'],
    title: sectionType.label,
    subtitle: '',
    enabled: true,
    order: (props.sections?.length || 0)
  }
  
  emit('addSection', newSection)
  showAddMenu.value = false
}

// Delete section
const confirmDeleteSection = (section: StorefrontSection) => {
  sectionToDelete.value = section
}

const deleteSection = () => {
  if (sectionToDelete.value) {
    emit('deleteSection', sectionToDelete.value.id)
    sectionToDelete.value = null
  }
}

// Close dropdown on outside click
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showAddMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const sortedSections = computed(() => {
  return [...(props.sections || [])].sort((a, b) => a.order - b.order)
})

const enabledSections = computed(() => {
  return sortedSections.value.filter(s => s.enabled)
})

const toggleExpanded = (id: string) => {
  const idx = expandedSections.value.indexOf(id)
  if (idx >= 0) {
    expandedSections.value.splice(idx, 1)
  } else {
    expandedSections.value.push(id)
  }
}

const handleDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (event: DragEvent, index: number) => {
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    dropTargetIndex.value = index
  }
}

const handleDrop = (event: DragEvent, targetIndex: number) => {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    emit('updateOrder', draggedIndex.value, targetIndex)
  }
  draggedIndex.value = null
  dropTargetIndex.value = null
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dropTargetIndex.value = null
}

const getSectionColor = (type: string) => {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    services: { bg: 'bg-violet-50', text: 'text-violet-600', badge: 'bg-violet-50 text-violet-700' },
    staff: { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700' },
    gallery: { bg: 'bg-pink-50', text: 'text-pink-600', badge: 'bg-pink-50 text-pink-700' },
    testimonials: { bg: 'bg-amber-50', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700' },
    about: { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
    contact: { bg: 'bg-cyan-50', text: 'text-cyan-600', badge: 'bg-cyan-50 text-cyan-700' },
    faq: { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-700' },
    map: { bg: 'bg-teal-50', text: 'text-teal-600', badge: 'bg-teal-50 text-teal-700' },
    hours: { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-700' },
    custom: { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-50 text-gray-700' }
  }
  return colors[type] || { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' }
}

const getSectionIcon = (type: string) => {
  const icons: Record<string, any> = {
    services: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
    ]),
    staff: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
    ]),
    gallery: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ]),
    testimonials: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
    ]),
    about: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    contact: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
    ]),
    faq: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    map: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })
    ]),
    hours: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    custom: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' })
    ])
  }
  return icons[type] || icons.services
}
</script>
