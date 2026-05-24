import { useEffect, useState } from "react";
import { CustomFlashcard, FlashcardFolder } from "../../types/flashcards";

type Props = {
    folders: FlashcardFolder[];
    onAddCard: (card: CustomFlashcard) => void | Promise<void>;
    defaultFolderId?: string;
    editingCard?: CustomFlashcard;
    onSaved?: () => void;
};

export default function KanjiForm({
    folders,
    onAddCard,
    defaultFolderId = "",
    editingCard,
    onSaved,
}: Props) {
    const [folderId, setFolderId] = useState(editingCard?.folderId || defaultFolderId);
    const [kanji, setKanji] = useState(editingCard?.front || "");
    const [pronunciation, setPronunciation] = useState(editingCard?.pronunciation || "");
    const [meaning, setMeaning] = useState(editingCard?.meaning || "");

    useEffect(() => {
        setFolderId(editingCard?.folderId || defaultFolderId);
        setKanji(editingCard?.front || "");
        setPronunciation(editingCard?.pronunciation || "");
        setMeaning(editingCard?.meaning || "");
    }, [defaultFolderId, editingCard]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!folderId || !kanji.trim() || !pronunciation.trim() || !meaning.trim()) {
            return;
        }

        try {
            await onAddCard({
                id: editingCard?.id || crypto.randomUUID(),
                type: "kanji",
                folderId,
                front: kanji.trim(),
                pronunciation: pronunciation.trim(),
                meaning: meaning.trim(),
                createdAt: editingCard?.createdAt || new Date().toISOString(),
            });
        } catch {
            return;
        }

        setKanji("");
        setPronunciation("");
        setMeaning("");
        onSaved?.();
    }

    return (
        <form className="form-card" onSubmit={handleSubmit}>
            {(!defaultFolderId || editingCard) && (
                <label className="field-group">
                    Carpeta
                <select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
                    <option value="">Selecciona carpeta</option>

                    {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
                </label>
            )}

            <label className="field-group">
                Kanji
                <input
                    value={kanji}
                    onChange={(e) => setKanji(e.target.value)}
                    placeholder="Ej. 水"
                />
            </label>

            <label className="field-group">
                Pronunciacion
                <input
                    value={pronunciation}
                    onChange={(e) => setPronunciation(e.target.value)}
                    placeholder="Ej. mizu"
                />
            </label>

            <label className="field-group">
                Significado en espanol
                <input
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    placeholder="Ej. agua"
                />
            </label>

            <button>{editingCard ? "Guardar cambios" : "Guardar kanji"}</button>
        </form>
    );
}
