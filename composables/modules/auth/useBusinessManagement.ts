import { ref, computed } from 'vue'
import { useSwitchBusiness } from './useSwitchBusiness'
import { useAddBusiness, type AddBusinessPayload } from './useAddBusiness'
import { useClearBusinessContext } from './useClearBusinessContext'
import { useUserBusinesses } from './useUserBusinesses'
import { useUser } from './user'
import type { Business, BusinessSummary } from '~/types/user'

/**
 * Comprehensive business management composable
 * Combines all business-related functionality into a single composable
 * for managing multiple businesses under one user account
 */
export const useBusinessManagement = () => {
  // Import individual composables
  const { switchBusiness, loading: switchLoading, error: switchError } = useSwitchBusiness()
  const { addBusiness, loading: addLoading, error: addError } = useAddBusiness()
  const { clearBusinessContext, loading: clearLoading, error: clearError } = useClearBusinessContext()
  const { 
    fetchUserBusinesses, 
    businesses, 
    currentBusiness,
    hasMultipleBusinesses,
    loading: fetchLoading, 
    error: fetchError 
  } = useUserBusinesses()
  
  const { 
    businessId, 
    businessName, 
    subdomain, 
    currentBusiness: activeBusiness,
    allBusinesses,
    isBusinessOwner,
    isOnTrial,
    trialEndsAt 
  } = useUser()

  // Combined loading state
  const isLoading = computed(() => 
    switchLoading.value || addLoading.value || clearLoading.value || fetchLoading.value
  )

  // Combined error state
  const error = computed(() => 
    switchError.value || addError.value || clearError.value || fetchError.value
  )

  // Initialize - fetch all businesses on first use
  const initialized = ref(false)
  
  const initialize = async () => {
    if (initialized.value) return
    
    try {
      await fetchUserBusinesses()
      initialized.value = true
    } catch (e) {
      console.error('Failed to initialize business management:', e)
    }
  }

  /**
   * Switch to a different business
   * Updates tokens and local state
   */
  const switchToBusiness = async (targetBusinessId: string) => {
    try {
      const result = await switchBusiness(targetBusinessId)
      
      // Refresh the businesses list to get updated isCurrent flags
      await fetchUserBusinesses()
      
      return result
    } catch (e) {
      throw e
    }
  }

  /**
   * Create a new business under the current user
   * Automatically switches to the new business
   */
  const createNewBusiness = async (payload: AddBusinessPayload) => {
    try {
      const result = await addBusiness(payload)
      
      // Refresh the businesses list
      await fetchUserBusinesses()
      
      return result
    } catch (e) {
      throw e
    }
  }

  /**
   * Switch to client mode (no business context)
   */
  const switchToClientMode = async () => {
    try {
      const result = await clearBusinessContext()
      return result
    } catch (e) {
      throw e
    }
  }

  /**
   * Refresh the list of businesses
   */
  const refreshBusinesses = async () => {
    return await fetchUserBusinesses()
  }

  /**
   * Check if user can add more businesses
   * (Could be limited by subscription plan)
   */
  const canAddBusiness = computed(() => {
    // For now, always allow. In future, check subscription limits
    return true
  })

  /**
   * Get a specific business by ID
   */
  const getBusinessById = (id: string): BusinessSummary | undefined => {
    return businesses.value.find(b => b.id === id)
  }

  /**
   * Check if user has access to a specific business
   */
  const hasAccessToBusiness = (id: string): boolean => {
    return businesses.value.some(b => b.id === id)
  }

  return {
    // State
    businesses,
    currentBusiness,
    activeBusiness,
    businessId,
    businessName,
    subdomain,
    
    // Computed
    isLoading,
    error,
    hasMultipleBusinesses,
    canAddBusiness,
    isBusinessOwner,
    isOnTrial,
    trialEndsAt,
    
    // Methods
    initialize,
    switchToBusiness,
    createNewBusiness,
    switchToClientMode,
    refreshBusinesses,
    getBusinessById,
    hasAccessToBusiness,
    
    // Individual loading states (for granular control)
    switchLoading,
    addLoading,
    clearLoading,
    fetchLoading,
  }
}
