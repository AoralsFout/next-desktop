<!-- 窗口管理器组件 -->
<template>
    <div class="window-manager">
        <!-- 渲染所有窗口 -->
        <Window
            v-for="window in windows"
            :key="window.id"
            :windowId="window.id"
            ref="windowRefs"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Window from './Window.vue'

// 窗口引用数组
const windowRefs = ref([])

// 窗口列表
const windows = ref([])

// 获取窗口实例
const getWindowInstance = (windowId) => {
    return windowRefs.value.find(w => w.windowId === windowId)
}

// 验证并调整窗口尺寸和位置，确保不超出屏幕
const validateAndAdjustWindowBounds = (position, size) => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const headerHeight = 0.018 * screenWidth
    
    // 可用区域：从Header下方到屏幕底部
    const availableHeight = screenHeight - headerHeight
    const minPadding = 10 // 最小边距
    
    let adjustedPosition = { ...position }
    let adjustedSize = { ...size }
    
    // 限制窗口最大宽度（不超过屏幕宽度，留出边距）
    if (adjustedSize.width > screenWidth - minPadding * 2) {
        adjustedSize.width = screenWidth - minPadding * 2
    }
    
    // 限制窗口最大高度（不超过可用高度，留出边距）
    const maxHeight = availableHeight - minPadding * 2
    if (adjustedSize.height > maxHeight) {
        adjustedSize.height = maxHeight
    }
    
    // 确保窗口最小尺寸
    if (adjustedSize.width < 300) {
        adjustedSize.width = 300
    }
    if (adjustedSize.height < 200) {
        adjustedSize.height = 200
    }
    
    // 调整窗口位置，确保不超出屏幕边界
    // 左边界
    if (adjustedPosition.x < 0) {
        adjustedPosition.x = minPadding
    }
    // 右边界
    if (adjustedPosition.x + adjustedSize.width > screenWidth) {
        adjustedPosition.x = screenWidth - adjustedSize.width - minPadding
    }
    // 上边界（不能在Header下方）
    if (adjustedPosition.y < headerHeight) {
        adjustedPosition.y = headerHeight + minPadding
    }
    // 下边界：如果窗口会超出屏幕底部，向上调整位置
    if (adjustedPosition.y + adjustedSize.height > screenHeight) {
        adjustedPosition.y = screenHeight - adjustedSize.height - minPadding
        // 如果调整后位置低于Header，则设置为Header下方
        if (adjustedPosition.y < headerHeight + minPadding) {
            adjustedPosition.y = headerHeight + minPadding
            // 如果还是超出，缩小窗口高度
            if (adjustedPosition.y + adjustedSize.height > screenHeight) {
                adjustedSize.height = screenHeight - adjustedPosition.y - minPadding
            }
        }
    }
    
    return { position: adjustedPosition, size: adjustedSize }
}

// 打开新窗口
const openWindow = async (componentName, componentTitle = '窗口', options = {}) => {
    const windowId = `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 计算Header高度（1.8vw转换为像素）
    const screenWidth = window.innerWidth
    const headerHeight = 0.018 * screenWidth
    
    // 计算窗口位置（避免重叠），确保在Header下方
    const baseX = 100 + (windows.value.length * 30)
    const baseY = headerHeight + 20 + (windows.value.length * 30) // Header高度 + 间距 + 偏移
    
    // 默认尺寸
    const defaultSize = options.size || { width: 800, height: 600 }
    const defaultPosition = options.position || { x: baseX, y: baseY }
    
    // 验证并调整窗口边界
    const validated = validateAndAdjustWindowBounds(defaultPosition, defaultSize)
    
    const windowOptions = {
        position: validated.position,
        size: validated.size,
        animation: options.animation || 'windowFadeIn',
        ...options
    }
    
    // 添加到窗口列表
    windows.value.push({
        id: windowId,
        componentName,
        title: componentTitle,
        options: windowOptions
    })
    
    await nextTick()
    
    // 获取窗口实例并打开
    const windowInstance = getWindowInstance(windowId)
    if (windowInstance) {
        await windowInstance.open(componentName, componentTitle, windowOptions)
    }
    
    return windowId
}

// 关闭窗口
const closeWindow = (windowId) => {
    const windowInstance = getWindowInstance(windowId)
    if (windowInstance) {
        windowInstance.close()
        
        // 延迟从列表中移除，等待动画完成
        setTimeout(() => {
            windows.value = windows.value.filter(w => w.id !== windowId)
        }, 300)
    }
}

// 关闭所有窗口
const closeAllWindows = () => {
    windows.value.forEach(window => {
        const instance = getWindowInstance(window.id)
        if (instance) {
            instance.close()
        }
    })
    
    // 延迟清空列表
    setTimeout(() => {
        windows.value = []
    }, 300)
}

// 获取活动窗口数量
const getActiveWindowCount = () => {
    return windows.value.length
}

// 获取窗口列表
const getWindowList = () => {
    return windows.value.map(window => ({
        id: window.id,
        title: window.title,
        componentName: window.componentName
    }))
}

// 处理窗口激活事件
const handleWindowActivated = (event) => {
    // 确保只有一个窗口处于激活状态
    windowRefs.value.forEach(window => {
        if (window.windowId !== event.detail.windowId) {
            window.deactivate()
        }
    })
}

// 处理窗口关闭事件
const handleWindowClosed = (event) => {
    const { windowId } = event.detail
    console.log(`窗口 ${windowId} 已关闭，从列表中移除`)
    
    // 延迟从列表中移除，等待动画完成
    setTimeout(() => {
        windows.value = windows.value.filter(w => w.id !== windowId)
        console.log(`窗口列表更新，当前窗口数: ${windows.value.length}`)
    }, 300)
}

onMounted(() => {
    window.addEventListener('windowActivated', handleWindowActivated)
    window.addEventListener('windowClosed', handleWindowClosed)
})

onUnmounted(() => {
    window.removeEventListener('windowActivated', handleWindowActivated)
    window.removeEventListener('windowClosed', handleWindowClosed)
})

// 暴露方法给父组件使用
defineExpose({
    openWindow,
    closeWindow,
    closeAllWindows,
    getActiveWindowCount,
    getWindowList
})
</script>

<style scoped>
.window-manager {
    position: fixed;
    top: 1.8vw; /* Header实际高度 */
    left: 0;
    width: 100%;
    height: calc(100% - 1.8vw); /* 预留Header空间 */
    pointer-events: none;
    z-index: 99999;
}

.window-manager > * {
    pointer-events: auto;
}
</style>