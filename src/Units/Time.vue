<template>
    <div class="time-unit">
        <div class="time-display">
            <div class="time" :style="timeStyle">{{ formattedTime }}</div>
            <div class="date" :style="dateStyle" v-if="showDate">{{ formattedDate }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
    unitId: {
        type: String,
        required: true
    }
})

// 格式化时间
const formattedTime = ref('')
// 格式化日期
const formattedDate = ref('')

// 设置项
const timeFormat = ref('HH:mm:ss')
const dateFormat = ref('YYYY年MM月DD日')
const showSeconds = ref(true)
const showDate = ref(true)
const fontSize = ref(3.5)
const fontColor = ref('#000000')

let timeInterval = null

const timeStyle = computed(() => ({
    fontSize: `${fontSize.value}rem`,
    color: fontColor.value
}))

const dateStyle = computed(() => ({
    fontSize: `${fontSize.value * 0.45}rem`,
    color: fontColor.value,
    opacity: 0.9
}))

// 更新时间显示
const updateTimeDisplay = () => {
    const now = dayjs()
    
    // 时间格式
    let timeFormatStr = timeFormat.value
    if (!showSeconds.value) {
        timeFormatStr = timeFormatStr.replace(':ss', '')
        timeFormatStr = timeFormatStr.replace(':ss A', ' A')
        timeFormatStr = timeFormatStr.replace(':ss AM', ' AM')
        timeFormatStr = timeFormatStr.replace(':ss PM', ' PM')
    }
    formattedTime.value = now.format(timeFormatStr)
    
    // 日期格式
    if (showDate.value) {
        const weekdays = ['日', '一', '二', '三', '四', '五', '六']
        const weekday = weekdays[now.day()]
        let dateFormatStr = dateFormat.value
        if (dateFormatStr.includes('星期')) {
            dateFormatStr = dateFormatStr.replace('星期X', `星期${weekday}`)
        }
        formattedDate.value = now.format(dateFormatStr)
    } else {
        formattedDate.value = ''
    }
}

// 启动时间更新
const startTimeUpdate = () => {
    loadSettings() // 加载设置
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

// 监听设置更新事件
const handleSettingsUpdated = (event) => {
    const { unitId, settings } = event.detail
    // 检查是否是当前Unit的设置更新，或者是Time组件的全局设置更新
    if (unitId === props.unitId || !unitId) {
        loadSettings()
        updateTimeDisplay()
    }
}

// 加载设置
const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem(`unitSettings_Time_${props.unitId}`)
        console.log(`unitSettings_Time_${props.unitId}`);
        
        console.log('加载设置:', savedSettings)
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            timeFormat.value = settings.timeFormat || 'HH:mm:ss'
            dateFormat.value = settings.dateFormat || 'YYYY年MM月DD日'
            showSeconds.value = settings.showSeconds !== undefined ? settings.showSeconds : true
            showDate.value = settings.showDate !== undefined ? settings.showDate : true
            fontSize.value = settings.fontSize || 3.5
            fontColor.value = settings.fontColor || '#000000'
        }
    } catch (error) {
        console.error('加载设置失败:', error)
    }
}

onMounted(() => {
    startTimeUpdate()
    window.addEventListener('unitSettingsUpdated', handleSettingsUpdated)
})

onUnmounted(() => {
    stopTimeUpdate()
    window.removeEventListener('unitSettingsUpdated', handleSettingsUpdated)
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
    transition: all 0.3s ease;
}

.time-display {
    text-align: center;
    transition: all 0.3s ease;
}

.time {
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: 2px;
    transition: all 0.3s ease;
}

.date {
    font-weight: lighter;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: all 0.3s ease;
}
</style>