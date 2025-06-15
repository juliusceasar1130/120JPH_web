<template>
  <div id="app">
    <!-- 输入节点坐标 -->
    <div style="margin: 20px;">
      <div v-for="(node, index) in nodes" :key="index" style="margin: 10px;">
        <span>节点 {{ index + 1 }}:</span>
        <input v-model.number="node.x" type="number" placeholder="X 坐标" style="width: 80px; margin: 0 10px;" />
        <input v-model.number="node.y" type="number" placeholder="Y 坐标" style="width: 80px;" />
      </div>
    </div>

    <!-- 绘制节点和连线 -->
    <svg width="600" height="400">
      <!-- 定义箭头 -->
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" orient="auto" refX="5" refY="5">
          <path d="M0,0 L10,5 L0,10 z" fill="blue" />
        </marker>
      </defs>

      <!-- 节点 -->
      <template v-for="(node, index) in nodes" :key="index">
        <circle :cx="node.x" :cy="node.y" r="20" fill="#fff" stroke="blue" stroke-width="2" />
        <text :x="node.x" :y="node.y + 5" text-anchor="middle" font-size="14" fill="black">
          {{ index + 1 }}
        </text>
      </template>

      <!-- 连线 -->
      <template v-for="(node, index) in nodes.slice(0, nodes.length - 1)" :key="index">
        <!-- 线段 -->
        <path :d="`M${node.x},${node.y} L${nodes[index + 1].x},${nodes[index + 1].y}`" stroke="blue"
          stroke-dasharray="5,5" fill="none" stroke-width="2" />

        <!-- 箭头 -->
        <g :transform="`translate(${(node.x + nodes[index + 1].x) / 2},${(node.y + nodes[index + 1].y) / 2}) rotate(${getAngle(node, nodes[index + 1])})`"
          style="transform-box: fill-box; transform-origin: center;">
          <use href="#arrow" />
        </g>
      </template>
    </svg>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      // 初始节点坐标
      nodes: [
        { x: 50, y: 100 },
        { x: 150, y: 200 },
        { x: 250, y: 300 },
        { x: 350, y: 200 },
        { x: 450, y: 300 },
        { x: 550, y: 200 },
      ],
    };
  },
  methods: {
    // 计算线段的角度
    getAngle(p1, p2) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      return (Math.atan2(dy, dx) * 180) / Math.PI; // 弧度转角度
    },
  },
};
</script>

<style>
body {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
}

input {
  padding: 5px;
  text-align: center;
}
</style>