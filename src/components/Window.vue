<!-- 窗口组件框架 - 支持多窗口 -->
<template>
    <div v-show="shouldShowWindow" class="window-container" :class="currentAnimationClass" :style="windowStyle"
        @click="bringToFront" @animationend="handleAnimationEnd" ref="windowRef" :data-window-id="windowId">
        <!-- 窗口标题栏 -->
        <div class="window-header" @mousedown="startDrag">
            <div class="window-title">
                {{ title }}
            </div>
            <div class="window-controls">
                <!-- 我觉得不太需要最小化或者最大化（不是因为我不会做） -->
                <!-- <button class="control-btn minimize" @click="minimize">−</button>
                <button class="control-btn maximize" @click="toggleMaximize">□</button> -->
                <button class="control-btn close" @click="close">×</button>
            </div>
        </div>

        <!-- 窗口内容区域 -->
        <div class="window-content">
            <!-- 动态加载apps文件夹中的组件 -->
            <component :is="currentComponent" v-if="currentComponent" :key="componentKey" v-bind="componentProps" />
            <div v-else class="no-component">
                未加载应用
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, markRaw } from 'vue'
import configManager from '../utils/config.js'

// 导入动画样式
import '../assets/style/windowAnimations/index.css'

const props = defineProps({
    windowId: {
        type: String,
        default: () => `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
})

const windowRef = ref(null)

// 窗口状态
const isVisible = ref(false)
const isAnimating = ref(false)
const isMaximized = ref(false)
const isDragging = ref(false)
const isActive = ref(false)

// 窗口位置和尺寸
const windowPosition = ref({ x: 100, y: 100 })
const windowSize = ref({ width: 800, height: 600 })
const dragOffset = ref({ x: 0, y: 0 })

// 当前显示的组件
const currentComponent = ref(null)
const componentKey = ref(0)

// 窗口标题
const title = ref('窗口')

// 组件props
const componentProps = ref({})

// 动画设置
const selectedAnimation = ref('windowFadeIn')
const animationSpeed = ref('windowFast')

// 获取配置
const loadConfig = () => {
    const config = configManager.getConfig()
    selectedAnimation.value = config.enableAnimations ? config.windowAnimation : 'noAnimation'
    animationSpeed.value = config.animationSpeed
}

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

// 计算是否应该显示窗口
const shouldShowWindow = computed(() => {
    return isVisible.value || isAnimating.value
})

// 计算当前动画类名
const currentAnimationClass = computed(() => {
    if (!isVisible.value && !isAnimating.value) {
        return ''
    }

    const animationClass = isVisible.value ?
        selectedAnimation.value :
        getCloseAnimationClass(selectedAnimation.value)

    return [
        'windowAnimation',
        animationClass,
        animationSpeed.value,
        { 'window-active': isActive.value }
    ]
})

// 计算窗口样式
const windowStyle = computed(() => {
    if (isMaximized.value) {
        return {
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: isActive.value ? 1000 : 100
        }
    }

    return {
        top: windowPosition.value.y + 'px',
        left: windowPosition.value.x + 'px',
        width: windowSize.value.width + 'px',
        height: windowSize.value.height + 'px',
        zIndex: isActive.value ? 1000 : 100
    }
})

// 将窗口置于最前
const bringToFront = () => {
    // 触发窗口激活事件
    window.dispatchEvent(new CustomEvent('windowActivated', {
        detail: { windowId: props.windowId }
    }))
}

// 激活窗口
const activate = () => {
    isActive.value = true
}

// 取消激活窗口
const deactivate = () => {
    isActive.value = false
}

// 验证并调整窗口尺寸和位置，确保不超出屏幕
const validateAndAdjustWindowBounds = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const headerHeight = 0.018 * screenWidth
    
    // 可用区域：从Header下方到屏幕底部
    const availableHeight = screenHeight - headerHeight
    const minPadding = 10 // 最小边距
    
    // 限制窗口最大宽度（不超过屏幕宽度，留出边距）
    if (windowSize.value.width > screenWidth - minPadding * 2) {
        windowSize.value.width = screenWidth - minPadding * 2
    }
    
    // 限制窗口最大高度（不超过可用高度，留出边距）
    const maxHeight = availableHeight - minPadding * 2
    if (windowSize.value.height > maxHeight) {
        windowSize.value.height = maxHeight
    }
    
    // 确保窗口最小尺寸
    if (windowSize.value.width < 300) {
        windowSize.value.width = 300
    }
    if (windowSize.value.height < 200) {
        windowSize.value.height = 200
    }
    
    // 调整窗口位置，确保不超出屏幕边界
    // 左边界
    if (windowPosition.value.x < 0) {
        windowPosition.value.x = minPadding
    }
    // 右边界
    if (windowPosition.value.x + windowSize.value.width > screenWidth) {
        windowPosition.value.x = screenWidth - windowSize.value.width - minPadding
    }
    // 上边界（不能在Header下方）
    if (windowPosition.value.y < headerHeight) {
        windowPosition.value.y = headerHeight + minPadding
    }
    // 下边界：如果窗口会超出屏幕底部，向上调整位置
    if (windowPosition.value.y + windowSize.value.height > screenHeight) {
        windowPosition.value.y = screenHeight - windowSize.value.height - minPadding
        // 如果调整后位置低于Header，则设置为Header下方
        if (windowPosition.value.y < headerHeight + minPadding) {
            windowPosition.value.y = headerHeight + minPadding
            // 如果还是超出，缩小窗口高度
            if (windowPosition.value.y + windowSize.value.height > screenHeight) {
                windowSize.value.height = screenHeight - windowPosition.value.y - minPadding
            }
        }
    }
}

// 打开窗口
const open = async (componentName, componentTitle = '窗口', options = {}) => {
    // 加载最新配置
    loadConfig()

    // 如果正在动画中，先完成当前动画
    if (selectedAnimation.value !== 'noAnimation' && isAnimating.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 加载组件
    await loadComponent(componentName, options)
    title.value = componentTitle

    // 应用自定义位置和尺寸
    if (options.position) {
        windowPosition.value = { ...options.position }
    }
    if (options.size) {
        windowSize.value = { ...options.size }
    }
    if (options.animation) {
        selectedAnimation.value = options.animation
    }
    
    // 验证并调整窗口边界，确保不超出屏幕
    validateAndAdjustWindowBounds()

    isAnimating.value = true
    await nextTick()
    isVisible.value = true

    // 激活窗口
    activate()
}

// 关闭窗口
const close = () => {
    if (!isVisible.value && !isAnimating.value) return

    isVisible.value = false
    if (selectedAnimation.value !== 'noAnimation') {
        isAnimating.value = true
    } else {
        isAnimating.value = false
    }

    // 触发窗口关闭事件，通知窗口管理器
    window.dispatchEvent(new CustomEvent('windowClosed', {
        detail: { windowId: props.windowId }
    }))
}

// 最小化窗口
const minimize = () => {
    // 这里可以实现最小化逻辑
    console.log('窗口最小化')
}

// 切换最大化/还原
const toggleMaximize = () => {
    isMaximized.value = !isMaximized.value
}

// 加载apps文件夹中的组件
const loadComponent = async (componentName, options = {}) => {
    try {
        // 动态导入apps文件夹中的组件
        const componentModule = await import(`../apps/${componentName}.vue`)
        currentComponent.value = markRaw(componentModule.default)

        // 设置组件props（排除位置、尺寸、动画等窗口选项）
        const { position, size, animation, ...componentOptions } = options
        componentProps.value = componentOptions

        componentKey.value++ // 强制重新渲染
    } catch (error) {
        console.error(`加载组件 ${componentName} 失败:`, error)
        currentComponent.value = null
        componentProps.value = {}
    }
}

// 开始拖拽窗口
const startDrag = (event) => {
    if (isMaximized.value) return

    isDragging.value = true
    dragOffset.value = {
        x: event.clientX - windowPosition.value.x,
        y: event.clientY - windowPosition.value.y
    }

    // 激活窗口
    activate()

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
}

// 处理拖拽
const handleDrag = (event) => {
    if (!isDragging.value) return

    // 计算新的窗口位置
    let newX = event.clientX - dragOffset.value.x
    let newY = event.clientY - dragOffset.value.y

    // 获取屏幕边界
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // 计算Header的实际高度（1.8vw转换为像素）
    const headerHeight = 0.018 * screenWidth

    // 边界检测 - 确保窗口不会超出屏幕
    // 左边界检测
    if (newX < 0) {
        newX = 0
    }
    // 上边界检测
    // Window 不能超过顶部 Header 的高度（1.8vw）
    if (newY < headerHeight) {
        newY = headerHeight
    }
    // 右边界检测
    if (newX + windowSize.value.width > screenWidth) {
        newX = screenWidth - windowSize.value.width
    }
    // 下边界检测
    if (newY + windowSize.value.height > screenHeight) {
        newY = screenHeight - windowSize.value.height
    }

    windowPosition.value = {
        x: newX,
        y: newY
    }
}

// 停止拖拽
const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
}

// 处理动画结束事件
const handleAnimationEnd = (event) => {
    if (event.animationName.includes('Out') || event.animationName.includes('Close')) {
        // 关闭动画结束
        isAnimating.value = false
        currentComponent.value = null // 清理组件
    } else if (event.animationName.includes('In')) {
        // 打开动画结束
        isAnimating.value = false
    }
}

// 处理窗口激活事件
const handleWindowActivated = (event) => {
    if (event.detail.windowId !== props.windowId) {
        deactivate()
    } else {
        activate()
    }
}

const handleConfigUpdated = (event) => {
    loadConfig()
}

onMounted(() => {
    // 加载初始配置
    loadConfig()

    // 添加事件监听器
    windowRef.value.addEventListener('animationend', handleAnimationEnd)
    window.addEventListener('windowActivated', handleWindowActivated)
    window.addEventListener('configUpdated', handleConfigUpdated)
})

onBeforeUnmount(() => {
    // 移除事件监听器
    windowRef.value.removeEventListener('animationend', handleAnimationEnd)
    window.removeEventListener('windowActivated', handleWindowActivated)
    window.removeEventListener('configUpdated', handleConfigUpdated)
})

// 暴露方法给父组件使用
defineExpose({
    open,
    close,
    minimize,
    toggleMaximize,
    activate,
    deactivate,
    windowId: props.windowId
})
</script>

<style scoped>
.window-container {
    position: fixed;
    z-index: 1;
    background-color: var(--window-bg);
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--window-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 确保动画能正常工作 */
    opacity: 0;
    transform: scale(0.95);
}

.window-container.windowAnimation {
    opacity: 1;
    transform: scale(1);
}

.window-header {
    height: 40px;
    background-color: var(--window-header-bg);
    border-bottom: 1px solid var(--window-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    cursor: move;
    user-select: none;
    -webkit-app-region: drag;
}

.window-title {
    color: var(--window-text);
    font-size: 14px;
    font-weight: 500;
}

.window-controls {
    display: flex;
    gap: 8px;
    -webkit-app-region: no-drag;
}

.control-btn {
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 3px;
    background-color: var(--window-controls-bg);
    color: var(--window-text);
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.control-btn:hover {
    background-color: var(--window-controls-hover);
}

.control-btn.close:hover {
    background-color: var(--window-controls-close-hover);
}

.control-btn.minimize:hover {
    background-color: var(--window-controls-minimize-hover);
}

.control-btn.maximize:hover {
    background-color: var(--window-controls-maximize-hover);
}

.window-content {
    flex: 1;
    overflow: auto;
    background-color: var(--window-bg);
    color: var(--window-text);
}

.window-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.window-content::-webkit-scrollbar-track {
    background: var(--window-header-bg);
    border-radius: 4px;
}

.window-content::-webkit-scrollbar-thumb {
    background: var(--window-controls-bg);
    border-radius: 4px;
}

.window-content::-webkit-scrollbar-thumb:hover {
    background: var(--window-controls-hover);
}

.no-component {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
    font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .window-container {
        width: 90% !important;
        height: 80% !important;
        left: 5% !important;
        top: 10% !important;
    }
}
</style>