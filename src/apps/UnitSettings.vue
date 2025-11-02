<!-- Unit设置窗口组件 -->
<template>
    <div class="unit-settings-window">
        <div class="settings-content">
            <h3>{{ componentName }} - 设置</h3>
            <div class="settings-section">
                <!-- 动态加载特定Unit的设置组件 -->
                <component 
                    :is="currentSettingsComponent" 
                    v-if="currentSettingsComponent"
                    :unitId="unitId"
                    :key="componentKey"
                />
                <div v-else class="no-settings">
                    该Unit暂无设置选项
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue'

const props = defineProps({
    unitId: {
        type: String,
        required: true
    },
    componentName: {
        type: String,
        required: true
    }
})

// 当前设置组件
const currentSettingsComponent = ref(null)
const componentKey = ref(0)

// 加载特定Unit的设置组件
const loadSettingsComponent = async () => {
    try {
        // 动态导入Unit设置组件
        const componentModule = await import(`../Units/${props.componentName}Settings.vue`)
        currentSettingsComponent.value = markRaw(componentModule.default)
        componentKey.value++ // 强制重新渲染
    } catch (error) {
        console.log(`未找到 ${props.componentName} 的设置组件，使用默认设置界面`)
        // 使用默认设置组件
        try {
            const defaultModule = await import(`../Units/DefaultSettings.vue`)
            currentSettingsComponent.value = markRaw(defaultModule.default)
            componentKey.value++
        } catch (defaultError) {
            console.error('加载默认设置组件失败:', defaultError)
            currentSettingsComponent.value = null
        }
    }
}

onMounted(() => {
    loadSettingsComponent()
})
</script>

<style scoped>
.unit-settings-window {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #ffffff;
}

.settings-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.settings-content h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
}

.settings-section {
    flex: 1;
    overflow-y: auto;
}

.no-settings {
    text-align: center;
    color: #888;
    font-size: 14px;
    padding: 40px 20px;
}
</style>