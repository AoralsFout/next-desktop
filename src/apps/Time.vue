<template>
  <div class="time-container">
    <!-- 左侧日历区域 -->
    <div class="calendar-section">
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">‹</button>
        <h2 class="month-title">{{ currentMonth }}</h2>
        <button class="nav-btn" @click="nextMonth">›</button>
      </div>
      
      <div class="weekdays">
        <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      
      <div class="calendar-grid">
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          class="calendar-day"
          :class="{
            'today': day.isToday,
            'current-month': day.isCurrentMonth,
            'selected': day.isSelected
          }"
          @click="selectDate(day)"
        >
          <span class="day-number">{{ day.day }}</span>
          <div v-if="day.hasEvents" class="event-indicator"></div>
        </div>
      </div>
      
      <div class="selected-date">
        <p>{{ selectedDateDisplay }}</p>
      </div>
    </div>

    <!-- 右侧时钟区域 -->
    <div class="clock-section">
      <div class="clock-container">
        <canvas ref="clockCanvas" class="clock-canvas" width="300" height="300"></canvas>
        <div class="digital-clock">
          <div class="time-display">{{ currentTime }}</div>
          <div class="date-display">{{ currentDateDisplay }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

import configManager from '../utils/config'

// 日历相关状态 - 使用 shallowRef 来保持 Date 对象
const currentDate = shallowRef(new Date())
const selectedDate = shallowRef(new Date())
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 时钟相关状态
const clockCanvas = ref(null)
const isDarkTheme = ref(false)
const showSeconds = ref(true)
const currentTime = ref('')
const currentDateDisplay = ref('') // 添加单独的日期显示变量
const clockInterval = ref(null)

// 计算当前月份显示
const currentMonth = computed(() => {
  const date = new Date(currentDate.value)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}年${month}月`
})

// 计算选中的日期显示
const selectedDateDisplay = computed(() => {
  const date = new Date(selectedDate.value)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 生成日历天数
const calendarDays = computed(() => {
  const date = new Date(currentDate.value)
  const year = date.getFullYear()
  const month = date.getMonth()
  const today = new Date()
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取第一天是星期几（0-6，0代表周日）
  const firstDayOfWeek = firstDay.getDay()
  
  // 获取上个月的最后几天
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  
  const days = []
  
  // 添加上个月的最后几天
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    days.push({
      date: new Date(year, month - 1, day).toISOString(),
      day: day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasEvents: false
    })
  }
  
  // 添加当前月的天数
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    const selectedDateObj = new Date(selectedDate.value)
    const isToday = date.toDateString() === today.toDateString()
    const isSelected = date.toDateString() === selectedDateObj.toDateString()
    
    days.push({
      date: date.toISOString(),
      day: day,
      isCurrentMonth: true,
      isToday: isToday,
      isSelected: isSelected,
      hasEvents: false
    })
  }
  
  // 添加下个月的前几天（补全6行）
  const totalCells = 42 // 6行 * 7天
  const nextMonthDays = totalCells - days.length
  for (let day = 1; day <= nextMonthDays; day++) {
    days.push({
      date: new Date(year, month + 1, day).toISOString(),
      day: day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasEvents: false
    })
  }
  
  return days
})

// 日历操作
const prevMonth = () => {
  const date = new Date(currentDate.value)
  currentDate.value = new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

const nextMonth = () => {
  const date = new Date(currentDate.value)
  currentDate.value = new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

const selectDate = (day) => {
  selectedDate.value = new Date(day.date)
}

// 时钟绘制函数
const drawClock = () => {
  if (!clockCanvas.value) return

  const config = configManager.getConfig()

  isDarkTheme.value = (config.colorScheme === 'dark')
  
  const canvas = clockCanvas.value
  const ctx = canvas.getContext('2d')
  const radius = canvas.width / 2
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 设置主题颜色
  const bgColor = isDarkTheme.value ? '#1a1a1a' : '#ffffff'
  const fgColor = isDarkTheme.value ? '#ffffff' : '#000000'
  const accentColor = isDarkTheme.value ? '#4fc3f7' : '#2196f3'
  
  // 绘制表盘背景
  ctx.beginPath()
  ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI)
  ctx.fillStyle = bgColor
  ctx.fill()
  ctx.strokeStyle = fgColor
  ctx.lineWidth = 4
  ctx.stroke()
  
  // 绘制刻度
  ctx.font = '14px Arial'
  ctx.fillStyle = fgColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  for (let i = 1; i <= 12; i++) {
    const angle = (i - 3) * (Math.PI * 2) / 12
    const x = radius + Math.cos(angle) * (radius - 30)
    const y = radius + Math.sin(angle) * (radius - 30)
    ctx.fillText(i.toString(), x, y)
  }
  
  // 绘制小时刻度
  for (let i = 0; i < 60; i++) {
    const angle = (i - 15) * (Math.PI * 2) / 60
    const x1 = radius + Math.cos(angle) * (radius - 15)
    const y1 = radius + Math.sin(angle) * (radius - 15)
    const x2 = radius + Math.cos(angle) * (radius - 20)
    const y2 = radius + Math.sin(angle) * (radius - 20)
    
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = i % 5 === 0 ? fgColor : '#888'
    ctx.lineWidth = i % 5 === 0 ? 3 : 1
    ctx.stroke()
  }
  
  const now = new Date()
  const hour = now.getHours() % 12
  const minute = now.getMinutes()
  const second = now.getSeconds()
  
  // 绘制时针
  const hourAngle = (hour + minute / 60) * (Math.PI * 2) / 12 - Math.PI / 2
  ctx.beginPath()
  ctx.moveTo(radius, radius)
  ctx.lineTo(
    radius + Math.cos(hourAngle) * (radius - 60),
    radius + Math.sin(hourAngle) * (radius - 60)
  )
  ctx.strokeStyle = fgColor
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.stroke()
  
  // 绘制分针
  const minuteAngle = (minute + second / 60) * (Math.PI * 2) / 60 - Math.PI / 2
  ctx.beginPath()
  ctx.moveTo(radius, radius)
  ctx.lineTo(
    radius + Math.cos(minuteAngle) * (radius - 40),
    radius + Math.sin(minuteAngle) * (radius - 40)
  )
  ctx.strokeStyle = fgColor
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.stroke()
  
  // 绘制秒针（可选）
  if (showSeconds.value) {
    const secondAngle = second * (Math.PI * 2) / 60 - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(radius, radius)
    ctx.lineTo(
      radius + Math.cos(secondAngle) * (radius - 30),
      radius + Math.sin(secondAngle) * (radius - 30)
    )
    ctx.strokeStyle = '#ff5252'
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    ctx.stroke()
  }
  
  // 绘制中心点
  ctx.beginPath()
  ctx.arc(radius, radius, 4, 0, 2 * Math.PI)
  ctx.fillStyle = bgColor
  ctx.fill()
  ctx.strokeStyle = fgColor
  ctx.lineWidth = 2
  ctx.stroke()
}

// 更新数字时钟
const updateDigitalClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds.value ? '2-digit' : undefined
  })
  
  currentDateDisplay.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 主题切换
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  drawClock()
}

// 秒针显示切换
const toggleSeconds = () => {
  showSeconds.value = !showSeconds.value
  updateDigitalClock()
}

// 初始化时钟
const initClock = () => {
  updateDigitalClock()
  drawClock()
  
  // 每秒更新一次
  clockInterval.value = setInterval(() => {
    updateDigitalClock()
    drawClock()
  }, 1000)
}

onMounted(() => {
  initClock()
})

onUnmounted(() => {
  if (clockInterval.value) {
    clearInterval(clockInterval.value)
  }
})
</script>

<style scoped>
.time-container {
  display: flex;
  height: 100%;
  background: var(--window-bg);
  color: var(--window-text);
  user-select: none;
}

/* 日历区域样式 */
.calendar-section {
  flex: 1;
  padding: 20px;
  border-right: 1px solid var(--window-border);
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.month-title {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--window-text);
}

.nav-btn {
  background: var(--window-controls-bg);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2em;
  cursor: pointer;
  color: var(--window-text);
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background: var(--window-controls-hover);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  padding: 10px 0;
  color: var(--window-text);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  flex: 1;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border: 1px solid transparent;
  width: 44px;
}

.calendar-day:hover {
  background: var(--window-controls-hover);
}

.calendar-day.current-month {
  color: var(--window-text);
}

.calendar-day:not(.current-month) {
  color: #888;
}

.calendar-day.today {
  background: var(--window-controls-bg);
  border-color: var(--window-controls-hover);
}

.calendar-day.selected {
  background: var(--window-controls-hover);
  border-color: var(--window-controls-bg);
}

.day-number {
  font-size: 1.1em;
  font-weight: 500;
}

.event-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ff5252;
  margin-top: 2px;
}

.selected-date {
  margin-top: 20px;
  padding: 15px;
  background: var(--window-header-bg);
  border-radius: 8px;
  border: 1px solid var(--window-border);
}

.selected-date h3 {
  margin-bottom: 10px;
  font-size: 1.1em;
  color: var(--window-text);
}

/* 时钟区域样式 */
.clock-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.clock-container {
  position: relative;
  margin-bottom: 30px;
}

.clock-canvas {
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.digital-clock {
  text-align: center;
  margin-top: 20px;
}

.time-display {
  font-size: 2.5em;
  font-weight: 300;
  margin-bottom: 10px;
  color: var(--window-text);
}

.date-display {
  font-size: 1.2em;
  color: var(--window-text);
  opacity: 0.8;
}
</style>