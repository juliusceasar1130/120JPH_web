<template>
  <div>
    <ChildComponent ref="childComponent" @positions="handlePositions" />
    <!--收到触发-->
    <button @click="getParentComponentPosition">Get Positions</button>
  </div>
</template>

<!-- <script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
  methods: {
    handlePositions(positions) {
      console.log('Positions from child:', positions);
    },
    getParentComponentPosition() {
      this.$refs.childComponent.getPositions();
    },
  },
};
</script> -->

<script setup lang="ts">
import ChildComponent from './ChildComponent.vue'
import { ref, onMounted, reactive } from 'vue'
// 子组件实例
const childComponent = ref<InstanceType<typeof ChildComponent> | null>(null);
//子组件的回调函数
const handlePositions=(positions: Record<string, { top: number; left: number; width: number; height: number }>)=>{
  console.log('Positions from child:', positions);
}
//父组件调用子组件的回调函数
const getParentComponentPosition=()=>{
  childComponent.value.getPositions()
}
</script>


