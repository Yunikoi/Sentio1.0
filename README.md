这份 README 是专为你的 **Sentio (ElderlyMonitor)** 项目设计的。它涵盖了你目前已经实现的非侵入式情绪/跌倒检测、Firebase 实时通信以及 GPS 定位功能。

---

# Sentio (ElderlyMonitor) 
**基于 React Native 的远程高龄者居家监护与情绪感知系统**

Sentio 是一款专为远程照护设计的移动应用。它通过手机内置传感器实现非侵入式的健康监测（如跌倒检测），并利用 Firebase 实现子女端与父母端的实时数据同步、位置追踪及社交互动。

## 核心功能

### 1. 父母端 (Parent Terminal)
* **实时心率模拟**：通过动画与数据模拟心率跳动，监测静息与运动模式。
* **智能跌倒检测**：利用 `expo-sensors` 加速度计，在检测到剧烈冲击（G值异常）时触发报警。
* **自动位置上传**：触发报警时，系统自动调用 `expo-location` 获取经纬度并同步至云端。
* **黑色朋友圈 (Moments)**：全黑护眼设计，支持发布文字动态、查看服务器时间戳及回复子女评论。

### 2. 子女端 (Child Terminal)
* **实时状态看板**：通过 Firebase Realtime Database 远程查看父母的心率及警报状态。
* **紧急位置导航**：接收警报后，子女可点击弹窗中的位置信息，自动唤起原生地图（Apple Maps/高德/Google Maps）进行导航。
* **双向互动通信**：在朋友圈下与父母进行实时互动评论。

## 技术栈

* **框架**: React Native (Expo SDK)
* **语言**: TypeScript
* **后端**: Firebase Realtime Database (地理位置存储在 `asia-southeast1`)
* **传感器**: `expo-sensors` (Accelerometer), `expo-location`
* **路由**: `expo-router` (基于文件系统的路由管理)

## 快速开始

### 1. 环境准备
确保你已安装 Node.js 和 Expo CLI。

### 2. 安装依赖
```bash
npm install
# 或者使用 npx 安装特定原生组件
npx expo install expo-sensors expo-location expo-linking
```

### 3. 配置 Firebase
在根目录创建 `firebaseConfig.ts` 并填入你的配置信息：
```typescript
// app/firebaseConfig.ts
export const db = ... // 初始化你的 Firebase Database
```

### 4. 启动项目
```bash
npx expo start
```

## 项目结构
```text
├── app/
│   ├── (parentTab)/      # 父母端 Tab 路由 (Home, Alerts)
│   ├── (childTab)/       # 子女端 Tab 路由 (Monitor, Alerts)
│   ├── firebaseConfig.ts # Firebase 配置文件
│   └── index.tsx         # 入口选择页面：选择进入父母端或子女端
├── constants/            # 样式与主题配置
└── components/           # 通用 UI 组件
```

## 注意事项
* **定位权限**：在真机测试时，请务必授予应用“始终允许”定位权限。
* **Web 端限制**：由于浏览器安全策略，Web 端子女看板在非 HTTPS 环境下无法直接获取父母精确坐标，建议配合真机父母端进行测试。

---

**你想让我再为你添加关于“如何配置 Firebase 规则”或“跌倒算法逻辑”的详细说明吗？**
