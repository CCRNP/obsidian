<template><div class=page
active\ id=\page-home\><div class=shop-title\> 霖雨魔法店 <span class=\sub\> 美食占卜部 </span></div><div class=hero\><div class=ig-title\><span class=\highlight\>今天</span>吃什么</div><div class=\desc\>站在外卖软件前纠结了二十分钟？<br/>把这个难题交给<em>魔法店</em>吧。</div></div><div class=feature-grid\><div class=feature-card
wheel-card\ @click=navigate
wheel
\><div class=icon-box\></div><div class=\info\><div class=
ame\>转盘抽签 <span class=adge\> 命运</span></div><div class=\hint\>转一转，停在哪吃哪</div></div><div class=rrow\></div></div><div class=feature-card
quiz-card\ @click=navigate
quiz
\><div class=icon-box\></div><div class=\info\><div class=
ame\>灵魂问答 <span class=adge\> 洞察</span></div><div class=\hint\>答 5 个问题，看穿你的胃</div></div><div class=rrow\></div></div></div><div class=footer-note\>结果由店里的老魔法决定  概不退换</div></div></template><script setup>defineEmits(['navigate'])</script><style scoped>.hero .big-title{font-size:42px;font-weight:800;color:#f0e0c8;text-shadow:0 0 40px rgba(200,170,100,0.15),0 4px 20px rgba(0,0,0,0.4);letter-spacing:4px;line-height:1.2;}.hero .big-title .highlight{background:linear-gradient(135deg,#f5e6c8,#d4b896);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}.hero .desc{color:#a09080;font-size:14px;line-height:1.7;margin-top:10px;padding:0 4px;letter-spacing:0.5px;}.hero .desc em{color:#d4b896;font-style:normal;}</style>