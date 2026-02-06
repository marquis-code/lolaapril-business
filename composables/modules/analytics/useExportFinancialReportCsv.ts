import { ref } from 'vue'
import { analytics_api } from '~/api_factory/modules'

export const useExportFinancialReportCsv = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (
        reportId: string,
        options?: { filename?: string; autoDownload?: boolean }
    ) => {
        loading.value = true
        error.value = null
        try {
            const response = await analytics_api.exportReportToCSV(reportId)
            const blob = new Blob([response.data], { type: 'text/csv' })

            if (typeof window !== 'undefined' && options?.autoDownload !== false) {
                const filename = options?.filename || `financial-report-${reportId}.csv`
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
            }

            return blob
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        execute
    }
}
