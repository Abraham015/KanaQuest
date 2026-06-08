import { Section } from "../../types/navigation";
import { useSupabaseAccount } from "../../hooks/useSupabaseAccount";

type Props = {
    onChangeSection: (section: Section) => void;
};

export default function AccountHeaderAction({ onChangeSection }: Props) {
    const { displayName, isConfigured, isLoading, isSignedIn, signOut } = useSupabaseAccount();

    if (!isConfigured) {
        return <span className="account-header-status">Supabase sin configurar</span>;
    }

    if (!isSignedIn) {
        return (
            <button
                type="button"
                className="account-header-button"
                onClick={() => onChangeSection("account")}
                disabled={isLoading}
            >
                Iniciar sesion
            </button>
        );
    }

    return (
        <div className="account-header">
            <button
                type="button"
                className="account-name-button"
                onClick={() => onChangeSection("account")}
            >
                {displayName || "Cuenta"}
            </button>
            <button
                type="button"
                className="account-header-button"
                onClick={signOut}
                disabled={isLoading}
            >
                Salir
            </button>
        </div>
    );
}
