import { useState } from "react";
import { FlashcardFolder, FlashcardType } from "../../types/flashcards";

type Props = {
    folderType: FlashcardType;
    onAddFolder: (folder: FlashcardFolder) => void;
};

export default function FolderForm({ folderType, onAddFolder }: Props) {
    const [name, setName] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) return;

        onAddFolder({
            id: crypto.randomUUID(),
            type: folderType,
            name: name.trim(),
            createdAt: new Date().toISOString(),
        });

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
