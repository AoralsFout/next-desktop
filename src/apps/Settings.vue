<!-- 设置组件 -->
<template>
    <div class="settings-container">
        <h2>系统设置</h2>

        <div class="settings-section">
            <h3>时间显示设置</h3>

            <div class="setting-item">
                <label>时间格式:</label>
                <select v-model="timeFormat" @change="saveSettings">
                    <option v-for="option in timeFormatOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="setting-item">
                <label>日期格式:</label>
                <select v-model="dateFormat" @change="saveSettings">
                    <option v-for="option in dateFormatOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="setting-item">
                <label>显示秒:</label>
                <input type="checkbox" v-model="showSeconds" @change="saveSettings">
            </div>

            <div class="setting-item">
                <label>显示日期:</label>
                <input type="checkbox" v-model="showDate" @change="saveSettings">
            </div>
        </div>

        <div class="settings-section">
            <h3>配色方案</h3>

            <div class="setting-item">
                <label>配色方案:</label>
                <select v-model="colorScheme" @change="handleColorSchemeChange">
                    <option v-for="option in colorSchemeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>

            <!-- 自定义颜色设置（仅在选择自定义方案时显示） -->
            <div v-if="colorScheme === 'custom'" class="custom-colors-section">
                <h4>自定义颜色设置</h4>

                <div class="color-picker-group">
                    <h5>Header 颜色</h5>
                    <div class="color-picker-item">
                        <label>背景色:</label>
                        <input type="color" v-model="customColors.header.background" @change="updateCustomColors">
                    </div>
                    <div class="color-picker-item">
                        <label>文字色:</label>
                        <input type="color" v-model="customColors.header.text" @change="updateCustomColors">
                    </div>
                    <div class="color-picker-item">
                        <label>悬停色:</label>
                        <input type="color" v-model="customColors.header.hover" @change="updateCustomColors">
                    </div>
                </div>

                <div class="color-picker-group">
                    <h5>Window 颜色</h5>
                    <div class="color-picker-item">
                        <label>背景色:</label>
                        <input type="color" v-model="customColors.window.background" @change="updateCustomColors">
                    </div>
                    <div class="color-picker-item">
                        <label>标题栏背景:</label>
                        <input type="color" v-model="customColors.window.headerBackground" @change="updateCustomColors">
                    </div>
                    <div class="color-picker-item">
                        <label>边框色:</label>
                        <input type="color" v-model="customColors.window.border" @change="updateCustomColors">
                    </div>
                </div>

                <div class="color-picker-group">
                    <h5>鼠标菜单颜色</h5>
                    <div class="color-picker-item">
                        <label>背景色:</label>
                        <input type="color" v-model="customColors.mouseMenu.background" @change="updateCustomColors">
                    </div>
                    <div class="color-picker-item">
                        <label>边框色:</label>
                        <input type="color" v-model="customColors.mouseMenu.border" @change="updateCustomColors">
                    </div>
                    <div class="color-picker-item">
                        <label>文字色:</label>
                        <input type="color" v-model="customColors.mouseMenu.text" @change="updateCustomColors">
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <h3>Header设置</h3>

            <div class="setting-item">
                <label>Header透明度:</label>
                <div class="slider-container">
                    <input type="range" v-model="headerOpacity" min="0" max="1" step="0.01" @change="saveSettings"
                        class="slider">
                    <span class="slider-value">{{ (headerOpacity * 100).toFixed(0) }}%</span>
                </div>
            </div>

            <div class="setting-item">
                <label>启用背景模糊:</label>
                <input type="checkbox" v-model="enableHeaderBlur" @change="saveSettings">
            </div>

            <div class="setting-item" v-if="enableHeaderBlur">
                <label>背景模糊强度:</label>
                <div class="slider-container">
                    <input type="range" v-model="headerBlur" min="0" max="20" step="1" @change="saveSettings"
                        class="slider">
                    <span class="slider-value">{{ headerBlur }}px</span>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <h3>动画设置</h3>

            <div class="setting-item">
                <label>启用动画:</label>
                <input type="checkbox" v-model="enableAnimations" @change="saveSettings">
            </div>

            <div class="setting-item" v-if="enableAnimations">
                <label>窗口动画:</label>
                <select v-model="windowAnimation" @change="saveSettings">
                    <option value="windowFadeIn">淡入淡出</option>
                    <option value="windowSlideIn">滑动</option>
                    <option value="windowScaleIn">缩放</option>
                    <option value="windowBounceIn">弹跳</option>
                    <option value="windowFlipIn">翻转</option>
                    <option value="noAnimation">无动画</option>
                </select>
            </div>

            <div class="setting-item" v-if="enableAnimations">
                <label>鼠标菜单动画:</label>
                <select v-model="mouseMenuAnimation" @change="saveSettings">
                    <option value="windowFadeIn">淡入淡出</option>
                    <option value="windowSlideIn">滑动</option>
                    <option value="windowScaleIn">缩放</option>
                    <option value="windowBounceIn">弹跳</option>
                    <option value="windowFlipIn">翻转</option>
                    <option value="noAnimation">无动画</option>
                </select>
            </div>

            <div class="setting-item" v-if="enableAnimations">
                <label>动画速度:</label>
                <select v-model="animationSpeed" @change="saveSettings">
                    <option value="windowFast">快速</option>
                    <option value="windowSlow">慢速</option>
                </select>
            </div>
        </div>

        <div class="actions">
            <button @click="saveSettings" class="save-btn">保存设置</button>
            <button @click="resetSettings" class="reset-btn">重置</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import configManager from '../utils/config.js'

// 配色方案设置
const colorScheme = ref('dark')
const colorSchemeOptions = ref([])
const customColors = ref({
    header: {
        background: '#333333',
        text: '#ffffff',
        hover: '#555555',
        active: '#666666'
    },
    window: {
        background: '#2d2d2d',
        headerBackground: '#3c3c3c',
        border: '#444444',
        text: '#ffffff',
        controls: {
            background: '#555555',
            hover: '#666666',
            closeHover: '#e74c3c',
            minimizeHover: '#f39c12',
            maximizeHover: '#3498db'
        }
    },
    mouseMenu: {
        background: '#333333',
        border: '#555555',
        text: '#ffffff',
        hover: '#555555',
        active: '#666666'
    },
    settings: {
        background: '#3c3c3c',
        sectionBackground: '#3c3c3c',
        text: '#ffffff',
        border: '#444444'
    }
})
// 动画设置
const enableAnimations = ref(true)
const windowAnimation = ref('windowFadeIn')
const mouseMenuAnimation = ref('windowFadeIn')
const animationSpeed = ref('windowFast')

// 系统设置
const autoStart = ref(false)
const showNotifications = ref(true)

// Header设置
const headerOpacity = ref(0.8)
const headerBlur = ref(5)
const enableHeaderBlur = ref(true)

// 加载设置
const loadSettings = () => {
    const config = configManager.getConfig()
    colorScheme.value = config.colorScheme
    colorSchemeOptions.value = configManager.getColorSchemeOptions()

    timeFormat.value = config.timeFormat || 'HH:mm:ss'
    dateFormat.value = config.dateFormat || 'YYYY-MM-DD'
    showSeconds.value = config.showSeconds !== undefined ? config.showSeconds : true
    showDate.value = config.showDate !== undefined ? config.showDate : false
    timeFormatOptions.value = configManager.getTimeFormatOptions()
    dateFormatOptions.value = configManager.getDateFormatOptions()
    headerOpacity.value = config.headerOpacity !== undefined ? config.headerOpacity : 0.8
    headerBlur.value = config.headerBlur !== undefined ? config.headerBlur : 5
    enableHeaderBlur.value = config.enableHeaderBlur !== undefined ? config.enableHeaderBlur : true

    if (config.customColors && Object.keys(config.customColors).length > 0) {
        // 深度合并自定义颜色，确保结构完整
        const deepMerge = (target, source) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {}
                    deepMerge(target[key], source[key])
                } else {
                    target[key] = source[key]
                }
            }
            return target
        }
        customColors.value = deepMerge({ ...customColors.value }, config.customColors)
    } else {
        // 如果没有自定义颜色，使用默认值
        customColors.value = {
            header: {
                background: '#333333',
                text: '#ffffff',
                hover: '#555555',
                active: '#666666'
            },
            window: {
                background: '#2d2d2d',
                headerBackground: '#3c3c3c',
                border: '#444444',
                text: '#ffffff',
                controls: {
                    background: '#555555',
                    hover: '#666666',
                    closeHover: '#e74c3c',
                    minimizeHover: '#f39c12',
                    maximizeHover: '#3498db'
                }
            },
            mouseMenu: {
                background: '#333333',
                border: '#555555',
                text: '#ffffff',
                hover: '#555555',
                active: '#666666'
            },
            settings: {
                background: '#3c3c3c',
                sectionBackground: '#3c3c3c',
                text: '#ffffff',
                border: '#444444'
            }
        }
    }

    enableAnimations.value = config.enableAnimations
    windowAnimation.value = config.windowAnimation
    mouseMenuAnimation.value = config.mouseMenuAnimation
    animationSpeed.value = config.animationSpeed
    autoStart.value = config.autoStart || false
    showNotifications.value = config.showNotifications !== undefined ? config.showNotifications : true
}

// 处理配色方案变更
const handleColorSchemeChange = () => {
    if (colorScheme.value !== 'custom') {
        saveSettings()
    }
}

// 更新自定义颜色
const updateCustomColors = () => {
    if (colorScheme.value === 'custom') {
        saveSettings()
    }
}

// 时间显示设置
const timeFormat = ref('HH:mm:ss')
const dateFormat = ref('YYYY-MM-DD')
const showSeconds = ref(true)
const showDate = ref(false)
const timeFormatOptions = ref([])
const dateFormatOptions = ref([])


// 保存设置
const saveSettings = () => {
    const newConfig = {
        colorScheme: colorScheme.value,
        customColors: colorScheme.value === 'custom' ? customColors.value : {},
        enableAnimations: enableAnimations.value,
        windowAnimation: windowAnimation.value,
        mouseMenuAnimation: mouseMenuAnimation.value,
        animationSpeed: animationSpeed.value,
        autoStart: autoStart.value,
        showNotifications: showNotifications.value,
        timeFormat: timeFormat.value,
        dateFormat: dateFormat.value,
        showSeconds: showSeconds.value,
        showDate: showDate.value,
        headerOpacity: headerOpacity.value,
        headerBlur: headerBlur.value,
        enableHeaderBlur: enableHeaderBlur.value
    }

    configManager.updateConfig(newConfig)
}

// 重置设置
const resetSettings = () => {
    configManager.resetConfig()
    // 重新加载配色方案选项
    colorSchemeOptions.value = configManager.getColorSchemeOptions()
    // 重新加载设置
    loadSettings()
    alert('设置已重置！')
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.settings-container {
    padding: 20px;
    color: var(--settings-text);
    overflow-y: auto;
    background-color: var(--settings-bg);
}

.settings-container h2 {
    margin-bottom: 20px;
    color: var(--settings-text);
    border-bottom: 1px solid var(--settings-border);
    padding-bottom: 10px;
}

.settings-section {
    margin-bottom: 25px;
    background-color: var(--settings-section-bg);
    padding: 15px;
    border-radius: 6px;
    border: 1px solid var(--settings-border);
}

.settings-section h3 {
    margin-bottom: 15px;
    color: var(--settings-text);
}

.settings-section h4 {
    margin: 15px 0 10px 0;
    color: var(--settings-text);
}

.settings-section h5 {
    margin: 10px 0 5px 0;
    color: var(--settings-text);
}

.setting-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    justify-content: space-between;
}

.setting-item label {
    margin-right: 10px;
    min-width: 120px;
    color: var(--settings-text);
}

.setting-item select,
.setting-item input[type="checkbox"],
.setting-item input[type="color"] {
    background-color: var(--settings-bg);
    border: 1px solid var(--settings-border);
    color: var(--settings-text);
    padding: 5px 10px;
    border-radius: 4px;
}

.setting-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.setting-item input[type="color"] {
    width: 60px;
    height: 30px;
    padding: 2px;
}

.custom-colors-section {
    margin-top: 15px;
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
}

.color-picker-group {
    margin-bottom: 15px;
}

.color-picker-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    justify-content: space-between;
}

.color-picker-item label {
    min-width: 100px;
    margin-right: 10px;
    color: var(--settings-text);
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

.save-btn,
.reset-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.save-btn {
    background-color: #3498db;
    color: white;
}

.save-btn:hover {
    background-color: #2980b9;
}

.reset-btn {
    background-color: #95a5a6;
    color: white;
}

.reset-btn:hover {
    background-color: #7f8c8d;
}

.slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: var(--settings-bg);
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
    border: none;
}

.slider-value {
    min-width: 40px;
    text-align: right;
    font-size: 14px;
    color: var(--settings-text);
}
</style>