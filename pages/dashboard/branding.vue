<template>
  <div class="min-h-screen bg-white/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Brand Studio</h1>
          <p class="text-gray-500 mt-1">Design and customize your digital storefront</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="refreshAll"
            :disabled="isRefreshing"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg :class="['w-4 h-4', isRefreshing && 'animate-spin']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
          </button>
        </div>
      </div>

      <!-- Setup Progress Banner -->
      <div v-if="overview" class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold">Branding Setup Progress</h2>
            <p class="text-white/80 text-sm mt-1">Complete your brand setup to maximize your store's appeal</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-3xl font-bold">{{ overview?.summary?.setupProgress || 0 }}%</p>
              <p class="text-white/80 text-sm">Complete</p>
            </div>
            <div class="w-32 h-32 relative">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.2)" stroke-width="10" fill="none" />
                <circle 
                  cx="50" cy="50" r="45" 
                  stroke="white" 
                  stroke-width="10" 
                  fill="none" 
                  :stroke-dasharray="283"
                  :stroke-dashoffset="283 - (283 * (overview?.summary?.setupProgress || 0)) / 100"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <!-- Progress Checklist -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="flex items-center gap-2">
            <div :class="['w-5 h-5 rounded-full flex items-center justify-center', overview?.theme?.isCustomized ? 'bg-white' : 'bg-white/20']">
              <svg v-if="overview?.theme?.isCustomized" class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm">Theme Customized</span>
          </div>
          <div class="flex items-center gap-2">
            <div :class="['w-5 h-5 rounded-full flex items-center justify-center', overview?.customDomains?.verified > 0 ? 'bg-white' : 'bg-white/20']">
              <svg v-if="overview?.customDomains?.verified > 0" class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm">Domain Connected</span>
          </div>
          <div class="flex items-center gap-2">
            <div :class="['w-5 h-5 rounded-full flex items-center justify-center', (overview?.emailTemplates?.total || 0) > 0 ? 'bg-white' : 'bg-white/20']">
              <svg v-if="(overview?.emailTemplates?.total || 0) > 0" class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm">Email Templates</span>
          </div>
          <div class="flex items-center gap-2">
            <div :class="['w-5 h-5 rounded-full flex items-center justify-center', (overview?.widgets?.total || 0) > 0 ? 'bg-white' : 'bg-white/20']">
              <svg v-if="(overview?.widgets?.total || 0) > 0" class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm">Widget Created</span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ overview?.theme?.isCustomized ? 'Custom' : 'Default' }}</p>
              <p class="text-xs text-gray-500">Theme Status</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ overview?.customDomains?.total || 0 }}</p>
              <p class="text-xs text-gray-500">Custom Domains</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ overview?.emailTemplates?.total || 0 }}</p>
              <p class="text-xs text-gray-500">Email Templates</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ overview?.widgets?.total || 0 }}</p>
              <p class="text-xs text-gray-500">Booking Widgets</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-xl border border-gray-100 p-1.5">
        <div class="flex overflow-x-auto gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
            <span 
              v-if="tab.count !== undefined && tab.count > 0"
              :class="[
                'px-1.5 py-0.5 rounded-full text-xs',
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="transition-all duration-300">
        <!-- Theme Designer Tab -->
        <div v-if="activeTab === 'theme'" class="space-y-6">
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Theme Editor -->
            <div class="xl:col-span-2 space-y-6">
              <!-- Color Palette -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Color Palette</h3>
                    <p class="text-sm text-gray-500">Define your brand colors</p>
                  </div>
                  <button 
                    @click="resetColors"
                    class="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Reset to defaults
                  </button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="(color, key) in theme.colors" :key="key" class="space-y-2">
                    <label class="text-xs font-medium text-gray-600 capitalize">{{ formatColorLabel(key) }}</label>
                    <div class="relative">
                      <input 
                        v-model="theme.colors[key]" 
                        type="color" 
                        class="w-full h-12 rounded-xl border-2 border-gray-100 cursor-pointer appearance-none"
                        :style="{ backgroundColor: theme.colors[key] }"
                      />
                      <input 
                        v-model="theme.colors[key]" 
                        type="text" 
                        class="absolute bottom-0 left-0 right-0 text-center text-xs bg-white/90 py-1 rounded-b-xl border-t border-gray-100"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Typography -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Typography</h3>
                  <p class="text-sm text-gray-500">Choose your fonts</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600">Font Family</label>
                    <select 
                      v-model="theme.typography.fontFamily" 
                      class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option v-for="font in fontOptions" :key="font" :value="font">{{ font.split(',')[0] }}</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600">Heading Font</label>
                    <select 
                      v-model="theme.typography.headingFont" 
                      class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option v-for="font in fontOptions" :key="font" :value="font">{{ font.split(',')[0] }}</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600">Body Font</label>
                    <select 
                      v-model="theme.typography.bodyFont" 
                      class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option v-for="font in fontOptions" :key="font" :value="font">{{ font.split(',')[0] }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Logo & Favicon -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Brand Assets</h3>
                  <p class="text-sm text-gray-500">Upload your logo and favicon</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Logo Upload -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium text-gray-700">Logo</label>
                      <span v-if="logoUploading" class="text-xs text-primary flex items-center gap-1">
                        <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                      <span v-else class="text-xs text-gray-400">Max 2MB</span>
                    </div>
                    <div 
                      @click="!logoUploading && triggerLogoUpload()"
                      @dragover.prevent="logoDragOver = true"
                      @dragleave="logoDragOver = false"
                      @drop.prevent="handleLogoDrop"
                      :class="[
                        'relative h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all',
                        logoUploading ? 'cursor-wait opacity-60' : 'cursor-pointer',
                        logoDragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                      ]"
                    >
                      <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoUpload" :disabled="logoUploading" />
                      <!-- Loading overlay -->
                      <div v-if="logoUploading" class="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                        <div class="flex flex-col items-center gap-2">
                          <svg class="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span class="text-sm text-gray-600">Uploading to cloud...</span>
                        </div>
                      </div>
                      <img 
                        v-else-if="theme.logo.url" 
                        :src="theme.logo.url" 
                        :alt="theme.logo.alt"
                        class="max-h-32 max-w-full object-contain"
                      />
                      <template v-else>
                        <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-sm text-gray-500 mt-2">Click or drag to upload logo</p>
                      </template>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                      <div>
                        <label class="text-xs text-gray-500">Width</label>
                        <input v-model.number="theme.logo.width" type="number" class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                      </div>
                      <div>
                        <label class="text-xs text-gray-500">Height</label>
                        <input v-model.number="theme.logo.height" type="number" class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                      </div>
                      <div>
                        <label class="text-xs text-gray-500">Alt Text</label>
                        <input v-model="theme.logo.alt" type="text" class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <!-- Favicon Upload -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium text-gray-700">Favicon</label>
                      <span v-if="faviconUploading" class="text-xs text-primary flex items-center gap-1">
                        <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                      <span v-else class="text-xs text-gray-400">Max 500KB</span>
                    </div>
                    <div 
                      @click="!faviconUploading && triggerFaviconUpload()"
                      @dragover.prevent="faviconDragOver = true"
                      @dragleave="faviconDragOver = false"
                      @drop.prevent="handleFaviconDrop"
                      :class="[
                        'relative h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all',
                        faviconUploading ? 'cursor-wait opacity-60' : 'cursor-pointer',
                        faviconDragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                      ]"
                    >
                      <input ref="faviconInput" type="file" accept="image/*" class="hidden" @change="handleFaviconUpload" :disabled="faviconUploading" />
                      <!-- Loading overlay -->
                      <div v-if="faviconUploading" class="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                        <div class="flex flex-col items-center gap-2">
                          <svg class="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span class="text-sm text-gray-600">Uploading to cloud...</span>
                        </div>
                      </div>
                      <img 
                        v-else-if="theme.favicon.url" 
                        :src="theme.favicon.url" 
                        alt="Favicon"
                        class="w-16 h-16 object-contain"
                      />
                      <template v-else>
                        <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <p class="text-sm text-gray-500 mt-2">Click or drag to upload</p>
                        <p class="text-xs text-gray-400">Recommended: 32x32 or 64x64</p>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom CSS -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Custom CSS</h3>
                    <p class="text-sm text-gray-500">Add custom styling to your booking page</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="theme.customCss.enabled" type="checkbox" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div v-if="theme.customCss.enabled">
                  <textarea 
                    v-model="theme.customCss.cssCode" 
                    rows="8" 
                    class="w-full p-4 rounded-xl border border-gray-200 font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="/* Add your custom CSS here */
.booking-button {
  border-radius: 12px;
}"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Live Preview -->
            <div class="space-y-6">
              <div class="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <span class="text-xs text-gray-400">Updates in real-time</span>
                </div>
                
                <!-- Preview Card -->
                <div 
                  class="rounded-xl overflow-hidden shadow-lg"
                  :style="{ backgroundColor: theme.colors.background }"
                >
                  <!-- Preview Header -->
                  <div 
                    class="p-4 flex items-center gap-3"
                    :style="{ backgroundColor: theme.colors.primary }"
                  >
                    <img 
                      v-if="theme.logo.url" 
                      :src="theme.logo.url" 
                      :alt="theme.logo.alt"
                      class="h-8 object-contain"
                    />
                    <div v-else class="w-8 h-8 bg-white/20 rounded-lg"></div>
                    <span class="text-white font-semibold" :style="{ fontFamily: theme.typography.headingFont }">Your Business</span>
                  </div>
                  
                  <!-- Preview Content -->
                  <div class="p-4 space-y-4" :style="{ color: theme.colors.text, fontFamily: theme.typography.bodyFont }">
                    <h4 class="font-semibold" :style="{ fontFamily: theme.typography.headingFont }">Book an Appointment</h4>
                    <p class="text-sm opacity-70">Select a service to get started</p>
                    
                    <div class="space-y-2">
                      <div 
                        class="p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                        :style="{ borderColor: theme.colors.secondary + '40' }"
                      >
                        <p class="font-medium text-sm">Hair Styling</p>
                        <p class="text-xs opacity-60">60 min • $50</p>
                      </div>
                      <div 
                        class="p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                        :style="{ borderColor: theme.colors.secondary + '40' }"
                      >
                        <p class="font-medium text-sm">Makeup Session</p>
                        <p class="text-xs opacity-60">45 min • $75</p>
                      </div>
                    </div>
                    
                    <button 
                      class="w-full py-3 rounded-xl text-white font-medium text-sm"
                      :style="{ backgroundColor: theme.colors.primary }"
                    >
                      Continue Booking
                    </button>
                    
                    <div class="flex items-center gap-2 text-xs">
                      <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: theme.colors.success }"></span>
                      <span :style="{ color: theme.colors.success }">Available today</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 space-y-3">
                  <button
                    @click="handleSaveTheme"
                    :disabled="themeLoading"
                    class="w-full py-3 rounded-xl text-white font-medium text-sm bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg v-if="themeLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ themeLoading ? 'Saving...' : (themeExists ? 'Update Theme' : 'Create Theme') }}
                  </button>
                  <button
                    @click="handlePreviewTheme"
                    :disabled="previewLoading"
                    class="w-full py-3 rounded-xl font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {{ previewLoading ? 'Generating...' : 'Open Full Preview' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Domains Tab -->
        <div v-if="activeTab === 'domains'" class="space-y-6">
          <!-- Add Domain Card -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <div class="flex flex-col lg:flex-row lg:items-end gap-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Add Custom Domain</h3>
                <p class="text-sm text-gray-500 mb-4">Connect your own domain for a branded booking experience</p>
                <div class="relative">
                  <input 
                    v-model="newDomain"
                    type="text"
                    placeholder="booking.yourbusiness.com"
                    class="w-full h-12 pl-4 pr-12 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
              <button
                @click="handleRequestDomain"
                :disabled="domainLoading || !newDomain"
                class="h-12 px-6 rounded-xl text-white font-medium text-sm bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <svg v-if="domainLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ domainLoading ? 'Requesting...' : 'Add Domain' }}
              </button>
            </div>
          </div>

          <!-- Domains List -->
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900">Your Domains</h3>
              <p class="text-sm text-gray-500">Manage your connected domains</p>
            </div>
            
            <div v-if="domains.length === 0" class="p-12 text-center">
              <svg class="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-1">No domains connected</h4>
              <p class="text-sm text-gray-500">Add a custom domain to brand your booking page</p>
            </div>

            <div v-else class="divide-y divide-gray-100">
              <div 
                v-for="domain in domains" 
                :key="domain._id || domain.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div :class="[
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      getDomainStatusColor(domain.verificationStatus || domain.status).bg
                    ]">
                      <svg :class="['w-6 h-6', getDomainStatusColor(domain.verificationStatus || domain.status).text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ domain.domain }}</p>
                      <div class="flex items-center gap-3 mt-1">
                        <span :class="[
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          getDomainStatusColor(domain.verificationStatus || domain.status).badge
                        ]">
                          <span class="w-1.5 h-1.5 rounded-full" :class="getDomainStatusColor(domain.verificationStatus || domain.status).dot"></span>
                          {{ formatDomainStatus(domain.verificationStatus || domain.status) }}
                        </span>
                        <span v-if="domain.sslStatus" :class="[
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          domain.sslStatus === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                        ]">
                          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          SSL {{ domain.sslStatus }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="domain.verificationStatus !== 'verified' && domain.status !== 'verified'"
                      @click="showDnsInstructions(domain)"
                      class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      DNS Setup
                    </button>
                    <button
                      v-if="domain.verificationStatus !== 'verified' && domain.status !== 'verified'"
                      @click="handleVerifyDomain(domain._id || domain.id)"
                      :disabled="verifyingDomainId === (domain._id || domain.id)"
                      class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {{ verifyingDomainId === (domain._id || domain.id) ? 'Verifying...' : 'Verify' }}
                    </button>
                    <button
                      v-else
                      class="px-4 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50"
                    >
                      <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Verified
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Templates Tab -->
        <div v-if="activeTab === 'templates'" class="space-y-6">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <!-- Template Editor -->
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900">{{ editingTemplate ? 'Edit Template' : 'Create Template' }}</h3>
                <p class="text-sm text-gray-500">Customize your email communications</p>
              </div>
              
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Template Type</label>
                  <select 
                    v-model="newTemplate.templateType"
                    class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option v-for="opt in templateTypeOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Subject Line</label>
                  <input 
                    v-model="newTemplate.subject"
                    type="text"
                    placeholder="Your booking is confirmed - {{businessName}}"
                    class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">HTML Content</label>
                  <textarea 
                    v-model="newTemplate.htmlContent"
                    rows="10"
                    placeholder="<h1>Hello {{clientName}}</h1><p>Your booking is confirmed!</p>"
                    class="w-full p-4 rounded-xl border border-gray-200 font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  ></textarea>
                </div>
                
                <!-- Available Variables -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs font-medium text-gray-600 mb-2">Available Variables</p>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      v-for="variable in templateVariables" 
                      :key="variable"
                      @click="insertVariable(variable)"
                      class="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      {{ formatVariable(variable) }}
                    </button>
                  </div>
                </div>
                
                <div class="flex gap-3">
                  <button
                    v-if="editingTemplate"
                    @click="cancelEditTemplate"
                    class="flex-1 py-3 rounded-xl font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    @click="editingTemplate ? handleUpdateTemplate() : handleCreateTemplate()"
                    :disabled="templateLoading"
                    class="flex-1 py-3 rounded-xl text-white font-medium text-sm bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {{ templateLoading ? 'Saving...' : (editingTemplate ? 'Update Template' : 'Create Template') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Templates List -->
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Your Templates</h3>
                <p class="text-sm text-gray-500">{{ templates.length }} templates created</p>
              </div>
              
              <div v-if="templates.length === 0" class="py-12 text-center">
                <svg class="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h4 class="text-lg font-medium text-gray-900 mb-1">No templates yet</h4>
                <p class="text-sm text-gray-500">Create your first email template</p>
              </div>
              
              <div v-else class="space-y-3 max-h-[500px] overflow-y-auto">
                <div 
                  v-for="template in templates" 
                  :key="template._id || template.id"
                  class="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span :class="[
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          getTemplateTypeColor(template.templateType || template.type)
                        ]">
                          {{ formatTemplateType(template.templateType || template.type) }}
                        </span>
                        <span v-if="template.isCustom" class="text-xs text-gray-400">Custom</span>
                      </div>
                      <p class="text-sm font-medium text-gray-900 truncate">{{ template.subject }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ template.variables?.length || 0 }} variables</p>
                    </div>
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        @click="startEditTemplate(template)"
                        class="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Widgets Tab -->
        <div v-if="activeTab === 'widgets'" class="space-y-6">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <!-- Widget Creator -->
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Create Booking Widget</h3>
                <p class="text-sm text-gray-500">Embed a booking widget on your website</p>
              </div>
              
              <div class="space-y-5">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Widget Name</label>
                  <input 
                    v-model="newWidget.name"
                    type="text"
                    placeholder="Homepage Booking Widget"
                    class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Display Type</label>
                    <select 
                      v-model="newWidget.configuration.displayType"
                      class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option v-for="opt in displayTypeOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Widget Theme</label>
                    <select 
                      v-model="newWidget.styling.theme"
                      class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option v-for="opt in widgetThemeOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Button Text</label>
                  <input 
                    v-model="newWidget.configuration.buttonText"
                    type="text"
                    placeholder="Book Now"
                    class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Button Color</label>
                    <div class="flex gap-2">
                      <input 
                        v-model="newWidget.configuration.buttonColor"
                        type="color"
                        class="w-11 h-11 rounded-xl border border-gray-200 cursor-pointer"
                      />
                      <input 
                        v-model="newWidget.configuration.buttonColor"
                        type="text"
                        class="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Primary Color</label>
                    <div class="flex gap-2">
                      <input 
                        v-model="newWidget.styling.primaryColor"
                        type="color"
                        class="w-11 h-11 rounded-xl border border-gray-200 cursor-pointer"
                      />
                      <input 
                        v-model="newWidget.styling.primaryColor"
                        type="text"
                        class="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Border Radius</label>
                    <input 
                      v-model="newWidget.styling.borderRadius"
                      type="text"
                      placeholder="8px"
                      class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Font Size</label>
                    <input 
                      v-model="newWidget.styling.fontSize"
                      type="text"
                      placeholder="14px"
                      class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Allowed Origins</label>
                  <input 
                    v-model="allowedOrigins"
                    type="text"
                    placeholder="https://yoursite.com, https://www.yoursite.com"
                    class="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p class="text-xs text-gray-500">Comma-separated list of allowed domains</p>
                </div>
                
                <label class="flex items-center gap-3 cursor-pointer">
                  <input 
                    v-model="newWidget.configuration.showBranding" 
                    type="checkbox" 
                    class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span class="text-sm text-gray-700">Show "Powered by" branding</span>
                </label>
                
                <button
                  @click="handleCreateWidget"
                  :disabled="widgetLoading"
                  class="w-full py-3 rounded-xl text-white font-medium text-sm bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {{ widgetLoading ? 'Creating...' : 'Create Widget' }}
                </button>
              </div>
            </div>

            <!-- Widgets List & Analytics -->
            <div class="space-y-6">
              <!-- Widgets List -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Your Widgets</h3>
                  <p class="text-sm text-gray-500">{{ widgets.length }} widgets created</p>
                </div>
                
                <div v-if="widgets.length === 0" class="py-12 text-center">
                  <svg class="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <h4 class="text-lg font-medium text-gray-900 mb-1">No widgets yet</h4>
                  <p class="text-sm text-gray-500">Create your first booking widget</p>
                </div>
                
                <div v-else class="space-y-3">
                  <div 
                    v-for="widget in widgets" 
                    :key="widget._id || widget.id"
                    @click="selectWidget(widget)"
                    :class="[
                      'p-4 rounded-xl border transition-all cursor-pointer',
                      selectedWidget?.widgetId === widget.widgetId 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-100 hover:border-gray-200'
                    ]"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900">{{ widget.name || 'Unnamed Widget' }}</p>
                        <div class="flex items-center gap-3 mt-1">
                          <span class="text-xs text-gray-500">{{ widget.configuration?.displayType || 'modal' }}</span>
                          <span :class="['text-xs font-medium', widget.isActive ? 'text-green-600' : 'text-gray-400']">
                            {{ widget.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-lg font-bold text-gray-900">{{ widget.conversionRate || '0%' }}</p>
                        <p class="text-xs text-gray-500">Conversion</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div class="flex-1">
                        <p class="text-xs text-gray-500">Impressions</p>
                        <p class="font-semibold text-gray-900">{{ widget.impressions?.toLocaleString() || 0 }}</p>
                      </div>
                      <div class="flex-1">
                        <p class="text-xs text-gray-500">Conversions</p>
                        <p class="font-semibold text-gray-900">{{ widget.conversions?.toLocaleString() || 0 }}</p>
                      </div>
                      <button 
                        @click.stop="copyWidgetEmbedCode(widget)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
                      >
                        Copy Embed
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Widget Analytics -->
              <div v-if="selectedWidget" class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Widget Analytics</h3>
                    <p class="text-sm text-gray-500">{{ selectedWidget.name || 'Widget' }} performance</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mb-6">
                  <div class="text-center p-4 bg-blue-50 rounded-xl">
                    <p class="text-2xl font-bold text-blue-700">{{ widgetAnalytics?.analytics?.totalImpressions || selectedWidget.impressions || 0 }}</p>
                    <p class="text-xs text-blue-600">Total Impressions</p>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-xl">
                    <p class="text-2xl font-bold text-green-700">{{ widgetAnalytics?.analytics?.totalConversions || selectedWidget.conversions || 0 }}</p>
                    <p class="text-xs text-green-600">Conversions</p>
                  </div>
                  <div class="text-center p-4 bg-violet-50 rounded-xl">
                    <p class="text-2xl font-bold text-violet-700">{{ widgetAnalytics?.analytics?.conversionRate || selectedWidget.conversionRate || '0%' }}</p>
                    <p class="text-xs text-violet-600">Rate</p>
                  </div>
                </div>

                <!-- Embed Code -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-700">Embed Code</p>
                    <button 
                      @click="copyWidgetEmbedCode(selectedWidget)"
                      class="text-xs text-primary font-medium hover:underline"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                  <pre class="text-xs font-mono bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">{{ selectedWidget.embedCode || generateEmbedCode(selectedWidget) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section Tab -->
    <div v-if="activeTab === 'hero'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Hero Section</h2>
          <p class="text-sm text-gray-500 mt-1">Customize the hero banner for your storefront</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="previewStorefront"
            class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button 
            @click="saveHeroSection"
            :disabled="storefrontBuilder.loading.value"
            class="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="storefrontBuilder.loading.value" class="animate-spin">⟳</span>
            Save Hero
          </button>
        </div>
      </div>
      
      <HeroSectionEditor 
        :hero="storefrontBuilder.config.storefront.hero"
        :uploading="heroUploading"
        @update:hero="updateHeroSection"
        @uploadImage="handleHeroImageUpload"
        @uploadVideo="handleHeroVideoUpload"
      />
    </div>

    <!-- Page Sections Tab -->
    <div v-if="activeTab === 'sections'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Page Sections</h2>
          <p class="text-sm text-gray-500 mt-1">Organize and configure sections on your storefront</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="previewStorefront"
            class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button 
            @click="saveSectionsOrder"
            :disabled="storefrontBuilder.loading.value"
            class="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="storefrontBuilder.loading.value" class="animate-spin">⟳</span>
            Save Layout
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionsOrderEditor 
          :sections="storefrontBuilder.config.storefront.sections"
          @update:sections="updateSections"
          @move="handleSectionMove"
          @toggle="handleSectionToggle"
          @addSection="handleAddSection"
          @deleteSection="handleDeleteSection"
          @updateSection="handleUpdateSection"
          @updateOrder="handleSectionReorder"
        />
        
        <DisplaySettingsEditor 
          :serviceDisplay="storefrontBuilder.config.storefront.serviceDisplay"
          :staffDisplay="storefrontBuilder.config.storefront.staffDisplay"
          :testimonials="storefrontBuilder.config.storefront.testimonials"
          :contact="storefrontBuilder.config.storefront.contact"
          @update:serviceDisplay="(v) => storefrontBuilder.config.storefront.serviceDisplay = v"
          @update:staffDisplay="(v) => storefrontBuilder.config.storefront.staffDisplay = v"
          @update:testimonials="(v) => storefrontBuilder.config.storefront.testimonials = v"
          @update:contact="(v) => storefrontBuilder.config.storefront.contact = v"
        />
      </div>
    </div>

    <!-- Styling Tab -->
    <div v-if="activeTab === 'styles'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Component Styles</h2>
          <p class="text-sm text-gray-500 mt-1">Fine-tune the styling of buttons, cards, and layouts</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="previewStorefront"
            class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button 
            @click="saveComponentStyles"
            :disabled="storefrontBuilder.loading.value"
            class="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="storefrontBuilder.loading.value" class="animate-spin">⟳</span>
            Save Styles
          </button>
        </div>
      </div>
      
      <ComponentStylesEditor 
        :componentStyles="storefrontBuilder.config.componentStyles"
        @update:componentStyles="updateComponentStyles"
      />
    </div>

    <!-- Navigation & Footer Tab -->
    <div v-if="activeTab === 'navigation'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Navigation & Footer</h2>
          <p class="text-sm text-gray-500 mt-1">Configure the navbar and footer for your storefront</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="previewStorefront"
            class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button 
            @click="saveNavbarFooter"
            :disabled="storefrontBuilder.loading.value"
            class="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="storefrontBuilder.loading.value" class="animate-spin">⟳</span>
            Save Navigation
          </button>
        </div>
      </div>
      
      <NavbarFooterEditor 
        :navbar="storefrontBuilder.config.navbar"
        :footer="storefrontBuilder.config.footer"
        @update:navbar="updateNavbar"
        @update:footer="updateFooter"
        @uploadLogo="handleLogoUpload"
      />
    </div>

    <!-- Content Tab -->
    <div v-if="activeTab === 'content'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Section Content</h2>
          <p class="text-sm text-gray-500 mt-1">Manage testimonials, FAQs, about section, and gallery images</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="refreshStorefrontContent"
            :disabled="storefrontContent.loading.value"
            class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg :class="['w-4 h-4', storefrontContent.loading.value ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Content Sub-tabs -->
      <div class="flex gap-2 border-b border-gray-200 pb-3">
        <button
          v-for="subTab in contentSubTabs"
          :key="subTab.id"
          @click="activeContentTab = subTab.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeContentTab === subTab.id
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ subTab.label }}
          <span v-if="subTab.count" class="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-white/20">{{ subTab.count }}</span>
        </button>
      </div>

      <!-- Testimonials -->
      <div v-if="activeContentTab === 'testimonials'">
        <TestimonialsEditor
          :testimonials="storefrontContent.testimonials.value"
          @add="handleAddTestimonial"
          @update="handleUpdateTestimonials"
          @delete="handleDeleteTestimonial"
        />
      </div>

      <!-- FAQs -->
      <div v-if="activeContentTab === 'faqs'">
        <FAQEditor
          :faqs="storefrontContent.faqs.value"
          @add="handleAddFAQ"
          @update="handleUpdateFAQs"
          @delete="handleDeleteFAQ"
          @importFromChat="handleImportFAQs"
        />
      </div>

      <!-- About Section -->
      <div v-if="activeContentTab === 'about'">
        <AboutSectionEditor
          :about="storefrontContent.about.value"
          @update="handleUpdateAbout"
        />
      </div>

      <!-- Gallery -->
      <div v-if="activeContentTab === 'gallery'">
        <GalleryContentEditor
          :images="storefrontContent.gallery.value"
          @add="handleAddGalleryImage"
          @update="handleUpdateGalleryImages"
          @delete="handleDeleteGalleryImage"
        />
      </div>
    </div>

    <!-- SEO Tab -->
    <div v-if="activeTab === 'seo'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">SEO Settings</h2>
          <p class="text-sm text-gray-500 mt-1">Optimize your storefront for search engines</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="previewStorefront"
            class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button 
            @click="saveSeoSettings"
            :disabled="storefrontBuilder.loading.value"
            class="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="storefrontBuilder.loading.value" class="animate-spin">⟳</span>
            Save SEO
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeoEditor 
          :seo="storefrontBuilder.config.seo || getDefaultSeoConfig()"
          :subdomain="subdomain"
          @update:seo="updateSeoSettings"
          @uploadOgImage="handleOgImageUpload"
        />
        
        <GalleryEditor 
          :gallery="storefrontBuilder.config.storefront.gallery"
          :uploading="galleryUploading"
          @update:gallery="updateGallerySettings"
          @uploadImages="handleGalleryUpload"
          @removeImage="handleGalleryImageRemove"
          @reorderImages="handleGalleryReorder"
        />
      </div>
      
      <BookingFlowEditor 
        :bookingFlow="storefrontBuilder.config.storefront.bookingFlow"
        :socialProof="storefrontBuilder.config.storefront.socialProof"
        @update:bookingFlow="updateBookingFlow"
        @update:socialProof="updateSocialProof"
      />
    </div>

    <!-- DNS Instructions Modal -->
    <Teleport to="body">
      <div 
        v-if="showDnsModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showDnsModal = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">DNS Configuration</h3>
              <button @click="showDnsModal = false" class="p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-gray-600">Add these DNS records to your domain provider to connect your custom domain:</p>
            
            <div v-for="(record, idx) in selectedDomainForDns?.dnsRecords" :key="idx" class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <span class="px-2 py-1 bg-gray-200 rounded text-xs font-mono font-semibold">{{ record.type }}</span>
                <span :class="['text-xs font-medium', record.verified ? 'text-green-600' : 'text-amber-600']">
                  {{ record.verified ? '✓ Verified' : 'Pending verification' }}
                </span>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Name / Host</p>
                  <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <code class="flex-1 text-sm">{{ record.name }}</code>
                    <button @click="copyToClipboard(record.name)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Value / Points to</p>
                  <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <code class="flex-1 text-sm break-all">{{ record.value }}</code>
                    <button @click="copyToClipboard(record.value)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p class="text-sm text-amber-800">
                <strong>Note:</strong> DNS changes can take up to 48 hours to propagate. Once you've added the records, click "Verify" to check the configuration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notification -->
    <!-- <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-4 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-4 opacity-0"
      >
        <div 
          v-if="toast.show" 
          :class="[
            'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg',
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          ]"
        >
          <svg v-if="toast.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, h } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useGetBrandingOverview } from '@/composables/modules/branding/useGetBrandingOverview'
import { useGetTheme } from '@/composables/modules/branding/useGetTheme'
import { useCreateTheme } from '@/composables/modules/branding/useCreateTheme'
import { useUpdateTheme } from '@/composables/modules/branding/useUpdateTheme'
import { usePreviewTheme } from '@/composables/modules/branding/usePreviewTheme'
import { useRequestCustomDomain } from '@/composables/modules/branding/useRequestCustomDomain'
import { useVerifyDomain } from '@/composables/modules/branding/useVerifyDomain'
import { useGetDomains } from '@/composables/modules/branding/useGetDomains'
import { useCreateEmailTemplate } from '@/composables/modules/branding/useCreateEmailTemplate'
import { useUpdateEmailTemplate } from '@/composables/modules/branding/useUpdateEmailTemplate'
import { useGetEmailTemplates } from '@/composables/modules/branding/useGetEmailTemplates'
import { useCreateWidget } from '@/composables/modules/branding/useCreateWidget'
import { useGetWidgets } from '@/composables/modules/branding/useGetWidgets'
import { useGetWidgetAnalytics } from '@/composables/modules/branding/useGetWidgetAnalytics'
import { useUploadLogo } from '@/composables/modules/branding/useUploadLogo'
import { useUploadFavicon } from '@/composables/modules/branding/useUploadFavicon'
import { useUploadEmailHeader } from '@/composables/modules/branding/useUploadEmailHeader'
import { useStorefrontBuilder } from '@/composables/modules/branding/useStorefrontBuilder'

// Branding Components
import HeroSectionEditor from '@/components/branding/HeroSectionEditor.vue'
import SectionsOrderEditor from '@/components/branding/SectionsOrderEditor.vue'
import DisplaySettingsEditor from '@/components/branding/DisplaySettingsEditor.vue'
import ComponentStylesEditor from '@/components/branding/ComponentStylesEditor.vue'
import NavbarFooterEditor from '@/components/branding/NavbarFooterEditor.vue'
import SeoEditor from '@/components/branding/SeoEditor.vue'
import GalleryEditor from '@/components/branding/GalleryEditor.vue'
import BookingFlowEditor from '@/components/branding/BookingFlowEditor.vue'

// Content Management Editors
import TestimonialsEditor from '@/components/branding/TestimonialsEditor.vue'
import FAQEditor from '@/components/branding/FAQEditor.vue'
import AboutSectionEditor from '@/components/branding/AboutSectionEditor.vue'
import GalleryContentEditor from '@/components/branding/GalleryContentEditor.vue'

// Content Management Composable
import { useStorefrontContent } from '@/composables/modules/branding/useStorefrontContent'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Tab icons as render functions
const ThemeIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' })
])

const DomainIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' })
])

const EmailIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
])

const WidgetIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' })
])

// Additional tab icons for storefront builder
const HeroIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const SectionsIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 12h16M4 18h7' })
])

const StylesIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })
])

const NavIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z' })
])

const SeoIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
])

const ContentIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
])

// State
const activeTab = ref('theme')
const activeContentTab = ref('testimonials')
const isRefreshing = ref(false)

// Content Sub-tabs
const contentSubTabs = computed(() => [
  { id: 'testimonials', label: 'Testimonials', count: storefrontContent.testimonials.value.length },
  { id: 'faqs', label: 'FAQs', count: storefrontContent.faqs.value.length },
  { id: 'about', label: 'About', count: undefined },
  { id: 'gallery', label: 'Gallery', count: storefrontContent.gallery.value.length }
])

// Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// Storefront Builder Composable
const storefrontBuilder = useStorefrontBuilder()

// Storefront Content Composable (for testimonials, FAQs, about, gallery)
const storefrontContent = useStorefrontContent()

// Composables
const { subdomain } = useUser()
const { data: overviewData, execute: fetchOverview } = useGetBrandingOverview()
const { data: themeData, execute: fetchTheme } = useGetTheme()
const { loading: createThemeLoading, execute: createTheme } = useCreateTheme()
const { loading: updateThemeLoading, execute: updateTheme } = useUpdateTheme()
const { loading: previewLoading, execute: previewTheme } = usePreviewTheme()
const { loading: domainLoading, execute: requestDomain } = useRequestCustomDomain()

// Theme exists state
const themeExists = ref(false)
const themeLoading = computed(() => createThemeLoading.value || updateThemeLoading.value)
const { execute: verifyDomain } = useVerifyDomain()
const { data: domainsData, execute: fetchDomains } = useGetDomains()
const { loading: templateLoading, execute: createTemplate } = useCreateEmailTemplate()
const { execute: updateEmailTemplate } = useUpdateEmailTemplate()
const { data: templatesData, execute: fetchTemplates } = useGetEmailTemplates()
const { loading: widgetLoading, execute: createWidget } = useCreateWidget()
const { data: widgetsData, execute: fetchWidgets } = useGetWidgets()
const { data: widgetAnalytics, execute: fetchWidgetAnalytics } = useGetWidgetAnalytics()
const { loading: logoUploading, execute: uploadLogo } = useUploadLogo()
const { loading: faviconUploading, execute: uploadFavicon } = useUploadFavicon()
const { loading: emailHeaderUploading, execute: uploadEmailHeader } = useUploadEmailHeader()

// Computed
const overview = computed(() => overviewData.value)
const domains = computed(() => domainsData.value?.domains || domainsData.value || [])
const templates = computed(() => templatesData.value?.templates || templatesData.value || [])
const widgets = computed(() => widgetsData.value?.widgets || widgetsData.value || [])

const tabs = computed(() => [
  { id: 'theme', label: 'Colors & Fonts', icon: ThemeIcon, count: undefined },
  { id: 'hero', label: 'Hero Section', icon: HeroIcon, count: undefined },
  { id: 'sections', label: 'Page Sections', icon: SectionsIcon, count: undefined },
  { id: 'content', label: 'Content', icon: ContentIcon, count: storefrontContent.testimonials.value.length + storefrontContent.faqs.value.length },
  { id: 'styles', label: 'Styling', icon: StylesIcon, count: undefined },
  { id: 'navigation', label: 'Nav & Footer', icon: NavIcon, count: undefined },
  { id: 'seo', label: 'SEO', icon: SeoIcon, count: undefined },
  { id: 'domains', label: 'Domains', icon: DomainIcon, count: domains.value.length },
  { id: 'templates', label: 'Emails', icon: EmailIcon, count: templates.value.length },
  { id: 'widgets', label: 'Widgets', icon: WidgetIcon, count: widgets.value.length }
])

// Options
const templateTypeOptions = [
  { label: 'Booking Confirmation', value: 'booking_confirmation' },
  { label: 'Booking Reminder', value: 'reminder' },
  { label: 'Cancellation', value: 'cancellation' },
  { label: 'Welcome', value: 'welcome' }
]

const displayTypeOptions = [
  { label: 'Modal', value: 'modal' },
  { label: 'Inline', value: 'inline' },
  { label: 'Popup', value: 'popup' },
  { label: 'Sidebar', value: 'sidebar' }
]

const widgetThemeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Custom', value: 'custom' }
]

const fontOptions = [
  'Inter, sans-serif',
  'Poppins, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Lato, sans-serif',
  'Montserrat, sans-serif',
  'Playfair Display, serif',
  'Merriweather, serif'
]

const templateVariables = [
  'clientName',
  'businessName',
  'appointmentDate',
  'appointmentTime',
  'serviceName',
  'staffName',
  'bookingNumber',
  'amount'
]

// Theme state
const theme = ref({
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    error: '#EF4444',
    success: '#10B981'
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif'
  },
  logo: {
    url: '',
    width: 200,
    height: 80,
    alt: 'Logo'
  },
  favicon: {
    url: ''
  },
  customCss: {
    enabled: false,
    cssCode: ''
  }
})

// Domain state
const newDomain = ref('')
const verifyingDomainId = ref<string | null>(null)
const showDnsModal = ref(false)
const selectedDomainForDns = ref<any>(null)

// Template state
const newTemplate = ref({
  templateType: 'booking_confirmation',
  subject: '',
  htmlContent: ''
})
const editingTemplate = ref<any>(null)

// Widget state
const newWidget = ref({
  name: '',
  configuration: {
    displayType: 'modal',
    buttonText: 'Book Now',
    buttonColor: '#3B82F6',
    showBranding: true,
    allowedOrigins: [] as string[]
  },
  styling: {
    theme: 'light',
    primaryColor: '#3B82F6',
    borderRadius: '8px',
    fontSize: '14px'
  }
})
const allowedOrigins = ref('')
const selectedWidget = ref<any>(null)

// File upload refs
const logoInput = ref<HTMLInputElement | null>(null)
const faviconInput = ref<HTMLInputElement | null>(null)
const logoDragOver = ref(false)
const faviconDragOver = ref(false)

// Watch theme data - only populate form, don't set themeExists here
watch(themeData, (value) => {
  if (value && (value.theme || value.colors)) {
    const themeValue = value.theme || value
    // Only update form values if we have actual theme data
    if (themeValue.colors) {
      theme.value = {
        colors: { ...theme.value.colors, ...themeValue.colors },
        typography: { ...theme.value.typography, ...themeValue.typography },
        logo: themeValue.logo || theme.value.logo,
        favicon: themeValue.favicon || theme.value.favicon,
        customCss: themeValue.customCss || theme.value.customCss
      }
    }
  }
})

// Methods
const refreshAll = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchOverview(),
      fetchThemeSafe(),
      fetchDomains(),
      fetchTemplates(),
      fetchWidgets()
    ])
    showToast('Data refreshed successfully')
  } catch (error) {
    showToast('Failed to refresh data', 'error')
  } finally {
    isRefreshing.value = false
  }
}

// Safe theme fetch that handles 404 gracefully
const fetchThemeSafe = async () => {
  console.log('Checking if theme exists...')
  try {
    await fetchTheme()
    themeExists.value = true
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Theme doesn't exist yet, that's okay
      themeExists.value = false
    } else {
      throw error
    }
  }
}

// Theme methods
const formatColorLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').trim()
}

// Default SEO config helper
const getDefaultSeoConfig = () => ({
  title: '',
  description: '',
  keywords: [],
  ogImage: '',
  ogTitle: '',
  ogDescription: '',
  canonicalUrl: '',
  indexable: true,
  followLinks: true
})

const resetColors = () => {
  theme.value.colors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    error: '#EF4444',
    success: '#10B981'
  }
}

const triggerLogoUpload = () => logoInput.value?.click()
const triggerFaviconUpload = () => faviconInput.value?.click()

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const result = await uploadLogo(file)
    if (result) {
      theme.value.logo.url = result.url
      theme.value.logo.width = result.width || 200
      theme.value.logo.height = result.height || 80
      showToast('Logo uploaded successfully')
    }
  } catch (error: any) {
    showToast(error.message || 'Failed to upload logo', 'error')
  }
  target.value = ''
  logoDragOver.value = false
}

const handleLogoDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  try {
    const result = await uploadLogo(file)
    if (result) {
      theme.value.logo.url = result.url
      theme.value.logo.width = result.width || 200
      theme.value.logo.height = result.height || 80
      showToast('Logo uploaded successfully')
    }
  } catch (error: any) {
    showToast(error.message || 'Failed to upload logo', 'error')
  }
  logoDragOver.value = false
}

const handleFaviconUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const result = await uploadFavicon(file)
    if (result) {
      theme.value.favicon.url = result.url
      showToast('Favicon uploaded successfully')
    }
  } catch (error: any) {
    showToast(error.message || 'Failed to upload favicon', 'error')
  }
  target.value = ''
  faviconDragOver.value = false
}

const handleFaviconDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  try {
    const result = await uploadFavicon(file)
    if (result) {
      theme.value.favicon.url = result.url
      showToast('Favicon uploaded successfully')
    }
  } catch (error: any) {
    showToast(error.message || 'Failed to upload favicon', 'error')
  }
  faviconDragOver.value = false
}

const handleSaveTheme = async () => {
  try {
    if (themeExists.value) {
      // Theme already exists, update it
      await updateTheme(theme.value)
      showToast('Theme updated successfully')
    } else {
      // No theme exists, create it first
      await createTheme(theme.value)
      themeExists.value = true
      showToast('Theme created successfully')
    }
  } catch (error: any) {
    const action = themeExists.value ? 'update' : 'create'
    showToast(error.response?.data?.message || `Failed to ${action} theme`, 'error')
  }
}

const handlePreviewTheme = async () => {
  try {
    const result = await previewTheme(theme.value)
    if (result?.previewId) {
      // Open the preview page with subdomain and previewId query param
      // URL format: /preview/book/{subdomain}?previewId={previewId}
      const businessSubdomain = subdomain.value || 'demo'
      const previewUrl = `/preview/book/${businessSubdomain}?previewId=${result.previewId}`
      window.open(previewUrl, '_blank')
      showToast('Preview generated')
    } else if (result?.previewUrl) {
      // Fallback to previewUrl if provided directly
      window.open(result.previewUrl, '_blank')
      showToast('Preview generated')
    } else {
      showToast('Failed to generate preview - no preview ID returned', 'error')
    }
  } catch (error) {
    showToast('Failed to generate preview', 'error')
  }
}

// Domain methods
const getDomainStatusColor = (status: string) => {
  switch (status) {
    case 'verified':
      return { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-50 text-green-700', dot: 'bg-green-500' }
    case 'pending':
    case 'pending_verification':
      return { bg: 'bg-amber-50', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' }
    case 'failed':
      return { bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-50 text-red-700', dot: 'bg-red-500' }
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' }
  }
}

const formatDomainStatus = (status: string) => {
  switch (status) {
    case 'verified': return 'Verified'
    case 'pending': case 'pending_verification': return 'Pending'
    case 'failed': return 'Failed'
    default: return status
  }
}

const handleRequestDomain = async () => {
  if (!newDomain.value) return
  try {
    await requestDomain(newDomain.value)
    newDomain.value = ''
    await fetchDomains()
    showToast('Domain request submitted')
  } catch (error) {
    showToast('Failed to request domain', 'error')
  }
}

const handleVerifyDomain = async (domainId: string) => {
  verifyingDomainId.value = domainId
  try {
    await verifyDomain(domainId)
    await fetchDomains()
    showToast('Domain verification initiated')
  } catch (error) {
    showToast('Verification failed', 'error')
  } finally {
    verifyingDomainId.value = null
  }
}

const showDnsInstructions = (domain: any) => {
  selectedDomainForDns.value = domain
  showDnsModal.value = true
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copied to clipboard')
  } catch (error) {
    showToast('Failed to copy', 'error')
  }
}

// Template methods
const getTemplateTypeColor = (type: string) => {
  switch (type) {
    case 'booking_confirmation': return 'bg-green-50 text-green-700'
    case 'reminder': return 'bg-blue-50 text-blue-700'
    case 'cancellation': return 'bg-red-50 text-red-700'
    case 'welcome': return 'bg-violet-50 text-violet-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const formatTemplateType = (type: string) => {
  return type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || type
}

const formatVariable = (variable: string) => {
  return '{{' + variable + '}}'
}

const insertVariable = (variable: string) => {
  newTemplate.value.htmlContent += `{{${variable}}}`
}

const handleCreateTemplate = async () => {
  if (!newTemplate.value.subject || !newTemplate.value.htmlContent) {
    showToast('Please fill in all fields', 'error')
    return
  }
  try {
    await createTemplate(newTemplate.value)
    newTemplate.value = { templateType: 'booking_confirmation', subject: '', htmlContent: '' }
    await fetchTemplates()
    showToast('Template created successfully')
  } catch (error) {
    showToast('Failed to create template', 'error')
  }
}

const startEditTemplate = (template: any) => {
  editingTemplate.value = template
  newTemplate.value = {
    templateType: template.templateType || template.type,
    subject: template.subject,
    htmlContent: template.htmlContent || ''
  }
}

const cancelEditTemplate = () => {
  editingTemplate.value = null
  newTemplate.value = { templateType: 'booking_confirmation', subject: '', htmlContent: '' }
}

const handleUpdateTemplate = async () => {
  if (!editingTemplate.value) return
  try {
    await updateEmailTemplate(editingTemplate.value._id || editingTemplate.value.id, newTemplate.value)
    cancelEditTemplate()
    await fetchTemplates()
    showToast('Template updated successfully')
  } catch (error) {
    showToast('Failed to update template', 'error')
  }
}

// Widget methods
const handleCreateWidget = async () => {
  newWidget.value.configuration.allowedOrigins = allowedOrigins.value
    .split(',')
    .map(o => o.trim())
    .filter(Boolean)
  try {
    await createWidget(newWidget.value)
    newWidget.value.name = ''
    allowedOrigins.value = ''
    await fetchWidgets()
    showToast('Widget created successfully')
  } catch (error) {
    showToast('Failed to create widget', 'error')
  }
}

const selectWidget = async (widget: any) => {
  selectedWidget.value = widget
  try {
    await fetchWidgetAnalytics(widget.widgetId || widget._id || widget.id)
  } catch (error) {
    console.error('Failed to fetch widget analytics:', error)
  }
}

const generateEmbedCode = (widget: any) => {
  const widgetId = widget.widgetId || widget._id || widget.id
  return `<!-- Booking Widget -->
<div id="booking-widget-${widgetId}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.yourbookingapp.com/widget.js';
    script.async = true;
    script.onload = function() {
      BookingWidget.init({
        widgetId: '${widgetId}',
        displayType: '${widget.configuration?.displayType || 'modal'}',
        buttonText: '${widget.configuration?.buttonText || 'Book Now'}',
        buttonColor: '${widget.configuration?.buttonColor || '#3B82F6'}',
      });
    };
    document.body.appendChild(script);
  })();
<\/script>`
}

const copyWidgetEmbedCode = async (widget: any) => {
  const code = widget.embedCode || generateEmbedCode(widget)
  await copyToClipboard(code)
}

// =========================
// Storefront Builder Methods
// =========================

// Hero Section handlers
const heroUploading = ref(false)

const updateHeroSection = (hero: any) => {
  storefrontBuilder.config.storefront.hero = { ...storefrontBuilder.config.storefront.hero, ...hero }
}

const handleHeroImageUpload = async (file: File) => {
  heroUploading.value = true
  try {
    const result = await storefrontBuilder.uploadHeroImage(file)
    if (result?.url) {
      storefrontBuilder.config.storefront.hero.coverImage = result.url
      showToast('Hero image uploaded successfully')
    }
  } catch (error) {
    showToast('Failed to upload hero image', 'error')
  } finally {
    heroUploading.value = false
  }
}

const handleHeroVideoUpload = async (file: File) => {
  heroUploading.value = true
  try {
    const result = await storefrontBuilder.uploadHeroVideo(file)
    if (result?.url) {
      storefrontBuilder.config.storefront.hero.videoUrl = result.url
      showToast('Hero video uploaded successfully')
    }
  } catch (error) {
    showToast('Failed to upload hero video', 'error')
  } finally {
    heroUploading.value = false
  }
}

const saveHeroSection = async () => {
  try {
    await storefrontBuilder.saveHeroSection()
    showToast('Hero section saved successfully')
  } catch (error) {
    showToast('Failed to save hero section', 'error')
  }
}

// Sections handlers
const updateSections = (sections: any[]) => {
  storefrontBuilder.config.storefront.sections = sections
}

const handleSectionMove = (from: number, to: number) => {
  storefrontBuilder.moveSection(from, to)
}

const handleSectionToggle = (sectionId: string) => {
  storefrontBuilder.toggleSection(sectionId)
}

const handleAddSection = (section: any) => {
  if (!storefrontBuilder.config.storefront.sections) {
    storefrontBuilder.config.storefront.sections = []
  }
  storefrontBuilder.config.storefront.sections.push(section)
}

const handleDeleteSection = (sectionId: string) => {
  const index = storefrontBuilder.config.storefront.sections?.findIndex((s: any) => s.id === sectionId)
  if (index !== undefined && index > -1) {
    storefrontBuilder.config.storefront.sections.splice(index, 1)
  }
}

const handleUpdateSection = (updatedSection: any) => {
  const index = storefrontBuilder.config.storefront.sections?.findIndex((s: any) => s.id === updatedSection.id)
  if (index !== undefined && index > -1) {
    storefrontBuilder.config.storefront.sections[index] = { ...storefrontBuilder.config.storefront.sections[index], ...updatedSection }
  }
}

const handleSectionReorder = (sections: any[]) => {
  storefrontBuilder.config.storefront.sections = sections
}

const saveSectionsOrder = async () => {
  try {
    await storefrontBuilder.saveSectionsOrder()
    showToast('Sections layout saved successfully')
  } catch (error) {
    showToast('Failed to save sections layout', 'error')
  }
}

// Component Styles handlers
const updateComponentStyles = (styles: any) => {
  storefrontBuilder.config.componentStyles = { ...storefrontBuilder.config.componentStyles, ...styles }
}

const saveComponentStyles = async () => {
  try {
    await storefrontBuilder.saveComponentStyles()
    showToast('Component styles saved successfully')
  } catch (error) {
    showToast('Failed to save component styles', 'error')
  }
}

// Navbar & Footer handlers
const updateNavbar = (navbar: any) => {
  storefrontBuilder.config.navbar = { ...storefrontBuilder.config.navbar, ...navbar }
}

const updateFooter = (footer: any) => {
  storefrontBuilder.config.footer = { ...storefrontBuilder.config.footer, ...footer }
}

const handleLogoUploadStorefront = async (file: File) => {
  try {
    const result = await storefrontBuilder.uploadLogo(file)
    if (result?.url) {
      storefrontBuilder.config.navbar.logoUrl = result.url
      showToast('Logo uploaded successfully')
    }
  } catch (error) {
    showToast('Failed to upload logo', 'error')
  }
}

const saveNavbarFooter = async () => {
  try {
    await storefrontBuilder.saveNavbar()
    await storefrontBuilder.saveFooter()
    showToast('Navigation saved successfully')
  } catch (error) {
    showToast('Failed to save navigation', 'error')
  }
}

// SEO handlers
const updateSeoSettings = (seo: any) => {
  storefrontBuilder.config.seo = { ...storefrontBuilder.config.seo, ...seo }
}

const saveSeoSettings = async () => {
  try {
    await storefrontBuilder.saveSeo()
    showToast('SEO settings saved successfully')
  } catch (error) {
    showToast('Failed to save SEO settings', 'error')
  }
}

// Gallery handlers
const galleryUploading = ref(false)

const updateGallerySettings = (gallery: any) => {
  storefrontBuilder.config.storefront.gallery = { ...storefrontBuilder.config.storefront.gallery, ...gallery }
}

const handleGalleryUpload = async (files: File[]) => {
  galleryUploading.value = true
  try {
    for (const file of files) {
      const result = await storefrontBuilder.uploadGalleryImage(file)
      if (result?.url) {
        storefrontBuilder.addGalleryImage({
          url: result.url,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          caption: ''
        })
      }
    }
    showToast('Gallery images uploaded successfully')
  } catch (error) {
    showToast('Failed to upload gallery images', 'error')
  } finally {
    galleryUploading.value = false
  }
}

const handleGalleryImageRemove = (index: number) => {
  storefrontBuilder.removeGalleryImage(index)
}

const handleGalleryReorder = (images: any[]) => {
  storefrontBuilder.reorderGalleryImages(images)
}

// OG Image handler
const handleOgImageUpload = async (file: File) => {
  try {
    const result = await storefrontBuilder.uploadHeroImage(file) // Reuse upload endpoint
    if (result?.url) {
      if (!storefrontBuilder.config.seo) {
        storefrontBuilder.config.seo = getDefaultSeoConfig()
      }
      storefrontBuilder.config.seo.ogImage = result.url
      showToast('Social image uploaded successfully')
    }
  } catch (error) {
    showToast('Failed to upload social image', 'error')
  }
}

// Booking Flow handlers
const updateBookingFlow = (bookingFlow: any) => {
  storefrontBuilder.config.storefront.bookingFlow = { ...storefrontBuilder.config.storefront.bookingFlow, ...bookingFlow }
}

const updateSocialProof = (socialProof: any) => {
  storefrontBuilder.config.storefront.socialProof = { ...storefrontBuilder.config.storefront.socialProof, ...socialProof }
}

// ==================== STOREFRONT CONTENT HANDLERS ====================
const refreshStorefrontContent = async () => {
  try {
    await storefrontContent.fetchContent()
    showToast('Content refreshed successfully')
  } catch (error) {
    showToast('Failed to refresh content', 'error')
  }
}

// Testimonials handlers
const handleAddTestimonial = async (testimonial: any) => {
  try {
    await storefrontContent.addTestimonial(testimonial)
    showToast('Testimonial added successfully')
  } catch (error) {
    showToast('Failed to add testimonial', 'error')
  }
}

const handleUpdateTestimonials = async (testimonials: any[]) => {
  try {
    await storefrontContent.updateAllTestimonials(testimonials)
    showToast('Testimonials updated successfully')
  } catch (error) {
    showToast('Failed to update testimonials', 'error')
  }
}

const handleDeleteTestimonial = async (id: string) => {
  try {
    await storefrontContent.deleteTestimonial(id)
    showToast('Testimonial deleted successfully')
  } catch (error) {
    showToast('Failed to delete testimonial', 'error')
  }
}

// FAQ handlers
const handleAddFAQ = async (faq: any) => {
  try {
    await storefrontContent.addFAQ(faq)
    showToast('FAQ added successfully')
  } catch (error) {
    showToast('Failed to add FAQ', 'error')
  }
}

const handleUpdateFAQs = async (faqs: any[]) => {
  try {
    await storefrontContent.updateAllFAQs(faqs)
    showToast('FAQs updated successfully')
  } catch (error) {
    showToast('Failed to update FAQs', 'error')
  }
}

const handleDeleteFAQ = async (id: string) => {
  try {
    await storefrontContent.deleteFAQ(id)
    showToast('FAQ deleted successfully')
  } catch (error) {
    showToast('Failed to delete FAQ', 'error')
  }
}

const handleImportFAQs = async () => {
  try {
    await storefrontContent.importFAQsFromChat()
    showToast('FAQs imported successfully from chat')
  } catch (error) {
    showToast('Failed to import FAQs', 'error')
  }
}

// About section handlers
const handleUpdateAbout = async (about: any) => {
  try {
    await storefrontContent.updateAboutSection(about)
    showToast('About section updated successfully')
  } catch (error) {
    showToast('Failed to update about section', 'error')
  }
}

// Gallery handlers
const handleAddGalleryImage = async (image: any) => {
  try {
    await storefrontContent.addGalleryItem(image)
    showToast('Gallery image added successfully')
  } catch (error) {
    showToast('Failed to add gallery image', 'error')
  }
}

const handleUpdateGalleryImages = async (images: any[]) => {
  try {
    await storefrontContent.updateAllGalleryItems(images)
    showToast('Gallery updated successfully')
  } catch (error) {
    showToast('Failed to update gallery', 'error')
  }
}

const handleDeleteGalleryImage = async (id: string) => {
  try {
    await storefrontContent.deleteGalleryItem(id)
    showToast('Gallery image deleted successfully')
  } catch (error) {
    showToast('Failed to delete gallery image', 'error')
  }
}

// Preview storefront
const previewStorefront = async () => {
  try {
    const previewUrl = await storefrontBuilder.createPreviewSession()
    if (previewUrl) {
      window.open(previewUrl, '_blank')
    }
  } catch (error) {
    showToast('Failed to create preview', 'error')
  }
}

// Init
onMounted(async () => {
  await refreshAll()
  // Also fetch storefront builder data
  await storefrontBuilder.fetchAll()
  // Fetch storefront content (testimonials, FAQs, about, gallery)
  await storefrontContent.fetchContent()
})
</script>

<style scoped>
input[type="color"] {
  -webkit-appearance: none;
  padding: 0;
  border: none;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 8px;
}
</style>
