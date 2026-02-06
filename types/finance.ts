export interface PaymentItem {
    itemType: 'service' | 'product' | 'bundle';
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tax?: number;
    discount?: number;
}

export interface Payment {
    _id: string;
    paymentReference: string;
    clientId: string;
    appointmentId?: string;
    bookingId?: string;
    items: PaymentItem[];
    subtotal: number;
    totalDiscount?: number;
    totalTax?: number;
    serviceCharge?: number;
    totalAmount: number;
    paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'online';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
    transactionId?: string;
    processedBy?: string;
    notes?: string;
    createdBy?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface SaleItem {
    itemType: 'service' | 'product' | 'bundle';
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    staffId?: string;
    staffName?: string;
    commission?: number;
}

export interface Sale {
    _id: string;
    saleNumber: string;
    clientId: string;
    appointmentId?: string;
    bookingId?: string;
    items: SaleItem[];
    subtotal: number;
    totalDiscount?: number;
    totalTax?: number;
    serviceCharge?: number;
    totalAmount: number;
    amountPaid: number;
    amountDue?: number;
    paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
    status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
    createdBy?: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateSaleDto {
    clientId: string;
    items: SaleItem[];
    subtotal: number;
    totalAmount: number;
    amountPaid: number;
    paymentStatus: string;
    status: string;
    createdBy?: string;
}
