<template>
  <header class="app-header">
    <div class="header-buttons">
      <router-link to="/plan" class="header-btn plan-btn" aria-label="Plan">
        <span class="btn-icon">⟡</span>
        <span class="btn-text">Plan</span>
      </router-link>
      <a
        href="http://47.107.29.140:8080/"
        target="_blank"
        rel="noopener noreferrer"
        class="header-btn food-btn"
        aria-label="今天吃什么"
      >
        <span class="btn-icon">⟡</span>
        <span class="btn-text">今天吃什么</span>
      </a>
    </div>
  </header>
</template>

<script setup>
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
  gap: var(--space-sm);
}

.header-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
  user-select: none;
}

.plan-btn {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4);
}

.plan-btn:hover {
  background: var(--primary-hover);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.5);
}

.food-btn {
  background: var(--accent);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 184, 148, 0.4);
}

.food-btn:hover {
  background: var(--accent-hover);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 184, 148, 0.5);
}

.header-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: var(--font-base);
  opacity: 0.9;
}

.btn-text {
  white-space: nowrap;
}

@media (max-width: 600px) {
  .app-header {
    padding: var(--space-sm);
  }

  .header-buttons {
    flex-direction: column;
    gap: var(--space-xs);
  }

  .header-btn {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-xs);
  }

  .btn-icon {
    font-size: var(--font-sm);
  }
}
</style>
