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
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#000000" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="header-item" @click="handleOpenFilesView">
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z"
                        stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="header-item" @click="handleOpenSetting">
                <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M14.1395 12.0002C14.1395 13.1048 13.2664 14.0002 12.1895 14.0002C11.1125 14.0002 10.2395 13.1048 10.2395 12.0002C10.2395 10.8957 11.1125 10.0002 12.1895 10.0002C13.2664 10.0002 14.1395 10.8957 14.1395 12.0002Z"
                        stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M7.57381 18.1003L5.12169 12.8133C4.79277 12.2907 4.79277 11.6189 5.12169 11.0963L7.55821 5.89229C7.93118 5.32445 8.55898 4.98876 9.22644 5.00029H12.1895H15.1525C15.8199 4.98876 16.4477 5.32445 16.8207 5.89229L19.2524 11.0923C19.5813 11.6149 19.5813 12.2867 19.2524 12.8093L16.8051 18.1003C16.4324 18.674 15.8002 19.0133 15.1281 19.0003H9.24984C8.5781 19.013 7.94636 18.6737 7.57381 18.1003Z"
                        stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="header-item" @click="handleExitApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M16.0563 9.08667C16.5075 8.7626 17.1448 8.86318 17.389 9.36214C17.7211 10.0405 17.9234 10.7783 17.9821 11.5373C18.0668 12.6322 17.8494 13.7293 17.3536 14.7091C16.8577 15.6889 16.1025 16.5139 15.1702 17.0941C14.2379 17.6743 13.1642 17.9875 12.0661 17.9996C10.968 18.0117 9.8877 17.7222 8.94281 17.1627C7.99791 16.6032 7.2247 15.7951 6.70741 14.8264C6.19012 13.8577 5.94858 12.7657 6.00913 11.6692C6.0511 10.9091 6.23713 10.167 6.55416 9.4815C6.78734 8.97728 7.42223 8.86269 7.88047 9.17673C8.33871 9.49078 8.44139 10.1155 8.25163 10.6377C8.11874 11.0033 8.03945 11.3881 8.0178 11.7801C7.97756 12.509 8.1381 13.2349 8.48196 13.8787C8.82581 14.5226 9.33977 15.0598 9.96785 15.4317C10.5959 15.8036 11.314 15.9961 12.0439 15.988C12.7738 15.98 13.4875 15.7718 14.1073 15.3861C14.727 15.0004 15.229 14.4521 15.5586 13.8008C15.8882 13.1495 16.0327 12.4202 15.9764 11.6924C15.9461 11.301 15.8584 10.918 15.7174 10.5554C15.5162 10.0376 15.6051 9.41073 16.0563 9.08667Z"
                        fill="#000000" />
                    <path
                        d="M12 8V12M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="#000000" stroke-width="2" stroke-linecap="round" />
                </svg>
            </div>
        </div>

        <!-- 右键菜单 -->
        <div v-show="shouldShowContextMenu" class="header-context-menu" :class="currentAnimationClass"
            :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }" @click.stop
            @animationend="handleAnimationEnd" ref="contextMenuRef">
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
    display: flex;
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