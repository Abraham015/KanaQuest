import { useMemo, useState } from "react";
import { CustomFlashcard } from "../../types/flashcards";

type Props = {
    cards: CustomFlashcard[];
};

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function FlashcardPractice({ cards }: Props) {
    const [totalCards, setTotalCards] = useState(1);
    const [started, setStarted] = useState(false);
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const maxCards = cards.length;

    const practiceCards = useMemo(() => {
        if (!started) return [];
        return shuffleArray(cards).slice(0, totalCards);
    }, [cards, totalCards, started]);

    const currentCard = practiceCards[index];

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

                <p>Disponibles: {maxCards}</p>

                <button
                    onClick={() => {
                        setStarted(true);
                        setIndex(0);
                        setShowAnswer(false);
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

                <button
                    onClick={() => {
                        setStarted(false);
                        setIndex(0);
                        setShowAnswer(false);
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
        </section>
    );
}
