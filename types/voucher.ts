export type VoucherStatus = 'active' | 'inactive' | 'expired' | 'used_up'
export type VoucherDiscountType = 'percentage' | 'fixed_amount' | 'service_discount' | 'buy_one_get_one'

export interface VoucherRestrictions {
  applicableServices?: string[]
  applicableCategories?: string[]
  minimumSpend?: number
  maximumDiscount?: number
  excludedServices?: string[]
  firstTimeClientsOnly?: boolean
  applicableDays?: string[]
}

export interface Voucher {
  _id: string
  voucherCode: string
  voucherName: string
  description: string
  discountType: VoucherDiscountType
  discountValue: number
  validFrom: string
  validUntil: string
  usageLimit?: number
  usagePerClient?: number
  usageCount?: number
  status?: VoucherStatus
  restrictions?: VoucherRestrictions
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateVoucherDto {
  voucherCode: string
  voucherName: string
  description: string
  discountType: VoucherDiscountType
  discountValue: number
  validFrom: string
  validUntil: string
  usageLimit?: number
  usagePerClient?: number
  restrictions?: VoucherRestrictions
  status?: VoucherStatus
}

export type UpdateVoucherDto = Partial<CreateVoucherDto>

export interface VoucherQueryDto {
  page?: number
  limit?: number
  status?: VoucherStatus
  discountType?: VoucherDiscountType
  validFrom?: string
  validUntil?: string
  search?: string
}

export interface VoucherStats {
  total?: number
  active?: number
  inactive?: number
  expired?: number
  used_up?: number
  redeemed?: number
}
