export type UploadAssetType = 'image' | 'document'

export interface UploadAsset {
    url: string
    publicId: string
    resourceType?: UploadAssetType
    format?: string
    bytes?: number
    width?: number
    height?: number
}

export type KycDocumentType =
    | 'businessRegistration'
    | 'taxIdentification'
    | 'governmentId'
    | 'bankStatement'
    | 'proofOfAddress'

export interface KycUploadResult {
    url: string
    publicId: string
    documentType: KycDocumentType
    uploadedAt: string
}

export interface KycUploadResponse {
    success: boolean
    data: KycUploadResult
    message: string
}