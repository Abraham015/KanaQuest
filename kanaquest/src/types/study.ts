export type KanaType = "hiragana" | "katakana";

export type KanaCategory =
    | "basic"
    | "dakuten"
    | "handakuten"
    | "youon";

export type KanaCard = {
    id: string;
    type: KanaType;
    category: KanaCategory;
    character: string;
    romaji: string;
    group: string;
};