import { defineStore } from 'pinia'
import { StatItemModel } from '../types'

export const useAppStore = defineStore('appStore', ({
    state: () => ({
        wordsCorrect: 0 as number,
        typed: [] as StatItemModel[]
    }),
    getters: {
        accuracy: (state) => {
            const correct = state.typed.filter(input => input.correct).length;
            const errors = state.typed.filter(input => !input.correct).length;

            return (100 - (errors/correct) * 100).toFixed(1);
        }
    }
}))