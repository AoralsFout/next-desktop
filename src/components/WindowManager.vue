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

// 打开新窗口
const openWindow = async (componentName, componentTitle = '窗口', options = {}) => {
    const windowId = `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 计算窗口位置（避免重叠）
    const baseX = 100 + (windows.value.length * 30)
    const baseY = 100 + (windows.value.length * 30)
    
    const windowOptions = {
        position: options.position || { x: baseX, y: baseY },
        size: options.size || { width: 800, height: 600 },
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 99;
}

.window-manager > * {
    pointer-events: auto;
}
</style>