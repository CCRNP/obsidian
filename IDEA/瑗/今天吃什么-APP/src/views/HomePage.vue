<template>
<div class="page" id="page-home">
  <div class="shop-title">
    ✦ 今天吃什么 ✦
    <span class="sub">⸺ 美食占卜部 ⸺</span>
  </div>

  <div class="hero">
    <div class="big-title">
      <span class="highlight">今天</span>吃什么
    </div>
    <div class="desc">
      不知道今天吃什么？<br/>
      把这个难题交给<em>魔法</em>吧。
    </div>
  </div>

  <div class="feature-grid">
    <div class="feature-card wheel-card" @click="$emit('go-wheel')">
      <div class="icon-box">🎡</div>
      <div class="info">
        <div class="name">转盘抽签 <span class="badge">✦ 命运</span></div>
        <div class="hint">转一转，停在哪吃哪</div>
      </div>
      <div class="arrow"></div>
    </div>

    <div class="feature-card quiz-card" @click="$emit('go-quiz')">
      <div class="icon-box">🔮</div>
      <div class="info">
        <div class="name">灵魂问答 <span class="badge">✦ 洞察</span></div>
        <div class="hint">答 5 个问题，看穿你的胃</div>
      </div>
      <div class="arrow"></div>
    </div>
  </div>

  <div class="footer-note">
    结果由店里的老魔法决定 · 概不退换
  </div>
</div>
</template>

<script setup>
defineEmits(['go-wheel', 'go-quiz'])
</script>