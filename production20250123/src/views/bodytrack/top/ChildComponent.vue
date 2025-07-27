<!-- <template>
  <div>
    <div ref="element1" class="child-element">Element 1</div>
    <div ref="element2" class="child-element">Element 2</div>
    <div ref="element3" class="child-element">Element 3</div>
  </div>
</template>

<script>
export default {
  methods: {
    getPositions() {
      const positions = {};
      // 使用 this.$nextTick 确保 DOM 已更新
      this.$nextTick(() => {
        const elements = ['element1', 'element2', 'element3'];
        elements.forEach((element) => {
          const el = this.$refs[element];
          if (el) {
            const rect = el.getBoundingClientRect();
            positions[element] = {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            };
          }
        });
        // 将位置信息发送给父组件
        this.$emit('positions', positions);
      });
    },
  },
};
</script>

<style>
.child-element {
  margin: 10px;
  padding: 10px;
  background: lightblue;
}
</style> -->

<template>
  <div>
    <div  :ref ="(vc: any) => (elements[index] = vc)"  v-for="(item,index) in [1,2,3]" class="child-element">{{item}}</div>

  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

// 定义事件
const emit = defineEmits<{
  (e: 'positions', positions: Record<string, { top: number; left: number; width: number; height: number }>): void;
}>();

// 定义 ref 引用
let elements = ref<any>([])

// 监听窗口 resize 事件
onMounted(() => {
  getPositions()
  // 监听窗口大小变化
  window.addEventListener("resize", getPositions);
});

// 移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener("resize", getPositions);
});

// 获取子组件中所有绑定 ref 的元素的位置信息
const getPositions = async () => {
  // 定义一个对象来存储位置信息
  const positions: Record<string, { top: number; left: number; width: number; height: number }> = {};
  // 使用 nextTick 确保 DOM 更新
  await nextTick(); // 确保 DOM 更新完成后再获取元素位置
  // const elements = [element1, element2, element3];

  elements.value.forEach((elementRef:any, index:any) => {
    if (elementRef) {
      const rect = elementRef.getBoundingClientRect();
      //模板字符串:`My name is ${name} and I am ${age} years old.`
      positions[`element${index + 1}`] = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }
  });

  // 将位置信息通过事件传递给父组件
  emit('positions', positions);
};

// 确保方法被暴露
defineExpose({
  getPositions,
});
</script>

<style>
/* 示例样式 */
.child-element {
  margin: 10px;
  padding: 10px;
  background: lightblue;
}
</style>