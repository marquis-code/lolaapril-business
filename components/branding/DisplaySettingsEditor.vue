<template>
  <div class="space-y-6">
    <!-- Service Display Settings -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Services Display</h3>
        <p class="text-sm text-gray-500">Customize how your services appear to customers</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Layout -->
        <div class="space-y-4">
          <label class="text-sm font-medium text-gray-700">Layout Style</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="layout in serviceLayouts"
              :key="layout.value"
              @click="serviceDisplay.layout = layout.value"
              :class="[
                'p-3 rounded-xl border-2 transition-all text-center',
                serviceDisplay.layout === layout.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <component :is="layout.icon" class="w-5 h-5 mx-auto mb-1" />
              <span class="text-xs font-medium">{{ layout.label }}</span>
            </button>
          </div>
        </div>

        <!-- Columns -->
        <div class="space-y-4">
          <label class="text-sm font-medium text-gray-700">Columns: {{ serviceDisplay.columns }}</label>
          <input 
            type="range" 
            v-model.number="serviceDisplay.columns"
            min="1" 
            max="4" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div class="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>
      </div>

      <!-- Visibility Options -->
      <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="serviceDisplay.showPrices" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Prices</p>
            <p class="text-xs text-gray-500">Display service pricing</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="serviceDisplay.showDuration" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Duration</p>
            <p class="text-xs text-gray-500">Display service time</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="serviceDisplay.showDescription" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Description</p>
            <p class="text-xs text-gray-500">Display service details</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="serviceDisplay.showImages" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Images</p>
            <p class="text-xs text-gray-500">Display service photos</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="serviceDisplay.groupByCategory" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Group by Category</p>
            <p class="text-xs text-gray-500">Organize by service type</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="serviceDisplay.showBookButton" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Book Button</p>
            <p class="text-xs text-gray-500">Show on service cards</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="serviceDisplay.showFilters" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Filters</p>
            <p class="text-xs text-gray-500">Enable search/filter</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Staff Display Settings -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Staff Display</h3>
        <p class="text-sm text-gray-500">Customize how your team appears to customers</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Layout -->
        <div class="space-y-4">
          <label class="text-sm font-medium text-gray-700">Layout Style</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="layout in staffLayouts"
              :key="layout.value"
              @click="staffDisplay.layout = layout.value"
              :class="[
                'p-3 rounded-xl border-2 transition-all text-center',
                staffDisplay.layout === layout.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <component :is="layout.icon" class="w-5 h-5 mx-auto mb-1" />
              <span class="text-xs font-medium">{{ layout.label }}</span>
            </button>
          </div>
        </div>

        <!-- Columns -->
        <div class="space-y-4">
          <label class="text-sm font-medium text-gray-700">Columns: {{ staffDisplay.columns }}</label>
          <input 
            type="range" 
            v-model.number="staffDisplay.columns"
            min="2" 
            max="6" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div class="flex justify-between text-xs text-gray-500">
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
          </div>
        </div>
      </div>

      <!-- Visibility Options -->
      <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="staffDisplay.showBio" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Bio</p>
            <p class="text-xs text-gray-500">Display staff bio</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="staffDisplay.showSpecialties" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Specialties</p>
            <p class="text-xs text-gray-500">Show expertise</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="staffDisplay.showRatings" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Ratings</p>
            <p class="text-xs text-gray-500">Display reviews</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="staffDisplay.showAvailability" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Availability</p>
            <p class="text-xs text-gray-500">Show status</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="staffDisplay.showSocialLinks" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Social Links</p>
            <p class="text-xs text-gray-500">Social profiles</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="staffDisplay.showBookButton" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Book Button</p>
            <p class="text-xs text-gray-500">Per-staff booking</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Testimonials Display -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Testimonials Display</h3>
          <p class="text-sm text-gray-500">Configure customer reviews section</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="testimonials.enabled" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div v-if="testimonials.enabled" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Layout</label>
            <select 
              v-model="testimonials.layout"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
            >
              <option value="carousel">Carousel</option>
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Max to Show</label>
            <input 
              type="number" 
              v-model.number="testimonials.maxToShow"
              min="1"
              max="20"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div v-if="testimonials.layout === 'carousel' && testimonials.autoplay" class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Autoplay Interval (ms)</label>
            <input 
              type="number" 
              v-model.number="testimonials.autoplayInterval"
              min="1000"
              max="10000"
              step="500"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="testimonials.showRating" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Star Rating</p>
            </div>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="testimonials.showPhoto" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Client Photo</p>
            </div>
          </label>
          <label v-if="testimonials.layout === 'carousel'" class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="testimonials.autoplay" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Autoplay</p>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Contact Section Settings -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Contact Section</h3>
        <p class="text-sm text-gray-500">Configure what information to display</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="contact.showMap" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Map</p>
            <p class="text-xs text-gray-500">Display location map</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="contact.showAddress" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Address</p>
            <p class="text-xs text-gray-500">Display full address</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="contact.showPhone" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Phone</p>
            <p class="text-xs text-gray-500">Display phone number</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="contact.showEmail" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Email</p>
            <p class="text-xs text-gray-500">Display email address</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="contact.showSocialLinks" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Social Links</p>
            <p class="text-xs text-gray-500">Show social media</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="contact.showBusinessHours" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Business Hours</p>
            <p class="text-xs text-gray-500">Display opening hours</p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import type { ServiceDisplaySettings, StaffDisplaySettings, TestimonialsSettings, ContactDisplaySettings } from '@/types/branding'

const props = defineProps<{
  serviceDisplay?: ServiceDisplaySettings
  staffDisplay?: StaffDisplaySettings
  testimonials?: TestimonialsSettings
  contact?: ContactDisplaySettings
}>()

const emit = defineEmits<{
  'update:serviceDisplay': [value: ServiceDisplaySettings]
  'update:staffDisplay': [value: StaffDisplaySettings]
  'update:testimonials': [value: TestimonialsSettings]
  'update:contact': [value: ContactDisplaySettings]
}>()

// Create local reactive copies with defaults
const serviceDisplay = computed({
  get: () => props.serviceDisplay || getDefaultServiceDisplay(),
  set: (value) => emit('update:serviceDisplay', value)
})

const staffDisplay = computed({
  get: () => props.staffDisplay || getDefaultStaffDisplay(),
  set: (value) => emit('update:staffDisplay', value)
})

const testimonials = computed({
  get: () => props.testimonials || getDefaultTestimonials(),
  set: (value) => emit('update:testimonials', value)
})

const contact = computed({
  get: () => props.contact || getDefaultContact(),
  set: (value) => emit('update:contact', value)
})

function getDefaultServiceDisplay(): ServiceDisplaySettings {
  return {
    layout: 'grid',
    columns: 3,
    showPrices: true,
    showDuration: true,
    showDescription: true,
    showImages: true,
    groupByCategory: true,
    showFilters: false,
    showBookButton: true
  }
}

function getDefaultStaffDisplay(): StaffDisplaySettings {
  return {
    layout: 'grid',
    columns: 4,
    showBio: true,
    showSpecialties: true,
    showRatings: true,
    showBookButton: false,
    showAvailability: false,
    showSocialLinks: true
  }
}

function getDefaultTestimonials(): TestimonialsSettings {
  return {
    enabled: true,
    showRating: true,
    showPhoto: true,
    layout: 'carousel',
    maxToShow: 6,
    autoplay: true,
    autoplayInterval: 5000
  }
}

function getDefaultContact(): ContactDisplaySettings {
  return {
    showMap: true,
    showAddress: true,
    showPhone: true,
    showEmail: true,
    showSocialLinks: true,
    showBusinessHours: true
  }
}

const serviceLayouts = [
  {
    value: 'grid',
    label: 'Grid',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
    ])
  },
  {
    value: 'list',
    label: 'List',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 12h16M4 18h16' })
    ])
  },
  {
    value: 'cards',
    label: 'Cards',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
    ])
  }
]

const staffLayouts = [
  {
    value: 'grid',
    label: 'Grid',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
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
    value: 'list',
    label: 'List',
    icon: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 12h16M4 18h16' })
    ])
  }
]
</script>
