import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', ({
    state: () => ({
        wordsCorrect: 0 as number,
        typed: 0 as number,
        corrections: 0 as number
    }),
    getters: {
        accuracy: (state) => {
            return (100 - (state.corrections/state.typed)*100).toFixed(1)
        }
    }
}))