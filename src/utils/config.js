// 配置管理模块
import colorSchemeManager from './colorSchemes.js'
class ConfigManager {
    constructor() {
        this.defaultConfig = {
            windowAnimation: 'windowFadeIn',
            mouseMenuAnimation: 'windowFadeIn',
            animationSpeed: 'windowFast',
            enableAnimations: true,
            colorScheme: 'dark', // 默认配色方案
            customColors: {}, // 用户自定义颜色
            timeFormat: 'HH:mm:ss', // 默认时间格式
            dateFormat: 'YYYY-MM-DD', // 默认日期格式
            showSeconds: true, // 是否显示秒
            showDate: false, // 是否显示日期
            headerOpacity: 0.8, // Header透明度 (0-1)
            headerBlur: 5, // Header背景模糊 (0-20px)
            enableHeaderBlur: true // 是否启用Header背景模糊
        }
        this.loadConfig()
    }

    // 加载配置
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('desktopConfig')
            if (savedConfig) {
                this.config = { ...this.defaultConfig, ...JSON.parse(savedConfig) }
            } else {
                this.config = { ...this.defaultConfig }
            }

            // 应用配色方案
            this.applyColorScheme()
        } catch (error) {
            console.error('加载配置失败:', error)
            this.config = { ...this.defaultConfig }
            this.applyColorScheme()
        }
    }

    // 保存配置
    saveConfig() {
        try {
            localStorage.setItem('desktopConfig', JSON.stringify(this.config))
            // 应用配色方案
            this.applyColorScheme()
            // 触发配置更新事件
            window.dispatchEvent(new CustomEvent('configUpdated', {
                detail: { config: this.config }
            }))
        } catch (error) {
            console.error('保存配置失败:', error)
        }
    }

    // 应用配色方案
    applyColorScheme() {
        try {
            if (this.config.colorScheme === 'custom' && Object.keys(this.config.customColors).length > 0) {
                // 更新自定义方案
                colorSchemeManager.updateCustomScheme(this.config.customColors)
            }
            colorSchemeManager.applyScheme(this.config.colorScheme)
        } catch (error) {
            console.error('应用配色方案失败:', error)
            // 如果应用自定义方案失败，回退到默认方案
            if (this.config.colorScheme === 'custom') {
                this.config.colorScheme = 'dark'
                colorSchemeManager.applyScheme('dark')
            }
        }
    }

    // 获取配置
    getConfig() {
        return { ...this.config }
    }

    // 更新配置
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig }
        this.saveConfig()
    }

    // 重置配置
    resetConfig() {
        this.config = {
            ...this.defaultConfig,
            customColors: {} // 确保重置为空对象
        }
        this.saveConfig()
    }

    // 获取配色方案选项
    getColorSchemeOptions() {
        return colorSchemeManager.getSchemeNames()
    }

    // 获取当前配色方案的颜色变量
    getCurrentColorVariables() {
        return colorSchemeManager.getColorVariables(this.config.colorScheme)
    }

    // 获取时间格式选项
    getTimeFormatOptions() {
        return [
            { value: 'HH:mm:ss', label: '24小时制 (HH:mm:ss)' },
            { value: 'hh:mm:ss A', label: '12小时制 (hh:mm:ss AM/PM)' },
            { value: 'HH:mm', label: '24小时制 (HH:mm)' },
            { value: 'hh:mm A', label: '12小时制 (hh:mm AM/PM)' }
        ]
    }

    // 获取日期格式选项
    getDateFormatOptions() {
        return [
            { value: 'YYYY-MM-DD', label: '年-月-日 (YYYY-MM-DD)' },
            { value: 'MM/DD/YYYY', label: '月/日/年 (MM/DD/YYYY)' },
            { value: 'DD/MM/YYYY', label: '日/月/年 (DD/MM/YYYY)' },
            { value: 'YYYY年MM月DD日', label: '年月日 (YYYY年MM月DD日)' }
        ]
    }
}

// 创建全局配置实例
const configManager = new ConfigManager()

export default configManager