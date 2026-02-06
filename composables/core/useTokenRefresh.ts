import { ref, onMounted, onUnmounted } from 'vue'
import { useTokenManager } from './useTokenManager'

export const useTokenRefresh = () => {
  const refreshInterval = ref<NodeJS.Timeout | null>(null)
  const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000 // Refresh every 14 minutes (assuming 15 min token expiry)
  const tokenManager = useTokenManager()

  const refreshAccessToken = async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      if (!refreshToken) {
        console.log('No refresh token found')
        return
      }

      console.log('Proactively refreshing access token...')
      const baseURL = import.meta.env.VITE_BASE_URL
      const newAccessToken = await tokenManager.refreshAccessToken(baseURL)
      
      console.log('Access token refreshed successfully')
      return newAccessToken
    } catch (error) {
      console.error('Failed to refresh token:', error)
      // Let the 401 interceptor handle logout if refresh fails
    }
  }

  const startTokenRefresh = () => {
    // Initial refresh after 14 minutes
    refreshInterval.value = setInterval(refreshAccessToken, TOKEN_REFRESH_INTERVAL)
    console.log('Token refresh scheduler started')
  }

  const stopTokenRefresh = () => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
      console.log('Token refresh scheduler stopped')
    }
  }

  onMounted(() => {
    const token = tokenManager.getAccessToken()
    if (token) {
      startTokenRefresh()
    }
  })

  onUnmounted(() => {
    stopTokenRefresh()
  })

  return {
    startTokenRefresh,
    stopTokenRefresh,
    refreshAccessToken
  }
}
