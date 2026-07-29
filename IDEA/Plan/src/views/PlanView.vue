<template>
  <div class="plan-view">
    <router-link to="/" class="back-btn" aria-label="返回主页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>返回</span>
    </router-link>

    <div class="plan-container">
      <header class="plan-header">
        <h1 class="plan-title">
          📋 My Plan
          <span class="title-emoji">😋</span>
        </h1>
        <p class="plan-subtitle">管理你的待办事项</p>
      </header>

      <div class="todo-input-section">
        <form @submit.prevent="handleAdd" class="todo-form">
          <input
            v-model="newTodoText"
            type="text"
            class="todo-input"
            placeholder="添加新的待办事项..."
            aria-label="新待办内容"
          />
          <button type="submit" class="add-btn" :disabled="!newTodoText.trim()">
            添加
          </button>
        </form>
      </div>

      <div class="todo-stats" v-if="totalCount > 0">
        <span class="stat-item">
          共 <strong>{{ totalCount }}</strong> 项
        </span>
        <span class="stat-divider">·</span>
        <span class="stat-item active">
          进行中 <strong>{{ activeCount }}</strong>
        </span>
        <span class="stat-divider">·</span>
        <span class="stat-item completed">
          已完成 <strong>{{ completedCount }}</strong>
        </span>
        <button
          v-if="completedCount > 0"
          class="clear-btn"
          @click="clearCompleted"
        >
          清除已完成
        </button>
      </div>

      <div class="todo-list" v-if="todos.length > 0">
        <TransitionGroup name="list" tag="div" class="todo-list-inner">
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @toggle="toggleTodo"
            @delete="deleteTodo"
          />
        </TransitionGroup>
      </div>

      <div class="empty-state" v-else>
        <div class="empty-icon">📝</div>
        <p class="empty-text">还没有待办事项</p>
        <p class="empty-hint">在上方输入框添加你的第一个待办吧 😋</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodo } from '@/composables/useTodo.js'
import TodoItem from '@/components/TodoItem.vue'

const newTodoText = ref('')
const {
  todos,
  addTodo,
  toggleTodo,
  deleteTodo,
  completedCount,
  activeCount,
  totalCount,
  clearCompleted
} = useTodo()

const handleAdd = () => {
  const success = addTodo(newTodoText.value)
  if (success) {
    newTodoText.value = ''
  }
}
</script>

<style scoped>
.plan-view {
  min-height: 100vh;
  padding: var(--space-xl) var(--space-md);
  position: relative;
  z-index: 2;
}

.back-btn {
  position: fixed;
  top: var(--space-md);
  left: var(--space-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text);
  font-size: var(--font-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  z-index: 50;
}

.back-btn:hover {
  background: var(--bg-lighter);
  border-color: var(--primary);
  color: var(--primary);
  transform: translateX(-4px);
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

.plan-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: var(--space-3xl);
}

.plan-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.plan-title {
  font-size: var(--font-3xl);
  font-weight: 800;
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.title-emoji {
  display: inline-block;
  font-size: var(--font-2xl);
  animation: wiggle 2s ease-in-out infinite;
}

.plan-subtitle {
  margin-top: var(--space-sm);
  color: var(--text-muted);
  font-size: var(--font-base);
}

.todo-input-section {
  margin-bottom: var(--space-lg);
}

.todo-form {
  display: flex;
  gap: var(--space-sm);
}

.todo-input {
  flex: 1;
  padding: var(--space-md);
  background: var(--bg-light);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  font-size: var(--font-base);
  transition: all var(--transition-base);
}

.todo-input::placeholder {
  color: var(--text-dim);
}

.todo-input:focus {
  border-color: var(--primary);
  background: var(--bg-lighter);
}

.add-btn {
  padding: var(--space-md) var(--space-xl);
  background: var(--primary);
  color: white;
  font-size: var(--font-base);
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4);
}

.add-btn:active:not(:disabled) {
  transform: translateY(0);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.todo-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-light);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
}

.stat-item {
  color: var(--text-muted);
}

.stat-item strong {
  color: var(--text);
  font-weight: 700;
}

.stat-item.active strong {
  color: var(--warning);
}

.stat-item.completed strong {
  color: var(--success);
}

.stat-divider {
  color: var(--text-dim);
}

.clear-btn {
  margin-left: auto;
  padding: var(--space-xs) var(--space-sm);
  background: transparent;
  color: var(--danger);
  font-size: var(--font-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: rgba(255, 107, 107, 0.15);
}

.todo-list {
  margin-top: var(--space-md);
}

.todo-list-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.empty-state {
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-md);
  opacity: 0.6;
}

.empty-text {
  font-size: var(--font-lg);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.empty-hint {
  font-size: var(--font-sm);
  color: var(--text-dim);
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 600px) {
  .plan-view {
    padding: var(--space-md) var(--space-sm);
  }

  .plan-container {
    padding-top: var(--space-2xl);
  }

  .plan-title {
    font-size: var(--font-2xl);
  }

  .title-emoji {
    font-size: var(--font-xl);
  }

  .plan-subtitle {
    font-size: var(--font-sm);
  }

  .todo-form {
    flex-direction: column;
  }

  .add-btn {
    padding: var(--space-sm) var(--space-md);
  }

  .todo-stats {
    flex-wrap: wrap;
    font-size: var(--font-xs);
  }

  .clear-btn {
    width: 100%;
    margin-left: 0;
    margin-top: var(--space-xs);
  }

  .back-btn {
    top: var(--space-sm);
    left: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-xs);
  }

  .back-btn svg {
    width: 14px;
    height: 14px;
  }
}
</style>
