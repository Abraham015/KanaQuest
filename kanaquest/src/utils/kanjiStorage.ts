import { CustomFlashcard, Folder } from "../types/kanji";

const FOLDERS_KEY = "kanaquest-folders";
const FLASHCARDS_KEY = "kanaquest-flashcards";

export function getFolders(): Folder[] {
    return JSON.parse(localStorage.getItem(FOLDERS_KEY) || "[]");
}

export function saveFolders(folders: Folder[]) {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function getFlashcards(): CustomFlashcard[] {
    return JSON.parse(localStorage.getItem(FLASHCARDS_KEY) || "[]");
}

export function saveFlashcards(cards: CustomFlashcard[]) {
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
}