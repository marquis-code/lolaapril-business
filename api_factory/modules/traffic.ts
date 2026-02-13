import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const traffic_api = {
    get_traffic_pages: (startDate: string, endDate: string) => {
        const url = `/analytics/traffic/pages?startDate=${startDate}&endDate=${endDate}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

}