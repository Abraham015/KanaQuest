import { CustomFlashcard } from "../types/flashcards";

function normalizeSearchText(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function filterFlashcardsBySearch(
    cards: CustomFlashcard[],
    searchTerm: string
) {
    const query = normalizeSearchText(searchTerm);

    if (!query) return cards;

    return cards.filter((card) => {
        const searchableText = normalizeSearchText(
            `${card.front} ${card.pronunciation} ${card.meaning}`
        );

        return searchableText.includes(query);
    });
}
