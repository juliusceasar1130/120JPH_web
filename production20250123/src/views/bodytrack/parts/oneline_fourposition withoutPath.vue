<template>
  <el-col :span="24">
          <!--显示没有数据的线信息-->
          <el-card><p v-show="!P_out2 && !P_out1">line{{line}}</p>
            <el-row>
              <el-col :span="12">
                
                  <!--报交 出口左侧-->
                  <el-card v-show="P_out1" class='linebackground'>
                    <p v-show="P_out1" class="line">{{ line }}.1</p>
                    <el-tag effect="dark" size="large" round v-for="(item, index) in P_out1" :key="index"
                      type="primary">
                      {{ item.sq }}
                    </el-tag>
                    <el-tag effect="dark" v-for="(item, index) in P_out1" :key="index" type="success">
                      {{ item.dateTime }}
                    </el-tag>
                  </el-card>
                  <el-card v-show="P_out2" class='linebackground'>
                    <p v-show="P_out2" class="line">{{ line }}.2</p>
                    <el-tag effect="dark" size="large" round v-for="(item, index) in P_out2" :key="index"
                      type="primary">
                      {{ item.sq }}
                    </el-tag>
                    <el-tag effect="dark" v-for="(item, index) in P_out2" :key="index" type="success">
                      {{ item.dateTime }}
                    </el-tag>
                  </el-card>
               
              </el-col>
              <el-col :span="12">
                
                  <!--报交 入口右侧-->
                  <!--.1-->
                  <el-card v-show="P_in1" class='linebackground'>
                    <p v-show="P_in1" class="line">{{ line }}.1</p>
                    <el-tag effect="dark" size="large" round v-for="(item, index) in P_in1" :key="index"
                      type="primary">
                      {{ item.sq }}
                    </el-tag>
                    <el-tag effect="dark" v-for="(item, index) in P_in1" :key="index" type="success">
                      {{ item.dateTime }}
                    </el-tag>
                  <!--.2-->
                  </el-card>
                  <el-card v-show="P_in2" class='linebackground'>
                    <p v-show="P_in2" class="line">{{ line }}.2</p>
                    <el-tag effect="dark" size="large" round v-for="(item, index) in P_in2" :key="index"
                      type="primary">
                      {{ item.sq }}
                    </el-tag>
                    <el-tag effect="dark" v-for="(item, index) in P_in2" :key="index" type="success">
                      {{ item.dateTime }}
                    </el-tag>
                  </el-card>
                
              </el-col>
            </el-row>
          </el-card>
        </el-col>
</template>

<script setup lang="ts">
import { defineProps,computed,ref  } from 'vue'

//父传子参数
const props = defineProps({
  line: {
    type: String as () => String,
    required: false,
  },
  P_out1: {
    type: Array as () => string[],
    required: false,
  },
  P_in1: {
    type: Array as () => number[],
    required: false,
  },
  P_out2: {
    type: Array as () => string[],
    required: false,
  },
  P_in2: {
    type: Array as () => number[],
    required: false,
  },
})
</script>

<style scoped lang="scss">
.linebackground{
background-color:aliceblue
}
.line {
  display: flex;
  text-align: right;
  align-items: center; /* 使子元素在垂直方向上居中 */
}
</style>
