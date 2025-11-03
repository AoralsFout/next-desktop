<template>
    <div class="audio-visualizer">
        <audio ref="audioElement" autoplay muted></audio>
        <canvas ref="canvas" width="1600" height="200"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    unitId: {
        type: String,
        required: true
    }
})

// 响应式引用
const audioElement = ref(null)
const canvas = ref(null)
const ctx = ref(null)

// 音频分析器相关变量
const audioContext = ref(null)
const analyser = ref(null)
const source = ref(null)
const dataArray = ref(null)
const bufferLength = ref(0)
const animationId = ref(null)

// 设置项
const fftSize = ref(512)
const alignment = ref('center')
const drawBars = ref(true)
const barWidth = ref(2)
const barGap = ref(6)
const barColorType = ref('single')
const barColor = ref('#f200ff')
const drawTopLine = ref(true)
const topLineWidth = ref(2)
const topLineColorType = ref('single')
const topLineColor = ref('#f200ff')
const drawBottomLine = ref(true)
const bottomLineWidth = ref(2)
const bottomLineColorType = ref('single')
const bottomLineColor = ref('#f200ff')
const drawTopDots = ref(true)
const topDotRadius = ref(2)
const topDotColorType = ref('single')
const topDotColor = ref('#f200ff')
const topDotMargin = ref(10)
const drawBottomDots = ref(true)
const bottomDotRadius = ref(2)
const bottomDotColorType = ref('single')
const bottomDotColor = ref('#f200ff')
const bottomDotMargin = ref(10)

// 新增发光效果设置
const enableGlow = ref(true)
const glowBlur = ref(10)
const glowColorType = ref('single')
const glowColor = ref('#f200ff')
const glowIntensity = ref(0.8)

// 初始化音频分析器
const initAudioAnalyzer = () => {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    analyser.value.fftSize = fftSize.value
    bufferLength.value = analyser.value.frequencyBinCount
    dataArray.value = new Uint8Array(bufferLength.value)

    // 连接音频源到分析器
    if (audioElement.value && audioElement.value.srcObject) {
        source.value = audioContext.value.createMediaStreamSource(audioElement.value.srcObject)
        source.value.connect(analyser.value)
    }
}

// 获取颜色
const getColor = (index, colorType, singleColor) => {
    if (colorType === 'gradient') {
        const hue = index / bufferLength.value * 720
        return `hsla(${hue}, 100%, 50%, 0.8)`
    }
    return singleColor
}

// 获取发光颜色
const getGlowColor = (index) => {
    if (glowColorType.value === 'gradient') {
        const hue = index / bufferLength.value * 720
        return `hsla(${hue}, 100%, 50%, ${glowIntensity.value})`
    }
    return glowColor.value.replace(')', `, ${glowIntensity.value})`).replace('rgb', 'rgba')
}

// 应用发光效果
const applyGlowEffect = (drawFunction, index = 0) => {
    if (enableGlow.value) {
        // 保存当前状态
        ctx.value.save()

        // 设置阴影效果
        ctx.value.shadowBlur = glowBlur.value
        ctx.value.shadowColor = getGlowColor(index)

        // 执行绘制函数
        drawFunction()

        // 恢复状态
        ctx.value.restore()
    } else {
        drawFunction()
    }
}

// 绘制频谱
const drawSpectrum = () => {
    if (!analyser.value || !ctx.value || !canvas.value) return

    animationId.value = requestAnimationFrame(drawSpectrum)

    analyser.value.getByteFrequencyData(dataArray.value)

    // 清除画布
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 绘制频谱条
    let x = 0
    const spectrumTopPoints = []
    const spectrumBottomPoints = []

    // 绘制频谱条
    if (drawBars.value) {
        for (let i = 0; i < bufferLength.value; i++) {
            const barHeight = dataArray.value[i] / 2

            // 根据对齐方式计算Y坐标
            let y
            switch (alignment.value) {
                case 'top':
                    y = 0
                    break
                case 'center':
                    y = (canvas.value.height - barHeight) / 2
                    break
                case 'bottom':
                default:
                    y = canvas.value.height - barHeight
                    break
            }

            // 应用发光效果绘制频谱条
            applyGlowEffect(() => {
                ctx.value.fillStyle = getColor(i, barColorType.value, barColor.value)
                ctx.value.fillRect(x, y, Number(barWidth.value), barHeight)
            }, i)

            // 计算频谱顶部和底部点
            let spectrumTopY, spectrumBottomY
            switch (alignment.value) {
                case 'top':
                    spectrumTopY = y + barHeight
                    spectrumBottomY = y
                    break
                case 'center':
                    spectrumTopY = y + barHeight
                    spectrumBottomY = y
                    break
                case 'bottom':
                default:
                    spectrumTopY = y
                    spectrumBottomY = y + barHeight
                    break
            }

            spectrumTopPoints.push({ x: x + Number(barWidth.value) / 2, y: spectrumTopY })
            spectrumBottomPoints.push({ x: x + Number(barWidth.value) / 2, y: spectrumBottomY })

            x += Number(barWidth.value) + Number(barGap.value)
        }
    }

    // 绘制顶线
    if (drawTopLine.value && spectrumTopPoints.length > 1) {
        applyGlowEffect(() => {
            ctx.value.beginPath()
            ctx.value.moveTo(spectrumTopPoints[0].x, spectrumTopPoints[0].y)

            for (let i = 1; i < spectrumTopPoints.length; i++) {
                ctx.value.lineTo(spectrumTopPoints[i].x, spectrumTopPoints[i].y)
            }

            ctx.value.strokeStyle = getColor(0, topLineColorType.value, topLineColor.value)
            ctx.value.lineWidth = Number(topLineWidth.value)
            ctx.value.stroke()
        })
    }

    // 绘制底线
    if (drawBottomLine.value && spectrumBottomPoints.length > 1) {
        applyGlowEffect(() => {
            ctx.value.beginPath()
            ctx.value.moveTo(spectrumBottomPoints[0].x, spectrumBottomPoints[0].y)

            for (let i = 1; i < spectrumBottomPoints.length; i++) {
                ctx.value.lineTo(spectrumBottomPoints[i].x, spectrumBottomPoints[i].y)
            }

            ctx.value.strokeStyle = getColor(0, bottomLineColorType.value, bottomLineColor.value)
            ctx.value.lineWidth = Number(bottomLineWidth.value)
            ctx.value.stroke()
        })
    }

    // 绘制顶圆点
    if (drawTopDots.value && spectrumTopPoints.length > 0) {
        for (let i = 0; i < spectrumTopPoints.length; i++) {
            applyGlowEffect(() => {
                ctx.value.fillStyle = getColor(0, topDotColorType.value, topDotColor.value)
                ctx.value.beginPath()
                ctx.value.arc(
                    spectrumTopPoints[i].x,
                    spectrumTopPoints[i].y + Number(topDotMargin.value),
                    topDotRadius.value,
                    0,
                    Math.PI * 2
                )
                ctx.value.fill()
            }, i)
        }
    }

    // 绘制底圆点
    if (drawBottomDots.value && spectrumBottomPoints.length > 0) {
        for (let i = 0; i < spectrumBottomPoints.length; i++) {
            applyGlowEffect(() => {
                ctx.value.fillStyle = getColor(0, bottomDotColorType.value, bottomDotColor.value)
                ctx.value.beginPath()
                ctx.value.arc(
                    spectrumBottomPoints[i].x,
                    spectrumBottomPoints[i].y - Number(bottomDotMargin.value),
                    bottomDotRadius.value,
                    0,
                    Math.PI * 2
                )
                ctx.value.fill()
            }, i)
        }
    }
}

// 停止频谱绘制
const stopSpectrum = () => {
    if (animationId.value) {
        cancelAnimationFrame(animationId.value)
        animationId.value = null
    }

    if (audioContext.value) {
        audioContext.value.close()
        audioContext.value = null
    }
}

// 开始音频捕获和可视化
const startAudio = async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
        })

        audioElement.value.srcObject = stream
        audioElement.value.onloadedmetadata = () => {
            audioElement.value.play()
            // 初始化音频分析器并开始绘制频谱
            initAudioAnalyzer()
            drawSpectrum()
        }
    } catch (error) {
        console.error('获取媒体流失败:', error)
    }
}

// 停止音频捕获和可视化
const stopAudio = () => {
    if (audioElement.value) {
        audioElement.value.pause()
        stopSpectrum()
    }
}

// 监听设置更新事件
const handleSettingsUpdated = (event) => {
    const { unitId, settings } = event.detail
    // 检查是否是当前Unit的设置更新，或者是AudioVisualizer组件的全局设置更新
    if (unitId === props.unitId || !unitId) {
        loadSettings()
        // 重新初始化音频分析器以应用新的FFT大小
        if (audioContext.value) {
            stopSpectrum()
            initAudioAnalyzer()
            drawSpectrum()
        }
    }
}

// 加载设置
const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem(`unitSettings_AudioVisualizer_${props.unitId}`)
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

            // 加载发光效果设置
            enableGlow.value = settings.enableGlow !== undefined ? settings.enableGlow : true
            glowBlur.value = settings.glowBlur || 10
            glowColorType.value = settings.glowColorType || 'single'
            glowColor.value = settings.glowColor || '#f200ff'
            glowIntensity.value = settings.glowIntensity || 0.8

            console.log('加载设置:', settings)
        }
    } catch (error) {
        console.error('加载设置失败:', error)
    }
}

// 组件挂载时初始化画布上下文
onMounted(() => {
    if (canvas.value) {
        ctx.value = canvas.value.getContext('2d')
        loadSettings()
        startAudio()
    }
    window.addEventListener('unitSettingsUpdated', handleSettingsUpdated)
})

// 组件卸载时清理资源
onUnmounted(() => {
    stopSpectrum()
    window.removeEventListener('unitSettingsUpdated', handleSettingsUpdated)
})

// 暴露给模板的方法和属性
defineExpose({
    audioElement,
    canvas,
    startAudio,
    stopAudio
})
</script>

<style scoped>
.audio-visualizer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.controls {
    display: flex;
    gap: 10px;
}

button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>