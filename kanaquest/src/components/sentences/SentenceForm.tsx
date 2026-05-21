import { useEffect, useState } from "react";
import { CustomFlashcard, FlashcardFolder } from "../../types/flashcards";

type Props = {
    folders: FlashcardFolder[];
    onAddCard: (card: CustomFlashcard) => void | Promise<void>;
    defaultFolderId?: string;
    editingCard?: CustomFlashcard;
    onSaved?: () => void;
};

export default function SentenceForm({
    folders,
    onAddCard,
    defaultFolderId = "",
    editingCard,
    onSaved,
}: Props) {
    const [folderId, setFolderId] = useState(editingCard?.folderId || defaultFolderId);
    const [sentence, setSentence] = useState(editingCard?.front || "");
    const [pronunciation, setPronunciation] = useState(editingCard?.pronunciation || "");
    const [meaning, setMeaning] = useState(editingCard?.meaning || "");

    useEffect(() => {
        setFolderId(editingCard?.folderId || defaultFolderId);
        setSentence(editingCard?.front || "");
        setPronunciation(editingCard?.pronunciation || "");
        setMeaning(editingCard?.meaning || "");
    }, [defaultFolderId, editingCard]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!folderId || !sentence.trim() || !pronunciation.trim() || !meaning.trim()) {
            return;
        }

        try {
            await onAddCard({
                id: editingCard?.id || crypto.randomUUID(),
                type: "sentence",
                folderId,
                front: sentence.trim(),
                pronunciation: pronunciation.trim(),
                meaning: meaning.trim(),
                createdAt: editingCard?.createdAt || new Date().toISOString(),
            });
        } catch {
            return;
        }

        setSentence("");
        setPronunciation("");
        setMeaning("");
        onSaved?.();
    }

    return (
        <form className="form-card" onSubmit={handleSubmit}>
            {!defaultFolderId && (
                <select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
                    <option value="">Selecciona carpeta</option>

                    {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
            )}

            <label className="field-group">
                Oracion
                <input
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    placeholder="Ej. 私は学生です"
                />
            </label>

            <label className="field-group">
                Pronunciacion
                <input
                    value={pronunciation}
                    onChange={(e) => setPronunciation(e.target.value)}
                    placeholder="Ej. watashi wa gakusei desu"
                />
            </label>

            <label className="field-group">
                Significado en espanol
                <input
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    placeholder="Ej. Soy estudiante"
                />
            </label>

            <button>{editingCard ? "Guardar cambios" : "Guardar oracion"}</button>
        </form>
    );
}
