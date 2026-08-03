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

      <!-- 分类管理 -->
      <div class="category-section">
        <div class="category-tabs">
          <button
            class="category-tab"
            :class="{ active: activeCategory === 'all' }"
            @click="activeCategory = 'all'"
          >
            全部
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="category-tab"
            :class="{ active: activeCategory === cat.id }"
            :style="{ borderColor: cat.color }"
            @click="activeCategory = cat.id"
          >
            <span class="category-dot" :style="{ background: cat.color }"></span>
            {{ cat.name }}
            <button
              v-if="cat.id !== 'default'"
              class="category-delete"
              @click.stop="deleteCategory(cat.id)"
              title="删除分类"
            >
              ×
            </button>
          </button>
          <button class="category-tab add-category" @click="showAddCategory = !showAddCategory">
            + 新分类
          </button>
        </div>

        <div v-if="showAddCategory" class="add-category-form">
          <input
            v-model="newCategoryName"
            type="text"
            class="category-input"
            placeholder="分类名称"
            @keyup.enter="handleAddCategory"
          />
          <div class="color-picker">
            <button
              v-for="color in colorOptions"
              :key="color"
              class="color-option"
              :style="{ background: color }"
              :class="{ selected: selectedColor === color }"
              @click="selectedColor = color"
            ></button>
          </div>
          <button class="category-add-btn" @click="handleAddCategory">添加</button>
        </div>
      </div>

      <!-- 任务输入 -->
      <div class="todo-input-section">
        <form @submit.prevent="handleAdd" class="todo-form">
          <input
            v-model="newTodoText"
            type="text"
            class="todo-input"
            placeholder="添加新的待办事项..."
            aria-label="新待办内容"
          />
          <select v-model="selectedCategoryId" class="category-select">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <button type="submit" class="add-btn" :disabled="!newTodoText.trim()">
            添加
          </button>
        </form>
      </div>

      <!-- 统计 -->
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

      <!-- 任务列表 -->
      <div class="todo-list" v-if="filteredTodos.length > 0">
        <TransitionGroup name="list" tag="div" class="todo-list-inner">
          <TodoItem
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
            :categoryName="getCategoryName(todo.categoryId)"
            :categoryColor="getCategoryColor(todo.categoryId)"
            @toggle="toggleTodo"
            @delete="deleteTodo"
          />
        </TransitionGroup>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">📝</div>
        <p class="empty-text">{{ activeCategory === 'all' ? '还没有待办事项' : '该分类下暂无任务' }}</p>
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
const newCategoryName = ref('')
const selectedCategoryId = ref('default')
const selectedColor = ref('#6C5CE7')
const showAddCategory = ref(false)

const colorOptions = [
  '#6C5CE7',
  '#00B894',
  '#FDCB6E',
  '#FF6B6B',
  '#00CEC9',
  '#FD79A8',
  '#A29BFE',
  '#74B9FF'
]

const {
  categories,
  filteredTodos,
  activeCategory,
  addCategory,
  deleteCategory,
  addTodo,
  toggleTodo,
  deleteTodo,
  completedCount,
  activeCount,
  totalCount,
  clearCompleted,
  getCategoryName,
  getCategoryColor
} = useTodo()

const handleAdd = () => {
  const success = addTodo(newTodoText.value, selectedCategoryId.value)
  if (success) {
    newTodoText.value = ''
  }
}

const handleAddCategory = () => {
  if (addCategory(newCategoryName.value, selectedColor.value)) {
    newCategoryName.value = ''
    showAddCategory.value = false
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

/* 分类管理 */
.category-section {
  margin-bottom: var(--space-lg);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.category-tab {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-tab:hover {
  background: var(--bg-lighter);
  color: var(--text);
}

.category-tab.active {
  background: var(--primary-light);
  color: var(--text);
  border-color: var(--primary);
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-delete {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text-dim);
  font-size: 14px;
  border-radius: 50%;
  margin-left: var(--space-xs);
}

.category-delete:hover {
  background: var(--danger);
  color: white;
}

.add-category {
  border-style: dashed;
  color: var(--primary);
}

.add-category:hover {
  border-style: solid;
}

.add-category-form {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  padding: var(--space-sm);
  background: var(--bg-light);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
}

.category-input {
  flex: 1;
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: var(--font-sm);
}

.color-picker {
  display: flex;
  gap: var(--space-xs);
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: white;
  transform: scale(1.15);
}

.category-add-btn {
  padding: var(--space-xs) var(--space-md);
  background: var(--primary);
  color: white;
  font-size: var(--font-sm);
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-add-btn:hover {
  background: var(--primary-hover);
}

/* 任务输入 */
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

.category-select {
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-light);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  font-size: var(--font-sm);
  cursor: pointer;
  min-width: 100px;
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

/* 统计 */
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

/* 任务列表 */
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

  .category-select {
    width: 100%;
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

  .category-tabs {
    gap: var(--space-xs);
  }

  .category-tab {
    font-size: var(--font-xs);
    padding: var(--space-xs);
  }

  .add-category-form {
    flex-direction: column;
    align-items: stretch;
  }

  .color-picker {
    justify-content: center;
  }

  .category-add-btn {
    width: 100%;
  }
}
</style>