<template>
  <div class="h-screen w-screen flex flex-col md:flex-row bg-gray-100 relative">
    <!-- Overlay for mobile sidebar -->
    <div v-if="showSidebarOnMobile" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="showSidebarOnMobile = false" aria-label="Close sidebar overlay" tabindex="0"></div>
    <aside
      class="w-full md:w-[380px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-50 md:static fixed top-0 left-0 h-full md:h-auto md:relative transition-transform duration-300 md:translate-x-0"
      :class="{ '-translate-x-full': !showSidebarOnMobile, 'translate-x-0': showSidebarOnMobile, 'md:translate-x-0': true }"
      aria-label="Sidebar"
      tabindex="0"
    >
      <!-- Sidebar Header -->
      <div class="p-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <NuxtLink 
              to="/dashboard" 
              class="p-2 rounded-lg hover:bg-gray-200 transition-colors" 
              title="Back to Dashboard"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <h1 class="text-xl font-bold text-gray-900">Messages</h1>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></span>
            <button @click="showNewChatModal = true" class="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Chat Type Tabs -->
        <div class="flex gap-1 p-1 bg-gray-200 rounded-lg">                                       
          <button
            v-for="tab in chatTabs"
            :key="tab.value"
            @click="setChatType(tab.value)"
            class="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            :class="activeChatType === tab.value 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            {{ tab.label }}
            <span v-if="getUnreadCount(tab.value)" class="ml-1 px-1.5 py-0.5 bg-primary text-white text-[10px] rounded-full">
              {{ getUnreadCount(tab.value) }}
            </span>
          </button>
        </div>

        <!-- Search -->
        <div class="mt-3 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="roomsLoading" class="flex items-center justify-center py-10">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="filteredRooms.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p class="text-gray-500 text-sm text-center">No conversations yet</p>
          <p class="text-gray-400 text-xs mt-1">Start a new conversation</p>
        </div>

        <div v-else>
          <div
            v-for="room in filteredRooms"
            :key="room._id"
            @click="selectRoom(room)"
            class="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors"
            :class="activeRoom?._id === room._id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-gray-50'"
          >
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold"
                :class="getRoomAvatarClass(room)"
              >
                {{ getRoomInitials(room) }}
              </div>
              <span 
                v-if="room.metadata?.isGuest" 
                class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center"
              >
                <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              </span>
              <span 
                v-if="getRoomOnlineStatus(room)"
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
              ></span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="font-semibold text-gray-900 truncate text-sm">{{ getRoomDisplayName(room) }}</p>
                <span class="text-xs text-gray-400">{{ formatRelativeTime(room.lastMessageAt) }}</span>
              </div>
              <div class="flex items-center justify-between mt-0.5">
                <p class="text-xs text-gray-500 truncate">
                  <span v-if="room.roomType === 'team-chat'" class="text-blue-600">Team</span>
                  <span v-else-if="room.roomType === 'admin-support'" class="text-purple-600">Support</span>
                  <span v-else>{{ room.metadata?.userEmail || 'Customer' }}</span>
                </p>
                <span 
                  v-if="room.unreadCount && room.unreadCount > 0" 
                  class="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full"
                >
                  {{ room.unreadCount }}
                </span>
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span 
                  class="px-1.5 py-0.5 rounded text-[10px] font-medium"
                  :class="getPriorityClass(room.metadata?.priority)"
                >
                  {{ room.metadata?.priority || 'normal' }}
                </span>
                <span v-if="room.metadata?.tags?.length" class="text-[10px] text-gray-400">
                  {{ room.metadata.tags.slice(0, 2).join(', ') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div class="p-3 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center gap-2">
          <button
            @click="showFaqModal = true"
            class="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            FAQs
          </button>
          <button
            @click="showAutoResponseModal = true"
            class="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Auto Responses
          </button>
        </div>
      </div>
    </aside>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col bg-[#e5ddd5] min-h-0 relative" :style="{ backgroundImage: 'url(/img/chat-bg.png)' }">
      <!-- Hamburger menu for mobile -->
      <button
        @click="showSidebarOnMobile = true"
        class="absolute top-3 left-3 z-30 md:hidden bg-white rounded-full p-2 shadow-md border border-gray-200"
        aria-label="Open sidebar"
        tabindex="0"
      >
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- No Chat Selected -->
      <div v-if="!activeRoom" class="flex-1 flex flex-col items-center justify-center">
        <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-700">Business Chat</h2>
        <p class="text-sm text-gray-500 mt-2 text-center max-w-md">
          Connect with customers, team members, and support.<br/>
          Select a conversation to start chatting.
        </p>
      </div>

      <!-- Active Chat -->
      <template v-else>
        <!-- Chat Header -->
        <div class="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center justify-between md:px-4 md:py-3">
          <div class="flex items-center gap-3">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
              :class="getRoomAvatarClass(activeRoom)"
            >
              {{ getRoomInitials(activeRoom) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ getRoomDisplayName(activeRoom) }}</h3>
              <p class="text-xs text-gray-500">
                <span v-if="typingUser">{{ typingUser }} is typing...</span>
                <span v-else>{{ activeRoom.metadata?.userEmail || getRoomSubtitle(activeRoom) }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="showRoomInfo = true" class="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button 
              @click="handleArchiveRoom"
              :disabled="archiveLoading"
              class="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-2 space-y-2 md:p-4">
          <div v-if="messagesLoading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>

          <!-- Date Separators & Messages -->
          <template v-for="(group, date) in groupedMessages" :key="date">
            <div class="flex justify-center my-4">
              <span class="px-3 py-1 bg-white/80 rounded-lg text-xs text-gray-600 shadow-sm">
                {{ date }}
              </span>
            </div>
            
            <div
              v-for="message in group"
              :key="message._id || message.id"
              class="flex"
              :class="getMessageAlignment(message)"
            >
              <!-- System Message -->
              <div v-if="message.senderType === 'system'" class="flex justify-center w-full my-2">
                <span class="px-3 py-1.5 bg-yellow-100/80 rounded-lg text-xs text-yellow-800">
                  {{ message.content }}
                </span>
              </div>

              <!-- Regular Message -->
              <div v-else class="max-w-[70%]">
                <div 
                  class="px-3 py-2 rounded-2xl shadow-sm"
                  :class="getMessageBubbleClass(message)"
                >
                  <!-- Auto-assistant indicator -->
                  <div 
                    v-if="(message.senderType === 'bot' || message.isAutomated) && !isOwnMessage(message)"
                    class="flex items-center gap-1 mb-1"
                  >
                    <span class="text-[10px] bg-purple-200/60 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">
                      🤖 Auto-Assistant
                    </span>
                  </div>

                  <!-- Sender name for group chats -->
                  <p 
                    v-else-if="!isOwnMessage(message)"
                    class="text-xs font-semibold mb-1 text-primary"
                  >
                    {{ message.senderName || 'Customer' }}
                  </p>

                  <!-- Message Content -->
                  <p class="text-sm whitespace-pre-wrap break-words">{{ message.content }}</p>

                  <!-- Attachments -->
                  <div v-if="message.attachments?.length" class="mt-2 space-y-1">
                    <a 
                      v-for="(attachment, i) in message.attachments" 
                      :key="i"
                      :href="attachment"
                      target="_blank"
                      class="block text-xs text-blue-600 underline truncate"
                    >
                      📎 Attachment {{ i + 1 }}
                    </a>
                  </div>

                  <!-- Time & Status -->
                  <div class="flex items-center justify-end gap-1 mt-1">
                    <span class="text-[10px] opacity-70">{{ formatMessageTime(message.createdAt) }}</span>
                    <span v-if="isOwnMessage(message)" class="text-[10px]">
                      {{ message.isRead ? '✓✓' : '✓' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-if="!messagesLoading && messages.length === 0" class="flex justify-center py-10">
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p class="text-sm text-gray-600">No messages yet</p>
              <p class="text-xs text-gray-500 mt-1">Start the conversation!</p>
            </div>
          </div>
        </div>

        <!-- Quick Replies -->
        <div v-if="quickReplies.length" class="px-4 py-2 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
          <button
            v-for="reply in quickReplies"
            :key="reply"
            @click="sendQuickReply(reply)"
            class="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
          >
            {{ reply }}
          </button>
        </div>

        <!-- Message Input -->
        <div class="bg-gray-100 border-t border-gray-200 p-2 md:p-3">
          <form @submit.prevent="handleSendMessage" class="flex items-end gap-2">
            <!-- Attachment Button -->
            <button type="button" class="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <!-- Text Input -->
            <div class="flex-1 relative">
              <textarea
                v-model="newMessage"
                @keydown="handleKeyDown"
                @input="handleTyping"
                placeholder="Type a message..."
                rows="1"
                class="w-full px-3 py-2 rounded-2xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none md:px-4 md:py-2.5"
                :disabled="sendLoading"
              ></textarea>
            </div>

            <!-- Send Button -->
            <button
              type="submit"
              :disabled="!newMessage.trim() || sendLoading"
              class="p-3 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <svg v-if="sendLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </template>
    </div>

    <!-- New Chat Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showNewChatModal" 
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="showNewChatModal = false"
        >
          <div class="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">New Conversation</h2>
              <button @click="showNewChatModal = false" class="p-1 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="p-4 space-y-4">
              <!-- Chat Type Selection -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="newChatType = 'team'"
                  class="p-4 rounded-xl border-2 text-left transition-colors"
                  :class="newChatType === 'team' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'"
                >
                  <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p class="font-semibold text-gray-900">Team Chat</p>
                  <p class="text-xs text-gray-500 mt-0.5">Chat with team members</p>
                </button>

                <button
                  @click="newChatType = 'support'"
                  class="p-4 rounded-xl border-2 text-left transition-colors"
                  :class="newChatType === 'support' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'"
                >
                  <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p class="font-semibold text-gray-900">Admin Support</p>
                  <p class="text-xs text-gray-500 mt-0.5">Contact platform support</p>
                </button>
              </div>

              <!-- Team Member Selection -->
              <div v-if="newChatType === 'team'" class="space-y-3">
                <p class="text-sm font-medium text-gray-700">Select Team Member</p>
                <div class="max-h-48 overflow-y-auto space-y-2">
                  <div
                    v-for="member in teamMembers"
                    :key="member._id"
                    @click="selectedTeamMember = member"
                    class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                    :class="selectedTeamMember?._id === member._id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-gray-100'"
                  >
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-sm font-semibold text-blue-600">
                        {{ (member.firstName?.[0] || '') + (member.lastName?.[0] || '') }}
                      </span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ member.firstName }} {{ member.lastName }}</p>
                      <p class="text-xs text-gray-500">{{ member.role }}</p>
                    </div>
                  </div>
                  <p v-if="!teamMembers.length" class="text-sm text-gray-400 text-center py-4">No team members found</p>
                </div>
              </div>

              <!-- Start Chat Button -->
              <button
                @click="handleStartNewChat"
                :disabled="(newChatType === 'team' && !selectedTeamMember) || newChatLoading"
                class="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {{ newChatLoading ? 'Starting...' : 'Start Conversation' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Room Info Sidebar -->
    <Teleport to="body">
      <Transition name="slide">
        <div 
          v-if="showRoomInfo && activeRoom" 
          class="fixed inset-0 bg-black/30 z-50"
          @click.self="showRoomInfo = false"
        >
          <div class="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl flex flex-col">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 class="font-bold text-gray-900">Chat Info</h3>
              <button @click="showRoomInfo = false" class="p-1 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
              <!-- Contact Info -->
              <div class="text-center">
                <div 
                  class="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-3"
                  :class="getRoomAvatarClass(activeRoom)"
                >
                  {{ getRoomInitials(activeRoom) }}
                </div>
                <p class="font-semibold text-gray-900">{{ getRoomDisplayName(activeRoom) }}</p>
                <p class="text-sm text-gray-500">{{ activeRoom.roomType.replace('-', ' ') }}</p>
              </div>

              <!-- Details -->
              <div class="space-y-3">
                <div v-if="activeRoom.metadata?.userEmail" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500">Email</p>
                    <p class="text-sm text-gray-900">{{ activeRoom.metadata.userEmail }}</p>
                  </div>
                </div>

                <div v-if="activeRoom.metadata?.userPhone" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500">Phone</p>
                    <p class="text-sm text-gray-900">{{ activeRoom.metadata.userPhone }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500">Started</p>
                    <p class="text-sm text-gray-900">{{ formatDateTime(activeRoom.createdAt) }}</p>
                  </div>
                </div>

                <div v-if="activeRoom.metadata?.priority" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500">Priority</p>
                    <p class="text-sm text-gray-900 capitalize">{{ activeRoom.metadata.priority }}</p>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="activeRoom.metadata?.tags?.length">
                <p class="text-xs font-medium text-gray-500 uppercase mb-2">Tags</p>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in activeRoom.metadata.tags"
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- FAQ Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showFaqModal" 
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="showFaqModal = false"
        >
          <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h2 class="text-lg font-bold text-gray-900">Manage FAQs</h2>
              <button @click="showFaqModal = false" class="p-1 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
              <!-- Create FAQ Form -->
              <div class="space-y-4 p-4 bg-gray-50 rounded-xl">
                <h3 class="font-semibold text-gray-900">Add New FAQ</h3>
                
                <!-- Question -->
                <UiAnimatedInput v-model="faqForm.question" type="text" label="Question" />
                
                <!-- Answer -->
                <div>
                  <label class="text-xs font-medium text-gray-600">Answer</label>
                  <textarea 
                    v-model="faqForm.answer" 
                    rows="3" 
                    class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Provide a detailed answer..."
                  ></textarea>
                </div>

                <!-- Keywords -->
                <div>
                  <label class="text-xs font-medium text-gray-600 mb-1 block">Keywords</label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span 
                      v-for="(keyword, i) in faqForm.keywords" 
                      :key="i"
                      class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"
                    >
                      {{ keyword }}
                      <button @click="faqForm.keywords.splice(i, 1)" class="hover:text-blue-900">×</button>
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <input
                      v-model="keywordInput"
                      type="text"
                      placeholder="Add keyword..."
                      class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      @keydown.enter.prevent="addKeyword"
                    />
                    <button 
                      @click="addKeyword"
                      type="button"
                      class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <!-- Alternative Questions -->
                <div>
                  <label class="text-xs font-medium text-gray-600 mb-1 block">Alternative Questions</label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span 
                      v-for="(q, i) in faqForm.alternativeQuestions" 
                      :key="i"
                      class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1"
                    >
                      {{ q }}
                      <button @click="faqForm.alternativeQuestions.splice(i, 1)" class="hover:text-purple-900">×</button>
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <input
                      v-model="altQuestionInput"
                      type="text"
                      placeholder="Add alternative question..."
                      class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      @keydown.enter.prevent="addAltQuestion"
                    />
                    <button 
                      @click="addAltQuestion"
                      type="button"
                      class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <!-- Category, Confidence, Priority -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <UiSelectInput
                    v-model="faqForm.category"
                    label="Category"
                    :options="faqCategoryOptions"
                    option-label="label"
                    option-value="value"
                  />
                  <div>
                    <label class="text-xs font-medium text-gray-600 mb-1 block">Confidence (0-1)</label>
                    <input
                      v-model.number="faqForm.confidenceThreshold"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label class="text-xs font-medium text-gray-600 mb-1 block">Priority</label>
                    <input
                      v-model.number="faqForm.priority"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <button
                  @click="handleCreateFaq"
                  :disabled="faqLoading"
                  class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {{ faqLoading ? 'Saving...' : 'Add FAQ' }}
                </button>
              </div>

              <!-- FAQs List -->
              <div class="space-y-3">
                <h3 class="font-semibold text-gray-900">Existing FAQs</h3>
                <div v-for="faq in faqs" :key="faq._id" class="p-4 bg-white border border-gray-200 rounded-xl">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ faq.question }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ faq.category || 'General' }} • Priority: {{ faq.priority || 1 }} • Used {{ faq.usageCount || 0 }} times</p>
                      <p class="text-sm text-gray-600 mt-2">{{ faq.answer }}</p>
                      <div v-if="faq.keywords?.length" class="flex flex-wrap gap-1 mt-2">
                        <span v-for="kw in faq.keywords" :key="kw" class="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded">{{ kw }}</span>
                      </div>
                      <div v-if="faq.alternativeQuestions?.length" class="mt-2">
                        <p class="text-[10px] text-gray-400 uppercase">Also matches:</p>
                        <p class="text-xs text-gray-500">{{ faq.alternativeQuestions.join(' • ') }}</p>
                      </div>
                    </div>
                    <button @click="handleDeleteFaq(faq._id)" class="text-xs text-red-600 hover:text-red-700">Delete</button>
                  </div>
                </div>
                <p v-if="!faqs.length" class="text-sm text-gray-400 text-center py-4">No FAQs created yet</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Auto Response Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showAutoResponseModal" 
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="showAutoResponseModal = false"
        >
          <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h2 class="text-lg font-bold text-gray-900">Auto Responses</h2>
              <button @click="showAutoResponseModal = false" class="p-1 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
              <!-- Create Auto Response Form -->
              <div class="space-y-4 p-4 bg-gray-50 rounded-xl">
                <h3 class="font-semibold text-gray-900">Add Auto Response</h3>
                
                <!-- Basic Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UiAnimatedInput v-model="autoResponseForm.name" type="text" label="Name" />
                  <UiSelectInput
                    v-model="autoResponseForm.responseType"
                    label="Response Type"
                    :options="responseTypeOptions"
                    option-label="label"
                    option-value="value"
                  />
                </div>
                
                <!-- Response Type Description -->
                <p class="text-xs text-gray-500 -mt-2">
                  {{ responseTypeOptions.find(o => o.value === autoResponseForm.responseType)?.description }}
                </p>

                <!-- Message -->
                <div>
                  <label class="text-xs font-medium text-gray-600">Message</label>
                  <textarea 
                    v-model="autoResponseForm.message" 
                    rows="3" 
                    class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Hi! 🌙 We're currently closed. Our team will respond when we open at 9 AM tomorrow. Feel free to book online!"
                  ></textarea>
                </div>

                <!-- Quick Replies -->
                <div>
                  <label class="text-xs font-medium text-gray-600 mb-1 block">Quick Replies</label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span 
                      v-for="(reply, i) in autoResponseForm.quickReplies" 
                      :key="i"
                      class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                    >
                      {{ reply }}
                      <button @click="autoResponseForm.quickReplies.splice(i, 1)" class="hover:text-primary/70">×</button>
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <input
                      v-model="quickReplyInput"
                      type="text"
                      placeholder="Add quick reply option..."
                      class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      @keydown.enter.prevent="addQuickReply"
                    />
                    <button 
                      @click="addQuickReply"
                      type="button"
                      class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1">Suggested: "Book online", "View FAQs", "Leave a message"</p>
                </div>

                <!-- Additional Options -->
                <div class="flex flex-wrap gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="autoResponseForm.includeBusinessHours"
                      class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm text-gray-700">Include Business Hours</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="autoResponseForm.includeEstimatedWaitTime"
                      class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm text-gray-700">Include Estimated Wait Time</span>
                  </label>
                </div>

                <!-- Trigger Settings -->
                <div class="border-t border-gray-200 pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Trigger Settings (Optional)</h4>
                  
                  <UiSelectInput
                    v-model="autoResponseForm.trigger.event"
                    label="Trigger Event"
                    :options="triggerEventOptions"
                    option-label="label"
                    option-value="value"
                  />
                  <p v-if="autoResponseForm.trigger.event" class="text-xs text-gray-500 mt-1 mb-3">
                    {{ triggerEventOptions.find(o => o.value === autoResponseForm.trigger.event)?.description }}
                  </p>

                  <!-- Trigger Conditions (show when event is selected) -->
                  <div v-if="autoResponseForm.trigger.event" class="space-y-3 mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <p class="text-xs font-medium text-gray-600">Trigger Conditions</p>
                    
                    <!-- Days of Week -->
                    <div>
                      <label class="text-xs text-gray-500 mb-1 block">Active Days</label>
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="day in dayOfWeekOptions"
                          :key="day.value"
                          type="button"
                          @click="toggleDayOfWeek(day.value)"
                          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          :class="autoResponseForm.trigger.conditions.dayOfWeek.includes(day.value) 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                        >
                          {{ day.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Time Range -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs text-gray-500 mb-1 block">Start Time</label>
                        <input
                          v-model="autoResponseForm.trigger.conditions.timeRange.start"
                          type="time"
                          class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label class="text-xs text-gray-500 mb-1 block">End Time</label>
                        <input
                          v-model="autoResponseForm.trigger.conditions.timeRange.end"
                          type="time"
                          class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    <!-- Wait Time & Queue Size -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs text-gray-500 mb-1 block">Max Wait Time (seconds)</label>
                        <input
                          v-model.number="autoResponseForm.trigger.conditions.maxWaitTime"
                          type="number"
                          min="0"
                          placeholder="300"
                          class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label class="text-xs text-gray-500 mb-1 block">Queue Size Threshold</label>
                        <input
                          v-model.number="autoResponseForm.trigger.conditions.queueSize"
                          type="number"
                          min="0"
                          placeholder="10"
                          class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  @click="handleCreateAutoResponse"
                  :disabled="autoResponseLoading"
                  class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {{ autoResponseLoading ? 'Saving...' : 'Add Response' }}
                </button>
              </div>

              <!-- Auto Responses List -->
              <div class="space-y-3">
                <h3 class="font-semibold text-gray-900">Active Responses</h3>
                <div v-for="response in autoResponses" :key="response._id" class="p-4 bg-white border border-gray-200 rounded-xl">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-gray-900">{{ response.name }}</p>
                        <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">{{ response.responseType }}</span>
                        <span v-if="response.trigger?.event" class="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full">
                          {{ response.trigger.event }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mt-2">{{ response.message }}</p>
                      <div class="flex flex-wrap gap-2 mt-2">
                        <span v-if="response.includeBusinessHours" class="px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded">📅 Business Hours</span>
                        <span v-if="response.includeEstimatedWaitTime" class="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded">⏱️ Wait Time</span>
                      </div>
                      <div v-if="response.quickReplies?.length" class="flex flex-wrap gap-1 mt-2">
                        <span v-for="reply in response.quickReplies" :key="reply" class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          {{ reply }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-if="!autoResponses.length" class="text-sm text-gray-400 text-center py-4">No auto responses configured</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { ChatRoom, ChatMessage } from '@/types/chat'
import type { TeamMember } from '@/types/team'
import { useUser } from '@/composables/modules/auth/user'
import { useGetChatRooms } from '@/composables/modules/chat/useGetChatRooms'
import { useGetRoomMessages } from '@/composables/modules/chat/useGetRoomMessages'
import { useSendChatMessage } from '@/composables/modules/chat/useSendChatMessage'
import { useMarkRoomMessagesRead } from '@/composables/modules/chat/useMarkRoomMessagesRead'
import { useArchiveChatRoom } from '@/composables/modules/chat/useArchiveChatRoom'
import { useChatRealtime } from '@/composables/modules/chat/useChatRealtime'
import { useFaqs } from '@/composables/modules/chat/useFaqs'
import { useAutoResponses } from '@/composables/modules/chat/useAutoResponses'
import { useTeamChat } from '@/composables/modules/chat/useTeamChat'
import { useSupportChat } from '@/composables/modules/chat/useSupportChat'
import { useFetchTeamMembers } from '@/composables/modules/team/useFetchTeamMembers'
import { useChatNotifications } from '@/composables/modules/chat/useChatNotifications'
import { useUnreadCounts } from '@/composables/modules/chat/useUnreadCounts'

definePageMeta({
  layout: 'chat',
  middleware: 'auth'
})

const { userId, fullName } = useUser()
const { setCurrentRoom } = useChatNotifications()
const { markRoomAsRead } = useUnreadCounts()

// Chat Type
type ChatTypeTab = 'all' | 'customer' | 'team' | 'support'

// State
const activeChatType = ref<ChatTypeTab>('all')
const searchQuery = ref('')
const activeRoom = ref<ChatRoom | null>(null)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const typingUser = ref<string | null>(null)
const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Modal States
const showNewChatModal = ref(false)
const showRoomInfo = ref(false)
const showFaqModal = ref(false)
const showAutoResponseModal = ref(false)
const newChatType = ref<'team' | 'support'>('team')
const selectedTeamMember = ref<TeamMember | null>(null)
const newChatLoading = ref(false)

// Chat Tabs
const chatTabs: { label: string; value: ChatTypeTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Customers', value: 'customer' },
  { label: 'Team', value: 'team' },
  { label: 'Support', value: 'support' }
]

const setChatType = (value: ChatTypeTab) => {
  activeChatType.value = value
}

// Composables
const { data: roomsData, loading: roomsLoading, execute: fetchRooms } = useGetChatRooms()
const { data: messagesData, loading: messagesLoading, execute: fetchMessages } = useGetRoomMessages()
const { loading: sendLoading, execute: sendMessage } = useSendChatMessage()
const { execute: markRead } = useMarkRoomMessagesRead()
const { loading: archiveLoading, execute: archiveRoom } = useArchiveChatRoom()
const { isConnected, joinRoom, leaveRoom, sendMessage: sendRealtimeMessage, onNewMessage, onNewConversation, onTyping, emitTyping } = useChatRealtime()
const { data: faqsData, loading: faqLoading, fetchFaqs, createFaq, deleteFaq } = useFaqs()
const { data: autoResponsesData, loading: autoResponseLoading, fetchAutoResponses, createAutoResponse } = useAutoResponses()
const { createTeamChatRoom } = useTeamChat()
const { createSupportChatRoom } = useSupportChat()
const { data: teamMembersData, execute: fetchTeamMembers } = useFetchTeamMembers()

// Computed
const rooms = computed(() => roomsData.value || [])
const messages = computed(() => messagesData.value || [])
const faqs = computed(() => faqsData.value || [])
const autoResponses = computed(() => autoResponsesData.value || [])
const teamMembers = computed(() => teamMembersData.value || [])

const filteredRooms = computed(() => {
  let result = rooms.value

  // Filter by chat type
  if (activeChatType.value !== 'all') {
    const typeMap: Record<string, string> = {
      'customer': 'customer-support',
      'team': 'team-chat',
      'support': 'admin-support'
    }
    result = result.filter((room: ChatRoom) => room.roomType === typeMap[activeChatType.value])
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((room: ChatRoom) => 
      getRoomDisplayName(room).toLowerCase().includes(query) ||
      room.metadata?.userEmail?.toLowerCase().includes(query)
    )
  }

  return result
})

const groupedMessages = computed(() => {
  const groups: Record<string, ChatMessage[]> = {}
  messages.value.forEach((msg: ChatMessage) => {
    const date = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }) : 'Unknown'
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
  })
  return groups
})

const quickReplies = computed(() => {
  // Get quick replies from active auto responses
  const welcomeResponse = autoResponses.value.find((r: any) => r.responseType === 'welcome')
  return welcomeResponse?.quickReplies || []
})

// Forms
const faqForm = ref({
  question: '',
  answer: '',
  category: 'general',
  keywords: [] as string[],
  alternativeQuestions: [] as string[],
  confidenceThreshold: 0.7,
  priority: 1
})

const autoResponseForm = ref({
  name: '',
  responseType: 'welcome',
  message: '',
  quickReplies: [] as string[],
  includeBusinessHours: false,
  includeEstimatedWaitTime: false,
  trigger: {
    event: '' as string,
    conditions: {
      dayOfWeek: [] as number[],
      timeRange: {
        start: '',
        end: ''
      },
      maxWaitTime: 0,
      queueSize: 0
    }
  }
})

// Temp input fields for array handling
const keywordInput = ref('')
const altQuestionInput = ref('')
const quickReplyInput = ref('')

const responseTypeOptions = [
  { label: 'Welcome', value: 'welcome', description: 'Greeting when customer starts a chat' },
  { label: 'Offline', value: 'offline', description: 'When business is offline/closed' },
  { label: 'Busy', value: 'busy', description: 'When all staff are busy with customers' },
  { label: 'Away', value: 'away', description: 'When staff is temporarily away' },
  { label: 'Closing Soon', value: 'closing-soon', description: 'Near closing time warning' },
  { label: 'Holiday', value: 'holiday', description: 'During holidays/special closures' },
  { label: 'Custom', value: 'custom', description: 'Custom response for specific needs' }
]

const triggerEventOptions = [
  { label: 'None', value: '', description: 'No trigger event' },
  { label: 'User Joined', value: 'user-joined', description: 'When a customer joins the chat' },
  { label: 'After Hours', value: 'after-hours', description: 'Outside business operating hours' },
  { label: 'No Staff Available', value: 'no-staff-available', description: 'No staff online to respond' },
  { label: 'High Load', value: 'high-load', description: 'Many customers waiting in queue' },
  { label: 'Manual', value: 'manual', description: 'Triggered manually by staff' }
]

const dayOfWeekOptions = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 }
]

const faqCategoryOptions = [
  { label: 'General', value: 'general', description: 'Opening hours, location, parking, contact info' },
  { label: 'Booking', value: 'booking', description: 'How to book, reschedule, cancellations' },
  { label: 'Services', value: 'services', description: 'What services are offered, service details' },
  { label: 'Pricing', value: 'pricing', description: 'Prices, deposits, packages, discounts' },
  { label: 'Payment', value: 'payment', description: 'Payment methods, refunds, billing' },
  { label: 'Policies', value: 'policies', description: 'Cancellation policy, late policy, etc.' },
  { label: 'Products', value: 'products', description: 'Products sold, recommendations' },
  { label: 'Hair', value: 'hair', description: 'Hair-specific services and care' },
  { label: 'Nails', value: 'nails', description: 'Nail-specific services' },
  { label: 'Skin', value: 'skin', description: 'Facial, skincare services' },
  { label: 'Makeup', value: 'makeup', description: 'Makeup services, bridal' },
  { label: 'Promotions', value: 'promotions', description: 'Current offers, discounts' },
  { label: 'Membership', value: 'membership', description: 'Loyalty programs, memberships' }
]

// Helper methods for array inputs
const addKeyword = () => {
  if (keywordInput.value.trim()) {
    faqForm.value.keywords.push(keywordInput.value.trim())
    keywordInput.value = ''
  }
}

const addAltQuestion = () => {
  if (altQuestionInput.value.trim()) {
    faqForm.value.alternativeQuestions.push(altQuestionInput.value.trim())
    altQuestionInput.value = ''
  }
}

const addQuickReply = () => {
  if (quickReplyInput.value.trim()) {
    autoResponseForm.value.quickReplies.push(quickReplyInput.value.trim())
    quickReplyInput.value = ''
  }
}

const toggleDayOfWeek = (day: number) => {
  const index = autoResponseForm.value.trigger.conditions.dayOfWeek.indexOf(day)
  if (index === -1) {
    autoResponseForm.value.trigger.conditions.dayOfWeek.push(day)
  } else {
    autoResponseForm.value.trigger.conditions.dayOfWeek.splice(index, 1)
  }
}

const resetAutoResponseForm = () => {
  autoResponseForm.value = {
    name: '',
    responseType: 'welcome',
    message: '',
    quickReplies: [],
    includeBusinessHours: false,
    includeEstimatedWaitTime: false,
    trigger: {
      event: '',
      conditions: {
        dayOfWeek: [],
        timeRange: { start: '', end: '' },
        maxWaitTime: 0,
        queueSize: 0
      }
    }
  }
}

// Methods
const getUnreadCount = (type: string) => {
  if (type === 'all') {
    return rooms.value.reduce((sum: number, r: ChatRoom) => sum + (r.unreadCount || 0), 0)
  }
  const typeMap: Record<string, string> = {
    'customer': 'customer-support',
    'team': 'team-chat',
    'support': 'admin-support'
  }
  return rooms.value
    .filter((r: ChatRoom) => r.roomType === typeMap[type])
    .reduce((sum: number, r: ChatRoom) => sum + (r.unreadCount || 0), 0)
}

const getRoomDisplayName = (room: ChatRoom) => {
  return room.metadata?.userName || room.roomName || 'Customer'
}

const getRoomInitials = (room: ChatRoom) => {
  const name = getRoomDisplayName(room)
  return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
}

const getRoomAvatarClass = (room: ChatRoom) => {
  const colorMap: Record<string, string> = {
    'customer-support': 'bg-primary/10 text-primary',
    'team-chat': 'bg-blue-100 text-blue-600',
    'admin-support': 'bg-purple-100 text-purple-600'
  }
  return colorMap[room.roomType] || 'bg-gray-100 text-gray-600'
}

const getRoomSubtitle = (room: ChatRoom) => {
  const subtitleMap: Record<string, string> = {
    'customer-support': 'Customer Support',
    'team-chat': 'Team Chat',
    'admin-support': 'Admin Support'
  }
  return subtitleMap[room.roomType] || room.roomType
}

const getRoomOnlineStatus = (_room: ChatRoom) => {
  // Could be enhanced with actual online status tracking
  return false
}

const getPriorityClass = (priority?: string) => {
  const classMap: Record<string, string> = {
    'urgent': 'bg-red-100 text-red-700',
    'high': 'bg-orange-100 text-orange-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-green-100 text-green-700'
  }
  return classMap[priority || 'medium'] || 'bg-gray-100 text-gray-600'
}

// Determine if message is from the current logged-in user (business owner/staff)
// Messages from the current user should appear on the RIGHT
// Messages from customers should appear on the LEFT
const isOwnMessage = (message: ChatMessage) => {
  // Check if the message sender matches the current user
  const currentUserId = userId.value
  const messageSenderId = message.senderId
  
  // Direct match
  if (messageSenderId === currentUserId) return true
  
  // If no senderId on message but senderType is 'staff' and we sent it (check by matching name)
  // This handles cases where the message was just sent and may not have full data
  if (!messageSenderId && message.senderType === 'staff' && message.senderName === fullName.value) {
    return true
  }
  
  return false
}

// const getMessageAlignment = (message: ChatMessage) => {
//   if (message.senderType === 'system') return 'justify-center'
//   // Bot messages should appear on the left (they're automated responses, not from the user)
//   if (message.senderType === 'bot' || message.isAutomated) return 'justify-start'
//   return isOwnMessage(message) ? 'justify-end' : 'justify-start'
// }

// const getMessageBubbleClass = (message: ChatMessage) => {
//   // Auto-assistant / bot messages - distinctive purple styling
//   if (message.senderType === 'bot' || message.isAutomated) {
//     return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 rounded-tl-sm border border-purple-200/50'
//   }
//   if (isOwnMessage(message)) {
//     return 'bg-[#dcf8c6] text-gray-900 rounded-tr-sm'
//   }
//   return 'bg-white text-gray-900 rounded-tl-sm'
// }

const getMessageAlignment = (message: any) => {
  if (!message || typeof message !== 'object') return 'justify-start';
  if (message.senderType === 'system') return 'justify-center';
  if (message.senderType === 'bot' || message.isAutomated) return 'justify-start';
  if (message.senderType === 'staff') return 'justify-start';
  if (message.senderType === 'customer' || message.senderType === 'guest') return 'justify-end';
  return 'justify-start';
};

const getMessageBubbleClass = (message: any) => {
  if (!message || typeof message !== 'object') return 'bg-white text-gray-900 rounded-tl-sm';
  if (message.senderType === 'bot' || message.isAutomated) {
    return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 rounded-tl-sm border border-purple-200/50';
  }
  if (message.senderType === 'staff') {
    return 'bg-white text-gray-900 rounded-tl-sm border border-gray-200';
  }
  if (message.senderType === 'customer' || message.senderType === 'guest') {
    return 'bg-[#dcf8c6] text-gray-900 rounded-tr-sm';
  }
  return 'bg-white text-gray-900 rounded-tl-sm';
};

const formatRelativeTime = (date?: string) => {
  if (!date) return ''
  const now = new Date()
  const msgDate = new Date(date)
  const diff = now.getTime() - msgDate.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days === 1) return 'Yesterday'
  if (days < 7) return msgDate.toLocaleDateString('en-US', { weekday: 'short' })
  return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatMessageTime = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const selectRoom = async (room: ChatRoom) => {
  if (activeRoom.value?._id) {
    leaveRoom(activeRoom.value._id)
  }
  activeRoom.value = room
  
  // Set current room to prevent toast notifications for this room
  setCurrentRoom(room._id)
  
  await fetchMessages(room._id, { limit: 100 })
  if (userId.value) {
    await markRead(room._id, userId.value)
    room.unreadCount = 0
    // Also update global unread counts
    markRoomAsRead(room._id)
  }
  await joinRoom({ roomId: room._id })
  scrollToBottom()
}

const handleSendMessage = async () => {
  if (!activeRoom.value || !newMessage.value.trim() || !userId.value) return

  const content = newMessage.value.trim()
  newMessage.value = ''

  // Send via WebSocket for real-time
  const result = await sendRealtimeMessage({
    roomId: activeRoom.value._id,
    content
  })

  if (!result?.success) {
    // Fallback to HTTP API
    const payload = {
      senderId: userId.value,
      senderType: 'staff' as const,
      senderName: fullName.value || 'Staff',
      content,
      messageType: 'text'
    }
    await sendMessage(activeRoom.value._id, payload)
  }

  scrollToBottom()
}

const sendQuickReply = (reply: string) => {
  newMessage.value = reply
  handleSendMessage()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  }
}

const handleTyping = () => {
  if (!activeRoom.value) return
  emitTyping(activeRoom.value._id, true)
  
  if (typingTimeout.value) clearTimeout(typingTimeout.value)
  typingTimeout.value = setTimeout(() => {
    if (activeRoom.value) {
      emitTyping(activeRoom.value._id, false)
    }
  }, 2000)
}

const handleArchiveRoom = async () => {
  if (!activeRoom.value) return
  await archiveRoom(activeRoom.value._id)
  await fetchRooms()
  activeRoom.value = null
  showRoomInfo.value = false
}

const handleStartNewChat = async () => {
  newChatLoading.value = true
  try {
    let room: ChatRoom | null = null

    if (newChatType.value === 'team' && selectedTeamMember.value) {
      room = await createTeamChatRoom({
        memberId: selectedTeamMember.value._id,
        memberName: `${selectedTeamMember.value.firstName} ${selectedTeamMember.value.lastName}`,
        memberEmail: selectedTeamMember.value.email
      })
    } else if (newChatType.value === 'support') {
      room = await createSupportChatRoom()
    }

    if (room) {
      await fetchRooms()
      const foundRoom = rooms.value.find((r: ChatRoom) => r._id === room?._id)
      if (foundRoom) {
        selectRoom(foundRoom)
      }
    }

    showNewChatModal.value = false
    selectedTeamMember.value = null
  } catch (error) {
    console.error('Failed to create chat:', error)
  } finally {
    newChatLoading.value = false
  }
}

const handleCreateFaq = async () => {
  if (!faqForm.value.question || !faqForm.value.answer) return
  await createFaq({
    question: faqForm.value.question,
    answer: faqForm.value.answer,
    category: faqForm.value.category || 'general',
    keywords: faqForm.value.keywords,
    alternativeQuestions: faqForm.value.alternativeQuestions,
    confidenceThreshold: faqForm.value.confidenceThreshold,
    priority: faqForm.value.priority
  })
  faqForm.value = { 
    question: '', 
    answer: '', 
    category: 'general', 
    keywords: [], 
    alternativeQuestions: [],
    confidenceThreshold: 0.7,
    priority: 1 
  }
  await fetchFaqs()
}

const handleDeleteFaq = async (faqId: string) => {
  await deleteFaq(faqId)
  await fetchFaqs()
}

const handleCreateAutoResponse = async () => {
  if (!autoResponseForm.value.name || !autoResponseForm.value.message) return
  
  // Build the payload with required fields
  const payload = {
    name: autoResponseForm.value.name,
    responseType: autoResponseForm.value.responseType,
    message: autoResponseForm.value.message,
    includeBusinessHours: autoResponseForm.value.includeBusinessHours,
    includeEstimatedWaitTime: autoResponseForm.value.includeEstimatedWaitTime,
    quickReplies: autoResponseForm.value.quickReplies.length > 0 ? autoResponseForm.value.quickReplies : undefined,
    trigger: autoResponseForm.value.trigger.event ? {
      event: autoResponseForm.value.trigger.event,
      conditions: {
        dayOfWeek: autoResponseForm.value.trigger.conditions.dayOfWeek.length > 0 
          ? autoResponseForm.value.trigger.conditions.dayOfWeek 
          : undefined,
        timeRange: autoResponseForm.value.trigger.conditions.timeRange.start && autoResponseForm.value.trigger.conditions.timeRange.end 
          ? autoResponseForm.value.trigger.conditions.timeRange 
          : undefined,
        maxWaitTime: autoResponseForm.value.trigger.conditions.maxWaitTime > 0 
          ? autoResponseForm.value.trigger.conditions.maxWaitTime 
          : undefined,
        queueSize: autoResponseForm.value.trigger.conditions.queueSize > 0 
          ? autoResponseForm.value.trigger.conditions.queueSize 
          : undefined
      }
    } : undefined
  }
  
  await createAutoResponse(payload)
  resetAutoResponseForm()
  await fetchAutoResponses()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Real-time event handlers
onNewMessage((message: ChatMessage) => {
  if (!message.roomId) return
  
  if (activeRoom.value?._id === message.roomId) {
    // Add to current messages if not already there
    const exists = messagesData.value.find((m: ChatMessage) => 
      (m._id || m.id) === (message._id || message.id)
    )
    if (!exists) {
      messagesData.value = [...messagesData.value, message]
      scrollToBottom()
    }
  } else {
    // Update unread count for other rooms
    const room = roomsData.value.find((r: ChatRoom) => r._id === message.roomId)
    if (room) {
      room.unreadCount = (room.unreadCount || 0) + 1
      room.lastMessageAt = message.createdAt
    }
  }
})

onNewConversation(() => {
  fetchRooms()
})

onTyping((data: { roomId: string; userName: string; isTyping: boolean }) => {
  if (activeRoom.value?._id === data.roomId && data.isTyping) {
    typingUser.value = data.userName
    setTimeout(() => {
      typingUser.value = null
    }, 3000)
  }
})

// Auto-scroll on new messages
watch(() => messages.value.length, scrollToBottom)

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchRooms(),
    fetchFaqs(),
    fetchAutoResponses(),
    fetchTeamMembers()
  ])
})

// Cleanup - clear current room when leaving the page
onUnmounted(() => {
  setCurrentRoom(null)
  if (activeRoom.value?._id) {
    leaveRoom(activeRoom.value._id)
  }
})
</script>

<style scoped>
@media (max-width: 768px) {
  .w-[380px] {
    width: 100% !important;
  }
  .md\\:flex-row {
    flex-direction: column !important;
  }
  .md\\:static {
    position: fixed !important;
  }
  .md\\:relative {
    position: static !important;
  }
  .md\\:translate-x-0 {
    transform: none !important;
  }
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from > div:last-child,
.slide-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
