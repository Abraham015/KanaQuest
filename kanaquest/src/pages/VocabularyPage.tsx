import { useMemo, useState } from "react";
import Modal from "../components/common/Modal";
import VocabularyForm from "../components/vocabulary/VocabularyForm";
import FolderForm from "../components/flashcards/FolderForm";
import FolderGrid from "../components/flashcards/FolderGrid";
import FlashcardList from "../components/flashcards/FlashcardList";
import FlashcardPractice from "../components/flashcards/FlashcardPractice";
import { CustomFlashcard } from "../types/flashcards";
import { useFlashcardStore } from "../hooks/useFlashcardStore";

type Mode = "manage" | "practice";

export default function VocabularyPage() {
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

    const vocabularyCards = useMemo(() => {
        return cards.filter((card) => card.type === "vocabulary");
    }, [cards]);

    const vocabularyFolders = useMemo(() => {
        return folders.filter((folder) => folder.type === "vocabulary");
    }, [folders]);

    const selectedFolder = useMemo(() => {
        return vocabularyFolders.find((folder) => folder.id === selectedFolderId);
    }, [vocabularyFolders, selectedFolderId]);

    const selectedFolderCards = useMemo(() => {
        if (!selectedFolderId) return [];
        return vocabularyCards.filter((card) => card.folderId === selectedFolderId);
    }, [vocabularyCards, selectedFolderId]);

    if (!selectedFolderId || !selectedFolder) {
        return (
            <main className="page-container">
                <h1>Vocabulario</h1>
                <p>{isLoading ? "Cargando tarjetas..." : isRemote ? "Guardando en Supabase" : "Guardando localmente"}</p>
                {error && <p>{error}</p>}

                <FolderForm folderType="vocabulary" onAddFolder={addFolder} />

                <FolderGrid
                    folders={vocabularyFolders}
                    cards={vocabularyCards}
                    emptyText="Crea una carpeta para empezar a guardar vocabulario."
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
                    <p>{selectedFolderCards.length} vocabulario</p>
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
                <Modal
                    title="Agregar vocabulario"
                    onClose={() => setIsAddModalOpen(false)}
                >
                    <VocabularyForm
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
                <Modal
                    title="Editar vocabulario"
                    onClose={() => setEditingCard(null)}
                >
                    <VocabularyForm
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
