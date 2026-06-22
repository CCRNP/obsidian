import os,sys;os.makedirs('src/views',exist_ok=True)
f=open('src/App.vue','w',encoding='utf-8')
f.write('''<template>''')
f.write('''<div class=\
app-container
no-select\>''')
f.write('''<HomePage v-if=\
currentPage===home\ @navigate=\handleNavigate\/>''')
f.write('''<WheelPage v-else-if=\
currentPage===wheel\ @back=\currentPage=home\/>''')
f.write('''<QuizPage v-else-if=\
currentPage===quiz\ @back=\currentPage=home\/>''')
f.write('''</div>''')
f.write('''</template>''')
f.write('''<script setup>''')
f.write('''import {ref,onMounted,onUnmounted} from 'vue' ''')
f.write('''import HomePage from './views/HomePage.vue' ''')
f.write('''import WheelPage from './views/WheelPage.vue' ''')
f.write('''import QuizPage from './views/QuizPage.vue' ''')
f.write('''const currentPage=ref('home') ''')
f.write('''function handleNavigate(page){currentPage.value=page} ''')
f.write('''let ti=null;onMounted(()=>{const e=document.querySelector('.shop-title');if(e){ti=setInterval(()=>{e.style.textShadow='0 0 30px rgba(200,170,100,0.08), 0 2px 4px rgba(0,0,0,0.5)';setTimeout(()=>{e.style.textShadow='0 0 20px rgba(200,170,100,0.15), 0 2px 4px rgba(0,0,0,0.5)'},300)},3000)}});onUnmounted(()=>{if(ti)clearInterval(ti)}) ''')
f.write('''</script>''')
f.close();print('App.vue created')
