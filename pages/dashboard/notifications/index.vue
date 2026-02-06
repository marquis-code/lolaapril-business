<template>
  <div class="p-4 md:p-8 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
        <p class="text-gray-500 text-sm mt-1">Stay updated with your business activities</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Connection Status Badge -->
        <div 
          class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          :class="isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
        >
          <span class="relative flex h-2 w-2">
            <span 
              v-if="isConnected"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span 
              class="relative inline-flex rounded-full h-2 w-2"
              :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
            ></span>
          </span>
          {{ isConnected ? 'Live' : 'Offline' }}
        </div>
        
        <!-- Mark All Read Button -->
        <button 
          v-if="unreadNotificationCount > 0"
          @click="handleMarkAllAsRead"
          :disabled="markingAllRead"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all disabled:opacity-50"
        >
          <svg v-if="!markingAllRead" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mark all as read
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ notifications.length }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Unread</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ unreadNotificationCount }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Read</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ notifications.length - unreadNotificationCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
      <div class="flex items-center border-b border-gray-100 px-4">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          @click="activeFilter = tab.value"
          class="relative px-4 py-3 text-sm font-medium transition-colors"
          :class="activeFilter === tab.value ? 'text-primary' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
          <span 
            v-if="tab.count > 0" 
            class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
            :class="activeFilter === tab.value ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'"
          >
            {{ tab.count }}
          </span>
          <span 
            v-if="activeFilter === tab.value"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          ></span>
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-8">
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p class="text-sm text-gray-500">Loading notifications...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredNotifications.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">No notifications</h3>
        <p class="text-sm text-gray-500">
          {{ activeFilter === 'all' ? "You're all caught up! Check back later." : `No ${activeFilter} notifications.` }}
        </p>
      </div>

      <!-- Notification Items -->
      <div v-else class="divide-y divide-gray-100">
        <TransitionGroup name="notification">
          <div 
            v-for="notification in filteredNotifications" 
            :key="notification._id"
            @click="handleNotificationClick(notification)"
            class="group relative flex gap-4 p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50"
            :class="{ 'bg-blue-50/50 hover:bg-blue-50': !notification.isRead }"
          >
            <!-- Unread Indicator -->
            <div 
              v-if="!notification.isRead"
              class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"
            ></div>

            <!-- Icon -->
            <div 
              class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              :class="getNotificationStyles(notification).bg"
            >
              <component 
                :is="getNotificationIcon(notification)" 
                class="w-5 h-5"
                :class="getNotificationStyles(notification).text"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h4 
                    class="font-medium text-gray-900 truncate"
                    :class="{ 'font-semibold': !notification.isRead }"
                  >
                    {{ getNotificationTitle(notification) }}
                  </h4>
                  <p class="text-sm text-gray-600 mt-0.5 line-clamp-2">
                    {{ getNotificationMessage(notification) }}
                  </p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-xs text-gray-400">
                      {{ formatRelativeTime(notification.createdAt) }}
                    </span>
                    <span 
                      class="text-xs px-2 py-0.5 rounded-full capitalize"
                      :class="getNotificationStyles(notification).badge"
                    >
                      {{ notification.type || notification.relatedEntityType || 'system' }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="!notification.isRead"
                    @click.stop="markAsRead(notification._id)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    v-if="notification.actionUrl"
                    @click.stop="navigateTo(notification.actionUrl)"
                    class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View details"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreNotifications" class="p-4 border-t border-gray-100 text-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
        >
          <span v-if="loadingMore" class="flex items-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
          <span v-else>Load more notifications</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRealtime } from "@/composables/modules/useRealtime"
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: 'dashboard'
})

const { notifications, unreadNotificationCount, isConnected, fetchNotifications, markAsRead, markAllAsRead } = useRealtime()
const { showToast } = useCustomToast()
const router = useRouter()

const loading = ref(false)
const loadingMore = ref(false)
const markingAllRead = ref(false)
const activeFilter = ref<'all' | 'unread' | 'read'>('all')
const currentPage = ref(1)
const hasMoreNotifications = ref(false)

// Filter tabs with counts
const filterTabs = computed(() => [
  { label: 'All', value: 'all' as const, count: notifications.value.length },
  { label: 'Unread', value: 'unread' as const, count: unreadNotificationCount.value },
  { label: 'Read', value: 'read' as const, count: notifications.value.length - unreadNotificationCount.value }
])

// Filtered notifications based on active tab
const filteredNotifications = computed(() => {
  if (activeFilter.value === 'unread') {
    return notifications.value.filter((n: any) => !n.isRead)
  }
  if (activeFilter.value === 'read') {
    return notifications.value.filter((n: any) => n.isRead)
  }
  return notifications.value
})

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  if (!notification.isRead) {
    await markAsRead(notification._id)
  }
  
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
}

// Handle mark all as read
const handleMarkAllAsRead = async () => {
  markingAllRead.value = true
  try {
    await markAllAsRead()
    showToast({
      title: 'Success',
      message: 'All notifications marked as read',
      toastType: 'success'
    })
  } catch (error) {
    showToast({
      title: 'Error',
      message: 'Failed to mark all as read',
      toastType: 'error'
    })
  } finally {
    markingAllRead.value = false
  }
}

// Load more notifications
const loadMore = async () => {
  loadingMore.value = true
  try {
    currentPage.value++
    await fetchNotifications({ page: currentPage.value, limit: 20 })
  } finally {
    loadingMore.value = false
  }
}

// Navigate to action URL
const navigateTo = (url: string) => {
  router.push(url)
}

// Get notification title
const getNotificationTitle = (notification: any) => {
  return notification.title || notification.subject || notification.action || 'Notification'
}

// Get notification message
const getNotificationMessage = (notification: any) => {
  return notification.message || notification.content || notification.description || ''
}

// Get notification styles based on type
const getNotificationStyles = (notification: any) => {
  const type = notification.type || notification.relatedEntityType || 'system'
  const styles: Record<string, { bg: string; text: string; badge: string }> = {
    booking: { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    payment: { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    client: { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    audit: { bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    appointment: { bg: 'bg-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
    service: { bg: 'bg-pink-100', text: 'text-pink-600', badge: 'bg-pink-100 text-pink-700' },
    staff: { bg: 'bg-cyan-100', text: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700' },
    system: { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' }
  }
  return styles[type] || styles.system
}

// Get notification icon component
const getNotificationIcon = (notification: any) => {
  const type = notification.type || notification.relatedEntityType || 'system'
  
  const icons: Record<string, any> = {
    booking: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
        ])
      }
    },
    payment: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
        ])
      }
    },
    client: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
        ])
      }
    },
    audit: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })
        ])
      }
    },
    appointment: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
        ])
      }
    },
    service: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
        ])
      }
    },
    staff: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
        ])
      }
    },
    system: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
        ])
      }
    }
  }
  
  return icons[type] || icons.system
}

// Format relative time
const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)
  
  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.notification-move {
  transition: transform 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
