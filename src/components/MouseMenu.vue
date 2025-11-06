<!-- 鼠标右键菜单 -->
<template>
    <div 
        v-show="shouldShowMenu" 
        class="mouse-menu"
        :class="currentAnimationClass"
        :style="{ top: position.y + 'px', left: position.x + 'px' }"
        @click.stop
        @animationend="handleAnimationEnd"
        ref="menuRef"
    >
        <div class="menu-item" @click="handleMenuClick('openFile')">
            打开文件
        </div>
        <div class="menu-item" @click="handleMenuClick('openFolder')">
            打开文件夹
        </div>
        <div class="menu-item" @click="handleMenuClick('newFile')">
            新建文件
        </div>
        <div class="menu-item" @click="handleMenuClick('newFolder')">
            新建文件夹
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import configManager from '../utils/config.js'

// 导入动画样式
import '../assets/style/windowAnimations/index.css'

const menuRef = ref(null)

// 控制菜单显示状态
const isVisible = ref(false)
const isAnimating = ref(false)
// 菜单位置
const position = ref({ x: 0, y: 0 })
// 当前动画类型（从配置管理器获取）
const selectedAnimation = ref('windowFadeIn')

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

// 计算是否应该显示菜单
const shouldShowMenu = computed(() => {
    return isVisible.value || isAnimating.value
})

// 计算当前动画类名
const currentAnimationClass = computed(() => {
    const config = configManager.getConfig()
    if (!isVisible.value && !isAnimating.value) {
        return ''
    }
    
    const animationClass = isVisible.value ? 
        selectedAnimation.value : 
        getCloseAnimationClass(selectedAnimation.value)
    
    return [
        'windowAnimation',
        animationClass,
        config.animationSpeed || 'windowFast'
    ]
})

// 加载动画设置
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
            isAnimating.value = false
        }, 10) // 短暂延迟确保DOM更新完成
    }
}

// 显示菜单
const showMenu = async (x, y) => {
    if (isAnimating.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // 加载动画设置
    loadAnimationSettings()
    
    // 先使用预估尺寸进行初步定位
    const initialPosition = adjustMenuPosition(x, y)
    position.value = initialPosition
    isAnimating.value = true
    await nextTick()
    isVisible.value = true
    
    // 等待DOM渲染完成后，使用实际尺寸进行精确调整
    await nextTick()
    const finalPosition = adjustMenuPositionWithActualSize(x, y)
    position.value = finalPosition
    
    // 如果是无动画模式，立即处理打开完成
    handleNoAnimationState()
}

// 调整菜单位置，确保不超出屏幕边界
const adjustMenuPosition = (x, y) => {
    // 获取菜单元素尺寸（默认值，实际会在nextTick后获取）
    const menuWidth = 160 // 最小宽度
    const menuHeight = 160 // 预估高度（4个菜单项）
    
    // 获取屏幕尺寸
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // 边界检测和调整
    let adjustedX = x
    let adjustedY = y
    
    // 水平边界检测
    if (x + menuWidth > screenWidth) {
        // 如果菜单右侧超出屏幕，向左调整
        adjustedX = screenWidth - menuWidth - 10 // 留10px边距
    }
    
    // 垂直边界检测
    if (y + menuHeight > screenHeight) {
        // 如果菜单底部超出屏幕，向上调整
        adjustedY = screenHeight - menuHeight - 10 // 留10px边距
    }
    
    // 确保位置不小于0
    adjustedX = Math.max(10, adjustedX) // 最小留10px边距
    adjustedY = Math.max(10, adjustedY) // 最小留10px边距
    
    return { x: adjustedX, y: adjustedY }
}

// 获取菜单实际尺寸（在DOM渲染后）
const getMenuSize = () => {
    if (!menuRef.value) return { width: 160, height: 160 }
    
    const rect = menuRef.value.getBoundingClientRect()
    return {
        width: rect.width,
        height: rect.height
    }
}

// 更新边界判断函数，使用实际菜单尺寸
const adjustMenuPositionWithActualSize = (x, y) => {
    const menuSize = getMenuSize()
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    let adjustedX = x
    let adjustedY = y
    
    // 水平边界检测
    if (x + menuSize.width > screenWidth) {
        adjustedX = screenWidth - menuSize.width - 10
    }
    
    // 垂直边界检测
    if (y + menuSize.height > screenHeight) {
        adjustedY = screenHeight - menuSize.height - 10
    }
    
    // 确保位置不小于0
    adjustedX = Math.max(10, adjustedX)
    adjustedY = Math.max(10, adjustedY)
    
    return { x: adjustedX, y: adjustedY }
}

// 隐藏菜单
const hideMenu = () => {
    if (!isVisible.value && !isAnimating.value) return
    
    isVisible.value = false
    isAnimating.value = true
    
    // 如果是无动画模式，立即处理关闭
    handleNoAnimationState()
}

// 切换菜单显示状态
const toggleMenu = (x, y) => {
    if (isVisible.value || isAnimating.value) {
        // 如果菜单已经打开或正在动画中，关闭菜单
        hideMenu()
    } else {
        // 如果菜单关闭，打开菜单
        showMenu(x, y)
    }
}

// 处理动画结束事件
const handleAnimationEnd = (event) => {
    if (event.animationName.includes('Out') || event.animationName.includes('Close')) {
        // 关闭动画结束
        isAnimating.value = false
    } else if (event.animationName.includes('In')) {
        // 打开动画结束
        isAnimating.value = false
    }
}

// 处理菜单项点击
const handleMenuClick = (action) => {
    console.log('菜单项被点击:', action)
    hideMenu()
    
    // 根据不同的菜单项执行不同的操作
    switch (action) {
        case 'openFile':
            // 打开文件逻辑
            break
        case 'openFolder':
            // 打开文件夹逻辑
            break
        case 'newFile':
            // 新建文件逻辑
            break
        case 'newFolder':
            // 新建文件夹逻辑
            break
    }
}

// 处理右键点击事件
const handleContextMenu = (event) => {
    // 检查是否点击在Header区域，如果是则不显示MouseMenu（让Header自己的右键菜单处理）
    if (event.target.closest('.app-header')) {
        return
    }
    
    event.preventDefault()
    toggleMenu(event.clientX, event.clientY)
}

// 处理点击其他地方隐藏菜单
const handleClickOutside = (event) => {
    if ((isVisible.value || isAnimating.value) && !event.target.closest('.mouse-menu')) {
        hideMenu()
    }
}

// 处理键盘事件（ESC键隐藏菜单）
const handleKeydown = (event) => {
    if (event.key === 'Escape' && (isVisible.value || isAnimating.value)) {
        hideMenu()
    }
}

// 处理配置更新事件
const handleConfigUpdated = (event) => {
    const config = event.detail.config
    // 更新动画设置
    loadAnimationSettings()
}

// 处理窗口大小变化
const handleResize = () => {
    if (isVisible.value) {
        // 如果菜单当前可见，重新调整位置
        const finalPosition = adjustMenuPositionWithActualSize(position.value.x, position.value.y)
        position.value = finalPosition
    }
}

onMounted(() => {
    // 添加事件监听器
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('animationend', handleAnimationEnd)
    window.addEventListener('configUpdated', handleConfigUpdated)
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    // 移除事件监听器
    document.removeEventListener('contextmenu', handleContextMenu)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('animationend', handleAnimationEnd)
    window.removeEventListener('configUpdated', handleConfigUpdated)
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.mouse-menu {
    position: fixed;
    background-color: var(--mousemenu-bg);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 4px 0;
    min-width: 160px;
    border: 1px solid var(--mousemenu-border);
    /* 确保动画能正常工作 */
    opacity: 0;
    transform: scale(0.95);
    z-index: 9999;
}

.mouse-menu.windowAnimation {
    opacity: 1;
    transform: scale(1);
}

.menu-item {
    padding: 8px 16px;
    color: var(--mousemenu-text);
    font-size: 14px;
    transition: background-color 0.1s ease-in-out;
    user-select: none;
    cursor: pointer;
}

.menu-item:hover {
    background-color: var(--mousemenu-hover);
}

.menu-item:active {
    background-color: var(--mousemenu-active);
}
</style>