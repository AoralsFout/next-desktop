<!-- Unit管理窗口组件 -->
<template>
    <div class="unit-manager-window">
        <div class="manager-content">
            <div class="unit-list">
                <h3>当前打开的Unit</h3>
                <div v-for="unit in unitList" :key="unit.id" class="unit-item">
                    <span class="unit-name">{{ unit.componentName }}</span>
                    <div class="unit-actions">
                        <button class="action-btn settings-btn"
                            @click="openUnitSettings(unit.id, unit.componentName)">设置</button>
                        <button class="action-btn" @click="closeUnit(unit.id)">关闭</button>
                    </div>
                </div>
                <div v-if="unitList.length === 0" class="no-units">
                    暂无打开的Unit
                </div>
            </div>
            <div class="available-units">
                <h3>可用的Unit</h3>
                <div class="available-list">
                    <div v-for="unitName in availableUnits" :key="unitName" class="available-item">
                        <span>{{ unitName }}</span>
                        <button class="open-btn" @click="openUnit(unitName)">打开</button>
                    </div>
                </div>
            </div>
            <!-- <div class="layout-actions">
                <button class="clear-layout-btn" @click="clearLayout">清除布局数据</button>
                <div class="layout-info">
                    下次启动时将恢复当前布局
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 当前打开的Unit列表
const unitList = ref([])
// 可用的Unit列表
const availableUnits = ref(['Example'])

// 获取Unit列表数据
const fetchUnitList = () => {
    // 通过事件获取Unit列表
    window.dispatchEvent(new CustomEvent('getUnitList'))
}

// 处理Unit列表更新事件
const handleUnitListUpdated = (event) => {
    const { unitList: newUnitList, availableUnits: newAvailableUnits } = event.detail
    unitList.value = newUnitList || []
    availableUnits.value = newAvailableUnits || ['Example']
}

// 打开Unit
const openUnit = (unitName) => {
    // 发送事件给UnitManager组件
    window.dispatchEvent(new CustomEvent('unitManagerAction', {
        detail: {
            action: 'openUnit',
            data: { unitName }
        }
    }))
}

// 关闭Unit
const closeUnit = (unitId) => {
    // 发送事件给UnitManager组件
    window.dispatchEvent(new CustomEvent('unitManagerAction', {
        detail: {
            action: 'closeUnit',
            data: { unitId }
        }
    }))
}

// 打开Unit设置窗口
const openUnitSettings = (unitId, componentName) => {
    // 发送事件给UnitManager组件
    window.dispatchEvent(new CustomEvent('unitManagerAction', {
        detail: {
            action: 'openUnitSettings',
            data: { unitId, componentName }
        }
    }))
}

// 清除布局数据
const clearLayout = () => {
    if (confirm('确定要清除所有Unit布局数据吗？下次启动时将不会恢复当前布局。')) {
        // 发送事件给UnitManager组件
        window.dispatchEvent(new CustomEvent('unitManagerAction', {
            detail: {
                action: 'clearLayout'
            }
        }))
        alert('布局数据已清除')
    }
}

onMounted(() => {
    // 监听Unit列表更新事件
    window.addEventListener('unitListUpdated', handleUnitListUpdated)
    // 初始化时获取Unit列表
    fetchUnitList()
})

onUnmounted(() => {
    window.removeEventListener('unitListUpdated', handleUnitListUpdated)
})
</script>

<style scoped>
.unit-manager-window {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #ffffff;
}

.manager-content {
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.unit-list h3,
.available-units h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 8px;
}

.unit-list {
    width: 70%;
    overflow-y: auto;
}

.available-units {
    width: 30%;
    overflow-y: auto;
}

.unit-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

.unit-name {
    font-size: 14px;
    color: #333;
}

.unit-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #fff;
    color: #666;
    font-size: 12px;
    cursor: pointer;
}

.action-btn:hover {
    background-color: #f0f0f0;
}

.settings-btn {
    border-color: #4caf50;
    color: #4caf50;
}

.settings-btn:hover {
    background-color: #e8f5e8;
}

.no-units {
    text-align: center;
    color: #888;
    font-size: 14px;
    padding: 20px;
}

.available-units {
    flex-shrink: 0;
}

.available-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.available-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

.available-item span {
    font-size: 14px;
    color: #333;
}

.open-btn {
    padding: 4px 8px;
    border: 1px solid #007acc;
    border-radius: 3px;
    background-color: #007acc;
    color: white;
    font-size: 12px;
    cursor: pointer;
}

.open-btn:hover {
    background-color: #005a9e;
}

.layout-actions {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

.clear-layout-btn {
    padding: 6px 12px;
    border: 1px solid #d32f2f;
    border-radius: 3px;
    background-color: #d32f2f;
    color: white;
    font-size: 12px;
    cursor: pointer;
}

.clear-layout-btn:hover {
    background-color: #b71c1c;
}

.layout-info {
    font-size: 12px;
    color: #666;
}
</style>