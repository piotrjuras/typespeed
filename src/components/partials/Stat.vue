<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAppStore } from '../../store/app';
import { Chart, LineController, CategoryScale, LinearScale, TimeScale, LineElement, PointElement } from 'chart.js';

type AccModel = Record<number, { correct: number, error: number }>

Chart.register(LineController, CategoryScale, LinearScale, TimeScale, LineElement, PointElement);

const appStore = useAppStore();
const container = ref()

const initChart = () => {
    const ctx = container.value.getContext('2d');

    const serializedData = appStore.typed.reduce((acc: AccModel, obj) => {
        const { time, correct } = obj;

        const timeSeconds = new Date(time).getSeconds()

        acc[timeSeconds] = acc[timeSeconds] || { correct: 0, error: 0 };

        if (correct) {
            acc[timeSeconds].correct++
        } else {
            acc[timeSeconds].error++
        }

        return acc;
    }, {});

    const timeLabels = Object.keys(serializedData).map((_, index) => index);
    const entries = Object.entries(serializedData);

    const correctEvents = entries.map(objItem => objItem[1].correct);
    const errorEvents = entries.map(objItem => objItem[1].error);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Number of good types',
                    data: correctEvents,
                    backgroundColor: 'white',
                    borderColor: 'white'
                },
                {
                    label: 'Number of errors',
                    data: errorEvents,
                    backgroundColor: 'red',
                    borderColor: 'red'
                }
            ]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        callback: (value) => {
                            return `${value}s`;
                        }
                    }
                }
            }
        }
    });
}

onMounted(() => {
    const first = appStore.typed[0];
    const last = appStore.typed[appStore.typed.length-1];

    const diff = ((last.time - first.time) / 1000).toFixed(0);

    console.log(diff)

    initChart()
})
</script>
<template>
    <canvas ref="container" class="chart" style="width: 90vw" />
</template>
<style lang="scss" scoped>
</style>