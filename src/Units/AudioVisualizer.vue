<template>
    <div class="audio-visualizer">
        <audio ref="audioElement" autoplay muted></audio>
        <canvas ref="canvas" width="1600" height="200"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

// 初始化音频分析器
const initAudioAnalyzer = () => {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    analyser.value.fftSize = 512
    bufferLength.value = analyser.value.frequencyBinCount
    dataArray.value = new Uint8Array(bufferLength.value)

    // 连接音频源到分析器
    source.value = audioContext.value.createMediaStreamSource(audioElement.value.srcObject)
    source.value.connect(analyser.value)
}

// 绘制频谱
const drawSpectrum = () => {
    animationId.value = requestAnimationFrame(drawSpectrum)

    analyser.value.getByteFrequencyData(dataArray.value)

    // 清除画布
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 绘制频谱条
    const barWidth = 10
    const barGap = 1
    let barHeight
    let x = 0

    for (let i = 0; i < bufferLength.value; i++) {
        barHeight = dataArray.value[i] / 2

        // 设置颜色渐变
        const hue = i / bufferLength.value * 720
        ctx.value.fillStyle = `hsla(${hue}, 100%, 50%, ${barHeight / 64})`

        ctx.value.fillRect(x, canvas.value.height - barHeight, barWidth, barHeight)

        x += barWidth + barGap
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

// 组件挂载时初始化画布上下文
onMounted(() => {
    if (canvas.value) {
        ctx.value = canvas.value.getContext('2d')
        startAudio()
    }
})

// 组件卸载时清理资源
onUnmounted(() => {
    stopSpectrum()
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