import { useMemo, useState } from "react";
import "./App.css";

import Layout from "./components/common/Layout";
import HiraganaPage from "./pages/HiraganaPage";
import KatakanaPage from "./pages/KatakanaPage";
import KanjiPage from "./pages/KanjiPage";
import SentencesPage from "./pages/SentencesPage";
import VocabularyPage from "./pages/VocabularyPage";
import { Section } from "./types/navigation";
import { getFlashcards } from "./utils/flashcardStorage";
import { getGlobalSearchResults } from "./utils/globalSearch";

export default function App() {
    const [section, setSection] = useState<Section>("hiragana");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const searchResults = useMemo(() => {
        return getGlobalSearchResults(searchTerm, getFlashcards());
    }, [searchTerm]);

    function handleChangeSection(newSection: Section) {
        setSection(newSection);
        setIsMenuOpen(false);
        setSearchTerm("");
    }

    return (
        <Layout
            isMenuOpen={isMenuOpen}
            currentSection={section}
            searchTerm={searchTerm}
            searchResults={searchResults}
            onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
            onChangeSection={handleChangeSection}
            onChangeSearch={setSearchTerm}
        >
            {section === "hiragana" && <HiraganaPage />}
            {section === "katakana" && <KatakanaPage />}
            {section === "kanji" && <KanjiPage />}
            {section === "sentences" && <SentencesPage />}
            {section === "vocabulary" && <VocabularyPage />}
        </Layout>
    );
}
