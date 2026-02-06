import axios from 'axios'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

export const useTokenManager = () => {
  const getAccessToken = (): string | null => {
    try {
      const token = localStorage.getItem('token')
      return token ? JSON.parse(token) : null
    } catch {
      return null
    }
  }

  const getRefreshToken = (): string | null => {
    try {
      const token = localStorage.getItem('refreshToken')
      return token ? JSON.parse(token) : null
    } catch {
      return null
    }
  }

  const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('token', JSON.stringify(accessToken))
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
  }

  const clearTokens = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('business')
    localStorage.removeItem('businesses')
  }

  const refreshAccessToken = async (baseURL: string): Promise<string> => {
    if (isRefreshing) {
      // Wait for the ongoing refresh
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
    }

    isRefreshing = true

    try {
      const refreshToken = getRefreshToken()
      
      if (!refreshToken) {
        isRefreshing = false
        throw new Error('No refresh token available')
      }

      console.log('Refreshing access token...')

      // Create a new axios instance for refresh request to avoid interceptor loop
      const response = await axios.post(`${baseURL}/auth/refresh`, {
        refreshToken
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data

      console.log('Token refresh successful')

      // Update tokens in localStorage
      setTokens(accessToken, newRefreshToken)

      // Process queued requests
      processQueue(null, accessToken)

      return accessToken
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message)
      
      // Process queued requests with error
      processQueue(error, null)
      
      // Don't clear tokens here - let the caller (axios interceptor) handle logout
      // This prevents clearing tokens before the refresh endpoint is even called
      throw error
    } finally {
      isRefreshing = false
    }
  }

  const isTokenRefreshing = () => isRefreshing

  const queueFailedRequest = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  return {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
    refreshAccessToken,
    isTokenRefreshing,
    queueFailedRequest
  }
}
