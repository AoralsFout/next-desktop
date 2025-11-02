<template>
  <div class="app-container">
    <Header />
    <div class="container">
      <WindowManager ref="windowManagerRef" />
      <UnitManager ref="unitManagerRef" />
      <MouseMenu />
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import MouseMenu from './components/MouseMenu.vue'
import WindowManager from './components/WindowManager.vue'
import UnitManager from './components/UnitManager.vue'
import { ref, onMounted } from 'vue'

import configManager from '/src/utils/config.js'
import colorSchemeManager from '/src/utils/colorSchemes.js'

const windowManagerRef = ref()
const unitManagerRef = ref()

// 处理打开窗口事件
const handleOpenWindow = async (event) => {
  const { componentName, componentTitle, options } = event.detail
  if (windowManagerRef.value) {
    await windowManagerRef.value.openWindow(componentName, componentTitle, options)
  }
}

// 处理退出应用事件
const handleExitApp = () => {
  if (window.electronAPI) {
    window.electronAPI.quitApp()
  } else {
    console.log('退出应用')
  }
}

// 处理打开Unit管理器事件
const handleOpenUnitManager = () => {
  if (unitManagerRef.value) {
    unitManagerRef.value.openManagerWindow()
  }
}

// 处理UnitManager操作事件
const handleUnitManagerAction = (event) => {
  const { action, data } = event.detail

  if (unitManagerRef.value) {
    switch (action) {
      case 'openUnit':
        unitManagerRef.value.openUnit(data.unitName)
        break
      case 'closeUnit':
        unitManagerRef.value.closeUnit(data.unitId)
        break
    }
  }
}

// 应用配色方案
const applyColorScheme = () => {
  const config = configManager.getConfig()
  colorSchemeManager.applyScheme(config.colorScheme)
}

// 处理配置更新
const handleConfigUpdated = () => {
  applyColorScheme()
}

onMounted(() => {
    // 应用初始配色方案
    applyColorScheme()
    
    // 添加事件监听器
    window.addEventListener('openWindow', handleOpenWindow)
    window.addEventListener('exitApp', handleExitApp)
    window.addEventListener('configUpdated', handleConfigUpdated)
    window.addEventListener('openUnitManager', handleOpenUnitManager)
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-image: url('/src/assets/images/tempbg.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.control-panel {
  position: absolute;
  top: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #444;
}

.control-btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background: #2980b9;
}

.control-btn.close {
  background: #e74c3c;
}

.control-btn.close:hover {
  background: #c0392b;
}

.window-status {
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}
</style>