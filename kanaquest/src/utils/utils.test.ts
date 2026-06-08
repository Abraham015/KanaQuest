import { filterFlashcardsBySearch } from "./filterFlashcards";
import { getGlobalSearchResults } from "./globalSearch";
import { CustomFlashcard } from "../types/flashcards";

const cards: CustomFlashcard[] = [
    {
        id: "kanji",
        type: "kanji",
        folderId: "f1",
        front: "水",
        pronunciation: "mizu",
        meaning: "Agua",
        createdAt: "2026-01-01",
    },
    {
        id: "sentence",
        type: "sentence",
        folderId: "f1",
        front: "猫です",
        pronunciation: "neko desu",
        meaning: "Es un gato",
        createdAt: "2026-01-01",
    },
    {
        id: "vocabulary",
        type: "vocabulary",
        folderId: "f1",
        front: "学校",
        pronunciation: "gakkou",
        meaning: "Escuela",
        createdAt: "2026-01-01",
    },
];

describe("filterFlashcardsBySearch", () => {
    test("returns every card for an empty query", () => {
        expect(filterFlashcardsBySearch(cards, "   ")).toBe(cards);
    });

    test("matches normalized text across every searchable field", () => {
        expect(filterFlashcardsBySearch(cards, "AGUA")).toEqual([cards[0]]);
        expect(filterFlashcardsBySearch(cards, "gato")).toEqual([cards[1]]);
        expect(filterFlashcardsBySearch(cards, "gakkou")).toEqual([cards[2]]);
        expect(filterFlashcardsBySearch(cards, "águA")).toEqual([cards[0]]);
    });
});

describe("getGlobalSearchResults", () => {
    test("returns no results for an empty query", () => {
        expect(getGlobalSearchResults(" ", cards)).toEqual([]);
    });

    test("finds hiragana and katakana by character and romaji", () => {
        expect(getGlobalSearchResults("あ", [])).toEqual(
            expect.arrayContaining([expect.objectContaining({ section: "hiragana", title: "あ" })])
        );
        expect(getGlobalSearchResults("ア", [])).toEqual(
            expect.arrayContaining([expect.objectContaining({ section: "katakana", title: "ア" })])
        );
        expect(getGlobalSearchResults("a", []).length).toBe(12);
    });

    test("maps every flashcard type to its section and label", () => {
        expect(getGlobalSearchResults("agua", cards)).toEqual([
            expect.objectContaining({ section: "kanji", meta: "Kanji" }),
        ]);
        expect(getGlobalSearchResults("gato", cards)).toEqual([
            expect.objectContaining({ section: "sentences", meta: "Oraciones" }),
        ]);
        expect(getGlobalSearchResults("escuela", cards)).toEqual([
            expect.objectContaining({ section: "vocabulary", meta: "Vocabulario" }),
        ]);
    });
});
