import { ref, computed, watch, onMounted } from 'vue'

const STORAGE_KEY = 'chencr_plan_data'

const DEFAULT_CATEGORIES = [
  { id: 'default', name: '默认', color: '#6C5CE7' }
]

export function useTodo() {
  const categories = ref([...DEFAULT_CATEGORIES])
  const todos = ref([])
  const activeCategory = ref('all')

  const loadData = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        categories.value = parsed.categories?.length > 0 ? parsed.categories : [...DEFAULT_CATEGORIES]
        todos.value = parsed.todos || []
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e)
      categories.value = [...DEFAULT_CATEGORIES]
      todos.value = []
    }
  }

  const saveData = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        categories: categories.value,
        todos: todos.value
      }))
    } catch (e) {
      console.error('Failed to save data to localStorage:', e)
    }
  }

  const sortedTodos = computed(() => {
    const active = todos.value.filter(t => !t.completed)
    const completed = todos.value.filter(t => t.completed)
    return [...active, ...completed]
  })

  const filteredTodos = computed(() => {
    if (activeCategory.value === 'all') {
      return sortedTodos.value
    }
    return sortedTodos.value.filter(t => t.categoryId === activeCategory.value)
  })

  const addCategory = (name, color = '#6C5CE7') => {
    const trimmed = name.trim()
    if (!trimmed) return false
    const newCategory = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: trimmed,
      color: color
    }
    categories.value.push(newCategory)
    return true
  }

  const deleteCategory = (categoryId) => {
    if (categoryId === 'default') return false
    const index = categories.value.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      categories.value.splice(index, 1)
      todos.value = todos.value.map(t => {
        if (t.categoryId === categoryId) {
          return { ...t, categoryId: 'default' }
        }
        return t
      })
      if (activeCategory.value === categoryId) {
        activeCategory.value = 'all'
      }
      return true
    }
    return false
  }

  const updateCategory = (categoryId, updates) => {
    const category = categories.value.find(c => c.id === categoryId)
    if (category) {
      Object.assign(category, updates)
      return true
    }
    return false
  }

  const addTodo = (text, categoryId = 'default') => {
    const trimmed = text.trim()
    if (!trimmed) return false
    const newTodo = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      text: trimmed,
      completed: false,
      categoryId: categoryId,
      createdAt: new Date().toISOString()
    }
    todos.value.unshift(newTodo)
    return newTodo.id
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

  const updateTodoCategory = (todoId, categoryId) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (todo) {
      todo.categoryId = categoryId
      return true
    }
    return false
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

  const getCategoryById = (id) => {
    return categories.value.find(c => c.id === id)
  }

  const getCategoryName = (id) => {
    const category = getCategoryById(id)
    return category?.name || '未分类'
  }

  const getCategoryColor = (id) => {
    const category = getCategoryById(id)
    return category?.color || '#6C5CE7'
  }

  watch(
    [categories, todos],
    () => {
      saveData()
    },
    { deep: true }
  )

  onMounted(() => {
    loadData()
  })

  return {
    categories,
    todos,
    filteredTodos,
    activeCategory,
    addCategory,
    deleteCategory,
    updateCategory,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoCategory,
    completedCount,
    activeCount,
    totalCount,
    clearCompleted,
    getCategoryById,
    getCategoryName,
    getCategoryColor
  }
}