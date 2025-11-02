<!-- Time组件设置 -->
<template>
    <div class="time-settings">
        <div class="setting-group">
            <h4>时间显示设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">时间格式:</label>
                <select v-model="timeFormat" @change="saveSettings">
                    <option value="HH:mm:ss">24小时制 (HH:mm:ss)</option>
                    <option value="hh:mm:ss A">12小时制 (hh:mm:ss AM/PM)</option>
                    <option value="HH:mm">24小时制 (HH:mm)</option>
                    <option value="hh:mm A">12小时制 (hh:mm AM/PM)</option>
                </select>
            </div>
            
            <div class="setting-item">
                <label class="setting-label">日期格式:</label>
                <select v-model="dateFormat" @change="saveSettings">
                    <option value="YYYY年MM月DD日">中文格式 (YYYY年MM月DD日)</option>
                    <option value="YYYY-MM-DD">标准格式 (YYYY-MM-DD)</option>
                    <option value="MM/DD/YYYY">美式格式 (MM/DD/YYYY)</option>
                    <option value="DD/MM/YYYY">欧式格式 (DD/MM/YYYY)</option>
                </select>
            </div>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="showSeconds" @change="saveSettings">
                    显示秒
                </label>
            </div>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="showDate" @change="saveSettings">
                    显示日期
                </label>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>字体样式设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">字体大小:</label>
                <input type="range" v-model="fontSize" min="1" max="10" step="0.5" @change="saveSettings">
                <span class="value-display">{{ fontSize }}rem</span>
            </div>
            
            <div class="setting-item">
                <label class="setting-label">字体颜色:</label>
                <input type="color" v-model="fontColor" @change="saveSettings">
                <span class="value-display">{{ fontColor }}</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>预览</h4>
            <div class="preview" :style="previewStyle">
                <div class="preview-time">{{ previewTime }}</div>
                <div class="preview-date" v-if="showDate" :style="`font-size: ${fontSize * 0.45}rem`">{{ previewDate }}</div>
            </div>
        </div>
        
        <div class="setting-actions">
            <button class="reset-btn" @click="resetSettings">重置设置</button>
            <button class="apply-btn" @click="applySettings">应用设置</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    unitId: {
        type: String,
        required: true
    }
})

// 设置项
const timeFormat = ref('HH:mm:ss')
const dateFormat = ref('YYYY年MM月DD日')
const showSeconds = ref(true)
const showDate = ref(true)
const fontSize = ref(3.5)
const fontColor = ref('#000000')

// 存储键名
const getStorageKey = () => {
    return `unitSettings_Time`
}

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

// 加载设置
const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem(getStorageKey())
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            timeFormat.value = settings.timeFormat || 'HH:mm:ss'
            dateFormat.value = settings.dateFormat || 'YYYY年MM月DD日'
            showSeconds.value = settings.showSeconds !== undefined ? settings.showSeconds : true
            showDate.value = settings.showDate !== undefined ? settings.showDate : true
            fontSize.value = settings.fontSize || 3.5
            fontColor.value = settings.fontColor || '#000000'
        }
    } catch (error) {
        console.error('加载设置失败:', error)
    }
}

// 保存设置
const saveSettings = () => {
    try {
        const settings = {
            timeFormat: timeFormat.value,
            dateFormat: dateFormat.value,
            showSeconds: showSeconds.value,
            showDate: showDate.value,
            fontSize: fontSize.value,
            fontColor: fontColor.value,
        }
        localStorage.setItem(getStorageKey(), JSON.stringify(settings))
    } catch (error) {
        console.error('保存设置失败:', error)
    }
}

// 应用设置到Unit
const applySettings = () => {
    // 发送全局设置更新事件，不指定具体的unitId
    // 这样所有Time组件都会收到设置更新
    window.dispatchEvent(new CustomEvent('unitSettingsUpdated', {
        detail: {
            unitId: null, // 设置为null表示全局设置更新
            settings: {
                timeFormat: timeFormat.value,
                dateFormat: dateFormat.value,
                showSeconds: showSeconds.value,
                showDate: showDate.value,
                fontSize: fontSize.value,
                fontColor: fontColor.value,
            }
        }
    }))
    saveSettings()
}

// 重置设置
const resetSettings = () => {
    if (confirm('确定要重置所有设置吗？')) {
        timeFormat.value = 'HH:mm:ss'
        dateFormat.value = 'YYYY年MM月DD日'
        showSeconds.value = true
        showDate.value = true
        fontSize.value = 3.5
        fontColor.value = '#000000'
        applySettings()
    }
}

// 预览样式
const previewStyle = computed(() => ({
    fontSize: `${fontSize.value}rem`,
    color: fontColor.value,
}))

// 预览时间
const previewTime = computed(() => {
    const now = new Date()
    let format = timeFormat.value
    
    if (!showSeconds.value) {
        format = format.replace(':ss', '')
        format = format.replace(':ss A', ' A')
        format = format.replace(':ss AM', ' AM')
        format = format.replace(':ss PM', ' PM')
    }
    
    return now.toLocaleTimeString('en-US', { 
        hour12: format.includes('A'),
        hour: '2-digit',
        minute: '2-digit',
        second: showSeconds.value ? '2-digit' : undefined
    })
})

// 预览日期
const previewDate = computed(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    
    switch (dateFormat.value) {
        case 'YYYY年MM月DD日':
            return `${year}年${month}月${day}日`
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`
        default:
            return dateFormat.value
    }
})

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.time-settings {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.setting-group {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #e0e0e0;
}

.setting-group h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #333;
}

.setting-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 10px;
}

.setting-label {
    min-width: 100px;
    font-size: 14px;
    color: #555;
}

.setting-item select,
.setting-item input[type="range"],
.setting-item input[type="color"] {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.value-display {
    font-size: 12px;
    color: #666;
    min-width: 60px;
}

.preview {
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e0e0e0;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.preview-time {
    font-weight: bold;
    margin-bottom: 10px;
}

.preview-date {
    opacity: 0.8;
    font-weight: lighter;
}

.setting-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: auto;
}

.reset-btn,
.apply-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

.reset-btn {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ccc;
}

.apply-btn {
    background-color: #4caf50;
    color: white;
}

.reset-btn:hover {
    background-color: #e0e0e0;
}

.apply-btn:hover {
    background-color: #45a049;
}
</style>