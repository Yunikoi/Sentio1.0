---

# Sentio (ElderlyMonitor)
**基于 React Native 的远程高龄者居家监护与情绪感知系统**  
**Remote Elderly Home Care and Emotion Awareness System Based on React Native**

Sentio 是一款专为远程照护设计的移动应用。它通过手机内置传感器实现非侵入式的健康监测（如跌倒检测），并利用 Firebase 实现子女端与父母端的实时数据同步、位置追踪及社交互动。

Sentio is a mobile application designed for remote care. It achieves non‑invasive health monitoring (e.g., fall detection) through built‑in smartphone sensors, and uses Firebase for real‑time data synchronization, location tracking, and social interaction between the child's terminal and the parent's terminal.

---

## 核心功能 | Core Features

### 1. 父母端 | Parent Terminal

- **实时心率模拟 | Real‑time Heart Rate Simulation**  
  通过动画与数据模拟心率跳动，监测静息与运动模式。  
  Simulates heart rate beats through animations and data, monitoring resting and activity patterns.

- **智能跌倒检测 | Smart Fall Detection**  
  利用 `expo-sensors` 加速度计，在检测到剧烈冲击（G值异常）时触发报警。  
  Uses the `expo-sensors` accelerometer to trigger an alert when a strong impact (abnormal G‑force) is detected.

- **自动位置上传 | Automatic Location Upload**  
  触发报警时，系统自动调用 `expo-location` 获取经纬度并同步至云端。  
  When an alert is triggered, the system automatically calls `expo-location` to obtain the latitude/longitude and syncs it to the cloud.

- **黑色朋友圈 (Moments) | Dark‑mode Social Feed**  
  全黑护眼设计，支持发布文字动态、查看服务器时间戳及回复子女评论。  
  An eye‑friendly all‑black design that supports posting text updates, viewing server timestamps, and replying to children's comments.

### 2. 子女端 | Child Terminal

- **实时状态看板 | Real‑time Status Dashboard**  
  通过 Firebase Realtime Database 远程查看父母的心率及警报状态。  
  Remotely views the parent's heart rate and alert status via Firebase Realtime Database.

- **紧急位置导航 | Emergency Location Navigation**  
  接收警报后，子女可点击弹窗中的位置信息，自动唤起原生地图（Apple Maps / 高德 / Google Maps）进行导航。  
  After receiving an alert, the child can tap the location information in the pop‑up to automatically launch the native map (Apple Maps / Amap / Google Maps) for navigation.

- **双向互动通信 | Two‑way Interactive Communication**  
  在朋友圈下与父母进行实时互动评论。  
  Performs real‑time interactive commenting with parents under the social feed.

---

## 技术栈 | Tech Stack

| 类别 | 技术 |
|------|------|
| 框架 / Framework | React Native (Expo SDK) |
| 语言 / Language | TypeScript |
| 后端 / Backend | Firebase Realtime Database（地理位置存储在 `asia-southeast1`） |
| 传感器 / Sensors | `expo-sensors` (Accelerometer), `expo-location` |
| 路由 / Routing | `expo-router`（基于文件系统的路由管理 / File‑system based routing） |

---

## 快速开始 | Quick Start

### 1. 环境准备 | Environment Setup  
确保已安装 Node.js 和 Expo CLI。  
Make sure you have Node.js and Expo CLI installed.

### 2. 安装依赖 | Install Dependencies
```bash
npm install
# 或者使用 npx 安装特定原生组件 | Or use npx to install specific native components
npx expo install expo-sensors expo-location expo-linking
```

### 3. 配置 Firebase | Configure Firebase  
在根目录创建 `firebaseConfig.ts` 并填入你的配置信息。  
Create `firebaseConfig.ts` in the root directory and fill in your configuration.

```typescript
// app/firebaseConfig.ts
export const db = ... // 初始化你的 Firebase Database | Initialize your Firebase Database
```

### 4. 启动项目 | Start the Project
```bash
npx expo start
```

---

## 项目结构 | Project Structure
```text
├── app/
│   ├── (parentTab)/      # 父母端 Tab 路由 | Parent terminal tab routing (Home, Alerts)
│   ├── (childTab)/       # 子女端 Tab 路由 | Child terminal tab routing (Monitor, Alerts)
│   ├── firebaseConfig.ts # Firebase 配置文件 | Firebase configuration file
│   └── index.tsx         # 入口选择页面：选择进入父母端或子女端 | Entry selection page
├── constants/            # 样式与主题配置 | Styles and theme configuration
└── components/           # 通用 UI 组件 | Common UI components
```

---

## 注意事项 | Notes

- **定位权限 | Location Permission**  
  在真机测试时，请务必授予应用“始终允许”定位权限。  
  When testing on a real device, be sure to grant the app "Always Allow" location permission.

- **Web 端限制 | Web Limitations**  
  由于浏览器安全策略，Web 端子女看板在非 HTTPS 环境下无法直接获取父母精确坐标，建议配合真机父母端进行测试。  
  Due to browser security policies, the child dashboard on the web cannot directly obtain the parent's precise coordinates in a non‑HTTPS environment. It is recommended to test together with a real parent device.

---
