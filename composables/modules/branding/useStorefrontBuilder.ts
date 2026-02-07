import { ref, computed, reactive } from 'vue'
import { branding_api } from '@/api_factory/modules'
import type { 
  StorefrontConfig, 
  StorefrontLayout, 
  HeroSection, 
  StorefrontSection,
  ComponentStyles,
  NavbarConfig,
  FooterConfig,
  SeoConfig,
  Theme
} from '@/types/branding'

/**
 * Comprehensive composable for managing the entire storefront builder
 * Provides centralized state management and API interactions
 */
export const useStorefrontBuilder = () => {
  // ==================== STATE ====================
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const hasChanges = ref(false)
  const lastSaved = ref<Date | null>(null)
  
  // Config data
  const config = reactive<StorefrontConfig>({
    storefront: getDefaultStorefront(),
    componentStyles: getDefaultComponentStyles(),
    navbar: getDefaultNavbar(),
    footer: getDefaultFooter(),
    seo: undefined
  })
  
  const theme = reactive<Theme>({
    colors: getDefaultColors(),
    typography: getDefaultTypography(),
    logo: undefined,
    favicon: undefined,
    customCss: { enabled: false, cssCode: '' }
  })

  const isDefaultTheme = ref(true)
  const isDefaultStorefront = ref(true)

  // ==================== FETCH ====================
  
  const fetchStorefrontConfig = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.getStorefrontConfig()
      const data = response.data?.data || response.data
      
      if (data) {
        isDefaultStorefront.value = data.isDefault ?? true
        
        // Merge with defaults to ensure all fields exist
        if (data.storefront) {
          Object.assign(config.storefront, { ...getDefaultStorefront(), ...data.storefront })
        }
        if (data.componentStyles) {
          Object.assign(config.componentStyles, { ...getDefaultComponentStyles(), ...data.componentStyles })
        }
        if (data.navbar) {
          Object.assign(config.navbar, { ...getDefaultNavbar(), ...data.navbar })
        }
        if (data.footer) {
          Object.assign(config.footer, { ...getDefaultFooter(), ...data.footer })
        }
        if (data.seo) {
          config.seo = data.seo
        }
      }
      
      hasChanges.value = false
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch storefront config'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchTheme = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.getTheme()
      const data = response.data?.data || response.data
      
      if (data) {
        isDefaultTheme.value = data.isDefault ?? true
        const themeData = data.theme || data
        
        if (themeData.colors) {
          Object.assign(theme.colors, { ...getDefaultColors(), ...themeData.colors })
        }
        if (themeData.typography) {
          Object.assign(theme.typography, { ...getDefaultTypography(), ...themeData.typography })
        }
        if (themeData.logo) {
          theme.logo = themeData.logo
        }
        if (themeData.favicon) {
          theme.favicon = themeData.favicon
        }
        if (themeData.customCss) {
          theme.customCss = themeData.customCss
        }
      }
      
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch theme'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      await Promise.all([fetchTheme(), fetchStorefrontConfig()])
      hasChanges.value = false
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch configuration'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ==================== SAVE OPERATIONS ====================

  const saveTheme = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateTheme(theme)
      lastSaved.value = new Date()
      isDefaultTheme.value = false
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save theme'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveFullStorefront = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateFullStorefront(config)
      lastSaved.value = new Date()
      hasChanges.value = false
      isDefaultStorefront.value = false
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save storefront'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveHeroSection = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateHeroSection(config.storefront.hero)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save hero section'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveSectionsOrder = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateSectionsOrder({ sections: config.storefront.sections })
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save sections order'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveComponentStyles = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateComponentStyles(config.componentStyles)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save component styles'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveNavbar = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateNavbar(config.navbar)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save navbar'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveFooter = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateFooter(config.footer)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save footer'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveSeo = async () => {
    saving.value = true
    error.value = null
    try {
      const response = await branding_api.updateSeo(config.seo || {})
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save SEO settings'
      throw e
    } finally {
      saving.value = false
    }
  }

  const saveAll = async () => {
    saving.value = true
    error.value = null
    try {
      await Promise.all([saveTheme(), saveFullStorefront()])
      lastSaved.value = new Date()
      hasChanges.value = false
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to save changes'
      throw e
    } finally {
      saving.value = false
    }
  }

  // ==================== UPLOAD OPERATIONS ====================

  const uploadLogo = async (file: File) => {
    try {
      const response = await branding_api.uploadLogo(file)
      const data = response.data?.data || response.data
      if (data?.url) {
        theme.logo = {
          url: data.url,
          width: data.width || 200,
          height: data.height || 80,
          alt: 'Business Logo'
        }
        hasChanges.value = true
      }
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to upload logo'
      throw e
    }
  }

  const uploadFavicon = async (file: File) => {
    try {
      const response = await branding_api.uploadFavicon(file)
      const data = response.data?.data || response.data
      if (data?.url) {
        theme.favicon = { url: data.url }
        hasChanges.value = true
      }
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to upload favicon'
      throw e
    }
  }

  const uploadHeroImage = async (file: File) => {
    try {
      const response = await branding_api.uploadHeroImage(file)
      const data = response.data?.data || response.data
      if (data?.url) {
        config.storefront.hero.coverImage = data.url
        config.storefront.hero.type = 'image'
        hasChanges.value = true
      }
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to upload hero image'
      throw e
    }
  }

  const uploadHeroVideo = async (file: File) => {
    try {
      const response = await branding_api.uploadHeroImage(file) // Uses same upload endpoint
      const data = response.data?.data || response.data
      if (data?.url) {
        config.storefront.hero.videoUrl = data.url
        config.storefront.hero.type = 'video'
        hasChanges.value = true
      }
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to upload hero video'
      throw e
    }
  }

  const uploadGalleryImage = async (file: File) => {
    try {
      const response = await branding_api.uploadGalleryImage(file)
      const data = response.data?.data || response.data
      if (data?.url) {
        if (!config.storefront.gallery.images) {
          config.storefront.gallery.images = []
        }
        config.storefront.gallery.images.push(data.url)
        hasChanges.value = true
      }
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to upload gallery image'
      throw e
    }
  }

  // ==================== PREVIEW ====================

  const createPreviewSession = async () => {
    try {
      const previewData = {
        ...theme,
        storefront: config.storefront,
        componentStyles: config.componentStyles,
        navbar: config.navbar,
        footer: config.footer,
        seo: config.seo
      }
      const response = await branding_api.createPreviewSession(previewData)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create preview'
      throw e
    }
  }

  // ==================== SECTION MANAGEMENT ====================

  const moveSection = (fromIndex: number, toIndex: number) => {
    const sections = config.storefront.sections
    const [removed] = sections.splice(fromIndex, 1)
    sections.splice(toIndex, 0, removed)
    // Update order values
    sections.forEach((section, index) => {
      section.order = index + 1
    })
    hasChanges.value = true
  }

  const toggleSection = (sectionId: string) => {
    const section = config.storefront.sections.find(s => s.id === sectionId)
    if (section) {
      section.enabled = !section.enabled
      hasChanges.value = true
    }
  }

  const updateSectionTitle = (sectionId: string, title: string, subtitle?: string) => {
    const section = config.storefront.sections.find(s => s.id === sectionId)
    if (section) {
      section.title = title
      if (subtitle !== undefined) section.subtitle = subtitle
      hasChanges.value = true
    }
  }

  // ==================== NAVBAR MENU MANAGEMENT ====================

  const addNavbarMenuItem = (item: { label: string; sectionId?: string; url?: string }) => {
    if (!config.navbar.menuItems) {
      config.navbar.menuItems = []
    }
    config.navbar.menuItems.push(item)
    hasChanges.value = true
  }

  const removeNavbarMenuItem = (index: number) => {
    if (config.navbar.menuItems) {
      config.navbar.menuItems.splice(index, 1)
      hasChanges.value = true
    }
  }

  // ==================== FOOTER LINK MANAGEMENT ====================

  const addFooterLink = (link: { label: string; url: string; openInNewTab?: boolean }) => {
    if (!config.footer.customLinks) {
      config.footer.customLinks = []
    }
    config.footer.customLinks.push(link)
    hasChanges.value = true
  }

  const removeFooterLink = (index: number) => {
    if (config.footer.customLinks) {
      config.footer.customLinks.splice(index, 1)
      hasChanges.value = true
    }
  }

  // ==================== GALLERY MANAGEMENT ====================

  const addGalleryImage = (image: { url: string; alt?: string; caption?: string }) => {
    if (!config.storefront.gallery.images) {
      config.storefront.gallery.images = []
    }
    config.storefront.gallery.images.push(image.url)
    hasChanges.value = true
  }

  const removeGalleryImage = (index: number) => {
    if (config.storefront.gallery.images) {
      config.storefront.gallery.images.splice(index, 1)
      hasChanges.value = true
    }
  }

  const reorderGalleryImages = (images: string[] | { from: number; to: number }) => {
    if (Array.isArray(images)) {
      // Accept array of image URLs directly
      config.storefront.gallery.images = images
    } else {
      // Accept from/to indices
      const { from, to } = images
      if (config.storefront.gallery.images) {
        const imagesList = config.storefront.gallery.images
        const [removed] = imagesList.splice(from, 1)
        imagesList.splice(to, 0, removed)
      }
    }
    hasChanges.value = true
  }

  // ==================== COMPUTED ====================

  const sortedSections = computed(() => {
    return [...config.storefront.sections].sort((a, b) => a.order - b.order)
  })

  const enabledSections = computed(() => {
    return sortedSections.value.filter(s => s.enabled)
  })

  const setupProgress = computed(() => {
    let progress = 0
    if (!isDefaultTheme.value) progress += 30
    if (theme.logo?.url) progress += 10
    if (config.storefront.hero.coverImage || config.storefront.hero.gradient) progress += 15
    if (config.storefront.sections.some(s => s.enabled)) progress += 15
    if (config.navbar.menuItems && config.navbar.menuItems.length > 0) progress += 10
    if (config.footer.enabled) progress += 10
    if (config.seo?.title) progress += 10
    return Math.min(progress, 100)
  })

  // ==================== RESET ====================

  const resetToDefaults = () => {
    Object.assign(theme.colors, getDefaultColors())
    Object.assign(theme.typography, getDefaultTypography())
    theme.logo = undefined
    theme.favicon = undefined
    theme.customCss = { enabled: false, cssCode: '' }
    
    Object.assign(config.storefront, getDefaultStorefront())
    Object.assign(config.componentStyles, getDefaultComponentStyles())
    Object.assign(config.navbar, getDefaultNavbar())
    Object.assign(config.footer, getDefaultFooter())
    config.seo = undefined
    
    hasChanges.value = true
  }

  // ==================== RETURN ====================

  return {
    // State
    loading,
    saving,
    error,
    hasChanges,
    lastSaved,
    config,
    theme,
    isDefaultTheme,
    isDefaultStorefront,
    
    // Computed
    sortedSections,
    enabledSections,
    setupProgress,
    
    // Fetch
    fetchAll,
    fetchTheme,
    fetchStorefrontConfig,
    
    // Save
    saveAll,
    saveTheme,
    saveFullStorefront,
    saveHeroSection,
    saveSectionsOrder,
    saveComponentStyles,
    saveNavbar,
    saveFooter,
    saveSeo,
    
    // Upload
    uploadLogo,
    uploadFavicon,
    uploadHeroImage,
    uploadHeroVideo,
    uploadGalleryImage,
    
    // Preview
    createPreviewSession,
    
    // Section management
    moveSection,
    toggleSection,
    updateSectionTitle,
    
    // Navbar management
    addNavbarMenuItem,
    removeNavbarMenuItem,
    
    // Footer management
    addFooterLink,
    removeFooterLink,
    
    // Gallery management
    addGalleryImage,
    removeGalleryImage,
    reorderGalleryImages,
    
    // Reset
    resetToDefaults
  }
}

// ==================== DEFAULT VALUES ====================

function getDefaultColors() {
  return {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    error: '#EF4444',
    success: '#10B981'
  }
}

function getDefaultTypography() {
  return {
    fontFamily: 'Inter, sans-serif',
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif'
  }
}

function getDefaultStorefront(): StorefrontLayout {
  return {
    hero: {
      enabled: true,
      type: 'gradient',
      gradient: { from: '#3B82F6', to: '#8B5CF6', direction: 'to-right' },
      headline: 'Welcome to Our Salon',
      subheadline: 'Book your appointment today',
      textAlignment: 'center',
      overlayStyle: 'dark',
      overlayOpacity: 0.4,
      height: '500px',
      showBookButton: true,
      bookButtonText: 'Book Now'
    },
    sections: [
      { id: 'services', type: 'services', title: 'Our Services', enabled: true, order: 1 },
      { id: 'staff', type: 'staff', title: 'Meet Our Team', enabled: true, order: 2 },
      { id: 'gallery', type: 'gallery', title: 'Our Work', enabled: false, order: 3 },
      { id: 'testimonials', type: 'testimonials', title: 'What Our Clients Say', enabled: true, order: 4 },
      { id: 'about', type: 'about', title: 'About Us', enabled: true, order: 5 },
      { id: 'contact', type: 'contact', title: 'Contact Us', enabled: true, order: 6 }
    ],
    serviceDisplay: {
      layout: 'grid',
      columns: 3,
      showPrices: true,
      showDuration: true,
      showDescription: true,
      showImages: true,
      groupByCategory: true,
      showFilters: false
    },
    staffDisplay: {
      layout: 'grid',
      columns: 4,
      showBio: true,
      showSpecialties: true,
      showRatings: true,
      showBookButton: false
    },
    gallery: {
      enabled: false,
      images: [],
      layout: 'grid',
      columns: 3
    },
    testimonials: {
      enabled: true,
      showRating: true,
      layout: 'carousel',
      maxToShow: 6
    },
    contact: {
      showMap: true,
      showAddress: true,
      showPhone: true,
      showEmail: true,
      showSocialLinks: true,
      showBusinessHours: true
    },
    bookingFlow: {
      flow: 'service-first',
      allowGuestBooking: true,
      showStaffSelection: true,
      requireStaffSelection: false,
      showServiceImages: true,
      allowMultipleServices: true,
      datePickerStyle: 'calendar',
      showAvailableSlots: true,
      slotDuration: 30,
      advanceBookingDays: 30,
      minAdvanceHours: 2
    },
    socialProof: {
      showReviewCount: true,
      showAverageRating: true,
      showTotalBookings: false,
      showTrustBadges: false,
      badges: []
    }
  }
}

function getDefaultComponentStyles(): ComponentStyles {
  return {
    buttons: {
      borderRadius: '8px',
      style: 'filled',
      size: 'medium',
      uppercase: false,
      fontWeight: '600'
    },
    cards: {
      borderRadius: '12px',
      shadow: true,
      shadowIntensity: 'medium',
      border: true,
      borderColor: '#E5E7EB'
    },
    inputBorderRadius: '8px',
    sectionSpacing: '24px',
    maxContentWidth: '1200px'
  }
}

function getDefaultNavbar(): NavbarConfig {
  return {
    style: 'default',
    showLogo: true,
    showBusinessName: true,
    showBookButton: true,
    bookButtonText: 'Book Now',
    menuItems: [
      { label: 'Services', sectionId: 'services' },
      { label: 'Team', sectionId: 'staff' },
      { label: 'Contact', sectionId: 'contact' }
    ]
  }
}

function getDefaultFooter(): FooterConfig {
  return {
    enabled: true,
    showSocialLinks: true,
    showQuickLinks: true,
    showContactInfo: true,
    showNewsletter: false,
    copyrightText: `© ${new Date().getFullYear()} All rights reserved.`,
    customLinks: []
  }
}
