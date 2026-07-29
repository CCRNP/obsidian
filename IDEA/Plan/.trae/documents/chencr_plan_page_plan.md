# ChenCR Personal Website - Plan Page Implementation

## 📋 Overview

Create a Vue 3 + Vite based personal website with a Home page and a Plan (Todo) page. The project should be extensible for future additions like /about, /gallery, etc.

---

## 🏗️ Project Structure

```
Plan/
├── index.html
├── package.json
├── vite.config.js
├── jsconfig.json
├── .gitignore
├── public/
│   └── favicon.ico
└── src/
    ├── main.js
    ├── App.vue
    ├── router/
    │   └── index.js
    ├── composables/
    │   └── useTodo.js
    ├── components/
    │   ├── AppHeader.vue
    │   ├── BackgroundCanvas.vue
    │   └── TodoItem.vue
    ├── views/
    │   ├── HomeView.vue
    │   └── PlanView.vue
    └── styles/
        ├── base.css
        └── variables.css
```

---

## 📝 Implementation Steps

### Step 1: Project Scaffolding

**Goal**: Initialize a Vite + Vue 3 project with proper configuration.

**Actions**:
- Create `package.json` with dependencies:
  - `vue` (^3.4.0)
  - `vue-router` (^4.3.0)
  - `vite` (^5.2.0)
  - `@vitejs/plugin-vue` (^5.0.0)
- Create `vite.config.js` with:
  - Vue plugin
  - Path alias `@` → `./src`
- Create `index.html` entry point
- Create `jsconfig.json` for IDE path alias support
- Create `.gitignore`

**Files to create**:
- `package.json`
- `vite.config.js`
- `index.html`
- `jsconfig.json`
- `.gitignore`

---

### Step 2: Router Setup

**Goal**: Configure Vue Router with extensible route structure.

**Actions**:
- Create `src/router/index.js`:
  - Use `createRouter` with `createWebHistory`
  - Define routes for `/` (HomeView) and `/plan` (PlanView)
  - Leave room for future routes (/about, /gallery)

**Files to create**:
- `src/router/index.js`

---

### Step 3: Styles & CSS Variables

**Goal**: Establish theme system with CSS variables and global styles.

**Actions**:
- Create `src/styles/variables.css`:
  - Define CSS custom properties for colors (--primary, --accent, --bg, --text, etc.)
  - Define spacing, border-radius, font-size variables
- Create `src/styles/base.css`:
  - Reset/normalize styles
  - Import variables.css
  - Define body, html, #app base styles
  - Typography defaults
  - Utility classes

**Files to create**:
- `src/styles/variables.css`
- `src/styles/base.css`

---

### Step 4: Composable - useTodo.js

**Goal**: Encapsulate Todo logic with localStorage persistence.

**Actions**:
- Create `src/composables/useTodo.js`:
  - Export a function that returns:
    - `todos` (ref array)
    - `addTodo(text)` function
    - `toggleTodo(id)` function
    - `deleteTodo(id)` function
    - `completedCount` computed property
  - Use `localStorage` key: `chencr_plan_todos`
  - Auto-save on every mutation via `watch`

**Files to create**:
- `src/composables/useTodo.js`

---

### Step 5: BackgroundCanvas Component

**Goal**: Animate background with requestAnimationFrame for performance.

**Actions**:
- Create `src/components/BackgroundCanvas.vue`:
  - Canvas element that fills the viewport
  - Animated particles/floating shapes with emoji/symbols
  - Use `requestAnimationFrame` with frame rate limiting (~30fps)
  - Responsive to window resize
  - Respects `prefers-reduced-motion` media query

**Files to create**:
- `src/components/BackgroundCanvas.vue`

---

### Step 6: AppHeader Component

**Goal**: Shared header with navigation buttons.

**Actions**:
- Create `src/components/AppHeader.vue`:
  - Fixed top-right positioning
  - Two buttons:
    - **Plan button** (⟡ Plan): `<router-link to="/plan">`
    - **Today's Food button** (⟡ 今天吃什么): `<a href="http://47.107.29.140:8080/" target="_blank" rel="noopener">`
  - Responsive: horizontal on desktop, vertical stack on mobile (< 600px)
  - Styled with CSS variables
  - Appears on both pages

**Files to create**:
- `src/components/AppHeader.vue`

---

### Step 7: TodoItem Component

**Goal**: Individual todo item with toggle and delete.

**Actions**:
- Create `src/components/TodoItem.vue`:
  - Props: `todo` (object with id, text, completed)
  - Emits: `toggle`, `delete`
  - Left: checkbox/complete indicator
  - Middle: todo text (strikethrough when completed)
  - Right: toggle button and delete button
  - Smooth animations for state changes

**Files to create**:
- `src/components/TodoItem.vue`

---

### Step 8: HomeView Page

**Goal**: Home page with "ChenCR" and two action buttons.

**Actions**:
- Create `src/views/HomeView.vue`:
  - Large centered "ChenCR" text
  - 😋 emoji with playful animation (bounce, wiggle, or float)
  - Use CSS animation for the emoji effect
  - Import/use AppHeader component for top-right buttons
  - Welcome subtitle or tagline

**Files to create**:
- `src/views/HomeView.vue`

---

### Step 9: PlanView Page

**Goal**: Full-featured Todo list page.

**Actions**:
- Create `src/views/PlanView.vue`:
  - Back button (<) in top-left corner linking to `/`
  - Title: "📋 My Plan" with 😋 accent
  - Input field + "添加" button for new todos
  - List of TodoItem components
  - Empty state message when no todos
  - Filter/count display (optional)
  - Use `useTodo()` composable for state management
  - Responsive layout (max-width container)

**Files to create**:
- `src/views/PlanView.vue`

---

### Step 10: App.vue & main.js

**Goal**: Wire everything together.

**Actions**:
- Update `src/main.js`:
  - Create Vue app
  - Install router
  - Import and use base.css
  - Mount to #app
- Update `src/App.vue`:
  - Include BackgroundCanvas
  - Include RouterView
  - Layout wrapper with proper positioning

**Files to create/update**:
- `src/main.js`
- `src/App.vue`

---

### Step 11: Install & Test

**Actions**:
- Run `npm install` to install all dependencies
- Run `npm run dev` to start development server
- Verify:
  - Home page shows ChenCR and two buttons
  - Plan page shows todo functionality
  - localStorage persistence works
  - Responsive design works on different screen sizes
  - Background animation is smooth and performant

---

## 🎨 Design Decisions

### Color Scheme (CSS Variables)
- `--primary`: #6C5CE7 (purple - playful/creative)
- `--accent`: #00B894 (teal - freshness)
- `--bg`: #0F0F1A (dark background)
- `--bg-light`: #1A1A2E (card/panel background)
- `--text`: #E8E8F0 (primary text)
- `--text-muted`: #9E9EB8 (secondary text)
- `--success`: #00B894
- `--danger`: #FF6B6B
- `--border`: rgba(255,255,255,0.1)

### Typography
- System font stack with sans-serif fallback
- Large heading for "ChenCR" (4rem+)
- Comfortable body text (1rem/16px)

### Spacing
- Base unit: 8px
- Common: 8, 12, 16, 24, 32, 48px

### Breakpoints
- Mobile: < 600px (vertical buttons, single column)
- Tablet: 600px - 1024px
- Desktop: > 1024px

---

## ⚠️ Risk & Considerations

1. **External Link**: The `http://47.107.29.140:8080/` link must open in a new tab with `target="_blank"` and `rel="noopener"` for security.

2. **localStorage Limits**: ~5MB capacity. Todos are small so this is fine, but worth noting.

3. **Frame Rate**: Background canvas should cap at 30fps to save CPU/battery. Use a delta-time accumulator approach.

4. **Accessibility**: Ensure proper ARIA labels for interactive elements, keyboard navigation support, and sufficient color contrast.

5. **Future Extensibility**: The router structure should easily allow adding `/about` and `/gallery` routes later.

---

## ✅ Success Criteria

- [ ] `npm run dev` starts without errors
- [ ] Home page displays "ChenCR" with 😋 animation
- [ ] Both header buttons work (internal navigation + external link)
- [ ] Plan page has working todo CRUD operations
- [ ] Todo data persists after page refresh
- [ ] Responsive design works at all screen sizes
- [ ] Background animation uses requestAnimationFrame and is performant
- [ ] Code is clean and follows Vue 3 Composition API patterns
- [ ] CSS variables are used for theming
- [ ] Project structure is ready for future route additions
