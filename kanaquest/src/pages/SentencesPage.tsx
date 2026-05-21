import { useMemo, useState } from "react";
import Modal from "../components/common/Modal";
import SentenceForm from "../components/sentences/SentenceForm";
import FolderForm from "../components/flashcards/FolderForm";
import FolderGrid from "../components/flashcards/FolderGrid";
import FlashcardList from "../components/flashcards/FlashcardList";
import FlashcardPractice from "../components/flashcards/FlashcardPractice";
import { CustomFlashcard } from "../types/flashcards";
import { useFlashcardStore } from "../hooks/useFlashcardStore";

type Mode = "manage" | "practice";

export default function SentencesPage() {
    const {
        folders,
        cards,
        isLoading,
        isRemote,
        error,
        addFolder,
        addCard,
        deleteCard,
        updateCard,
        deleteFolder,
    } = useFlashcardStore();
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("manage");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<CustomFlashcard | null>(null);

    async function deleteSelectedFolder() {
        if (!selectedFolderId) return;

        await deleteFolder(selectedFolderId);
        setSelectedFolderId(null);
        setIsDeleteFolderModalOpen(false);
    }

    const sentenceCards = useMemo(() => {
        return cards.filter((card) => card.type === "sentence");
    }, [cards]);

    const sentenceFolders = useMemo(() => {
        return folders.filter((folder) => folder.type === "sentence");
    }, [folders]);

    const selectedFolder = useMemo(() => {
        return sentenceFolders.find((folder) => folder.id === selectedFolderId);
    }, [sentenceFolders, selectedFolderId]);

    const selectedFolderCards = useMemo(() => {
        if (!selectedFolderId) return [];
        return sentenceCards.filter((card) => card.folderId === selectedFolderId);
    }, [sentenceCards, selectedFolderId]);

    if (!selectedFolderId || !selectedFolder) {
        return (
            <main className="page-container">
                <h1>Oraciones</h1>
                <p>{isLoading ? "Cargando tarjetas..." : ""}</p>
                {error && <p>{error}</p>}

                <FolderForm folderType="sentence" onAddFolder={addFolder} />

                <FolderGrid
                    folders={sentenceFolders}
                    cards={sentenceCards}
                    emptyText="Crea una carpeta para empezar a guardar oraciones."
                    onSelectFolder={(folderId) => {
                        setSelectedFolderId(folderId);
                        setMode("manage");
                    }}
                />
            </main>
        );
    }

    return (
        <main className="page-container">
            <div className="folder-detail-header">
                <button
                    className="secondary-button"
                    onClick={() => setSelectedFolderId(null)}
                >
                    Volver
                </button>

                <div>
                    <h1>{selectedFolder.name}</h1>
                    <p>{selectedFolderCards.length} oraciones</p>
                </div>

                <div className="folder-actions">
                    <button
                        className="delete-folder-button"
                        onClick={() => setIsDeleteFolderModalOpen(true)}
                    >
                        Eliminar carpeta
                    </button>

                    <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
                        +
                    </button>
                </div>
            </div>

            <p>{isLoading ? "Cargando tarjetas..." : isRemote ? "Guardando en Supabase" : "Guardando localmente"}</p>
            {error && <p>{error}</p>}

            <div className="tabs">
                <button onClick={() => setMode("manage")}>Gestionar</button>
                <button onClick={() => setMode("practice")}>Practicar</button>
            </div>

            {mode === "manage" && (
                <FlashcardList
                    cards={selectedFolderCards}
                    onDeleteCard={deleteCard}
                    onEditCard={setEditingCard}
                />
            )}

            {mode === "practice" && <FlashcardPractice cards={selectedFolderCards} />}

            {isAddModalOpen && (
                <Modal title="Agregar oracion" onClose={() => setIsAddModalOpen(false)}>
                    <SentenceForm
                        folders={[selectedFolder]}
                        defaultFolderId={selectedFolder.id}
                        onAddCard={addCard}
                        onSaved={() => setIsAddModalOpen(false)}
                    />
                </Modal>
            )}

            {isDeleteFolderModalOpen && (
                <Modal
                    title="Eliminar carpeta"
                    onClose={() => setIsDeleteFolderModalOpen(false)}
                >
                    <div className="confirm-delete">
                        <p>
                            Se eliminara la carpeta "{selectedFolder.name}" y todas sus
                            flashcards.
                        </p>

                        <div className="confirm-actions">
                            <button
                                className="secondary-button"
                                onClick={() => setIsDeleteFolderModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="danger-button"
                                onClick={deleteSelectedFolder}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {editingCard && (
                <Modal title="Editar oracion" onClose={() => setEditingCard(null)}>
                    <SentenceForm
                        folders={[selectedFolder]}
                        defaultFolderId={selectedFolder.id}
                        editingCard={editingCard}
                        onAddCard={updateCard}
                        onSaved={() => setEditingCard(null)}
                    />
                </Modal>
            )}
        </main>
    );
}
