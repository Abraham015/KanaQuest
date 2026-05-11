import { useMemo, useState } from "react";
import { hiraganaBasic } from "../data/hiragana/basic";
import { hiraganaDakuten } from "../data/hiragana/dakuten";
import { hiraganaHandakuten } from "../data/hiragana/handakuten";
import { hiraganaYouon } from "../data/hiragana/youon";
import KanaCard from "../components/kana/KanaCard";
import KanaMultipleChoice from "../components/kana/KanaMultipleChoice";

type Mode = "table" | "quiz";
type HiraganaGroup = "basic" | "dakuten" | "handakuten" | "youon" | "all";

export default function HiraganaPage() {
    const [mode, setMode] = useState<Mode>("table");
    const [group, setGroup] = useState<HiraganaGroup>("basic");

    const selectedCards = useMemo(() => {
        if (group === "basic") return hiraganaBasic;
        if (group === "dakuten") return hiraganaDakuten;
        if (group === "handakuten") return hiraganaHandakuten;
        if (group === "youon") return hiraganaYouon;

        return [
            ...hiraganaBasic,
            ...hiraganaDakuten,
            ...hiraganaHandakuten,
            ...hiraganaYouon,
        ];
    }, [group]);

    return (
        <main className="page-container">
            <h1>Hiragana</h1>

            <div className="tabs">
                <button onClick={() => setGroup("basic")}>Básicos</button>
                <button onClick={() => setGroup("dakuten")}>Impuros</button>
                <button onClick={() => setGroup("handakuten")}>Semi-impuros</button>
                <button onClick={() => setGroup("youon")}>Compuestos</button>
                <button onClick={() => setGroup("all")}>Todos</button>
            </div>

            <div className="tabs">
                <button onClick={() => setMode("table")}>Tabla</button>
                <button onClick={() => setMode("quiz")}>Quiz</button>
            </div>

            {mode === "table" && (
                <div className="kana-grid">
                    {selectedCards.map((kana) => (
                        <KanaCard key={kana.id} kana={kana} />
                    ))}
                </div>
            )}

            {mode === "quiz" && (
                <KanaMultipleChoice cards={selectedCards} totalQuestions={10} />
            )}
        </main>
    );
}