<!-- Unit管理器组件 -->
<template>
    <div class="unit-manager">
        <!-- 渲染所有Unit -->
        <Unit
            v-for="unit in units"
            :key="unit.id"
            :unitId="unit.id"
            ref="unitRefs"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Unit from './Unit.vue'

// Unit引用数组
const unitRefs = ref([])

// Unit列表
const units = ref([])

// 可用的Unit列表（从Units文件夹获取）
const availableUnits = ref(['Example', 'Time'])

// 获取Unit实例
const getUnitInstance = (unitId) => {
    return unitRefs.value.find(u => u.unitId === unitId)
}

// 打开新Unit
const openUnit = async (componentName, options = {}) => {
    const unitId = `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 计算Unit位置（避免重叠，默认在窗口下方）
    const baseX = 100 + (units.value.length * 20)
    const baseY = 150 + (units.value.length * 20)
    
    const unitOptions = {
        position: options.position || { x: baseX, y: baseY },
        size: options.size || { width: 300, height: 200 },
        animation: options.animation || 'unitFadeIn',
        ...options
    }
    
    // 添加到Unit列表
    units.value.push({
        id: unitId,
        componentName,
        options: unitOptions
    })
    
    await nextTick()
    
    // 获取Unit实例并打开
    const unitInstance = getUnitInstance(unitId)
    if (unitInstance) {
        await unitInstance.open(componentName, unitOptions)
    }
    
    return unitId
}

// 关闭Unit
const closeUnit = (unitId) => {
    const unitInstance = getUnitInstance(unitId)
    if (unitInstance) {
        unitInstance.close()
        
        // 延迟从列表中移除，等待动画完成
        setTimeout(() => {
            units.value = units.value.filter(u => u.id !== unitId)
        }, 300)
    }
}

// 关闭所有Unit
const closeAllUnits = () => {
    units.value.forEach(unit => {
        const instance = getUnitInstance(unit.id)
        if (instance) {
            instance.close()
        }
    })
    
    // 延迟清空列表
    setTimeout(() => {
        units.value = []
    }, 300)
}

// 获取活动Unit数量
const getActiveUnitCount = () => {
    return units.value.length
}

// 获取Unit列表
const getUnitList = () => {
    return units.value.map(unit => ({
        id: unit.id,
        componentName: unit.componentName
    }))
}

// 打开管理窗口
const openManagerWindow = () => {
    // 使用Window组件打开UnitManager窗口
    window.dispatchEvent(new CustomEvent('openWindow', {
        detail: {
            componentName: 'UnitManager',
            componentTitle: 'Unit管理',
            options: {
                animation: 'windowFadeIn',
                size: {
                    width: 450,
                    height: 500
                },
            }
        }
    }))
}

// 处理获取Unit列表事件
const handleGetUnitList = () => {
    // 发送Unit列表更新事件
    window.dispatchEvent(new CustomEvent('unitListUpdated', {
        detail: {
            unitList: getUnitList(),
            availableUnits: availableUnits.value
        }
    }))
}

// 处理Unit关闭事件
const handleUnitClosed = (event) => {
    const { unitId } = event.detail
    console.log(`Unit ${unitId} 已关闭，从列表中移除`)
    
    // 延迟从列表中移除，等待动画完成
    setTimeout(() => {
        units.value = units.value.filter(u => u.id !== unitId)
        console.log(`Unit列表更新，当前Unit数: ${units.value.length}`)
        // Unit列表更新后发送更新事件
        handleGetUnitList()
    }, 300)
}

// 处理UnitManager窗口中的操作
const handleUnitManagerAction = (event) => {
    const { action, data } = event.detail
    
    switch (action) {
        case 'openUnit':
            openUnit(data.unitName).then(() => {
                // Unit打开后发送更新事件
                handleGetUnitList()
            })
            break
        case 'closeUnit':
            closeUnit(data.unitId)
            // Unit关闭后会在handleUnitClosed中处理更新
            break
    }
}

onMounted(() => {
    window.addEventListener('unitClosed', handleUnitClosed)
    window.addEventListener('getUnitList', handleGetUnitList)
    window.addEventListener('unitManagerAction', handleUnitManagerAction)
})

onUnmounted(() => {
    window.removeEventListener('unitClosed', handleUnitClosed)
    window.removeEventListener('getUnitList', handleGetUnitList)
    window.removeEventListener('unitManagerAction', handleUnitManagerAction)
})

// 暴露方法给父组件使用
defineExpose({
    openUnit,
    closeUnit,
    closeAllUnits,
    getActiveUnitCount,
    getUnitList,
    openManagerWindow
})
</script>

<style scoped>
.unit-manager {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 49; /* 低于窗口管理器 */
}

.unit-manager > * {
    pointer-events: auto;
}
</style>