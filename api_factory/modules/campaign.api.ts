import { GATEWAY_ENDPOINT } from '../axios.config'

export const campaign_api = {
    create: (payload: any) => {
        const url = '/business/campaigns'
        return GATEWAY_ENDPOINT.post(url, payload)
    },
    fetch_campaigns: () => {
        const url = '/business/campaigns'
        return GATEWAY_ENDPOINT.get(url)
    },
    fetch_campaign_details: (id: string) => {
        const url = `/business/campaigns/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },
    update: (id: string, payload: any) => {
        const url = `/business/campaigns/${id}`
        return GATEWAY_ENDPOINT.put(url, payload)
    },
    duplicate: (id: string) => {
        const url = `/business/campaigns/${id}/duplicate`
        return GATEWAY_ENDPOINT.post(url, {})
    },
    delete: (id: string) => {
        const url = `/business/campaigns/${id}`
        return GATEWAY_ENDPOINT.delete(url)
    },
    fetch_assets: () => {
        const url = '/business/campaigns/assets/emails'
        return GATEWAY_ENDPOINT.get(url)
    }
}
