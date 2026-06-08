import { useMemo, useState } from "react";
import { CustomFlashcard } from "../../types/flashcards";

type Props = {
    cards: CustomFlashcard[];
};

type PracticeMode = "flashcard" | "written" | "multiple-choice";
type WrittenDirection = "jp-to-es" | "es-to-jp";
type ChoiceField = "pronunciation" | "meaning";

const fallbackOptions: Record<ChoiceField, string[]> = {
    pronunciation: ["mizu", "sora", "yama", "hana", "kaze", "tsuki", "hikari", "kokoro"],
    meaning: ["agua", "cielo", "montaña", "flor", "viento", "luna", "luz", "corazón"],
};

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

function normalizeAnswer(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getChoiceOptions(
    currentCard: CustomFlashcard,
    cards: CustomFlashcard[],
    field: ChoiceField
) {
    const answer = currentCard[field];
    const candidates = [
        ...shuffleArray(cards.filter((card) => card.id !== currentCard.id)).map((card) => card[field]),
        ...shuffleArray(fallbackOptions[field]),
    ];
    const uniqueOptions = candidates.filter(
        (option, index) =>
            normalizeAnswer(option) !== normalizeAnswer(answer) &&
            candidates.findIndex((candidate) => normalizeAnswer(candidate) === normalizeAnswer(option)) === index
    );

    return shuffleArray([answer, ...uniqueOptions.slice(0, 3)]);
}

export default function FlashcardPractice({ cards }: Props) {
    const [totalCards, setTotalCards] = useState(1);
    const [practiceMode, setPracticeMode] = useState<PracticeMode>("flashcard");
    const [writtenDirection, setWrittenDirection] = useState<WrittenDirection>("es-to-jp");
    const [started, setStarted] = useState(false);
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [writtenAnswer, setWrittenAnswer] = useState("");
    const [isWrittenAnswerChecked, setIsWrittenAnswerChecked] = useState(false);
    const [writtenScore, setWrittenScore] = useState({ correct: 0, incorrect: 0 });
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [choiceScore, setChoiceScore] = useState({ correct: 0, incorrect: 0 });

    const maxCards = cards.length;

    const practiceCards = useMemo(() => {
        if (!started) return [];
        return shuffleArray(cards).slice(0, totalCards);
    }, [cards, totalCards, started]);

    const currentCard = practiceCards[index];
    const expectedAnswer = writtenDirection === "es-to-jp"
        ? currentCard?.front || ""
        : currentCard?.meaning || "";
    const promptText = writtenDirection === "es-to-jp"
        ? currentCard?.meaning || ""
        : currentCard?.front || "";
    const isWrittenCorrect =
        normalizeAnswer(writtenAnswer) === normalizeAnswer(expectedAnswer);
    const choiceField: ChoiceField = index % 2 === 0 ? "meaning" : "pronunciation";
    const choiceAnswer = currentCard?.[choiceField] || "";
    const choiceOptions = useMemo(() => {
        if (!currentCard || practiceMode !== "multiple-choice") return [];
        return getChoiceOptions(currentCard, cards, choiceField);
    }, [cards, choiceField, currentCard, practiceMode]);

    function resetPractice() {
        setStarted(false);
        setIndex(0);
        setShowAnswer(false);
        setWrittenAnswer("");
        setIsWrittenAnswerChecked(false);
        setWrittenScore({ correct: 0, incorrect: 0 });
        setSelectedChoice(null);
        setChoiceScore({ correct: 0, incorrect: 0 });
    }

    function startPractice() {
        resetPractice();
        setStarted(true);
    }

    if (!cards.length) {
        return <p>No hay flashcards disponibles para practicar.</p>;
    }

    if (!started) {
        return (
            <section className="practice-settings">
                <h2>Practicar flashcards</h2>

                <label>
                    Número de tarjetas:
                    <input
                        type="number"
                        min={1}
                        max={maxCards}
                        value={totalCards}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setTotalCards(Math.max(1, Math.min(value, maxCards)));
                        }}
                    />
                </label>

                <label>
                    Modo:
                    <select
                        value={practiceMode}
                        onChange={(e) => setPracticeMode(e.target.value as PracticeMode)}
                    >
                        <option value="flashcard">Flashcard</option>
                        <option value="written">Respuesta escrita</option>
                        <option value="multiple-choice">Opción múltiple</option>
                    </select>
                </label>

                {practiceMode === "written" && (
                    <label>
                        Direccion:
                        <select
                            value={writtenDirection}
                            onChange={(e) => setWrittenDirection(e.target.value as WrittenDirection)}
                        >
                            <option value="es-to-jp">Español a japonés</option>
                            <option value="jp-to-es">Japonés a español</option>
                        </select>
                    </label>
                )}

                <p>Disponibles: {maxCards}</p>

                <button
                    onClick={startPractice}
                >
                    Iniciar práctica
                </button>
            </section>
        );
    }

    if (!currentCard) {
        return (
            <section className="quiz-result">
                <h2>Practica terminada</h2>

                {practiceMode === "written" && (
                    <div className="result-summary">
                        <p>Aciertos: {writtenScore.correct}</p>
                        <p>Errores: {writtenScore.incorrect}</p>
                    </div>
                )}

                {practiceMode === "multiple-choice" && (
                    <div className="result-summary">
                        <p>Aciertos: {choiceScore.correct}</p>
                        <p>Errores: {choiceScore.incorrect}</p>
                    </div>
                )}

                <button className="restart-button" onClick={resetPractice}>
                    Practicar otra vez
                </button>
            </section>
        );
    }

    return (
        <section className="flashcard-practice">
            <p>
                Tarjeta {index + 1} de {practiceCards.length}
            </p>

            {practiceMode === "flashcard" ? (
                <>
                    <div
                        className="flashcard"
                        onClick={() => setShowAnswer((prev) => !prev)}
                    >
                        {!showAnswer ? (
                            <h2>{currentCard.front}</h2>
                        ) : (
                            <div>
                                <h3>Pronunciación</h3>
                                <p>{currentCard.pronunciation}</p>

                                <h3>Significado</h3>
                                <p>{currentCard.meaning}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setShowAnswer(false);
                            setIndex((prev) => prev + 1);
                        }}
                    >
                        Siguiente
                    </button>
                </>
            ) : practiceMode === "written" ? (
                <div className="written-practice">
                    <div className="written-prompt">
                        <span>{writtenDirection === "es-to-jp" ? "Escribe en japonés" : "Escribe en español"}</span>
                        <strong>{promptText}</strong>
                        {writtenDirection === "jp-to-es" && (
                            <small>Pronunciación: {currentCard.pronunciation}</small>
                        )}
                    </div>

                    <label className="field-group">
                        Respuesta
                        <input
                            value={writtenAnswer}
                            onChange={(e) => setWrittenAnswer(e.target.value)}
                            disabled={isWrittenAnswerChecked}
                            autoFocus
                        />
                    </label>

                    {isWrittenAnswerChecked && (
                        <div className={isWrittenCorrect ? "answer-feedback correct" : "answer-feedback incorrect"}>
                            <p>{isWrittenCorrect ? "Correcto" : "Respuesta incorrecta"}</p>
                            <p>Respuesta esperada: {expectedAnswer}</p>
                        </div>
                    )}

                    <div className="practice-actions">
                        {!isWrittenAnswerChecked ? (
                            <button
                                onClick={() => {
                                    if (!writtenAnswer.trim()) return;
                                    setIsWrittenAnswerChecked(true);
                                    setWrittenScore((prev) => ({
                                        correct: prev.correct + (isWrittenCorrect ? 1 : 0),
                                        incorrect: prev.incorrect + (!isWrittenCorrect ? 1 : 0),
                                    }));
                                }}
                            >
                                Revisar
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setWrittenAnswer("");
                                    setIsWrittenAnswerChecked(false);
                                    setIndex((prev) => prev + 1);
                                }}
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="choice-practice">
                    <div className="written-prompt">
                        <span>
                            Escoge {choiceField === "meaning" ? "el significado" : "la pronunciación"}
                        </span>
                        <strong>{currentCard.front}</strong>
                    </div>

                    <div className="quiz-options">
                        {choiceOptions.map((option) => {
                            const isCorrect = normalizeAnswer(option) === normalizeAnswer(choiceAnswer);
                            const isSelected = selectedChoice === option;
                            let className = "quiz-option";

                            if (selectedChoice && isCorrect) className += " correct";
                            if (selectedChoice && isSelected && !isCorrect) className += " incorrect";

                            return (
                                <button
                                    key={option}
                                    className={className}
                                    disabled={Boolean(selectedChoice)}
                                    onClick={() => {
                                        if (selectedChoice) return;

                                        setSelectedChoice(option);
                                        setChoiceScore((score) => ({
                                            correct: score.correct + (isCorrect ? 1 : 0),
                                            incorrect: score.incorrect + (isCorrect ? 0 : 1),
                                        }));

                                        window.setTimeout(() => {
                                            setSelectedChoice(null);
                                            setIndex((currentIndex) => currentIndex + 1);
                                        }, 800);
                                    }}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
