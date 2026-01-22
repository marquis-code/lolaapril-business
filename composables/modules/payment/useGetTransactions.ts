import { payment_api } from "@/api_factory/modules/payment"
import type { Business } from "@/types/business"

export const useGetTransactions  = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    // Global state for business
    const transactions = ref([]) as any

    const getTransactions  = async () => {
        loading.value = true
        error.value = null
        try {
            const res = (await payment_api.myTransactions()) as any
            if (res.data?.success) {
                transactions.value = res.data.data
            } else {
                throw new Error('Business not found')
            }
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
       getTransactions()
    })

    return { loading, error, transactions, getTransactions }
}
