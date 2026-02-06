<template>
  <div class="space-y-8">
    <section class="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 class="text-lg font-semibold text-gray-900">Upload Single Image</h3>
      <p class="text-sm text-gray-500 mt-1">Upload a single image file.</p>
      <div class="mt-4 flex flex-col md:flex-row gap-4 items-center">
        <input ref="singleImageInput" type="file" accept="image/*" class="w-full" />
        <button @click="handleUploadImage" class="bg-black text-white px-4 py-2 rounded-lg" :disabled="uploadImageLoading">
          {{ uploadImageLoading ? 'Uploading...' : 'Upload Image' }}
        </button>
      </div>
      <div v-if="imageResult" class="mt-4 text-sm text-gray-600">
        <div class="font-medium">Uploaded:</div>
        <a :href="imageResult.url" target="_blank" class="text-primary underline">{{ imageResult.url }}</a>
        <div class="text-xs text-gray-500">Public ID: {{ imageResult.publicId }}</div>
      </div>
    </section>

    <section class="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 class="text-lg font-semibold text-gray-900">Upload Multiple Images</h3>
      <p class="text-sm text-gray-500 mt-1">Upload up to 10 images at once.</p>
      <div class="mt-4 flex flex-col md:flex-row gap-4 items-center">
        <input ref="multiImageInput" type="file" accept="image/*" multiple class="w-full" />
        <button @click="handleUploadImages" class="bg-black text-white px-4 py-2 rounded-lg" :disabled="uploadImagesLoading">
          {{ uploadImagesLoading ? 'Uploading...' : 'Upload Images' }}
        </button>
      </div>
      <div v-if="imagesResult.length" class="mt-4 text-sm text-gray-600 space-y-2">
        <div class="font-medium">Uploaded:</div>
        <div v-for="asset in imagesResult" :key="asset.publicId" class="text-xs">
          <a :href="asset.url" target="_blank" class="text-primary underline">{{ asset.url }}</a>
        </div>
      </div>
    </section>

    <section class="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 class="text-lg font-semibold text-gray-900">Upload Document</h3>
      <p class="text-sm text-gray-500 mt-1">Upload a single document (PDF, JPG, PNG, WEBP).</p>
      <div class="mt-4 flex flex-col md:flex-row gap-4 items-center">
        <input ref="documentInput" type="file" class="w-full" />
        <button @click="handleUploadDocument" class="bg-black text-white px-4 py-2 rounded-lg" :disabled="uploadDocumentLoading">
          {{ uploadDocumentLoading ? 'Uploading...' : 'Upload Document' }}
        </button>
      </div>
      <div v-if="documentResult" class="mt-4 text-sm text-gray-600">
        <div class="font-medium">Uploaded:</div>
        <a :href="documentResult.url" target="_blank" class="text-primary underline">{{ documentResult.url }}</a>
        <div class="text-xs text-gray-500">Public ID: {{ documentResult.publicId }}</div>
      </div>
    </section>

    <section class="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 class="text-lg font-semibold text-gray-900">Upload KYC Document</h3>
      <p class="text-sm text-gray-500 mt-1">Attach KYC documents to a business.</p>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UiAnimatedInput v-model="kycForm.businessId" type="text" label="Business ID" />
        <UiSelectInput
          v-model="kycForm.documentType"
          label="Document Type"
          :options="documentTypeOptions"
          option-label="label"
          option-value="value"
        />
      </div>
      <div class="mt-4 flex flex-col md:flex-row gap-4 items-center">
        <input ref="kycInput" type="file" class="w-full" />
        <button @click="handleUploadKyc" class="bg-black text-white px-4 py-2 rounded-lg" :disabled="uploadKycLoading">
          {{ uploadKycLoading ? 'Uploading...' : 'Upload KYC' }}
        </button>
      </div>
      <div v-if="kycResult" class="mt-4 text-sm text-gray-600">
        <div class="font-medium">Uploaded:</div>
        <a :href="kycResult.data.url" target="_blank" class="text-primary underline">{{ kycResult.data.url }}</a>
        <div class="text-xs text-gray-500">Document Type: {{ kycResult.data.documentType }}</div>
      </div>
    </section>

    <section class="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 class="text-lg font-semibold text-gray-900">Delete Image</h3>
      <p class="text-sm text-gray-500 mt-1">Delete an image using its public ID.</p>
      <div class="mt-4 flex flex-col md:flex-row gap-4 items-center">
        <UiAnimatedInput v-model="publicId" type="text" label="Public ID" placeholder="publicId" />
        <button @click="handleDeleteImage" class="bg-rose-500 text-white px-4 py-2 rounded-lg" :disabled="deleteLoading">
          {{ deleteLoading ? 'Deleting...' : 'Delete Image' }}
        </button>
      </div>
      <div v-if="deleteMessage" class="mt-4 text-sm text-gray-600">{{ deleteMessage }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { KycDocumentType, KycUploadResponse, UploadAsset } from '~/types/upload'
import { useUploadImage } from '@/composables/modules/upload/useUploadImage'
import { useUploadImages } from '@/composables/modules/upload/useUploadImages'
import { useUploadDocument } from '@/composables/modules/upload/useUploadDocument'
import { useUploadKycDocument } from '@/composables/modules/upload/useUploadKycDocument'
import { useDeleteImage } from '@/composables/modules/upload/useDeleteImage'

const singleImageInput = ref<HTMLInputElement | null>(null)
const multiImageInput = ref<HTMLInputElement | null>(null)
const documentInput = ref<HTMLInputElement | null>(null)
const kycInput = ref<HTMLInputElement | null>(null)

const { data: imageResult, loading: uploadImageLoading, execute: uploadImage } = useUploadImage()
const { data: imagesResult, loading: uploadImagesLoading, execute: uploadImages } = useUploadImages()
const { data: documentResult, loading: uploadDocumentLoading, execute: uploadDocument } = useUploadDocument()
const { data: kycResult, loading: uploadKycLoading, execute: uploadKycDocument } = useUploadKycDocument()
const { loading: deleteLoading, execute: deleteImage } = useDeleteImage()

const publicId = ref('')
const deleteMessage = ref('')

// Options for document type
const documentTypeOptions = [
  { label: 'Business Registration', value: 'businessRegistration' },
  { label: 'Tax Identification', value: 'taxIdentification' },
  { label: 'Government ID', value: 'governmentId' },
  { label: 'Bank Statement', value: 'bankStatement' },
  { label: 'Proof Of Address', value: 'proofOfAddress' }
]

const kycForm = reactive<{ businessId: string; documentType: KycDocumentType }>({
  businessId: '',
  documentType: 'businessRegistration'
})

const handleUploadImage = async () => {
  const file = singleImageInput.value?.files?.[0]
  if (!file) return alert('Select an image file')
  await uploadImage(file)
}

const handleUploadImages = async () => {
  const files: File[] = multiImageInput.value?.files ? Array.from(multiImageInput.value.files) as File[] : []
  if (!files.length) return alert('Select image files')
  await uploadImages(files)
}

const handleUploadDocument = async () => {
  const file = documentInput.value?.files?.[0]
  if (!file) return alert('Select a document file')
  await uploadDocument(file)
}

const handleUploadKyc = async () => {
  const file = kycInput.value?.files?.[0]
  if (!file) return alert('Select a KYC file')
  if (!kycForm.businessId) return alert('Business ID is required')

  await uploadKycDocument({
    file,
    businessId: kycForm.businessId,
    documentType: kycForm.documentType
  })
}

const handleDeleteImage = async () => {
  if (!publicId.value) return alert('Public ID is required')
  const response = await deleteImage(publicId.value)
  deleteMessage.value = response?.message || 'Image deleted successfully'
}
</script>