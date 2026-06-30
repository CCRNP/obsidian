﻿export const FOODS = [
  { name: '火锅', color: '#E8485B' },
  { name: '烤肉', color: '#F09B4A' },
  { name: '寿司', color: '#F5CD6D' },
  { name: '拉面', color: '#5FC3E4' },
  { name: '披萨', color: '#E884B0' },
  { name: '汉堡', color: '#6B8DD6' },
  { name: '炸鸡', color: '#D4A06A' },
  { name: '麻辣烫', color: '#E86A5F' },
  { name: '日料', color: '#6FCB9B' },
  { name: '韩餐', color: '#B48AD9' },
]

export const QUIZ_DATA = [{
  id: 0,
  question: '你此刻最渴望什么味道？',
  options: [
    { label: ' 麻辣刺激', value: 'spicy' },
    { label: ' 甜蜜治愈', value: 'sweet' },
    { label: ' 咸香满足', value: 'salty' },
  ]
}, {
  id: 1,
  question: '你更想在哪样的环境里用餐？',
  options: [
    { label: ' 热闹烟火气', value: 'lively' },
    { label: ' 安静雅致', value: 'quiet' },
    { label: ' 随意放松', value: 'casual' },
  ]
}, {
  id: 2,
  question: '你愿意为美食等待多久？',
  options: [
    { label: ' 马上就得吃', value: 'immediate' },
    { label: ' 30 分钟以内', value: 'medium' },
    { label: ' 多久都行', value: 'patient' },
  ]
}, {
  id: 3,
  question: '你今天的心情是？',
  options: [
    { label: ' 元气满满', value: 'energetic' },
    { label: ' 平静慵懒', value: 'calm' },
    { label: ' 需要治愈', value: 'healing' },
  ]
}, {
  id: 4,
  question: '你更看重食物的哪一点？',
  options: [
    { label: ' 味道至上', value: 'taste' },
    { label: ' 颜值满分', value: 'looks' },
    { label: ' 性价比高', value: 'value' },
  ]
}]

export const QUIZ_SCORES = {
  spicy: { 火锅: 3, 麻辣烫: 3, 烤肉: 1, 韩餐: 1 },
  sweet: { 甜品: 3, 日料: 1, 寿司: 1 },
  salty: { 烤肉: 3, 炸鸡: 2, 拉面: 2, 韩餐: 1 },
  lively: { 火锅: 3, 烤肉: 2, 韩餐: 2, 麻辣烫: 1 },
  quiet: { 日料: 3, 寿司: 2, 拉面: 1, 西餐: 2 },
  casual: { 汉堡: 3, 披萨: 2, 炸鸡: 2, 拉面: 1 },
  immediate: { 汉堡: 3, 炸鸡: 2, 披萨: 2, 麻辣烫: 1 },
  medium: { 拉面: 2, 烤肉: 2, 韩餐: 2, 火锅: 1 },
  patient: { 火锅: 3, 日料: 3, 寿司: 2, 烤肉: 2 },
  energetic: { 火锅: 2, 烤肉: 2, 炸鸡: 2, 麻辣烫: 2 },
  calm: { 寿司: 3, 拉面: 2, 日料: 2, 汉堡: 1 },
  healing: { 甜品: 3, 拉面: 2, 炸鸡: 1, 日料: 1 },
  taste: { 火锅: 3, 烤肉: 3, 麻辣烫: 2, 拉面: 2 },
  looks: { 寿司: 3, 日料: 3, 披萨: 2, 甜品: 2 },
  value: { 汉堡: 3, 炸鸡: 2, 麻辣烫: 2, 韩餐: 2, 拉面: 1 },
}

export const ALL_FOOD_NAMES = FOODS.map(f => f.name)
export const QUIZ_FOODS = [...ALL_FOOD_NAMES, '甜品', '西餐']
export const EMOJI_MAP = {
  '火锅': '',
  '烤肉': '',
  '寿司': '',
  '拉面': '',
  '披萨': '',
  '汉堡': '',
  '炸鸡': '',
  '麻辣烫': '',
  '日料': '',
  '韩餐': '',
  '甜品': '',
  '西餐': ''
}
