import { useState } from "react";
import { Folder } from "../../types/kanji";

type Props = {
    onAdd: (folder: Folder) => void;
};

export default function FolderForm({ onAdd }: Props) {
    const [name, setName] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) return;

        onAdd({
            id: crypto.randomUUID(),
            name,
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
                placeholder="Ej. Kanji N5, Comida, Verbos..."
            />

            <button>Crear carpeta</button>
        </form>
    );
}