<template>
  <UiModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
    :title="'Request Details'"
  >
    <div v-if="selectedRequest" class="request-modal">

      <!-- Header Band -->
      <div class="modal-header-band">
        <div class="request-number-badge">
          <span class="req-label">Request</span>
          <span class="req-number">{{ selectedRequest.requestNumber }}</span>
        </div>
        <div class="status-pill" :class="selectedRequest.status">
          <span class="status-dot"></span>
          {{ capitalise(selectedRequest.status) }}
        </div>
      </div>

      <!-- Client Card -->
      <div class="section-card client-card">
        <div class="avatar-circle">{{ initials(selectedRequest.clientName) }}</div>
        <div class="client-info">
          <p class="client-name">{{ selectedRequest.clientName }}</p>
          <p class="client-email">{{ selectedRequest.clientEmail }}</p>
          <p class="client-phone" v-if="selectedRequest.clientPhone">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {{ selectedRequest.clientPhone }}
          </p>
        </div>
      </div>

      <!-- Two-col details -->
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-icon">📅</span>
          <div>
            <p class="detail-label">Date &amp; Time</p>
            <p class="detail-value">{{ formatDate(selectedRequest.requestedDate) }}</p>
            <p class="detail-sub">{{ selectedRequest.requestedTime }}</p>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">👥</span>
          <div>
            <p class="detail-label">Number of People</p>
            <p class="detail-value">{{ selectedRequest.numberOfPeople }}</p>
          </div>
        </div>
        <div class="detail-item full-col" v-if="selectedRequest.location?.address">
          <span class="detail-icon">📍</span>
          <div>
            <p class="detail-label">Location</p>
            <p class="detail-value">{{ selectedRequest.location.address }}</p>
            <p class="detail-sub" v-if="selectedRequest.location.additionalDirections">
              {{ selectedRequest.location.additionalDirections }}
            </p>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="section-card services-card">
        <p class="section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          Services
        </p>
        <div class="service-row" v-for="service in selectedRequest.services" :key="service._id">
          <div class="service-name-wrap">
            <span class="service-dot"></span>
            <div class="flex flex-col">
              <span class="service-name">{{ service.serviceName }}</span>
              <span v-if="service.variantName" class="variant-name">{{ service.variantName }}</span>
            </div>
          </div>
          <div class="service-pricing">
            <span class="service-qty">× {{ service.quantity }}</span>
            <span class="service-price">₦{{ Number(service.price).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="notes-block" v-if="selectedRequest.clientNotes">
        <p class="detail-label notes-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Client Notes
        </p>
        <p class="notes-text">{{ selectedRequest.clientNotes }}</p>
      </div>

      <!-- Total Footer -->
      <div class="total-footer">
        <div class="payment-status" :class="selectedRequest.paymentStatus">
          Payment: {{ capitalise(selectedRequest.paymentStatus) }}
        </div>
        <div class="total-amount">
          <span class="total-label">Total</span>
          <span class="total-value">₦{{ Number(selectedRequest.totalAmount).toLocaleString() }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button @click="emit('update:modelValue', false)" class="btn-close">Close</button>
      </div>

    </div>
  </UiModal>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  selectedRequest: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'close'): void
}>()

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-NG', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  })
}
function capitalise(str: string) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
function initials(name: string) {
  if (!name) return '?'
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>

<style scoped>
.request-modal {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  background: #ffffff;
  color: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  min-width: 420px;
}

/* ── Header Band ── */
.modal-header-band {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.request-number-badge {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.req-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
}
.req-number {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.02em;
}

/* ── Status Pills ── */
.status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: capitalize;
  border: 1px solid;
}
.status-pill.pending   { background: #fffbeb; border-color: #fcd34d; color: #b45309; }
.status-pill.confirmed,
.status-pill.accepted  { background: #f0fdf4; border-color: #6ee7b7; color: #065f46; }
.status-pill.cancelled,
.status-pill.rejected  { background: #fef2f2; border-color: #fca5a5; color: #991b1b; }
.status-pill.completed { background: #f5f3ff; border-color: #c4b5fd; color: #5b21b6; }

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* ── Cards ── */
.section-card {
  margin: 16px 24px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

/* ── Client Card ── */
.client-card {
  display: flex;
  align-items: center;
  gap: 14px;
}
.avatar-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
  flex-shrink: 0;
}
.client-info  { flex: 1; }
.client-name  { font-size: 17px; font-weight: 700; color: #111827; margin: 0 0 2px; }
.client-email { font-size: 12px; color: #6b7280; margin: 0 0 4px; }
.client-phone { font-size: 12px; color: #374151; display: flex; align-items: center; gap: 5px; margin: 0; }

/* ── Detail Grid ── */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 24px;
}
.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
}
.detail-item.full-col { grid-column: 1 / -1; }
.detail-icon  { font-size: 16px; line-height: 1; margin-top: 1px; }
.detail-label {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
  margin: 0 0 4px;
}
.detail-value { font-size: 13px; font-weight: 500; color: #111827; margin: 0 0 2px; }
.detail-sub   { font-size: 11px; color: #6b7280; margin: 0; }

/* ── Services ── */
.services-card { padding: 14px 16px; }
.section-title {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
}
.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid #f3f4f6;
}
.service-row:last-child { border-bottom: none; }
.service-name-wrap { display: flex; align-items: center; gap: 8px; }
.service-dot   { width: 5px; height: 5px; border-radius: 50%; background: #374151; flex-shrink: 0; }
.service-name  { font-size: 13px; color: #1f2937; font-weight: 500; }
.variant-name  { font-size: 10px; color: #9ca3af; margin-top: 1px; }
.service-pricing { display: flex; align-items: center; gap: 10px; }
.service-qty   { font-size: 11px; color: #9ca3af; }
.service-price { font-size: 14px; font-weight: 600; color: #111827; }

/* ── Notes ── */
.notes-block {
  margin: 0 24px 16px;
  padding: 12px 14px;
  background: #f9fafb;
  border-left: 3px solid #d1d5db;
  border-radius: 0 8px 8px 0;
}
.notes-label  { display: flex; align-items: center; gap: 5px; margin-bottom: 6px !important; }
.notes-text   { font-size: 12px; color: #4b5563; font-style: italic; line-height: 1.6; margin: 0; }

/* ── Total Footer ── */
.total-footer {
  margin: 0 24px 16px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.payment-status {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #fcd34d;
  color: #b45309;
  background: #fffbeb;
}
.payment-status.paid {
  border-color: #6ee7b7;
  color: #065f46;
  background: #f0fdf4;
}
.total-amount { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.total-label  { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af; }
.total-value  { font-size: 22px; font-weight: 700; color: #111827; line-height: 1; }

/* ── Actions ── */
.modal-actions { padding: 0 24px 20px; display: flex; justify-content: flex-end; }
.btn-close {
  padding: 9px 22px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.btn-close:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}
</style>