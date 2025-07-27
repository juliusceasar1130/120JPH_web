<template>
  <!--搜索部分-->
  <el-card>
    <el-form inline>
      <el-form-item label="车号">
        <el-input v-model="query.fis" placeholder="请输入车号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="search"></el-button>
        <el-button type="primary" icon="Refresh" @click="reset"></el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!--统计部分-->
  <el-card>
    <el-row>
    <el-col :span="12">
      <el-statistic title="经过节点" :value="points" />
    </el-col>
    <el-col :span="12">
      <el-statistic title="用时" :value="timeDetla" />
    </el-col>
  </el-row>
  </el-card>

  <!--显示部分-->
  <el-row v-loading="loading1">
    <!--分色-->
    <el-col :span="12">
      <el-card>
        <P class="title">分色线</P>
        <!--分色1-->
        <oneline_2position :line='1' :P_out="data13IS260"></oneline_2position>
        <!--分色2-->
        <oneline_2position :line='2' :P_out="data14IS260"></oneline_2position>
        <!--分色3-->
        <oneline_2position :line='3' :P_out="data15IS260"></oneline_2position>
      </el-card>
    </el-col>
    <!--面漆-->
    <el-col :span="12">
      <el-card>
        <P class="title">面漆线</P>
        <!--面漆1-->
        <oneline_2position :line='1' :P_out="dataL3ABC11IS02" :P_in="data22IS005"></oneline_2position>
        <!--面漆2-->
        <oneline_2position :line='2' :P_out="dataL3ABC21IS02" :P_in="data23IS005"></oneline_2position>
        <!--面漆3-->
        <oneline_2position :line='3' :P_out="dataL3ABC31IS02" :P_in="data21IS565"></oneline_2position>
      </el-card>
    </el-col>
  </el-row>
  <el-row v-loading="loading1">
    <!--打磨-->
    <el-col :span="12">
      <el-card>
        <P class="title">打磨线</P>
        <!--打磨1-->
        <oneline_2position :line='1' :P_out="data13IS075" :P_in="data13IS015"></oneline_2position>
        <!--打磨2-->
        <oneline_2position :line='2' :P_out="data14IS075" :P_in="data14IS015"></oneline_2position>
        <!--打磨3-->
        <oneline_2position :line='3' :P_out="data15IS075" :P_in="data15IS015"></oneline_2position>
      </el-card>
    </el-col>
    <!--报交-->
    <el-col :span="12">
      <el-card>
        <P class="title">报交线</P>
        <!--报交1-->
        <oneline_4position :line='1' :P_out1="data22IS110" :P_out2="data22IS170" :P_in1="data22IS060"
          :P_in2="data22IS120">
        </oneline_4position>
        <!--报交2-->
        <oneline_4position :line='2' :P_out1="data23IS110" :P_out2="data23IS170" :P_in1="data23IS060"
          :P_in2="data23IS120">
        </oneline_4position>
        <!--报交3-->
        <oneline_4position :line='3' :P_out1="data24IS110" :P_out2="data24IS170" :P_in1="data24IS060"
          :P_in2="data24IS120">
        </oneline_4position>

      </el-card>
    </el-col>

  </el-row>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqtraceSearchByFis } from '@/api/bodyTrack'
import oneline_2position from './parts/oneline_twoposition.vue'
import oneline_4position from './parts/oneline_fourposition.vue'
//引入layout小仓库
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
let loading1 = ref(false)
let query = reactive({
  fis: '',
})
let points = ref()
let timeDetla = ref()

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
let data24IS110 = ref()
let data24IS170 = ref()
let data24IS060 = ref()
let data24IS120 = ref()
onMounted(() => {
  //GetreqtraceSearchByFis('78202580130127')
})
const GetreqtraceSearchByFis = async (fis: any) => {
  loading1.value = true
  let result = await reqtraceSearchByFis(fis)
  if (result.code == 200) {
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
    data24IS110.value = result.data.data['24IS110']
    data24IS170.value = result.data.data['24IS170']
    data24IS060.value = result.data.data['24IS060']
    data24IS120.value = result.data.data['24IS120']
    //时间和节点计数
    points.value = result.data['points']
    timeDetla.value = result.data['timeDetla']
    loading1.value = false

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
</script>
<style scoped>
.title {
  text-align: left;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 20px;
}
</style>
