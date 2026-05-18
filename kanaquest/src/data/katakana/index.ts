import { katakanaBasic } from "./basic";
import { katakanaDakuten } from "./dakuten";
import { katakanaHandakuten } from "./handakuten";
import { katakanaYouon } from "./youon";

export const katakanaGroups = {
    basic: katakanaBasic,
    dakuten: katakanaDakuten,
    handakuten: katakanaHandakuten,
    youon: katakanaYouon,
    all: [
        ...katakanaBasic,
        ...katakanaDakuten,
        ...katakanaHandakuten,
        ...katakanaYouon,
    ],
};