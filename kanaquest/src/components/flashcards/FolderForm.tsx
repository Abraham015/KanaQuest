import { useState } from "react";
import { FlashcardFolder, FlashcardType } from "../../types/flashcards";

type Props = {
    folderType: FlashcardType;
    onAddFolder: (folder: FlashcardFolder) => void | Promise<void>;
    editingFolder?: FlashcardFolder;
    onSaved?: () => void;
};

export default function FolderForm({
    folderType,
    onAddFolder,
    editingFolder,
    onSaved,
}: Props) {
    const [name, setName] = useState(editingFolder?.name || "");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) return;

        try {
            await onAddFolder({
                id: editingFolder?.id || crypto.randomUUID(),
                type: folderType,
                name: name.trim(),
                createdAt: editingFolder?.createdAt || new Date().toISOString(),
            });
        } catch {
            return;
        }

        if (!editingFolder) {
            setName("");
        }
        onSaved?.();
    }

    return (
        <form className="form-card" onSubmit={handleSubmit}>
            <h2>{editingFolder ? "Editar carpeta" : "Crear carpeta"}</h2>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. N5, Verbos, Frases útiles..."
            />

            <button>{editingFolder ? "Guardar cambios" : "Crear carpeta"}</button>
        </form>
    );
}
