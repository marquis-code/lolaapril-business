import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'
import { useUser } from './user'
import type { Business, BusinessSummary } from '~/types/user'

export interface AddBusinessPayload {
  businessName: string
  subdomain: string
  businessType: 'salon' | 'spa' | 'barbershop' | 'beauty_clinic' | 'wellness_center' | 'other'
  businessDescription?: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode?: string
  }
  contact: {
    primaryPhone: string
    email: string
    website?: string
  }
}

export interface AddBusinessResponse {
  success: boolean
  message: string
  business: Business
  accessToken: string
  refreshToken: string
}

export const useAddBusiness = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { setToken, setRefreshToken, updateCurrentBusiness, addBusinessToList } = useUser()

  /**
   * Add a new business under the current user's account
   * This will:
   * 1. Create a new business with the user as owner
   * 2. Start a 14-day trial for the new business
   * 3. Switch context to the new business
   * 4. Update tokens with new business context
   */
  const addBusiness = async (payload: AddBusinessPayload): Promise<AddBusinessResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const res = await auth_api.addBusiness(payload)
      const data = res.data?.data || res.data
      
      if (data.success) {
        // Update tokens with new business context
        if (data.accessToken) {
          setToken(data.accessToken)
        }
        if (data.refreshToken) {
          setRefreshToken(data.refreshToken)
        }
        
        // Add the new business to the businesses list
        if (data.business) {
          const businessSummary: BusinessSummary = {
            id: data.business.id,
            businessName: data.business.businessName,
            subdomain: data.business.subdomain,
            status: data.business.status
          }
          addBusinessToList(businessSummary)
          
          // Update current business context
          updateCurrentBusiness(data.business, data.business.id)
        }
        
        console.log('✅ Business added successfully:', data.business?.businessName)
      }
      
      return data
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to add business'
      error.value = errorMessage
      console.error('❌ Add business error:', errorMessage)
      throw e
    } finally {
      loading.value = false
    }
  }

  return { 
    loading, 
    error, 
    addBusiness,
    // Alias for backwards compatibility
    AddBusiness: addBusiness 
  }
}
