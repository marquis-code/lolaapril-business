import { ref, computed } from 'vue'

interface Theme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    error: string
    success: string
  }
  typography: {
    fontFamily: string
    headingFont: string
    bodyFont: string
  }
  logo?: {
    url: string
    width: number
    height: number
    alt: string
  }
  favicon?: { url: string }
  customCss?: { enabled: boolean; cssCode: string }
}

const currentTheme = ref<Theme | null>(null)

export const useTheme = () => {
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    applyThemeToDocument(theme)
  }

  const applyThemeToDocument = (theme: Theme) => {
    const root = document.documentElement
    
    // Apply CSS variables
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-secondary', theme.colors.secondary)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-background', theme.colors.background)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-error', theme.colors.error)
    root.style.setProperty('--color-success', theme.colors.success)
    root.style.setProperty('--font-family', theme.typography.fontFamily)
    root.style.setProperty('--font-heading', theme.typography.headingFont)
    root.style.setProperty('--font-body', theme.typography.bodyFont)

    // Apply custom CSS
    if (theme.customCss?.enabled && theme.customCss?.cssCode) {
      let styleEl = document.getElementById('custom-theme-css')
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'custom-theme-css'
        document.head.appendChild(styleEl)
      }
      styleEl.textContent = theme.customCss.cssCode
    }
  }

  const parseThemeFromUrl = (base64Theme: string): Theme | null => {
    try {
      return JSON.parse(atob(base64Theme))
    } catch {
      return null
    }
  }

  return {
    theme: currentTheme,
    setTheme,
    parseThemeFromUrl,
    applyThemeToDocument
  }
}