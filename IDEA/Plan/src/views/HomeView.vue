<template>
  <div class="home-view">
    <AppHeader />
    <div class="home-content">
      <div class="logo-section">
        <h1 class="brand-name">
          ChenCR
          <span class="brand-emoji">😋</span>
        </h1>
        <p class="tagline">欢迎来到我的小角落</p>
      </div>
      <div class="decoration">
        <span class="deco-star star-1">✨</span>
        <span class="deco-star star-2">💫</span>
        <span class="deco-star star-3">🌟</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  position: relative;
}

.home-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.logo-section {
  position: relative;
  display: inline-block;
}

.brand-name {
  font-size: var(--font-5xl);
  font-weight: 800;
  letter-spacing: -2px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.brand-emoji {
  display: inline-block;
  font-size: var(--font-3xl);
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.tagline {
  margin-top: var(--space-lg);
  font-size: var(--font-lg);
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 1px;
}

.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.deco-star {
  position: absolute;
  font-size: var(--font-xl);
  opacity: 0.7;
}

.star-1 {
  top: -20px;
  left: -60px;
  animation: float 3s ease-in-out infinite;
}

.star-2 {
  top: 30px;
  right: -80px;
  animation: float 3s ease-in-out infinite 0.5s;
}

.star-3 {
  bottom: -30px;
  left: 20px;
  animation: float 3s ease-in-out infinite 1s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(-5deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
  75% {
    transform: translateY(-10px) rotate(0deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 600px) {
  .home-view {
    padding: var(--space-md);
  }

  .brand-name {
    font-size: var(--font-4xl);
    letter-spacing: -1px;
  }

  .brand-emoji {
    font-size: var(--font-2xl);
  }

  .tagline {
    font-size: var(--font-base);
    margin-top: var(--space-md);
  }

  .deco-star {
    font-size: var(--font-lg);
  }

  .star-1 {
    top: -10px;
    left: -40px;
  }

  .star-2 {
    top: 20px;
    right: -50px;
  }

  .star-3 {
    bottom: -20px;
    left: 10px;
  }
}
</style>
