<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>今天吃什么</title>
    <style>
        /* ========== 全局重置 & 基础 ========== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
            background: #0a0817;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px;
            background-image:
                radial-gradient(ellipse at 20% 50%, rgba(88, 42, 120, 0.35) 0%, transparent 70%),
                radial-gradient(ellipse at 80% 20%, rgba(120, 60, 160, 0.25) 0%, transparent 60%),
                radial-gradient(ellipse at 50% 100%, rgba(60, 30, 90, 0.4) 0%, transparent 50%);
        }

        /* ========== 手机容器 ========== */
        .app-container {
            width: 100%;
            max-width: 420px;
            min-height: 780px;
            background: linear-gradient(165deg, #14101f 0%, #1c1530 40%, #20183a 70%, #16102a 100%);
            border-radius: 36px;
            padding: 24px 20px 18px;
            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.8),
                inset 0 1px 0 rgba(255, 215, 150, 0.08),
                0 0 80px rgba(120, 60, 200, 0.12);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(200, 170, 120, 0.12);
            transition: all 0.3s;
        }

        /* 装饰光晕 */
        .app-container::before {
            content: '';
            position: absolute;
            top: -60px;
            right: -60px;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(200, 160, 80, 0.06) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }
        .app-container::after {
            content: '';
            position: absolute;
            bottom: -40px;
            left: -40px;
            width: 160px;
            height: 160px;
            background: radial-gradient(circle, rgba(160, 100, 200, 0.05) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        /* ========== 页面容器 ========== */
        .page {
            display: none;
            flex-direction: column;
            height: 100%;
            min-height: 720px;
            position: relative;
            z-index: 2;
            animation: fadeUp 0.4s ease-out;
        }
        .page.active {
            display: flex;
        }

        @keyframes fadeUp {
            0% {
                opacity: 0;
                transform: translateY(18px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* ========== 通用组件 ========== */
        /* 标题 */
        .shop-title {
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            color: #e8d5b0;
            letter-spacing: 6px;
            text-shadow: 0 0 20px rgba(200, 170, 100, 0.15), 0 2px 4px rgba(0, 0, 0, 0.5);
            position: relative;
            padding-bottom: 6px;
        }
        .shop-title .sub {
            display: block;
            font-size: 11px;
            font-weight: 400;
            color: #b8a08a;
            letter-spacing: 8px;
            margin-top: 2px;
            opacity: 0.7;
        }
        .shop-title .deco {
            display: inline-block;
            color: #c9a87c;
            font-size: 14px;
            letter-spacing: 2px;
        }

        /* 返回按钮（通用） */
        .back-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0 14px;
            border-bottom: 1px solid rgba(200, 170, 130, 0.08);
            margin-bottom: 16px;
        }
        .back-btn {
            background: none;
            border: none;
            color: #b8a08a;
            font-size: 13px;
            letter-spacing: 2px;
            padding: 6px 8px;
            cursor: pointer;
            transition: all 0.25s;
            display: flex;
            align-items: center;
            gap: 4px;
            font-family: inherit;
        }
        .back-btn:hover {
            color: #e8d5b0;
        }
        .back-btn .icon {
            font-size: 16px;
        }
        .back-btn .label {
            font-size: 12px;
        }
        .back-right {
            color: #7a6a5a;
            font-size: 10px;
            letter-spacing: 1px;
            opacity: 0.5;
        }

        /* 底部信息 */
        .footer-note {
            text-align: center;
            color: #5a4a3a;
            font-size: 10px;
            letter-spacing: 2px;
            padding-top: 14px;
            margin-top: auto;
            border-top: 1px solid rgba(200, 170, 130, 0.06);
            opacity: 0.6;
            font-weight: 300;
        }

        /* ========== 首页 ========== */
        #page-home .hero {
            text-align: center;
            padding: 10px 0 6px;
        }
        #page-home .hero .big-title {
            font-size: 42px;
            font-weight: 800;
            color: #f0e0c8;
            text-shadow: 0 0 40px rgba(200, 170, 100, 0.15), 0 4px 20px rgba(0, 0, 0, 0.4);
            letter-spacing: 4px;
            line-height: 1.2;
        }
        #page-home .hero .big-title .highlight {
            background: linear-gradient(135deg, #f5e6c8, #d4b896);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        #page-home .hero .desc {
            color: #a09080;
            font-size: 14px;
            line-height: 1.7;
            margin-top: 10px;
            padding: 0 4px;
            letter-spacing: 0.5px;
        }
        #page-home .hero .desc em {
            color: #d4b896;
            font-style: normal;
        }

        /* 功能卡片 */
        .feature-grid {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 26px;
            flex: 1;
            justify-content: center;
            padding: 4px 0;
        }
        .feature-card {
            background: linear-gradient(145deg, rgba(40, 30, 55, 0.7), rgba(25, 18, 40, 0.85));
            border-radius: 20px;
            padding: 22px 24px;
            border: 1px solid rgba(200, 170, 130, 0.10);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 215, 150, 0.04);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            display: flex;
            align-items: center;
            gap: 18px;
            position: relative;
            overflow: hidden;
        }
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(200, 170, 130, 0.04), transparent 60%);
            pointer-events: none;
        }
        .feature-card:active {
            transform: scale(0.97);
            border-color: rgba(200, 170, 130, 0.20);
        }
        .feature-card .icon-box {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            flex-shrink: 0;
            background: rgba(200, 170, 130, 0.06);
            border: 1px solid rgba(200, 170, 130, 0.08);
        }
        .feature-card .info {
            flex: 1;
        }
        .feature-card .info .name {
            font-size: 18px;
            font-weight: 700;
            color: #e8d5b0;
            letter-spacing: 2px;
        }
        .feature-card .info .name .badge {
            font-size: 11px;
            font-weight: 400;
            color: #9a8a7a;
            letter-spacing: 1px;
            margin-left: 8px;
        }
        .feature-card .info .hint {
            font-size: 12px;
            color: #8a7a6a;
            margin-top: 2px;
            letter-spacing: 0.5px;
        }
        .feature-card .arrow {
            color: #6a5a4a;
            font-size: 18px;
            opacity: 0.4;
        }

        .feature-card.wheel-card .icon-box {
            background: rgba(200, 160, 80, 0.08);
            border-color: rgba(200, 160, 80, 0.12);
        }
        .feature-card.quiz-card .icon-box {
            background: rgba(160, 100, 200, 0.08);
            border-color: rgba(160, 100, 200, 0.12);
        }

        /* ========== 转盘页面 ========== */
        #page-wheel .page-title {
            text-align: center;
            padding: 2px 0 4px;
        }
        #page-wheel .page-title .main {
            font-size: 26px;
            font-weight: 700;
            color: #e8d5b0;
            letter-spacing: 4px;
        }
        #page-wheel .page-title .sub {
            font-size: 14px;
            color: #a09080;
            letter-spacing: 3px;
            margin-top: 2px;
        }
        #page-wheel .page-desc {
            text-align: center;
            font-size: 13px;
            color: #8a7a6a;
            letter-spacing: 0.5px;
            padding: 0 4px;
            margin-bottom: 12px;
            line-height: 1.5;
        }

        /* 转盘容器 */
        .wheel-wrapper {
            position: relative;
            width: 100%;
            max-width: 320px;
            margin: 0 auto;
            aspect-ratio: 1/1;
        }
        .wheel-wrapper canvas {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 50%;
            box-shadow: 0 0 40px rgba(120, 60, 200, 0.15), 0 8px 40px rgba(0, 0, 0, 0.5);
            background: #1a1428;
            touch-action: none;
        }

        /* 指针（纯CSS覆盖在canvas上方） */
        .pointer-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 3;
        }
        .pointer-overlay .pointer {
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 14px solid transparent;
            border-right: 14px solid transparent;
            border-top: 28px solid #f0d8b0;
            filter: drop-shadow(0 2px 12px rgba(200, 170, 100, 0.5));
        }
        .pointer-overlay .pointer::after {
            content: '';
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 10px;
            background: #f0d8b0;
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(200, 170, 100, 0.4);
        }
        .pointer-overlay .center-dot {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background: radial-gradient(circle, #f0e0c8, #c9a87c);
            border-radius: 50%;
            box-shadow: 0 0 30px rgba(200, 170, 100, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(40, 30, 55, 0.6);
        }

        /* 转盘控制 */
        .wheel-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            margin-top: 16px;
        }
        .wheel-controls .spin-btn {
            background: linear-gradient(145deg, #c9a87c, #b0885a);
            border: none;
            border-radius: 40px;
            padding: 14px 48px;
            font-size: 18px;
            font-weight: 700;
            color: #1c1530;
            letter-spacing: 4px;
            cursor: pointer;
            box-shadow: 0 6px 24px rgba(200, 170, 100, 0.25), inset 0 1px 0 rgba(255, 215, 150, 0.3);
            transition: all 0.3s;
            font-family: inherit;
            touch-action: manipulation;
            min-width: 160px;
        }
        .wheel-controls .spin-btn:active {
            transform: scale(0.95);
            box-shadow: 0 2px 12px rgba(200, 170, 100, 0.15);
        }
        .wheel-controls .spin-btn:disabled {
            opacity: 0.5;
            transform: scale(0.97);
            pointer-events: none;
        }
        .wheel-controls .result-text {
            font-size: 20px;
            font-weight: 700;
            color: #f0e0c8;
            min-height: 36px;
            letter-spacing: 2px;
            text-shadow: 0 0 30px rgba(200, 170, 100, 0.15);
        }
        .wheel-controls .result-text .food-name {
            background: linear-gradient(135deg, #f5e6c8, #d4b896);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .wheel-bottom-links {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 8px;
        }
        .wheel-bottom-links button {
            background: none;
            border: none;
            color: #8a7a6a;
            font-size: 13px;
            letter-spacing: 2px;
            cursor: pointer;
            font-family: inherit;
            padding: 6px 10px;
            transition: color 0.25s;
        }
        .wheel-bottom-links button:hover {
            color: #e8d5b0;
        }

        /* ========== 问答页面 ========== */
        #page-quiz .page-title {
            text-align: center;
            padding: 2px 0 4px;
        }
        #page-quiz .page-title .main {
            font-size: 26px;
            font-weight: 700;
            color: #e8d5b0;
            letter-spacing: 4px;
        }
        #page-quiz .page-title .sub {
            font-size: 14px;
            color: #a09080;
            letter-spacing: 3px;
            margin-top: 2px;
        }

        .quiz-progress {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 10px 0 16px;
        }
        .quiz-progress .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(200, 170, 130, 0.15);
            transition: all 0.4s;
            border: 1px solid rgba(200, 170, 130, 0.05);
        }
        .quiz-progress .dot.active {
            background: #c9a87c;
            box-shadow: 0 0 16px rgba(200, 170, 100, 0.3);
            border-color: #c9a87c;
        }
        .quiz-progress .dot.done {
            background: rgba(200, 170, 130, 0.3);
        }

        .quiz-question {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 4px 0 8px;
        }
        .quiz-question .q-text {
            font-size: 20px;
            font-weight: 600;
            color: #f0e0c8;
            line-height: 1.5;
            padding: 8px 0 16px;
            letter-spacing: 0.5px;
            text-align: center;
        }
        .quiz-question .q-text .q-num {
            font-size: 14px;
            color: #8a7a6a;
            font-weight: 400;
            display: block;
            margin-bottom: 6px;
            letter-spacing: 2px;
        }

        .quiz-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 1;
            justify-content: center;
            padding: 4px 0;
        }
        .quiz-options .opt-btn {
            background: rgba(40, 30, 55, 0.6);
            border: 1px solid rgba(200, 170, 130, 0.08);
            border-radius: 16px;
            padding: 16px 20px;
            font-size: 16px;
            color: #d8c8b8;
            cursor: pointer;
            transition: all 0.25s;
            font-family: inherit;
            text-align: left;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        }
        .quiz-options .opt-btn:active {
            transform: scale(0.97);
            background: rgba(60, 45, 80, 0.7);
            border-color: rgba(200, 170, 130, 0.2);
        }
        .quiz-options .opt-btn .opt-label {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(200, 170, 130, 0.06);
            text-align: center;
            line-height: 24px;
            font-size: 12px;
            color: #9a8a7a;
            margin-right: 12px;
            border: 1px solid rgba(200, 170, 130, 0.06);
        }

        /* 问答结果 */
        .quiz-result-box {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px 0;
            text-align: center;
        }
        .quiz-result-box .big-icon {
            font-size: 56px;
            margin-bottom: 12px;
        }
        .quiz-result-box .result-name {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(135deg, #f5e6c8, #d4b896);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 4px;
        }
        .quiz-result-box .result-desc {
            color: #a09080;
            font-size: 14px;
            margin-top: 8px;
            letter-spacing: 1px;
        }
        .quiz-result-box .result-sub {
            color: #7a6a5a;
            font-size: 12px;
            margin-top: 4px;
            letter-spacing: 0.5px;
        }
        .quiz-result-box .restart-btn {
            margin-top: 24px;
            background: linear-gradient(145deg, #c9a87c, #b0885a);
            border: none;
            border-radius: 40px;
            padding: 12px 40px;
            font-size: 16px;
            font-weight: 700;
            color: #1c1530;
            letter-spacing: 3px;
            cursor: pointer;
            font-family: inherit;
            box-shadow: 0 4px 20px rgba(200, 170, 100, 0.2);
            transition: all 0.3s;
        }
        .quiz-result-box .restart-btn:active {
            transform: scale(0.95);
        }

        /* ========== 响应式微调 ========== */
        @media (max-width: 420px) {
            .app-container {
                padding: 18px 14px 14px;
                border-radius: 28px;
                min-height: 700px;
            }
            #page-home .hero .big-title {
                font-size: 34px;
            }
            .feature-card {
                padding: 18px 18px;
            }
            .feature-card .icon-box {
                width: 44px;
                height: 44px;
                font-size: 22px;
            }
            .feature-card .info .name {
                font-size: 16px;
            }
            .wheel-wrapper {
                max-width: 260px;
            }
            .quiz-question .q-text {
                font-size: 18px;
            }
            .quiz-options .opt-btn {
                padding: 14px 16px;
                font-size: 15px;
            }
            .shop-title {
                font-size: 16px;
                letter-spacing: 4px;
            }
            .wheel-controls .spin-btn {
                padding: 12px 32px;
                font-size: 16px;
                min-width: 130px;
            }
            #page-wheel .page-title .main {
                font-size: 22px;
            }
            #page-quiz .page-title .main {
                font-size: 22px;
            }
        }

        @media (max-width: 360px) {
            .app-container {
                padding: 12px 10px 10px;
                min-height: 620px;
                border-radius: 20px;
            }
            #page-home .hero .big-title {
                font-size: 28px;
            }
            .feature-card {
                padding: 14px 14px;
                gap: 12px;
            }
            .feature-card .icon-box {
                width: 38px;
                height: 38px;
                font-size: 18px;
            }
            .feature-card .info .name {
                font-size: 14px;
            }
            .feature-card .info .hint {
                font-size: 10px;
            }
            .wheel-wrapper {
                max-width: 200px;
            }
            .pointer-overlay .pointer {
                border-left-width: 10px;
                border-right-width: 10px;
                border-top-width: 20px;
                top: -2px;
            }
            .pointer-overlay .pointer::after {
                width: 6px;
                height: 6px;
                top: -22px;
            }
            .pointer-overlay .center-dot {
                width: 12px;
                height: 12px;
            }
            .quiz-question .q-text {
                font-size: 16px;
            }
            .quiz-options .opt-btn {
                padding: 12px 14px;
                font-size: 13px;
            }
        }

        /* ========== 滚动条美化 ========== */
        .app-container ::-webkit-scrollbar {
            width: 3px;
        }
        .app-container ::-webkit-scrollbar-track {
            background: transparent;
        }
        .app-container ::-webkit-scrollbar-thumb {
            background: rgba(200, 170, 130, 0.2);
            border-radius: 10px;
        }

        /* 禁用文本选择 */
        .no-select {
            user-select: none;
            -webkit-user-select: none;
        }
    </style>
</head>
<body>

    <div class="app-container no-select" id="app">

        <!-- ============ 首页 ============ -->
        <div class="page active" id="page-home">
            <div class="shop-title">
                ✦ 霖雨魔法店 ✦
                <span class="sub">⸺ 美食占卜部 ⸺</span>
            </div>

            <div class="hero">
                <div class="big-title">
                    <span class="highlight">今天</span>吃什么
                </div>
                <div class="desc">
                    站在外卖软件前纠结了二十分钟？<br />
                    把这个难题交给<em>魔法店</em>吧。
                </div>
            </div>

            <div class="feature-grid">
                <!-- 转盘抽签 -->
                <div class="feature-card wheel-card" id="goWheel">
                    <div class="icon-box">🎡</div>
                    <div class="info">
                        <div class="name">转盘抽签 <span class="badge">✦ 命运</span></div>
                        <div class="hint">转一转，停在哪吃哪</div>
                    </div>
                    <div class="arrow">›</div>
                </div>

                <!-- 灵魂问答 -->
                <div class="feature-card quiz-card" id="goQuiz">
                    <div class="icon-box">🔮</div>
                    <div class="info">
                        <div class="name">灵魂问答 <span class="badge">✦ 洞察</span></div>
                        <div class="hint">答 5 个问题，看穿你的胃</div>
                    </div>
                    <div class="arrow">›</div>
                </div>
            </div>

            <div class="footer-note">
                结果由店里的老魔法决定 · 概不退换
            </div>
        </div>

        <!-- ============ 转盘页面 ============ -->
        <div class="page" id="page-wheel">
            <div class="back-row">
                <button class="back-btn" id="wheelBack">
                    <span class="icon">←</span>
                    <span class="label">返回魔法店</span>
                </button>
                <span class="back-right">✦ 魔力轮盘</span>
            </div>

            <div class="page-title">
                <div class="main">转盘抽签</div>
                <div class="sub">不用再纠结了</div>
            </div>
            <div class="page-desc">
                转一下，指针停在哪，今天就吃哪。
            </div>

            <div class="wheel-wrapper">
                <canvas id="wheelCanvas" width="600" height="600"></canvas>
                <div class="pointer-overlay">
                    <div class="pointer"></div>
                    <div class="center-dot"></div>
                </div>
            </div>

            <div class="wheel-controls">
                <button class="spin-btn" id="spinBtn">✦ 转一下</button>
                <div class="result-text" id="wheelResult">✨ 等你转动</div>
            </div>

            <div class="wheel-bottom-links">
                <button id="wheelChangeWay">换一种方式</button>
                <button id="wheelBack2">返回魔法店</button>
            </div>

            <div class="footer-note" style="margin-top:6px;">
                轮盘已注入魔力，转到哪算哪
            </div>
        </div>

        <!-- ============ 问答页面 ============ -->
        <div class="page" id="page-quiz">
            <div class="back-row">
                <button class="back-btn" id="quizBack">
                    <span class="icon">←</span>
                    <span class="label">返回魔法店</span>
                </button>
                <span class="back-right">✦ 灵魂占卜</span>
            </div>

            <div class="page-title">
                <div class="main">灵魂问答</div>
                <div class="sub">答 5 个问题，看穿你的胃</div>
            </div>

            <div class="quiz-progress" id="quizProgress">
                <span class="dot active"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>

            <div class="quiz-question" id="quizQuestionArea">
                <!-- 由 JS 动态渲染 -->
            </div>

            <div class="footer-note" style="margin-top:6px;">
                答案将指引你走向今日之食
            </div>
        </div>

    </div>

    <script>
        // ============================================================
        //  数据
        // ============================================================

        // 转盘食物（10种）
        const FOODS = [
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
        ];

        // 问答数据
        const QUIZ_DATA = [{
            id: 0,
            question: '你此刻最渴望什么味道？',
            options: [
                { label: '🌶️ 麻辣刺激', value: 'spicy' },
                { label: '🍯 甜蜜治愈', value: 'sweet' },
                { label: '🧂 咸香满足', value: 'salty' },
            ]
        }, {
            id: 1,
            question: '你更想在哪样的环境里用餐？',
            options: [
                { label: '🔥 热闹烟火气', value: 'lively' },
                { label: '🌸 安静雅致', value: 'quiet' },
                { label: '☕ 随意放松', value: 'casual' },
            ]
        }, {
            id: 2,
            question: '你愿意为美食等待多久？',
            options: [
                { label: '⏱️ 马上就得吃', value: 'immediate' },
                { label: '⌛ 30 分钟以内', value: 'medium' },
                { label: '🕰️ 多久都行', value: 'patient' },
            ]
        }, {
            id: 3,
            question: '你今天的心情是？',
            options: [
                { label: '☀️ 元气满满', value: 'energetic' },
                { label: '😌 平静慵懒', value: 'calm' },
                { label: '🌧️ 需要治愈', value: 'healing' },
            ]
        }, {
            id: 4,
            question: '你更看重食物的哪一点？',
            options: [
                { label: '👅 味道至上', value: 'taste' },
                { label: '🎨 颜值满分', value: 'looks' },
                { label: '💰 性价比高', value: 'value' },
            ]
        }];

        // 问答 → 食物推荐映射（每个选项给对应食物加分）
        const QUIZ_SCORES = {
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
        };

        // 所有食物名称列表（用于评分）
        const ALL_FOOD_NAMES = FOODS.map(f => f.name);
        // 额外补充 '甜品', '西餐' 用于问答
        const QUIZ_FOODS = [...ALL_FOOD_NAMES, '甜品', '西餐'];

        // ============================================================
        //  状态管理
        // ============================================================

        let currentPage = 'home';
        let wheelAngle = 0;
        let isSpinning = false;

        // 问答状态
        let quizIndex = 0;
        let quizAnswers = [];

        // ============================================================
        //  DOM 引用
        // ============================================================

        const $ = id => document.getElementById(id);
        const homePage = $('page-home');
        const wheelPage = $('page-wheel');
        const quizPage = $('page-quiz');
        const canvas = $('wheelCanvas');
        const ctx = canvas.getContext('2d');
        const spinBtn = $('spinBtn');
        const wheelResult = $('wheelResult');
        const quizProgress = $('quizProgress');
        const quizArea = $('quizQuestionArea');

        // ============================================================
        //  页面切换
        // ============================================================

        function showPage(page) {
            [homePage, wheelPage, quizPage].forEach(p => p.classList.remove('active'));
            if (page === 'home') homePage.classList.add('active');
            else if (page === 'wheel') wheelPage.classList.add('active');
            else if (page === 'quiz') quizPage.classList.add('active');
            currentPage = page;
        }

        // 首页 → 转盘
        $('goWheel').addEventListener('click', () => {
            showPage('wheel');
            drawWheel(0);
            wheelResult.textContent = '✨ 等你转动';
            spinBtn.disabled = false;
        });

        // 首页 → 问答
        $('goQuiz').addEventListener('click', () => {
            showPage('quiz');
            quizIndex = 0;
            quizAnswers = [];
            renderQuiz();
        });

        // 返回
        $('wheelBack').addEventListener('click', () => showPage('home'));
        $('wheelBack2').addEventListener('click', () => showPage('home'));
        $('wheelChangeWay').addEventListener('click', () => showPage('home'));
        $('quizBack').addEventListener('click', () => showPage('home'));

        // ============================================================
        //  转盘绘制 & 逻辑
        // ============================================================

        const N = FOODS.length;
        const sectorAngle = (2 * Math.PI) / N;

        function drawWheel(rotation) {
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const r = Math.min(w, h) * 0.42;

            ctx.clearRect(0, 0, w, h);

            // 绘制扇形
            for (let i = 0; i < N; i++) {
                const start = i * sectorAngle + rotation;
                const end = start + sectorAngle;

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, start, end);
                ctx.closePath();

                ctx.fillStyle = FOODS[i].color;
                ctx.fill();
                ctx.strokeStyle = 'rgba(20,16,30,0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // 文字
                const mid = start + sectorAngle / 2;
                const textR = r * 0.68;
                const tx = cx + Math.cos(mid) * textR;
                const ty = cy + Math.sin(mid) * textR;

                ctx.save();
                ctx.translate(tx, ty);
                ctx.rotate(mid + (mid > Math.PI / 2 ? Math.PI : 0));
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 20px "PingFang SC","Hiragino Sans GB",sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 8;
                ctx.fillText(FOODS[i].name, 0, 0);
                ctx.restore();
            }

            // 外圈装饰
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(200,170,130,0.2)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // 内圈装饰
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.12, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(20,16,30,0.5)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(200,170,130,0.15)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // 计算指针指向的食物
        function getFoodFromAngle(rotation) {
            // 指针在顶部 = -PI/2
            const pointerAngle = -Math.PI / 2;
            // 在转盘坐标系中，指针角度
            let localAngle = pointerAngle - rotation;
            // 归一化到 [0, 2PI)
            localAngle = ((localAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const idx = Math.floor(localAngle / sectorAngle) % N;
            return idx;
        }

        // 旋转动画
        function spinWheel() {
            if (isSpinning) return;
            isSpinning = true;
            spinBtn.disabled = true;
            wheelResult.textContent = '🌀 转盘旋转中...';

            const targetRotation = wheelAngle + 4 * 2 * Math.PI + (Math.random() * 2 * Math.PI);
            const duration = 3000 + Math.random() * 1200;
            const startTime = performance.now();
            const startAngle = wheelAngle;

            function animate(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuart
                const ease = 1 - Math.pow(1 - progress, 4);
                const currentAngle = startAngle + (targetRotation - startAngle) * ease;

                drawWheel(currentAngle);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    wheelAngle = targetRotation;
                    const idx = getFoodFromAngle(wheelAngle);
                    const food = FOODS[idx].name;
                    wheelResult.innerHTML = `🍽️ 今天吃 <span class="food-name">${food}</span> 🎉`;
                    isSpinning = false;
                    spinBtn.disabled = false;
                }
            }
            requestAnimationFrame(animate);
        }

        spinBtn.addEventListener('click', spinWheel);

        // ============================================================
        //  问答逻辑
        // ============================================================

        function renderQuiz() {
            if (quizIndex >= QUIZ_DATA.length) {
                // 显示结果
                showQuizResult();
                return;
            }

            const q = QUIZ_DATA[quizIndex];
            const total = QUIZ_DATA.length;

            // 进度点
            const dots = quizProgress.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.remove('active', 'done');
                if (i === quizIndex) dot.classList.add('active');
                else if (i < quizIndex) dot.classList.add('done');
            });

            // 渲染题目
            let html = `
                <div class="q-text">
                    <span class="q-num">第 ${quizIndex+1} / ${total} 题</span>
                    ${q.question}
                </div>
                <div class="quiz-options">
            `;
            const labels = ['A', 'B', 'C'];
            q.options.forEach((opt, i) => {
                html += `
                    <button class="opt-btn" data-value="${opt.value}">
                        <span class="opt-label">${labels[i]}</span>
                        ${opt.label}
                    </button>
                `;
            });
            html += '</div>';
            quizArea.innerHTML = html;

            // 绑定选项事件
            quizArea.querySelectorAll('.opt-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const val = this.dataset.value;
                    quizAnswers.push(val);
                    quizIndex++;
                    renderQuiz();
                });
            });
        }

        function showQuizResult() {
            // 计算得分
            const scores = {};
            QUIZ_FOODS.forEach(f => scores[f] = 0);

            quizAnswers.forEach(ans => {
                const map = QUIZ_SCORES[ans] || {};
                Object.keys(map).forEach(food => {
                    if (scores[food] !== undefined) {
                        scores[food] += map[food];
                    }
                });
            });

            // 找最高分
            let maxScore = -1;
            let bestFood = '火锅';
            for (const [food, score] of Object.entries(scores)) {
                if (score > maxScore) {
                    maxScore = score;
                    bestFood = food;
                }
            }

            // 如果是 '甜品' 或 '西餐'，在 FOODS 中可能没有，需要特殊展示
            const isSpecial = !ALL_FOOD_NAMES.includes(bestFood);
            const emojiMap = {
                '火锅': '🔥',
                '烤肉': '🥩',
                '寿司': '🍣',
                '拉面': '🍜',
                '披萨': '🍕',
                '汉堡': '🍔',
                '炸鸡': '🍗',
                '麻辣烫': '🌶️',
                '日料': '🍱',
                '韩餐': '🇰🇷',
                '甜品': '🍰',
                '西餐': '🥩'
            };
            const emoji = emojiMap[bestFood] || '✨';

            // 显示结果
            const total = QUIZ_DATA.length;
            const dots = quizProgress.querySelectorAll('.dot');
            dots.forEach(d => d.classList.remove('active', 'done'));

            quizArea.innerHTML = `
                <div class="quiz-result-box">
                    <div class="big-icon">${emoji}</div>
                    <div class="result-name">${bestFood}</div>
                    <div class="result-desc">🔮 灵魂占卜结果</div>
                    <div class="result-sub">今天就去吃 ${bestFood} 吧！</div>
                    <button class="restart-btn" id="quizRestart">✦ 再测一次</button>
                </div>
            `;

            $('quizRestart').addEventListener('click', () => {
                quizIndex = 0;
                quizAnswers = [];
                renderQuiz();
            });
        }

        // ============================================================
        //  初始化
        // ============================================================

        drawWheel(0);

        // 修复转盘在首次进入时可能尺寸不对的问题
        function handleResize() {
            // 不用重新绘制，canvas尺寸固定
        }
        window.addEventListener('resize', handleResize);

        console.log('✨ 霖雨魔法店已开张！');
        console.log('🍽️ 今天吃什么？让魔法来决定吧！');

        // 预置一些魔法效果：首页标题闪烁
        const titleEl = document.querySelector('.shop-title');
        if (titleEl) {
            setInterval(() => {
                titleEl.style.textShadow =
                    '0 0 30px rgba(200,170,100,0.08), 0 2px 4px rgba(0,0,0,0.5)';
                setTimeout(() => {
                    titleEl.style.textShadow =
                        '0 0 20px rgba(200,170,100,0.15), 0 2px 4px rgba(0,0,0,0.5)';
                }, 300);
            }, 3000);
        }
    </script>

</body>
</html>