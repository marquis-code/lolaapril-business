<template>
  <FullScreenLoader />
  <AddBusinessModal v-model="showAddBusinessModal" @success="handleBusinessAdded" />
  <div class="min-h-screen bg-white">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex lg:flex-col w-64 bg-white border-r-[0.5px] border-gray-50 h-screen fixed left-0 top-0 shadow-sm">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-100 flex-shrink-0">
        <img src="@/assets/img/logo.png" class="h-10 w-auto" alt="Logo" />
      </div>

      <!-- Business Switcher -->
      <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <BusinessSwitcher @add-business="showAddBusinessModal = true" />
      </div>
      
      <!-- Navigation - Scrollable -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group"
          :class="isActive(item.path) 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-primary'"
        >
          <span class="w-5 h-5 mr-3 flex-shrink-0" v-html="item.icon"></span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Logout Button - Fixed at bottom -->
      <div class="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
        <button
          @click="handleLogoutClick"
          class="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3">
        <img src="@/assets/img/logo.png" class="h-8 w-auto" alt="Logo" />
        <div class="flex items-center gap-2">
          <!-- Mobile Chat Icon -->
          <NuxtLink
            to="/dashboard/chat"
            class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Chat"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span
              v-if="totalUnreadChats > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-green-500 rounded-full"
            >
              {{ totalUnreadChats > 99 ? '99+' : totalUnreadChats }}
            </span>
          </NuxtLink>

          <!-- Mobile Notification Icon -->
          <NuxtLink
            to="/dashboard/notifications"
            class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span
              v-if="unreadNotificationCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full"
            >
              {{ unreadNotificationCount > 99 ? '99+' : unreadNotificationCount }}
            </span>
          </NuxtLink>

          <button
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img src="@/assets/icons/menu.svg" class="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <Transition name="overlay">
      <div
        v-if="showMobileMenu"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        @click="showMobileMenu = false"
      ></div>
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition name="slide">
      <aside
        v-if="showMobileMenu"
        class="lg:hidden w-72 bg-white h-screen fixed left-0 top-0 z-50 shadow-2xl flex flex-col"
      >
        <!-- Mobile Header -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <img src="@/assets/img/logo.png" class="h-8 w-auto" alt="Logo" />
          <button
            @click="showMobileMenu = false"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- User Info -->
        <div class="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">{{ userDisplayName }}</h3>
              <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- Mobile Business Switcher -->
        <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <BusinessSwitcher @add-business="showAddBusinessModal = true; showMobileMenu = false" />
        </div>
        
        <!-- Mobile Navigation - Scrollable -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all"
            :class="isActive(item.path) 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-primary'"
            @click="showMobileMenu = false"
          >
            <span class="w-5 h-5 mr-3 flex-shrink-0" v-html="item.icon"></span>
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Mobile Logout - Fixed at bottom -->
        <div class="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
          <button
            @click="handleLogoutClick"
            class="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 lg:ml-64">
      <!-- Dashboard Header -->
      <div class="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm hidden lg:block">
        <div class="px-6 py-1.5">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
              <p class="text-sm text-gray-500">{{ pageDescription }}</p>
            </div>
            <div class="flex items-center gap-3">
              <!-- Chat Icon -->
              <NuxtLink
                to="/dashboard/chat"
                class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Chat"
              >
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span
                  v-if="totalUnreadChats > 0"
                  class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-green-500 rounded-full"
                >
                  {{ totalUnreadChats > 99 ? '99+' : totalUnreadChats }}
                </span>
              </NuxtLink>

              <!-- Notification Icon -->
              <NuxtLink
                to="/dashboard/notifications"
                class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Notifications"
              >
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span
                  v-if="unreadNotificationCount > 0"
                  class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full"
                >
                  {{ unreadNotificationCount > 99 ? '99+' : unreadNotificationCount }}
                </span>
              </NuxtLink>

              <!-- User Profile -->
              <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {{ userInitials }}
                </div>
                <div class="text-left">
                  <p class="text-sm font-semibold text-gray-900">{{ userDisplayName }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="bg-white">
        <slot />
      </div>
    </main>

     <Transition
  enter-active-class="transition ease-out duration-300"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-active-class="transition ease-in duration-200"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div
    v-if="logoutModalOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    @click.self="logoutModalOpen = false"
  >
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="logoutModalOpen"
        class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 flex flex-col items-center text-center space-y-5"
      >
        <!-- Icon -->
        <div class="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <svg
            class="w-7 h-7 text-rose-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        <!-- Content -->
        <div class="space-y-1">
          <h3 class="text-xl font-semibold text-gray-900">
            Leaving already?
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            You’ll be signed out of your account.  
            Don’t worry — your appointments, favorites, and bookings will be waiting for you ✨
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 w-full pt-2">
          <button
            @click="logoutModalOpen = false"
            class="w-full px-4 py-3 rounded-full text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Stay logged in
          </button>

          <button
            @click="confirmLogout"
            class="w-full px-4 py-3 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </Transition>
  </div>
</Transition>

  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useRouter, useRoute } from 'vue-router'
import { useTokenRefresh } from '@/composables/core/useTokenRefresh'
import { useFetchNotificationLogs } from '@/composables/modules/notification/useFetchNotificationLogs'
import { useChatNotifications, cleanupChatNotifications } from '@/composables/modules/chat/useChatNotifications'
import { useUnreadCounts } from '@/composables/modules/chat/useUnreadCounts'
import BusinessSwitcher from '@/components/business/BusinessSwitcher.vue'
import AddBusinessModal from '@/components/business/AddBusinessModal.vue'

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)
const showAddBusinessModal = ref(false)

// Initialize token refresh
const { startTokenRefresh, stopTokenRefresh } = useTokenRefresh()

// Initialize chat notifications (WebSocket + toast notifications)
const { connect: connectChat, disconnect: disconnectChat } = useChatNotifications()
const { totalUnread: totalUnreadChats, startPolling: startChatPolling, stopPolling: stopChatPolling } = useUnreadCounts()

// Start chat polling and WebSocket on mount
onMounted(() => {
  connectChat()
  startChatPolling(60000) // Poll every 60 seconds as backup
})

onUnmounted(() => {
  stopChatPolling()
})

// Notifications
const { data: notifications, execute: fetchNotifications } = useFetchNotificationLogs()
const unreadNotificationCount = computed(() => {
  if (!notifications.value || !Array.isArray(notifications.value)) return 0
  return notifications.value.filter((n: any) => !n.isRead).length
})

// Fetch notifications on mount and periodically
onMounted(async () => {
  await fetchNotifications()
  // Refresh notifications every 60 seconds
  setInterval(() => fetchNotifications(), 60000)
})

// SVG icons as inline strings for each menu item
const icons = {
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`,
  profile: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>`,
  bookings: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>`,
  appointments: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  availability: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  payments: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>`,
  pricing: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>`,
  sales: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>`,
  chat: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>`,
  notifications: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`,
  cancellation: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
  commission: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  vouchers: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`,
  team: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>`,
  branding: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>`,
  analytics: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>`,
  memberships: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>`,
  marketplace: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>`,
  wallet: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>`,
  favorites: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`,
  forms: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`,
  orders: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
  support: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>`,
  finance: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>`,
  reports: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`,
  services: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>`,
}

// Navigation items organized by category
const navItems = [
  // Overview
  { path: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
  
  // Scheduling & Bookings
  { path: '/dashboard/bookings-management', label: 'Bookings', icon: icons.bookings },
  { path: '/dashboard/appointments', label: 'Appointments', icon: icons.appointments },
  { path: '/dashboard/availability', label: 'Availability', icon: icons.availability },
  { path: '/dashboard/cancellation', label: 'Cancellations', icon: icons.cancellation },
  
  // Services
  { path: '/dashboard/services', label: 'Services', icon: icons.services },
  
  // Finance & Payments
  { path: '/dashboard/payments', label: 'Payments', icon: icons.payments },
  // { path: '/dashboard/wallet', label: 'Wallet', icon: icons.wallet },
  { path: '/dashboard/sales', label: 'Sales', icon: icons.sales },
  { path: '/dashboard/pricing', label: 'Pricing', icon: icons.pricing },
  { path: '/dashboard/commission', label: 'Commissions', icon: icons.commission },
  { path: '/dashboard/finance', label: 'Finance', icon: icons.finance },
  
  // Marketing & Promotions
  { path: '/dashboard/vouchers', label: 'Vouchers', icon: icons.vouchers },
  { path: '/dashboard/memberships', label: 'Memberships', icon: icons.memberships },
  { path: '/dashboard/marketplace', label: 'Marketplace', icon: icons.marketplace },
  
  // Analytics & Reports
  { path: '/dashboard/analytics', label: 'Analytics', icon: icons.analytics },
  { path: '/dashboard/reports', label: 'Reports', icon: icons.reports },
  
  // Communication
  { path: '/dashboard/chat', label: 'Chat', icon: icons.chat },
  { path: '/dashboard/notifications', label: 'Notifications', icon: icons.notifications },
  
  // Team & Business
  { path: '/dashboard/team', label: 'Team', icon: icons.team },
  { path: '/dashboard/branding', label: 'Branding', icon: icons.branding },
  
  // Orders & Forms
  // { path: '/dashboard/orders', label: 'Product Orders', icon: icons.orders },
  // { path: '/dashboard/forms', label: 'Forms', icon: icons.forms },
  
  // User & Settings
  // { path: '/dashboard/profile', label: 'Profile', icon: icons.profile },
  // { path: '/dashboard/favorites', label: 'Favorites', icon: icons.favorites },
  { path: '/dashboard/support', label: 'Support', icon: icons.support },
  { path: '/dashboard/settings', label: 'Settings', icon: icons.settings },
]

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Overview of your business statistics' },
  // '/dashboard/profile': { title: 'My Profile', description: 'Manage your personal information' },
  '/dashboard/bookings-management': { title: 'Bookings', description: 'Manage business bookings and client requests' },
  '/dashboard/appointments': { title: 'Appointments', description: 'Manage business appointments and staff schedules' },
  '/dashboard/availability': { title: 'Availability', description: 'Manage business hours and staff availability' },
  '/dashboard/cancellation': { title: 'Cancellations', description: 'Manage cancellation policies, refunds, and no-shows' },
  '/dashboard/services': { title: 'Services', description: 'Create and manage your business services' },
  '/dashboard/payments': { title: 'Payments', description: 'Manage transactions, refunds, and verification' },
  '/dashboard/wallet': { title: 'Wallet', description: 'Manage your payments and transactions' },
  '/dashboard/sales': { title: 'Sales', description: 'Manage sales records and revenue' },
  '/dashboard/pricing': { title: 'Pricing', description: 'Manage plans and fee structure' },
  '/dashboard/commission': { title: 'Commissions', description: 'Track commissions, source performance, and disputes' },
  '/dashboard/finance': { title: 'Finance', description: 'Manage financial records and transactions' },
  '/dashboard/vouchers': { title: 'Vouchers', description: 'Create and manage vouchers and promotions' },
  '/dashboard/memberships': { title: 'Memberships', description: 'Manage programs and client enrollments' },
  '/dashboard/marketplace': { title: 'Marketplace', description: 'Manage verification, reviews, and quality score' },
  '/dashboard/analytics': { title: 'Analytics', description: 'Track performance, revenue, and insights' },
  '/dashboard/reports': { title: 'Reports', description: 'Generate and view business reports' },
  '/dashboard/chat': { title: 'Chat', description: 'Manage customer conversations and automations' },
  '/dashboard/notifications': { title: 'Notifications', description: 'Track alerts and delivery logs' },
  '/dashboard/team': { title: 'Team', description: 'Manage team members, roles, and departments' },
  '/dashboard/branding': { title: 'Branding', description: 'Customize your theme, domains, templates, and widgets' },
  '/dashboard/orders': { title: 'Product Orders', description: 'Track your product purchases' },
  // '/dashboard/forms': { title: 'Forms', description: 'View and complete your forms' },
  // '/dashboard/favorites': { title: 'Favorites', description: 'Your saved businesses and services' },
  '/dashboard/support': { title: 'Support', description: 'Get help and contact support' },
  '/dashboard/settings': { title: 'Settings', description: 'Customize your preferences' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Welcome back!')
const userDisplayName = computed(() => {
  if (!user.value) return 'User'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'User'
})
const userInitials = computed(() => {
  if (!user.value) return 'U'
  const first = user.value.firstName || ''
  const last = user.value.lastName || ''
  return (first[0] || last[0] || user.value.email?.[0] || 'U').toUpperCase()
})

const handleLogoutClick = () => {
  logoutModalOpen.value = true
}

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/dashboard/'
  }
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async () => {
  try {
    await logOut()
    router.push('/')
  } catch (err) {
    console.error(err)
  }
}

const handleBusinessAdded = (business: any) => {
  console.log('New business added:', business)
  // The modal will handle the reload prompt
}

const confirmLogout = () => {
  if (process.client) {
    // Clear user from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token') // If you store token separately
    // Close modal
    logoutModalOpen.value = false
    
    // Cleanup chat notifications WebSocket
    cleanupChatNotifications()
    stopChatPolling()
    
    // Dispatch event for other components
    window.dispatchEvent(new Event('auth-change'))
    
    // Optional: Redirect to home
    router.push('/')
  }
}

watch(() => route.path, () => showMobileMenu.value = false)
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>