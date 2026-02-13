<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-5">
    <div class="flex items-center justify-between mb-3">
      <div>
        <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</p>
      </div>
      <span v-if="loading" class="text-xs text-gray-400">Loading...</span>
    </div>

    <div class="relative h-64">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  BarController,
  LineController,
  DoughnutController,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  BarController,       // ✅ ADDED
  LineController,      // ✅ ADDED
  DoughnutController,
  Tooltip,
  Legend
)


const emit = defineEmits(['select'])
const props = defineProps<{
  title: string
  subtitle?: string
  type: 'bar' | 'line' | 'doughnut'
  labels: string[]
  values: number[]
  datasetLabel?: string
  loading?: boolean
  valuePrefix?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null


const buildChart = () => {
  if (!process.client || !canvasRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  chartInstance = new Chart(canvasRef.value, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.datasetLabel || 'Dataset',
          data: props.values,
          backgroundColor: props.type === 'doughnut'
            ? ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']
            : 'rgba(99, 102, 241, 0.4)',
          borderColor: props.type === 'doughnut' ? '#ffffff' : '#6366F1',
          borderWidth: props.type === 'doughnut' ? 1 : 2,
          fill: props.type === 'line'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: props.type === 'doughnut'
        }
      },
      onClick: (e, elements) => {
        if (elements && elements.length > 0) {
          const idx = elements[0].index
          emit('select', {
            label: props.labels[idx],
            value: props.values[idx],
            index: idx,
            type: props.type,
            datasetLabel: props.datasetLabel || 'Dataset',
            title: props.title,
            subtitle: props.subtitle
          })
        }
      },
      scales: props.type === 'doughnut'
        ? undefined
        : {
            x: {
              ticks: {
                maxRotation: 0,
                minRotation: 0,
                callback: function(val, index) {
                  const label = this.getLabelForValue(val as number);
                  if (typeof label === 'string' && label.length > 20) {
                    return label.substring(0, 17) + '...';
                  }
                  return label;
                }
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `${props.valuePrefix || ''}${Number(value).toLocaleString('en-NG')}`
              }
            }
          },
      plugins: {
        legend: {
          display: props.type === 'doughnut'
        },
        tooltip: {
          callbacks: {
            title: (items) => {
              if (items.length > 0) {
                return props.labels[items[0].dataIndex]
              }
              return ''
            }
          }
        }
      }
    }
  })
}

onMounted(buildChart)

watch(
  () => [props.labels, props.values, props.type],
  () => buildChart(),
  { deep: true }
)

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>