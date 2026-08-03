<template>
  <div class="home-view">
    <AppHeader />
    <div class="home-content">
      <div class="logo-section">
        <h1 class="brand-name"><!--
          --><span class="letter" style="--i: 0">C</span><!--
          --><span class="letter" style="--i: 1">h</span><!--
          --><span class="letter" style="--i: 2">e</span><!--
          --><span class="letter" style="--i: 3">n</span><!--
          --><span class="letter" style="--i: 4">C</span><!--
          --><span class="letter letter-r" style="--i: 5">R<span class="brand-emoji">😋</span></span>
        </h1>
        <p class="tagline">✦ dare to be different ✦</p>
      </div>
      <div class="decoration">
        <span class="deco-star star-1">✨</span>
        <span class="deco-star star-2">💫</span>
        <span class="deco-star star-3">🌟</span>
        <span class="deco-star star-4">💜</span>
        <span class="deco-star star-5">🎨</span>
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
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  letter-spacing: -4px;
  line-height: 1.1;
  position: relative;
  display: inline-block;
  filter: drop-shadow(0 8px 24px rgba(108, 92, 231, 0.35));
}

.letter {
  display: inline-block;
  background: linear-gradient(135deg, #6C5CE7 0%, #00B894 40%, #FDCB6E 70%, #FF6B6B 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 6s ease infinite;
  transition: transform 0.3s ease;
  cursor: default;
}

.letter:hover {
  animation: gradientShift 6s ease infinite, letterFloat 0.6s ease-in-out infinite;
}

.letter-r {
  position: relative;
  z-index: 2;
}

.brand-emoji {
  position: absolute;
  right: -0.15em;
  top: -0.5em;
  font-size: 0.38em;
  transform: rotate(25deg);
  z-index: 1;
  -webkit-text-fill-color: initial;
  animation: wiggle 2.5s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
  pointer-events: none;
}

.tagline {
  margin-top: var(--space-lg);
  font-size: var(--font-lg);
  color: var(--text-muted);
  font-weight: 300;
  letter-spacing: 3px;
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
  opacity: 0.6;
}

.star-1 { top: -30px; left: -80px; animation: float 4s ease-in-out infinite; }
.star-2 { top: 40px; right: -100px; animation: float 4s ease-in-out infinite 0.8s; }
.star-3 { bottom: -40px; left: 30px; animation: float 4s ease-in-out infinite 1.6s; }
.star-4 { bottom: 20px; right: -60px; animation: float 4s ease-in-out infinite 0.4s; }
.star-5 { top: -10px; right: -30px; animation: float 4s ease-in-out infinite 1.2s; }

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes letterFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(25deg) translate(0, 0); }
  25% { transform: rotate(32deg) translate(-3px, -4px); }
  50% { transform: rotate(18deg) translate(0, -3px); }
  75% { transform: rotate(30deg) translate(-2px, -4px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(5deg); }
}

@media (max-width: 600px) {
  .home-view {
    padding: var(--space-md);
  }

  .brand-name {
    letter-spacing: -2px;
  }

  .brand-emoji {
    font-size: 0.4em;
    right: -0.1em;
    top: -0.48em;
  }

  .tagline {
    font-size: var(--font-sm);
    letter-spacing: 2px;
  }

  .deco-star {
    font-size: var(--font-lg);
  }

  .star-1 { top: -15px; left: -50px; }
  .star-2 { top: 25px; right: -60px; }
  .star-3 { bottom: -25px; left: 15px; }
  .star-4 { bottom: 10px; right: -40px; }
  .star-5 { top: -5px; right: -15px; }
}
</style>
