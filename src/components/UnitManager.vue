<!-- Unit管理器组件 -->
<template>
    <div class="unit-manager">
        <!-- 渲染所有Unit -->
        <Unit v-for="unit in units" :key="unit.id" :unitId="unit.id" ref="unitRefs" />
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
const availableUnits = ref(['Time', 'AudioVisualizerBar', 'AudioVisualizerCircle', 'ClockClock'])

const unitSizeOptions = ref({
    Time: { width: 300, height: 200 },
    AudioVisualizerBar: { width: 1920, height: 300 },
    AudioVisualizerCircle: { width: 800, height: 800 },
    ClockClock: { width: 780, height: 180 },
})

// 存储键名
const STORAGE_KEY = 'desktopUnitLayout'

// 获取Unit实例
const getUnitInstance = (unitId) => {
    return unitRefs.value.find(u => u.unitId === unitId)
}

// 保存Unit布局到本地存储
const saveUnitLayout = () => {
    try {
        const layoutData = {
            units: units.value.map(unit => ({
                id: unit.id,
                componentName: unit.componentName,
                options: unit.options
            })),
            timestamp: Date.now()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutData))
        console.log('Unit布局已保存，当前Unit数:', units.value.length)
    } catch (error) {
        console.error('保存Unit布局失败:', error)
    }
}

// 加载Unit布局从本地存储
const loadUnitLayout = async () => {
    try {
        const savedLayout = localStorage.getItem(STORAGE_KEY)
        if (savedLayout) {
            const layoutData = JSON.parse(savedLayout)

            // 检查数据是否过期（超过7天）
            const oneWeek = 7 * 24 * 60 * 60 * 1000
            if (Date.now() - layoutData.timestamp > oneWeek) {
                console.log('Unit布局数据已过期，清除旧数据')
                localStorage.removeItem(STORAGE_KEY)
                return
            }

            if (layoutData.units && layoutData.units.length > 0) {
                console.log('加载保存的Unit布局，Unit数:', layoutData.units.length)

                // 逐个打开保存的Unit
                for (const unitData of layoutData.units) {
                    await openUnit(unitData.componentName, unitData.options, unitData.id)
                }

                console.log('Unit布局加载完成')
            }
        }
    } catch (error) {
        console.error('加载Unit布局失败:', error)
        // 如果加载失败，清除可能损坏的数据
        localStorage.removeItem(STORAGE_KEY)
    }
}

// 清除Unit布局数据
const clearUnitLayout = () => {
    try {
        localStorage.removeItem(STORAGE_KEY)
        console.log('Unit布局数据已清除')
    } catch (error) {
        console.error('清除Unit布局数据失败:', error)
    }
}

// 打开新Unit
const openUnit = async (componentName, options = {}, loadUnitId = null) => {
    // 使用基于组件名称的稳定ID，而不是随机ID
    // 这样即使重新打开页面，相同类型的Unit也会使用相同的ID
    let unitId
    if (loadUnitId) {
        unitId = loadUnitId
    } else {
        unitId = `unit_${componentName}_${Date.now()}`
    }

    // 计算Unit位置（避免重叠，默认在窗口下方）
    const baseX = 100 + (units.value.length * 20)
    const baseY = 150 + (units.value.length * 20)

    options.size = options.size || unitSizeOptions.value[componentName] || { width: 300, height: 200 }

    const unitOptions = {
        position: options.position || { x: baseX, y: baseY },
        size: options.size || { width: 300, height: 200 },
        animation: options.animation,
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
            // Unit关闭后保存布局
            saveUnitLayout()
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
        // 关闭所有Unit后保存布局
        saveUnitLayout()
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
                size: {
                    width: 900,
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
        // Unit关闭后保存布局
        saveUnitLayout()
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
        case 'clearLayout':
            clearUnitLayout()
            break
        case 'openUnitSettings':
            openUnitSettings(data.unitId, data.componentName)
            break
    }
}

// 打开Unit设置窗口
const openUnitSettings = (unitId, componentName) => {
    // 使用Window组件打开Unit设置窗口
    window.dispatchEvent(new CustomEvent('openWindow', {
        detail: {
            componentName: 'UnitSettings',
            componentTitle: `${componentName} - 设置`,
            options: {
                size: {
                    width: 500,
                    height: 600
                },
                unitId: unitId,
                componentName: componentName
            }
        }
    }))
}

// 处理Unit位置或大小变化
const handleUnitUpdated = (event) => {
    const { unitId, position, size } = event.detail
    const unitIndex = units.value.findIndex(u => u.id === unitId)
    if (unitIndex !== -1) {
        if (position) {
            units.value[unitIndex].options.position = position
        }
        if (size) {
            units.value[unitIndex].options.size = size
        }
        // Unit更新后保存布局
        saveUnitLayout()
    }
}

onMounted(() => {
    window.addEventListener('unitClosed', handleUnitClosed)
    window.addEventListener('getUnitList', handleGetUnitList)
    window.addEventListener('unitManagerAction', handleUnitManagerAction)
    window.addEventListener('unitUpdated', handleUnitUpdated)

    // 组件挂载后加载保存的Unit布局
    setTimeout(() => {
        loadUnitLayout()
    }, 100)
})

onUnmounted(() => {
    window.removeEventListener('unitClosed', handleUnitClosed)
    window.removeEventListener('getUnitList', handleGetUnitList)
    window.removeEventListener('unitManagerAction', handleUnitManagerAction)
    window.removeEventListener('unitUpdated', handleUnitUpdated)
})

// 暴露方法给父组件使用
defineExpose({
    openUnit,
    closeUnit,
    closeAllUnits,
    getActiveUnitCount,
    getUnitList,
    openManagerWindow,
    saveUnitLayout,
    loadUnitLayout,
    clearUnitLayout
})
</script>

<style scoped>
.unit-manager {
    position: fixed;
    top: 1.5vw;
    left: 0;
    width: 100%;
    height: calc(100% - 1.5vw);
    pointer-events: none;
    z-index: 49;
    /* 低于窗口管理器 */
}

.unit-manager>* {
    pointer-events: auto;
}
</style>