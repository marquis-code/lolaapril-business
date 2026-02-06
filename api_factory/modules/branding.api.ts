import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const branding_api = {
  // Theme
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
  previewTheme: (params: any) => {
    const url = '/branding/preview/theme'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },

  // Custom domains
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

  // Email templates
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

  // Widgets
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

  // Overview
  getBrandingOverview: () => {
    const url = '/branding/overview'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  }
}
