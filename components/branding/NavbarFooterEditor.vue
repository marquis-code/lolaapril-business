<template>
  <div class="space-y-6">
    <!-- Navbar Configuration -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Navbar Configuration</h3>
        <p class="text-sm text-gray-500">Customize your storefront navigation</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Navbar Style -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Navbar Style</label>
          <select 
            v-model="navbar.style"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="default">Default</option>
            <option value="transparent">Transparent</option>
            <option value="minimal">Minimal</option>
            <option value="centered">Centered Logo</option>
          </select>
        </div>

        <!-- Position -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Navbar Position</label>
          <select 
            v-model="navbar.position"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="fixed">Fixed (Sticky)</option>
            <option value="static">Static</option>
            <option value="absolute">Absolute (Over Hero)</option>
          </select>
        </div>

        <!-- Background Color -->
        <div v-if="navbar.style !== 'transparent'" class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Background Color</label>
          <div class="flex items-center gap-2">
            <input 
              type="color" 
              v-model="navbar.backgroundColor"
              class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input 
              v-model="navbar.backgroundColor" 
              type="text" 
              class="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <!-- Visibility Options -->
      <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="navbar.showLogo" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Show Logo</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="navbar.showBusinessName" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Business Name</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="navbar.showBookButton" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Book Button</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" v-model="navbar.sticky" class="rounded border-gray-300 text-primary focus:ring-primary" />
          <div>
            <p class="text-sm font-medium text-gray-900">Sticky Nav</p>
          </div>
        </label>
      </div>

      <!-- Book Button Text -->
      <div v-if="navbar.showBookButton" class="mt-4 space-y-2">
        <label class="text-sm font-medium text-gray-700">Book Button Text</label>
        <input 
          v-model="navbar.bookButtonText" 
          type="text" 
          placeholder="Book Now"
          class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
        />
      </div>
    </div>

    <!-- Menu Items -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Menu Items</h3>
          <p class="text-sm text-gray-500">Configure navigation links</p>
        </div>
        <button
          @click="addMenuItem"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      <div v-if="navbar.menuItems?.length" class="space-y-3">
        <div 
          v-for="(item, index) in navbar.menuItems" 
          :key="index"
          class="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50"
        >
          <!-- Drag Handle -->
          <div class="cursor-move text-gray-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>

          <!-- Label -->
          <div class="flex-1 space-y-2">
            <input 
              v-model="item.label" 
              type="text" 
              placeholder="Link Label"
              class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm"
            />
          </div>

          <!-- Link Type -->
          <div class="w-32">
            <select 
              v-model="item.type"
              @change="item.type === 'section' ? item.url = undefined : item.sectionId = undefined"
              class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm"
            >
              <option value="section">Section</option>
              <option value="url">External URL</option>
            </select>
          </div>

          <!-- Section ID or URL -->
          <div class="w-40">
            <select 
              v-if="item.type === 'section' || !item.type"
              v-model="item.sectionId"
              class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm"
            >
              <option v-for="section in sectionOptions" :key="section.value" :value="section.value">
                {{ section.label }}
              </option>
            </select>
            <input 
              v-else
              v-model="item.url" 
              type="url" 
              placeholder="https://..."
              class="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm"
            />
          </div>

          <!-- Delete -->
          <button
            @click="removeMenuItem(index)"
            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <p class="text-sm">No menu items added yet</p>
      </div>
    </div>

    <!-- Footer Configuration -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Footer</h3>
          <p class="text-sm text-gray-500">Configure your storefront footer</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="footer.enabled" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div v-if="footer.enabled" class="space-y-6">
        <!-- Footer Style -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <label class="text-sm font-medium text-gray-700">Footer Style</label>
            <select 
              v-model="footer.style"
              class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
            >
              <option value="simple">Simple</option>
              <option value="minimal">Minimal</option>
              <option value="detailed">Detailed (Multi-Column)</option>
            </select>
          </div>
        </div>

        <!-- Visibility Options -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="footer.showLogo" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <p class="text-sm font-medium text-gray-900">Logo</p>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="footer.showSocialLinks" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <p class="text-sm font-medium text-gray-900">Social Links</p>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="footer.showQuickLinks" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <p class="text-sm font-medium text-gray-900">Quick Links</p>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="footer.showContactInfo" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <p class="text-sm font-medium text-gray-900">Contact Info</p>
          </label>
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="footer.showNewsletter" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <p class="text-sm font-medium text-gray-900">Newsletter</p>
          </label>
        </div>

        <!-- Newsletter Text -->
        <div v-if="footer.showNewsletter" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Newsletter Signup Text</label>
          <input 
            v-model="footer.newsletterText" 
            type="text" 
            placeholder="Get exclusive offers and beauty tips"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          />
        </div>

        <!-- Copyright Text -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Copyright Text</label>
          <input 
            v-model="footer.copyrightText" 
            type="text" 
            :placeholder="`© ${new Date().getFullYear()} Your Business. All rights reserved.`"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          />
        </div>

        <!-- Footer Columns (for detailed style) -->
        <div v-if="footer.style === 'detailed'" class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Footer Columns</label>
              <p class="text-xs text-gray-500">Organize links into grouped columns</p>
            </div>
            <button
              @click="addFooterColumn"
              class="text-sm text-primary hover:text-primary/80 font-medium"
            >
              + Add Column
            </button>
          </div>
          
          <div v-if="footer.columns?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(column, colIndex) in footer.columns" 
              :key="colIndex"
              class="p-4 border border-gray-200 rounded-xl space-y-3"
            >
              <div class="flex items-center justify-between">
                <input 
                  v-model="column.title" 
                  type="text" 
                  placeholder="Column Title"
                  class="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm font-medium"
                />
                <button
                  @click="removeFooterColumn(colIndex)"
                  class="ml-2 p-2 text-gray-400 hover:text-red-500"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="space-y-2">
                <div 
                  v-for="(link, linkIndex) in column.links" 
                  :key="linkIndex"
                  class="flex items-center gap-2"
                >
                  <input 
                    v-model="link.label" 
                    type="text" 
                    placeholder="Label"
                    class="flex-1 h-8 px-2 rounded border border-gray-200 text-xs"
                  />
                  <input 
                    v-model="link.href" 
                    type="text" 
                    placeholder="Link or #section"
                    class="flex-1 h-8 px-2 rounded border border-gray-200 text-xs"
                  />
                  <button
                    @click="removeColumnLink(colIndex, linkIndex)"
                    class="p-1 text-gray-400 hover:text-red-500"
                  >
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  @click="addColumnLink(colIndex)"
                  class="text-xs text-primary hover:text-primary/80"
                >
                  + Add Link
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Links -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Custom Footer Links</label>
            <button
              @click="addFooterLink"
              class="text-sm text-primary hover:text-primary/80"
            >
              + Add Link
            </button>
          </div>
          
          <div v-if="footer.customLinks?.length" class="space-y-2">
            <div 
              v-for="(link, index) in footer.customLinks" 
              :key="index"
              class="flex items-center gap-3"
            >
              <input 
                v-model="link.label" 
                type="text" 
                placeholder="Link Label"
                class="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm"
              />
              <input 
                v-model="link.url" 
                type="url" 
                placeholder="https://..."
                class="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm"
              />
              <label class="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" v-model="link.openInNewTab" class="rounded border-gray-300 text-primary focus:ring-primary" />
                New Tab
              </label>
              <button
                @click="removeFooterLink(index)"
                class="p-2 text-gray-400 hover:text-red-500"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavbarConfig, FooterConfig } from '@/types/branding'

const props = defineProps<{
  navbar: NavbarConfig
  footer: FooterConfig
}>()

const sectionOptions = [
  { value: 'services', label: 'Services' },
  { value: 'staff', label: 'Team' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'about', label: 'About' },
  { value: 'contact', label: 'Contact' }
]

const addMenuItem = () => {
  if (!props.navbar.menuItems) {
    props.navbar.menuItems = []
  }
  props.navbar.menuItems.push({
    label: 'New Link',
    sectionId: 'services',
    type: 'section'
  })
}

const removeMenuItem = (index: number) => {
  props.navbar.menuItems?.splice(index, 1)
}

const addFooterLink = () => {
  if (!props.footer.customLinks) {
    props.footer.customLinks = []
  }
  props.footer.customLinks.push({
    label: '',
    url: '',
    openInNewTab: false
  })
}

const removeFooterLink = (index: number) => {
  props.footer.customLinks?.splice(index, 1)
}

const addFooterColumn = () => {
  if (!props.footer.columns) {
    props.footer.columns = []
  }
  props.footer.columns.push({
    title: 'New Column',
    links: []
  })
}

const removeFooterColumn = (index: number) => {
  props.footer.columns?.splice(index, 1)
}

const addColumnLink = (colIndex: number) => {
  if (props.footer.columns?.[colIndex]) {
    if (!props.footer.columns[colIndex].links) {
      props.footer.columns[colIndex].links = []
    }
    props.footer.columns[colIndex].links.push({
      label: '',
      href: ''
    })
  }
}

const removeColumnLink = (colIndex: number, linkIndex: number) => {
  props.footer.columns?.[colIndex]?.links?.splice(linkIndex, 1)
}
</script>
