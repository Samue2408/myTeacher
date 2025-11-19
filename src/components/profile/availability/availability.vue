<template>
    <div>
        <h3>Actividades recientes</h3>
        <ul class="activity-timeline">
            <li v-for="(a, i) in activities" :key="i" class="activity-item">
            <!-- <div class="activity-icon"></div> -->
            <div class="activity-content">
                <div class="activity-header">
                <h4>{{ a.title }}</h4>
                <span class="activity-date">{{ a.date }}</span>
                </div>
                <p>{{ a.description }}</p>
            </div>
            </li>
        </ul>
    </div>
</template>

<script setup>

</script>

<style scoped>
</style>