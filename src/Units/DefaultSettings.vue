<!-- 默认Unit设置组件 -->
<template>
    <div class="default-settings">
        <div class="no-settings-message">
            <h4>该Unit暂无自定义设置</h4>
            <p>当前Unit没有特定的设置选项。</p>
            <div class="default-options">
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" v-model="enableCustomStyle" @change="saveSettings">
                        启用自定义样式
                    </label>
                </div>
                
                <div v-if="enableCustomStyle" class="style-options">
                    <div class="setting-item">
                        <label class="setting-label">背景颜色:</label>
                        <input type="color" v-model="customBackground" @change="saveSettings">
                    </div>
                    
                    <div class="setting-item">
                        <label class="setting-label">边框颜色:</label>
                        <input type="color" v-model="customBorder" @change="saveSettings">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    unitId: {
        type: String,
        required: true
    }
})

// 默认设置项
const enableCustomStyle = ref(false)
const customBackground = ref('#ffffff')
const customBorder = ref('#e0e0e0')

// 存储键名
const getStorageKey = () => {
    return `unitSettings_${props.unitId}`
}

// 加载设置
const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem(getStorageKey())
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            enableCustomStyle.value = settings.enableCustomStyle || false
            customBackground.value = settings.customBackground || '#ffffff'
            customBorder.value = settings.customBorder || '#e0e0e0'
        }
    } catch (error) {
        console.error('加载设置失败:', error)
    }
}

// 保存设置
const saveSettings = () => {
    try {
        const settings = {
            enableCustomStyle: enableCustomStyle.value,
            customBackground: customBackground.value,
            customBorder: customBorder.value
        }
        localStorage.setItem(getStorageKey(), JSON.stringify(settings))
        
        // 发送设置更新事件
        window.dispatchEvent(new CustomEvent('unitSettingsUpdated', {
            detail: {
                unitId: props.unitId,
                settings: settings
            }
        }))
    } catch (error) {
        console.error('保存设置失败:', error)
    }
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.default-settings {
    padding: 20px;
}

.no-settings-message {
    text-align: center;
    color: #666;
}

.no-settings-message h4 {
    margin-bottom: 10px;
    color: #333;
}

.no-settings-message p {
    margin-bottom: 20px;
}

.default-options {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #e0e0e0;
}

.setting-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 10px;
}

.setting-label {
    font-size: 14px;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
}

.style-options {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
}
</style>