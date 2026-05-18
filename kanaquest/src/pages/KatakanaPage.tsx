import { useMemo, useState } from "react";
import { katakanaGroups } from "../data/katakana";
import KanaCard from "../components/kana/KanaCard";
import KanaMultipleChoice from "../components/kana/KanaMultipleChoice";

type Mode = "table" | "quiz";
type KanaGroup = "basic" | "dakuten" | "handakuten" | "youon" | "all";

const groupLabels: Array<{ id: KanaGroup; label: string }> = [
    { id: "basic", label: "Basicos" },
    { id: "dakuten", label: "Impuros" },
    { id: "handakuten", label: "Semi-impuros" },
    { id: "youon", label: "Compuestos" },
    { id: "all", label: "Todos" },
];

export default function KatakanaPage() {
    const [mode, setMode] = useState<Mode>("table");
    const [group, setGroup] = useState<KanaGroup>("basic");
    const [totalQuestions, setTotalQuestions] = useState(10);

    function handleModeChange(nextMode: Mode) {
        setMode(nextMode);

        if (nextMode === "quiz" && group === "all") {
            setGroup("basic");
        }
    }

    const visibleGroupButtons = useMemo(() => {
        if (mode === "quiz") {
            return groupLabels.filter((item) => item.id !== "all");
        }

        return groupLabels;
    }, [mode]);

    const selectedCards = useMemo(() => {
        return katakanaGroups[group];
    }, [group]);

    const maxQuestions = selectedCards.length;
    const selectedTotalQuestions = Math.min(totalQuestions, maxQuestions);

    return (
        <main className="page-container">
            <h1>Katakana</h1>

            <div className="tabs">
                {visibleGroupButtons.map((item) => (
                    <button
                        key={item.id}
                        className={group === item.id ? "is-active" : ""}
                        onClick={() => setGroup(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="tabs">
                <button
                    className={mode === "table" ? "is-active" : ""}
                    onClick={() => handleModeChange("table")}
                >
                    Tabla
                </button>
                <button
                    className={mode === "quiz" ? "is-active" : ""}
                    onClick={() => handleModeChange("quiz")}
                >
                    Quiz
                </button>
            </div>

            {mode === "table" && (
                <div className="kana-grid">
                    {selectedCards.map((kana) => (
                        <KanaCard key={kana.id} kana={kana} />
                    ))}
                </div>
            )}

            {mode === "quiz" && (
                <>
                    <div className="quiz-settings">
                        <label>
                            Numero de preguntas:
                            <input
                                type="number"
                                min={1}
                                max={maxQuestions}
                                value={selectedTotalQuestions}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setTotalQuestions(Math.max(1, Math.min(value, maxQuestions)));
                                }}
                            />
                        </label>

                        <p>Disponibles en esta seccion: {maxQuestions}</p>
                    </div>

                    <KanaMultipleChoice
                        cards={selectedCards}
                        totalQuestions={selectedTotalQuestions}
                    />
                </>
            )}
        </main>
    );
}
