<template>

  <div class="container">

    <div ref="cal_position_ref" class="front">
      <!--搜索部分-->
      <el-card style="background-color: ">
        <el-form inline>
          <el-form-item label="车号">
            <el-input v-model="query.fis" placeholder="请输入车号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="search"></el-button>
            <el-button type="primary" icon="Refresh" @click="reset"></el-button>
            <!--收到触发-->
            <!-- <button @click="getParentComponentPosition">Get Positions</button> -->
          </el-form-item>
        </el-form>

      </el-card>
      <!--统计部分（需要改为区域单独的）-->
      <!-- <el-card style="background-color:gainsboro">
        <el-row>
          <el-col :span="12">
            <el-statistic title="经过节点" :value="points" />
          </el-col>
          <el-col :span="12">
            <el-statistic title="用时" :value="timeDetla" />
          </el-col>
        </el-row>
      </el-card> -->

      <!--显示部分-->
      <el-row v-loading="loading1">
        <!--分色-->
        <el-col :span="12">
          <el-card>
            <P class="title">分色线</P>
            <!--分色1-->
            <oneline_2position ref="childComponent1" @positions="handlePositions1" :line='1' :P_out="data13IS260"
              :pointFirst="pointFirst" :pointLast="pointLast">
            </oneline_2position>
            <!--分色2-->
            <oneline_2position ref="childComponent2" @positions="handlePositions2" :line='2' :P_out="data14IS260"
              :pointFirst="pointFirst" :pointLast="pointLast">
            </oneline_2position>
            <!--分色3-->
            <oneline_2position ref="childComponent3" @positions="handlePositions3" :line='3' :P_out="data15IS260"
              :pointFirst="pointFirst" :pointLast="pointLast">
            </oneline_2position>
          </el-card>
        </el-col>
        <!--面漆-->
        <el-col :span="12">
          <el-card>
            <P class="title">面漆线</P>
            <!--面漆1-->
            <oneline_2position ref="childComponent4" @positions="handlePositions4" :line='1' :P_out="dataL3ABC11IS02"
              :P_in="data22IS005" :pointFirst="pointFirst" :pointLast="pointLast"></oneline_2position>
            <!--面漆2-->
            <oneline_2position ref="childComponent5" @positions="handlePositions5" :line='2' :P_out="dataL3ABC21IS02"
              :P_in="data23IS005" :pointFirst="pointFirst" :pointLast="pointLast"></oneline_2position>
            <!--面漆3-->
            <oneline_2position ref="childComponent6" @positions="handlePositions6" :line='3' :P_out="dataL3ABC31IS02"
              :P_in="data21IS565" :pointFirst="pointFirst" :pointLast="pointLast"></oneline_2position>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-loading="loading1">
        <!--打磨-->
        <el-col :span="12">
          <el-card>
            <P class="title">打磨线</P>
            <!--打磨1-->
            <oneline_2position ref="childComponent7" @positions="handlePositions7" :line='1' :P_out="data13IS075"
              :P_in="data13IS015" :pointFirst="pointFirst" :pointLast="pointLast"></oneline_2position>

            <!--打磨2-->
            <oneline_2position ref="childComponent8" @positions="handlePositions8" :line='2' :P_out="data14IS075"
              :P_in="data14IS015" :pointFirst="pointFirst" :pointLast="pointLast"></oneline_2position>

            <!--打磨3-->
            <oneline_2position ref="childComponent9" @positions="handlePositions9" :line='3' :P_out="data15IS075"
              :P_in="data15IS015" :pointFirst="pointFirst" :pointLast="pointLast"></oneline_2position>
          </el-card>
        </el-col>
        <!--报交-->
        <el-col :span="12">
          <el-card>
            <P class="title">报交线</P>
            <!--报交1-->
            <oneline_4position ref="childComponent10" @positions="handlePositions10" :line='1' :P_out1="data22IS110"
              :P_out2="data22IS170" :P_in1="data22IS060" :P_in2="data22IS120" :pointFirst="pointFirst"
              :pointLast="pointLast">
            </oneline_4position>
            <!--报交2-->
            <oneline_4position ref="childComponent11" @positions="handlePositions11" :line='2' :P_out1="data23IS110"
              :P_out2="data23IS170" :P_in1="data23IS060" :P_in2="data23IS120" :pointFirst="pointFirst"
              :pointLast="pointLast">
            </oneline_4position>
            <!--报交3-->
            <oneline_4position ref="childComponent12" @positions="handlePositions12" :line='3' :P_out1="data24IS185"
              :P_out2="data24IS115" :P_in1="data24IS130" :P_in2="data24IS060" :pointFirst="pointFirst"
              :pointLast="pointLast">
            </oneline_4position>

          </el-card>
        </el-col>
      </el-row>

    </div>

    <svg class="svg-responsive">
      <!-- 节点 -->
      <!-- <template v-for="(value, key) in positionsCollect" :key="key">
        <circle :cx="value.left - cal_position.left + value.width / 2"
          :cy="value.top - cal_position.top + value.width / 2" r="20" fill="#fff" stroke="blue" stroke-width="2" />
        <text :x="value.left - cal_position.left" :y="value.top - cal_position.top" text-anchor="middle" font-size="14"
          fill="black">
          {{ key }}
        </text>
      </template> -->

      <template v-for="(node, index) in positionsCollectList.slice(0, positionsCollectList.length - 1)" :key="index">
        <!-- 线段 -->
        <path class="path_front"
          :d="`M${node.left - cal_position.left + node.width / 2},${node.top - cal_position.top + node.width / 2} L${positionsCollectList[index + 1].left - cal_position.left + node.width / 2},${positionsCollectList[index + 1].top - cal_position.top + node.width / 2}`"
          stroke="black" stroke-dasharray="6,6" fill="none" stroke-width="1" />
      </template>


    </svg>

  </div>



</template>


<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { reqtraceSearchByFis } from '@/api/bodyTrack'
import oneline_2position from '../parts/oneline_twoposition.vue'
import oneline_4position from '../parts/oneline_fourposition.vue'
import { ElMessage } from 'element-plus'
//引入layout小仓库
import useLayOutSettingStore from '@/store/modules/setting'
//引入store
import useBodyTrack from '@/views/bodytrack/store/bodytrack'
let bodyTrackStore = useBodyTrack()

let LayOutSettingStore = useLayOutSettingStore()
let loading1 = ref(false)
let query = reactive({
  fis: '',
})
let points = ref()
let timeDetla = ref()
let cal_position_ref = ref()
let cal_position = ref({ top: 0, left: 0, width: 0, height: 0 })
let positionsCollect = ref<{ [key: string]: any }>({})
//计算第一点和最后点
let pointFirst = ref('1')
let pointLast = computed(() => {
  return String(positionsCollectList.value.length)
}
)

//转为List sq编号需要保证从小到大按顺序排序
let positionsCollectList = computed(() => {
  return Object.values(positionsCollect.value)
}
)

//
// 子组件实例
const childComponent1 = ref(null);//分色
const childComponent2 = ref(null);
const childComponent3 = ref(null);
const childComponent4 = ref(null);//面漆
const childComponent5 = ref(null);
const childComponent6 = ref(null);
const childComponent7 = ref(null);//打磨
const childComponent8 = ref(null);
const childComponent9 = ref(null);
const childComponent10 = ref(null);//报交
const childComponent11 = ref(null);
const childComponent12 = ref(null);

//打磨线
let data13IS075 = ref()
let data13IS015 = ref()
let data14IS075 = ref()
let data14IS015 = ref()
let data15IS075 = ref()
let data15IS015 = ref()
//分色
let data13IS260 = ref()
let data14IS260 = ref()
let data15IS260 = ref()
//面漆
let dataL3ABC11IS02 = ref()
let data22IS005 = ref()
let dataL3ABC21IS02 = ref()
let data23IS005 = ref()
let dataL3ABC31IS02 = ref()
//?????
let data21IS565 = ref()
//报交1
let data22IS110 = ref()
let data22IS170 = ref()
let data22IS060 = ref()
let data22IS120 = ref()
//报交2
let data23IS110 = ref()
let data23IS170 = ref()
let data23IS060 = ref()
let data23IS120 = ref()
//报交3????????????????????????
let data24IS130 = ref()
let data24IS185 = ref()
let data24IS060 = ref()
let data24IS115 = ref()
let timer = ref()
watch(() => LayOutSettingStore.fold, () => {

  //等待元素到位后计算位置，否则位置还处于变化中，第一次搜索也是如此
  if (timer.value) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(() => {
    getParentComponentPosition()
    getPositions()
  }, 250)
})
//以front方框为原点，获取front的坐标值，后续用于相减
// 获取子组件中所有绑定 ref 的元素的位置信息
const getPositions = async () => {
  // 使用 nextTick 确保 DOM 更新
  await nextTick() // 确保 DOM 更新完成后再获取元素位置

  const rect = cal_position_ref.value.getBoundingClientRect()
  //模板字符串:`My name is ${name} and I am ${age} years old.`
  cal_position.value = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}


onMounted(() => {
  //获取store
  if(bodyTrackStore.query.fis){
    //显示
    query.fis=bodyTrackStore.query.fis
    GetreqtraceSearchByFis(bodyTrackStore.query.fis)
  }
  getPositions()
  // 监听窗口大小变化
  window.addEventListener('resize', getPositions)
})
// 移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', getPositions)
})
const GetreqtraceSearchByFis = async (fis: any) => {
  loading1.value = true
  let result = await reqtraceSearchByFis(fis)
  if (result.code == 200) {
    if (result.data.data) {
      //打磨
      data13IS075.value = result.data.data['13IS075']
      data13IS015.value = result.data.data['13IS015']
      data14IS075.value = result.data.data['14IS075']
      data14IS015.value = result.data.data['14IS015']
      data15IS075.value = result.data.data['15IS075']
      data15IS015.value = result.data.data['15IS015']
      //分色
      data13IS260.value = result.data.data['13IS260']
      data14IS260.value = result.data.data['14IS260']
      data15IS260.value = result.data.data['15IS260']
      //面漆
      dataL3ABC11IS02.value = result.data.data['L3ABC11IS02']
      data22IS005.value = result.data.data['22IS005']
      dataL3ABC21IS02.value = result.data.data['L3ABC21IS02']
      data23IS005.value = result.data.data['23IS005']
      dataL3ABC31IS02.value = result.data.data['L3ABC31IS02']
      data21IS565.value = result.data.data['21IS565']
      //报交1
      data22IS110.value = result.data.data['22IS110']
      data22IS170.value = result.data.data['22IS170']
      data22IS060.value = result.data.data['22IS060']
      data22IS120.value = result.data.data['22IS120']
      //报交2
      data23IS110.value = result.data.data['23IS110']
      data23IS170.value = result.data.data['23IS170']
      data23IS060.value = result.data.data['23IS060']
      data23IS120.value = result.data.data['23IS120']
      //报交3
      data24IS130.value = result.data.data['24IS130']
      data24IS185.value = result.data.data['24IS185']
      data24IS060.value = result.data.data['24IS060']
      data24IS115.value = result.data.data['24IS115']
      //时间和节点计数
      points.value = result.data['points']
      timeDetla.value = result.data['timeDetla']
      loading1.value = false
      //父组件调用子组件定位数据(等元素到位后)    
      if (timer.value) {
        clearTimeout(timer.value)
      }
      timer.value = setTimeout(() => {
        getParentComponentPosition()
        getPositions()
      }, 300)

      ElMessage({
        type: 'success',
        message: '获取成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: '没有发现经过预选节点或者FIS错误！',
      })
      loading1.value = false
    }


  }
}
const search = () => {
  GetreqtraceSearchByFis(query.fis)
}
const reset = () => {
  //重置搜索
  Object.assign(query, {
    fis: ''
  })
  //刷新页面
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
}
//子组件的回调函数
const handlePositions1 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child1:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions2 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child2:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions3 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child3:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions4 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child4:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions5 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child5:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions6 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child6:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions7 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child7:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions8 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child8:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }

}
const handlePositions9 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child9:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }
  console.log('positionsCollect.value:', positionsCollect.value);

}
const handlePositions10 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child10:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }
}
const handlePositions11 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child11:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }
}
const handlePositions12 = (positions: Record<string, { top: number; left: number; width: number; height: number }>) => {
  console.log('Positions from child12:', positions);
  if (positions) {
    //将子组件的positions传给父组件
    Object.entries(positions).forEach(([key, value]) => {
      positionsCollect.value[key] = value
    })
  }
}
//父组件调用子组件的回调函数
const getParentComponentPosition = () => {
  childComponent1.value.getPositions()
  childComponent2.value.getPositions()
  childComponent3.value.getPositions()
  childComponent4.value.getPositions()
  childComponent5.value.getPositions()
  childComponent6.value.getPositions()
  childComponent7.value.getPositions()
  childComponent8.value.getPositions()
  childComponent9.value.getPositions()
  childComponent10.value.getPositions()
  childComponent11.value.getPositions()
  childComponent12.value.getPositions()

}

</script>
<style scoped lang="scss">
.title {
  text-align: left;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 20px;
}

.container {
  // width: 100vw;
  height: 100vh;
  /* 父容器的大小可以根据需要调整 */
  border: 1px solid white;
  position: relative;
  z-index: 1;

  .front {
    position: absolute;
    top: 0;
    left: 0;
    width: 85vw;
    height: 100vh;
    z-index: 10;
    opacity: 0.85;
    // background-color: transparent;
  }

  .svg-responsive {
    position: absolute;
    top: 0;
    left: 0; //-$base-menu-width;
    width: 85vw;
    height: 100vh;

    // background-color: rgb(239, 245, 245);
    // opacity: 0.5;
    .path_front {
      position: relative;
      z-index: 1000;
    }
  }
}
</style>
