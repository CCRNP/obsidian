f=open('src/views/WheelPage.vue','w',encoding='utf-8')
f.write('''<template>''')
f.write('''<div class=\
page
active\ id=\page-wheel\>''')
f.write('''<div class=\
back-row\><button class=\back-btn\ @click=\
back
\><span class=\icon\></span><span class=\label\>返回魔法店</span></button><span class=\back-right\> 魔力轮盘</span></div>''')
f.write('''<div class=\
page-title\><div class=\main\>转盘抽签</div><div class=\sub\>不用再纠结了</div></div>''')
f.write('''<div class=\
page-desc\>转一下，指针停在哪，今天就吃哪。</div>''')
f.write('''<div class=\
wheel-wrapper\><canvas ref=\wheelCanvas\ width=\600\ height=\600\></canvas><div class=\pointer-overlay\><div class=\pointer\></div><div class=\center-dot\></div></div></div>''')
f.write('''<div class=\
wheel-controls\><button class=\spin-btn\ :disabled=\isSpinning\ @click=\spinWheel\> 转一下</button><div class=\result-text\ v-html=\wheelResult\></div></div>''')
f.write('''<div class=\
wheel-bottom-links\><button @click=\
back
\>换一种方式</button><button @click=\
back
\>返回魔法店</button></div>''')
f.write('''<div class=\
footer-note\ style=\margin-top:6px\>轮盘已注入魔力，转到哪算哪</div>''')
f.write('''</div></template>''')
f.write('''<script setup>''')
f.write('''import {ref,onMounted,onUnmounted} from 'vue';import {FOODS} from '../data/foods';defineEmits(['back']);''')
f.write('''const wheelCanvas=ref(null);const wheelResult=ref(' 等你转动');const isSpinning=ref(false);let wheelAngle=0;''')
f.write('''const N=FOODS.length;const sectorAngle=(2*Math.PI)/N;''')
f.write('''function drawWheel(rotation){const canvas=wheelCanvas.value;if(!canvas)return;const ctx=canvas.getContext('2d');const w=canvas.width;const h=canvas.height;const cx=w/2;const cy=h/2;const r=Math.min(w,h)*0.42;ctx.clearRect(0,0,w,h);for(let i=0;i<N;i++){const start=i*sectorAngle+rotation;const end=start+sectorAngle;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,end);ctx.closePath();ctx.fillStyle=FOODS[i].color;ctx.fill();ctx.strokeStyle='rgba(20,16,30,0.3)';ctx.lineWidth=2;ctx.stroke();const mid=start+sectorAngle/2;const textR=r*0.68;const tx=cx+Math.cos(mid)*textR;const ty=cy+Math.sin(mid)*textR;ctx.save();ctx.translate(tx,ty);ctx.rotate(mid+(mid>Math.PI/2?Math.PI:0));ctx.fillStyle='#fff';ctx.font='bold 20px PingFang SC,Hiragino Sans GB,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=8;ctx.fillText(FOODS[i].name,0,0);ctx.restore();}ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.strokeStyle='rgba(200,170,130,0.2)';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r*0.12,0,2*Math.PI);ctx.fillStyle='rgba(20,16,30,0.5)';ctx.fill();ctx.strokeStyle='rgba(200,170,130,0.15)';ctx.lineWidth=1.5;ctx.stroke();}''')
f.write('''function getFoodFromAngle(rotation){const pointerAngle=-Math.PI/2;let localAngle=pointerAngle-rotation;localAngle=((localAngle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);const idx=Math.floor(localAngle/sectorAngle)%N;return idx;}''')
f.write('''function spinWheel(){if(isSpinning.value)return;isSpinning.value=true;wheelResult.value=' 转盘旋转中...';const targetRotation=wheelAngle+4*2*Math.PI+(Math.random()*2*Math.PI);const duration=3000+Math.random()*1200;const startTime=performance.now();const startAngle=wheelAngle;function animate(time){const elapsed=time-startTime;const progress=Math.min(elapsed/duration,1);const ease=1-Math.pow(1-progress,4);const currentAngle=startAngle+(targetRotation-startAngle)*ease;drawWheel(currentAngle);if(progress<1){requestAnimationFrame(animate);}else{wheelAngle=targetRotation;const idx=getFoodFromAngle(wheelAngle);const food=FOODS[idx].name;wheelResult.value=' 今天吃 <span class=\
food-name\>'+food+'</span> ';isSpinning.value=false;}}requestAnimationFrame(animate);}''')
f.write('''function handleResize(){};onMounted(()=>{drawWheel(0);window.addEventListener('resize',handleResize);});onUnmounted(()=>{window.removeEventListener('resize',handleResize);});''')
f.write('''</script>''')
f.close();print('WheelPage.vue created')
