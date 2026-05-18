import { hiraganaGroups } from "../data/hiragana";
import { katakanaGroups } from "../data/katakana";
import { SearchResult } from "../components/common/GlobalSearch";
import { CustomFlashcard } from "../types/flashcards";
import { Section } from "../types/navigation";

function normalizeSearchText(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function matchesSearch(values: string[], query: string) {
    return values.some((value) => normalizeSearchText(value).includes(query));
}

function getFlashcardSection(type: CustomFlashcard["type"]): Section {
    if (type === "kanji") return "kanji";
    if (type === "sentence") return "sentences";
    return "vocabulary";
}

function getFlashcardMeta(type: CustomFlashcard["type"]) {
    if (type === "kanji") return "Kanji";
    if (type === "sentence") return "Oraciones";
    return "Vocabulario";
}

export function getGlobalSearchResults(
    searchTerm: string,
    flashcards: CustomFlashcard[]
): SearchResult[] {
    const query = normalizeSearchText(searchTerm);

    if (!query) return [];

    const hiraganaResults = hiraganaGroups.all
        .filter((kana) =>
            matchesSearch([kana.character, kana.romaji, kana.group], query)
        )
        .map<SearchResult>((kana) => ({
            id: `hiragana-${kana.id}`,
            section: "hiragana",
            title: kana.character,
            subtitle: kana.romaji,
            meta: `Hiragana - ${kana.group}`,
        }));

    const katakanaResults = katakanaGroups.all
        .filter((kana) =>
            matchesSearch([kana.character, kana.romaji, kana.group], query)
        )
        .map<SearchResult>((kana) => ({
            id: `katakana-${kana.id}`,
            section: "katakana",
            title: kana.character,
            subtitle: kana.romaji,
            meta: `Katakana - ${kana.group}`,
        }));

    const flashcardResults = flashcards
        .filter((card) =>
            matchesSearch([card.front, card.pronunciation, card.meaning], query)
        )
        .map<SearchResult>((card) => ({
            id: `flashcard-${card.id}`,
            section: getFlashcardSection(card.type),
            title: card.front,
            subtitle: `${card.pronunciation} - ${card.meaning}`,
            meta: getFlashcardMeta(card.type),
        }));

    return [...hiraganaResults, ...katakanaResults, ...flashcardResults].slice(0, 12);
}
