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
            <span class="service-name">{{ service.serviceName }}</span>
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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.request-modal {
  font-family: 'DM Sans', sans-serif;
  background: #0d0d0f;
  color: #e8e4dc;
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
  background: linear-gradient(135deg, #1a1208 0%, #0d0d0f 100%);
  border-bottom: 1px solid rgba(196,158,75,.15);
}
.request-number-badge { display: flex; flex-direction: column; gap: 2px; }
.req-label  { font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: #c49e4b; opacity: .7; }
.req-number { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #c49e4b; letter-spacing: .05em; }

/* ── Status Pills ── */
.status-pill {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 999px;
  font-size: 11px; font-weight: 500; letter-spacing: .05em;
  text-transform: capitalize; border: 1px solid;
}
.status-pill.pending   { background: rgba(251,191,36,.08); border-color: rgba(251,191,36,.3); color: #fbbf24; }
.status-pill.confirmed,
.status-pill.accepted  { background: rgba(52,211,153,.08); border-color: rgba(52,211,153,.3); color: #34d399; }
.status-pill.cancelled,
.status-pill.rejected  { background: rgba(248,113,113,.08); border-color: rgba(248,113,113,.3); color: #f87171; }
.status-pill.completed { background: rgba(139,92,246,.08); border-color: rgba(139,92,246,.3); color: #a78bfa; }

.status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor; box-shadow: 0 0 6px currentColor;
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }

/* ── Cards ── */
.section-card {
  margin: 16px 24px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 12px;
  padding: 16px;
}

/* ── Client Card ── */
.client-card {
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(135deg, rgba(196,158,75,.06) 0%, rgba(255,255,255,.02) 100%);
  border-color: rgba(196,158,75,.15);
}
.avatar-circle {
  width: 46px; height: 46px; border-radius: 50%;
  background: linear-gradient(135deg, #c49e4b, #8b6914);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 17px; color: #0d0d0f;
  flex-shrink: 0; box-shadow: 0 0 20px rgba(196,158,75,.25);
}
.client-info  { flex: 1; }
.client-name  { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 700; color: #f0ead8; margin: 0 0 2px; }
.client-email { font-size: 12px; color: rgba(232,228,220,.5); margin: 0 0 4px; }
.client-phone { font-size: 12px; color: rgba(196,158,75,.8); display: flex; align-items: center; gap: 5px; margin: 0; }

/* ── Detail Grid ── */
.detail-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; padding: 0 24px;
}
.detail-item {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
  border-radius: 10px; padding: 12px 14px;
}
.detail-item.full-col { grid-column: 1 / -1; }
.detail-icon  { font-size: 16px; line-height: 1; margin-top: 1px; }
.detail-label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: rgba(232,228,220,.4); margin: 0 0 4px; }
.detail-value { font-size: 13px; font-weight: 500; color: #e8e4dc; margin: 0 0 2px; }
.detail-sub   { font-size: 11px; color: rgba(196,158,75,.7); margin: 0; }

/* ── Services ── */
.services-card { padding: 14px 16px; }
.section-title {
  font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(232,228,220,.4); display: flex; align-items: center; gap: 6px; margin: 0 0 12px;
}
.service-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.05);
}
.service-row:last-child { border-bottom: none; }
.service-name-wrap { display: flex; align-items: center; gap: 8px; }
.service-dot   { width: 4px; height: 4px; border-radius: 50%; background: #c49e4b; flex-shrink: 0; }
.service-name  { font-size: 13px; color: #e8e4dc; }
.service-pricing { display: flex; align-items: center; gap: 10px; }
.service-qty   { font-size: 11px; color: rgba(232,228,220,.35); }
.service-price { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 600; color: #c49e4b; }

/* ── Notes ── */
.notes-block {
  margin: 0 24px 16px; padding: 12px 14px;
  background: rgba(255,255,255,.02);
  border-left: 2px solid rgba(196,158,75,.3);
  border-radius: 0 8px 8px 0;
}
.notes-label  { display: flex; align-items: center; gap: 5px; margin-bottom: 6px !important; }
.notes-text   { font-size: 12px; color: rgba(232,228,220,.6); font-style: italic; line-height: 1.6; margin: 0; }

/* ── Total Footer ── */
.total-footer {
  margin: 0 24px 16px; padding: 14px 16px;
  background: linear-gradient(135deg, rgba(196,158,75,.1) 0%, rgba(196,158,75,.04) 100%);
  border: 1px solid rgba(196,158,75,.2); border-radius: 12px;
  display: flex; justify-content: space-between; align-items: center;
}
.payment-status {
  font-size: 11px; font-weight: 500; letter-spacing: .05em;
  padding: 4px 10px; border-radius: 999px;
  border: 1px solid rgba(251,191,36,.3); color: #fbbf24; background: rgba(251,191,36,.06);
}
.payment-status.paid { border-color: rgba(52,211,153,.3); color: #34d399; background: rgba(52,211,153,.06); }
.total-amount { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.total-label  { font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: rgba(232,228,220,.4); }
.total-value  { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: #c49e4b; line-height: 1; }

/* ── Actions ── */
.modal-actions { padding: 0 24px 20px; display: flex; justify-content: flex-end; }
.btn-close {
  padding: 9px 22px; border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: .03em;
  background: transparent; border: 1px solid rgba(255,255,255,.12);
  color: rgba(232,228,220,.6); cursor: pointer; transition: all .2s ease;
}
.btn-close:hover { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.2); color: #e8e4dc; }
</style>