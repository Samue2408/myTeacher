<template>
  <div class="chart-container">
    <h4 class="chart-title">Reservas por día del mes actual</h4>
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { PropType } from "vue";

// Registrar los componentes necesarios de Chart.js
Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DayData {
  day: number;
  count: number;
}

const props = defineProps({
  data: {
    type: Array as PropType<DayData[]>,
    default: () => [],
  },
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const handleChartResize = () => {
  if (chartInstance) {
    try {
      chartInstance.resize();
    } catch (e) {
      // ignore
    }
  }
};

const initChart = () => {
  if (!chartRef.value) return;

  // Destruir la gráfica anterior si existe
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartRef.value.getContext("2d");
  if (!ctx) return;

  // Preparar los datos
  const labels = props.data.map((d) => `${d.day}`);
  const counts = props.data.map((d) => d.count);
  const maxCount = Math.max(...counts);

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Clases Reservadas",
          data: counts,
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#764ba2",
          pointHoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
      },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
          labels: {
            color: "#666",
            font: {
              size: 12,
              weight: "bold" as const,
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 13,
            weight: "bold" as const,
          },
          bodyFont: {
            size: 12,
          },
          borderColor: "#667eea",
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              return `  ${context.parsed.y} clase${context.parsed.y > 1 ? "s" : ""}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: maxCount + 1,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            color: "#999",
            font: {
              size: 11,
            },
            stepSize: 1,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#999",
            font: {
              size: 11,
            },
          },
        },
      },
    },
  });
  // Force a resize to make sure chart fits the container
  try {
    chartInstance.resize();
  } catch (e) {
    /* ignore */
  }
};

onMounted(() => {
  initChart();
  // resize handler to keep chart fitting its container
  window.addEventListener("resize", handleChartResize);
});

watch(
  () => props.data,
  () => {
    initChart();
  },
  { deep: true }
);

// cleanup listener
onUnmounted(() => {
  window.removeEventListener("resize", handleChartResize);
});
</script>

<style scoped>
.chart-container {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 450px;
  overflow: hidden;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin: 0 0 12px 0;
  flex-shrink: 0;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
