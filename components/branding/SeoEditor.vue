<template>
  <div class="space-y-6">
    <!-- SEO Overview -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h4 class="font-medium text-indigo-900">Search Engine Optimization</h4>
          <p class="text-sm text-indigo-700 mt-1">Configure how your storefront appears in search results. Good SEO helps potential clients find your business online.</p>
        </div>
      </div>
    </div>

    <!-- Basic SEO -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Basic SEO</h3>
        <p class="text-sm text-gray-500">Set up essential meta tags for search engines</p>
      </div>
      
      <div class="space-y-4">
        <!-- Meta Title -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Meta Title</label>
            <span :class="[
              'text-xs',
              (seo.title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'
            ]">
              {{ seo.title?.length || 0 }} / 60
            </span>
          </div>
          <input 
            v-model="seo.title" 
            type="text" 
            placeholder="Your Business Name - Booking & Services"
            class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p class="text-xs text-gray-500">The title that appears in search engine results. Keep it under 60 characters.</p>
        </div>

        <!-- Meta Description -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Meta Description</label>
            <span :class="[
              'text-xs',
              (seo.description?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'
            ]">
              {{ seo.description?.length || 0 }} / 160
            </span>
          </div>
          <textarea 
            v-model="seo.description" 
            rows="3"
            placeholder="A brief description of your business and services. This appears in search results below the title."
            class="w-full p-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          ></textarea>
          <p class="text-xs text-gray-500">Keep between 120-160 characters for best results.</p>
        </div>

        <!-- Keywords -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Keywords</label>
          <input 
            v-model="seo.keywords" 
            type="text" 
            placeholder="spa, massage, beauty salon, wellness, booking"
            class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p class="text-xs text-gray-500">Comma-separated keywords related to your business.</p>
        </div>
      </div>
    </div>

    <!-- Search Preview -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Search Preview</h3>
        <p class="text-sm text-gray-500">How your page may appear in Google search results</p>
      </div>
      
      <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <div class="space-y-1">
          <p class="text-xs text-emerald-700">{{ previewUrl }}</p>
          <h4 class="text-lg text-blue-600 hover:underline cursor-pointer font-medium">
            {{ seo.title || 'Your Business Name' }}
          </h4>
          <p class="text-sm text-gray-600 line-clamp-2">
            {{ seo.description || 'Add a meta description to see how it appears in search results.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Social Media Preview -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Social Media Sharing</h3>
        <p class="text-sm text-gray-500">Configure Open Graph tags for social media previews</p>
      </div>
      
      <div class="space-y-4">
        <!-- OG Title -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Social Title (og:title)</label>
          <input 
            v-model="seo.ogTitle" 
            type="text" 
            :placeholder="seo.title || 'Same as meta title'"
            class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p class="text-xs text-gray-500">Leave empty to use the meta title.</p>
        </div>

        <!-- OG Description -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Social Description (og:description)</label>
          <textarea 
            v-model="seo.ogDescription" 
            rows="2"
            :placeholder="seo.description || 'Same as meta description'"
            class="w-full p-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          ></textarea>
        </div>

        <!-- OG Image -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Social Image (og:image)</label>
          <div 
            @click="triggerOgImageUpload"
            class="relative h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border-gray-200 hover:border-gray-300"
          >
            <img 
              v-if="seo.ogImage" 
              :src="seo.ogImage" 
              alt="OG Image"
              class="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            <div v-else class="text-center">
              <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm text-gray-500">Click to upload</p>
              <p class="text-xs text-gray-400">Recommended: 1200x630px</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Preview Card -->
      <div class="mt-6">
        <p class="text-xs text-gray-500 mb-3">Facebook/LinkedIn Preview</p>
        <div class="border rounded-xl overflow-hidden max-w-md">
          <div class="h-32 bg-gray-200 flex items-center justify-center">
            <img 
              v-if="seo.ogImage" 
              :src="seo.ogImage" 
              alt="Preview"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-gray-400 text-sm">No image</span>
          </div>
          <div class="p-3 bg-gray-50">
            <p class="text-xs text-gray-500 uppercase">{{ previewDomain }}</p>
            <h5 class="font-semibold text-sm text-gray-900 line-clamp-1">
              {{ seo.ogTitle || seo.title || 'Your Business Name' }}
            </h5>
            <p class="text-xs text-gray-500 line-clamp-2">
              {{ seo.ogDescription || seo.description || 'Add a description' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced SEO -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Advanced Settings</h3>
        <p class="text-sm text-gray-500">Additional SEO configurations</p>
      </div>
      
      <div class="space-y-4">
        <!-- Canonical URL -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Canonical URL</label>
          <input 
            v-model="seo.canonicalUrl" 
            type="url" 
            placeholder="https://yourbusiness.com/book"
            class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p class="text-xs text-gray-500">Set if you have multiple URLs pointing to this page.</p>
        </div>

        <!-- Robots -->
        <div class="grid grid-cols-2 gap-4">
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="seo.indexable" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Allow Indexing</p>
              <p class="text-xs text-gray-500">Let search engines index this page</p>
            </div>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="seo.followLinks" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Follow Links</p>
              <p class="text-xs text-gray-500">Allow crawling of page links</p>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input 
      ref="ogImageInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleOgImageSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SeoConfig } from '@/types/branding'

const props = defineProps<{
  seo: SeoConfig
  subdomain?: string
}>()

const emit = defineEmits(['uploadOgImage', 'update:seo'])

const ogImageInput = ref<HTMLInputElement | null>(null)

// Trigger file input
const triggerOgImageUpload = () => ogImageInput.value?.click()

// Handle file selection
const handleOgImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('uploadOgImage', file)
  }
  target.value = '' // Reset input
}

const previewUrl = computed(() => {
  return `https://${props.subdomain || 'yourbusiness'}.lolaapril.com`
})

const previewDomain = computed(() => {
  return `${props.subdomain || 'yourbusiness'}.lolaapril.com`
})
</script>
