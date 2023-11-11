<script setup lang="ts">
import { WordModel } from '../../types';
import { isWordWrong } from '../../helpers/';

interface Props {
    providedWords: string[][];
    words: WordModel[];
}

const props = defineProps<Props>();

const additionalLetters = (index: number): string[] => {
    const wordsLength = props.words[index]?.letters.length;
    const providedeWordsLength = props.providedWords[index]?.length;
    if (wordsLength < providedeWordsLength){
        const wrong = [...props.providedWords[index]].splice(wordsLength, providedeWordsLength);

        return wrong;
    } else {
        return [];
    }
}

</script>

<template>
    <div
        v-for="{ letters, isActive, index, value } in words"
        :key="index"
        :class="['word', { error: isWordWrong({ letters, isActive, index, value }) || additionalLetters(index)?.length }]"
        :id="`word${String(index)}`"
    >
        <span
            v-for="{ original, provided, index: letterIndex } in letters"
            :key="letterIndex"
            :class="[
                'letter',
                { correct: original === provided },
                { empty: provided === null },
            ]"
            :id="`letter${String(letterIndex)}`"
        >
            {{ original }}
        </span>
        <span
            v-for="(letter, letterIndex) in additionalLetters(index)"
            :id="`letter${String(letters.length + letterIndex)}`"
            class="letter"
        >
            {{ letter }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
.word{
    position: relative;
    &.error::after{
        content: '';
        bottom: 4px;
        width: 100%;
        background: red;
        height: 2px;
        position: absolute;
        left: 0;
        animation: appear .2s forwards;
    }

    .letter{
        position: relative;
        &:not(.empty):not(.correct){
            color: red;
            transition: color .1s ease-in-out;
        }
        &.empty{
            opacity: .5;
        }
    }
}
</style>