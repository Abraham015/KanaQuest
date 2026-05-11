import { useState } from "react";
import HiraganaPage from "./pages/HiraganaPage";
import KatakanaPage from "./pages/KatakanaPage";
import KanjiPage from "./pages/KanjiPage";
import "./App.css";

type Section = "hiragana" | "katakana" | "kanji";

export default function App() {
    const [section, setSection] = useState<Section>("hiragana");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleSectionChange(newSection: Section) {
        setSection(newSection);
        setIsMenuOpen(false);
    }

    return (
        <div className="app">
            <header className="app-header">
                <button
                    className="menu-button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                    ☰
                </button>

                <h1 className="app-title">KanaQuest</h1>
            </header>

            {isMenuOpen && (
                <nav className="side-menu">
                    <button onClick={() => handleSectionChange("hiragana")}>
                        Hiragana
                    </button>

                    <button onClick={() => handleSectionChange("katakana")}>
                        Katakana
                    </button>

                    <button onClick={() => handleSectionChange("kanji")}>
                        Kanji
                    </button>
                </nav>
            )}

            <main className="app-content">
                {section === "hiragana" && <HiraganaPage />}
                {section === "katakana" && <KatakanaPage />}
                {section === "kanji" && <KanjiPage />}
            </main>
        </div>
    );
}