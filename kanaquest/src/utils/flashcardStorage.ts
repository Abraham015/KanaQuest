import { CustomFlashcard, FlashcardFolder, FlashcardType } from "../types/flashcards";
import { supabase } from "../lib/supabase";

const FOLDERS_KEY = "kanaquest-folders";
const FLASHCARDS_KEY = "kanaquest-flashcards";

type DbFolder = {
    id: string;
    type: FlashcardFolder["type"];
    name: string;
    created_at: string;
};

type DbFlashcard = {
    id: string;
    type: CustomFlashcard["type"];
    folder_id: string;
    front: string;
    pronunciation: string;
    meaning: string;
    created_at: string;
};

type LegacyFolder = Partial<FlashcardFolder> & {
    id?: string;
    name?: string;
    createdAt?: string;
};

type LegacyFlashcard = Partial<CustomFlashcard> & {
    id?: string;
    type?: FlashcardType;
    folderId?: string;
    kanji?: string;
    sentence?: string;
    word?: string;
    front?: string;
    pronunciation?: string;
    meaning?: string;
    createdAt?: string;
};

export type FlashcardData = {
    folders: FlashcardFolder[];
    cards: CustomFlashcard[];
};

export type FlashcardSyncState = "none" | "local-only" | "remote-only" | "out-of-sync" | "synced";

export function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) return error.message;

    if (error && typeof error === "object") {
        const supabaseError = error as {
            message?: string;
            details?: string;
            hint?: string;
            code?: string;
        };
        const parts = [
            supabaseError.message,
            supabaseError.details,
            supabaseError.hint,
            supabaseError.code ? `Codigo: ${supabaseError.code}` : undefined,
        ].filter(Boolean);

        if (parts.length) return parts.join(" ");
    }

    return fallback;
}

function mapFolderFromDb(folder: DbFolder): FlashcardFolder {
    return {
        id: folder.id,
        type: folder.type,
        name: folder.name,
        createdAt: folder.created_at,
    };
}

function mapCardFromDb(card: DbFlashcard): CustomFlashcard {
    return {
        id: card.id,
        type: card.type,
        folderId: card.folder_id,
        front: card.front,
        pronunciation: card.pronunciation,
        meaning: card.meaning,
        createdAt: card.created_at,
    };
}

function isFlashcardType(value: unknown): value is FlashcardType {
    return value === "kanji" || value === "sentence" || value === "vocabulary";
}

function getCardFront(card: LegacyFlashcard) {
    return card.front || card.kanji || card.sentence || card.word || "";
}

function normalizeLocalData(folders: LegacyFolder[], cards: LegacyFlashcard[]): FlashcardData {
    const normalizedCards = cards
        .filter((card) => card.id && card.folderId && isFlashcardType(card.type))
        .map((card) => ({
            id: card.id as string,
            type: card.type as FlashcardType,
            folderId: card.folderId as string,
            front: getCardFront(card),
            pronunciation: card.pronunciation || "",
            meaning: card.meaning || "",
            createdAt: card.createdAt || new Date().toISOString(),
        }))
        .filter((card) => card.front && card.pronunciation && card.meaning);

    const folderTypes = normalizedCards.reduce<Record<string, FlashcardType>>((acc, card) => {
        acc[card.folderId] = card.type;
        return acc;
    }, {});

    const normalizedFolders = folders
        .filter((folder) => folder.id && folder.name)
        .map((folder) => ({
            id: folder.id as string,
            type: isFlashcardType(folder.type) ? folder.type : folderTypes[folder.id as string] || "kanji",
            name: folder.name as string,
            createdAt: folder.createdAt || new Date().toISOString(),
        }));

    const folderIds = new Set(normalizedFolders.map((folder) => folder.id));

    return {
        folders: normalizedFolders,
        cards: normalizedCards.filter((card) => folderIds.has(card.folderId)),
    };
}

export function getFolders(): FlashcardFolder[] {
    return getLocalFlashcardData().folders;
}

export function saveFolders(folders: FlashcardFolder[]) {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function getFlashcards(): CustomFlashcard[] {
    return getLocalFlashcardData().cards;
}

export function saveFlashcards(cards: CustomFlashcard[]) {
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
}

export function getLocalFlashcardData(): FlashcardData {
    try {
        const folders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || "[]");
        const cards = JSON.parse(localStorage.getItem(FLASHCARDS_KEY) || "[]");

        return normalizeLocalData(folders, cards);
    } catch {
        return {
            folders: [],
            cards: [],
        };
    }
}

export function saveLocalFlashcardData(data: FlashcardData) {
    saveFolders(data.folders);
    saveFlashcards(data.cards);
}

export function clearLocalFlashcardData() {
    localStorage.removeItem(FOLDERS_KEY);
    localStorage.removeItem(FLASHCARDS_KEY);
}

function hasData(data: FlashcardData) {
    return data.folders.length > 0 || data.cards.length > 0;
}

function normalizeData(data: FlashcardData) {
    return JSON.stringify({
        folders: [...data.folders].sort((a, b) => a.id.localeCompare(b.id)),
        cards: [...data.cards].sort((a, b) => a.id.localeCompare(b.id)),
    });
}

function mergeFlashcardData(localData: FlashcardData, remoteData: FlashcardData): FlashcardData {
    const folders = new Map(remoteData.folders.map((folder) => [folder.id, folder]));
    const cards = new Map(remoteData.cards.map((card) => [card.id, card]));

    localData.folders.forEach((folder) => folders.set(folder.id, folder));
    localData.cards.forEach((card) => cards.set(card.id, card));

    const mergedFolders = Array.from(folders.values());
    const folderIds = new Set(mergedFolders.map((folder) => folder.id));

    return {
        folders: mergedFolders,
        cards: Array.from(cards.values()).filter((card) => folderIds.has(card.folderId)),
    };
}

function getSyncState(localData: FlashcardData, remoteData: FlashcardData): FlashcardSyncState {
    const hasLocal = hasData(localData);
    const hasRemote = hasData(remoteData);

    if (!hasLocal && !hasRemote) return "none";
    if (hasLocal && !hasRemote) return "local-only";
    if (!hasLocal && hasRemote) return "remote-only";
    if (normalizeData(localData) === normalizeData(remoteData)) return "synced";

    return "out-of-sync";
}

async function getCurrentUserId() {
    if (!supabase) {
        return null;
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user?.id || null;
}

export async function fetchRemoteFlashcardData(): Promise<FlashcardData> {
    if (!supabase) {
        return {
            folders: [],
            cards: [],
        };
    }

    const userId = await getCurrentUserId();

    if (!userId) {
        return {
            folders: [],
            cards: [],
        };
    }

    const [{ data: folders, error: foldersError }, { data: cards, error: cardsError }] =
        await Promise.all([
            supabase
                .from("flashcard_folders")
                .select("id,type,name,created_at")
                .order("created_at", { ascending: true }),
            supabase
                .from("flashcards")
                .select("id,type,folder_id,front,pronunciation,meaning,created_at")
                .order("created_at", { ascending: true }),
        ]);

    if (foldersError) throw foldersError;
    if (cardsError) throw cardsError;

    return {
        folders: (folders || []).map(mapFolderFromDb),
        cards: (cards || []).map(mapCardFromDb),
    };
}

export async function uploadLocalFlashcardData(data: FlashcardData) {
    if (!supabase) return;

    const userId = await getCurrentUserId();

    if (!userId) return;

    const folderRows = data.folders.map((folder) => ({
        id: folder.id,
        user_id: userId,
        type: folder.type,
        name: folder.name,
        created_at: folder.createdAt,
    }));

    const folderIds = new Set(data.folders.map((folder) => folder.id));
    const cardRows = data.cards
        .filter((card) => folderIds.has(card.folderId))
        .map((card) => ({
            id: card.id,
            user_id: userId,
            type: card.type,
            folder_id: card.folderId,
            front: card.front,
            pronunciation: card.pronunciation,
            meaning: card.meaning,
            created_at: card.createdAt,
        }));

    if (folderRows.length) {
        const { error } = await supabase.from("flashcard_folders").upsert(folderRows, {
            onConflict: "id",
        });
        if (error) throw error;
    }

    if (cardRows.length) {
        const { error } = await supabase.from("flashcards").upsert(cardRows, {
            onConflict: "id",
        });
        if (error) throw error;
    }
}

export async function loadRemoteFlashcardData() {
    const localData = getLocalFlashcardData();

    if (!supabase) {
        return {
            ...localData,
            isRemote: false,
            syncState: hasData(localData) ? "local-only" as FlashcardSyncState : "none" as FlashcardSyncState,
        };
    }

    const userId = await getCurrentUserId();

    if (!userId) {
        return {
            ...localData,
            isRemote: false,
            syncState: hasData(localData) ? "local-only" as FlashcardSyncState : "none" as FlashcardSyncState,
        };
    }

    const remoteData = await fetchRemoteFlashcardData();
    const syncState = getSyncState(localData, remoteData);

    if (syncState === "remote-only") {
        saveLocalFlashcardData(remoteData);

        return {
            ...remoteData,
            isRemote: true,
            syncState: "synced" as FlashcardSyncState,
        };
    }

    if (syncState === "local-only" || syncState === "out-of-sync") {
        const mergedData = mergeFlashcardData(localData, remoteData);

        await replaceRemoteFlashcardData(mergedData);
        saveLocalFlashcardData(mergedData);

        return {
            ...mergedData,
            isRemote: true,
            syncState: "synced" as FlashcardSyncState,
        };
    }

    saveLocalFlashcardData(remoteData);

    return {
        ...remoteData,
        isRemote: true,
        syncState,
    };
}

export async function replaceRemoteFlashcardData(data: FlashcardData) {
    if (!supabase) return;

    const userId = await getCurrentUserId();

    if (!userId) return;

    const { error: cardsDeleteError } = await supabase
        .from("flashcards")
        .delete()
        .eq("user_id", userId);

    if (cardsDeleteError) throw cardsDeleteError;

    const { error: foldersDeleteError } = await supabase
        .from("flashcard_folders")
        .delete()
        .eq("user_id", userId);

    if (foldersDeleteError) throw foldersDeleteError;

    await uploadLocalFlashcardData(data);
}

export async function createRemoteFolder(folder: FlashcardFolder) {
    if (!supabase) return;

    const userId = await getCurrentUserId();

    if (!userId) return;

    const { error } = await supabase.from("flashcard_folders").insert({
            id: folder.id,
            user_id: userId,
            type: folder.type,
            name: folder.name,
            created_at: folder.createdAt,
    });

    if (error) throw error;
}

export async function updateRemoteFolder(folder: FlashcardFolder) {
    if (!supabase) return;

    const { error } = await supabase
        .from("flashcard_folders")
        .update({
            name: folder.name,
        })
        .eq("id", folder.id);

    if (error) throw error;
}

export async function createRemoteFlashcard(card: CustomFlashcard) {
    if (!supabase) return;

    const userId = await getCurrentUserId();

    if (!userId) return;

    const { error } = await supabase.from("flashcards").insert({
        id: card.id,
        user_id: userId,
        type: card.type,
        folder_id: card.folderId,
        front: card.front,
        pronunciation: card.pronunciation,
        meaning: card.meaning,
        created_at: card.createdAt,
    });

    if (error) throw error;
}

export async function updateRemoteFlashcard(card: CustomFlashcard) {
    if (!supabase) return;

    const { error } = await supabase
        .from("flashcards")
        .update({
            folder_id: card.folderId,
            front: card.front,
            pronunciation: card.pronunciation,
            meaning: card.meaning,
        })
        .eq("id", card.id);

    if (error) throw error;
}

export async function deleteRemoteFlashcard(id: string) {
    if (!supabase) return;

    const { error } = await supabase.from("flashcards").delete().eq("id", id);

    if (error) throw error;
}

export async function deleteRemoteFolder(id: string) {
    if (!supabase) return;

    const { error } = await supabase.from("flashcard_folders").delete().eq("id", id);

    if (error) throw error;
}
