<template>
    <div class="files-container">
        <!-- 顶部工具栏 -->
        <div class="toolbar">
            <div class="toolbar-left">
                <button class="toolbar-btn" @click="goBack" :disabled="!canGoBack">
                    <span class="icon">←</span>
                    后退
                </button>
                <button class="toolbar-btn" @click="goForward" :disabled="!canGoForward">
                    <span class="icon">→</span>
                    前进
                </button>
                <button class="toolbar-btn" @click="goUp" :disabled="!canGoUp">
                    <span class="icon">↑</span>
                    向上
                </button>
                <button class="toolbar-btn" @click="refresh">
                    <span class="icon">↻</span>
                    刷新
                </button>
            </div>
            <div class="toolbar-center">
                <div class="path-display">
                    <span class="path-segment" v-for="(segment, index) in pathSegments" :key="index"
                        @click="navigateToPath(index)">
                        {{ segment.name }}
                        <span class="separator" v-if="index < pathSegments.length - 1">/</span>
                    </span>
                </div>
            </div>
            <div class="toolbar-right">
                <div class="search-box">
                    <input type="text" v-model="searchQuery" placeholder="搜索文件..." class="search-input">
                    <span class="search-icon">🔍</span>
                </div>
            </div>
        </div>

        <!-- 文件列表区域 -->
        <div class="files-content">
            <div class="files-header">
                <div class="header-name" @click="sortBy('name')">
                    名称
                    <span class="sort-indicator" v-if="sortField === 'name'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                </div>
                <div class="header-size" @click="sortBy('size')">
                    大小
                    <span class="sort-indicator" v-if="sortField === 'size'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                </div>
                <div class="header-type" @click="sortBy('type')">
                    类型
                    <span class="sort-indicator" v-if="sortField === 'type'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                </div>
                <div class="header-modified" @click="sortBy('modified')">
                    修改日期
                    <span class="sort-indicator" v-if="sortField === 'modified'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                </div>
            </div>

            <div class="files-list" v-if="!loading">
                <div v-for="item in filteredItems" :key="item.path" class="file-item"
                    :class="{ 'selected': selectedItem === item.path, 'folder': item.isDirectory }"
                    @click="selectItem(item)" @dblclick="handleItemDoubleClick(item)">
                    <div class="file-icon">
                        <span v-if="item.isDirectory" class="folder-icon">📁</span>
                        <span v-else class="file-type-icon">{{ getFileIcon(item.extension) }}</span>
                        <div class="file-name">{{ item.name }}</div>
                    </div>
                    <div class="file-size">{{ formatFileSize(item.size) }}</div>
                    <div class="file-type">{{ getFileType(item.extension) }}</div>
                    <div class="file-modified">{{ formatDate(item.modified) }}</div>
                </div>
            </div>

            <div class="loading" v-else>
                <div class="loading-spinner"></div>
                <p>加载中...</p>
            </div>

            <!-- 空状态 -->
            <div class="empty-state" v-if="!loading && filteredItems.length === 0">
                <div class="empty-icon">📁</div>
                <p class="empty-text">此文件夹为空</p>
            </div>
        </div>

        <!-- 底部状态栏 -->
        <div class="status-bar">
            <div class="status-left">
                <span v-if="selectedItem">{{ getSelectedItemInfo() }}</span>
                <span v-else>{{ items.length }} 个项目</span>
            </div>
            <div class="status-right">
                <span>{{ currentPath }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 响应式数据
const currentPath = ref('')
const items = ref([])
const loading = ref(false)
const selectedItem = ref('')
const searchQuery = ref('')
const sortField = ref('name')
const sortDirection = ref('asc')
const history = ref([])
const historyIndex = ref(-1)

// 计算属性
const pathSegments = computed(() => {
    if (!currentPath.value) return []
    const segments = currentPath.value.split('\\').filter(segment => segment)
    return segments.map((segment, index) => ({
        name: segment,
        path: segments.slice(0, index + 1).join('\\')
    }))
})

const filteredItems = computed(() => {
    let filtered = items.value.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    // 排序
    filtered.sort((a, b) => {
        let aValue = a[sortField.value]
        let bValue = b[sortField.value]

        if (sortField.value === 'name') {
            aValue = aValue.toLowerCase()
            bValue = bValue.toLowerCase()
        }

        if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
        return 0
    })

    // 文件夹优先
    return filtered.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        return 0
    })
})

const canGoBack = computed(() => historyIndex.value > 0)
const canGoForward = computed(() => historyIndex.value < history.value.length - 1)
const canGoUp = computed(() => {
    if (!currentPath.value) return false
    const segments = currentPath.value.split('\\').filter(segment => segment)
    return segments.length > 1
})

// 方法
const navigateToPath = async (path) => {
    let targetPath
    if (typeof path === 'number') {
        // 通过索引导航
        targetPath = pathSegments.value[path].path
    } else {
        // 直接路径导航
        targetPath = path
    }

    if (targetPath !== currentPath.value) {
        await loadDirectory(targetPath)
        addToHistory(targetPath)
    }
}

const loadDirectory = async (path) => {
    loading.value = true
    try {
        // 模拟文件系统访问
        // 在实际应用中，这里应该使用 Electron 的 fs 模块或类似的 API
        await new Promise(resolve => setTimeout(resolve, 300)) // 模拟加载延迟

        // 模拟文件数据
        items.value = generateMockFiles(path)
        currentPath.value = path
    } catch (error) {
        console.error('加载目录失败:', error)
        items.value = []
    } finally {
        loading.value = false
    }
}

const generateMockFiles = (path) => {
    const mockFiles = []

    // 添加一些文件夹
    const folders = ['文档', '图片', '音乐', '视频', '下载', '桌面']
    folders.forEach(folder => {
        mockFiles.push({
            name: folder,
            path: path + '\\' + folder,
            isDirectory: true,
            size: 0,
            extension: '',
            modified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })
    })

    // 添加一些文件
    const fileTypes = {
        'txt': '文本文档',
        'pdf': 'PDF文档',
        'docx': 'Word文档',
        'xlsx': 'Excel文档',
        'jpg': 'JPEG图像',
        'png': 'PNG图像',
        'mp3': '音频文件',
        'mp4': '视频文件',
        'zip': '压缩文件'
    }

    Object.keys(fileTypes).forEach(ext => {
        const fileName = `示例文件.${ext}`
        mockFiles.push({
            name: fileName,
            path: path + '\\' + fileName,
            isDirectory: false,
            size: Math.floor(Math.random() * 10000000), // 随机大小
            extension: ext,
            modified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })
    })

    return mockFiles
}

const addToHistory = (path) => {
    // 移除当前索引之后的历史记录
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(path)
    historyIndex.value = history.value.length - 1
}

const goBack = () => {
    if (canGoBack.value) {
        historyIndex.value--
        loadDirectory(history.value[historyIndex.value])
    }
}

const goForward = () => {
    if (canGoForward.value) {
        historyIndex.value++
        loadDirectory(history.value[historyIndex.value])
    }
}

const goUp = () => {
    if (canGoUp.value) {
        const segments = currentPath.value.split('\\').filter(segment => segment)
        segments.pop()
        const parentPath = segments.join('\\') || 'C:'
        navigateToPath(parentPath)
    }
}

const refresh = () => {
    loadDirectory(currentPath.value)
}

const selectItem = (item) => {
    selectedItem.value = item.path
}

const handleItemDoubleClick = (item) => {
    if (item.isDirectory) {
        navigateToPath(item.path)
    } else {
        // 在实际应用中，这里应该打开文件
        console.log('打开文件:', item.path)
    }
}

const sortBy = (field) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }
}

const getFileIcon = (extension) => {
    const iconMap = {
        'txt': '📄', 'pdf': '📕', 'docx': '📘', 'xlsx': '📗',
        'jpg': '🖼️', 'png': '🖼️', 'mp3': '🎵', 'mp4': '🎬', 'zip': '📦'
    }
    return iconMap[extension] || '📄'
}

const getFileType = (extension) => {
    const typeMap = {
        'txt': '文本文档', 'pdf': 'PDF文档', 'docx': 'Word文档', 'xlsx': 'Excel文档',
        'jpg': 'JPEG图像', 'png': 'PNG图像', 'mp3': '音频文件', 'mp4': '视频文件', 'zip': '压缩文件'
    }
    return typeMap[extension] || '文件'
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '-'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-CN') + ' ' +
        new Date(date).toLocaleTimeString('zh-CN', { hour12: false })
}

const getSelectedItemInfo = () => {
    const item = items.value.find(item => item.path === selectedItem.value)
    if (!item) return ''
    return `${item.name} - ${item.isDirectory ? '文件夹' : formatFileSize(item.size)}`
}

// 生命周期
onMounted(() => {
    // 初始加载用户主目录或C盘根目录
    navigateToPath('C:')
})
</script>

<style scoped>
.files-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--window-bg);
    color: var(--window-text);
    user-select: none;
}

/* 工具栏样式 */
.toolbar {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid var(--window-border);
    background: var(--window-header-bg);
}

.toolbar-left {
    display: flex;
    gap: 10px;
}

.toolbar-center {
    flex: 1;
    display: flex;
    justify-content: center;
}

.toolbar-right {
    display: flex;
    gap: 10px;
}

.toolbar-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    background: var(--window-controls-bg);
    border: 1px solid var(--window-border);
    border-radius: 4px;
    color: var(--window-text);
    cursor: pointer;
    transition: background-color 0.2s;
}

.toolbar-btn:hover:not(:disabled) {
    background: var(--window-controls-hover);
}

.toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.path-display {
    display: flex;
    align-items: center;
    background: var(--window-bg);
    border: 1px solid var(--window-border);
    border-radius: 4px;
    padding: 8px 12px;
    min-width: 300px;
}

.path-segment {
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
    transition: background-color 0.2s;
}

.path-segment:hover {
    background: var(--window-controls-hover);
}

.separator {
    margin: 0 5px;
    color: #666;
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    padding: 8px 30px 8px 12px;
    border: 1px solid var(--window-border);
    border-radius: 4px;
    background: var(--window-bg);
    color: var(--window-text);
    width: 200px;
}

.search-icon {
    position: absolute;
    right: 10px;
    color: #666;
}

/* 文件内容区域 */
.files-content {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
}

.files-header {
    display: grid;
    grid-template-columns: 1fr 100px 120px 150px;
    padding: 10px 20px;
    border-bottom: 1px solid var(--window-border);
    background: var(--window-header-bg);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-name,
.header-size,
.header-type,
.header-modified {
    cursor: pointer;
    padding: 5px;
    transition: background-color 0.2s;
    border-radius: 3px;
}

.header-name:hover,
.header-size:hover,
.header-type:hover,
.header-modified:hover {
    background: var(--window-controls-hover);
}

.sort-indicator {
    margin-left: 5px;
}

.files-list {
    flex: 1;
    overflow: auto;
}

.file-item {
    display: grid;
    grid-template-columns: 1fr 100px 120px 150px;
    align-items: center;
    padding: 8px 20px;
    border-bottom: 1px solid var(--window-border);
    cursor: pointer;
    transition: background-color 0.2s;
}

.file-item:hover {
    background: var(--window-controls-hover);
}

.file-item.selected {
    background: var(--window-controls-bg);
}

.file-icon {
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-name {
    font-weight: 500;
}

.file-size,
.file-type,
.file-modified {
    color: #666;
    font-size: 0.9em;
}

.folder-icon {
    font-size: 1.2em;
}

.file-type-icon {
    font-size: 1.1em;
}

/* 加载状态 */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #666;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--window-border);
    border-top: 4px solid var(--window-controls-bg);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #666;
}

.empty-icon {
    font-size: 3em;
    margin-bottom: 10px;
}

.empty-text {
    font-size: 1.1em;
}

/* 状态栏 */
.status-bar {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;
    border-top: 1px solid var(--window-border);
    background: var(--window-header-bg);
    font-size: 0.9em;
    color: #666;
}
</style>