import { useState } from "react";
import { useFlashcardStore } from "../../hooks/useFlashcardStore";

export default function SyncBanner() {
    const {
        isRemote,
        isLoading,
        error,
        syncState,
        pullFromSupabase,
        pushLocalToSupabase,
    } = useFlashcardStore();
    const [isSyncing, setIsSyncing] = useState(false);

    if (!isRemote || syncState === "none" || syncState === "synced") {
        return null;
    }

    const message =
        syncState === "local-only"
            ? "Tienes datos guardados localmente que todavia no estan en Supabase."
            : "Hay diferencias entre tus datos locales y los datos de Supabase.";

    async function handlePull() {
        setIsSyncing(true);

        try {
            await pullFromSupabase();
        } catch {
            return;
        } finally {
            setIsSyncing(false);
        }
    }

    async function handlePush() {
        setIsSyncing(true);

        try {
            await pushLocalToSupabase();
        } catch {
            return;
        } finally {
            setIsSyncing(false);
        }
    }

    return (
        <section className="sync-banner">
            <p>{message}</p>

            <div className="sync-actions">
                <button type="button" onClick={handlePush} disabled={isLoading || isSyncing}>
                    Subir local a Supabase
                </button>
                <button type="button" onClick={handlePull} disabled={isLoading || isSyncing}>
                    Actualizar local desde Supabase
                </button>
            </div>

            {error && <small>{error}</small>}
        </section>
    );
}
