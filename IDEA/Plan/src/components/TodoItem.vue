<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <button
      class="todo-check"
      :class="{ checked: todo.completed }"
      @click="$emit('toggle', todo.id)"
      :aria-label="todo.completed ? '标记为未完成' : '标记为已完成'"
    >
      <svg v-if="todo.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
    <span class="todo-text">{{ todo.text }}</span>
    <div class="todo-actions">
      <button
        class="action-btn toggle-btn"
        @click="$emit('toggle', todo.id)"
        :aria-label="todo.completed ? '取消完成' : '标记完成'"
      >
        {{ todo.completed ? '↩' : '✓' }}
      </button>
      <button
        class="action-btn delete-btn"
        @click="$emit('delete', todo.id)"
        aria-label="删除待办"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'delete'])
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  animation: slideIn 0.3s ease-out;
}

.todo-item:hover {
  background: var(--bg-lighter);
  border-color: var(--primary);
  transform: translateX(4px);
}

.todo-item.completed {
  opacity: 0.65;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--text-dim);
}

.todo-check {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 2px solid var(--text-dim);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  color: white;
  background: transparent;
  padding: 0;
}

.todo-check:hover {
  border-color: var(--accent);
}

.todo-check.checked {
  background: var(--accent);
  border-color: var(--accent);
}

.todo-check svg {
  width: 14px;
  height: 14px;
}

.todo-text {
  flex: 1;
  font-size: var(--font-base);
  color: var(--text);
  word-break: break-word;
  line-height: 1.4;
}

.todo-actions {
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  transition: all var(--transition-fast);
}

.toggle-btn {
  background: var(--accent-light);
  color: var(--accent);
}

.toggle-btn:hover {
  background: var(--accent);
  color: white;
}

.delete-btn {
  background: rgba(255, 107, 107, 0.15);
  color: var(--danger);
}

.delete-btn:hover {
  background: var(--danger);
  color: white;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .todo-item {
    padding: var(--space-sm);
    gap: var(--space-xs);
  }

  .todo-check {
    width: 20px;
    height: 20px;
  }

  .todo-check svg {
    width: 12px;
    height: 12px;
  }

  .todo-text {
    font-size: var(--font-sm);
  }

  .action-btn {
    width: 28px;
    height: 28px;
    font-size: var(--font-xs);
  }
}
</style>
