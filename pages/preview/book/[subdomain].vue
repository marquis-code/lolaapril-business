<template>
  <div class="preview-container" :style="themeStyles">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading preview...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Preview Not Found</h2>
      <p>{{ error }}</p>
      <button @click="closePreview" class="close-btn">Close</button>
    </div>

    <!-- Preview Content -->
    <template v-else>
      <!-- Preview Header Banner -->
      <div class="preview-banner">
        <span>🎨 Theme Preview Mode</span>
        <span class="preview-subdomain">{{ subdomain }}</span>
        <button @click="closePreview" class="close-btn">Close Preview</button>
      </div>

      <!-- Your actual booking page content here -->
      <div class="preview-content">
        <!-- Logo Preview -->
        <header class="preview-header">
          <img 
            v-if="theme?.logo?.url" 
            :src="theme.logo.url" 
            :alt="theme.logo.alt || 'Logo'"
            :style="{ width: (theme.logo.width || 120) + 'px', height: (theme.logo.height || 40) + 'px' }"
            class="logo"
          />
          <h1>{{ storefront?.business?.businessName || theme?.businessName || 'Your Business Name' }}</h1>
        </header>

        <!-- Sample UI Elements to Preview Theme -->
        <main class="preview-main">
          <section class="preview-section">
            <h2>Theme Preview</h2>
            <p>This is how your booking page will look with the selected theme.</p>
            
            <!-- Color Swatches -->
            <div class="color-swatches">
              <div class="swatch" :style="{ backgroundColor: theme?.colors?.primary }">
                <span>Primary</span>
              </div>
              <div class="swatch" :style="{ backgroundColor: theme?.colors?.secondary }">
                <span>Secondary</span>
              </div>
              <div class="swatch" :style="{ backgroundColor: theme?.colors?.accent }">
                <span>Accent</span>
              </div>
              <div class="swatch" :style="{ backgroundColor: theme?.colors?.success }">
                <span>Success</span>
              </div>
              <div class="swatch" :style="{ backgroundColor: theme?.colors?.error }">
                <span>Error</span>
              </div>
            </div>

            <!-- Sample Buttons -->
            <div class="button-preview">
              <button class="btn-primary">Book Appointment</button>
              <button class="btn-secondary">View Services</button>
              <button class="btn-accent">Special Offer</button>
            </div>

            <!-- Sample Card -->
            <div class="sample-card">
              <h3>Sample Service</h3>
              <p>This is how service cards will appear on your booking page.</p>
              <div class="card-footer">
                <span class="price">$99.00</span>
                <button class="btn-primary">Book Now</button>
              </div>
            </div>

            <!-- Typography Preview -->
            <div class="typography-preview">
              <h1>Heading 1 - {{ theme?.typography?.headingFont || 'Default Font' }}</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <p>Body text using {{ theme?.typography?.bodyFont || 'Default Font' }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>

            <!-- Services Preview (if available from storefront) -->
            <div v-if="storefront?.services?.length" class="services-preview">
              <h2>Services</h2>
              <div class="services-grid">
                <div v-for="service in storefront.services.slice(0, 4)" :key="service._id" class="service-card">
                  <h4>{{ service.name }}</h4>
                  <p>{{ service.description }}</p>
                  <div class="service-footer">
                    <span class="price">${{ service.price }}</span>
                    <span class="duration">{{ service.duration }} min</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { branding_api } from '@/api_factory/modules'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  error: string
  success: string
}

interface ThemeTypography {
  fontFamily: string
  headingFont: string
  bodyFont: string
}

interface ThemeLogo {
  url: string
  width: number
  height: number
  alt: string
}

interface Theme {
  colors: ThemeColors
  typography: ThemeTypography
  logo?: ThemeLogo
  favicon?: { url: string }
  customCss?: { enabled: boolean; cssCode: string }
  businessName?: string
}

interface StorefrontResponse {
  business?: {
    businessName: string
    subdomain: string
  }
  services?: Array<{
    _id: string
    name: string
    description: string
    price: number
    duration: number
  }>
  staff?: Array<any>
  theme?: Theme
}

const route = useRoute()

const theme = ref<Theme | null>(null)
const storefront = ref<StorefrontResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const subdomain = computed(() => route.params.subdomain as string)
const previewId = computed(() => route.query.previewId as string)

// Fetch data based on whether we have a previewId or not
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    // If we have a previewId, fetch the preview theme
    if (previewId.value) {
      const previewResponse = await branding_api.getPreviewTheme(previewId.value)
      const previewData = previewResponse.data?.data || previewResponse.data
      
      if (previewData?.theme) {
        theme.value = previewData.theme
      } else if (previewData) {
        theme.value = previewData
      }
    }
    
    // Also fetch the storefront data for the subdomain (for business info, services, etc.)
    if (subdomain.value) {
      try {
        const storefrontResponse = await GATEWAY_ENDPOINT.get(`/businesses/storefront/${subdomain.value}`)
        storefront.value = storefrontResponse.data?.data || storefrontResponse.data
        
        // If no preview theme, use the storefront theme
        if (!theme.value && storefront.value?.theme) {
          theme.value = storefront.value.theme
        }
      } catch (e) {
        // Storefront fetch is optional - preview can still work without it
        console.warn('Could not fetch storefront data:', e)
      }
    }
    
    if (!theme.value) {
      error.value = 'Preview data not found'
      return
    }
    
    // Apply favicon if present
    if (theme.value?.favicon?.url) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = theme.value.favicon.url
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    
    // Inject custom CSS if enabled
    if (theme.value?.customCss?.enabled && theme.value?.customCss?.cssCode) {
      const style = document.createElement('style')
      style.id = 'theme-custom-css'
      style.textContent = theme.value.customCss.cssCode
      document.head.appendChild(style)
    }
  } catch (e: any) {
    console.error('Failed to fetch preview:', e)
    error.value = e.response?.data?.message || 'Failed to load preview'
  } finally {
    loading.value = false
  }
})

// Generate inline CSS variables
const themeStyles = computed(() => {
  if (!theme.value) return {}
  
  const { colors, typography } = theme.value
  
  return {
    '--color-primary': colors?.primary || '#3B82F6',
    '--color-secondary': colors?.secondary || '#10B981',
    '--color-accent': colors?.accent || '#F59E0B',
    '--color-background': colors?.background || '#FFFFFF',
    '--color-text': colors?.text || '#1F2937',
    '--color-error': colors?.error || '#EF4444',
    '--color-success': colors?.success || '#10B981',
    '--font-family': typography?.fontFamily || 'Inter, sans-serif',
    '--font-heading': typography?.headingFont || 'Inter, sans-serif',
    '--font-body': typography?.bodyFont || 'Inter, sans-serif',
    backgroundColor: colors?.background || '#FFFFFF',
    color: colors?.text || '#1F2937',
    fontFamily: typography?.fontFamily || 'Inter, sans-serif',
  }
})

// Close preview
const closePreview = () => {
  window.close()
}
</script>

<style scoped>
.preview-container {
  min-height: 100vh;
  padding-top: 50px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 48px;
}

.error-container h2 {
  margin: 0;
  color: #1f2937;
}

.error-container p {
  color: #6b7280;
  margin: 0;
}

.preview-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 9999;
  font-weight: 600;
}

.preview-subdomain {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.preview-banner .close-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.preview-header {
  text-align: center;
  padding: 40px 20px;
  border-bottom: 1px solid #eee;
}

.preview-header .logo {
  margin-bottom: 20px;
  object-fit: contain;
}

.preview-header h1 {
  font-family: var(--font-heading);
  color: var(--color-text);
  margin: 0;
}

.preview-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.preview-section h2 {
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin-bottom: 20px;
}

.color-swatches {
  display: flex;
  gap: 16px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.swatch {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.swatch span {
  background: rgba(255,255,255,0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.button-preview {
  display: flex;
  gap: 16px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-accent {
  background-color: var(--color-accent);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.sample-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  margin: 30px 0;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.sample-card h3 {
  font-family: var(--font-heading);
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.sample-card p {
  font-family: var(--font-body);
  color: #6b7280;
  margin: 0 0 20px 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.typography-preview {
  margin-top: 40px;
  padding: 30px;
  background: #f9fafb;
  border-radius: 16px;
}

.typography-preview h1 {
  font-family: var(--font-heading);
  color: var(--color-text);
}

.typography-preview h2 {
  font-family: var(--font-heading);
  color: var(--color-text);
}

.typography-preview h3 {
  font-family: var(--font-heading);
  color: var(--color-text);
}

.typography-preview p {
  font-family: var(--font-body);
  color: var(--color-text);
  line-height: 1.6;
}

/* Services Preview */
.services-preview {
  margin-top: 40px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.service-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.service-card h4 {
  font-family: var(--font-heading);
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.service-card p {
  font-family: var(--font-body);
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-footer .price {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
}

.service-footer .duration {
  font-size: 14px;
  color: #9ca3af;
}
</style>
