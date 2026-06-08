import { useMemo, useState } from "react";
import { katakanaGroups } from "../data/katakana";
import KanaCard from "../components/kana/KanaCard";
import KanaMultipleChoice from "../components/kana/KanaMultipleChoice";

type Mode = "table" | "quiz";
type KanaGroup = "basic" | "dakuten" | "handakuten" | "youon" | "all";
type PracticeGroup = Exclude<KanaGroup, "all">;

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
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizGroups, setQuizGroups] = useState<PracticeGroup[]>(["basic"]);

    function handleModeChange(nextMode: Mode) {
        setMode(nextMode);

        if (nextMode === "quiz") {
            setQuizStarted(false);
        }
    }

    function toggleQuizGroup(groupId: PracticeGroup) {
        setQuizGroups((currentGroups) => {
            if (currentGroups.includes(groupId)) {
                return currentGroups.filter((id) => id !== groupId);
            }

            return [...currentGroups, groupId];
        });
    }

    const selectedCards = useMemo(() => {
        return katakanaGroups[group];
    }, [group]);

    const selectedQuizCards = useMemo(() => {
        return quizGroups.flatMap((groupId) => katakanaGroups[groupId]);
    }, [quizGroups]);
    const maxQuizQuestions = selectedQuizCards.length;
    const selectedQuizTotalQuestions = Math.min(totalQuestions, maxQuizQuestions);

    return (
        <main className="page-container">
            <h1>Katakana</h1>

            {mode === "table" && (
                <div className="tabs">
                    {groupLabels.map((item) => (
                        <button
                            key={item.id}
                            className={group === item.id ? "is-active" : ""}
                            onClick={() => setGroup(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}

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
                    {!quizStarted ? (
                        <div className="quiz-settings">
                            <label>
                                Numero de preguntas:
                                <input
                                    type="number"
                                    min={1}
                                    max={maxQuizQuestions || 1}
                                    value={selectedQuizTotalQuestions || 1}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setTotalQuestions(Math.max(1, Math.min(value, maxQuizQuestions || 1)));
                                    }}
                                />
                            </label>

                            <fieldset className="section-picker">
                                <legend>Secciones</legend>

                                {groupLabels
                                    .filter((item): item is { id: PracticeGroup; label: string } => item.id !== "all")
                                    .map((item) => (
                                        <label key={item.id}>
                                            <input
                                                type="checkbox"
                                                checked={quizGroups.includes(item.id)}
                                                onChange={() => toggleQuizGroup(item.id)}
                                            />
                                            {item.label}
                                        </label>
                                    ))}
                            </fieldset>

                            <p>Disponibles en la seleccion: {maxQuizQuestions}</p>

                            <button
                                disabled={!maxQuizQuestions}
                                onClick={() => setQuizStarted(true)}
                            >
                                Iniciar quiz
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="quiz-lockbar">
                                <span>{selectedQuizTotalQuestions} preguntas</span>
                                <span>{quizGroups.length} secciones</span>
                                <button onClick={() => setQuizStarted(false)}>
                                    Cambiar configuracion
                                </button>
                            </div>

                            <KanaMultipleChoice
                                cards={selectedQuizCards}
                                totalQuestions={selectedQuizTotalQuestions}
                            />
                        </>
                    )}
                </>
            )}
        </main>
    );
}
