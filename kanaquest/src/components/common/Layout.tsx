import { ReactNode } from "react";
import Menu from "./Menu";
import GlobalSearch, { SearchResult } from "./GlobalSearch";
import AccountHeaderAction from "./AccountHeaderAction";
import { Section } from "../../types/navigation";

type Props = {
    children: ReactNode;
    isMenuOpen: boolean;
    currentSection: Section;
    searchTerm: string;
    searchResults: SearchResult[];
    onToggleMenu: () => void;
    onChangeSection: (section: Section) => void;
    onChangeSearch: (value: string) => void;
};

export default function Layout({
    children,
    isMenuOpen,
    currentSection,
    searchTerm,
    searchResults,
    onToggleMenu,
    onChangeSection,
    onChangeSearch,
}: Props) {
    return (
        <div className="app">
            <Menu
                isOpen={isMenuOpen}
                activeSection={currentSection}
                onChangeSection={onChangeSection}
            />

            {isMenuOpen && <button className="menu-backdrop" onClick={onToggleMenu} />}

            <header className="app-header">
                <button className="menu-button" onClick={onToggleMenu} aria-label="Abrir menu">
                    <span />
                    <span />
                    <span />
                </button>

                <h1 className="app-title">KanaQuest</h1>

                <GlobalSearch
                    value={searchTerm}
                    results={searchResults}
                    onChange={onChangeSearch}
                    onSelectResult={onChangeSection}
                />

                <AccountHeaderAction onChangeSection={onChangeSection} />
            </header>

            <main className="app-content">
                {children}
            </main>
        </div>
    );
}
