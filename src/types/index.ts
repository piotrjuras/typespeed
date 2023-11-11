export interface WordModel {
    index: number;
    value: string;
    letters: LetterModel[];
    isActive: boolean
}

export interface LetterModel {
    original: string;
    provided: string | null;
    index: number
}