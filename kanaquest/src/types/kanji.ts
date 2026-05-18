export type Folder = {
    id: string;
    name: string;
    createdAt: string;
};

export type KanjiFlashcard = {
    id: string;
    type: "kanji";
    folderId: string;
    kanji: string;
    pronunciation: string;
    meaning: string;
    createdAt: string;
};

export type SentenceFlashcard = {
    id: string;
    type: "sentence";
    folderId: string;
    sentence: string;
    pronunciation: string;
    meaning: string;
    createdAt: string;
};

export type CustomFlashcard = KanjiFlashcard | SentenceFlashcard;