import { useMemo, useState } from "react";
import { CustomFlashcard } from "../../types/flashcards";

type Props = {
    cards: CustomFlashcard[];
};

type PracticeMode = "flashcard" | "written";
type WrittenDirection = "jp-to-es" | "es-to-jp";

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

function normalizeAnswer(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
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

    if (!cards.length) {
        return <p>No hay flashcards disponibles para practicar.</p>;
    }

    if (!started) {
        return (
            <section className="practice-settings">
                <h2>Practicar flashcards</h2>

                <label>
                    Numero de tarjetas:
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
                    </select>
                </label>

                {practiceMode === "written" && (
                    <label>
                        Direccion:
                        <select
                            value={writtenDirection}
                            onChange={(e) => setWrittenDirection(e.target.value as WrittenDirection)}
                        >
                            <option value="es-to-jp">Espanol a japones</option>
                            <option value="jp-to-es">Japones a espanol</option>
                        </select>
                    </label>
                )}

                <p>Disponibles: {maxCards}</p>

                <button
                    onClick={() => {
                        setStarted(true);
                        setIndex(0);
                        setShowAnswer(false);
                        setWrittenAnswer("");
                        setIsWrittenAnswerChecked(false);
                        setWrittenScore({ correct: 0, incorrect: 0 });
                    }}
                >
                    Iniciar practica
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

                <button
                    onClick={() => {
                        setStarted(false);
                        setIndex(0);
                        setShowAnswer(false);
                        setWrittenAnswer("");
                        setIsWrittenAnswerChecked(false);
                        setWrittenScore({ correct: 0, incorrect: 0 });
                    }}
                >
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
                                <h3>Pronunciacion</h3>
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
            ) : (
                <div className="written-practice">
                    <div className="written-prompt">
                        <span>{writtenDirection === "es-to-jp" ? "Escribe en japones" : "Escribe en espanol"}</span>
                        <strong>{promptText}</strong>
                        {writtenDirection === "jp-to-es" && (
                            <small>Pronunciacion: {currentCard.pronunciation}</small>
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
            )}
        </section>
    );
}
