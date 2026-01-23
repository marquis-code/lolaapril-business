<template>
  <div class="fixed bottom-6 right-6 z-[999999]">
    <!-- Compact Music Icon (Always Visible) -->
    <button
      v-if="!showControls"
      @click="showControls = true"
      class="group relative w-8 h-8 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110"
      title="Music controls"
    >
      <!-- Music Note Icon -->
      <svg 
        class="w-4 h-4 text-white" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
      </svg>

      <!-- Pulse animation when playing -->
      <span 
        v-if="isPlaying"
        class="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-30"
      ></span>
    </button>

    <!-- Expanded Controls Panel -->
    <div
      v-else
      class="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] animate-slideIn"
    >
      <!-- Header with Close Button -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 text-sm">Now Playing</h3>
            <p class="text-xs text-gray-500">Background Music</p>
          </div>
        </div>
        
        <!-- Minimize Button -->
        <button
          @click="showControls = false"
          class="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          title="Minimize"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Play/Pause Button -->
      <div class="flex items-center justify-center mb-4">
        <button
          @click="togglePlay"
          class="w-14 h-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
        >
          <!-- Play Icon -->
          <svg 
            v-if="!isPlaying" 
            viewBox="0 0 24 24" 
            class="w-6 h-6 text-white ml-0.5" 
            fill="currentColor"
          >
            <polygon points="8,5 19,12 8,19" />
          </svg>

          <!-- Pause Icon -->
          <svg 
            v-else 
            viewBox="0 0 24 24" 
            class="w-6 h-6 text-white" 
            fill="currentColor"
          >
            <rect x="7" y="5" width="3" height="14" rx="1" />
            <rect x="14" y="5" width="3" height="14" rx="1" />
          </svg>
        </button>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center gap-3 mb-3">
        <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          v-model="volume"
          @input="updateVolume"
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <span class="text-xs text-gray-600 w-8">{{ volume }}%</span>
      </div>

      <!-- Optional: Song Selection -->
      <div class="pt-3 border-t border-gray-100">
        <button class="w-full text-xs text-gray-600 hover:text-purple-600 transition-colors flex items-center justify-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Change Track
        </button>
      </div>
    </div>

    <audio
      ref="audioRef"
      :src="src"
      loop
      playsinline
      preload="auto"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const showControls = ref(false) // Start minimized
const hasInteracted = ref(false)
const volume = ref(40)

// Aggressive play attempt
const attemptPlay = async () => {
  if (!audioRef.value) return

  try {
    audioRef.value.muted = false
    audioRef.value.volume = volume.value / 100
    await audioRef.value.play()
    isPlaying.value = true
    hasInteracted.value = true
  } catch (e) {
    // If unmuted fails, try muted
    try {
      audioRef.value.muted = true
      await audioRef.value.play()
      isPlaying.value = true
      hasInteracted.value = true
    } catch (err) {
      console.warn('Audio blocked - waiting for user interaction')
      isPlaying.value = false
    }
  }
}

// Handle user interactions to unlock audio
const handleUserInteraction = async () => {
  if (!hasInteracted.value && audioRef.value) {
    await attemptPlay()
  }
}

onMounted(async () => {
  if (!audioRef.value) return

  // Set initial volume
  audioRef.value.volume = volume.value / 100

  // Try to play immediately
  await attemptPlay()

  // Listen for ANY user interaction to unlock audio
  const events = ['click', 'touchstart', 'keydown', 'scroll']
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { once: true, passive: true })
  })

  // Also listen for page visibility changes to resume
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audioRef.value && !audioRef.value.paused) {
      attemptPlay()
    }
  })
})

const togglePlay = async () => {
  if (!audioRef.value) return

  if (audioRef.value.paused) {
    try {
      await audioRef.value.play()
      isPlaying.value = true
    } catch (e) {
      console.error('Failed to play:', e)
    }
  } else {
    audioRef.value.pause()
    isPlaying.value = false
  }
}

const updateVolume = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
  }
}

// Cleanup
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})
</script>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slideIn {
  animation: slideIn 0.2s ease-out;
}
</style>