<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { WordModel } from '../types';
import Text from './partials/Text.vue';
import { useAppStore } from '../store/app';

interface Props {
    sentence: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['start', 'word']);
const appStore = useAppStore();

const providedLetter = (wordIndex: number, letterIndex: number) => {
    if (providedWords.value[wordIndex] && providedWords.value[wordIndex][letterIndex])
        return providedWords.value[wordIndex][letterIndex];
    else
        return null
}

const words = computed<WordModel[]>(() => props.sentence.split(' ').map((word, wordIndex) => ({
    value: word,
    index: wordIndex,
    isActive: wordIndex === providedWords.value.length-1,
    letters: word.split('').map((letter, letterIndex) => ({
        original: letter,
        provided: providedLetter(wordIndex, letterIndex),
        index: letterIndex
    }))
})));

const providedInput = ref<string>('');
const providedWords = computed<string[][]>(() => providedInput.value.split(' ').map(word => word.split('')));

const sentence = ref();
const cursor = ref();
const textarea = ref();

const setCursor = () => {
    const word = sentence.value.querySelector(`#word${providedWords.value.length-1}`);
    const letter = word?.querySelector(`#letter${providedWords.value[providedWords.value.length-1].length-1}`) ||
        word?.querySelector(`#letter0`) || null as HTMLDivElement | null;

    if (!letter)
        return;

    const { left, top, width } = letter.getBoundingClientRect();

    cursor.value.style.top = `${window.scrollY + top}px`;
    cursor.value.style.left = `${left}px`;

    if (letter.classList.contains('empty')) {
        cursor.value.classList.add('active');
        cursor.value.style.marginLeft = '0px';
    } else {
        cursor.value.style.marginLeft = `${width}px`;
    }

    appStore.wordsCorrect = words.value.filter(word => word.letters.every(({ provided, original }) => provided === original)).length

    letter.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    });
}

onMounted(() => {
    window.addEventListener('resize', setCursor);
    setCursor();
    textarea.value.focus();
})

onUnmounted(() => {
    window.removeEventListener('resize', setCursor);
})

const handleStart = () => {
    if (providedInput.value.length === 0)
        emit('start')
}

const handleAccuracy = (e: any) => {
    const time = new Date().getTime();

    appStore.typed.push({
        time,
        correct: e.inputType !== 'deleteContentBackward'
    })
}

</script>
<template>
    <h2 ref="sentence">
        <Text :words="words" :provided-words="providedWords" />
    </h2>
    <div class="cursor" ref="cursor"></div>
    <textarea ref="textarea" v-model="providedInput" type="text" @input="e => {
        setCursor();
        handleAccuracy(e);
    }" @keypress="handleStart" autocorrect="false" autocomplete="false" />
</template>

<style lang="scss" scoped>
textarea{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    opacity: 0;
}

h2{
    display: flex;
    flex-wrap: wrap;
    gap: var(--words-space);
    position: relative;
}

@keyframes blink {
    0%{ opacity: 1; }
    50%{ opacity: 0; }
    100%{ opacity: 1; }
}

@keyframes appear {
    from { opacity: 0; }
    to { opacity: 1; }
}
.cursor{
    width: 2px;
    height: 25px;
    position: absolute;
    z-index: 2;
    background: yellow;
    left: 0;
    top: 0;
    opacity: 0;
    margin-top: 3px;
    &.active{
        animation: blink 1s .1s infinite;
    }
    transition: all .1s ease-in-out;

    &.space{
        transform: translateX(var(--words-space));
    }
}
</style>