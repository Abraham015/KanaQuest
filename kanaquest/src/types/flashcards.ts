export type FlashcardType = "kanji" | "sentence" | "vocabulary";

export type FlashcardFolder = {
    id: string;
    type: FlashcardType;
    name: string;
    createdAt: string;
};

export type CustomFlashcard = {
    id: string;
    type: FlashcardType;
    folderId: string;
    front: string;
    pronunciation: string;
    meaning: string;
    createdAt: string;
};
