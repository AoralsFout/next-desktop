<!-- AudioVisualizerCircle组件设置 -->
<template>
    <div class="audio-visualizer-circle-settings">
        <div class="setting-group">
            <h4>音频分析器设置</h4>

            <div class="setting-item">
                <label class="setting-label">缩放比例:</label>
                <input type="range" v-model="scale" min="0.1" max="2" step="0.1" @change="saveSettings">
                <span class="value-display">{{ scale }}</span>
            </div>
            
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
                    <option value="top">顶对齐</option>
                    <option value="center">中心对齐</option>
                    <option value="bottom">底对齐</option>
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
            <h4>外圈连线设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawOuterLine" @change="saveSettings">
                    绘制外圈连线
                </label>
            </div>
            
            <div class="setting-item" v-if="drawOuterLine">
                <label class="setting-label">连线宽度:</label>
                <input type="range" v-model="outerLineWidth" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ outerLineWidth }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawOuterLine">
                <label class="setting-label">连线颜色:</label>
                <select v-model="outerLineColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawOuterLine && outerLineColorType === 'single'">
                <label class="setting-label">连线颜色:</label>
                <input type="color" v-model="outerLineColor" @change="saveSettings">
                <span class="value-display">{{ outerLineColor }}</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>内圈连线设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawInnerLine" @change="saveSettings">
                    绘制内圈连线
                </label>
            </div>
            
            <div class="setting-item" v-if="drawInnerLine">
                <label class="setting-label">连线宽度:</label>
                <input type="range" v-model="innerLineWidth" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ innerLineWidth }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawInnerLine">
                <label class="setting-label">连线颜色:</label>
                <select v-model="innerLineColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawInnerLine && innerLineColorType === 'single'">
                <label class="setting-label">连线颜色:</label>
                <input type="color" v-model="innerLineColor" @change="saveSettings">
                <span class="value-display">{{ innerLineColor }}</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>外圈圆点设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawOuterDots" @change="saveSettings">
                    绘制外圈圆点
                </label>
            </div>
            
            <div class="setting-item" v-if="drawOuterDots">
                <label class="setting-label">圆点半径:</label>
                <input type="range" v-model="outerDotRadius" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ outerDotRadius }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawOuterDots">
                <label class="setting-label">圆点颜色:</label>
                <select v-model="outerDotColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawOuterDots && outerDotColorType === 'single'">
                <label class="setting-label">圆点颜色:</label>
                <input type="color" v-model="outerDotColor" @change="saveSettings">
                <span class="value-display">{{ outerDotColor }}</span>
            </div>
            
            <div class="setting-item" v-if="drawOuterDots">
                <label class="setting-label">圆点外间距:</label>
                <input type="range" v-model="outerDotMargin" min="-50" max="50" step="1" @change="saveSettings">
                <span class="value-display">{{ outerDotMargin }}px</span>
            </div>
        </div>
        
        <div class="setting-group">
            <h4>内圈圆点设置</h4>
            
            <div class="setting-item">
                <label class="setting-label">
                    <input type="checkbox" v-model="drawInnerDots" @change="saveSettings">
                    绘制内圈圆点
                </label>
            </div>
            
            <div class="setting-item" v-if="drawInnerDots">
                <label class="setting-label">圆点半径:</label>
                <input type="range" v-model="innerDotRadius" min="1" max="10" step="1" @change="saveSettings">
                <span class="value-display">{{ innerDotRadius }}px</span>
            </div>
            
            <div class="setting-item" v-if="drawInnerDots">
                <label class="setting-label">圆点颜色:</label>
                <select v-model="innerDotColorType" @change="saveSettings">
                    <option value="single">单色</option>
                    <option value="gradient">彩色渐变</option>
                </select>
            </div>
            
            <div class="setting-item" v-if="drawInnerDots && innerDotColorType === 'single'">
                <label class="setting-label">圆点颜色:</label>
                <input type="color" v-model="innerDotColor" @change="saveSettings">
                <span class="value-display">{{ innerDotColor }}</span>
            </div>
            
            <div class="setting-item" v-if="drawInnerDots">
                <label class="setting-label">圆点内间距:</label>
                <input type="range" v-model="innerDotMargin" min="-50" max="50" step="1" @change="saveSettings">
                <span class="value-display">{{ innerDotMargin }}px</span>
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
const alignment = ref('center') // 新增对齐选项

// 频谱条设置
const drawBars = ref(true)
const barWidth = ref(2)
const barColorType = ref('single')
const barColor = ref('#f200ff')

// 缩放比例
const scale = ref(1)

// 外圈连线设置
const drawOuterLine = ref(true)
const outerLineWidth = ref(2)
const outerLineColorType = ref('single')
const outerLineColor = ref('#f200ff')

// 内圈连线设置
const drawInnerLine = ref(true)
const innerLineWidth = ref(2)
const innerLineColorType = ref('single')
const innerLineColor = ref('#f200ff')

// 外圈圆点设置
const drawOuterDots = ref(true)
const outerDotRadius = ref(2)
const outerDotColorType = ref('single')
const outerDotColor = ref('#f200ff')
const outerDotMargin = ref(10)

// 内圈圆点设置
const drawInnerDots = ref(true)
const innerDotRadius = ref(2)
const innerDotColorType = ref('single')
const innerDotColor = ref('#f200ff')
const innerDotMargin = ref(10)

// 存储键名
const getStorageKey = () => {
    return `unitSettings_AudioVisualizerCircle_${props.unitId}`
}

// 加载设置
const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem(getStorageKey())
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            fftSize.value = settings.fftSize || 512
            alignment.value = settings.alignment || 'center' // 加载对齐设置

            scale.value = settings.scale || 1
            
            drawBars.value = settings.drawBars !== undefined ? settings.drawBars : true
            barWidth.value = settings.barWidth || 2
            barColorType.value = settings.barColorType || 'single'
            barColor.value = settings.barColor || '#f200ff'
            
            drawOuterLine.value = settings.drawOuterLine !== undefined ? settings.drawOuterLine : true
            outerLineWidth.value = settings.outerLineWidth || 2
            outerLineColorType.value = settings.outerLineColorType || 'single'
            outerLineColor.value = settings.outerLineColor || '#f200ff'
            
            drawInnerLine.value = settings.drawInnerLine !== undefined ? settings.drawInnerLine : true
            innerLineWidth.value = settings.innerLineWidth || 2
            innerLineColorType.value = settings.innerLineColorType || 'single'
            innerLineColor.value = settings.innerLineColor || '#f200ff'
            
            drawOuterDots.value = settings.drawOuterDots !== undefined ? settings.drawOuterDots : true
            outerDotRadius.value = settings.outerDotRadius || 2
            outerDotColorType.value = settings.outerDotColorType || 'single'
            outerDotColor.value = settings.outerDotColor || '#f200ff'
            outerDotMargin.value = settings.outerDotMargin || 10
            
            drawInnerDots.value = settings.drawInnerDots !== undefined ? settings.drawInnerDots : true
            innerDotRadius.value = settings.innerDotRadius || 2
            innerDotColorType.value = settings.innerDotColorType || 'single'
            innerDotColor.value = settings.innerDotColor || '#f200ff'
            innerDotMargin.value = settings.innerDotMargin || 10
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
            alignment: alignment.value, // 保存对齐设置
            scale: scale.value,
            
            drawBars: drawBars.value,
            barWidth: barWidth.value,
            barColorType: barColorType.value,
            barColor: barColor.value,
            
            drawOuterLine: drawOuterLine.value,
            outerLineWidth: outerLineWidth.value,
            outerLineColorType: outerLineColorType.value,
            outerLineColor: outerLineColor.value,
            
            drawInnerLine: drawInnerLine.value,
            innerLineWidth: innerLineWidth.value,
            innerLineColorType: innerLineColorType.value,
            innerLineColor: innerLineColor.value,
            
            drawOuterDots: drawOuterDots.value,
            outerDotRadius: outerDotRadius.value,
            outerDotColorType: outerDotColorType.value,
            outerDotColor: outerDotColor.value,
            outerDotMargin: outerDotMargin.value,
            
            drawInnerDots: drawInnerDots.value,
            innerDotRadius: innerDotRadius.value,
            innerDotColorType: innerDotColorType.value,
            innerDotColor: innerDotColor.value,
            innerDotMargin: innerDotMargin.value
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
                alignment: alignment.value, // 应用对齐设置
                scale: scale.value,
                drawBars: drawBars.value,
                barWidth: barWidth.value,
                barColorType: barColorType.value,
                barColor: barColor.value,
                drawOuterLine: drawOuterLine.value,
                outerLineWidth: outerLineWidth.value,
                outerLineColorType: outerLineColorType.value,
                outerLineColor: outerLineColor.value,
                drawInnerLine: drawInnerLine.value,
                innerLineWidth: innerLineWidth.value,
                innerLineColorType: innerLineColorType.value,
                innerLineColor: innerLineColor.value,
                drawOuterDots: drawOuterDots.value,
                outerDotRadius: outerDotRadius.value,
                outerDotColorType: outerDotColorType.value,
                outerDotColor: outerDotColor.value,
                outerDotMargin: outerDotMargin.value,
                drawInnerDots: drawInnerDots.value,
                innerDotRadius: innerDotRadius.value,
                innerDotColorType: innerDotColorType.value,
                innerDotColor: innerDotColor.value,
                innerDotMargin: innerDotMargin.value
            }
        }
    }))
    saveSettings()
}

// 重置设置
const resetSettings = () => {
    if (confirm('确定要重置所有设置吗？')) {
        fftSize.value = 512
        alignment.value = 'center' // 重置对齐设置
        scale.value = 1
        
        drawBars.value = true
        barWidth.value = 2
        barColorType.value = 'single'
        barColor.value = '#f200ff'
        
        drawOuterLine.value = true
        outerLineWidth.value = 2
        outerLineColorType.value = 'single'
        outerLineColor.value = '#f200ff'
        
        drawInnerLine.value = true
        innerLineWidth.value = 2
        innerLineColorType.value = 'single'
        innerLineColor.value = '#f200ff'
        
        drawOuterDots.value = true
        outerDotRadius.value = 2
        outerDotColorType.value = 'single'
        outerDotColor.value = '#f200ff'
        outerDotMargin.value = 10
        
        drawInnerDots.value = true
        innerDotRadius.value = 2
        innerDotColorType.value = 'single'
        innerDotColor.value = '#f200ff'
        innerDotMargin.value = 10
        
        applySettings()
    }
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.audio-visualizer-circle-settings {
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