import { ref, computed, watch, onMounted } from 'vue'

const STORAGE_KEY = 'chencr_plan_todos'

export function useTodo() {
  const todos = ref([])

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        todos.value = JSON.parse(data)
      }
    } catch (e) {
      console.error('Failed to load todos from localStorage:', e)
      todos.value = []
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
    } catch (e) {
      console.error('Failed to save todos to localStorage:', e)
    }
  }

  const addTodo = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return false
    const newTodo = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString()
    }
    todos.value.push(newTodo)
    return true
  }

  const toggleTodo = (id) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const deleteTodo = (id) => {
    const index = todos.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }
  }

  const completedCount = computed(() => {
    return todos.value.filter((t) => t.completed).length
  })

  const activeCount = computed(() => {
    return todos.value.filter((t) => !t.completed).length
  })

  const totalCount = computed(() => todos.value.length)

  const clearCompleted = () => {
    todos.value = todos.value.filter((t) => !t.completed)
  }

  watch(
    todos,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  onMounted(() => {
    loadFromStorage()
  })

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    completedCount,
    activeCount,
    totalCount,
    clearCompleted
  }
}
