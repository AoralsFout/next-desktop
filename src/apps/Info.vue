<template>
    <div class="info-container">
        <div class="info-title">Next-Desktop</div>
        <div class="info-content">
            <!-- <div class="info-icon">🖥️</div> -->
            <div class="info-text">
                <div>版本：dev V0.0.1</div>
            </div>
        </div>
    </div>
</template>

<style>
.info-container {
    padding: 20px;
    color: var(--window-text);
}

.info-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.info-content {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
}

.info-text {
    font-size: 16px;
}
</style>