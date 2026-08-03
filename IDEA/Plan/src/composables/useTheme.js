import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'chencr_theme'

const theme = ref('dark')

const applyTheme = (t) => {
  const root = document.documentElement
  root.setAttribute('data-theme', t)
  if (t === 'light') {
    root.style.colorScheme = 'light'
  } else {
    root.style.colorScheme = 'dark'
  }
}

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (t) => {
    if (t === 'dark' || t === 'light') {
      theme.value = t
    }
  }

  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch (e) {
      console.error('Failed to save theme:', e)
    }
  })

  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') {
        theme.value = saved
      } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
        theme.value = prefersLight ? 'light' : 'dark'
      }
    } catch (e) {
      theme.value = 'dark'
    }
    applyTheme(theme.value)
  })

  return {
    theme,
    toggleTheme,
    setTheme
  }
}
