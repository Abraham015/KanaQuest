import { useState } from "react";
import { FlashcardFolder, FlashcardType } from "../../types/flashcards";

type Props = {
    folderType: FlashcardType;
    onAddFolder: (folder: FlashcardFolder) => void | Promise<void>;
};

export default function FolderForm({ folderType, onAddFolder }: Props) {
    const [name, setName] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) return;

        try {
            await onAddFolder({
                id: crypto.randomUUID(),
                type: folderType,
                name: name.trim(),
                createdAt: new Date().toISOString(),
            });
        } catch {
            return;
        }

        setName("");
    }

    return (
        <form className="form-card" onSubmit={handleSubmit}>
            <h2>Crear carpeta</h2>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. N5, Verbos, Frases útiles..."
            />

            <button>Crear carpeta</button>
        </form>
    );
}
