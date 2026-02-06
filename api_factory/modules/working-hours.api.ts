import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const working_hours_api = {
  getBusinessWorkingHours: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/businesses/working-hours')
  },
  createBusinessWorkingHours: (workingHours: any[]) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/businesses/working-hours', workingHours)
  },
  updateBusinessWorkingHours: (workingHours: any[]) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/businesses/working-hours', workingHours)
  }
}
