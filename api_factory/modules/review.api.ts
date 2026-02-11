import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const review_api = {
    getBusinessReviews: (businessId: string) => {
        const url = `/reviews/business/${businessId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    respond: (id: string, payload: { response: string }) => {
        const url = `/reviews/${id}/respond`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    }
}
