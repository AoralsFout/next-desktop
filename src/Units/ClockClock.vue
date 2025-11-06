<template>
    <div class="ClockClock">
        <div v-for="(digitGroup, groupIndex) in digitGroups" :key="groupIndex" class="digits">
            <div v-for="(digit, digitIndex) in digitGroup" :key="digitIndex" class="digit">
                <div v-for="(angles, clockIndex) in digit" :key="clockIndex" class="clock">
                    <div class="clock-line" :style="{ transform: `rotate(${angles ? angles[0] : 0}deg)` }"></div>
                    <div class="clock-line" :style="{ transform: `rotate(${angles ? angles[1] : 0}deg)` }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 数字到字符的映射
const digitMap = {
    '0': [
        '┌', '─', '─', '┐',
        '│', '┌', '┐', '│',
        '│', '│', '│', '│',
        '│', '│', '│', '│',
        '│', '└', '┘', '│',
        '└', '─', '─', '┘',
    ],
    '1': [
        '┌', '─', '┐', 'x',
        '└', '┐', '│', 'x',
        'x', '│', '│', 'x',
        'x', '│', '│', 'x',
        '┌', '┘', '└', '┐',
        '└', '─', '─', '┘',
    ],
    '2': [
        '┌', '─', '─', '┐',
        '└', '─', '┐', '│',
        '┌', '─', '┘', '│',
        '│', '┌', '─', '┘',
        '│', '└', '─', '┐',
        '└', '─', '─', '┘',
    ],
    '3': [
        '┌', '─', '─', '┐',
        '└', '─', '┐', '│',
        '┌', '─', '┘', '│',
        '└', '─', '┐', '│',
        '┌', '─', '┘', '│',
        '└', '─', '─', '┘',
    ],
    '4': [
        '┌', '┐', '┌', '┐',
        '│', '│', '│', '│',
        '│', '└', '┘', '│',
        '└', '─', '┐', '│',
        'x', 'x', '│', '│',
        'x', 'x', '└', '┘',
    ],
    '5': [
        '┌', '─', '─', '┐',
        '│', '┌', '─', '┘',
        '│', '└', '─', '┐',
        '└', '─', '┐', '│',
        '┌', '─', '┘', '│',
        '└', '─', '─', '┘',
    ],
    '6': [
        '┌', '─', '─', '┐',
        '│', '┌', '─', '┘',
        '│', '└', '─', '┐',
        '│', '┌', '┐', '│',
        '│', '└', '┘', '│',
        '└', '─', '─', '┘',
    ],
    '7': [
        '┌', '─', '─', '┐',
        '└', '─', '┐', '│',
        'x', 'x', '│', '│',
        'x', 'x', '│', '│',
        'x', 'x', '│', '│',
        'x', 'x', '└', '┘',
    ],
    '8': [
        '┌', '─', '─', '┐',
        '│', '┌', '┐', '│',
        '│', '└', '┘', '│',
        '│', '┌', '┐', '│',
        '│', '└', '┘', '│',
        '└', '─', '─', '┘',
    ],
    '9': [
        '┌', '─', '─', '┐',
        '│', '┌', '┐', '│',
        '│', '└', '┘', '│',
        '└', '─', '┐', '│',
        '┌', '─', '┘', '│',
        '└', '─', '─', '┘',
    ]
}

// 字符到角度的映射
const angleDictionary = {
    '┌': [0, 90],
    '─': [0, 180],
    '┐': [180, 90],
    '│': [270, 90],
    'x': [135, 135],
    '└': [270, 0],
    '┘': [270, 180]
}

// 响应式数据
const currentTime = ref('')

// 计算属性：将当前时间转换为数字组
const digitGroups = computed(() => {
    const timeString = currentTime.value.replace(/\D/g, '')
    if (timeString.length !== 6) return []

    const groups = []
    for (let i = 0; i < 6; i += 2) {
        groups.push([timeString[i], timeString[i + 1]])
    }

    return groups.map(group =>
        group.map(digit =>
            digitMap[digit]?.map(char => angleDictionary[char]) || []
        )
    )
})

// 更新时间
const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// 定时器引用
let timer = null

onMounted(() => {
    updateTime() // 立即更新时间
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})
</script>
<style scoped>
.ClockClock {
    display: flex;
    flex-direction: row;
    gap: 30px;
    overflow: hidden;
}

.digits {
    width: 240px;
    display: flex;
    flex-direction: row;
}

.digit {
    width: 120px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
}

.clock {
    width: 28px;
    height: 28px;
    margin: 1px;
    border: 1px solid #ccc;
    background-color: #00000050;
    border-radius: 50%;
    position: relative;
}

.clock-line {
    width: 15px;
    height: 2px;
    background-color: #ff0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0%, -50%);
    transform-origin: left center;
    transition: transform 0.3s ease;
}
</style>
