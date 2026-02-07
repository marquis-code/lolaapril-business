import { ref, computed } from 'vue'
import { branding_api } from '@/api_factory/modules/branding.api'
import type { 
  StorefrontContent, 
  TestimonialItem, 
  FAQItem, 
  AboutContent, 
  GalleryImageItem 
} from '@/types/branding'

export const useStorefrontContent = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const content = ref<StorefrontContent>({
    testimonials: [],
    faqs: [],
    about: {},
    gallery: []
  })

  // ==================== FETCH ALL CONTENT ====================
  const fetchContent = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.getStorefrontContent()
      if (response?.data) {
        content.value = {
          testimonials: response.data.testimonials || [],
          faqs: response.data.faqs || [],
          about: response.data.about || {},
          gallery: response.data.gallery || []
        }
      }
      return content.value
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to fetch content'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== TESTIMONIALS ====================
  const addTestimonial = async (testimonial: Omit<TestimonialItem, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.addTestimonial(testimonial)
      if (response?.data) {
        content.value.testimonials.push(response.data)
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to add testimonial'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAllTestimonials = async (testimonials: TestimonialItem[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.updateAllTestimonials({ testimonials })
      if (response?.data) {
        content.value.testimonials = response.data.testimonials || testimonials
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to update testimonials'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTestimonial = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await branding_api.deleteTestimonial(id)
      content.value.testimonials = content.value.testimonials.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to delete testimonial'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== FAQs ====================
  const addFAQ = async (faq: Omit<FAQItem, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.addFAQ(faq)
      if (response?.data) {
        content.value.faqs.push(response.data)
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to add FAQ'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAllFAQs = async (faqs: FAQItem[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.updateAllFAQs({ faqs })
      if (response?.data) {
        content.value.faqs = response.data.faqs || faqs
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to update FAQs'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteFAQ = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await branding_api.deleteFAQ(id)
      content.value.faqs = content.value.faqs.filter(f => f.id !== id)
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to delete FAQ'
      throw err
    } finally {
      loading.value = false
    }
  }

  const importFAQsFromChat = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.importFAQsFromChat()
      if (response?.data?.faqs) {
        content.value.faqs = [...content.value.faqs, ...response.data.faqs]
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to import FAQs'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== ABOUT SECTION ====================
  const updateAboutSection = async (about: AboutContent) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.updateAboutSection(about)
      if (response?.data) {
        content.value.about = response.data
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to update about section'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== GALLERY ====================
  const addGalleryItem = async (item: Omit<GalleryImageItem, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.addGalleryItem(item)
      if (response?.data) {
        content.value.gallery.push(response.data)
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to add gallery item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAllGalleryItems = async (images: GalleryImageItem[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.updateAllGalleryItems({ images })
      if (response?.data) {
        content.value.gallery = response.data.images || images
      }
      return response?.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to update gallery'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGalleryItem = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await branding_api.deleteGalleryItem(id)
      content.value.gallery = content.value.gallery.filter(g => g.id !== id)
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to delete gallery item'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== COMPUTED ====================
  const testimonials = computed(() => content.value.testimonials)
  const faqs = computed(() => content.value.faqs)
  const about = computed(() => content.value.about)
  const gallery = computed(() => content.value.gallery)

  return {
    // State
    loading,
    error,
    content,
    
    // Computed
    testimonials,
    faqs,
    about,
    gallery,
    
    // Methods
    fetchContent,
    
    // Testimonials
    addTestimonial,
    updateAllTestimonials,
    deleteTestimonial,
    
    // FAQs
    addFAQ,
    updateAllFAQs,
    deleteFAQ,
    importFAQsFromChat,
    
    // About
    updateAboutSection,
    
    // Gallery
    addGalleryItem,
    updateAllGalleryItems,
    deleteGalleryItem
  }
}
