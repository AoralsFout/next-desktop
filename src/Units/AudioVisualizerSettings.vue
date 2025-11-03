<!-- AudioVisualizer组件设置 -->
<template>
    <div class="audio-visualizer-settings">
        <div class="setting-group">
            <h4>音频分析器设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">FFT大小:</label>
                <select v-model="fftSize" @change="saveSettings">
                    <option value="256">256</option>
                    <option value="512">512</option>
                    <option value="1024">1024</option>
                    <option value="2048">2048</option>
                    <option value="4096">4096</option>
                </select>
            </div>
            
            <div class="setting-item">
                <label class="setting-label">对齐方式:</label>
                <select v-model="alignment" @change="saveSettings">
                    <option value="top">顶部对齐</option>
                    <option value="center">居中对齐</option>
                    <option value="bottom">底部对齐</option>
                </select>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>频谱条设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawBars" @change="saveSettings">
                    绘制频谱条
                </label>
            </div>
            
            <div class="setting-item" v-if="drawBars">
                <label class="setting-label">条宽度:</label>
                <input type="range" v-model="barWidth" min="1" max="20" step="1" @change="saveSettings">
                <span class="value-display">{{ barWidth }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawBars">
                <label class="setting-label">条间距:</label>
                <input type="range" v-model="barGap" min="0" max="20" step="1" @change="saveSettings">
                <span class="value-display">{{ barGap }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawBars">
                <label class="setting-label">条颜色:</label>
                <select v-model="barColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawBars && barColorType === 'single'">
                <label class="setting-label">条颜色:</label>
                <input type="color" v-model="barColor" @change="saveSettings">
                <span class="value-display">{{ barColor }}</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>顶线设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawTopLine" @change="saveSettings">
                    绘制顶线
                </label>
            </div>
            
            <div class="setting-item" v-if="drawTopLine">
                <label class="setting-label">顶线宽度:</label>
                <input type="range" v-model="topLineWidth" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ topLineWidth }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawTopLine">
                <label class="setting-label">顶线颜色:</label>
                <select v-model="topLineColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawTopLine && topLineColorType === 'single'">
                <label class="setting-label">顶线颜色:</label>
                <input type="color" v-model="topLineColor" @change="saveSettings">
                <span class="value-display">{{ topLineColor }}</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>底线设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawBottomLine" @change="saveSettings">
                    绘制底线
                </label>
            </div>
            
            <div class="setting-item" v-if="drawBottomLine">
                <label class="setting-label">底线宽度:</label>
                <input type="range" v-model="bottomLineWidth" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ bottomLineWidth }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawBottomLine">
                <label class="setting-label">底线颜色:</label>
                <select v-model="bottomLineColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawBottomLine && bottomLineColorType === 'single'">
                <label class="setting-label">底线颜色:</label>
                <input type="color" v-model="bottomLineColor" @change="saveSettings">
                <span class="value-display">{{ bottomLineColor }}</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>顶圆点设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawTopDots" @change="saveSettings">
                    绘制顶圆点
                </label>
            </div>
            
            <div class="setting-item" v-if="drawTopDots">
                <label class="setting-label">顶圆点半径:</label>
                <input type="range" v-model="topDotRadius" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ topDotRadius }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawTopDots">
                <label class="setting-label">顶圆点颜色:</label>
                <select v-model="topDotColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawTopDots && topDotColorType === 'single'">
                <label class="setting-label">顶圆点颜色:</label>
                <input type="color" v-model="topDotColor" @change="saveSettings">
                <span class="value-display">{{ topDotColor }}</span>
            </div>
            
            <div class="setting-item" v-if="drawTopDots">
                <label class="setting-label">顶圆点下间距:</label>
                <input type="range" v-model="topDotMargin" min="-50" max="50" step="1" @change="saveSettings">
                <span class="value-display">{{ topDotMargin }}px</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>底圆点设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawBottomDots" @change="saveSettings">
                    绘制底圆点
                </label>
            </div>
            
            <div class="setting-item" v-if="drawBottomDots">
                <label class="setting-label">底圆点半径:</label>
                <input type="range" v-model="bottomDotRadius" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ bottomDotRadius }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawBottomDots">
                <label class="setting-label">底圆点颜色:</label>
                <select v-model="bottomDotColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawBottomDots && bottomDotColorType === 'single'">
                <label class="setting-label">底圆点颜色:</label>
                <input type="color" v-model="bottomDotColor" @change="saveSettings">
                <span class="value-display">{{ bottomDotColor }}</span>
            </div>
            
            <div class="setting-item" v-if="drawBottomDots">
                <label class="setting-label">底圆点上间距:</label>
                <input type="range" v-model="bottomDotMargin" min="-50" max="50" step="1" @change="saveSettings">
                <span class="value-display">{{ bottomDotMargin }}px</span>
            </div>
        </div>
        
        <div class="setting-actions">
            <button class="reset-btn" @click="resetSettings">重置设置</button>
            <button class="apply-btn" @click="applySettings">应用设置</button>
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

// 音频分析器设置
const fftSize = ref(512)
const alignment = ref('center')

// 频谱条设置
const drawBars = ref(true)
const barWidth = ref(2)
const barGap = ref(6)
const barColorType = ref('single')
const barColor = ref('#f200ff')

// 顶线设置
const drawTopLine = ref(true)
const topLineWidth = ref(2)
const topLineColorType = ref('single')
const topLineColor = ref('#f200ff')

// 底线设置
const drawBottomLine = ref(true)
const bottomLineWidth = ref(2)
const bottomLineColorType = ref('single')
const bottomLineColor = ref('#f200ff')

// 顶圆点设置
const drawTopDots = ref(true)
const topDotRadius = ref(2)
const topDotColorType = ref('single')
const topDotColor = ref('#f200ff')
const topDotMargin = ref(10)

// 底圆点设置
const drawBottomDots = ref(true)
const bottomDotRadius = ref(2)
const bottomDotColorType = ref('single')
const bottomDotColor = ref('#f200ff')
const bottomDotMargin = ref(10)

// 存储键名
const getStorageKey = () => {
    return `unitSettings_AudioVisualizer_${props.unitId}`
}

// 加载设置
const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem(getStorageKey())
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            fftSize.value = settings.fftSize || 512
            alignment.value = settings.alignment || 'center'
            
            drawBars.value = settings.drawBars !== undefined ? settings.drawBars : true
            barWidth.value = settings.barWidth || 2
            barGap.value = settings.barGap || 6
            barColorType.value = settings.barColorType || 'single'
            barColor.value = settings.barColor || '#f200ff'
            
            drawTopLine.value = settings.drawTopLine !== undefined ? settings.drawTopLine : true
            topLineWidth.value = settings.topLineWidth || 2
            topLineColorType.value = settings.topLineColorType || 'single'
            topLineColor.value = settings.topLineColor || '#f200ff'
            
            drawBottomLine.value = settings.drawBottomLine !== undefined ? settings.drawBottomLine : true
            bottomLineWidth.value = settings.bottomLineWidth || 2
            bottomLineColorType.value = settings.bottomLineColorType || 'single'
            bottomLineColor.value = settings.bottomLineColor || '#f200ff'
            
            drawTopDots.value = settings.drawTopDots !== undefined ? settings.drawTopDots : true
            topDotRadius.value = settings.topDotRadius || 2
            topDotColorType.value = settings.topDotColorType || 'single'
            topDotColor.value = settings.topDotColor || '#f200ff'
            topDotMargin.value = settings.topDotMargin || 10
            
            drawBottomDots.value = settings.drawBottomDots !== undefined ? settings.drawBottomDots : true
            bottomDotRadius.value = settings.bottomDotRadius || 2
            bottomDotColorType.value = settings.bottomDotColorType || 'single'
            bottomDotColor.value = settings.bottomDotColor || '#f200ff'
            bottomDotMargin.value = settings.bottomDotMargin || 10
        }
    } catch (error) {
        console.error('加载设置失败:', error)
    }
}

// 保存设置
const saveSettings = () => {
    try {
        const settings = {
            fftSize: fftSize.value,
            alignment: alignment.value,
            
            drawBars: drawBars.value,
            barWidth: barWidth.value,
            barGap: barGap.value,
            barColorType: barColorType.value,
            barColor: barColor.value,
            
            drawTopLine: drawTopLine.value,
            topLineWidth: topLineWidth.value,
            topLineColorType: topLineColorType.value,
            topLineColor: topLineColor.value,
            
            drawBottomLine: drawBottomLine.value,
            bottomLineWidth: bottomLineWidth.value,
            bottomLineColorType: bottomLineColorType.value,
            bottomLineColor: bottomLineColor.value,
            
            drawTopDots: drawTopDots.value,
            topDotRadius: topDotRadius.value,
            topDotColorType: topDotColorType.value,
            topDotColor: topDotColor.value,
            topDotMargin: topDotMargin.value,
            
            drawBottomDots: drawBottomDots.value,
            bottomDotRadius: bottomDotRadius.value,
            bottomDotColorType: bottomDotColorType.value,
            bottomDotColor: bottomDotColor.value,
            bottomDotMargin: bottomDotMargin.value
        }
        localStorage.setItem(getStorageKey(), JSON.stringify(settings))
    } catch (error) {
        console.error('保存设置失败:', error)
    }
}

// 应用设置到Unit
const applySettings = () => {
    // 发送全局设置更新事件，不指定具体的unitId
    window.dispatchEvent(new CustomEvent('unitSettingsUpdated', {
        detail: {
            unitId: null, // 设置为null表示全局设置更新
            settings: {
                fftSize: fftSize.value,
                alignment: alignment.value,
                drawBars: drawBars.value,
                barWidth: barWidth.value,
                barGap: barGap.value,
                barColorType: barColorType.value,
                barColor: barColor.value,
                drawTopLine: drawTopLine.value,
                topLineWidth: topLineWidth.value,
                topLineColorType: topLineColorType.value,
                topLineColor: topLineColor.value,
                drawBottomLine: drawBottomLine.value,
                bottomLineWidth: bottomLineWidth.value,
                bottomLineColorType: bottomLineColorType.value,
                bottomLineColor: bottomLineColor.value,
                drawTopDots: drawTopDots.value,
                topDotRadius: topDotRadius.value,
                topDotColorType: topDotColorType.value,
                topDotColor: topDotColor.value,
                topDotMargin: topDotMargin.value,
                drawBottomDots: drawBottomDots.value,
                bottomDotRadius: bottomDotRadius.value,
                bottomDotColorType: bottomDotColorType.value,
                bottomDotColor: bottomDotColor.value,
                bottomDotMargin: bottomDotMargin.value
            }
        }
    }))
    saveSettings()
}

// 重置设置
const resetSettings = () => {
    if (confirm('确定要重置所有设置吗？')) {
        fftSize.value = 512
        alignment.value = 'center'
        
        drawBars.value = true
        barWidth.value = 2
        barGap.value = 6
        barColorType.value = 'single'
        barColor.value = '#f200ff'
        
        drawTopLine.value = true
        topLineWidth.value = 2
        topLineColorType.value = 'single'
        topLineColor.value = '#f200ff'
        
        drawBottomLine.value = true
        bottomLineWidth.value = 2
        bottomLineColorType.value = 'single'
        bottomLineColor.value = '#f200ff'
        
        drawTopDots.value = true
        topDotRadius.value = 2
        topDotColorType.value = 'single'
        topDotColor.value = '#f200ff'
        topDotMargin.value = 10
        
        drawBottomDots.value = true
        bottomDotRadius.value = 2
        bottomDotColorType.value = 'single'
        bottomDotColor.value = '#f200ff'
        bottomDotMargin.value = 10
        
        applySettings()
    }
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.audio-visualizer-settings {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    padding: 10px;
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
    min-width: 120px;
    font-size: 14px;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
}

.setting-item select,
.setting-item input[type="range"],
.setting-item input[type="color"] {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.setting-item input[type="range"] {
    flex: 1;
}

.value-display {
    font-size: 12px;
    color: #666;
    min-width: 60px;
}

.setting-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: auto;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
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