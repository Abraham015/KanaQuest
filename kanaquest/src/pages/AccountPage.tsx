import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSupabaseAccount } from "../hooks/useSupabaseAccount";
import { useFlashcardStore } from "../hooks/useFlashcardStore";

type AuthMode = "sign-in" | "sign-up";

export default function AccountPage() {
    const {
        displayName,
        email,
        isConfigured,
        isLoading,
        isSignedIn,
        signIn,
        signUp,
        signOut,
        updateDisplayName,
        updateEmail,
    } = useSupabaseAccount();
    const { cards, folders, isRemote } = useFlashcardStore();
    const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
    const [authEmail, setAuthEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [showSignUpOption, setShowSignUpOption] = useState(false);

    useEffect(() => {
        setName(displayName || "");
        setNewEmail(email || "");
    }, [displayName, email]);

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();

        if (!authEmail.trim() || !password) return;

        const result = await signIn(authEmail, password);

        if (!result.ok) {
            setShowSignUpOption(true);
            await Swal.fire({
                icon: "error",
                title: "No se pudo iniciar sesion",
                text: result.message,
                confirmButtonText: "Entendido",
            });
            return;
        }

        setShowSignUpOption(false);
        setPassword("");
    }

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();

        if (!authEmail.trim() || !password || !name.trim()) return;

        const result = await signUp(authEmail, password, name);

        await Swal.fire({
            icon: result.ok ? "success" : "error",
            title: result.ok ? "Cuenta creada" : "No se pudo crear la cuenta",
            text: result.message,
            confirmButtonText: "Entendido",
        });

        if (!result.ok) return;

        setAuthMode("sign-in");
        setShowSignUpOption(false);
        setPassword("");
    }

    async function handleDisplayName(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) return;

        const result = await updateDisplayName(name);

        await Swal.fire({
            icon: result.ok ? "success" : "error",
            title: result.ok ? "Nombre actualizado" : "No se pudo actualizar",
            text: result.message,
            confirmButtonText: "Entendido",
        });
    }

    async function handleEmail(e: React.FormEvent) {
        e.preventDefault();

        if (!newEmail.trim() || newEmail === email) return;

        const result = await updateEmail(newEmail);

        await Swal.fire({
            icon: result.ok ? "success" : "error",
            title: result.ok ? "Revisa tu correo" : "No se pudo cambiar el email",
            text: result.message,
            confirmButtonText: "Entendido",
        });
    }

    if (!isConfigured) {
        return (
            <main className="page-container">
                <section className="account-panel">
                    <h1>Cuenta</h1>
                    <p>Supabase no esta configurado.</p>
                </section>
            </main>
        );
    }

    if (!isSignedIn) {
        return (
            <main className="page-container account-page">
                <section className="account-panel">
                    <h1>{authMode === "sign-in" ? "Iniciar sesion" : "Crear cuenta"}</h1>
                    <p>
                        {authMode === "sign-in"
                            ? "Entra para sincronizar tus tarjetas."
                            : "Crea tu cuenta para guardar tus tarjetas en Supabase."}
                    </p>

                    <form
                        className="account-form"
                        onSubmit={authMode === "sign-in" ? handleSignIn : handleSignUp}
                    >
                        {authMode === "sign-up" && (
                            <label>
                                Nombre
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tu nombre"
                                />
                            </label>
                        )}

                        <label>
                            Email
                            <input
                                type="email"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                placeholder="tu@email.com"
                            />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </label>

                        <div className="account-actions">
                            <button type="submit" disabled={isLoading}>
                                {authMode === "sign-in" ? "Entrar" : "Crear cuenta"}
                            </button>

                            {authMode === "sign-in" && showSignUpOption && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthMode("sign-up");
                                        setShowSignUpOption(false);
                                    }}
                                    disabled={isLoading}
                                >
                                    Crear cuenta
                                </button>
                            )}

                            {authMode === "sign-up" && (
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => setAuthMode("sign-in")}
                                    disabled={isLoading}
                                >
                                    Ya tengo cuenta
                                </button>
                            )}
                        </div>
                    </form>
                </section>
            </main>
        );
    }

    return (
        <main className="page-container account-page">
            <section className="account-overview">
                <div>
                    <span className="account-kicker">Panel personal</span>
                    <h1>Tu cuenta</h1>
                    <p>Administra tu perfil y revisa cómo se guardan tus materiales.</p>
                </div>
                <div className="account-heading">
                    <button type="button" className="secondary-button" onClick={signOut}>
                        Cerrar sesión
                    </button>
                </div>
            </section>

            <section className="account-stats" aria-label="Resumen de cuenta">
                <article>
                    <span>Tarjetas</span>
                    <strong>{cards.length}</strong>
                    <small>Guardadas para practicar</small>
                </article>
                <article>
                    <span>Carpetas</span>
                    <strong>{folders.length}</strong>
                    <small>Colecciones organizadas</small>
                </article>
                <article>
                    <span>Sincronización</span>
                    <strong>{isRemote ? "Activa" : "Local"}</strong>
                    <small>{isRemote ? "Supabase conectado" : "Solo en este dispositivo"}</small>
                </article>
                <article>
                    <span>Seguridad</span>
                    <strong>30 min</strong>
                    <small>Cierre por inactividad</small>
                </article>
            </section>

            <section className="account-settings-grid">
                <div className="account-panel">
                    <h2>Perfil</h2>
                    <p>Este nombre se muestra en el botón de cuenta de la cabecera.</p>
                <form className="account-form" onSubmit={handleDisplayName}>
                    <label>
                        Nombre visible
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                        />
                    </label>

                    <button type="submit" disabled={isLoading}>
                        Guardar nombre
                    </button>
                </form>
                </div>

                <div className="account-panel">
                    <h2>Correo de acceso</h2>
                    <p>Supabase enviará una confirmación antes de aplicar el cambio.</p>
                <form className="account-form" onSubmit={handleEmail}>
                    <label>
                        Correo
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="nuevo@email.com"
                        />
                    </label>

                    <button type="submit" disabled={isLoading || newEmail === email}>
                        Cambiar email
                    </button>
                </form>
                </div>
            </section>

            <section className="account-panel account-security-note">
                <div>
                    <h2>Protección de tus datos</h2>
                    <p>
                        Tus tarjetas se sincronizan automáticamente al iniciar sesión. La sesión
                        se cierra tras 30 minutos sin actividad.
                    </p>
                </div>
                <span>Sesión protegida</span>
            </section>
        </main>
    );
}
