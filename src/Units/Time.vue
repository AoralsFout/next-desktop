<template>
    <div class="time-unit">
        <div class="time-display">
            <div class="time">{{ formattedTime }}</div>
            <div class="date">{{ formattedDate }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

// 格式化时间
const formattedTime = ref('')
// 格式化日期
const formattedDate = ref('')

let timeInterval = null

// 更新时间显示
const updateTimeDisplay = () => {
    const now = dayjs()
    
    // 时间格式：HH:mm:ss
    formattedTime.value = now.format('HH:mm:ss')
    
    // 日期格式：YYYY年MM月DD日 星期X
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const weekday = weekdays[now.day()]
    formattedDate.value = now.format(`YYYY年MM月DD日 星期${weekday}`)
}

// 启动时间更新
const startTimeUpdate = () => {
    updateTimeDisplay()
    timeInterval = setInterval(updateTimeDisplay, 1000)
}

// 停止时间更新
const stopTimeUpdate = () => {
    if (timeInterval) {
        clearInterval(timeInterval)
        timeInterval = null
    }
}

onMounted(() => {
    startTimeUpdate()
})

onUnmounted(() => {
    stopTimeUpdate()
})
</script>

<style scoped>
.time-unit {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.time-display {
    text-align: center;
    color: rgb(0, 0, 0);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.time {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: 2px;
}

.date {
    font-size: 1.5rem;
    font-weight: lighter;
    opacity: 0.9;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>