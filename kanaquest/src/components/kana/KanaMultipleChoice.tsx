import { useMemo, useState } from "react";
import { KanaCard } from "../../types/study";

type Props = {
    cards: KanaCard[];
    totalQuestions: number;
};

type Mistake = {
    character: string;
    selectedAnswer: string;
    correctAnswer: string;
};

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function KanaMultipleChoice({
                                               cards,
                                               totalQuestions = 10,
                                           }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const [score, setScore] = useState({
        correct: 0,
        incorrect: 0,
    });

    const safeTotalQuestions = Math.min(totalQuestions, cards.length);

    const quizCards = useMemo(() => {
        return shuffleArray(cards).slice(0, safeTotalQuestions);
    }, [cards, safeTotalQuestions]);

    const [mistakes, setMistakes] = useState<Mistake[]>([]);

    const isFinished = currentIndex >= quizCards.length;
    const currentCard = quizCards[currentIndex];

    const options = useMemo(() => {
        if (!currentCard) return [];

        const wrongOptions = cards
            .filter((card) => card.romaji !== currentCard.romaji)
            .map((card) => card.romaji);

        return shuffleArray([
            currentCard.romaji,
            ...shuffleArray(wrongOptions).slice(0, 3),
        ]);
    }, [currentCard, cards]);

    function handleAnswer(answer: string) {
        if (selectedAnswer || !currentCard) return;

        const isCorrect = answer === currentCard.romaji;

        setSelectedAnswer(answer);

        setScore((prev) => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
        }));

        if (!isCorrect) {
            setMistakes((prev) => [
                ...prev,
                {
                    character: currentCard.character,
                    selectedAnswer: answer,
                    correctAnswer: currentCard.romaji,
                },
            ]);
        }

        setTimeout(() => {
            setSelectedAnswer(null);
            setCurrentIndex((prev) => prev + 1);
        }, 700);
    }

    function restartQuiz() {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScore({
            correct: 0,
            incorrect: 0,
        });
        setMistakes([]);
    }

    if (!cards.length) {
        return <p>No hay tarjetas disponibles.</p>;
    }

    if (isFinished) {
        return (
            <section className="quiz-result">
                <h2>Resultado final</h2>

                <div className="result-summary">
                    <p>Total de preguntas: {quizCards.length}</p>
                    <p>Aciertos: {score.correct}</p>
                    <p>Errores: {score.incorrect}</p>
                </div>

                {mistakes.length > 0 ? (
                    <div className="mistakes-list">
                        <h3>Errores</h3>

                        {mistakes.map((mistake, index) => (
                            <div key={`${mistake.character}-${index}`} className="mistake-card">
                                <strong>{mistake.character}</strong>
                                <p>Tu respuesta: {mistake.selectedAnswer}</p>
                                <p>Respuesta correcta: {mistake.correctAnswer}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>¡Perfecto! No tuviste errores 🎉</p>
                )}

                <button className="restart-button" onClick={restartQuiz}>
                    Reiniciar quiz
                </button>
            </section>
        );
    }

    return (
        <section className="quiz-container">
            <div className="quiz-score">
        <span>
          Pregunta {currentIndex + 1} de {quizCards.length}
        </span>
                <span>Aciertos: {score.correct}</span>
                <span>Errores: {score.incorrect}</span>
            </div>

            <div className="quiz-card">
                <div className="quiz-character">{currentCard.character}</div>
            </div>

            <div className="quiz-options">
                {options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === currentCard.romaji;

                    let className = "quiz-option";

                    if (selectedAnswer && isSelected && isCorrect) {
                        className += " correct";
                    }

                    if (selectedAnswer && isSelected && !isCorrect) {
                        className += " incorrect";
                    }

                    return (
                        <button
                            key={option}
                            className={className}
                            onClick={() => handleAnswer(option)}
                            disabled={!!selectedAnswer}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}