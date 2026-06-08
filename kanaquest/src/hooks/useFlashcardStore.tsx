import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CustomFlashcard, FlashcardFolder } from "../types/flashcards";
import { supabase } from "../lib/supabase";
import {
    createRemoteFlashcard,
    createRemoteFolder,
    deleteRemoteFlashcard,
    deleteRemoteFolder,
    getErrorMessage,
    getFlashcards,
    getFolders,
    loadRemoteFlashcardData,
    saveFlashcards,
    saveFolders,
    updateRemoteFlashcard,
    updateRemoteFolder,
} from "../utils/flashcardStorage";

type FlashcardStore = {
    folders: FlashcardFolder[];
    cards: CustomFlashcard[];
    isLoading: boolean;
    isRemote: boolean;
    error: string | null;
    addFolder: (folder: FlashcardFolder) => Promise<void>;
    updateFolder: (folder: FlashcardFolder) => Promise<void>;
    addCard: (card: CustomFlashcard) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;
    updateCard: (updatedCard: CustomFlashcard) => Promise<void>;
    deleteFolder: (folderId: string) => Promise<void>;
};

const FlashcardStoreContext = createContext<FlashcardStore | null>(null);

export function FlashcardStoreProvider({ children }: { children: ReactNode }) {
    const [folders, setFolders] = useState<FlashcardFolder[]>(() => getFolders());
    const [cards, setCards] = useState<CustomFlashcard[]>(() => getFlashcards());
    const [isLoading, setIsLoading] = useState(true);
    const [isRemote, setIsRemote] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        async function loadData() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await loadRemoteFlashcardData();

                if (!isActive) return;

                setFolders(data.folders);
                setCards(data.cards);
                setIsRemote(data.isRemote);

                if (!data.isRemote) {
                    saveFolders(data.folders);
                    saveFlashcards(data.cards);
                }
            } catch (err) {
                if (!isActive) return;

                setError(getErrorMessage(err, "No se pudo cargar Supabase."));
                setIsRemote(false);
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        const authSubscription = supabase?.auth.onAuthStateChange(() => {
            loadData();
        });

        return () => {
            isActive = false;
            authSubscription?.data.subscription.unsubscribe();
        };
    }, []);

    async function addFolder(folder: FlashcardFolder) {
        setError(null);

        try {
            if (isRemote) {
                await createRemoteFolder(folder);
            }

            const updatedFolders = [...folders, folder];
            setFolders(updatedFolders);
            saveFolders(updatedFolders);

        } catch (err) {
            setError(getErrorMessage(err, "No se pudo guardar la carpeta."));
            throw err;
        }
    }

    async function updateFolder(updatedFolder: FlashcardFolder) {
        setError(null);

        try {
            if (isRemote) {
                await updateRemoteFolder(updatedFolder);
            }

            const updatedFolders = folders.map((folder) =>
                folder.id === updatedFolder.id ? updatedFolder : folder
            );
            setFolders(updatedFolders);
            saveFolders(updatedFolders);

        } catch (err) {
            setError(getErrorMessage(err, "No se pudo actualizar la carpeta."));
            throw err;
        }
    }

    async function addCard(card: CustomFlashcard) {
        setError(null);

        try {
            if (isRemote) {
                await createRemoteFlashcard(card);
            }

            const updatedCards = [...cards, card];
            setCards(updatedCards);
            saveFlashcards(updatedCards);

        } catch (err) {
            setError(getErrorMessage(err, "No se pudo guardar la tarjeta."));
            throw err;
        }
    }

    async function deleteCard(id: string) {
        setError(null);

        try {
            if (isRemote) {
                await deleteRemoteFlashcard(id);
            }

            const updatedCards = cards.filter((card) => card.id !== id);
            setCards(updatedCards);
            saveFlashcards(updatedCards);

        } catch (err) {
            setError(getErrorMessage(err, "No se pudo eliminar la tarjeta."));
            throw err;
        }
    }

    async function updateCard(updatedCard: CustomFlashcard) {
        setError(null);

        try {
            if (isRemote) {
                await updateRemoteFlashcard(updatedCard);
            }

            const updatedCards = cards.map((card) =>
                card.id === updatedCard.id ? updatedCard : card
            );
            setCards(updatedCards);
            saveFlashcards(updatedCards);

        } catch (err) {
            setError(getErrorMessage(err, "No se pudo actualizar la tarjeta."));
            throw err;
        }
    }

    async function deleteFolder(folderId: string) {
        setError(null);

        try {
            if (isRemote) {
                await deleteRemoteFolder(folderId);
            }

            const updatedFolders = folders.filter((folder) => folder.id !== folderId);
            const updatedCards = cards.filter((card) => card.folderId !== folderId);

            setFolders(updatedFolders);
            setCards(updatedCards);
            saveFolders(updatedFolders);
            saveFlashcards(updatedCards);

        } catch (err) {
            setError(getErrorMessage(err, "No se pudo eliminar la carpeta."));
            throw err;
        }
    }

    const value = {
        folders,
        cards,
        isLoading,
        isRemote,
        error,
        addFolder,
        updateFolder,
        addCard,
        deleteCard,
        updateCard,
        deleteFolder,
    };

    return (
        <FlashcardStoreContext.Provider value={value}>
            {children}
        </FlashcardStoreContext.Provider>
    );
}

export function useFlashcardStore() {
    const store = useContext(FlashcardStoreContext);

    if (!store) {
        throw new Error("useFlashcardStore must be used inside FlashcardStoreProvider");
    }

    return store;
}
