// 配色方案管理模块
class ColorSchemeManager {
    constructor() {
        this.schemes = {
            // 深色方案
            dark: {
                name: '深色',
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
            },
            // 浅色方案
            light: {
                name: '浅色',
                header: {
                    background: '#f5f5f5',
                    text: '#333333',
                    hover: '#e0e0e0',
                    active: '#d0d0d0'
                },
                window: {
                    background: '#ffffff',
                    headerBackground: '#f0f0f0',
                    border: '#dddddd',
                    text: '#333333',
                    controls: {
                        background: '#e0e0e0',
                        hover: '#d0d0d0',
                        closeHover: '#ff6b6b',
                        minimizeHover: '#ffd93d',
                        maximizeHover: '#6bc5ff'
                    }
                },
                mouseMenu: {
                    background: '#ffffff',
                    border: '#dddddd',
                    text: '#333333',
                    hover: '#f0f0f0',
                    active: '#e0e0e0'
                },
                settings: {
                    background: '#f8f9fa',
                    sectionBackground: '#ffffff',
                    text: '#333333',
                    border: '#dee2e6'
                }
            },
            // 用户自定义方案
            custom: {
                name: '自定义',
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
    }

    // 获取配色方案
    getScheme(schemeName) {
        return this.schemes[schemeName] || this.schemes.dark
    }

    // 获取所有方案名称
    getSchemeNames() {
        return Object.keys(this.schemes).map(key => ({
            value: key,
            label: this.schemes[key].name
        }))
    }

    // 更新自定义方案
    updateCustomScheme(customScheme) {
        // 确保自定义方案有完整的结构
        const defaultCustomScheme = {
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
        
        // 深度合并自定义方案
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
        
        this.schemes.custom = deepMerge({ ...defaultCustomScheme }, customScheme)
    }

    // 获取当前配色方案的颜色变量
    getColorVariables(schemeName) {
        const scheme = this.getScheme(schemeName)

        // 安全获取嵌套属性，防止访问 undefined 的属性
        const safeGet = (obj, path, defaultValue = '') => {
            const keys = path.split('.')
            let result = obj
            for (const key of keys) {
                if (result && typeof result === 'object' && key in result) {
                    result = result[key]
                } else {
                    return defaultValue
                }
            }
            return result || defaultValue
        }

        return {
            // Header 颜色变量
            '--header-bg': safeGet(scheme, 'header.background', '#333333'),
            '--header-text': safeGet(scheme, 'header.text', '#ffffff'),
            '--header-hover': safeGet(scheme, 'header.hover', '#555555'),
            '--header-active': safeGet(scheme, 'header.active', '#666666'),

            // Window 颜色变量
            '--window-bg': safeGet(scheme, 'window.background', '#2d2d2d'),
            '--window-header-bg': safeGet(scheme, 'window.headerBackground', '#3c3c3c'),
            '--window-border': safeGet(scheme, 'window.border', '#444444'),
            '--window-text': safeGet(scheme, 'window.text', '#ffffff'),
            '--window-controls-bg': safeGet(scheme, 'window.controls.background', '#555555'),
            '--window-controls-hover': safeGet(scheme, 'window.controls.hover', '#666666'),
            '--window-controls-close-hover': safeGet(scheme, 'window.controls.closeHover', '#e74c3c'),
            '--window-controls-minimize-hover': safeGet(scheme, 'window.controls.minimizeHover', '#f39c12'),
            '--window-controls-maximize-hover': safeGet(scheme, 'window.controls.maximizeHover', '#3498db'),

            // MouseMenu 颜色变量
            '--mousemenu-bg': safeGet(scheme, 'mouseMenu.background', '#333333'),
            '--mousemenu-border': safeGet(scheme, 'mouseMenu.border', '#555555'),
            '--mousemenu-text': safeGet(scheme, 'mouseMenu.text', '#ffffff'),
            '--mousemenu-hover': safeGet(scheme, 'mouseMenu.hover', '#555555'),
            '--mousemenu-active': safeGet(scheme, 'mouseMenu.active', '#666666'),

            // Settings 颜色变量
            '--settings-bg': safeGet(scheme, 'settings.background', '#3c3c3c'),
            '--settings-section-bg': safeGet(scheme, 'settings.sectionBackground', '#3c3c3c'),
            '--settings-text': safeGet(scheme, 'settings.text', '#ffffff'),
            '--settings-border': safeGet(scheme, 'settings.border', '#444444')
        }
    }

    // 应用配色方案到文档根元素
    applyScheme(schemeName) {
        const colorVariables = this.getColorVariables(schemeName)
        const root = document.documentElement

        Object.entries(colorVariables).forEach(([variable, value]) => {
            root.style.setProperty(variable, value)
        })
    }
}

// 创建全局配色方案实例
const colorSchemeManager = new ColorSchemeManager()

export default colorSchemeManager