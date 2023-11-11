import { WordModel } from "../types";

export const isWordWrong = ({ letters, isActive }: WordModel): boolean => {
    const isWordEmpty: boolean = letters.every(({ provided }) => provided === null);
    const isWordCorrect: boolean = letters.filter(({ provided, original }) => provided === original).length === letters.length;

    if (isWordEmpty || isWordCorrect)
        return false;
    else if (isActive)
        return false;
    else
        return true;
}