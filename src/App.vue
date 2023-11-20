<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';
import axios from 'axios';
import Board from './components/Board.vue';
import Stat from './components/partials/Stat.vue';
import { useAppStore } from './store/app'

const sentence = ref<string>('');
const loading = ref<boolean>(true);
const interval = ref<any>(null);
const time = ref<number>(0);
const appStore = useAppStore();

const getSentence = async () => {
    loading.value = true;

    try {
        const res = await axios.get('http://metaphorpsum.com/paragraphs/1/4');

        sentence.value = res.data;
    } catch (error) {
        sentence.value = 'Sorry, something went wrong. Try again later';
    }

    loading.value = false;
}

getSentence();

const wpm = computed<string | null>(() => {
    const wpmNumber = (appStore.wordsCorrect / (time.value / 100 / 60))

    if (!isNaN(wpmNumber))
        return wpmNumber.toFixed(1)
    else
        return null
})

const ended = computed<boolean>(() => time.value === 3000);

const count = () => {
    time.value+=10;

    if (time.value === 3000){
        clearInterval(interval.value)
    }
}

const start = () => {
    if (time.value === 0)
        interval.value = setInterval(count, 100)
}

onUnmounted(() => {
    clearInterval(interval.value)
})

</script>
<template>
    <template v-if="ended">
        <h1>THE END.</h1>
        <p>Your score is {{ wpm }} WPM with {{ appStore.accuracy }}% of accuracy</p>
        <Stat />
    </template>
    <template v-else>
        <Board v-if="sentence.length && !loading" :sentence="sentence" @start="start" />
        <div v-else class="loading">
            <img src="./assets/vue.svg" />
            <p>Loading sentence...</p>
        </div>
    </template>
</template>

<style lang="scss" scoped>
@keyframes appear {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
.loading{
    opacity: 0;
    animation: appear .5s 1s forwards;
}
</style>