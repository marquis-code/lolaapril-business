<template>
  <div class="space-y-6">
    <!-- Button Styles -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Button Styles</h3>
        <p class="text-sm text-gray-500">Customize the appearance of buttons</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Style -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Button Style</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="style in buttonStyles"
              :key="style.value"
              @click="componentStyles.buttons.style = style.value"
              :class="[
                'p-2 rounded-lg border-2 text-xs font-medium transition-all',
                componentStyles.buttons.style === style.value 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ style.label }}
            </button>
          </div>
        </div>

        <!-- Border Radius -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Border Radius: {{ componentStyles.buttons.borderRadius }}</label>
          <input 
            type="range" 
            v-model.number="borderRadiusValue"
            min="0" 
            max="24" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div class="flex justify-between text-xs text-gray-500">
            <span>Sharp</span>
            <span>Rounded</span>
            <span>Pill</span>
          </div>
        </div>

        <!-- Size -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Button Size</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="size in buttonSizes"
              :key="size.value"
              @click="componentStyles.buttons.size = size.value"
              :class="[
                'p-2 rounded-lg border-2 text-xs font-medium transition-all',
                componentStyles.buttons.size === size.value 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ size.label }}
            </button>
          </div>
        </div>

        <!-- Font Weight -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Font Weight</label>
          <select 
            v-model="componentStyles.buttons.fontWeight"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="400">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semi-Bold</option>
            <option value="700">Bold</option>
          </select>
        </div>

        <!-- Uppercase -->
        <div class="flex items-center">
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 w-full">
            <input type="checkbox" v-model="componentStyles.buttons.uppercase" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Uppercase Text</p>
              <p class="text-xs text-gray-500">TRANSFORM BUTTON TEXT</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Button Preview -->
      <div class="mt-6 p-6 bg-gray-50 rounded-xl">
        <p class="text-xs text-gray-500 mb-3">Preview</p>
        <div class="flex items-center gap-4">
          <button
            :style="buttonPreviewStyle"
            class="px-6 py-3 text-white bg-primary transition-colors"
          >
            {{ componentStyles.buttons.uppercase ? 'BOOK NOW' : 'Book Now' }}
          </button>
          <button
            :style="{ ...buttonPreviewStyle, background: 'transparent', color: '#3B82F6', border: '2px solid #3B82F6' }"
            class="px-6 py-3 transition-colors"
          >
            {{ componentStyles.buttons.uppercase ? 'LEARN MORE' : 'Learn More' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Card Styles -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Card Styles</h3>
        <p class="text-sm text-gray-500">Customize service and staff cards appearance</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Border Radius -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Border Radius: {{ componentStyles.cards.borderRadius }}</label>
          <input 
            type="range" 
            v-model.number="cardBorderRadiusValue"
            min="0" 
            max="24" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- Shadow -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Shadow Intensity</label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="shadow in shadowOptions"
              :key="shadow.value"
              @click="componentStyles.cards.shadowIntensity = shadow.value; componentStyles.cards.shadow = shadow.value !== 'none'"
              :class="[
                'p-2 rounded-lg border-2 text-xs font-medium transition-all',
                componentStyles.cards.shadowIntensity === shadow.value 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ shadow.label }}
            </button>
          </div>
        </div>

        <!-- Border -->
        <div class="space-y-3">
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" v-model="componentStyles.cards.border" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p class="text-sm font-medium text-gray-900">Show Border</p>
              <p class="text-xs text-gray-500">Add subtle border to cards</p>
            </div>
          </label>
          <div v-if="componentStyles.cards.border" class="flex items-center gap-2">
            <input 
              type="color" 
              v-model="componentStyles.cards.borderColor"
              class="w-10 h-8 rounded border border-gray-200 cursor-pointer"
            />
            <input 
              v-model="componentStyles.cards.borderColor" 
              type="text" 
              class="flex-1 h-8 px-2 rounded border border-gray-200 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      <!-- Card Preview -->
      <div class="mt-6 p-6 bg-gray-50 rounded-xl">
        <p class="text-xs text-gray-500 mb-3">Preview</p>
        <div class="grid grid-cols-3 gap-4">
          <div 
            :style="cardPreviewStyle"
            class="bg-white p-4"
          >
            <div class="w-full h-24 bg-gray-200 rounded-lg mb-3"></div>
            <h4 class="font-medium text-sm">Service Name</h4>
            <p class="text-xs text-gray-500">60 min • $50</p>
          </div>
          <div 
            :style="cardPreviewStyle"
            class="bg-white p-4"
          >
            <div class="w-full h-24 bg-gray-200 rounded-lg mb-3"></div>
            <h4 class="font-medium text-sm">Service Name</h4>
            <p class="text-xs text-gray-500">45 min • $75</p>
          </div>
          <div 
            :style="cardPreviewStyle"
            class="bg-white p-4"
          >
            <div class="w-full h-24 bg-gray-200 rounded-lg mb-3"></div>
            <h4 class="font-medium text-sm">Service Name</h4>
            <p class="text-xs text-gray-500">90 min • $120</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout Settings -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Layout Settings</h3>
        <p class="text-sm text-gray-500">Configure spacing and widths</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Input Border Radius -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Input Border Radius: {{ componentStyles.inputBorderRadius }}</label>
          <input 
            type="range" 
            v-model.number="inputBorderRadiusValue"
            min="0" 
            max="16" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- Section Spacing -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Section Spacing: {{ componentStyles.sectionSpacing }}</label>
          <select 
            v-model="componentStyles.sectionSpacing"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="16px">Compact (16px)</option>
            <option value="24px">Normal (24px)</option>
            <option value="32px">Relaxed (32px)</option>
            <option value="48px">Spacious (48px)</option>
          </select>
        </div>

        <!-- Max Content Width -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Max Content Width</label>
          <select 
            v-model="componentStyles.maxContentWidth"
            class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="960px">Narrow (960px)</option>
            <option value="1200px">Standard (1200px)</option>
            <option value="1400px">Wide (1400px)</option>
            <option value="100%">Full Width</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentStyles } from '@/types/branding'

const props = defineProps<{
  componentStyles: ComponentStyles
}>()

const buttonStyles = [
  { value: 'filled', label: 'Filled' },
  { value: 'outlined', label: 'Outlined' },
  { value: 'ghost', label: 'Ghost' }
]

const buttonSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
]

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'strong', label: 'Strong' }
]

// Computed values for sliders
const borderRadiusValue = computed({
  get: () => parseInt(props.componentStyles.buttons.borderRadius) || 8,
  set: (val) => { props.componentStyles.buttons.borderRadius = `${val}px` }
})

const cardBorderRadiusValue = computed({
  get: () => parseInt(props.componentStyles.cards.borderRadius) || 12,
  set: (val) => { props.componentStyles.cards.borderRadius = `${val}px` }
})

const inputBorderRadiusValue = computed({
  get: () => parseInt(props.componentStyles.inputBorderRadius) || 8,
  set: (val) => { props.componentStyles.inputBorderRadius = `${val}px` }
})

const buttonPreviewStyle = computed(() => {
  const size = {
    small: { padding: '8px 16px', fontSize: '12px' },
    medium: { padding: '12px 24px', fontSize: '14px' },
    large: { padding: '16px 32px', fontSize: '16px' }
  }[props.componentStyles.buttons.size || 'medium']

  return {
    borderRadius: props.componentStyles.buttons.borderRadius,
    fontWeight: props.componentStyles.buttons.fontWeight,
    textTransform: props.componentStyles.buttons.uppercase ? 'uppercase' : 'none',
    ...size
  }
})

const cardPreviewStyle = computed(() => {
  const shadows = {
    none: 'none',
    light: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    strong: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
  }

  return {
    borderRadius: props.componentStyles.cards.borderRadius,
    boxShadow: shadows[props.componentStyles.cards.shadowIntensity || 'medium'],
    border: props.componentStyles.cards.border 
      ? `1px solid ${props.componentStyles.cards.borderColor || '#E5E7EB'}` 
      : 'none'
  }
})
</script>
