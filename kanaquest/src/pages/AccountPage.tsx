import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSupabaseAccount } from "../hooks/useSupabaseAccount";

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
            <section className="account-panel">
                <div className="account-heading">
                    <div>
                        <h1>{displayName || "Cuenta"}</h1>
                        <p>{email}</p>
                    </div>

                    <button type="button" className="secondary-button" onClick={signOut}>
                        Salir
                    </button>
                </div>

                <form className="account-form" onSubmit={handleDisplayName}>
                    <label>
                        Nombre
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

                <form className="account-form" onSubmit={handleEmail}>
                    <label>
                        Nuevo email
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
            </section>
        </main>
    );
}
