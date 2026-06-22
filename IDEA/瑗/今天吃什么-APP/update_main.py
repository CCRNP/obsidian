import os
os.makedirs('src', exist_ok=True)

main_content = '''import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')'''

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(main_content)

print('main.js updated')
