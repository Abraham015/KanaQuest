import { CustomFlashcard } from "../../types/flashcards";
import FlashcardPractice from "./FlashcardPractice";

type Props = {
    cards: CustomFlashcard[];
    itemLabel: string;
    onBack: () => void;
};

export default function AllCardsPractice({ cards, itemLabel, onBack }: Props) {
    return (
        <>
            <div className="folder-detail-header all-cards-header">
                <button className="secondary-button" onClick={onBack}>
                    Volver
                </button>

                <div>
                    <h1>Todas las tarjetas</h1>
                    <p>{cards.length} {itemLabel}</p>
                </div>
            </div>

            <FlashcardPractice cards={cards} />
        </>
    );
}
