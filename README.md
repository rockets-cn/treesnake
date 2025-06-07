# Three.js 3D 贪吃蛇游戏

## 项目简介
基于 Three.js 实现的三维贪吃蛇游戏，支持 X/Y/Z 三维空间移动，带有可视化透明围墙和三维食物。可在现代浏览器中直接运行，无需后端。

## 功能特性
- 三维空间内的贪吃蛇玩法，支持上下左右前后六向移动
- 10%透明三维围墙，撞墙或自咬即游戏结束
- 食物和蛇均可在三维空间任意位置生成和移动
- 键盘操作流畅，体验立体空间感

## 操作说明
- 方向键 或 WSAD：控制蛇在 X/Z 平面移动
- Q：蛇向上移动（Y+）
- E：蛇向下移动（Y-）
- 吃到红色方块（食物）蛇会变长
- 撞墙或自咬游戏结束，弹窗提示

## 快速运行
1. 克隆本项目到本地：
   ```bash
   git clone https://github.com/rockets-cn/treesnake.git
   ```
2. 进入项目目录，推荐用本地静态服务器运行：
   - **推荐**：用 VSCode 的 Live Server 插件，右键 public/index.html 选择"Open with Live Server"
   - 或用 Python3 自带服务器：
     ```bash
     cd public
     python -m http.server 8080
     # 然后浏览器访问 http://localhost:8080
     ```
   - 或用 Node.js 的 serve 工具：
     ```bash
     npm install -g serve
     serve public
     ```
   - **不推荐**：直接双击 index.html，部分浏览器会因安全策略导致 Three.js 资源加载异常。

## 常见问题
- 如果页面白屏或控制台报错，优先检查是否用本地服务器方式打开。
- 推荐使用最新版 Chrome/Edge/Firefox 浏览器。

## 依赖
- [Three.js](https://threejs.org/)（通过CDN自动加载，无需本地安装）

## 目录结构
```
public/
  index.html      # 游戏主页面
src/
  main.js         # 游戏主逻辑
README.md         # 项目说明
```

## 效果截图
建议运行后自行截图放在此处：

![demo](screenshot.png)

## 许可协议
MIT 