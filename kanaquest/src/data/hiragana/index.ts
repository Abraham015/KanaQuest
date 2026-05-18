import { hiraganaBasic } from "./basic";
import { hiraganaDakuten } from "./dakuten";
import { hiraganaHandakuten } from "./handakuten";
import { hiraganaYouon } from "./youon";

export const hiraganaGroups = {
    basic: hiraganaBasic,
    dakuten: hiraganaDakuten,
    handakuten: hiraganaHandakuten,
    youon: hiraganaYouon,
    all: [
        ...hiraganaBasic,
        ...hiraganaDakuten,
        ...hiraganaHandakuten,
        ...hiraganaYouon,
    ],
};