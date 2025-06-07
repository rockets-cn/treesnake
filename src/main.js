// Three.js 3D 贪吃蛇 DEMO - 基础场景
console.log('Three.js Snake Game 启动');

// 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222233);

// 摄像机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 15, 20);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// 坐标轴辅助
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// 自适应窗口
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== 贪吃蛇数据结构与渲染 ==========
const SNAKE_INIT_LENGTH = 5;
const SNAKE_UNIT_SIZE = 1;
const snake = [];
const snakeMeshes = [];
let snakeDirection = new THREE.Vector3(1, 0, 0); // 初始向X轴正方向

// 初始化蛇的坐标（沿X轴）
for (let i = 0; i < SNAKE_INIT_LENGTH; i++) {
  snake.push(new THREE.Vector3(-i * SNAKE_UNIT_SIZE, 0, 0));
}

// 渲染蛇
function renderSnake() {
  // 移除旧mesh
  snakeMeshes.forEach(mesh => scene.remove(mesh));
  snakeMeshes.length = 0;
  // 重新渲染
  for (let i = 0; i < snake.length; i++) {
    const geometry = new THREE.BoxGeometry(SNAKE_UNIT_SIZE, SNAKE_UNIT_SIZE, SNAKE_UNIT_SIZE);
    const material = new THREE.MeshLambertMaterial({ color: i === 0 ? 0x00ff00 : 0x007700 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(snake[i]);
    scene.add(cube);
    snakeMeshes.push(cube);
  }
}

// ========== 键盘控制 ==========
const directionMap = {
  ArrowUp:    new THREE.Vector3(0, 0, -1),
  ArrowDown:  new THREE.Vector3(0, 0, 1),
  ArrowLeft:  new THREE.Vector3(-1, 0, 0),
  ArrowRight: new THREE.Vector3(1, 0, 0),
  w: new THREE.Vector3(0, 0, -1),
  s: new THREE.Vector3(0, 0, 1),
  a: new THREE.Vector3(-1, 0, 0),
  d: new THREE.Vector3(1, 0, 0),
  q: new THREE.Vector3(0, 1, 0), // 上升
  e: new THREE.Vector3(0, -1, 0), // 下降
};
window.addEventListener('keydown', (e) => {
  const dir = directionMap[e.key];
  if (dir) {
    // 禁止直接反向
    if (!dir.clone().add(snakeDirection).equals(new THREE.Vector3(0,0,0))) {
      snakeDirection = dir;
    }
  }
});

// ========== 食物生成与渲染 ==========
let food = null;
let foodMesh = null;

function randomFoodPosition() {
  // 限定范围，避免太远
  const range = 8;
  let pos;
  let conflict;
  do {
    pos = new THREE.Vector3(
      Math.floor((Math.random() * 2 - 1) * range),
      Math.floor((Math.random() * 2 - 1) * range), // Y轴也随机
      Math.floor((Math.random() * 2 - 1) * range)
    );
    // 检查是否与蛇重叠
    conflict = snake.some(seg => seg.equals(pos));
  } while (conflict);
  return pos;
}

function spawnFood() {
  if (foodMesh) scene.remove(foodMesh);
  food = randomFoodPosition();
  const geometry = new THREE.BoxGeometry(SNAKE_UNIT_SIZE, SNAKE_UNIT_SIZE, SNAKE_UNIT_SIZE);
  const material = new THREE.MeshLambertMaterial({ color: 0xff3333 });
  foodMesh = new THREE.Mesh(geometry, material);
  foodMesh.position.copy(food);
  scene.add(foodMesh);
}

// 初始化时生成一次食物
spawnFood();

// 贪吃蛇移动与吃食物逻辑
let moveTick = 0;
let gameOver = false;
function updateSnake() {
  if (gameOver) return;
  moveTick++;
  if (moveTick % 30 === 0) {
    const newHead = snake[0].clone().add(snakeDirection);
    // 边界检测（假设范围±8）
    const range = 8;
    if (Math.abs(newHead.x) > range || Math.abs(newHead.y) > range || Math.abs(newHead.z) > range) {
      gameOver = true;
      alert('游戏结束：撞墙了！');
      return;
    }
    // 自撞检测
    if (snake.some(seg => seg.equals(newHead))) {
      gameOver = true;
      alert('游戏结束：咬到自己了！');
      return;
    }
    // 判断是否吃到食物
    if (newHead.equals(food)) {
      snake.unshift(newHead); // 变长
      renderSnake();
      spawnFood();
    } else {
      snake.unshift(newHead);
      snake.pop();
      renderSnake();
    }
  }
}

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  updateSnake();
  renderer.render(scene, camera);
}
animate();

// ========== 可视化三维围墙 ==========
function addWalls(range = 8, height = 8) {
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x3399ff, transparent: true, opacity: 0.1 });
  const thickness = 0.2;
  const wallLength = range * 2 + 1;
  const wallHeight = height * 2 + 1;
  // 前后墙（Z轴）
  for (let z of [-range, range]) {
    const geometry = new THREE.BoxGeometry(wallLength, wallHeight, thickness);
    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.position.set(0, 0, z);
    scene.add(mesh);
  }
  // 左右墙（X轴）
  for (let x of [-range, range]) {
    const geometry = new THREE.BoxGeometry(thickness, wallHeight, wallLength);
    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.position.set(x, 0, 0);
    scene.add(mesh);
  }
  // 上下墙（Y轴）
  for (let y of [-height, height]) {
    const geometry = new THREE.BoxGeometry(wallLength, thickness, wallLength);
    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.position.set(0, y, 0);
    scene.add(mesh);
  }
}
addWalls(8, 8); 