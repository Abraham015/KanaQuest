import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AccountContextValue = {
    displayName: string | null;
    email: string | null;
    isConfigured: boolean;
    isLoading: boolean;
    isSignedIn: boolean;
    signIn: (email: string, password: string) => Promise<AccountActionResult>;
    signUp: (email: string, password: string, displayName: string) => Promise<AccountActionResult>;
    signOut: () => Promise<void>;
    updateDisplayName: (displayName: string) => Promise<AccountActionResult>;
    updateEmail: (email: string) => Promise<AccountActionResult>;
};

export type AccountActionResult = {
    ok: boolean;
    message?: string;
};

const AccountContext = createContext<AccountContextValue | null>(null);
const SESSION_ACTIVITY_KEY = "kanaquest-last-session-activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) return error.message;

    if (error && typeof error === "object" && "message" in error) {
        return String((error as { message?: unknown }).message || fallback);
    }

    return fallback;
}

function translateAuthMessage(message: string) {
    const normalized = message.toLowerCase();

    if (normalized.includes("invalid login credentials")) {
        return "El correo o la contrasena no son correctos.";
    }

    if (normalized.includes("email not confirmed")) {
        return "Necesitas confirmar tu correo antes de iniciar sesion.";
    }

    if (normalized.includes("user already registered") || normalized.includes("already registered")) {
        return "Ya existe una cuenta con ese correo.";
    }

    if (normalized.includes("password should be at least")) {
        return "La contrasena debe tener al menos 6 caracteres.";
    }

    if (normalized.includes("unable to validate email address") || normalized.includes("invalid email")) {
        return "Escribe un correo valido.";
    }

    if (normalized.includes("for security purposes")) {
        return "Por seguridad, espera un momento antes de intentar otra vez.";
    }

    return message || "Ocurrio un error inesperado.";
}

export function SupabaseAccountProvider({ children }: { children: ReactNode }) {
    const [email, setEmail] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadCachedSessionAccount = useCallback(async function loadCachedSessionAccount() {
        const {
            data: { session },
        } = await supabase!.auth.getSession();

        const user = session?.user;

        setEmail(user?.email || null);
        setDisplayName(
            typeof user?.user_metadata?.displayable_name === "string"
                ? user.user_metadata.displayable_name
                : user?.email?.split("@")[0] || null
        );
    }, []);

    const loadAccount = useCallback(async function loadAccount() {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setEmail(user?.email || null);

            if (!user) {
                setDisplayName(null);
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("displayable_name")
                .eq("id", user.id)
                .maybeSingle();

            if (error) throw error;

            const fallbackName =
                typeof user.user_metadata?.displayable_name === "string"
                    ? user.user_metadata.displayable_name
                    : user.email?.split("@")[0] || null;

            setDisplayName(data?.displayable_name || fallbackName);
        } catch (err) {
            console.error(getErrorMessage(err, "No se pudo cargar la cuenta."));

            try {
                await loadCachedSessionAccount();
            } catch (sessionErr) {
                console.error(getErrorMessage(sessionErr, "No se pudo cargar la sesion local."));
                setEmail(null);
                setDisplayName(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, [loadCachedSessionAccount]);

    useEffect(() => {
        loadAccount();

        const subscription = supabase?.auth.onAuthStateChange(() => {
            loadAccount();
        });

        return () => subscription?.data.subscription.unsubscribe();
    }, [loadAccount]);

    const signOut = useCallback(async function signOut() {
        await supabase?.auth.signOut();
        localStorage.removeItem(SESSION_ACTIVITY_KEY);
        setEmail(null);
        setDisplayName(null);
    }, []);

    useEffect(() => {
        if (!email || !supabase) return;

        let lastSavedActivity = 0;

        function saveActivity() {
            const now = Date.now();

            if (now - lastSavedActivity < 30_000) return;

            lastSavedActivity = now;
            localStorage.setItem(SESSION_ACTIVITY_KEY, String(now));
        }

        async function closeInactiveSession() {
            const lastActivity = Number(localStorage.getItem(SESSION_ACTIVITY_KEY));

            if (lastActivity && Date.now() - lastActivity >= SESSION_TIMEOUT_MS) {
                await signOut();
            }
        }

        const storedActivity = Number(localStorage.getItem(SESSION_ACTIVITY_KEY));

        if (!storedActivity) {
            saveActivity();
        } else {
            closeInactiveSession();
        }

        const activityEvents: Array<keyof WindowEventMap> = [
            "pointerdown",
            "keydown",
            "scroll",
            "touchstart",
        ];
        activityEvents.forEach((eventName) => window.addEventListener(eventName, saveActivity));
        const timeoutCheck = window.setInterval(closeInactiveSession, 60_000);

        return () => {
            activityEvents.forEach((eventName) => window.removeEventListener(eventName, saveActivity));
            window.clearInterval(timeoutCheck);
        };
    }, [email, signOut]);

    async function signIn(nextEmail: string, password: string): Promise<AccountActionResult> {
        if (!supabase) {
            return { ok: false, message: "Supabase no esta configurado." };
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: nextEmail.trim(),
            password,
        });

        if (error) {
            return {
                ok: false,
                message: translateAuthMessage(error.message),
            };
        }

        await loadAccount();
        return { ok: true };
    }

    async function signUp(
        nextEmail: string,
        password: string,
        nextDisplayName: string
    ): Promise<AccountActionResult> {
        if (!supabase) {
            return { ok: false, message: "Supabase no esta configurado." };
        }

        const { error } = await supabase.auth.signUp({
            email: nextEmail.trim(),
            password,
            options: {
                data: {
                    displayable_name: nextDisplayName.trim(),
                },
            },
        });

        if (error) {
            return {
                ok: false,
                message: translateAuthMessage(error.message),
            };
        }

        return {
            ok: true,
            message: "Revisa tu correo para confirmar la cuenta.",
        };
    }

    async function updateDisplayName(nextDisplayName: string): Promise<AccountActionResult> {
        if (!supabase) {
            return { ok: false, message: "Supabase no esta configurado." };
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { ok: false, message: "Inicia sesion para actualizar tu nombre." };
        }

        const { error } = await supabase.from("profiles").upsert({
            id: user.id,
            displayable_name: nextDisplayName.trim(),
        });

        if (error) {
            return {
                ok: false,
                message: translateAuthMessage(error.message),
            };
        }

        await supabase.auth.updateUser({
            data: {
                displayable_name: nextDisplayName.trim(),
            },
        });

        setDisplayName(nextDisplayName.trim());
        return { ok: true, message: "Nombre actualizado." };
    }

    async function updateEmail(nextEmail: string): Promise<AccountActionResult> {
        if (!supabase) {
            return { ok: false, message: "Supabase no esta configurado." };
        }

        const { error } = await supabase.auth.updateUser({
            email: nextEmail.trim(),
        });

        if (error) {
            return {
                ok: false,
                message: translateAuthMessage(error.message),
            };
        }

        return {
            ok: true,
            message: "Revisa tu correo para confirmar el cambio de email.",
        };
    }

    return (
        <AccountContext.Provider
            value={{
                displayName,
                email,
                isConfigured: isSupabaseConfigured,
                isLoading,
                isSignedIn: Boolean(email),
                signIn,
                signUp,
                signOut,
                updateDisplayName,
                updateEmail,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}

export function useSupabaseAccount() {
    const context = useContext(AccountContext);

    if (!context) {
        throw new Error("useSupabaseAccount must be used inside SupabaseAccountProvider");
    }

    return context;
}
