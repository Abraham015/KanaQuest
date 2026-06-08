import { CustomFlashcard } from "../../types/flashcards";

type Props = {
    cards: CustomFlashcard[];
    onDeleteCard: (id: string) => void;
    onEditCard: (card: CustomFlashcard) => void;
};

const cardTypeLabels: Record<CustomFlashcard["type"], string> = {
    kanji: "Kanji",
    sentence: "Oracion",
    vocabulary: "Vocabulario",
};

export default function FlashcardList({ cards, onDeleteCard, onEditCard }: Props) {
    if (!cards.length) {
        return <p>No hay flashcards todavia.</p>;
    }

    return (
        <section className="custom-card-list">
            {cards.map((card) => (
                <article key={card.id} className="small-card">
                    <div className="small-card-header">
                        <span className="card-type">{cardTypeLabels[card.type]}</span>

                        <div className="small-card-actions">
                            <button
                                className="edit-card-button"
                                onClick={() => onEditCard(card)}
                            >
                                Editar
                            </button>
                            <button
                                className="delete-card-button"
                                onClick={() => onDeleteCard(card.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>

                    <h2>{card.front}</h2>

                    <dl className="flashcard-meta">
                        <div>
                            <dt>Pronunciacion</dt>
                            <dd>{card.pronunciation}</dd>
                        </div>

                        <div>
                            <dt>Significado</dt>
                            <dd>{card.meaning}</dd>
                        </div>
                    </dl>
                </article>
            ))}
        </section>
    );
}
