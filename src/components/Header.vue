<template>
    <div class="app-header" :style="{
        'background-color': getHeaderBgColor(),
        'backdrop-filter': getHeaderBlur()
    }" @contextmenu.prevent="handleHeaderContextMenu">
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
        
        <!-- 右键菜单 -->
        <div 
            v-show="shouldShowContextMenu" 
            class="header-context-menu"
            :class="currentAnimationClass"
            :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
            @click.stop
            @animationend="handleAnimationEnd"
            ref="contextMenuRef"
        >
            <div class="context-menu-item" @click="handleCloseAllWindows">
                <span class="menu-icon">✕</span>
                <span>关闭所有窗口</span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" @click="handleOpenSetting">
                <span class="menu-icon">⚙</span>
                <span>设置</span>
            </div>
            <div class="context-menu-item" @click="handleOpenInfo">
                <span class="menu-icon">ℹ</span>
                <span>关于</span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" @click="handleExitApp">
                <span class="menu-icon">🚪</span>
                <span>退出应用</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import configManager from '/src/utils/config.js'
import dayjs from 'dayjs'

// 导入动画样式
import '../assets/style/windowAnimations/index.css'

// 背景设置
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
    hideContextMenu()
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

// 打开文件
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

// 打开信息
const handleOpenInfo = () => {
    hideContextMenu()
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

// 打开时间
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


// 打开Unit管理器
const handleOpenUnitManager = () => {
    window.dispatchEvent(new CustomEvent('openUnitManager'))
}

const handleExitApp = () => {
    hideContextMenu()
    window.dispatchEvent(new CustomEvent('exitApp'))
}

// 右键菜单相关
const contextMenuRef = ref(null)
const isContextMenuVisible = ref(false)
const isContextMenuAnimating = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedAnimation = ref('windowFadeIn')

// 计算是否应该显示右键菜单
const shouldShowContextMenu = computed(() => {
    return isContextMenuVisible.value || isContextMenuAnimating.value
})

// 获取对应的关闭动画类名
const getCloseAnimationClass = (openAnimation) => {
    const animationMap = {
        'windowFadeIn': 'windowFadeOut',
        'windowSlideIn': 'windowSlideOut',
        'windowScaleIn': 'windowScaleOut',
        'windowBounceIn': 'windowBounceOut',
        'windowFlipIn': 'windowFlipOut',
        'noAnimation': 'noAnimation'
    }
    return animationMap[openAnimation] || 'windowFadeOut'
}

// 计算当前动画类名
const currentAnimationClass = computed(() => {
    const config = configManager.getConfig()
    if (!isContextMenuVisible.value && !isContextMenuAnimating.value) {
        return ''
    }
    
    const animationClass = isContextMenuVisible.value ? 
        selectedAnimation.value : 
        getCloseAnimationClass(selectedAnimation.value)
    
    return [
        'windowAnimation',
        animationClass,
        config.animationSpeed || 'windowFast'
    ]
})

// 加载动画设置（与MouseMenu一致）
const loadAnimationSettings = () => {
    const config = configManager.getConfig()
    if (config.enableAnimations !== false) {
        selectedAnimation.value = config.mouseMenuAnimation || 'windowFadeIn'
    } else {
        selectedAnimation.value = 'noAnimation'
    }
}

// 处理无动画情况下的状态更新
const handleNoAnimationState = () => {
    if (selectedAnimation.value === 'noAnimation') {
        setTimeout(() => {
            isContextMenuAnimating.value = false
        }, 10)
    }
}

// 调整菜单位置，确保不超出屏幕边界
const adjustMenuPosition = (x, y) => {
    const menuWidth = 180
    const menuHeight = 180
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    let adjustedX = x
    let adjustedY = y
    
    // 水平边界检测
    if (x + menuWidth > screenWidth) {
        adjustedX = screenWidth - menuWidth - 10
    }
    
    // 垂直边界检测
    if (y + menuHeight > screenHeight) {
        adjustedY = screenHeight - menuHeight - 10
    }
    
    // 确保位置不小于0
    adjustedX = Math.max(10, adjustedX)
    adjustedY = Math.max(10, adjustedY)
    
    return { x: adjustedX, y: adjustedY }
}

// 显示右键菜单
const showContextMenu = async (x, y) => {
    if (isContextMenuAnimating.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    loadAnimationSettings()
    
    const adjustedPosition = adjustMenuPosition(x, y)
    contextMenuPosition.value = adjustedPosition
    isContextMenuAnimating.value = true
    await nextTick()
    isContextMenuVisible.value = true
    
    handleNoAnimationState()
}

// 隐藏右键菜单
const hideContextMenu = () => {
    if (!isContextMenuVisible.value && !isContextMenuAnimating.value) return
    
    isContextMenuVisible.value = false
    isContextMenuAnimating.value = true
    
    handleNoAnimationState()
}

// 处理 Header 右键点击
const handleHeaderContextMenu = (event) => {
    showContextMenu(event.clientX, event.clientY)
}

// 处理动画结束事件
const handleAnimationEnd = (event) => {
    if (event.animationName.includes('Out') || event.animationName.includes('Close')) {
        isContextMenuAnimating.value = false
    } else if (event.animationName.includes('In')) {
        isContextMenuAnimating.value = false
    }
}

// 处理关闭所有窗口
const handleCloseAllWindows = () => {
    hideContextMenu()
    window.dispatchEvent(new CustomEvent('closeAllWindows'))
}

// 处理点击其他地方隐藏菜单
const handleClickOutside = (event) => {
    if ((isContextMenuVisible.value || isContextMenuAnimating.value) && 
        !event.target.closest('.header-context-menu')) {
        hideContextMenu()
    }
}

// 处理键盘事件（ESC键隐藏菜单）
const handleKeydown = (event) => {
    if (event.key === 'Escape' && (isContextMenuVisible.value || isContextMenuAnimating.value)) {
        hideContextMenu()
    }
}

onMounted(() => {
    startTimeUpdate()
    window.addEventListener('configUpdated', handleConfigUpdated)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    loadAnimationSettings()
})

onUnmounted(() => {
    stopTimeUpdate()
    window.removeEventListener('configUpdated', handleConfigUpdated)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.app-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.8vw;
    display: flex;
    padding: 0.2vw 0.5vw;
    justify-content: space-between;
    align-items: center;
    /* background-color: var(--header-bg); */
    color: var(--header-text);
    z-index: 1000000;
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

/* 右键菜单样式 */
.header-context-menu {
    position: fixed;
    background-color: var(--header-bg);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 4px 0;
    min-width: 160px;
    border: 1px solid var(--header-border, rgba(255, 255, 255, 0.1));
    z-index: 1000001;
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: scale(0.95);
}

.header-context-menu.windowAnimation {
    opacity: 1;
    transform: scale(1);
}

.context-menu-item {
    padding: 8px 16px;
    color: var(--header-text);
    font-size: 14px;
    transition: background-color 0.1s ease-in-out;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.context-menu-item:hover {
    background-color: var(--header-hover);
}

.context-menu-item:active {
    background-color: var(--header-active);
}

.menu-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
}

.context-menu-divider {
    height: 1px;
    background-color: var(--header-border, rgba(255, 255, 255, 0.1));
    margin: 4px 8px;
}
</style>