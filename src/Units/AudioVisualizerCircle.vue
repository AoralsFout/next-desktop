<template>
    <div class="audio-visualizer-circle">
        <audio ref="audioElement" autoplay muted></audio>
        <canvas ref="canvas" width="800" height="800"></canvas>
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
const scale = ref(1)
const drawBars = ref(true)
const barWidth = ref(2)
const barGap = ref(6)
const barColorType = ref('single')
const barColor = ref('#f200ff')
const drawOuterLine = ref(true)
const outerLineWidth = ref(2)
const outerLineColorType = ref('single')
const outerLineColor = ref('#f200ff')
const drawInnerLine = ref(true)
const innerLineWidth = ref(2)
const innerLineColorType = ref('single')
const innerLineColor = ref('#f200ff')
const drawOuterDots = ref(true)
const outerDotRadius = ref(2)
const outerDotColorType = ref('single')
const outerDotColor = ref('#f200ff')
const outerDotMargin = ref(10)
const drawInnerDots = ref(true)
const innerDotRadius = ref(2)
const innerDotColorType = ref('single')
const innerDotColor = ref('#f200ff')
const innerDotMargin = ref(10)

// 新增发光效果设置
const enableGlow = ref(true)
const glowBlur = ref(10)
const glowColorType = ref('single')
const glowColor = ref('#f200ff')
const glowIntensity = ref(0.8)

// 环形布局参数
const centerX = ref(400)
const centerY = ref(400)
const baseRadius = ref(150)
const maxBarLength = ref(200)

// 新增旋转设置
const enableRotation = ref(false)
const rotationSpeed = ref(1) // 旋转速度，单位：度/帧

// 旋转角度
const rotationAngle = ref(0)

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

// 根据对齐方式计算起点和终点坐标
const calculateBarPoints = (angle, barLength) => {
    let startRadius, endRadius

    switch (alignment.value) {
        case 'top':
            // 顶对齐：频谱条从外圈向内延伸
            startRadius = Number(baseRadius.value) + Number(maxBarLength.value)
            endRadius = startRadius - barLength
            break
        case 'center':
            // 中心对齐：频谱条从中心向两侧延伸
            startRadius = Number(baseRadius.value) - barLength / 2
            endRadius = Number(baseRadius.value) + barLength / 2
            break
        case 'bottom':
        default:
            // 底对齐：频谱条从内圈向外延伸（默认）
            startRadius = Number(baseRadius.value)
            endRadius = Number(baseRadius.value) + barLength
            break
    }

    const startX = centerX.value + startRadius * Math.cos(angle)
    const startY = centerY.value + startRadius * Math.sin(angle)
    const endX = centerX.value + endRadius * Math.cos(angle)
    const endY = centerY.value + endRadius * Math.sin(angle)

    return { startX, startY, endX, endY }
}

const expandAndInterpolateArray = (inputArray) => {
    if (!(inputArray instanceof Uint8Array)) {
        throw new Error('输入必须是Uint8Array类型');
    }
    
    const originalLength = inputArray.length;
    const threeQuartersLength = Math.floor(originalLength * 3 / 4);
    
    const result = new Uint8Array(originalLength);
    result.set(inputArray.subarray(0, threeQuartersLength), 0);
    
    const paddingLength = originalLength - threeQuartersLength;
    
    // 使用线性插值填充
    for (let i = 0; i < paddingLength; i++) {
        const ratio = (i + 1) / (paddingLength + 1);
        const startIndex = Math.floor((threeQuartersLength - 1) * (1 - ratio));
        const endIndex = Math.floor((threeQuartersLength - 1) * ratio);
        
        const value = Math.round(
            (inputArray[startIndex] * (1 - ratio)) + 
            (inputArray[endIndex] * ratio)
        );
        result[threeQuartersLength + i] = Math.min(255, Math.max(0, value));
    }
    
    return result;
}

// 绘制环形频谱
const drawSpectrum = () => {
    if (!analyser.value || !ctx.value || !canvas.value) return

    animationId.value = requestAnimationFrame(drawSpectrum)

    analyser.value.getByteFrequencyData(dataArray.value)

    dataArray.value = expandAndInterpolateArray(dataArray.value)

    for (let i = 0; i < bufferLength.value; i++) {
        if (dataArray.value[i] <= 4) {
            dataArray.value[i] = 4
        }
    }

    // 清除画布
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 更新旋转角度
    if (enableRotation.value) {
        rotationAngle.value += (rotationSpeed.value * Math.PI) / 180 // 转换为弧度
        if (rotationAngle.value >= 2 * Math.PI) {
            rotationAngle.value -= 2 * Math.PI
        }
    }

    // 计算每个频谱条的角度
    const angleStep = (2 * Math.PI) / bufferLength.value
    const outerPoints = []
    const innerPoints = []

    // 绘制频谱条
    if (drawBars.value) {
        for (let i = 0; i < bufferLength.value; i++) {
            const barLength = (dataArray.value[i] / 255) * maxBarLength.value * Number(scale.value)

            // 计算当前角度（考虑旋转）
            const angle = i * angleStep + rotationAngle.value

            // 根据对齐方式计算起点和终点坐标
            const { startX, startY, endX, endY } = calculateBarPoints(angle, barLength)

            // 应用发光效果绘制频谱条
            applyGlowEffect(() => {
                // 设置颜色
                ctx.value.strokeStyle = getColor(i, barColorType.value, barColor.value)
                ctx.value.lineWidth = Number(barWidth.value)

                // 绘制频谱条
                ctx.value.beginPath()
                ctx.value.moveTo(startX, startY)
                ctx.value.lineTo(endX, endY)
                ctx.value.stroke()
            }, i)

            // 根据对齐方式记录外圈和内圈点
            switch (alignment.value) {
                case 'top':
                    // 顶对齐：起点在外圈，终点在内圈
                    outerPoints.push({ x: startX, y: startY })
                    innerPoints.push({ x: endX, y: endY })
                    break
                case 'center':
                    // 中心对齐：起点在内圈，终点在外圈
                    innerPoints.push({ x: startX, y: startY })
                    outerPoints.push({ x: endX, y: endY })
                    break
                case 'bottom':
                default:
                    // 底对齐：起点在内圈，终点在外圈
                    innerPoints.push({ x: startX, y: startY })
                    outerPoints.push({ x: endX, y: endY })
                    break
            }
        }
    }

    // 绘制外圈连线
    if (drawOuterLine.value && outerPoints.length > 1) {
        applyGlowEffect(() => {
            ctx.value.beginPath()
            ctx.value.moveTo(outerPoints[0].x, outerPoints[0].y)

            for (let i = 1; i < outerPoints.length; i++) {
                ctx.value.lineTo(outerPoints[i].x, outerPoints[i].y)
            }

            // 闭合路径
            ctx.value.lineTo(outerPoints[0].x, outerPoints[0].y)

            ctx.value.strokeStyle = getColor(0, outerLineColorType.value, outerLineColor.value)
            ctx.value.lineWidth = Number(outerLineWidth.value)
            ctx.value.stroke()
        })
    }

    // 绘制内圈连线
    if (drawInnerLine.value && innerPoints.length > 1) {
        applyGlowEffect(() => {
            ctx.value.beginPath()
            ctx.value.moveTo(innerPoints[0].x, innerPoints[0].y)

            for (let i = 1; i < innerPoints.length; i++) {
                ctx.value.lineTo(innerPoints[i].x, innerPoints[i].y)
            }

            // 闭合路径
            ctx.value.lineTo(innerPoints[0].x, innerPoints[0].y)

            ctx.value.strokeStyle = getColor(0, innerLineColorType.value, innerLineColor.value)
            ctx.value.lineWidth = Number(innerLineWidth.value)
            ctx.value.stroke()
        })
    }

    // 绘制外圈圆点
    if (drawOuterDots.value && outerPoints.length > 0) {
        for (let i = 0; i < outerPoints.length; i++) {
            applyGlowEffect(() => {
                const angle = i * angleStep
                const dotX = outerPoints[i].x + outerDotMargin.value * Math.cos(angle)
                const dotY = outerPoints[i].y + outerDotMargin.value * Math.sin(angle)

                ctx.value.fillStyle = getColor(0, outerDotColorType.value, outerDotColor.value)
                ctx.value.beginPath()
                ctx.value.arc(dotX, dotY, outerDotRadius.value, 0, Math.PI * 2)
                ctx.value.fill()
            }, i)
        }
    }

    // 绘制内圈圆点
    if (drawInnerDots.value && innerPoints.length > 0) {
        for (let i = 0; i < innerPoints.length; i++) {
            applyGlowEffect(() => {
                const angle = i * angleStep
                const dotX = innerPoints[i].x - innerDotMargin.value * Math.cos(angle)
                const dotY = innerPoints[i].y - innerDotMargin.value * Math.sin(angle)

                ctx.value.fillStyle = getColor(0, innerDotColorType.value, innerDotColor.value)
                ctx.value.beginPath()
                ctx.value.arc(dotX, dotY, innerDotRadius.value, 0, Math.PI * 2)
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
    // 检查是否是当前Unit的设置更新，或者是AudioVisualizerCircle组件的全局设置更新
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
        const savedSettings = localStorage.getItem(`unitSettings_AudioVisualizerCircle_${props.unitId}`)
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            fftSize.value = settings.fftSize || 512
            alignment.value = settings.alignment || 'center'
            centerX.value = settings.centerX || 400
            centerY.value = settings.centerY || 400
            baseRadius.value = settings.baseRadius || 150
            maxBarLength.value = settings.maxBarLength || 200
            scale.value = settings.scale || 1
            drawBars.value = settings.drawBars !== undefined ? settings.drawBars : true
            barWidth.value = settings.barWidth || 2
            barGap.value = settings.barGap || 6
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
            enableGlow.value = settings.enableGlow !== undefined ? settings.enableGlow : true
            glowBlur.value = settings.glowBlur || 10
            glowColorType.value = settings.glowColorType || 'single'
            glowColor.value = settings.glowColor || '#f200ff'
            glowIntensity.value = settings.glowIntensity || 0.8
            // 新增旋转设置
            enableRotation.value = settings.enableRotation !== undefined ? settings.enableRotation : false
            rotationSpeed.value = settings.rotationSpeed || 1
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
.audio-visualizer-circle {
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