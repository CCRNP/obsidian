<template>
  <header class="app-header">
    <div class="header-buttons">
      <router-link to="/plan" class="header-btn plan-btn" aria-label="Plan">
        <span class="btn-glow"></span>
        <span class="btn-icon">⟡</span>
        <span class="btn-text">Plan</span>
      </router-link>
      <a
        href="http://47.107.29.140:80/"
        target="_blank"
        rel="noopener noreferrer"
        class="header-btn food-btn"
        aria-label="今天吃什么"
      >
        <span class="btn-glow"></span>
        <span class="btn-icon">🍽</span>
        <span class="btn-text">今天吃什么</span>
      </a>
      <button
        class="header-btn theme-btn"
        @click="toggleTheme"
        :aria-label="theme === 'dark' ? '切换浅色模式' : '切换深色模式'"
      >
        <span class="btn-glow"></span>
        <span class="theme-icon" :class="{ 'is-dark': theme === 'dark' }">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  padding: var(--space-md);
  display: flex;
  align-items: center;
}

.header-buttons {
  display: flex;
  gap: var(--space-md);
}

.header-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-xl);
  font-size: var(--font-base);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  border: none;
  color: white;
  transition: all var(--transition-base);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-btn::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, var(--btn-gradient-from, #6C5CE7), var(--btn-gradient-to, #00B894));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.btn-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--transition-base);
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.25), transparent 70%);
  pointer-events: none;
}

.header-btn:hover .btn-glow {
  opacity: 1;
}

.plan-btn {
  background: linear-gradient(135deg, #6C5CE7, #A29BFE);
  --btn-gradient-from: #6C5CE7;
  --btn-gradient-to: #A29BFE;
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.45);
}

.plan-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 30px rgba(108, 92, 231, 0.55);
}

.plan-btn:active {
  transform: translateY(0) scale(0.98);
}

.food-btn {
  background: linear-gradient(135deg, #00B894, #00CEC9);
  --btn-gradient-from: #00B894;
  --btn-gradient-to: #00CEC9;
  box-shadow: 0 4px 20px rgba(0, 184, 148, 0.45);
}

.food-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 30px rgba(0, 184, 148, 0.55);
}

.food-btn:active {
  transform: translateY(0) scale(0.98);
}

.theme-btn {
  background: var(--glass-bg);
  color: var(--text);
  --btn-gradient-from: var(--primary);
  --btn-gradient-to: var(--accent);
  box-shadow: 0 4px 20px var(--shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
}

.theme-btn:hover {
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 8px 30px var(--shadow);
}

.theme-btn:active {
  transform: translateY(0) scale(0.95);
}

.theme-icon {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon svg {
  position: absolute;
  width: 20px;
  height: 20px;
  transition: all 0.4s ease;
}

.theme-icon .sun-icon {
  opacity: 0;
  transform: rotate(-90deg) scale(0);
  color: #FDCB6E;
}

.theme-icon .moon-icon {
  opacity: 1;
  transform: rotate(0) scale(1);
  color: #B0B0C8;
}

.theme-icon.is-dark .sun-icon {
  opacity: 1;
  transform: rotate(0) scale(1);
}

.theme-icon.is-dark .moon-icon {
  opacity: 0;
  transform: rotate(90deg) scale(0);
}

.header-btn:hover .theme-icon svg {
  filter: drop-shadow(0 0 6px currentColor);
}

.btn-icon {
  font-size: var(--font-xl);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.btn-text {
  white-space: nowrap;
  letter-spacing: 0.5px;
}

@media (max-width: 600px) {
  .app-header {
    padding: var(--space-sm);
  }

  .header-buttons {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .header-btn {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--font-sm);
  }

  .btn-icon {
    font-size: var(--font-lg);
  }

  .theme-icon {
    width: 20px;
    height: 20px;
  }

  .theme-icon svg {
    width: 16px;
    height: 16px;
  }
}
</style>
