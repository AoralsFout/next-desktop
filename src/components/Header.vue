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
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px"
                    height="20px" viewBox="0 -0.5 21 21" version="1.1">
                    <g id="Page-1" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -560.000000)" fill="#000000">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <path
                                    d="M378.381271,401.145 C377.596921,400.752 376.64982,401.278 376.64982,402.123 C376.64982,402.552 376.91862,402.925 377.316571,403.126 C380.236622,404.602 382.110873,407.716 381.575372,411.174 C381.046172,414.602 378.050521,417.343 374.434319,417.728 C369.515067,418.251 365.333966,414.581 365.333966,410 C365.333966,407.004 367.121066,404.4 369.733467,403.101 C370.102018,402.918 370.349818,402.572 370.349818,402.176 L370.349818,402.084 C370.349818,401.256 369.423717,400.745 368.651967,401.129 C364.951765,402.966 362.545164,406.841 363.072265,411.191 C363.624565,415.742 367.515866,419.43 372.296519,419.936 C378.634321,420.607 383.999823,415.9 383.999823,410 C383.999823,406.155 381.722372,402.818 378.381271,401.145 M372.449819,409 L372.449819,401 C372.449819,400.447 372.920219,400 373.499819,400 C374.080469,400 374.549819,400.447 374.549819,401 L374.549819,409 C374.549819,409.552 374.080469,410 373.499819,410 C372.920219,410 372.449819,409.552 372.449819,409"
                                    id="shut_down-[#1431]">
                                </path>
                            </g>
                        </g>
                    </g>
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
                <div class="menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M14.1395 12.0002C14.1395 13.1048 13.2664 14.0002 12.1895 14.0002C11.1125 14.0002 10.2395 13.1048 10.2395 12.0002C10.2395 10.8957 11.1125 10.0002 12.1895 10.0002C13.2664 10.0002 14.1395 10.8957 14.1395 12.0002Z"
                            stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.57381 18.1003L5.12169 12.8133C4.79277 12.2907 4.79277 11.6189 5.12169 11.0963L7.55821 5.89229C7.93118 5.32445 8.55898 4.98876 9.22644 5.00029H12.1895H15.1525C15.8199 4.98876 16.4477 5.32445 16.8207 5.89229L19.2524 11.0923C19.5813 11.6149 19.5813 12.2867 19.2524 12.8093L16.8051 18.1003C16.4324 18.674 15.8002 19.0133 15.1281 19.0003H9.24984C8.5781 19.013 7.94636 18.6737 7.57381 18.1003Z"
                            stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <span>设置</span>
            </div>
            <div class="context-menu-item" @click="handleOpenInfo">
                <div class="menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="-0.5 0 25 25"
                        fill="none">
                        <path
                            d="M12 21.5C17.1086 21.5 21.25 17.3586 21.25 12.25C21.25 7.14137 17.1086 3 12 3C6.89137 3 2.75 7.14137 2.75 12.25C2.75 17.3586 6.89137 21.5 12 21.5Z"
                            stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M12.9309 8.15005C12.9256 8.39231 12.825 8.62272 12.6509 8.79123C12.4767 8.95974 12.2431 9.05271 12.0008 9.05002C11.8242 9.04413 11.6533 8.98641 11.5093 8.884C11.3652 8.7816 11.2546 8.63903 11.1911 8.47415C11.1275 8.30927 11.1139 8.12932 11.152 7.95675C11.19 7.78419 11.278 7.6267 11.405 7.50381C11.532 7.38093 11.6923 7.29814 11.866 7.26578C12.0397 7.23341 12.2192 7.25289 12.3819 7.32181C12.5446 7.39072 12.6834 7.506 12.781 7.65329C12.8787 7.80057 12.9308 7.97335 12.9309 8.15005ZM11.2909 16.5301V11.1501C11.2882 11.0556 11.3046 10.9615 11.3392 10.8736C11.3738 10.7857 11.4258 10.7057 11.4922 10.6385C11.5585 10.5712 11.6378 10.518 11.7252 10.4822C11.8126 10.4464 11.9064 10.4286 12.0008 10.43C12.094 10.4299 12.1863 10.4487 12.272 10.4853C12.3577 10.5218 12.4352 10.5753 12.4997 10.6426C12.5642 10.7099 12.6143 10.7895 12.6472 10.8767C12.6801 10.9639 12.6949 11.0569 12.6908 11.1501V16.5301C12.6908 16.622 12.6727 16.713 12.6376 16.7979C12.6024 16.8828 12.5508 16.96 12.4858 17.025C12.4208 17.09 12.3437 17.1415 12.2588 17.1767C12.1738 17.2119 12.0828 17.23 11.9909 17.23C11.899 17.23 11.8079 17.2119 11.723 17.1767C11.6381 17.1415 11.5609 17.09 11.4959 17.025C11.4309 16.96 11.3793 16.8828 11.3442 16.7979C11.309 16.713 11.2909 16.622 11.2909 16.5301Z"
                            fill="#000000" />
                    </svg>
                </div>
                <span>关于</span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" @click="handleExitApp">
                <div class="menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                        height="15px" viewBox="0 -0.5 21 21" version="1.1">
                        <g id="Page-1" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd">
                            <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -560.000000)"
                                fill="#000000">
                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                    <path
                                        d="M378.381271,401.145 C377.596921,400.752 376.64982,401.278 376.64982,402.123 C376.64982,402.552 376.91862,402.925 377.316571,403.126 C380.236622,404.602 382.110873,407.716 381.575372,411.174 C381.046172,414.602 378.050521,417.343 374.434319,417.728 C369.515067,418.251 365.333966,414.581 365.333966,410 C365.333966,407.004 367.121066,404.4 369.733467,403.101 C370.102018,402.918 370.349818,402.572 370.349818,402.176 L370.349818,402.084 C370.349818,401.256 369.423717,400.745 368.651967,401.129 C364.951765,402.966 362.545164,406.841 363.072265,411.191 C363.624565,415.742 367.515866,419.43 372.296519,419.936 C378.634321,420.607 383.999823,415.9 383.999823,410 C383.999823,406.155 381.722372,402.818 378.381271,401.145 M372.449819,409 L372.449819,401 C372.449819,400.447 372.920219,400 373.499819,400 C374.080469,400 374.549819,400.447 374.549819,401 L374.549819,409 C374.549819,409.552 374.080469,410 373.499819,410 C372.920219,410 372.449819,409.552 372.449819,409"
                                        id="shut_down-[#1431]">
                                    </path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
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
    display: flex;
    justify-content: center;
    align-items: center;
}

.context-menu-divider {
    height: 1px;
    background-color: var(--header-border, rgba(255, 255, 255, 0.1));
    margin: 4px 8px;
}
</style>