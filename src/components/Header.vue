<template>
    <div class="app-header" :style="{
        'background-color': getHeaderBgColor(),
        'backdrop-filter': getHeaderBlur()
    }">
        <div class="header-left">
            <div class="header-item" @click="handleOpenInfo">
                Next-Desktop dev V0.0.1
            </div>
        </div>
        <div class="header-center">
            <div class="header-item time-display" @click="handleOpenTime">
                {{ formattedTime }}
            </div>
        </div>
        <div class="header-right">
            <div class="header-item" @click="handleOpenUnitManager">
                units
            </div>
            <div class="header-item" @click="handleOpenFilesView">
                files
            </div>
            <div class="header-item" @click="handleOpenSetting">
                setting
            </div>
            <div class="header-item" @click="handleExitApp">
                exit
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import configManager from '/src/utils/config.js'
import dayjs from 'dayjs'

const getHeaderBgColor = () => {
    const config = configManager.getConfig()
    const root = document.documentElement
    // 根据十六进制颜色和透明度生成 rgba 字符串
    const hexColor = getComputedStyle(root).getPropertyValue('--header-bg') || '#f0f0f0'
    const opacity = config.headerOpacity
    return `rgba(${parseInt(hexColor.slice(1, 3), 16)}, ${parseInt(hexColor.slice(3, 5), 16)}, ${parseInt(hexColor.slice(5, 7), 16)}, ${opacity})`
}

const getHeaderBlur = () => {
    const config = configManager.getConfig()
    const blur = config.enableHeaderBlur ? config.headerBlur : 0
    return `blur(${blur}px)`
}

// 时间显示相关
const formattedTime = ref('')
let timeInterval = null

// 格式化时间
const formatTime = () => {
    const config = configManager.getConfig()
    const now = dayjs()

    let timeFormat = config.timeFormat || 'HH:mm:ss'
    let dateFormat = config.dateFormat || 'YYYY-MM-DD'
    const showSeconds = config.showSeconds !== undefined ? config.showSeconds : true
    const showDate = config.showDate !== undefined ? config.showDate : false

    // 根据设置调整时间格式
    if (!showSeconds) {
        timeFormat = timeFormat.replace(':ss', '')
        timeFormat = timeFormat.replace(':ss A', ' A')
        timeFormat = timeFormat.replace(':ss AM', ' AM')
        timeFormat = timeFormat.replace(':ss PM', ' PM')
    }

    let result = now.format(timeFormat)

    if (showDate) {
        const dateStr = now.format(dateFormat)
        result = `${dateStr} ${result}`
    }

    return result
}

// 更新时间显示
const updateTimeDisplay = () => {
    formattedTime.value = formatTime()
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

// 处理配置更新
const handleConfigUpdated = () => {
    updateTimeDisplay()
}

// 打开设置
const handleOpenSetting = () => {
    const config = configManager.getConfig()
    window.dispatchEvent(new CustomEvent('openWindow', {
        detail: {
            componentName: 'Settings',
            componentTitle: '设置',
            options: {
                animation: config.windowAnimation || 'windowFadeIn',
                size: {
                    width: 500,
                    height: 600
                }
            }
        }
    }))
}

const handleOpenFilesView = () => {
    const config = configManager.getConfig()
    window.dispatchEvent(new CustomEvent('openWindow', {
        detail: {
            componentName: 'FilesView',
            componentTitle: '文件',
            options: {
                animation: config.windowAnimation || 'windowFadeIn',
                size: {
                    width: 1000,
                    height: 600
                }
            }
        }
    }))
}

const handleOpenInfo = () => {
    const config = configManager.getConfig()
    window.dispatchEvent(new CustomEvent('openWindow', {
        detail: {
            componentName: 'Info',
            componentTitle: '信息',
            options: {
                animation: config.windowAnimation || 'windowFadeIn',
                size: {
                    width: 400,
                    height: 300
                }
            }
        }
    }))
}

const handleOpenTime = () => {
    const config = configManager.getConfig()
    window.dispatchEvent(new CustomEvent('openWindow', {
        detail: {
            componentName: 'Time',
            componentTitle: '时间',
            options: {
                animation: config.windowAnimation || 'windowFadeIn'
            }
        }
    }))
}

const handleOpenUnitManager = () => {
    window.dispatchEvent(new CustomEvent('openUnitManager'))
}

const handleExitApp = () => {
    window.dispatchEvent(new CustomEvent('exitApp'))
}

onMounted(() => {
    startTimeUpdate()
    window.addEventListener('configUpdated', handleConfigUpdated)
})

onUnmounted(() => {
    stopTimeUpdate()
    window.removeEventListener('configUpdated', handleConfigUpdated)
})
</script>

<style scoped>
.app-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.5vw;
    display: flex;
    padding: 0.1vw 0;
    justify-content: space-between;
    align-items: center;
    /* background-color: var(--header-bg); */
    color: var(--header-text);
    z-index: 1;
    user-select: none;
}

.header-left,
.header-center,
.header-right {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-left {
    margin-left: 0.1vw;
}

.header-right {
    margin-right: 0.1vw;
}

.header-item {
    height: 100%;
    cursor: pointer;
    color: var(--header-text);
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    border-radius: 10px;
    transition: background-color 0.1s ease-in-out;
}

/* .time-display {} */

.header-item:hover {
    background-color: var(--header-hover);
}

.header-item:active {
    background-color: var(--header-active);
}
</style>