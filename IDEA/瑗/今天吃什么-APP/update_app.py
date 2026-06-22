import os
os.makedirs('src', exist_ok=True)

app_content = '''<template>
<div id="app">
<HomePage v-if="currentPage === 'home'" @go-wheel="currentPage = 'wheel'" @go-quiz="currentPage = 'quiz'" />
<WheelPage v-else-if="currentPage === 'wheel'" @back="currentPage = 'home'" />
<QuizPage v-else-if="currentPage === 'quiz'" @back="currentPage = 'home'" />
</div>
</template>

<script setup>
import {ref} from "vue";
import HomePage from "./views/HomePage.vue";
import WheelPage from "./views/WheelPage.vue";
import QuizPage from "./views/QuizPage.vue";
const currentPage = ref("home");
</script>

<style>
@import "./style.css";
</style>'''

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(app_content)

print('App.vue updated')
