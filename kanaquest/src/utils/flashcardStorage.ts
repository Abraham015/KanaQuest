import { CustomFlashcard, FlashcardFolder } from "../types/flashcards";

const FOLDERS_KEY = "kanaquest-folders";
const FLASHCARDS_KEY = "kanaquest-flashcards";

export function getFolders(): FlashcardFolder[] {
    return JSON.parse(localStorage.getItem(FOLDERS_KEY) || "[]");
}

export function saveFolders(folders: FlashcardFolder[]) {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function getFlashcards(): CustomFlashcard[] {
    return JSON.parse(localStorage.getItem(FLASHCARDS_KEY) || "[]");
}

export function saveFlashcards(cards: CustomFlashcard[]) {
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
}