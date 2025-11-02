<!-- Unit组件 - 显示Units文件夹中的内容，支持Ctrl+拖拽移动 -->
<template>
    <div v-show="shouldShowUnit" class="unit-container" :class="currentAnimationClass" :style="unitStyle"
        @animationend="handleAnimationEnd" ref="unitRef" :data-unit-id="unitId">
        <!-- Unit内容区域 -->
        <div class="unit-content" @mousedown="handleMouseDown">
            <!-- 动态加载Units文件夹中的组件 -->
            <component :is="currentComponent" v-if="currentComponent" :key="componentKey" :unitId="props.unitId" />
            <div v-else class="no-component">
                Error: 未加载组件
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, markRaw } from 'vue'

const props = defineProps({
    unitId: {
        type: String,
        default: () => `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
})

const unitRef = ref(null)

// Unit状态
const isVisible = ref(false)
const isAnimating = ref(false)

// Unit位置和尺寸
const unitPosition = ref({ x: 100, y: 150 }) // 默认在窗口下方
const unitSize = ref({ width: 300, height: 200 })

// 拖拽相关
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const ctrlPressed = ref(false)

// 当前显示的组件
const currentComponent = ref(null)
const componentKey = ref(0)

// 动画设置
const selectedAnimation = ref('unitFadeIn')
const animationSpeed = ref('unitFast')

// 获取对应的关闭动画类名
const getCloseAnimationClass = (openAnimation) => {
    const animationMap = {
        'unitFadeIn': 'unitFadeOut',
        'unitSlideIn': 'unitSlideOut',
        'unitScaleIn': 'unitScaleOut',
        'noAnimation': 'noAnimation'
    }
    return animationMap[openAnimation] || 'unitFadeOut'
}

// 计算是否应该显示Unit
const shouldShowUnit = computed(() => {
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
        'unitAnimation',
        animationClass,
        animationSpeed.value
    ]
})

// 计算Unit样式
const unitStyle = computed(() => {
    return {
        top: unitPosition.value.y + 'px',
        left: unitPosition.value.x + 'px',
        width: unitSize.value.width + 'px',
        height: unitSize.value.height + 'px',
        zIndex: 50 // 低于窗口的z-index
    }
})

// 打开Unit
const open = async (componentName, options = {}) => {
    // 如果正在动画中，先完成当前动画
    if (selectedAnimation.value !== 'noAnimation' && isAnimating.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 加载组件
    await loadComponent(componentName)

    // 应用自定义位置和尺寸
    if (options.position) {
        unitPosition.value = { ...options.position }
    }
    if (options.size) {
        unitSize.value = { ...options.size }
    }
    if (options.animation) {
        selectedAnimation.value = options.animation
    }

    isAnimating.value = true
    await nextTick()
    isVisible.value = true
}

// 关闭Unit
const close = () => {
    if (!isVisible.value && !isAnimating.value) return

    isVisible.value = false
    if (selectedAnimation.value !== 'noAnimation') {
        isAnimating.value = true
    } else {
        isAnimating.value = false
    }

    // 触发Unit关闭事件，通知Unit管理器
    window.dispatchEvent(new CustomEvent('unitClosed', {
        detail: { unitId: props.unitId }
    }))
}

// 加载Units文件夹中的组件
const loadComponent = async (componentName) => {
    try {
        // 动态导入Units文件夹中的组件
        const componentModule = await import(`../Units/${componentName}.vue`)
        currentComponent.value = markRaw(componentModule.default)
        componentKey.value++ // 强制重新渲染
    } catch (error) {
        console.error(`加载Unit组件 ${componentName} 失败:`, error)
        currentComponent.value = null
    }
}

// 处理鼠标按下事件
const handleMouseDown = (event) => {
    // 检查是否按下了Ctrl键
    if (event.ctrlKey) {
        ctrlPressed.value = true
        startDrag(event)
    }
}

// 开始拖拽Unit
const startDrag = (event) => {
    if (!ctrlPressed.value) return

    isDragging.value = true
    dragOffset.value = {
        x: event.clientX - unitPosition.value.x,
        y: event.clientY - unitPosition.value.y
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('keyup', handleKeyUp)
}

// 处理拖拽
const handleDrag = (event) => {
    if (!isDragging.value || !ctrlPressed.value) return

    unitPosition.value = {
        x: event.clientX - dragOffset.value.x,
        y: event.clientY - dragOffset.value.y
    }
}

// 停止拖拽
const stopDrag = () => {
    isDragging.value = false
    ctrlPressed.value = false
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('keyup', handleKeyUp)

    // 拖拽结束后发送Unit更新事件
    window.dispatchEvent(new CustomEvent('unitUpdated', {
        detail: {
            unitId: props.unitId,
            position: { ...unitPosition.value },
            size: { ...unitSize.value }
        }
    }))
}

// 处理按键释放
const handleKeyUp = (event) => {
    if (event.key === 'Control') {
        ctrlPressed.value = false
        if (isDragging.value) {
            stopDrag()
        }
    }
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

onMounted(() => {
    // 添加事件监听器
    unitRef.value.addEventListener('animationend', handleAnimationEnd)
})

onBeforeUnmount(() => {
    // 移除事件监听器
    unitRef.value.removeEventListener('animationend', handleAnimationEnd)
})

// 暴露方法给父组件使用
defineExpose({
    open,
    close,
    unitId: props.unitId
})
</script>

<style scoped>
.unit-container {
    position: fixed;
    z-index: 50;
    background-color: #ffffff00;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 确保动画能正常工作 */
    opacity: 0;
    transform: scale(0.95);
}

.unit-container.unitAnimation {
    opacity: 1;
    transform: scale(1);
}

.unit-content {
    flex: 1;
    overflow: auto;
    background-color: #ffffff00;
    cursor: default;
}

/* .unit-content:hover {
    cursor: move;
} */

.no-component {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
    font-size: 14px;
}

/* Unit动画样式 */
.unitFadeIn {
    animation: unitFadeIn 0.3s ease-out forwards;
}

.unitFadeOut {
    animation: unitFadeOut 0.3s ease-in forwards;
}

.unitSlideIn {
    animation: unitSlideIn 0.3s ease-out forwards;
}

.unitSlideOut {
    animation: unitSlideOut 0.3s ease-in forwards;
}

.unitScaleIn {
    animation: unitScaleIn 0.3s ease-out forwards;
}

.unitScaleOut {
    animation: unitScaleOut 0.3s ease-in forwards;
}

.unitFast {
    animation-duration: 0.2s;
}

.unitNormal {
    animation-duration: 0.3s;
}

.unitSlow {
    animation-duration: 0.5s;
}

@keyframes unitFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes unitFadeOut {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.95);
    }
}

@keyframes unitSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes unitSlideOut {
    from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    to {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
}

@keyframes unitScaleIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes unitScaleOut {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.8);
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .unit-container {
        width: 80% !important;
        height: 60% !important;
        left: 10% !important;
        top: 20% !important;
    }
}
</style>