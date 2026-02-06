import { GATEWAY_ENDPOINT_WITH_AUTH, GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const pricing_api = {
  createTier: (payload: Record<string, any>) => {
    const url = '/pricing/tiers'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getActiveTiers: () => {
    const url = '/pricing/tiers'
    return GATEWAY_ENDPOINT.get(url)
  },
  getFeeStructure: () => {
    const url = '/pricing/fee-structure'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  upsertFeeStructure: (payload: Record<string, any>) => {
    const url = '/pricing/fee-structure'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  calculateFees: (amount: number) => {
    const url = '/pricing/calculate-fees'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { amount })
  },
  changePlan: (payload: { newTierId: string; changedBy: string; reason: string }) => {
    const url = '/pricing/change-plan'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getHistory: () => {
    const url = '/pricing/history'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  }
}
