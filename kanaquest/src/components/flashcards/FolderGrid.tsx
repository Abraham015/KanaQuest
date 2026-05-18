import { CustomFlashcard, FlashcardFolder } from "../../types/flashcards";

type Props = {
    folders: FlashcardFolder[];
    cards: CustomFlashcard[];
    emptyText: string;
    onSelectFolder: (folderId: string) => void;
};

export default function FolderGrid({
    folders,
    cards,
    emptyText,
    onSelectFolder,
}: Props) {
    if (!folders.length) {
        return <p className="empty-state">{emptyText}</p>;
    }

    return (
        <section className="folder-grid">
            {folders.map((folder) => {
                const folderCards = cards.filter((card) => card.folderId === folder.id);

                return (
                    <button
                        key={folder.id}
                        className="folder-card"
                        onClick={() => onSelectFolder(folder.id)}
                    >
                        <span>{folder.name}</span>
                        <small>{folderCards.length} tarjetas</small>
                    </button>
                );
            })}
        </section>
    );
}
