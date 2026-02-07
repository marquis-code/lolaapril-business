import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const branding_api = {
  // ==================== THEME MANAGEMENT ====================
  createOrUpdateTheme: (payload: any) => {
    const url = '/branding/theme'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getTheme: () => {
    const url = '/branding/theme'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  updateTheme: (payload: any) => {
    const url = '/branding/theme'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },

  // ==================== STOREFRONT CONFIGURATION ====================
  getStorefrontConfig: () => {
    const url = '/branding/storefront'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  updateFullStorefront: (payload: any) => {
    const url = '/branding/storefront'
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
  },
  updateStorefrontLayout: (payload: any) => {
    const url = '/branding/storefront/layout'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateHeroSection: (payload: any) => {
    const url = '/branding/storefront/hero'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateSectionsOrder: (payload: { sections: any[] }) => {
    const url = '/branding/storefront/sections'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateComponentStyles: (payload: any) => {
    const url = '/branding/storefront/styles'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateNavbar: (payload: any) => {
    const url = '/branding/storefront/navbar'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateFooter: (payload: any) => {
    const url = '/branding/storefront/footer'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateSeo: (payload: any) => {
    const url = '/branding/storefront/seo'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },

  // ==================== PREVIEW SESSION ====================
  createPreviewSession: (payload: any) => {
    const url = '/branding/preview/session'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getPreviewTheme: (previewId: string) => {
    const url = `/preview/theme/${previewId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // ==================== UPLOAD ENDPOINTS (Cloudinary) ====================
  uploadLogo: (file: File) => {
    const url = '/branding/upload/logo'
    const formData = new FormData()
    formData.append('file', file)
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadFavicon: (file: File) => {
    const url = '/branding/upload/favicon'
    const formData = new FormData()
    formData.append('file', file)
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadEmailHeader: (file: File) => {
    const url = '/branding/upload/email-header'
    const formData = new FormData()
    formData.append('file', file)
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadHeroImage: (file: File) => {
    const url = '/branding/upload/hero-image'
    const formData = new FormData()
    formData.append('file', file)
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadGalleryImage: (file: File) => {
    const url = '/branding/upload/gallery'
    const formData = new FormData()
    formData.append('file', file)
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // ==================== CUSTOM DOMAINS ====================
  requestCustomDomain: (payload: { domain: string }) => {
    const url = '/branding/domain'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  verifyDomain: (domainId: string) => {
    const url = `/branding/domain/${domainId}/verify`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
  },
  getDomains: () => {
    const url = '/branding/domains'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getDomain: (domainId: string) => {
    const url = `/branding/domain/${domainId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },

  // ==================== EMAIL TEMPLATES ====================
  createEmailTemplate: (payload: any) => {
    const url = '/branding/email-template'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getEmailTemplate: (templateType: string) => {
    const url = `/branding/email-template/${templateType}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getEmailTemplates: () => {
    const url = '/branding/email-templates'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  updateEmailTemplate: (templateId: string, payload: any) => {
    const url = `/branding/email-template/${templateId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },

  // ==================== BOOKING WIDGETS ====================
  createWidget: (payload: any) => {
    const url = '/branding/widget'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getWidget: (widgetId: string) => {
    const url = `/branding/widget/${widgetId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getWidgets: () => {
    const url = '/branding/widgets'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  updateWidget: (widgetId: string, payload: any) => {
    const url = `/branding/widget/${widgetId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  trackImpression: (widgetId: string) => {
    const url = `/branding/widget/${widgetId}/impression`
    return GATEWAY_ENDPOINT.post(url)
  },
  trackConversion: (widgetId: string) => {
    const url = `/branding/widget/${widgetId}/conversion`
    return GATEWAY_ENDPOINT.post(url)
  },
  getWidgetAnalytics: (widgetId: string, params?: { startDate?: string; endDate?: string }) => {
    const url = `/branding/widget/${widgetId}/analytics`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },

  // ==================== OVERVIEW ====================
  getBrandingOverview: () => {
    const url = '/branding/overview'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },

  // ==================== PUBLIC STOREFRONT (for booking page) ====================
  getPublicStorefront: (subdomain: string) => {
    const url = `/businesses/storefront/${subdomain}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // ==================== SECTION CONTENT MANAGEMENT ====================
  // Get all storefront content (testimonials, FAQs, about, gallery)
  getStorefrontContent: () => {
    const url = '/branding/content'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },

  // Testimonials
  addTestimonial: (payload: {
    clientName: string
    clientPhoto?: string
    clientTitle?: string
    content: string
    rating: number
    serviceName?: string
  }) => {
    const url = '/branding/content/testimonials'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  updateAllTestimonials: (payload: { testimonials: any[] }) => {
    const url = '/branding/content/testimonials'
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
  },
  deleteTestimonial: (id: string) => {
    const url = `/branding/content/testimonials/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url)
  },

  // FAQs
  addFAQ: (payload: {
    question: string
    answer: string
    category?: string
  }) => {
    const url = '/branding/content/faqs'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  updateAllFAQs: (payload: { faqs: any[] }) => {
    const url = '/branding/content/faqs'
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
  },
  deleteFAQ: (id: string) => {
    const url = `/branding/content/faqs/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url)
  },
  importFAQsFromChat: () => {
    const url = '/branding/content/faqs/import'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
  },

  // About Section
  updateAboutSection: (payload: {
    title?: string
    subtitle?: string
    description?: string
    image?: string
    imagePosition?: 'left' | 'right'
    highlights?: string[]
    founderName?: string
    founderPhoto?: string
    founderTitle?: string
    founderQuote?: string
    showTeamStats?: boolean
  }) => {
    const url = '/branding/content/about'
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
  },

  // Gallery (content management)
  addGalleryItem: (payload: {
    url: string
    caption?: string
    category?: string
    serviceName?: string
  }) => {
    const url = '/branding/content/gallery'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  updateAllGalleryItems: (payload: { images: any[] }) => {
    const url = '/branding/content/gallery'
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
  },
  deleteGalleryItem: (id: string) => {
    const url = `/branding/content/gallery/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url)
  }
}
