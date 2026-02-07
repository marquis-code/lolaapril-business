import { ref, computed } from 'vue'
import { auth_api } from '~/api_factory/modules'
import { useUser } from './user'
import type { BusinessSummary } from '~/types/user'

export interface UserBusinessesResponse {
  businesses: Array<BusinessSummary & {
    isOwner: boolean
    isCurrent: boolean
  }>
  currentBusinessId: string | null
}

export const useUserBusinesses = () => {
  const businesses = ref<UserBusinessesResponse['businesses']>([])
  const currentBusinessId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { updateBusinessesList, businessId } = useUser()

  /**
   * Fetch all businesses the user has access to
   * This includes:
   * - Owned businesses
   * - Admin businesses  
   * - Staff business (if applicable)
   */
  const fetchUserBusinesses = async (): Promise<UserBusinessesResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const res = await auth_api.getUserBusinesses()
      const data = res.data?.data || res.data
      
      // Handle different response formats
      if (data.businesses) {
        businesses.value = data.businesses
        currentBusinessId.value = data.currentBusinessId || null
        
        // Update the businesses list in the user store
        const businessSummaries: BusinessSummary[] = data.businesses.map((b: any) => ({
          id: b.id,
          businessName: b.businessName,
          subdomain: b.subdomain,
          status: b.status
        }))
        updateBusinessesList(businessSummaries)
      } else if (Array.isArray(data)) {
        businesses.value = data
      }
      
      console.log('✅ Fetched user businesses:', businesses.value.length)
      return {
        businesses: businesses.value,
        currentBusinessId: currentBusinessId.value
      }
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch businesses'
      error.value = errorMessage
      console.error('❌ Fetch user businesses error:', errorMessage)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const ownedBusinesses = computed(() => 
    businesses.value.filter(b => b.isOwner)
  )

  const adminBusinesses = computed(() => 
    businesses.value.filter(b => !b.isOwner)
  )

  const currentBusiness = computed(() => 
    businesses.value.find(b => b.isCurrent) || null
  )

  const hasMultipleBusinesses = computed(() => 
    businesses.value.length > 1
  )

  return { 
    businesses, 
    currentBusinessId,
    ownedBusinesses,
    adminBusinesses,
    currentBusiness,
    hasMultipleBusinesses,
    loading, 
    error, 
    fetchUserBusinesses,
    // Alias for backwards compatibility
    data: businesses,
    UserBusinesses: fetchUserBusinesses 
  }
}
