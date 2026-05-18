import { FlashcardFolder } from "../../types/flashcards";

type Props = {
    folders: FlashcardFolder[];
    selectedFolderId: string;
    onChange: (folderId: string) => void;
    totalCards: number;
};

export default function FolderSelector({
    folders,
    selectedFolderId,
    onChange,
    totalCards,
}: Props) {
    return (
        <section className="folder-selector">
            <label>
                Carpeta:
                <select
                    value={selectedFolderId}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="all">Todas</option>

                    {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
            </label>

            <p>{totalCards} tarjetas</p>
        </section>
    );
}
