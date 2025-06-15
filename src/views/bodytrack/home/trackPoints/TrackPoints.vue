<!--
 * @LastEditTime: 2024-03-20 14:30
 -->
<template>
    <div class="track-points-container">

        <div v-for="(point, index) in points" :key="index" class="track-point"
            :class="[point.id, { 'editing': isEditingIndex === index }]" :style="getPointStyle(point, index)"
            @click.stop="handlePointClick(point, index)">
            <!-- <div class="point-dot"></div> -->
            <!-- 显示av的sq 过点次数大于1怎显示成小组样式-->
            <div :class="!isDebugMode&&point.av&&point.av.length > 1 ? 'groupstyle' : ''">
                <div v-if="!isDebugMode" v-for="(av, index) in point.av">
                    <!-- <div class="groupstyle"> -->
                    <!-- <div :class="av.sq != 999 ? 'point-label_circle' : ''" >{{ av.sq != 999 ? av.sq : '' }}</div> -->
                    <div
                        :class="{ firstpointStyle: av.sq == pointFirst, lastpointStyle: av.sq == pointLast, defaultpointStyle: av.sq != pointLast && av.sq != pointFirst }">
                        {{ av.sq != 999 ? av.sq : '' }}
                    </div>
                    <div :class="av.dateTime ? 'point-label_time' : ''">{{ av.dateTime ? av.dateTime.slice(5, 20) : ''}}
                    </div>
                </div>
            </div>
            <div v-if="isDebugMode" class="point-label">{{ point.name }}</div>
        </div>
            
    </div>

    
</template>

<script setup>
// import { Circle } from 'echarts/types/src/util/graphic.js';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    // 点位数据数组
    points: {
        type: Array,
        required: true,
        default: () => []
    },
    // 当前编辑的点位索引
    isEditingIndex: {
        type: Number,
        default: -1
    },
    // 点的大小（直径，单位：像素）
    dotSize: {
        type: Number,
        default: 12
    },
    // 点的颜色
    dotColor: {
        type: String,
        default: '#ff0000'
    },
    // 选中点的颜色
    activeColor: {
        type: String,
        default: '#ffff00'
    },
    // 是否开启调试模式
    isDebugMode: {
        type: Boolean,
        default: false
    },
    // 是否第一个点
    pointFirst: {
        type: String,
        default: false
    },
    // 是否最后个点
    pointLast: {
        type: String,
        default: false
    },
});

const emit = defineEmits(['point-click']);

// 计算点位样式
const getPointStyle = (point, index) => {
    return {
        left: `${point.xPercent}%`,
        top: `${point.yPercent}%`,
        '--dot-size': `${props.dotSize}px`,
        '--dot-color': props.dotColor,
        '--active-color': props.activeColor
    };
};

// 点击处理
const handlePointClick = (point, index) => {
    emit('point-click', point, index);
};
</script>

<style scoped>
.track-points-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.track-point {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.point-dot {
    width: var(--dot-size);
    height: var(--dot-size);
    border-radius: 50%;
    background-color: var(--dot-color);
    border: 2px solid white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
}

.point-label {
    background-color: chocolate;
    color: white;
    padding: 2px 2px;
    border-radius: 5%;
    font-size: 14px;
    white-space: nowrap;
    transform: translateY(0%);
}

.point-label_circle {
    background-color: coral;
    /* width: 100x;
    height: 100x; */
    /* border-radius: 50%; */
    font-size: 14px;
    white-space: nowrap;
    transform: translateY(0%);
}

.point-label_time {
    background-color:dodgerblue;
    opacity: 0.8;
    color: white;
    padding: 2px 2px;
    border-radius: 4px;
    font-size: 10px;
    white-space: nowrap;
    transform: translateY(0%);
}

.track-point.editing .point-dot {
    background-color: var(--active-color);
    border-color: #fff;
    box-shadow: 0 0 8px var(--active-color);
    transform: scale(1.2);
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
    }

    50% {
        box-shadow: 0 0 20px rgba(255, 255, 0, 1);
    }

    100% {
        box-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
    }
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .point-label {
        font-size: 10px;
        padding: 1px 4px;
    }

    .point-dot {
        width: calc(var(--dot-size) * 0.75);
        height: calc(var(--dot-size) * 0.75);
    }
}

.firstpointStyle {
    background-color: chartreuse;
    opacity: 0.7;
    /* width: 100x;
    height: 100x; */
    /* border-radius: 50%; */
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    transform: translateY(0%);
}

.lastpointStyle {
    background-color:red;
    opacity: 0.7;
    /* width: 100x;
    height: 100x; */
    /* border-radius: 50%; */
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    transform: translateY(0%);
}

.defaultpointStyle {
    background-color: darkorange;
    opacity: 0.7;
    /* width: 100x;
    height: 100x; */
    /* border-radius: 50%; */
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    transform: translateY(0%);
}

.groupstyle {
    background-color:aliceblue;
    opacity: 0.9;
    border: dashed, 1px, blue;
    border-radius: 4px;
    padding: 5px;
}
</style>